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
  estimatedMinutes?: number
  reminder?: ReminderSettings
  priority?: Priority
  tags?: string[]
  reason?: string
}
