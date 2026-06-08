import { ConflictException, Injectable } from '@nestjs/common';
import { AddTickerDto } from './dto/add-ticker.dto';
import { WatchlistItem } from './dto/watchlist-item.dto';
import { DatabaseService } from 'src/db/db.service';

@Injectable()
export class WatchlistService {
  constructor(private db: DatabaseService) {}

  async create(item: AddTickerDto): Promise<WatchlistItem> {
    const existing = await this.findOne(item.ticker);

    if (existing) {
      throw new ConflictException(`${item.ticker} is already in the watchlist`);
    }

    const result = await this.db.query<WatchlistItem>(
      `
      INSERT INTO watchlist (ticker)
      VALUES ($1)
      RETURNING *;
      `,
      [item.ticker],
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
