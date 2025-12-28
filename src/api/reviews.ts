import { apiClient } from './client'
import { ApiResponse, WeeklyReview } from '@/types'

export const reviewApi = {
  // 현재 주 회고 - plans API로 이동될 수도 있음
  getCurrent: (): Promise<ApiResponse<WeeklyReview>> =>
    apiClient.get('/reviews/current').catch(async (error) => {
      // 백엔드에 따라 /plans/{planId}/review 형태일 수 있음
      if (error?.response?.status === 404) {
        try {
          const planResponse = await apiClient.get('/plans/current')
          const planId = planResponse.data?.id
          if (planId) {
            return apiClient.get(`/plans/${planId}/review`)
          }
        } catch (e) {
          console.error('Failed to get review from plan:', e)
        }
      }
      throw error
    }),

  // 특정 주 회고 조회
  getByWeek: (weekStartDate: string): Promise<ApiResponse<WeeklyReview>> =>
    apiClient.get(`/reviews/${weekStartDate}`),

  // 특정 계획의 회고 조회 (새로 추가)
  getByPlanId: (planId: string): Promise<ApiResponse<WeeklyReview>> =>
    apiClient.get(`/plans/${planId}/review`),
}
