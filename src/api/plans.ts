import { apiClient } from './client'
import { ApiResponse, PaginatedResponse, WeeklyPlan } from '@/types'

interface MemoRequest {
  date: string
  memo: string
}

export const planApi = {
  // 주간 계획 생성
  create: (weekStartDate: string): Promise<ApiResponse<WeeklyPlan>> =>
    apiClient.post('/plans', { weekStartDate }),

  // 주간 계획 목록 조회
  getList: (params?: { page?: number; size?: number; status?: string }): Promise<ApiResponse<PaginatedResponse<WeeklyPlan>>> =>
    apiClient.get('/plans', { params }),

  // 특정 주간 계획 조회
  getById: (planId: string): Promise<ApiResponse<WeeklyPlan>> =>
    apiClient.get(`/plans/${planId}`),

  // 현재 주 계획 조회 (없으면 자동 생성) - 백엔드에 따라 다를 수 있음
  getCurrent: (): Promise<ApiResponse<WeeklyPlan>> =>
    apiClient.get('/plans/current').catch(async (error) => {
      // 현재 주 계획이 없으면 생성 시도
      if (error?.response?.status === 404) {
        const monday = new Date()
        monday.setDate(monday.getDate() - monday.getDay() + 1)
        const weekStartDate = monday.toISOString().split('T')[0]
        return apiClient.post('/plans', { weekStartDate })
      }
      throw error
    }),

  // 계획 확정
  confirm: (planId: string): Promise<ApiResponse<WeeklyPlan>> =>
    apiClient.post(`/plans/${planId}/confirm`),

  // 메모 수정
  updateMemo: (planId: string, data: MemoRequest): Promise<ApiResponse<WeeklyPlan>> =>
    apiClient.put(`/plans/${planId}/memo`, data),

  // 회고 조회
  getReview: (planId: string): Promise<ApiResponse<any>> =>
    apiClient.get(`/plans/${planId}/review`),

  // 변경 이력 조회
  getChanges: (planId: string, params?: { date?: string }): Promise<ApiResponse<any>> =>
    apiClient.get(`/plans/${planId}/changes`, { params }),

  // 특정 날짜 변경 이력
  getChangesByDate: (planId: string, date: string): Promise<ApiResponse<any>> =>
    apiClient.get(`/plans/${planId}/changes/by-date`, { params: { date } }),
}
