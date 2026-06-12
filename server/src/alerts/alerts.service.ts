import { Injectable } from '@nestjs/common';
import { CreateAlertDto } from './dto/create-alert.dto';
import { FilterAlertsDto } from './dto/filter-alerts.dto';
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
        news_headlines
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
        alert.news_headlines ? JSON.stringify(alert.news_headlines) : null,
      ],
    );

    return result.rows[0];
  }

  async findAll(filters: FilterAlertsDto): Promise<AlertItemDto[]> {
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (filters.ticker) {
      params.push(filters.ticker);
      conditions.push(`ticker = $${params.length}`);
    }
    if (filters.direction) {
      params.push(filters.direction);
      conditions.push(`direction = $${params.length}`);
    }
    if (filters.date_start_from) {
      params.push(filters.date_start_from);
      conditions.push(`date_start >= $${params.length}`);
    }
    if (filters.date_start_to) {
      params.push(filters.date_start_to);
      conditions.push(`date_start <= $${params.length}`);
    }
    if (filters.date_end_from) {
      params.push(filters.date_end_from);
      conditions.push(`date_end >= $${params.length}`);
    }
    if (filters.date_end_to) {
      params.push(filters.date_end_to);
      conditions.push(`date_end <= $${params.length}`);
    }
    if (filters.pct_change_min !== undefined) {
      params.push(Number(filters.pct_change_min));
      conditions.push(`pct_change >= $${params.length}`);
    }
    if (filters.pct_change_max !== undefined) {
      params.push(Number(filters.pct_change_max));
      conditions.push(`pct_change <= $${params.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await this.db.query<AlertItemDto>(
      `SELECT
        id,
        ticker,
        pct_change,
        price_start,
        price_end,
        date_start,
        date_end,
        direction,
        lookback_days,
        threshold_pct,
        news_headlines,
        email_sent,
        triggered_at
      FROM alerts ${where}`,
      params,
    );

    return result.rows;
  }

  async findOne(id: number): Promise<AlertItemDto> {
    const result = await this.db.query<AlertItemDto>(
      `
      SELECT 
        id,
        ticker,
        pct_change,
        price_start,
        price_end,
        date_start,
        date_end,
        direction,
        lookback_days,
        threshold_pct, 
        news_headlines,
        email_sent,
        triggered_at
      FROM alerts
      WHERE id = $1`,
      [id],
    );

    return result.rows[0];
  }

  async markEmailSent(id: number): Promise<void> {
    await this.db.query(
      `
      UPDATE alerts
      SET email_sent = true
      WHERE id = $1`,
      [id],
    );
  }
}
