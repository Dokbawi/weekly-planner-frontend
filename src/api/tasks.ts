import { apiClient } from './client'
import { ApiResponse, Task, CreateTaskRequest, UpdateTaskRequest, TaskStatus } from '@/types'

export const taskApi = {
  // Task 목록 조회
  getList: (planId: string, params?: { date?: string; status?: string }): Promise<ApiResponse<Task[]>> =>
    apiClient.get(`/plans/${planId}/tasks`, { params }),

  // Task 추가 - date를 query parameter로 전달
  create: (planId: string, date: string, data: Omit<CreateTaskRequest, 'date'>): Promise<ApiResponse<Task>> =>
    apiClient.post(`/plans/${planId}/tasks?date=${date}`, {
      ...data,
      // ISO 형식으로 시간 변환
      scheduledTime: data.scheduledTime ? `${date}T${data.scheduledTime}:00Z` : undefined,
      // reminder 필드명 변경
      reminderMinutes: data.reminder?.enabled ? data.reminder.minutesBefore : undefined,
    }),

  // Task 수정 - planId도 필요
  update: (planId: string, taskId: string, data: UpdateTaskRequest): Promise<ApiResponse<Task>> =>
    apiClient.put(`/plans/${planId}/tasks/${taskId}`, data),

  // Task 상태 변경 - planId도 필요
  updateStatus: (planId: string, taskId: string, status: TaskStatus, reason?: string): Promise<ApiResponse<Task>> =>
    apiClient.put(`/plans/${planId}/tasks/${taskId}`, { status, reason }),

  // Task 이동
  move: (planId: string, taskId: string, targetDate: string, reason?: string): Promise<ApiResponse<Task>> =>
    apiClient.post(`/plans/${planId}/tasks/${taskId}/move`, { targetDate, reason }),

  // Task 삭제 - planId도 필요
  delete: (planId: string, taskId: string, reason?: string): Promise<void> =>
    apiClient.delete(`/plans/${planId}/tasks/${taskId}`, { params: { reason } }),

  // Task 순서 변경
  reorder: (planId: string, date: string, taskIds: string[]): Promise<ApiResponse<Task[]>> =>
    apiClient.put(`/plans/${planId}/tasks/reorder`, { date, taskIds }),
}
