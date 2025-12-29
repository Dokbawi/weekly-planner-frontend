import { apiClient } from './client'
import { ApiResponse, WeeklyReview } from '@/types'

export const reviewApi = {
  // 현재 주 회고 조회
  getCurrent: async (): Promise<ApiResponse<WeeklyReview>> => {
    try {
      // 먼저 /reviews/current 시도 (백엔드가 지원하는 경우)
      return await apiClient.get('/reviews/current')
    } catch (error: any) {
      if (error?.response?.status === 404) {
        try {
          // /reviews/current가 없으면 현재 주 계획을 통해 회고 조회
          const { planApi } = await import('./plans')
          const planResponse = await planApi.getCurrent()
          const planId = planResponse.data?.id

          if (planId) {
            return await apiClient.get(`/plans/${planId}/review`)
          }

          // 회고 데이터가 없는 경우 빈 응답 반환
          return {
            success: false,
            error: { code: 'NO_REVIEW', message: 'No review data available' }
          } as any
        } catch (e) {
          console.error('Failed to get review:', e)
          return {
            success: false,
            error: { code: 'REVIEW_ERROR', message: 'Failed to load review' }
          } as any
        }
      }
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
