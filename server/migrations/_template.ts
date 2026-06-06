import { PoolClient } from 'pg';

export async function up(client: PoolClient): Promise<void> {
  await client.query(`
    -- SQL to apply changes
  `);
}

export async function down(client: PoolClient): Promise<void> {
  await client.query(`
    -- SQL to undo changes
  `);
}
