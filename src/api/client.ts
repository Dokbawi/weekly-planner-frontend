import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 401 처리를 제외할 인증 관련 엔드포인트
const AUTH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/refresh']

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || ''
      const { token, logout } = useAuthStore.getState()

      // 인증 엔드포인트가 아니고, 토큰이 있는 상태에서 401 발생 시에만 로그아웃
      // (토큰이 있었다는 것은 인증된 상태였다는 의미 → 토큰 만료/무효화)
      const isAuthEndpoint = AUTH_ENDPOINTS.some(endpoint => requestUrl.includes(endpoint))

      if (!isAuthEndpoint && token) {
        logout()
        // 로그인 페이지로 리다이렉트
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error.response?.data?.error || error)
  }
)
