import { apiClient } from './client'
import { ApiResponse, PaginatedResponse, WeeklyPlan } from '@/types'

interface MemoRequest {
  date: string
  memo: string
}

export const planApi = {
  getCurrent: (): Promise<ApiResponse<WeeklyPlan>> =>
    apiClient.get('/plans/current'),

  getById: (planId: string): Promise<ApiResponse<WeeklyPlan>> =>
    apiClient.get(`/plans/${planId}`),

  getList: (params?: { page?: number; size?: number; status?: string }): Promise<ApiResponse<PaginatedResponse<WeeklyPlan>>> =>
    apiClient.get('/plans', { params }),

  confirm: (planId: string): Promise<ApiResponse<WeeklyPlan>> =>
    apiClient.put(`/plans/${planId}/confirm`),

  updateMemo: (planId: string, data: MemoRequest): Promise<ApiResponse<WeeklyPlan>> =>
    apiClient.put(`/plans/${planId}/memo`, data),
}
