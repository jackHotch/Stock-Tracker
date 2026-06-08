import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { AddTickerDto } from './dto/add-ticker.dto';

@Controller('watchlist')
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Get()
  findAll() {
    return this.watchlistService.findAll();
  }

  @Get('/:ticker')
  findOne(@Param('ticker') ticker: string) {
    return this.watchlistService.findOne(ticker);
  }

  @Post()
  create(@Body() body: AddTickerDto) {
    return this.watchlistService.create(body);
  }

  @Delete('/:ticker')
  @HttpCode(204)
  remove(@Param('ticker') ticker: string) {
    return this.watchlistService.remove(ticker);
  }
}
