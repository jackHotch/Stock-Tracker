import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerService } from './scheduler.service';
import { SchedulerController } from './scheduler.controller';
import { WatchlistModule } from '../watchlist/watchlist.module';
import { StocksModule } from '../stocks/stocks.module';
import { AlertsModule } from '../alerts/alerts.module';
import { EmailsModule } from '../emails/emails.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [ScheduleModule.forRoot(), WatchlistModule, StocksModule, AlertsModule, EmailsModule, UserModule],
  providers: [SchedulerService],
  controllers: [SchedulerController],
})
export class SchedulerModule {}
