export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'POSTPONED'
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export interface ReminderSettings {
  enabled: boolean
  minutesBefore: number
  notifiedAt?: string
}

export interface Task {
  id: string
  title: string
  description?: string
  scheduledTime?: string
  estimatedMinutes?: number
  reminder?: ReminderSettings
  // 백엔드 API에서 오는 필드 (reminderMinutesBefore)
  reminderMinutesBefore?: number
  status: TaskStatus
  priority: Priority
  tags: string[]
  order: number
  createdAt: string
  completedAt?: string
}

export interface CreateTaskRequest {
  date: string
  title: string
  description?: string
  scheduledTime?: string
  estimatedMinutes?: number
  reminder?: {
    enabled: boolean
    minutesBefore: number
  }
  priority?: Priority
  tags?: string[]
}

export interface UpdateTaskRequest {
  title?: string
  description?: string
  scheduledTime?: string
  status?: TaskStatus
  priority?: Priority
  tags?: string[]
  reminder?: ReminderSettings
  reason?: string
}
