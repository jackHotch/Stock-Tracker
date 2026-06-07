import { PoolClient } from 'pg';

export async function up(client: PoolClient): Promise<void> {
  await client.query(`
    CREATE TABLE alerts (
      id              SERIAL PRIMARY KEY,
      ticker          VARCHAR(10) NOT NULL,
      pct_change      FLOAT NOT NULL,
      price_start     FLOAT NOT NULL,
      price_end       FLOAT NOT NULL,
      date_start      DATE NOT NULL,
      date_end        DATE NOT NULL,
      direction       VARCHAR(4) NOT NULL,  -- 'up' or 'down'
      lookback_days   INT NOT NULL,
      threshold_pct   FLOAT NOT NULL,
      news_headlines  JSON,
      email_sent      BOOLEAN DEFAULT FALSE,
      triggered_at    TIMESTAMP DEFAULT NOW()
    );
  `);
}

export async function down(client: PoolClient): Promise<void> {
  await client.query(`
    DROP TABLE IF EXISTS alerts;
  `);
}
