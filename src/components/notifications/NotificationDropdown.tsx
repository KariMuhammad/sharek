'use client'

import { useState, useEffect } from 'react'
import { Bell, Check, X } from 'lucide-react'
import { Dropdown } from '@/components/ui/Dropdown'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

interface Notification {
  id: string
  type: 'CONTRIBUTION_REQUEST' | 'CONTRIBUTION_ACCEPTED' | 'CONTRIBUTION_REJECTED' | 'PROJECT_UPDATE' | 'CHAT_MESSAGE'
  title: string
  message: string
  isRead: boolean
  createdAt: string
  data?: any
}

// Mock data - replace with actual API call
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'CONTRIBUTION_REQUEST',
    title: 'New Contribution Request',
    message: 'John Doe wants to contribute to your AI Chat Bot project',
    isRead: false,
    createdAt: '2024-01-20T10:30:00Z',
    data: { projectId: '1', userId: '2' }
  },
  {
    id: '2',
    type: 'CONTRIBUTION_ACCEPTED',
    title: 'Contribution Accepted',
    message: 'Your request to join E-commerce Platform has been accepted!',
    isRead: false,
    createdAt: '2024-01-19T15:45:00Z',
    data: { projectId: '2' }
  },
  {
    id: '3',
    type: 'PROJECT_UPDATE',
    title: 'Project Update',
    message: 'New milestone added to Mobile App project',
    isRead: true,
    createdAt: '2024-01-18T09:15:00Z',
    data: { projectId: '3' }
  },
]

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [loading, setLoading] = useState(false)

  const unreadCount = notifications.filter(n => !n.isRead).length

  const markAsRead = async (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    )
  }

  const markAllAsRead = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      setLoading(false)
    }, 500)
  }

  const deleteNotification = async (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'CONTRIBUTION_REQUEST':
        return '👋'
      case 'CONTRIBUTION_ACCEPTED':
        return '✅'
      case 'CONTRIBUTION_REJECTED':
        return '❌'
      case 'PROJECT_UPDATE':
        return '📝'
      case 'CHAT_MESSAGE':
        return '💬'
      default:
        return '🔔'
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  return (
    <Dropdown
      trigger={
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      }
      className="w-80"
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              loading={loading}
            >
              <Check className="w-4 h-4 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No notifications yet</p>
          </div>
        ) : (
          <div className="py-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`px-4 py-3 hover:bg-gray-50 border-l-4 ${
                  notification.isRead 
                    ? 'border-transparent' 
                    : 'border-primary-500 bg-primary-50/30'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-lg">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {formatTime(notification.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1 ml-2">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1 rounded hover:bg-gray-200 transition-colors"
                            title="Mark as read"
                          >
                            <Check className="w-3 h-3 text-gray-500" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1 rounded hover:bg-gray-200 transition-colors"
                          title="Delete notification"
                        >
                          <X className="w-3 h-3 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            as="a"
            href="/notifications"
          >
            View all notifications
          </Button>
        </div>
      )}
    </Dropdown>
  )
}