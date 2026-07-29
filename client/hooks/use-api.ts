import { useMutation, useQuery, type UseMutationOptions, type UseQueryOptions } from '@tanstack/react-query'
import type { AxiosError, AxiosRequestConfig } from 'axios'
import { apiClient } from '@/lib/api-client'

export type ApiError = AxiosError<{ message?: string }>

export function apiGet<T>(url: string, config?: AxiosRequestConfig) {
  return apiClient.get<T>(url, config).then((res) => res.data)
}

export function apiPost<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) {
  return apiClient.post<T>(url, data, config).then((res) => res.data)
}

export function apiPut<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) {
  return apiClient.put<T>(url, data, config).then((res) => res.data)
}

export function apiPatch<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) {
  return apiClient.patch<T>(url, data, config).then((res) => res.data)
}

export function apiDelete<T = void>(url: string, config?: AxiosRequestConfig) {
  return apiClient.delete<T>(url, config).then((res) => res.data)
}

export function useApiQuery<T>(
  queryKey: readonly unknown[],
  url: string,
  options?: Omit<UseQueryOptions<T, ApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<T, ApiError>({
    queryKey,
    queryFn: () => apiGet<T>(url),
    ...options,
  })
}

export function useApiMutation<T, V = unknown>(
  mutationFn: (variables: V) => Promise<T>,
  options?: UseMutationOptions<T, ApiError, V>
) {
  return useMutation<T, ApiError, V>({
    mutationFn,
    ...options,
  })
}
