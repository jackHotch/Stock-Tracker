import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { FilterAlertsDto } from './dto/filter-alerts.dto';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  findAll(@Query() filters: FilterAlertsDto) {
    return this.alertsService.findAll(filters);
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.alertsService.findOne(Number(id));
  }

  @Post()
  create(@Body() alert: CreateAlertDto) {
    return this.alertsService.create(alert);
  }

  @Patch('/:id/email/sent')
  markEmailSent(@Param('id') id: string) {
    return this.alertsService.markEmailSent(Number(id));
  }
}
