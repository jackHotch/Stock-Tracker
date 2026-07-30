import { ConflictException, Injectable } from '@nestjs/common';
import { AddTickerDto } from './dto/add-ticker.dto';
import { WatchlistItem } from './dto/watchlist-item.dto';
import { DatabaseService } from 'src/db/db.service';
import axios from 'axios';

@Injectable()
export class WatchlistService {
  constructor(private db: DatabaseService) {}

  async create(item: AddTickerDto): Promise<WatchlistItem> {
    const existing = await this.findOne(item.ticker);

    if (existing) {
      throw new ConflictException(`${item.ticker} is already in the watchlist`);
    }

    const url = 'https://query1.finance.yahoo.com/v1/finance/search';
    const { data } = await axios.get(url, {
      params: { q: item.ticker, quotesCount: 1, newsCount: 0 },
      timeout: 10000,
    });

    console.log(data);

    const name = data.quotes[0].longname ?? '';
    const sector = data.quotes[0].sector || 'ETF';

    const result = await this.db.query<WatchlistItem>(
      `
      INSERT INTO watchlist (ticker, name, sector)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
      [item.ticker, name, sector],
    );

    return result.rows[0];
  }

  async findOne(ticker: string): Promise<WatchlistItem> {
    const result = await this.db.query<WatchlistItem>(
      `
      SELECT id, ticker, added_at
      FROM watchlist
      WHERE ticker = $1;
    `,
      [ticker],
    );

    return result.rows[0];
  }

  async findAll(): Promise<WatchlistItem[]> {
    const result = await this.db.query<WatchlistItem>(`
      SELECT id, ticker, added_at
      FROM watchlist
      ORDER BY ticker ASC;
      `);

    return result.rows;
  }

  async remove(ticker: string): Promise<void> {
    const existing = await this.findOne(ticker);

    if (!existing) {
      throw new ConflictException(`${ticker} is already in the watchlist`);
    }

    await this.db.query(
      `
      DELETE FROM watchlist
      WHERE ticker = $1`,
      [ticker],
    );
  }
}
