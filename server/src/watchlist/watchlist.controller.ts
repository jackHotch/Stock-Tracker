import { Body, Controller, Post } from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { AddTickerDto } from './dto/add-ticker.dto';
import { WatchlistItem } from './dto/watchlist-item.dto';

@Controller('watchlist')
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Post()
  create(@Body() body: AddTickerDto) {
    return this.watchlistService.create(body);
  }
}
