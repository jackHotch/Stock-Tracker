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
    <div className="flex items-center justify-between gap-3 p-3">
      <div className="flex min-w-0 flex-col md:flex-row md:items-baseline md:gap-2">
        <span className="font-bold">{item.ticker}</span>
        <span className="truncate text-xs">{item.name}</span>
      </div>

      <div className="flex shrink-0 items-center gap-3 md:gap-10">
        <div className="hidden w-24 md:block">
          <span className="border border-primary p-1 text-xs text-primary">{item.sector}</span>
        </div>
        <span className="w-20 text-right md:w-24">{formatCurrency(Number(stockPrice?.priceEnd))}</span>
        <span className={cn('w-20 text-right md:w-24', directionStyles)}>
          {formatPercentage(Number(stockPrice?.pctChange), true)}
        </span>
        <Button
          variant="outline"
          size="icon"
          aria-label={`Remove ${item.ticker}`}
          onClick={() => removeWatchlistItem(item.ticker)}
        >
          <X />
        </Button>
      </div>
    </div>
  )
}
