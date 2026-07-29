import { NAV_ITEMS } from '@/lib/constants'
import { Logo } from './logo'
import { usePathname, useRouter } from 'next/navigation'
import { UserProfileIcon } from './user-profile-icon'

export const Header = () => {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <nav className="grid grid-cols-3 items-center px-6 py-4">
      <Logo />

      <ul className="flex gap-8 justify-self-center">
        {NAV_ITEMS.map((item, key) => {
          return (
            <li
              key={key}
              className={`flex cursor-pointer items-center gap-2 p-2 hover:bg-muted-foreground/30 ${pathname === item.path ? 'text-primary' : null}`}
              onClick={() => router.push(item.path)}
            >
              {item.icon}
              <span>{item.title}</span>
            </li>
          )
        })}
      </ul>

      <UserProfileIcon className="justify-self-end" />
    </nav>
  )
}
