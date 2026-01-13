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

  // 현재 주 계획 조회 (조회만, 자동 생성 안함)
  // NOTE: /plans/current 엔드포인트가 백엔드에 구현되어야 함
  // 임시로 목록 조회 후 현재 주 찾기
  getCurrent: async (): Promise<ApiResponse<WeeklyPlan | null>> => {
    // 현재 날짜 및 이번 주 월요일 계산
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    const dayOfWeek = today.getDay()
    const monday = new Date(today)
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
    const weekStartDate = monday.toISOString().split('T')[0]

    try {
      // 목록 조회
      const response: any = await apiClient.get('/plans', {
        params: { page: 0, size: 20 }
      })

      console.log('Plans API response:', response)

      // 다양한 응답 구조 처리
      let plans: WeeklyPlan[] = []
      if (Array.isArray(response)) {
        plans = response
      } else if (response?.content && Array.isArray(response.content)) {
        plans = response.content
      } else if (response?.data?.content && Array.isArray(response.data.content)) {
        plans = response.data.content
      } else if (response?.data && Array.isArray(response.data)) {
        plans = response.data
      }

      console.log('Parsed plans:', plans, 'weekStartDate:', weekStartDate, 'todayStr:', todayStr)

      if (!plans || plans.length === 0) {
        // 계획이 없으면 null 반환 (자동 생성 안함)
        return { success: true, data: null }
      }

      // 1. 현재 날짜가 포함된 주간 계획 찾기
      const currentPlan = plans.find((plan: WeeklyPlan) => {
        const startDate = new Date(plan.weekStartDate)
        const endDate = plan.weekEndDate
          ? new Date(plan.weekEndDate)
          : new Date(new Date(plan.weekStartDate).getTime() + 6 * 24 * 60 * 60 * 1000)
        const currentDate = new Date(todayStr)
        console.log('Checking plan:', plan.weekStartDate, 'start:', startDate, 'end:', endDate, 'current:', currentDate)
        return currentDate >= startDate && currentDate <= endDate
      })
      if (currentPlan) {
        console.log('Found current plan by date range:', currentPlan)
        return { success: true, data: currentPlan }
      }

      // 2. 정확한 weekStartDate로 찾기
      const exactPlan = plans.find((plan: WeeklyPlan) => plan.weekStartDate === weekStartDate)
      if (exactPlan) {
        console.log('Found exact plan by weekStartDate:', exactPlan)
        return { success: true, data: exactPlan }
      }

      // 3. 가장 최근 계획 반환
      console.log('Returning first plan:', plans[0])
      return { success: true, data: plans[0] }
    } catch (error) {
      console.error('Failed to get current plan:', error)
      throw error
    }
  },

  // 현재 주 계획 조회 또는 생성 (Task 추가 시 사용)
  getOrCreateCurrent: async (): Promise<ApiResponse<WeeklyPlan>> => {
    // 먼저 조회 시도
    const currentResponse = await planApi.getCurrent()
    if (currentResponse.data) {
      return { success: true, data: currentResponse.data }
    }

    // 없으면 생성
    const today = new Date()
    const dayOfWeek = today.getDay()
    const monday = new Date(today)
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
    const weekStartDate = monday.toISOString().split('T')[0]

    try {
      const createResponse: any = await apiClient.post('/plans', { weekStartDate })
      return { success: true, data: createResponse.data || createResponse }
    } catch (createError: any) {
      // 이미 존재하면 다시 조회
      const errorMessage = createError?.message || ''
      if (errorMessage.toLowerCase().includes('already exists')) {
        const retryResponse = await planApi.getCurrent()
        if (retryResponse.data) {
          return { success: true, data: retryResponse.data }
        }
      }
      throw createError
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
