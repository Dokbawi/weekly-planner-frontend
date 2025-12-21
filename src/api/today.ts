import { apiClient } from './client'
import { ApiResponse, TodayResponse } from '@/types'

export const todayApi = {
  get: (): Promise<ApiResponse<TodayResponse>> =>
    apiClient.get('/today'),
}
