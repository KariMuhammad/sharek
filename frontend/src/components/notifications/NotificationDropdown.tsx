@@ .. @@
 'use client';

-import { useState } from 'react';
+import { useState, useEffect, useRef } from 'react';
+import { useTranslations } from 'next-intl';
 import { Bell, X } from 'lucide-react';
+import { useNotifications } from '@/hooks/useNotifications';
 import Badge from '@/components/ui/Badge';

 export default function NotificationDropdown() {
+  const t = useTranslations('nav');
   const [isOpen, setIsOpen] = useState(false);
-  const [notifications, setNotifications] = useState([
-    {
-      id: '1',
-      title: 'New contribution request',
-      message: 'John Doe wants to contribute to your project',
-      time: '2 minutes ago',
-      read: false,
-    },
-    {
-      id: '2',
-      title: 'Project accepted',
-      message: 'Your contribution to React Dashboard was accepted',
-      time: '1 hour ago',
-      read: false,
-    },
-    {
-      id: '3',
-      title: 'New message',
-      message: 'You have a new message in project chat',
-      time: '3 hours ago',
-      read: true,
-    },
-  ]);
+  const dropdownRef = useRef<HTMLDivElement>(null);
+  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

-  const unreadCount = notifications.filter(n => !n.read).length;
+  // Close dropdown when clicking outside
+  useEffect(() => {
+    const handleClickOutside = (event: MouseEvent) => {
+      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
+        setIsOpen(false);
+      }
+    };

-  const markAsRead = (id: string) => {
-    setNotifications(prev =>
-      prev.map(notif =>
-        notif.id === id ? { ...notif, read: true } : notif
-      )
-    );
+    document.addEventListener('mousedown', handleClickOutside);
+    return () => document.removeEventListener('mousedown', handleClickOutside);
+  }, []);
+
+  const handleNotificationClick = (notification: any) => {
+    if (!notification.isRead) {
+      markAsRead(notification.id);
+    }
   };

-  const markAllAsRead = () => {
-    setNotifications(prev =>
-      prev.map(notif => ({ ...notif, read: true }))
-    );
+  const formatTime = (dateString: string) => {
+    const date = new Date(dateString);
+    const now = new Date();
+    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
+    
+    if (diffInMinutes < 1) return 'Just now';
+    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
+    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
+    return `${Math.floor(diffInMinutes / 1440)}d ago`;
   };

   return (
-    <div className="relative">
+    <div className="relative" ref={dropdownRef}>
       <button
         onClick={() => setIsOpen(!isOpen)}
         className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
       >
         <Bell className="w-5 h-5" />
         {unreadCount > 0 && (
           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
             {unreadCount > 9 ? '9+' : unreadCount}
           </span>
         )}
       </button>

       {isOpen && (
         <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
           <div className="p-4 border-b border-gray-200">
             <div className="flex items-center justify-between">
-              <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
+              <h3 className="text-lg font-medium text-gray-900">{t('notifications')}</h3>
               {unreadCount > 0 && (
                 <button
                   onClick={markAllAsRead}
                   className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                 >
                   Mark all read
                 </button>
               )}
             </div>
           </div>

           <div className="max-h-96 overflow-y-auto">
             {notifications.length > 0 ? (
               notifications.map((notification) => (
                 <div
                   key={notification.id}
+                  onClick={() => handleNotificationClick(notification)}
                   className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
-                    !notification.read ? 'bg-blue-50' : ''
+                    !notification.isRead ? 'bg-blue-50' : ''
                   }`}
                 >
                   <div className="flex items-start justify-between">
                     <div className="flex-1">
                       <h4 className="text-sm font-medium text-gray-900 mb-1">
                         {notification.title}
                       </h4>
                       <p className="text-sm text-gray-600 mb-2">
                         {notification.message}
                       </p>
                       <p className="text-xs text-gray-500">
-                        {notification.time}
+                        {formatTime(notification.createdAt)}
                       </p>
                     </div>
-                    {!notification.read && (
+                    {!notification.isRead && (
                       <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 ml-2"></div>
                     )}
                   </div>
                 </div>
               ))
             ) : (
               <div className="p-8 text-center">
                 <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                 <p className="text-gray-600">No notifications yet</p>
               </div>
             )}
           </div>

           {notifications.length > 0 && (
             <div className="p-4 border-t border-gray-200">
               <button
                 onClick={() => setIsOpen(false)}
                 className="w-full text-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
               >
                 View all notifications
               </button>
             </div>
           )}
         </div>
       )}
     </div>