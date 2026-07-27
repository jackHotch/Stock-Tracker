import { Container } from "@/components/container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TrendingUp } from "lucide-react"

export default function Login() {
  return (
    <div className="flex min-h-screen min-w-screen flex-col gap-12 p-6">
      <h1 className="flex items-center gap-2">
        MarketTrend <TrendingUp size={36} color="var(--primary)" />
      </h1>
      <Container className="flex w-full flex-col gap-8 p-6 md:mx-auto md:max-w-130">
        <div>
          <h2>Welcome back</h2>
          <p>Sign in to your account to continue</p>
        </div>

        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" placeholder="example@gmail.com" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" />
        </div>

        <Button size="lg" className="w-full">
          Login
        </Button>
      </Container>
    </div>
  )
}
