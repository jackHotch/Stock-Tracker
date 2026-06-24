import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { AlertItemDto } from '../alerts/dto/alert-item.dto';

@Injectable()
export class EmailsService {
  private readonly logger = new Logger(EmailsService.name);
  private resend?: Resend;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('RESEND_API_KEY');
    if (apiKey) {
      this.resend = new Resend(apiKey);
    }
  }

  async sendAlertEmail(alerts: AlertItemDto[]): Promise<boolean> {
    const from = this.config.get('EMAIL_FROM');
    const to = this.config.get('EMAIL_TO');
    const threshold = this.config.get('THRESHOLD_PCT', 8);
    const lookback = this.config.get('LOOKBACK_DAYS', 14);

    if (!from || !to || !this.resend) {
      this.logger.warn('Email credentials not configured — skipping email');
      return false;
    }

    const today = new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const sorted = [...alerts].sort(
      (a, b) => b.pct_change - a.pct_change,
    );

    const subject = `Stock Trend Alert — ${alerts.length} ticker(s) moved ±${threshold}%+ (${today})`;
    const html = this.buildHtml(
      sorted,
      today,
      Number(threshold),
      Number(lookback),
    );

    try {
      const { error } = await this.resend.emails.send({ from, to, subject, html });
      if (error) {
        this.logger.error(`Failed to send email: ${error.message}`);
        return false;
      }
      this.logger.log(`Alert email sent to ${to} (${alerts.length} alerts)`);
      return true;
    } catch (err: unknown) {
      this.logger.error(`Failed to send email: ${JSON.stringify(err)}`);
      return false;
    }
  }

  private formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  private buildHtml(
    alerts: AlertItemDto[],
    today: string,
    threshold: number,
    lookback: number,
  ): string {
    const blocks = alerts
      .map((a) => {
        const emoji = a.direction === 'up' ? '📈' : '📉';
        const color = a.direction === 'up' ? '#16a34a' : '#dc2626';
        const sign = a.direction === 'up' ? '+' : '';
        const newsItems = (a.news_headlines ?? [])
          .map((h: string) => `<li style="margin-bottom:4px;">${h}</li>`)
          .join('');
        const dateStart = this.formatDate(a.date_start);
        const dateEnd = this.formatDate(a.date_end);

        return `
        <div style="border:1px solid #e5e7eb;border-radius:8px;padding:20px;margin-bottom:20px;background:#fff;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
            <span style="font-size:28px;">${emoji}</span>
            <div>
              <h2 style="margin:0;font-size:22px;font-family:monospace;color:#111;">${a.ticker}</h2>
              <span style="font-size:20px;font-weight:700;color:${color};">${sign}${a.pct_change}%</span>
              <span style="color:#6b7280;font-size:13px;"> over ${lookback} days</span>
            </div>
          </div>
          <table style="width:100%;font-size:14px;color:#374151;margin-bottom:14px;">
            <tr>
              <td style="padding:4px 0;"><b>Start (${dateStart}):</b></td>
              <td>$${a.price_start}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;"><b>End (${dateEnd}):</b></td>
              <td>$${a.price_end}</td>
            </tr>
          </table>
          <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#6b7280;
             text-transform:uppercase;letter-spacing:.05em;">Recent News</p>
          <ul style="margin:0;padding-left:18px;font-size:14px;color:#374151;line-height:1.6;">
            ${newsItems || '<li>No headlines available</li>'}
          </ul>
        </div>`;
      })
      .join('');

    return `
      <html><body style="font-family:sans-serif;background:#f9fafb;padding:24px;color:#111;">
        <div style="max-width:640px;margin:0 auto;">
          <h1 style="font-size:20px;margin-bottom:4px;">📊 Stock Trend Alert</h1>
          <p style="color:#6b7280;font-size:14px;margin-top:0;">
            ${today} · ${lookback}-day window · threshold: ±${threshold}%
          </p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin-bottom:24px;">
          ${blocks}
          <p style="font-size:12px;color:#9ca3af;margin-top:24px;">
            Price data via Yahoo Finance · News via Yahoo Finance RSS
          </p>
        </div>
      </body></html>`;
  }
}
