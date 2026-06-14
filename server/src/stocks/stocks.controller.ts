import { Controller, Get, Param, Query } from '@nestjs/common';
import { StocksService } from './stocks.service';

@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get('/:ticker/price/change')
  getPriceChange(@Param('ticker') ticker: string, @Query('days') days: string) {
    return this.stocksService.getPriceChange(
      ticker,
      days ? Number(days) : null,
    );
  }
}
