import { ChangeLog, ChangeType } from './changelog'
import { DayOfWeek } from './user'

export interface ReviewStatistics {
  totalPlanned: number
  completed: number
  cancelled: number
  postponed: number
  addedAfterConfirm: number
  completionRate: number
  totalChanges: number
  changesByType: Record<ChangeType, number>
}

export interface DailyStatistics {
  date: string
  dayOfWeek: DayOfWeek
  planned: number
  completed: number
  completionRate: number
  changesCount: number
}

export interface WeeklyReview {
  weeklyPlanId: string
  weekStartDate: string
  weekEndDate: string
  statistics: ReviewStatistics
  dailyBreakdown: Record<string, DailyStatistics>
  changeHistory: ChangeLog[]
  generatedAt: string
}
