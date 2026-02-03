import { apiClient } from './client'
import { ApiResponse, WeeklyPlan } from '@/types'
import { WeeklyTemplate, CreateTemplateRequest, UpdateTemplateRequest, ApplyMode } from '@/types/template'

export const templateApi = {
  // 템플릿 생성
  create: (data: CreateTemplateRequest): Promise<ApiResponse<WeeklyTemplate>> =>
    apiClient.post('/templates', data),

  // 템플릿 목록 조회
  getList: (): Promise<ApiResponse<WeeklyTemplate[]>> =>
    apiClient.get('/templates'),

  // 템플릿 상세 조회
  getById: (id: string): Promise<ApiResponse<WeeklyTemplate>> =>
    apiClient.get(`/templates/${id}`),

  // 템플릿 수정
  update: (id: string, data: UpdateTemplateRequest): Promise<ApiResponse<WeeklyTemplate>> =>
    apiClient.put(`/templates/${id}`, data),

  // 템플릿 삭제
  delete: (id: string): Promise<ApiResponse<void>> =>
    apiClient.delete(`/templates/${id}`),

  // 기존 계획에서 템플릿 생성
  fromPlan: (planId: string, data: { name: string; description?: string }): Promise<ApiResponse<WeeklyTemplate>> =>
    apiClient.post(`/templates/from-plan/${planId}`, data),

  // 계획에 템플릿 적용
  applyTemplate: (planId: string, templateId: string, mode: ApplyMode): Promise<ApiResponse<WeeklyPlan>> =>
    apiClient.post(`/plans/${planId}/apply-template/${templateId}`, null, { params: { mode } }),
}
