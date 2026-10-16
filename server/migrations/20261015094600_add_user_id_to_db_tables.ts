import { PoolClient } from 'pg';

// Postgres can't reposition a column, so to make user_id the second column
// each table is rebuilt: create a *_new table with the desired layout, copy
// the rows over (assigning them to user 1), drop the original, and rename
// the new table and its pkey/unique/sequence back to the original names.
export async function up(client: PoolClient): Promise<void> {
  await client.query(`
    CREATE TABLE watchlist_new (
      id         SERIAL PRIMARY KEY,
      user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      ticker     VARCHAR(10) NOT NULL,
      added_at   TIMESTAMP DEFAULT NOW(),
      name       VARCHAR(100),
      sector     VARCHAR(50),
      UNIQUE (user_id, ticker)
    );

    INSERT INTO watchlist_new (id, user_id, ticker, added_at, name, sector)
    SELECT id, 1, ticker, added_at, name, sector
    FROM watchlist;

    SELECT setval('watchlist_new_id_seq', COALESCE((SELECT MAX(id) FROM watchlist_new), 0) + 1, false);

    DROP TABLE watchlist;

    ALTER TABLE watchlist_new RENAME TO watchlist;
    ALTER INDEX watchlist_new_pkey RENAME TO watchlist_pkey;
    ALTER TABLE watchlist RENAME CONSTRAINT watchlist_new_user_id_ticker_key TO watchlist_user_id_ticker_key;
    ALTER TABLE watchlist RENAME CONSTRAINT watchlist_new_user_id_fkey TO watchlist_user_id_fkey;
    ALTER SEQUENCE watchlist_new_id_seq RENAME TO watchlist_id_seq;
  `);

  await client.query(`
    CREATE TABLE alerts_new (
      id              SERIAL PRIMARY KEY,
      user_id         INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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

    INSERT INTO alerts_new (
      id, user_id, ticker, pct_change, price_start, price_end, date_start, date_end,
      direction, lookback_days, threshold_pct, news_headlines, email_sent, triggered_at
    )
    SELECT
      id, 1, ticker, pct_change, price_start, price_end, date_start, date_end,
      direction, lookback_days, threshold_pct, news_headlines, email_sent, triggered_at
    FROM alerts;

    SELECT setval('alerts_new_id_seq', COALESCE((SELECT MAX(id) FROM alerts_new), 0) + 1, false);

    DROP TABLE alerts;

    ALTER TABLE alerts_new RENAME TO alerts;
    ALTER INDEX alerts_new_pkey RENAME TO alerts_pkey;
    ALTER TABLE alerts RENAME CONSTRAINT alerts_new_user_id_fkey TO alerts_user_id_fkey;
    ALTER SEQUENCE alerts_new_id_seq RENAME TO alerts_id_seq;

    CREATE INDEX alerts_user_id_idx ON alerts (user_id);
  `);
}

// Dropping the column leaves the remaining columns in their original order,
// so no rebuild is needed to undo. Dropping user_id also drops the
// (user_id, ticker) unique constraint, so the original one on ticker is
// restored.
export async function down(client: PoolClient): Promise<void> {
  await client.query(`
    ALTER TABLE watchlist DROP COLUMN user_id;
    ALTER TABLE watchlist ADD CONSTRAINT watchlist_ticker_key UNIQUE (ticker);
    ALTER TABLE alerts DROP COLUMN user_id;
  `);
}
