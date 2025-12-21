import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { NotificationItem } from '@/components/notification/NotificationItem'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { EmptyState } from '@/components/common/EmptyState'
import { useNotificationStore } from '@/stores/notificationStore'
import { notificationApi } from '@/api/notifications'
import { Notification } from '@/types'

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const { setUnreadCount } = useNotificationStore()

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async (pageNum = 0) => {
    if (pageNum === 0) setIsLoading(true)
    try {
      const response = await notificationApi.getList({ page: pageNum, size: 20 })
      const newNotifications = response.data.content
      if (pageNum === 0) {
        setNotifications(newNotifications)
      } else {
        setNotifications((prev) => [...prev, ...newNotifications])
      }
      setHasMore(pageNum < response.data.totalPages - 1)
      setPage(pageNum)
    } catch (error) {
      console.error('Failed to load notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationApi.markAsRead(id)
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      )
      const unreadResponse = await notificationApi.getUnreadCount()
      setUnreadCount(unreadResponse.data.count)
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">알림</h1>
        {notifications.some((n) => !n.isRead) && (
          <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
            모두 읽음
          </Button>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="bg-white rounded-lg border divide-y">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState message="알림이 없습니다" />
      )}

      {hasMore && (
        <div className="text-center">
          <Button variant="outline" onClick={() => loadNotifications(page + 1)}>
            더 보기
          </Button>
        </div>
      )}
    </div>
  )
}
