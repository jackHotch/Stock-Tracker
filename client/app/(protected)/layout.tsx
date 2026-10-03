'use client'

import { Header } from '@/components/header'
import { useAuthGuard } from '@/hooks/use-auth-guard'

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { isChecking } = useAuthGuard()

  if (isChecking) {
    return null
  }

  return (
    <>
      <Header />
      {/* Bottom padding clears the mobile tab bar */}
      <main className="mx-auto w-full p-4 lg:w-4/5 pb-28 md:p-6">{children}</main>
    </>
  )
}
