import { ConflictException, Injectable } from '@nestjs/common';
import { AddTickerDto } from './dto/add-ticker.dto';
import { WatchlistItem } from './dto/watchlist-item.dto';
import { DatabaseService } from 'src/db/db.service';
import axios from 'axios';
import { getSector } from 'src/stocks/stocks.service';

@Injectable()
export class WatchlistService {
  constructor(private db: DatabaseService) {}

  async create(userId: number, item: AddTickerDto): Promise<WatchlistItem> {
    const existing = await this.findOne(userId, item.ticker);

    if (existing) {
      throw new ConflictException(`${item.ticker} is already in the watchlist`);
    }

    const url = 'https://query1.finance.yahoo.com/v1/finance/search';
    const { data } = await axios.get(url, {
      params: { q: item.ticker, quotesCount: 1, newsCount: 0 },
      timeout: 10000,
    });

    const name = data.quotes[0].longname ?? '';
    const sector = getSector(data.quotes[0]);

    const result = await this.db.query<WatchlistItem>(
      `
      INSERT INTO watchlist (user_id, ticker, name, sector)
      VALUES ($1, $2, $3, $4)
      RETURNING id, ticker, name, sector, added_at;
      `,
      [userId, item.ticker, name, sector],
    );

    return result.rows[0];
  }

  async findOne(userId: number, ticker: string): Promise<WatchlistItem> {
    const result = await this.db.query<WatchlistItem>(
      `
      SELECT id, ticker, name, sector, added_at
      FROM watchlist
      WHERE user_id = $1 AND ticker = $2;
    `,
      [userId, ticker],
    );

    return result.rows[0];
  }

  async findAll(userId: number): Promise<WatchlistItem[]> {
    const result = await this.db.query<WatchlistItem>(
      `
      SELECT id, ticker, name, sector, added_at
      FROM watchlist
      WHERE user_id = $1
      ORDER BY ticker ASC;
      `,
      [userId],
    );

    return result.rows;
  }

  async remove(userId: number, ticker: string): Promise<void> {
    const existing = await this.findOne(userId, ticker);

    if (!existing) {
      throw new ConflictException(`${ticker} is not in the watchlist`);
    }

    await this.db.query(
      `
      DELETE FROM watchlist
      WHERE user_id = $1 AND ticker = $2`,
      [userId, ticker],
    );
  }
}
