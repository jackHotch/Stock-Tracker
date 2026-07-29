import { ChartNoAxesCombined, List, Settings } from 'lucide-react'

export const NAV_ITEMS = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: <ChartNoAxesCombined size={20} />,
  },
  {
    title: 'Watchlist',
    path: '/watchlist',
    icon: <List size={20} />,
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: <Settings size={20} />,
  },
]
