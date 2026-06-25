import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { WatchlistService } from '../watchlist/watchlist.service';
import { StocksService } from '../stocks/stocks.service';
import { AlertsService } from '../alerts/alerts.service';
import { EmailsService } from '../emails/emails.service';
import { AlertItemDto } from '../alerts/dto/alert-item.dto';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private readonly watchlist: WatchlistService,
    private readonly stocks: StocksService,
    private readonly alerts: AlertsService,
    private readonly email: EmailsService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Runs every weekday at 7:00 PM ET by default.
   * Override with CRON_SCHEDULE env var.
   *
   * Note: @Cron() decorator requires a literal string — dynamic cron from env
   * requires CronJob from @nestjs/schedule. Both are shown; the decorator
   * version is active here. To use env-driven schedule, swap to the
   * onModuleInit pattern in the comment below.
   */
  @Cron('15 21 * * 1-5') // 4:15 PM EST = 21:15 UTC, Mon-Fri
  async runWatcher() {
    this.logger.log('⏰ Watcher triggered');
    await this.executeWatcher();
  }

  /**
   * Manually trigger a run — called by POST /api/scheduler/run
   */
  async executeWatcher(): Promise<{
    checked: number;
    triggered: number;
    emailSent: boolean;
  }> {
    const watchlist = await this.watchlist.findAll();
    const tickers = watchlist.map((item) => item.ticker);
    const threshold = this.config.get<number>('THRESHOLD_PCT', 8);
    const lookback = this.config.get<number>('LOOKBACK_DAYS', 14);

    this.logger.log(
      `Checking ${tickers.length} tickers (±${threshold}% / ${lookback}d)`,
    );

    const triggered: AlertItemDto[] = [];

    for (const ticker of tickers) {
      this.logger.log(`  → ${ticker}`);
      const price = await this.stocks.getPriceChange(ticker, lookback);

      if (!price) continue;

      this.logger.log(
        `    ${price.dateStart}→${price.dateEnd}: ${price.pctChange > 0 ? '+' : ''}${price.pctChange}%`,
      );

      if (Math.abs(price.pctChange) >= Number(threshold)) {
        this.logger.log(`    ✅ ALERT`);
        const headlines = await this.stocks.getNews(ticker);

        const alert = await this.alerts.create({
          ticker: price.ticker,
          pct_change: price.pctChange,
          price_start: price.priceStart,
          price_end: price.priceEnd,
          date_start: price.dateStart,
          date_end: price.dateEnd,
          direction: price.direction,
          lookback_days: lookback,
          threshold_pct: Number(threshold),
          news_headlines: headlines,
        });

        triggered.push(alert);
      }
    }

    let emailSent = false;

    if (triggered.length > 0) {
      emailSent = await this.email.sendAlertEmail(triggered);
      if (emailSent) {
        for (const alert of triggered) {
          await this.alerts.markEmailSent(alert.id);
        }
      }
    }

    this.logger.log(
      `Done. ${triggered.length} alert(s), email sent: ${emailSent}`,
    );
    return { checked: tickers.length, triggered: triggered.length, emailSent };
  }
}
