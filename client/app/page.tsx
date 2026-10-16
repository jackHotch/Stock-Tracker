'use client'

import { ContainerWithMarks } from '@/components/container-with-marks'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { ApiError } from '@/hooks/use-api'
import { useLogin } from '@/hooks/use-login'
import { setAuthToken } from '@/lib/api-client'
import { useQueryClient } from '@tanstack/react-query'
import { TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Login() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { mutate: login, isPending, error, reset } = useLogin()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const errorMessage = getLoginErrorMessage(error)

  const handleLogin = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    login(
      { email, password },
      {
        onSuccess: (data) => {
          // Data is per-user now, so drop anything cached under a previous session
          queryClient.clear()
          setAuthToken(data.access_token)
          router.push('/dashboard')
        },
      }
    )
  }

  return (
    <div className="flex min-h-dvh flex-col gap-10 p-4 md:gap-12 md:p-6">
      <Logo size="large" />
      <form onSubmit={handleLogin}>
        <ContainerWithMarks className="flex w-full flex-col gap-8 p-5 md:mx-auto md:max-w-130 md:p-6">
          <div>
            <h2>Welcome back</h2>
            <p>Sign in to your account to continue</p>
          </div>

          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="example@gmail.com"
              value={email}
              aria-invalid={!!errorMessage}
              onChange={(e) => {
                setEmail(e.target.value)
                reset()
              }}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              aria-invalid={!!errorMessage}
              onChange={(e) => {
                setPassword(e.target.value)
                reset()
              }}
            />
          </div>

          {errorMessage && (
            <p role="alert" className="text-sm text-danger">
              {errorMessage}
            </p>
          )}

          <Button type="submit" size="lg" className="w-full">
            {isPending ? 'Signing in...' : 'Sign in'}
          </Button>
        </ContainerWithMarks>
      </form>
    </div>
  )
}

function getLoginErrorMessage(error: ApiError | null) {
  if (!error) return null
  if (!error.response) return 'Unable to reach the server. Please try again.'
  if (error.response.status === 401) return 'Incorrect email or password.'
  if (error.response.status === 400) return 'Please enter a valid email and password.'
  return 'Something went wrong. Please try again.'
}
