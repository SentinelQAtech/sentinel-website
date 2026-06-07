'use client'

import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { connectSocket, getSocket, disconnectSocket } from '@/lib/socket'
import { notificationKeys } from './useNotifications'

export function useSocketNotifications() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const socket = getSocket() ?? connectSocket()
    if (!socket) return

    const handler = () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    }

    socket.on('notification', handler)

    return () => {
      socket.off('notification', handler)
      disconnectSocket()
    }
  }, [queryClient])
}
