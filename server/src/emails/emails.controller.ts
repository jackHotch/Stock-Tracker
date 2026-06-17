import { Controller, Post, HttpCode } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { Alert } from '../alerts/types/alert.type';

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
    const fakeAlert: Alert = {
      id: 0,
      ticker: 'TEST',
      pctChange: 12.34,
      priceStart: 100,
      priceEnd: 112.34,
      dateStart: new Date(Date.now() - 14 * 86400000),
      dateEnd: new Date(),
      direction: 'up',
      lookbackDays: 14,
      thresholdPct: 8,
      newsHeadlines: [
        'This is a test headline to confirm formatting',
        'Resend is configured correctly if you are reading this',
      ],
      emailSent: false,
      triggeredAt: new Date(),
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
