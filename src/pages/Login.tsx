import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/authStore'
import { authApi } from '@/api/auth'
import { useToast } from '@/hooks/useToast'

const loginSchema = z.object({
  email: z.string().email('올바른 이메일을 입력하세요'),
  password: z.string().min(1, '비밀번호를 입력하세요'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function Login() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const response = await authApi.login(data)
      console.log('Login response:', response) // 디버깅

      // accessToken 형식으로 변경
      const token = response.data.accessToken

      // user 정보가 없다면 /auth/me로 조회
      let user = response.data.user
      if (!user) {
        // 토큰을 먼저 저장해야 /auth/me 호출 가능
        useAuthStore.getState().setAuth(token, { id: '', email: data.email, name: '' })

        try {
          const meResponse = await authApi.getMe()
          user = meResponse.data
        } catch (error) {
          console.error('Failed to get user info:', error)
          // 사용자 정보 조회 실패해도 로그인은 성공으로 처리
          user = { id: '', email: data.email, name: data.email.split('@')[0] }
        }
      }

      console.log('Setting auth with token:', token, 'user:', user) // 디버깅
      setAuth(token, user)

      // 저장 확인
      setTimeout(() => {
        const state = useAuthStore.getState()
        console.log('Auth state after setAuth:', {
          token: state.token,
          user: state.user,
          isAuthenticated: state.isAuthenticated
        })

        // localStorage 확인
        const stored = localStorage.getItem('auth-storage')
        console.log('LocalStorage auth-storage:', stored)
        if (stored) {
          try {
            const parsed = JSON.parse(stored)
            console.log('Parsed localStorage:', parsed)
          } catch (e) {
            console.error('Failed to parse localStorage:', e)
          }
        }

        toast({
          title: '로그인 성공',
          description: '환영합니다!',
        })

        navigate('/')
      }, 100)
    } catch (error: any) {
      console.error('Login error:', error) // 디버깅
      toast({
        variant: 'destructive',
        title: '로그인 실패',
        description: error?.message || '이메일 또는 비밀번호를 확인하세요',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Weekly Planner</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input id="password" type="password" {...register('password')} />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? '로그인 중...' : '로그인'}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            계정이 없으신가요?{' '}
            <Link to="/register" className="text-primary hover:underline">
              회원가입
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
