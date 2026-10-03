import { Controller, Get, Param, Query } from '@nestjs/common';
import { StocksService } from './stocks.service';

@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get('/search')
  search(@Query('q') q: string) {
    return q?.trim() ? this.stocksService.searchTickers(q.trim()) : [];
  }

  @Get('/:ticker/price/change')
  getPriceChange(@Param('ticker') ticker: string, @Query('days') days: string) {
    return this.stocksService.getPriceChange(ticker, days ? Number(days) : null);
  }

  @Get('/:ticker/news')
  getNews(@Param('ticker') ticker: string, @Query('maxItems') maxItems: string) {
    return this.stocksService.getNews(ticker, maxItems ? Number(maxItems) : undefined);
  }
}
