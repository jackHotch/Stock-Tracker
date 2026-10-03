import { PoolClient } from 'pg';

export async function up(client: PoolClient): Promise<void> {
  await client.query(`
    ALTER TABLE users
    ADD COLUMN recipient_email_address varchar(200),
    ADD COLUMN lookback_days int,
    ADD COLUMN threshold_pct numeric(5,2);
  `);
}

export async function down(client: PoolClient): Promise<void> {
  await client.query(`
    ALTER TABLE users
    DROP COLUMN recipient_email_address,
    DROP COLUMN lookback_days,
    DROP COLUMN threshold_pct;
  `);
}
