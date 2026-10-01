import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, decimalPlaces: number = 2) {
  if (amount || amount == 0) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    }).format(amount)
  }
}

export function formatPercentage(value: number, addDirectionIcon = false) {
  if (!addDirectionIcon) return `${value}%`

  const direction = findPositiveOrNegative(value)
  return `${direction}${Math.abs(value)}%`
}

export function findPositiveOrNegative(value: number) {
  return value > 0 ? '+' : value < 0 ? '-' : ''
}
