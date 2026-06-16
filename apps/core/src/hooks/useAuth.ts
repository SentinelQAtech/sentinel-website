'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCurrentUser, loginWithEmail, logoutUser, storeTokens } from '@/lib/auth-service'
import type { User } from '@/types'

export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
}

export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnMount: true,
  })
}

export function useUser() {
  const { data: user } = useCurrentUser()
  return user
}

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginWithEmail(email, password),
    onSuccess: (result) => {
      storeTokens(result.tokens, result.user.id)
      queryClient.setQueryData(authKeys.me(), result.user)
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.setQueryData(authKeys.me(), null)
      queryClient.clear()
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (updates: Partial<User>) => {
      return updates
    },
    onMutate: async (updates) => {
      await queryClient.cancelQueries({ queryKey: authKeys.me() })
      const previous = queryClient.getQueryData<User>(authKeys.me())
      queryClient.setQueryData(authKeys.me(), (old: User | undefined) =>
        old ? { ...old, ...updates } : old
      )
      return { previous }
    },
    onError: (_, __, context) => {
      if (context?.previous) {
        queryClient.setQueryData(authKeys.me(), context.previous)
      }
    },
  })
}
