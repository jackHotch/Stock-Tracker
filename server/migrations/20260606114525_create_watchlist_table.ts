import { PoolClient } from 'pg';

export async function up(client: PoolClient): Promise<void> {
  await client.query(`
    CREATE TABLE watchlist (
      id         SERIAL PRIMARY KEY,
      ticker     VARCHAR(10) UNIQUE NOT NULL,
      added_at   TIMESTAMP DEFAULT NOW()
    );
  `);
}

export async function down(client: PoolClient): Promise<void> {
  await client.query(`
    DROP TABLE IF EXISTS watchlist;
  `);
}
