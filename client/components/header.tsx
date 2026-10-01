import { NAV_ITEMS } from '@/lib/constants'
import { Logo } from './logo'
import { usePathname, useRouter } from 'next/navigation'
import { UserProfileIcon } from './user-profile-icon'
import { ThemeSwitcher } from './theme-switcher'

export const Header = () => {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <nav className="grid grid-cols-3 items-center border-b border-b-border px-6 py-2">
      <Logo />

      <ul className="flex gap-8 justify-self-center">
        {NAV_ITEMS.map((item, key) => {
          return (
            <li
              key={key}
              className={`flex cursor-pointer items-center gap-2 p-2 hover:bg-muted-foreground/15 ${pathname === item.path ? 'text-primary' : null}`}
              onClick={() => router.push(item.path)}
            >
              {item.icon}
              <span>{item.title}</span>
            </li>
          )
        })}
      </ul>

      <div className="flex items-center gap-2 justify-self-end">
        <ThemeSwitcher />
        <UserProfileIcon />
      </div>
    </nav>
  )
}
