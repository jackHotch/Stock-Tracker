import { TrendingUp } from 'lucide-react'

interface LogoProps {
  size?: 'small' | 'medium' | 'large'
}

export const Logo = ({}: LogoProps) => {
  return (
    <h1 className="flex items-center gap-2">
      MarketTrend <TrendingUp size={40} color="var(--primary)" />
    </h1>
  )
}
