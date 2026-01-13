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
    try {
      // 1. 먼저 모든 계획 목록 조회
      const response = await apiClient.get('/plans', {
        params: { page: 0, size: 20 }  // 더 많은 계획 조회
      })

      // 현재 날짜
      const today = new Date()
      const todayStr = today.toISOString().split('T')[0]

      if (response.content && response.content.length > 0) {
        // 현재 날짜가 포함된 주간 계획 찾기
        const currentPlan = response.content.find((plan: WeeklyPlan) => {
          const startDate = new Date(plan.weekStartDate)
          const endDate = new Date(plan.weekEndDate)
          const currentDate = new Date(todayStr)

          return currentDate >= startDate && currentDate <= endDate
        })

        if (currentPlan) {
          return { success: true, data: currentPlan }
        }

        // 아직 시작하지 않은 가장 가까운 미래 계획 찾기
        const futurePlans = response.content
          .filter((plan: WeeklyPlan) => new Date(plan.weekStartDate) > today)
          .sort((a: WeeklyPlan, b: WeeklyPlan) =>
            new Date(a.weekStartDate).getTime() - new Date(b.weekStartDate).getTime()
          )

        if (futurePlans.length > 0) {
          return { success: true, data: futurePlans[0] }
        }
      }

      // 2. 계획이 없으면 이번 주 월요일 날짜 계산해서 생성
      const dayOfWeek = today.getDay()
      const monday = new Date(today)
      monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
      const weekStartDate = monday.toISOString().split('T')[0]

      try {
        return await apiClient.post('/plans', { weekStartDate })
      } catch (createError: any) {
        // 이미 존재한다는 오류면 다시 목록에서 찾기
        if (createError?.code === 'GEN001') {
          console.log('Plan already exists, fetching existing plan')

          // 다시 목록 조회하여 실제 계획 찾기
          const retryResponse = await apiClient.get('/plans', {
            params: { page: 0, size: 20 }
          })

          if (retryResponse.content && retryResponse.content.length > 0) {
            // 현재 날짜가 포함된 계획 찾기
            for (const plan of retryResponse.content) {
              const startDate = new Date(plan.weekStartDate)
              const endDate = new Date(plan.weekEndDate || plan.weekStartDate)
              endDate.setDate(endDate.getDate() + 6) // 주말까지
              const currentDate = new Date(todayStr)

              if (currentDate >= startDate && currentDate <= endDate) {
                return { success: true, data: plan }
              }
            }

            // 정확한 weekStartDate로 찾기
            const exactPlan = retryResponse.content.find((plan: WeeklyPlan) =>
              plan.weekStartDate === weekStartDate
            )

            if (exactPlan) {
              return { success: true, data: exactPlan }
            }
          }

          // 그래도 못 찾으면 첫 번째 계획 반환
          if (retryResponse.content && retryResponse.content.length > 0) {
            return { success: true, data: retryResponse.content[0] }
          }
        }
        throw createError
      }
    } catch (error) {
      console.error('Failed to get current plan:', error)
      throw error  // 에러를 그대로 전파하여 상위에서 처리하도록
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
