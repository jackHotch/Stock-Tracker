import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_ITEMS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Logo } from './logo'
import { UserProfileIcon } from './user-profile-icon'
import { ThemeSwitcher } from './theme-switcher'

export const Header = () => {
  const pathname = usePathname()

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-b-border bg-background px-4 py-2 md:grid md:grid-cols-3 md:px-6">
        <Logo />

        <nav className="hidden justify-self-center md:block">
          <ul className="flex gap-8">
            {NAV_ITEMS.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={cn(
                    'flex items-center gap-2 p-2 no-underline hover:bg-muted-foreground/15',
                    pathname === item.path ? 'text-primary' : 'text-foreground'
                  )}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 justify-self-end">
          <ThemeSwitcher />
          <UserProfileIcon />
        </div>
      </header>

      {/* Mobile bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-t-border bg-background pb-[env(safe-area-inset-bottom)] md:hidden">
        <ul className="grid grid-cols-3">
          {NAV_ITEMS.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={cn(
                  'flex flex-col items-center gap-1 py-2 text-xs no-underline',
                  pathname === item.path ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
