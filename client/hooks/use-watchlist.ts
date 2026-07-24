import { useQueryClient } from "@tanstack/react-query"
import { apiDelete, apiPost, useApiMutation, useApiQuery } from "@/hooks/use-api"

export interface WatchlistItem {
  id: number
  ticker: string
  added_at: string
}

const watchlistKey = ["watchlist"] as const

export function useWatchlist() {
  return useApiQuery<WatchlistItem[]>(watchlistKey, "/watchlist")
}

export function useAddToWatchlist() {
  const queryClient = useQueryClient()

  return useApiMutation<WatchlistItem, { ticker: string }>(
    (body) => apiPost<WatchlistItem, { ticker: string }>("/watchlist", body),
    {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: watchlistKey }),
    },
  )
}

export function useRemoveFromWatchlist() {
  const queryClient = useQueryClient()

  return useApiMutation<void, string>((ticker) => apiDelete(`/watchlist/${ticker}`), {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: watchlistKey }),
  })
}
