import { io, type Socket } from 'socket.io-client'
import { env } from './env'

let socket: Socket | null = null

export function getSocket(): Socket | null {
  return socket
}

export function connectSocket(): Socket | null {
  if (socket?.connected) return socket

  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
  if (!token) return null

  socket = io(`${env.wsUrl}/ws`, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
  })

  socket.on('connect', () => {
    const userId = localStorage.getItem('userId')
    if (userId) socket!.emit('join', userId)
  })

  socket.on('disconnect', (reason) => {
    console.log('[Socket] disconnected:', reason)
  })

  socket.on('connect_error', (err) => {
    console.error('[Socket] connection error:', err.message)
  })

  return socket
}

export function disconnectSocket(): void {
  socket?.disconnect()
  socket = null
}
