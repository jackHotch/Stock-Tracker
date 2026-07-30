import { User } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { clearAuthToken } from '@/lib/api-client'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'

interface UserProfileIconProps {
  className?: string
}

export const UserProfileIcon = ({ className }: UserProfileIconProps) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const handleLogout = () => {
    clearAuthToken()
    queryClient.clear()
    router.push('/')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={className}>
        <User className="cursor-pointer p-2 hover:bg-muted-foreground/20" size={36} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="text-danger" onClick={handleLogout}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
