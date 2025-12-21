import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNotificationStore } from '@/stores/notificationStore'

interface NotificationBadgeProps {
  onClick?: () => void
}

export function NotificationBadge({ onClick }: NotificationBadgeProps) {
  const { unreadCount } = useNotificationStore()

  return (
    <Button variant="ghost" size="icon" className="relative" onClick={onClick}>
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Button>
  )
}
