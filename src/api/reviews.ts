import { apiClient } from './client'
import { ApiResponse, WeeklyReview } from '@/types'

export const reviewApi = {
  // 현재 주 회고 조회
  // NOTE: /reviews/current 엔드포인트가 백엔드에 구현되어야 함
  // 임시로 현재 계획의 회고를 조회
  getCurrent: async (): Promise<ApiResponse<WeeklyReview>> => {
    try {
      // 현재 주 계획을 통해 회고 조회
      const { planApi } = await import('./plans')
      const planResponse = await planApi.getCurrent()
      const planId = planResponse.data?.id

      if (planId) {
        return await apiClient.get(`/plans/${planId}/review`)
      }

      throw new Error('No current plan found')
    } catch (error) {
      console.error('Failed to get current review:', error)
      throw error
    }
  },

  // 특정 주 회고 조회
  getByWeek: (weekStartDate: string): Promise<ApiResponse<WeeklyReview>> =>
    apiClient.get(`/reviews/${weekStartDate}`),

  // 특정 계획의 회고 조회 (새로 추가)
  getByPlanId: (planId: string): Promise<ApiResponse<WeeklyReview>> =>
    apiClient.get(`/plans/${planId}/review`),
}
