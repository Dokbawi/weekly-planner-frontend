import { apiClient } from './client'
import {
  ApiResponse,
  CommuteRoutine,
  CreateCommuteRoutineRequest,
  UpdateCommuteRoutineRequest,
  CalculateRequest,
  CalculateResponse,
  AddToTasksRequest,
  Task,
} from '@/types'

export const commuteApi = {
  getList: (): Promise<ApiResponse<CommuteRoutine[]>> =>
    apiClient.get('/commute-routines'),

  getById: (routineId: string): Promise<ApiResponse<CommuteRoutine>> =>
    apiClient.get(`/commute-routines/${routineId}`),

  create: (data: CreateCommuteRoutineRequest): Promise<ApiResponse<CommuteRoutine>> =>
    apiClient.post('/commute-routines', data),

  update: (routineId: string, data: UpdateCommuteRoutineRequest): Promise<ApiResponse<CommuteRoutine>> =>
    apiClient.put(`/commute-routines/${routineId}`, data),

  delete: (routineId: string): Promise<void> =>
    apiClient.delete(`/commute-routines/${routineId}`),

  calculate: (routineId: string, data: CalculateRequest): Promise<ApiResponse<CalculateResponse>> =>
    apiClient.post(`/commute-routines/${routineId}/calculate`, data),

  addToTasks: (routineId: string, data: AddToTasksRequest): Promise<ApiResponse<{ addedTasks: Task[] }>> =>
    apiClient.post(`/commute-routines/${routineId}/add-to-tasks`, data),
}
