import { useQueryClient } from '@tanstack/react-query'
import { apiPatch, useApiMutation, useApiQuery } from './use-api'

export interface UserSettings {
  id: number
  email: string
  emails_enabled: boolean
  recipient_email_address: string | null
  lookback_days: number | null
  threshold_pct: string | null
}

export interface UpdateUserSettings {
  emails_enabled?: boolean
  recipient_email_address?: string | null
  lookback_days?: number | null
  threshold_pct?: number | null
}

const userKey = ['user'] as const

export function useUserSettings() {
  return useApiQuery<UserSettings>(userKey, '/user/settings')
}

export function useUpdateUserSettings() {
  const queryClient = useQueryClient()

  return useApiMutation<UserSettings, UpdateUserSettings>(
    (body) => apiPatch<UserSettings, UpdateUserSettings>('/user/settings', body),
    {
      onSuccess: (settings) => queryClient.setQueryData(userKey, settings),
    }
  )
}
