export interface PriceData {
  ticker: string;
  pctChange: number;
  priceStart: number;
  priceEnd: number;
  dateStart: string;
  dateEnd: string;
  direction: 'up' | 'down';
}

export interface NewsItem {
  headline: string;
  pubDate: string;
}

export interface SearchResult {
  ticker: string;
  name: string;
  exchange: string;
  type: string;
  sector: string;
}
