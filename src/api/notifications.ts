import { apiClient } from './client'
import { ApiResponse, PaginatedResponse, Notification } from '@/types'

export const notificationApi = {
  // 알림 목록 조회
  getList: (params?: { unreadOnly?: boolean; page?: number; size?: number }): Promise<ApiResponse<PaginatedResponse<Notification>>> =>
    apiClient.get('/notifications', { params }),

  // 읽지 않은 알림 수 조회
  getUnreadCount: (): Promise<ApiResponse<{ count: number }>> =>
    apiClient.get('/notifications/unread/count'),

  // 알림 읽음 처리 (api-contract.md 기준 PUT, 실패시 POST 시도)
  markAsRead: async (notificationId: string): Promise<void> => {
    try {
      await apiClient.put(`/notifications/${notificationId}/read`)
    } catch (error: any) {
      // PUT이 지원되지 않으면 POST 시도
      if (error?.response?.status === 404 || error?.response?.status === 405) {
        await apiClient.post(`/notifications/${notificationId}/read`)
      } else {
        throw error
      }
    }
  },

  // 전체 알림 읽음 처리 (api-contract.md 기준 PUT, 실패시 POST 시도)
  markAllAsRead: async (): Promise<void> => {
    try {
      await apiClient.put('/notifications/read-all')
    } catch (error: any) {
      // PUT이 지원되지 않으면 POST 시도
      if (error?.response?.status === 404 || error?.response?.status === 405) {
        await apiClient.post('/notifications/read-all')
      } else {
        throw error
      }
    }
  },
}
