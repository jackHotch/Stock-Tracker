import { useQueryClient } from "@tanstack/react-query"
import { apiPost, useApiMutation } from "./use-api"

export interface LoginResponse {
  access_token: string
}

const loginKey = ["authToken"] as const

export function useLogin() {
  const queryClient = useQueryClient()

  return useApiMutation<LoginResponse, { email: string; password: string }>(
    (body) =>
      apiPost<LoginResponse, { email: string; password: string }>(
        "/auth/login",
        body
      ),
    {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: loginKey }),
    }
  )
}
