@@ .. @@
 'use client';

-import { useState } from 'react';
+import { useState, useEffect } from 'react';
+import { useTranslations, useLocale } from 'next-intl';
+import { usePathname } from 'next/navigation';
 import Link from 'next/link';
-import { Menu, X, Bell, User, LogOut, Settings } from 'lucide-react';
+import { Menu, X, Bell, User, LogOut, Settings, Plus } from 'lucide-react';
+import { useAuth } from '@/hooks/useAuth';
+import { useNotifications } from '@/hooks/useNotifications';
 import Button from '@/components/ui/Button';
 import Avatar from '@/components/ui/Avatar';
 import Dropdown from '@/components/ui/Dropdown';
 import NotificationDropdown from '@/components/notifications/NotificationDropdown';
+import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
+import { type Locale } from '@/lib/i18n';

 export default function Navbar() {
+  const t = useTranslations('nav');
+  const locale = useLocale() as Locale;
+  const pathname = usePathname();
   const [isOpen, setIsOpen] = useState(false);
-  const [isLoggedIn, setIsLoggedIn] = useState(false); // This would come from auth context
+  const { user, isAuthenticated, logout } = useAuth();
+  const { unreadCount } = useNotifications();
+
+  // Close mobile menu when route changes
+  useEffect(() => {
+    setIsOpen(false);
+  }, [pathname]);

   const navigation = [
-    { name: 'Home', href: '/' },
-    { name: 'Projects', href: '/projects' },
-    { name: 'About', href: '/about' },
+    { name: t('home'), href: `/${locale}` },
+    { name: t('projects'), href: `/${locale}/projects` },
   ];

   const userMenuItems = [
-    { name: 'Profile', href: '/profile', icon: User },
-    { name: 'Settings', href: '/settings', icon: Settings },
+    { name: t('dashboard'), href: `/${locale}/dashboard`, icon: User },
+    { name: t('profile'), href: `/${locale}/profile`, icon: User },
+    { name: 'Settings', href: `/${locale}/settings`, icon: Settings },
   ];

+  const handleLogout = async () => {
+    await logout();
+  };
+
   return (
     <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
@@ .. @@
           <div className="flex items-center">
             <Link href="/" className="flex items-center">
               <div className="flex items-center gap-2">
                 <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                   <span className="text-white font-bold text-sm">S</span>
                 </div>
                 <span className="text-xl font-bold text-gray-900">Sharek</span>
               </div>
             </Link>
           </div>

           {/* Desktop Navigation */}
           <div className="hidden md:block">
             <div className="ml-10 flex items-baseline space-x-4">
               {navigation.map((item) => (
                 <Link
                   key={item.name}
                   href={item.href}
-                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
+                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
+                    pathname === item.href
+                      ? 'text-blue-600 bg-blue-50'
+                      : 'text-gray-600 hover:text-gray-900'
+                  }`}
                 >
                   {item.name}
                 </Link>
               ))}
             </div>
           </div>

           {/* Desktop Right Side */}
           <div className="hidden md:flex items-center space-x-4">
-            {isLoggedIn ? (
+            <LanguageSwitcher currentLocale={locale} />
+            
+            {isAuthenticated ? (
               <>
+                <Button href={`/${locale}/projects/create`} size="sm">
+                  <Plus className="w-4 h-4 mr-2" />
+                  {t('createProject')}
+                </Button>
+                
                 <NotificationDropdown />
                 
                 <Dropdown
                   trigger={
                     <button className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors">
-                      <Avatar size="sm" />
+                      <Avatar 
+                        src={user?.avatar} 
+                        alt={user?.username} 
+                        size="sm" 
+                      />
                     </button>
                   }
                 >
                   {userMenuItems.map((item) => (
                     <Link
                       key={item.name}
                       href={item.href}
                       className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                     >
                       <item.icon className="w-4 h-4" />
                       {item.name}
                     </Link>
                   ))}
                   <button
-                    onClick={() => setIsLoggedIn(false)}
+                    onClick={handleLogout}
                     className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full text-left"
                   >
                     <LogOut className="w-4 h-4" />
-                    Logout
+                    {t('logout')}
                   </button>
                 </Dropdown>
               </>
             ) : (
               <div className="flex items-center space-x-3">
-                <Button variant="ghost" href="/login">
-                  Login
+                <Button variant="ghost" href={`/${locale}/login`}>
+                  {t('login')}
                 </Button>
-                <Button href="/register">
-                  Sign Up
+                <Button href={`/${locale}/register`}>
+                  {t('register')}
                 </Button>
               </div>
             )}
@@ .. @@
           {/* Mobile Navigation */}
           <div className="md:hidden">
             <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
               {navigation.map((item) => (
                 <Link
                   key={item.name}
                   href={item.href}
-                  className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-colors"
+                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
+                    pathname === item.href
+                      ? 'text-blue-600 bg-blue-50'
+                      : 'text-gray-600 hover:text-gray-900'
+                  }`}
                 >
                   {item.name}
                 </Link>
               ))}
             </div>
             
-            {isLoggedIn ? (
+            {isAuthenticated ? (
               <div className="pt-4 pb-3 border-t border-gray-200">
                 <div className="flex items-center px-5">
-                  <Avatar size="sm" />
+                  <Avatar 
+                    src={user?.avatar} 
+                    alt={user?.username} 
+                    size="sm" 
+                  />
                   <div className="ml-3">
-                    <div className="text-base font-medium text-gray-800">John Doe</div>
-                    <div className="text-sm font-medium text-gray-500">john@example.com</div>
+                    <div className="text-base font-medium text-gray-800">
+                      {user?.firstName} {user?.lastName}
+                    </div>
+                    <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                   </div>
                 </div>
                 <div className="mt-3 px-2 space-y-1">
                   {userMenuItems.map((item) => (
                     <Link
                       key={item.name}
                       href={item.href}
                       className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                     >
                       <item.icon className="w-5 h-5" />
                       {item.name}
                     </Link>
                   ))}
                   <button
-                    onClick={() => setIsLoggedIn(false)}
+                    onClick={handleLogout}
                     className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors w-full text-left"
                   >
                     <LogOut className="w-5 h-5" />
-                    Logout
+                    {t('logout')}
                   </button>
                 </div>
               </div>
             ) : (
               <div className="pt-4 pb-3 border-t border-gray-200 px-2 space-y-1">
-                <Button variant="ghost" href="/login" className="w-full justify-start">
-                  Login
+                <Button variant="ghost" href={`/${locale}/login`} className="w-full justify-start">
+                  {t('login')}
                 </Button>
-                <Button href="/register" className="w-full justify-start">
-                  Sign Up
+                <Button href={`/${locale}/register`} className="w-full justify-start">
+                  {t('register')}
                 </Button>
               </div>
             )}