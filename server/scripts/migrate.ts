import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { Pool, PoolClient } from 'pg';

dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });
if (!process.env.DATABASE_STRING) {
  dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
}
const MIGRATIONS_DIR = path.resolve(__dirname, '..', 'migrations');

interface MigrationModule {
  up(client: PoolClient): Promise<void>;
  down(client: PoolClient): Promise<void>;
}

function createPool(): Pool {
  return new Pool({ connectionString: process.env.DATABASE_STRING });
}

async function ensureMigrationsTable(client: PoolClient): Promise<void> {
  await client.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id    SERIAL      PRIMARY KEY,
      name  TEXT        NOT NULL UNIQUE,
      run_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

function getMigrationFiles(): string[] {
  if (!fs.existsSync(MIGRATIONS_DIR)) return [];
  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.ts') && !f.startsWith('_'))
    .sort();
}

async function getAppliedMigrations(
  client: PoolClient,
): Promise<{ name: string; run_at: Date }[]> {
  const { rows } = await client.query<{ name: string; run_at: Date }>(
    'SELECT name, run_at FROM migrations ORDER BY run_at ASC, name ASC',
  );
  return rows;
}

function loadMigration(name: string): MigrationModule {
  const file = path.join(MIGRATIONS_DIR, `${name}.ts`);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require(file) as MigrationModule;
}

async function runUp(pool: Pool): Promise<void> {
  const client = await pool.connect();
  try {
    await ensureMigrationsTable(client);
    const applied = await getAppliedMigrations(client);
    const appliedNames = new Set(applied.map((m) => m.name));
    const pending = getMigrationFiles()
      .map((f) => path.basename(f, '.ts'))
      .filter((name) => !appliedNames.has(name));

    if (pending.length === 0) {
      console.log('No pending migrations.');
      return;
    }

    for (const name of pending) {
      const migration = loadMigration(name);
      process.stdout.write(`  ↑  ${name} ... `);
      await client.query('BEGIN');
      try {
        await migration.up(client);
        await client.query('INSERT INTO migrations (name) VALUES ($1)', [name]);
        await client.query('COMMIT');
        console.log('done');
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      }
    }
  } finally {
    client.release();
  }
}

async function runDown(pool: Pool, targetName: string): Promise<void> {
  const client = await pool.connect();
  try {
    await ensureMigrationsTable(client);
    const applied = await getAppliedMigrations(client);
    const targetIndex = applied.findIndex((m) => m.name === targetName);

    if (targetIndex === -1) {
      throw new Error(`Migration "${targetName}" has not been applied.`);
    }

    // Roll back from newest down to (and including) the target
    const toUndo = applied.slice(targetIndex).reverse();

    for (const { name } of toUndo) {
      const migration = loadMigration(name);
      process.stdout.write(`  ↓  ${name} ... `);
      await client.query('BEGIN');
      try {
        await migration.down(client);
        await client.query('DELETE FROM migrations WHERE name = $1', [name]);
        await client.query('COMMIT');
        console.log('done');
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      }
    }
  } finally {
    client.release();
  }
}

async function main(): Promise<void> {
  const [command, arg] = process.argv.slice(2);
  const pool = createPool();

  try {
    if (command === 'up') {
      await runUp(pool);
    } else if (command === 'down') {
      if (!arg) {
        console.error('Usage: npm run migrate:rollback -- <migration-name>');
        process.exit(1);
      }
      await runDown(pool, path.basename(arg, '.ts'));
    } else {
      console.error('Usage: migrate <up|down> [migration-name]');
      process.exit(1);
    }
  } catch (err) {
    console.error('\nError:', (err as Error).message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

void main();
