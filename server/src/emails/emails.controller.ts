import { Controller, Post, HttpCode } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { AlertItemDto } from '../alerts/dto/alert-item.dto';

@Controller('email')
export class EmailsController {
  constructor(private readonly emailService: EmailsService) {}

  /**
   * POST /api/email/test
   * Sends a single fake alert email to verify Resend is configured
   * correctly (API key, verified domain, EMAIL_FROM/EMAIL_TO).
   */
  @Post('test')
  @HttpCode(200)
  async sendTest() {
    const fakeAlert: AlertItemDto = {
      id: 0,
      ticker: 'TEST',
      pct_change: 12.34,
      price_start: 100,
      price_end: 112.34,
      date_start: new Date(Date.now() - 14 * 86400000),
      date_end: new Date(),
      direction: 'up',
      lookback_days: 14,
      threshold_pct: 8,
      news_headlines: [
        'This is a test headline to confirm formatting',
        'Resend is configured correctly if you are reading this',
      ],
      email_sent: false,
      triggered_at: new Date(),
    };

    const sent = await this.emailService.sendAlertEmail([fakeAlert]);

    return {
      sent,
      message: sent
        ? 'Test email sent — check your inbox.'
        : 'Email failed to send — check RESEND_API_KEY, EMAIL_FROM, and EMAIL_TO in your .env, and check the server logs for the error.',
    };
  }
}
