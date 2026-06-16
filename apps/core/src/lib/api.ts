import axios from 'axios'
import { withCoreBasePath } from './routes'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
})

export async function exchangeSupabaseSession(accessToken: string) {
  const { data } = await axios.post(`${API_URL}/api/v1/auth/supabase`, { accessToken })
  return data as { accessToken: string; refreshToken: string }
}

// Attach bearer token on every request
api.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auto-refresh on 401
api.interceptors.response.use(
  r => r,
  async error => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      const refreshToken = localStorage.getItem('refreshToken')
      const userId = localStorage.getItem('userId')

      if (refreshToken && userId) {
        try {
          const { data } = await axios.post(`${API_URL}/api/v1/auth/refresh`, { userId, refreshToken })
          localStorage.setItem('accessToken', data.accessToken)
          localStorage.setItem('refreshToken', data.refreshToken)
          original.headers.Authorization = `Bearer ${data.accessToken}`
          return api(original)
        } catch {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('userId')
          window.location.href = withCoreBasePath('/login')
        }
      }
    }
    return Promise.reject(error)
  }
)
