import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../db/db.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

const SETTINGS_COLUMNS = ['emails_enabled', 'recipient_email_address', 'lookback_days', 'threshold_pct'] as const;

export interface UserSettings {
  id: number;
  email: string;
  emails_enabled: boolean;
  recipient_email_address: string | null;
  lookback_days: number | null;
  threshold_pct: string | null;
}

export interface AlertSettings {
  to: string;
  threshold: number;
  lookback: number;
}

@Injectable()
export class UserService {
  constructor(private readonly db: DatabaseService) {}

  getRecipient(user: UserSettings): string {
    return user.recipient_email_address ?? user.email;
  }

  getAlertSettings(user: UserSettings): AlertSettings | null {
    if (user.lookback_days == null || user.threshold_pct == null) return null;

    return {
      to: this.getRecipient(user),
      threshold: Number(user.threshold_pct),
      lookback: user.lookback_days,
    };
  }

  async findAll(): Promise<UserSettings[]> {
    const result = await this.db.query<UserSettings>(`
      SELECT id, email, emails_enabled, recipient_email_address, lookback_days, threshold_pct
      FROM users
      ORDER BY id ASC;
    `);

    return result.rows;
  }

  async findOne(id: number): Promise<UserSettings | undefined> {
    const result = await this.db.query<UserSettings>(
      `
      SELECT id, email, emails_enabled, recipient_email_address, lookback_days, threshold_pct
      FROM users
      WHERE id = $1;
      `,
      [id],
    );

    return result.rows[0];
  }

  async getSettings(userId: number): Promise<UserSettings | undefined> {
    const result = await this.db.query<UserSettings>(
      `
      SELECT id, email, emails_enabled, recipient_email_address, lookback_days, threshold_pct
      FROM users
      WHERE id = $1;
      `,
      [userId],
    );

    return result.rows[0];
  }

  async updateSettings(userId: number, settings: UpdateSettingsDto): Promise<UserSettings | undefined> {
    const columns = SETTINGS_COLUMNS.filter((column) => settings[column] !== undefined);
    if (columns.length === 0) return this.getSettings(userId);

    const assignments = columns.map((column, i) => `${column} = $${i + 2}`).join(', ');
    const values = columns.map((column) => settings[column]);

    const result = await this.db.query<UserSettings>(
      `
      UPDATE users
      SET ${assignments}
      WHERE id = $1
      RETURNING id, email, emails_enabled, recipient_email_address, lookback_days, threshold_pct;
      `,
      [userId, ...values],
    );

    return result.rows[0];
  }
}
