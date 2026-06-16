'use client'

import { useRouter } from 'next/navigation'
import { useCurrentUser } from '@/hooks/useAuth'
import { useEffect } from 'react'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { data: user, isLoading, isFetched } = useCurrentUser()

  useEffect(() => {
    if (isFetched && !isLoading && !user) {
      router.replace('/login')
    }
  }, [isFetched, isLoading, user, router])

  if (isLoading) return null
  if (!user) return null

  return <>{children}</>
}
