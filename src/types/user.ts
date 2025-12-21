export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'

export interface UserSettings {
  planningDay: DayOfWeek
  reviewDay: DayOfWeek
  weekStartDay: DayOfWeek
  timezone: string
  defaultReminderMinutes: number
  notificationEnabled: boolean
}

export interface User {
  id: string
  email: string
  name: string
  settings?: UserSettings
  createdAt: string
  updatedAt?: string
}
