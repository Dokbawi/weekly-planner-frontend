import { apiClient } from './client'
import { ApiResponse, User, UserSettings } from '@/types'

interface LoginRequest {
  email: string
  password: string
}

interface RegisterRequest {
  email: string
  password: string
  name: string
}

interface LoginResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
  user?: User  // user 정보는 /auth/me로 별도 조회 필요할 수도 있음
}

export const authApi = {
  login: (data: LoginRequest): Promise<ApiResponse<LoginResponse>> =>
    apiClient.post('/auth/login', data),

  register: (data: RegisterRequest): Promise<ApiResponse<User>> =>
    apiClient.post('/auth/register', data),

  getMe: (): Promise<ApiResponse<User>> =>
    apiClient.get('/auth/me'),

  updateSettings: (data: Partial<UserSettings>): Promise<ApiResponse<User>> =>
    apiClient.put('/auth/settings', data),
}
