import { Clock, Calendar, BarChart3, ListChecks } from 'lucide-react'
import { Notification, NotificationType } from '@/types'
import { getRelativeTime } from '@/lib/date'
import { cn } from '@/lib/utils'

interface NotificationItemProps {
  notification: Notification
  onClick?: () => void
}

const iconMap: Record<NotificationType, React.ReactNode> = {
  TASK_REMINDER: <Clock className="h-4 w-4 text-blue-500" />,
  PLANNING_REMINDER: <Calendar className="h-4 w-4 text-green-500" />,
  REVIEW_REMINDER: <BarChart3 className="h-4 w-4 text-purple-500" />,
  DAILY_SUMMARY: <ListChecks className="h-4 w-4 text-orange-500" />,
}

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex gap-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors',
        !notification.isRead && 'bg-blue-50/50'
      )}
    >
      <div className="flex-shrink-0 mt-1">{iconMap[notification.type]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
        <p className="text-sm text-gray-600 truncate">{notification.message}</p>
        <p className="text-xs text-gray-400 mt-1">
          {getRelativeTime(notification.createdAt)}
        </p>
      </div>
      {!notification.isRead && (
        <div className="flex-shrink-0">
          <div className="h-2 w-2 rounded-full bg-blue-500" />
        </div>
      )}
    </div>
  )
}
