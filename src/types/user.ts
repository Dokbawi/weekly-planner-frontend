export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'

export interface UserSettings {
  planningDay: number  // 0(일요일)~6(토요일) - 백엔드 API 스펙
  reviewDay: number
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
