import { useQueries } from '@tanstack/react-query'
import { apiGet, useApiQuery } from './use-api'

export interface StockItem {
  ticker: string
  pctChange: number
  priceStart: number
  priceEnd: number
  dateStart: string
  dateEnd: string
  direction: string
}

const stockKey = ['stock'] as const

const currentPriceUrl = (ticker: string) => `/stocks/${ticker}/price/change?days=2`

export function useCurrentStockPrice(ticker: string) {
  return useApiQuery<StockItem>([...stockKey, ticker], currentPriceUrl(ticker))
}

// Shares the same query keys as useCurrentStockPrice, so this reads from the same cache
export function useCurrentStockPrices(tickers: string[]) {
  return useQueries({
    queries: tickers.map((ticker) => ({
      queryKey: [...stockKey, ticker],
      queryFn: () => apiGet<StockItem>(currentPriceUrl(ticker)),
    })),
    combine: (results) =>
      Object.fromEntries(tickers.map((ticker, i) => [ticker, results[i].data])) as Record<
        string,
        StockItem | undefined
      >,
  })
}

export interface SearchResult {
  ticker: string
  name: string
  exchange: string
  type: string
  sector: string
}

export function useStockSearch(query: string) {
  return useApiQuery<SearchResult[]>([...stockKey, 'search', query], `/stocks/search?q=${encodeURIComponent(query)}`, {
    enabled: !!query,
    staleTime: 5 * 60_000,
  })
}
