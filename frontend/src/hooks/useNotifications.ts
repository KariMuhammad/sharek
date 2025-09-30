import { useState, useEffect } from 'react';
import api from '@/lib/api';

export interface Notification {
  id: string;
  userId: string;
  type: 'CONTRIBUTION_REQUEST' | 'CONTRIBUTION_ACCEPTED' | 'CONTRIBUTION_REJECTED' | 'PROJECT_UPDATE' | 'CHAT_MESSAGE' | 'RATING_RECEIVED' | 'SYSTEM';
  title: string;
  message: string;
  isRead: boolean;
  data?: any;
  createdAt: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const [notificationsRes, countRes] = await Promise.all([
        api.get('/notifications?limit=20'),
        api.get('/notifications/unread-count'),
      ]);

      setNotifications(notificationsRes.data.data.notifications);
      setUnreadCount(countRes.data.data.unreadCount);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId: string) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
  };
};