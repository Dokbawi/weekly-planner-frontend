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

apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config

    // 401 에러이고 재시도하지 않은 요청인 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // 토큰 재발급 시도 (refresh token이 있다면)
      // 현재는 refresh token이 없으므로 바로 로그아웃
      const authStore = useAuthStore.getState()

      // auth 관련 엔드포인트는 로그아웃 처리하지 않음
      if (!originalRequest.url?.includes('/auth/')) {
        console.warn('Token expired or invalid, logging out...')
        authStore.logout()
        window.location.href = '/login'
        return Promise.reject(error)
      }
    }

    return Promise.reject(error.response?.data?.error || error)
  }
)
