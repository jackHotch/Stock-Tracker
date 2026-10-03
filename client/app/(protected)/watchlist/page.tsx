'use client'

import { useState } from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { WatchlistItem } from '@/components/watchlist-item'
import { useWatchlist, type WatchlistItem as IWatchlistItem } from '@/hooks/use-watchlist'
import { useCurrentStockPrices, type StockItem } from '@/hooks/use-stock'
import { cn } from '@/lib/utils'
import { AddTickerDialog } from '@/components/add-ticker-dialog'

type SortKey = 'ticker' | 'sector' | 'price' | 'pctChange'
type SortDir = 'asc' | 'desc'
interface Sort {
  key: SortKey
  dir: SortDir
}

const ALL_SECTORS = 'all'

function getSortValue(item: IWatchlistItem, price: StockItem | undefined, key: SortKey) {
  switch (key) {
    case 'ticker':
      return item.ticker
    case 'sector':
      return item.sector
    case 'price':
      return price ? Number(price.priceEnd) : undefined
    case 'pctChange':
      return price ? Number(price.pctChange) : undefined
  }
}

export default function Watchlist() {
  const { data: watchlist = [] } = useWatchlist()
  const prices = useCurrentStockPrices(watchlist.map((item) => item.ticker))

  const [search, setSearch] = useState('')
  const [sector, setSector] = useState(ALL_SECTORS)
  const [sort, setSort] = useState<Sort>({ key: 'ticker', dir: 'asc' })

  const sectors = [...new Set(watchlist.map((item) => item.sector).filter(Boolean))].sort()

  const query = search.trim().toLowerCase()
  const rows = watchlist
    .filter((item) => sector === ALL_SECTORS || item.sector === sector)
    .filter((item) => !query || item.ticker.toLowerCase().includes(query) || item.name?.toLowerCase().includes(query))
    .sort((a, b) => {
      const av = getSortValue(a, prices[a.ticker], sort.key)
      const bv = getSortValue(b, prices[b.ticker], sort.key)

      if (av == null || Number.isNaN(av)) return bv == null || Number.isNaN(bv) ? 0 : 1
      if (bv == null || Number.isNaN(bv)) return -1

      const cmp = typeof av === 'string' ? av.localeCompare(bv as string) : av - (bv as number)
      return sort.dir === 'asc' ? cmp : -cmp
    })

  const handleSort = (key: SortKey) => {
    setSort((prev) => {
      if (prev.key === key) return { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
      return { key, dir: key === 'price' || key === 'pctChange' ? 'desc' : 'asc' }
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p>Add, remove, and reorder the tickers you track</p>
        <AddTickerDialog />
      </div>

      <div className="flex items-center gap-2">
        <div className="relative w-64">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ticker or name"
            className="pl-8"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" size="lg" data-icon="inline-end" />}>
            {sector === ALL_SECTORS ? 'All sectors' : sector}
            <ChevronDown />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup value={sector} onValueChange={setSector}>
              <DropdownMenuRadioItem value={ALL_SECTORS}>All sectors</DropdownMenuRadioItem>
              <DropdownMenuSeparator />
              {sectors.map((s) => (
                <DropdownMenuRadioItem key={s} value={s}>
                  {s}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="corner-marks divide-y border">
        <div className="flex items-center justify-between p-3">
          <SortButton label="Ticker" sortKey="ticker" sort={sort} onSort={handleSort} />
          <div className="flex items-center gap-10">
            <SortButton label="Sector" sortKey="sector" sort={sort} onSort={handleSort} className="w-24" />
            <SortButton label="Price" sortKey="price" sort={sort} onSort={handleSort} className="w-24 justify-end" />
            <SortButton
              label="% Change"
              sortKey="pctChange"
              sort={sort}
              onSort={handleSort}
              className="w-24 justify-end"
            />
            <div className="size-8" />
          </div>
        </div>

        {rows.map((item) => (
          <WatchlistItem item={item} key={item.id} />
        ))}

        {watchlist.length > 0 && rows.length === 0 && (
          <p className="p-3 text-center text-sm text-muted-foreground">No tickers match your filters</p>
        )}
      </div>
    </div>
  )
}

interface SortButtonProps {
  label: string
  sortKey: SortKey
  sort: Sort
  onSort: (key: SortKey) => void
  className?: string
}

function SortButton({ label, sortKey, sort, onSort, className }: SortButtonProps) {
  const active = sort.key === sortKey
  const Icon = !active ? ArrowUpDown : sort.dir === 'asc' ? ArrowUp : ArrowDown

  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      className={cn(
        'flex cursor-pointer items-center gap-1 text-xs text-muted-foreground uppercase hover:text-foreground',
        active && 'text-foreground',
        className
      )}
    >
      {label}
      <Icon className={cn('size-3', !active && 'opacity-50')} />
    </button>
  )
}
