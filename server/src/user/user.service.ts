import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../db/db.service';

export interface UserSettings {
  id: number;
  email: string;
  emails_enabled: boolean;
  recipient_email_address: string | null;
  lookback_days: number | null;
  threshold_pct: string | null; // numeric columns come back from pg as strings
}

export interface AlertSettings {
  to: string;
  threshold: number;
  lookback: number;
}

@Injectable()
export class UserService {
  constructor(private readonly db: DatabaseService) {}

  /**
   * The address alert emails go to, falling back to the user's login email.
   */
  getRecipient(user: UserSettings): string {
    return user.recipient_email_address ?? user.email;
  }

  /**
   * Resolves a user's alert settings, or null if they haven't set a
   * lookback window and threshold yet.
   */
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
}
