import { Body, Controller, Delete, Get, HttpCode, Param, Post } from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { AddTickerDto } from './dto/add-ticker.dto';
import { UserId } from '../auth/decorators/user-id.decorator';

@Controller('watchlist')
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Get()
  findAll(@UserId() userId: number) {
    return this.watchlistService.findAll(userId);
  }

  @Get('/:ticker')
  findOne(@UserId() userId: number, @Param('ticker') ticker: string) {
    return this.watchlistService.findOne(userId, ticker);
  }

  @Post()
  create(@UserId() userId: number, @Body() body: AddTickerDto) {
    return this.watchlistService.create(userId, body);
  }

  @Delete('/:ticker')
  @HttpCode(204)
  remove(@UserId() userId: number, @Param('ticker') ticker: string) {
    return this.watchlistService.remove(userId, ticker);
  }
}
