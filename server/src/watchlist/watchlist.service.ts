import { Injectable } from '@nestjs/common';
import { AddTickerDto } from './dto/add-ticker.dto';
import { WatchlistItem } from './dto/watchlist-item.dto';

@Injectable()
export class WatchlistService {
  async create(item: AddTickerDto): Promise<WatchlistItem> {}
}
