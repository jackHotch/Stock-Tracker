import { PoolClient } from 'pg';

export async function up(client: PoolClient): Promise<void> {
  await client.query(`
    ALTER TABLE watchlist
    ADD COLUMN name varchar(100),
    ADD COLUMN sector varchar(50);
  `);
}

export async function down(client: PoolClient): Promise<void> {
  await client.query(`
    ALTER TABLE watchlist
    DROP COLUMN name,
    DROP COLUMN sector;
  `);
}
