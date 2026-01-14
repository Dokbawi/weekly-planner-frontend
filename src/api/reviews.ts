import { apiClient } from './client'
import { ApiResponse, WeeklyReview, DailyStatistics } from '@/types'

// dailyBreakdown이 배열로 오면 객체로 변환
function normalizeReview(review: any): WeeklyReview | null {
  if (!review) return null

  let normalizedReview = { ...review }

  // dailyBreakdown이 배열인 경우 객체로 변환
  if (Array.isArray(review.dailyBreakdown)) {
    const dailyBreakdownObj: Record<string, DailyStatistics> = {}
    review.dailyBreakdown.forEach((ds: any) => {
      if (ds && ds.date) {
        dailyBreakdownObj[ds.date] = ds
      }
    })
    normalizedReview.dailyBreakdown = dailyBreakdownObj
  }

  // changeHistory가 없으면 빈 배열로
  if (!normalizedReview.changeHistory) {
    normalizedReview.changeHistory = []
  }

  // statistics 기본값
  if (!normalizedReview.statistics) {
    normalizedReview.statistics = {
      totalPlanned: 0,
      completed: 0,
      cancelled: 0,
      postponed: 0,
      addedAfterConfirm: 0,
      completionRate: 0,
      totalChanges: 0,
      changesByType: {},
    }
  }

  return normalizedReview
}

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
        const response: any = await apiClient.get(`/plans/${planId}/review`)
        const review = response?.data || response
        return { success: true, data: normalizeReview(review)! }
      }

      throw new Error('No current plan found')
    } catch (error) {
      console.error('Failed to get current review:', error)
      throw error
    }
  },

  // 특정 주 회고 조회
  getByWeek: async (weekStartDate: string): Promise<ApiResponse<WeeklyReview>> => {
    const response: any = await apiClient.get(`/reviews/${weekStartDate}`)
    const review = response?.data || response
    return { success: true, data: normalizeReview(review)! }
  },

  // 특정 계획의 회고 조회 (새로 추가)
  getByPlanId: async (planId: string): Promise<ApiResponse<WeeklyReview>> => {
    const response: any = await apiClient.get(`/plans/${planId}/review`)
    const review = response?.data || response
    return { success: true, data: normalizeReview(review)! }
  },
}
