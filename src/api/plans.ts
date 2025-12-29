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

  // 현재 주 계획 조회
  // NOTE: /plans/current 엔드포인트가 백엔드에 구현되어야 함
  // 임시로 목록 조회 후 현재 주 찾기
  getCurrent: async (): Promise<ApiResponse<WeeklyPlan>> => {
    // 현재 주의 월요일 날짜 계산
    const today = new Date()
    const dayOfWeek = today.getDay()
    const monday = new Date(today)
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
    monday.setHours(0, 0, 0, 0)
    const weekStartDate = monday.toISOString().split('T')[0]

    try {
      // 목록에서 현재 주 계획 찾기
      const response = await apiClient.get('/plans', {
        params: { page: 0, size: 10 }
      })

      if (response.content && response.content.length > 0) {
        // 현재 주에 해당하는 계획 찾기
        const currentPlan = response.content.find((plan: WeeklyPlan) =>
          plan.weekStartDate === weekStartDate
        )

        if (currentPlan) {
          return { success: true, data: currentPlan }
        }
      }

      // 현재 주 계획이 없으면 새로 생성
      return await apiClient.post('/plans', { weekStartDate })
    } catch (error) {
      console.error('Failed to get current plan:', error)
      throw error
    }
  },

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
