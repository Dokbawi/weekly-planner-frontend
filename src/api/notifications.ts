import { apiClient } from './client'
import { ApiResponse, PaginatedResponse, Notification } from '@/types'

export const notificationApi = {
  // 알림 목록 조회
  getList: (params?: { unreadOnly?: boolean; page?: number; size?: number }): Promise<ApiResponse<PaginatedResponse<Notification>>> =>
    apiClient.get('/notifications', { params }),

  // 읽지 않은 알림 수 조회
  getUnreadCount: (): Promise<ApiResponse<{ count: number }>> =>
    apiClient.get('/notifications/unread/count'),

  // 알림 읽음 처리 - POST로 변경
  markAsRead: (notificationId: string): Promise<void> =>
    apiClient.post(`/notifications/${notificationId}/read`),

  // 전체 알림 읽음 처리 - POST로 변경
  markAllAsRead: (): Promise<void> =>
    apiClient.post('/notifications/read-all'),
}
