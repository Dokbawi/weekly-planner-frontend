import { apiClient } from './client'
import { ApiResponse, WeeklyReview } from '@/types'

export const reviewApi = {
  getCurrent: (): Promise<ApiResponse<WeeklyReview>> =>
    apiClient.get('/reviews/current'),

  getByWeek: (weekStartDate: string): Promise<ApiResponse<WeeklyReview>> =>
    apiClient.get(`/reviews/${weekStartDate}`),
}
