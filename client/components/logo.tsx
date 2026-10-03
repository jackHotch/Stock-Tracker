import { cn } from '@/lib/utils'
import { TrendingUp } from 'lucide-react'

interface LogoProps {
  size?: 'small' | 'medium' | 'large'
}

const sizes = {
  small: { text: 'text-lg', icon: 'size-5' },
  medium: { text: 'text-2xl md:text-3xl', icon: 'size-6 md:size-8' },
  large: { text: 'text-4xl md:text-5xl', icon: 'size-9 md:size-12' },
}

export const Logo = ({ size = 'medium' }: LogoProps) => {
  const { text, icon } = sizes[size]

  return (
    <h1 className={cn('m-0 flex items-center gap-2', text)}>
      MarketTrend <TrendingUp className={icon} color="var(--primary)" />
    </h1>
  )
}
