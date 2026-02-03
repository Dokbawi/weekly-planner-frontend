import { DayOfWeek } from './user'
import { Priority } from './task'

export type ApplyMode = 'overwrite' | 'merge'

export interface TemplateTask {
  title: string
  description?: string
  scheduledTime?: string
  estimatedMinutes?: number
  priority: Priority
  tags?: string[]
}

export interface TemplateDayPlan {
  dayOfWeek: DayOfWeek
  tasks: TemplateTask[]
}

export interface WeeklyTemplate {
  id: string
  name: string
  description?: string
  dayPlans: TemplateDayPlan[]
  createdAt: string
  updatedAt: string
}

export interface CreateTemplateRequest {
  name: string
  description?: string
  dayPlans: TemplateDayPlan[]
}

export interface UpdateTemplateRequest {
  name?: string
  description?: string
  dayPlans?: TemplateDayPlan[]
}
