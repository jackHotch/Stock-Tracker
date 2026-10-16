import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { WatchlistService } from '../watchlist/watchlist.service';
import { StocksService } from '../stocks/stocks.service';
import { AlertsService } from '../alerts/alerts.service';
import { EmailsService } from '../emails/emails.service';
import { AlertSettings, UserService, UserSettings } from '../user/user.service';
import { AlertItemDto } from '../alerts/dto/alert-item.dto';

export interface WatcherResult {
  checked: number;
  triggered: number;
  emailSent: boolean;
}

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private readonly watchlist: WatchlistService,
    private readonly stocks: StocksService,
    private readonly alerts: AlertsService,
    private readonly email: EmailsService,
    private readonly users: UserService,
  ) {}

  /**
   * Runs every other day at 7:00 PM ET.
   * Override with CRON_SCHEDULE env var.
   *
   * Note: @Cron() decorator requires a literal string — dynamic cron from env
   * requires CronJob from @nestjs/schedule. Both are shown; the decorator
   * version is active here. To use env-driven schedule, swap to the
   * onModuleInit pattern in the comment below.
   *
   * Caveat: the day-of-month step resets at each month boundary, so months
   * with an odd number of days run on consecutive days once (e.g. the
   * 31st and the 1st) before returning to the every-other-day cadence.
   */
  @Cron('0 19 */2 * *', { timeZone: 'America/New_York' })
  async runWatcher() {
    this.logger.log('⏰ Watcher triggered');
    const users = await this.users.findAll();

    // One user's failure (e.g. a Yahoo timeout) shouldn't skip everyone after them.
    for (const user of users) {
      const settings = this.users.getAlertSettings(user);
      if (!settings) {
        this.logger.log(`Skipping user ${user.id}: lookback days and threshold not set`);
        continue;
      }

      try {
        await this.watchForUser(user, settings);
      } catch (err: unknown) {
        this.logger.error(`Watcher failed for user ${user.id}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  }

  /**
   * Manually trigger a run for one user — called by POST /api/scheduler/run
   */
  async executeWatcher(userId: number): Promise<WatcherResult> {
    const user = await this.users.findOne(userId);
    if (!user) throw new UnauthorizedException();

    const settings = this.users.getAlertSettings(user);
    if (!settings) {
      throw new BadRequestException('Set your lookback days and alert threshold in settings first');
    }

    return this.watchForUser(user, settings);
  }

  private async watchForUser(user: UserSettings, settings: AlertSettings): Promise<WatcherResult> {
    const watchlist = await this.watchlist.findAll(user.id);
    const tickers = watchlist.map((item) => item.ticker);
    const { threshold, lookback } = settings;

    this.logger.log(`User ${user.id}: checking ${tickers.length} tickers (±${threshold}% / ${lookback}d)`);

    const triggered: AlertItemDto[] = [];

    for (const ticker of tickers) {
      this.logger.log(`  → ${ticker}`);
      const price = await this.stocks.getPriceChange(ticker, lookback);

      if (!price) continue;

      this.logger.log(`    ${price.dateStart}→${price.dateEnd}: ${price.pctChange > 0 ? '+' : ''}${price.pctChange}%`);

      if (Math.abs(price.pctChange) >= threshold) {
        this.logger.log(`    ✅ ALERT`);
        const headlines = await this.stocks.getNews(ticker);

        const alert = await this.alerts.create(user.id, {
          ticker: price.ticker,
          pct_change: price.pctChange,
          price_start: price.priceStart,
          price_end: price.priceEnd,
          date_start: price.dateStart,
          date_end: price.dateEnd,
          direction: price.direction,
          lookback_days: lookback,
          threshold_pct: threshold,
          news_headlines: headlines,
        });

        triggered.push(alert);
      }
    }

    let emailSent = false;

    if (triggered.length > 0 && user.emails_enabled) {
      emailSent = await this.email.sendAlertEmail(triggered, settings);
      if (emailSent) {
        for (const alert of triggered) {
          await this.alerts.markEmailSent(user.id, alert.id);
        }
      }
    }

    this.logger.log(`User ${user.id} done. ${triggered.length} alert(s), email sent: ${emailSent}`);
    return { checked: tickers.length, triggered: triggered.length, emailSent };
  }
}
