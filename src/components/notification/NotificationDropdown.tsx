import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { NotificationItem } from './NotificationItem'
import { useNotificationStore } from '@/stores/notificationStore'
import { notificationApi } from '@/api/notifications'

export function NotificationDropdown() {
  const { notifications, unreadCount, setNotifications, setUnreadCount, markAllAsRead } =
    useNotificationStore()

  useEffect(() => {
    loadNotifications()
    loadUnreadCount()
  }, [])

  const loadNotifications = async () => {
    try {
      const response = await notificationApi.getList({ size: 5 })
      setNotifications(response.data.content)
    } catch (error) {
      console.error('Failed to load notifications:', error)
    }
  }

  const loadUnreadCount = async () => {
    try {
      const response = await notificationApi.getUnreadCount()
      setUnreadCount(response.data.count)
    } catch (error) {
      console.error('Failed to load unread count:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead()
      markAllAsRead()
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <span className="font-medium">알림</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={handleMarkAllAsRead}
            >
              모두 읽음
            </Button>
          )}
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))
          ) : (
            <div className="py-8 text-center text-gray-500 text-sm">
              알림이 없습니다
            </div>
          )}
        </div>
        <div className="border-t p-2">
          <Button variant="ghost" size="sm" className="w-full" asChild>
            <Link to="/notifications">전체 보기</Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
