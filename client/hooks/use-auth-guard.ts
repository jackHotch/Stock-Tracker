"use client"

import { getAuthToken } from "@/lib/api-client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function useAuthGuard() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (!getAuthToken()) {
      router.replace("/")
      return
    }
    setIsChecking(false)
  }, [router])

  return { isChecking }
}
