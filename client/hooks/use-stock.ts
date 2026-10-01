import { useApiQuery } from './use-api'

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

export function useCurrentStockPrice(ticker: string) {
  return useApiQuery<StockItem>([...stockKey, ticker], `/stocks/${ticker}/price/change?days=2`)
}
