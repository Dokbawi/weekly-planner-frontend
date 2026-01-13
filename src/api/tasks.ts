import { apiClient } from './client'
import { ApiResponse, Task, CreateTaskRequest, UpdateTaskRequest, TaskStatus } from '@/types'

export const taskApi = {
  // Task 목록 조회
  getList: (planId: string, params?: { date?: string; status?: string }): Promise<ApiResponse<Task[]>> =>
    apiClient.get(`/plans/${planId}/tasks`, { params }),

  // Task 추가 - date를 query parameter로 전달
  // api-contract.md 기준: scheduledTime은 "HH:mm", reminderMinutesBefore 사용
  create: (planId: string, date: string, data: Omit<CreateTaskRequest, 'date'>): Promise<ApiResponse<Task>> =>
    apiClient.post(`/plans/${planId}/tasks?date=${date}`, {
      title: data.title,
      description: data.description,
      scheduledTime: data.scheduledTime, // "HH:mm" 형식 그대로 전달
      reminderMinutesBefore: data.reminder?.enabled ? data.reminder.minutesBefore : undefined,
      priority: data.priority,
      tags: data.tags,
    }),

  // Task 수정 - planId도 필요
  // api-contract.md 기준: reminderMinutesBefore 사용
  update: (planId: string, taskId: string, data: UpdateTaskRequest): Promise<ApiResponse<Task>> =>
    apiClient.put(`/plans/${planId}/tasks/${taskId}`, {
      title: data.title,
      description: data.description,
      scheduledTime: data.scheduledTime,
      status: data.status,
      priority: data.priority,
      tags: data.tags,
      reminderMinutesBefore: data.reminder?.enabled ? data.reminder.minutesBefore : undefined,
      reason: data.reason,
    }),

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
