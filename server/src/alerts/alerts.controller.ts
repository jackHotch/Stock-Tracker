import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { FilterAlertsDto } from './dto/filter-alerts.dto';
import { UserId } from '../auth/decorators/user-id.decorator';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  findAll(@UserId() userId: number, @Query() filters: FilterAlertsDto) {
    return this.alertsService.findAll(userId, filters);
  }

  @Get('/:id')
  findOne(@UserId() userId: number, @Param('id') id: string) {
    return this.alertsService.findOne(userId, Number(id));
  }

  @Post()
  create(@UserId() userId: number, @Body() alert: CreateAlertDto) {
    return this.alertsService.create(userId, alert);
  }

  @Patch('/:id/email/sent')
  markEmailSent(@UserId() userId: number, @Param('id') id: string) {
    return this.alertsService.markEmailSent(userId, Number(id));
  }
}
