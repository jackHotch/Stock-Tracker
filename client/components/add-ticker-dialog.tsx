'use client'

import { useState, type FormEvent } from 'react'
import { Check, Plus, SearchIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useStockSearch } from '@/hooks/use-stock'
import { useAddToWatchlist, useWatchlist } from '@/hooks/use-watchlist'

const TYPE_LABELS: Record<string, string> = {
  EQUITY: 'Stock',
  ETF: 'ETF',
  MUTUALFUND: 'Mutual Fund',
}

export const AddTickerDialog = () => {
  const [input, setInput] = useState('')
  const [submitted, setSubmitted] = useState('')

  const { data: watchlist = [] } = useWatchlist()
  const { data: results = [], isFetching, isError } = useStockSearch(submitted)
  const { mutate: addToWatchlist, isPending, variables, error } = useAddToWatchlist()

  const watchlistTickers = new Set(watchlist.map((item) => item.ticker))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(input.trim())
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setInput('')
      setSubmitted('')
    }
  }

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button data-icon="inline-start" size="lg" className="cursor-pointer" />}>
        <Plus />
        Add Ticker
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add a Ticker</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search by symbol or name"
            className="focus:outline-0"
            autoFocus
          />
          <Button type="submit" size="icon" disabled={!input.trim()} aria-label="Search">
            <SearchIcon />
          </Button>
        </form>

        {submitted && (
          <div className="max-h-96 divide-y overflow-y-auto border">
            {isFetching ? (
              <p className="p-3 text-center text-muted-foreground">Searching…</p>
            ) : isError ? (
              <p className="p-3 text-center text-danger">Search failed. Please try again.</p>
            ) : results.length === 0 ? (
              <p className="p-3 text-center text-muted-foreground">No results for &ldquo;{submitted}&rdquo;</p>
            ) : (
              results.map((result) => {
                const added = watchlistTickers.has(result.ticker)
                const adding = isPending && variables?.ticker === result.ticker

                return (
                  <div key={result.ticker} className="flex items-center justify-between gap-3 p-3">
                    <div className="min-w-0">
                      <div className="space-x-2">
                        <span className="font-bold">{result.ticker}</span>
                        <span className="text-xs">{result.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {[result.exchange, TYPE_LABELS[result.type] ?? result.type].filter(Boolean).join(' · ')}
                      </p>
                    </div>

                    {added ? (
                      <Button variant="outline" size="sm" data-icon="inline-start" disabled>
                        <Check />
                        Added
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        data-icon="inline-start"
                        disabled={adding}
                        onClick={() => addToWatchlist({ ticker: result.ticker })}
                      >
                        <Plus />
                        {adding ? 'Adding…' : 'Add'}
                      </Button>
                    )}
                  </div>
                )
              })
            )}
          </div>
        )}

        {error && <p className="text-danger">{error.response?.data?.message ?? 'Failed to add ticker'}</p>}
      </DialogContent>
    </Dialog>
  )
}
