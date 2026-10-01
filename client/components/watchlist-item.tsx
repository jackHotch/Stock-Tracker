import { useCurrentStockPrice } from '@/hooks/use-stock'
import { WatchlistItem as IWatchlistItem, useRemoveFromWatchlist } from '@/hooks/use-watchlist'
import { Button } from './ui/button'
import { X } from 'lucide-react'
import { cn, formatCurrency, formatPercentage } from '@/lib/utils'

interface WatchlistItemProps {
  item: IWatchlistItem
}

export const WatchlistItem = ({ item }: WatchlistItemProps) => {
  const { data: stockPrice } = useCurrentStockPrice(item.ticker)
  const { mutate: removeWatchlistItem } = useRemoveFromWatchlist()
  const directionStyles =
    stockPrice?.direction == 'up' ? 'text-success' : stockPrice?.direction == 'down' ? 'text-danger' : ''

  return (
    <div className="flex items-center justify-between p-3">
      <div className="space-x-2">
        <span className="font-bold">{item.ticker}</span>
        <span className="text-xs">{item.name}</span>
      </div>

      <div className="flex items-center gap-10">
        <div className="w-24">
          <span className="border border-primary p-1 text-xs text-primary">{item.sector}</span>
        </div>
        <span className="w-24 text-right">{formatCurrency(Number(stockPrice?.priceEnd))}</span>
        <span className={cn('w-24 text-right', directionStyles)}>
          {formatPercentage(Number(stockPrice?.pctChange), true)}
        </span>
        <Button variant="outline" size="icon" onClick={() => removeWatchlistItem(item.ticker)}>
          <X />
        </Button>
      </div>
    </div>
  )
}
