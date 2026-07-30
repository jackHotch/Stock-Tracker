import * as path from 'path';
import * as dotenv from 'dotenv';
import { Pool } from 'pg';
import axios from 'axios';

dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env.local') });
if (!process.env.DATABASE_STRING) {
  dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });
}

function createDatabaseConnection(): Pool {
  return new Pool({ connectionString: process.env.DATABASE_STRING });
}

async function getNameAndSector(ticker: string): Promise<{ name: string; sector: string }> {
  const url = 'https://query1.finance.yahoo.com/v1/finance/search';
  const { data } = await axios.get(url, {
    params: { q: ticker, quotesCount: 1, newsCount: 0 },
    timeout: 10000,
  });

  const name = data.quotes[0].longname ?? '';
  const sector = data.quotes[0].sector || 'ETF';

  return {
    name,
    sector,
  };
}

async function updateWatchlistItem(db: Pool, ticker: string, name: string, sector: string) {
  await db.query(
    `
    UPDATE watchlist
    SET name = $1,
    sector = $2
    WHERE ticker = $3;
    `,
    [name, sector, ticker],
  );
}

async function updateItems() {
  const db = createDatabaseConnection();
  console.log('Database connection created!');

  const { rows: watchlistItems } = await db.query(`
    SELECT ticker 
    FROM watchlist`);

  for (const item of watchlistItems) {
    let info: { name: string; sector: string };
    try {
      info = await getNameAndSector(item.ticker);
    } catch (err) {
      console.error('Error fetch name and sector from yahoo:', err);
      continue;
    }

    try {
      updateWatchlistItem(db, item.ticker, info.name, info.sector);
      console.log(`Updated ticker ${item.ticker} successfully`);
    } catch (err) {
      console.error(`Error updating watchlist item ${item.ticker}:`, err);
      continue;
    }
  }

  db.end();
}

updateItems().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
