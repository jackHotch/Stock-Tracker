import { cn } from '@/lib/utils'
import { TrendingUp } from 'lucide-react'

interface LogoProps {
  size?: 'small' | 'medium' | 'large'
}

const sizes = {
  small: { text: 'text-lg', icon: 20 },
  medium: { text: 'text-3xl', icon: 32 },
  large: { text: 'text-5xl', icon: 48 },
}

export const Logo = ({ size = 'medium' }: LogoProps) => {
  const { text, icon } = sizes[size]

  return (
    <h1 className={cn('flex items-center gap-2', text)}>
      MarketTrend <TrendingUp size={icon} color="var(--primary)" />
    </h1>
  )
}
