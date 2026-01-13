import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types'

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  tokenExpiry: string | null  // 토큰 만료 시간
  setAuth: (token: string, user: User, expiresIn?: number) => void
  setUser: (user: User) => void
  logout: () => void
  isTokenValid: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      tokenExpiry: null,

      setAuth: (token, user, expiresIn = 3600) => {
        // 토큰 만료 시간 계산 (기본 1시간)
        const expiry = new Date()
        expiry.setSeconds(expiry.getSeconds() + expiresIn)

        set({
          token,
          user,
          isAuthenticated: true,
          tokenExpiry: expiry.toISOString()
        })
      },

      setUser: (user) => set({ user }),

      logout: () => set({
        token: null,
        user: null,
        isAuthenticated: false,
        tokenExpiry: null
      }),

      isTokenValid: () => {
        const state = get()
        if (!state.token || !state.tokenExpiry) return false

        const now = new Date()
        const expiry = new Date(state.tokenExpiry)

        // 토큰이 만료되었으면 false 반환 (logout은 호출하지 않음 - 렌더링 중 상태 변경 방지)
        if (now >= expiry) {
          return false
        }

        return true
      }
    }),
    { name: 'auth-storage' }
  )
)
