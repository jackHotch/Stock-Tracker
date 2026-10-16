import { Controller, Post } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { UserId } from '../auth/decorators/user-id.decorator';

@Controller('scheduler')
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @Post('run')
  run(@UserId() userId: number) {
    return this.schedulerService.executeWatcher(userId);
  }
}
