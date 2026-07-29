import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ContainerProps {
  className?: string
  children?: ReactNode | ReactNode[]
}

export const Container = ({ className, children }: ContainerProps) => {
  return <div className={cn('corner-marks border border-border p-4', className)}>{children}</div>
}
