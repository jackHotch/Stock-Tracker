import { User } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'

interface UserProfileIconProps {
  className?: string
}

export const UserProfileIcon = ({ className }: UserProfileIconProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={className}>
        <User className="cursor-pointer p-2 hover:bg-muted-foreground/20" size={36} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="text-danger">Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
