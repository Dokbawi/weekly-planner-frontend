import { Task } from './task'
import { DayOfWeek } from './user'

export type PlanStatus = 'DRAFT' | 'CONFIRMED' | 'COMPLETED'

export interface DailyPlan {
  date: string
  dayOfWeek: DayOfWeek
  tasks: Task[]
  memo?: string
}

export interface WeeklyPlan {
  id: string
  weekStartDate: string
  weekEndDate: string
  status: PlanStatus
  dailyPlans: Record<string, DailyPlan>
  confirmedAt?: string
  createdAt: string
  updatedAt: string
}
