/**
 * Alert
 * -----
 * Plain interface matching the `alerts` table. No ORM — used purely for
 * typing query results from the `pg` driver.
 *
 * Table schema: see alerts.sql
 */
export interface Alert {
  id: number;
  ticker: string;
  pctChange: number;
  priceStart: number;
  priceEnd: number;
  dateStart: Date;
  dateEnd: Date;
  direction: 'up' | 'down';
  lookbackDays: number;
  thresholdPct: number;
  newsHeadlines: string[] | null;
  emailSent: boolean;
  triggeredAt: Date;
}

/**
 * Shape used when inserting a new alert — everything except
 * id, emailSent, and triggeredAt, which the DB fills in.
 */
export type NewAlert = Omit<Alert, 'id' | 'emailSent' | 'triggeredAt'>;
