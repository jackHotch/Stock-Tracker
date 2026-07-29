'use client'

import { Container } from '@/components/container'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLogin } from '@/hooks/use-login'
import { setAuthToken } from '@/lib/api-client'
import { TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Login() {
  const router = useRouter()
  const { mutate: login, isPending } = useLogin()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const handleLogin = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    login(
      { email, password },
      {
        onSuccess: (data) => {
          setAuthToken(data.access_token)
          router.push('/dashboard')
        },
      }
    )
  }

  return (
    <div className="flex min-h-screen min-w-screen flex-col gap-12 p-6">
      <Logo />
      <form onSubmit={handleLogin}>
        <Container className="flex w-full flex-col gap-8 p-6 md:mx-auto md:max-w-130">
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
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <Button type="submit" size="lg" className="w-full">
            {isPending ? 'Signing in...' : 'Sign in'}
          </Button>
        </Container>
      </form>
    </div>
  )
}
