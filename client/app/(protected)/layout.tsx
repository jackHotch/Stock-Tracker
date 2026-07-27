"use client"

import { useAuthGuard } from "@/hooks/use-auth-guard"

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { isChecking } = useAuthGuard()

  if (isChecking) {
    return null
  }

  return <>{children}</>
}
