export type NotificationType =
  | 'TASK_REMINDER'
  | 'PLANNING_REMINDER'
  | 'REVIEW_REMINDER'
  | 'DAILY_SUMMARY'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  relatedTaskId?: string
  relatedDate?: string
  isRead: boolean
  createdAt: string
  readAt?: string
}
