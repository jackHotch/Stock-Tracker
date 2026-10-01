'use client'

import { Button } from '@/components/ui/button'
import { WatchlistItem } from '@/components/watchlist-item'
import { useWatchlist } from '@/hooks/use-watchlist'
import { Plus } from 'lucide-react'

export default function Watchlist() {
  const { data: watchlist } = useWatchlist()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p>Add, remove, and reorder the tickers you track</p>
        <Button data-icon="inline-start" size="lg">
          <Plus />
          Add Ticker
        </Button>
      </div>

      <div className="corner-marks divide-y border">
        {watchlist?.map((item, key) => {
          return <WatchlistItem item={item} key={key} />
        })}
      </div>
    </div>
  )
}
