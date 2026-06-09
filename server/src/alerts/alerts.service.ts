import { Injectable } from '@nestjs/common';
import { CreateAlertDto } from './dto/create-alert.dto';
import { AlertItemDto } from './dto/alert-item.dto';
import { DatabaseService } from 'src/db/db.service';

@Injectable()
export class AlertsService {
  constructor(private db: DatabaseService) {}

  async create(alert: CreateAlertDto): Promise<AlertItemDto> {
    const result = await this.db.query<AlertItemDto>(
      `
      INSERT INTO alerts (
        ticker,
        pct_change,
        price_start,
        price_end,
        date_start,
        date_end,
        direction,
        lookback_days,
        threshold_pct, 
        news_headline
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
      `,
      [
        alert.ticker,
        alert.pct_change,
        alert.price_start,
        alert.price_end,
        alert.date_start,
        alert.date_end,
        alert.direction,
        alert.lookback_days,
        alert.threshold_pct,
        alert.news_headlines,
      ],
    );

    return result.rows[0];
  }
}
