import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from 'src/db/db.service';
import { PriceData } from './types/types';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StocksService {
  private readonly logger = new Logger(StocksService.name);

  constructor(
    private db: DatabaseService,
    private readonly config: ConfigService,
  ) {}

  async getPriceChange(
    ticker: string,
    days: number | null,
  ): Promise<PriceData | null> {
    const lookbackDays = days ?? this.config.get<number>('LOOKBACK_DAYS', 14);
    try {
      const now = Math.floor(Date.now() / 1000);
      const from = now - lookbackDays * 86400;

      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}`;
      const { data } = await axios.get(url, {
        params: { period1: from, period2: now, interval: '1d' },
        // headers: { 'User-Agent': 'Mozilla/5.0' },
        timeout: 10000,
      });

      const result = data?.chart?.result?.[0];
      if (!result) {
        this.logger.warn(`[${ticker}] No chart data returned`);
        return null;
      }

      const timestamps: number[] = result.timestamp ?? [];
      const closes: number[] = result.indicators?.quote?.[0]?.close ?? [];

      const valid = timestamps
        .map((ts, i) => ({ ts, close: closes[i] }))
        .filter((d) => d.close != null);

      if (valid.length < 2) {
        this.logger.warn(
          `[${ticker}] Not enough data points (${valid.length})`,
        );
        return null;
      }
      const first = valid[0];
      const last = valid[valid.length - 1];

      const pctChange = ((last.close - first.close) / first.close) * 100;

      const fmt = (ts: number) =>
        new Date(ts * 1000).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });

      return {
        ticker,
        pctChange: Math.round(pctChange * 100) / 100,
        priceStart: Math.round(first.close * 100) / 100,
        priceEnd: Math.round(last.close * 100) / 100,
        dateStart: fmt(first.ts),
        dateEnd: fmt(last.ts),
        direction: pctChange >= 0 ? 'up' : 'down',
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.logger.error(`[${ticker}] Failed to fetch price: ${err.message}`);
        return null;
      }
      return null;
    }
  }

  async getNews(
    ticker: string,
    maxItems: number | null,
  ): Promise<string[] | null> {
    const maxNumItems = maxItems ?? 5;

    try {
      const url = `https://feeds.finance.yahoo.com/rss/2.0/headline?s=${ticker}&region=US&lang=en-US`;
      const { data } = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        timeout: 8000,
      });

      const headlines: string[] = [];
      const itemRegex = /<item>([\s\S]*?)<\/item>/g;
      const titleRegex =
        /<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/;
      const pubRegex = /<pubDate>(.*?)<\/pubDate>/;

      let match: RegExpExecArray | null;
      while (
        (match = itemRegex.exec(data)) !== null &&
        headlines.length < maxNumItems
      ) {
        const block = match[1];
        const titleMatch = titleRegex.exec(block);
        const pubMatch = pubRegex.exec(block);
        const title = (titleMatch?.[1] ?? titleMatch?.[2] ?? '').trim();
        const pub = (pubMatch?.[1] ?? '').substring(0, 16).trim();
        if (title) headlines.push(pub ? `${pub} — ${title}` : title);
      }

      return headlines;
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.logger.warn(`[${ticker}] Could not fetch news: ${err.message}`);
        return ['(News unavailable)'];
      }
      return null;
    }
  }
}
