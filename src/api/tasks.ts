import { apiClient } from './client'
import { ApiResponse, Task, CreateTaskRequest, UpdateTaskRequest, TaskStatus } from '@/types'

export const taskApi = {
  create: (planId: string, data: CreateTaskRequest): Promise<ApiResponse<Task>> =>
    apiClient.post(`/plans/${planId}/tasks`, data),

  update: (taskId: string, data: UpdateTaskRequest): Promise<ApiResponse<Task>> =>
    apiClient.put(`/tasks/${taskId}`, data),

  updateStatus: (taskId: string, status: TaskStatus, reason?: string): Promise<ApiResponse<Task>> =>
    apiClient.put(`/tasks/${taskId}/status`, { status, reason }),

  move: (taskId: string, targetDate: string, reason?: string): Promise<ApiResponse<Task>> =>
    apiClient.put(`/tasks/${taskId}/move`, { targetDate, reason }),

  delete: (taskId: string, reason?: string): Promise<void> =>
    apiClient.delete(`/tasks/${taskId}`, { params: { reason } }),

  reorder: (planId: string, date: string, taskIds: string[]): Promise<ApiResponse<Task[]>> =>
    apiClient.put(`/plans/${planId}/tasks/reorder`, { date, taskIds }),
}
