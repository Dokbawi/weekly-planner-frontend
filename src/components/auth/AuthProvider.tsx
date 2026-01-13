import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { authApi } from '@/api/auth'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isValidating, setIsValidating] = useState(true)
  const { token, isAuthenticated, setUser, logout } = useAuthStore()

  useEffect(() => {
    const validateToken = async () => {
      // 토큰이 없으면 검증 불필요
      if (!token || !isAuthenticated) {
        setIsValidating(false)
        return
      }

      try {
        // /auth/me로 토큰 유효성 검증
        const response = await authApi.getMe()
        // 토큰이 유효하면 사용자 정보 업데이트
        setUser(response.data)
        console.log('Token validated successfully:', response.data)
      } catch (error: any) {
        console.error('Token validation failed:', error)
        // 토큰이 유효하지 않으면 로그아웃
        if (error?.response?.status === 401 || error?.status === 401) {
          console.log('Invalid token, logging out...')
          logout()
        }
      } finally {
        setIsValidating(false)
      }
    }

    validateToken()
  }, []) // 앱 시작 시 한 번만 실행

  // 토큰 검증 중이면 로딩 표시
  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-2 text-gray-500">인증 확인 중...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
