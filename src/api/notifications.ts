import { apiClient } from './client'
import { ApiResponse, PaginatedResponse, Notification } from '@/types'

export const notificationApi = {
  getList: (params?: { unreadOnly?: boolean; page?: number; size?: number }): Promise<ApiResponse<PaginatedResponse<Notification>>> =>
    apiClient.get('/notifications', { params }),

  getUnreadCount: (): Promise<ApiResponse<{ count: number }>> =>
    apiClient.get('/notifications/unread/count'),

  markAsRead: (notificationId: string): Promise<void> =>
    apiClient.put(`/notifications/${notificationId}/read`),

  markAllAsRead: (): Promise<void> =>
    apiClient.put('/notifications/read-all'),
}
