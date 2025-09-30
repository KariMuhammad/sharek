@@ .. @@
 'use client';

-import { useState, useEffect } from 'react';
+import { useTranslations } from 'next-intl';
 import { ArrowRight, Users, GitBranch } from 'lucide-react';
+import { useTrendingProjects } from '@/hooks/useProjects';
 import Button from '@/components/ui/Button';
 import Badge from '@/components/ui/Badge';
+import Avatar from '@/components/ui/Avatar';

-interface Project {
-  id: string;
-  title: string;
-  description: string;
-  author: string;
-  technologies: string[];
-  contributors: number;
-  status: 'active' | 'completed';
-}
-
 export default function TrendingProjects() {
-  const [projects, setProjects] = useState<Project[]>([]);
-  const [loading, setLoading] = useState(true);
-
-  useEffect(() => {
-    // Simulate API call
-    setTimeout(() => {
-      setProjects([
-        {
-          id: '1',
-          title: 'E-commerce Platform',
-          description: 'A modern e-commerce solution built with React and Node.js',
-          author: 'John Doe',
-          technologies: ['React', 'Node.js', 'MongoDB'],
-          contributors: 8,
-          status: 'active',
-        },
-        {
-          id: '2',
-          title: 'Task Management App',
-          description: 'Collaborative task management with real-time updates',
-          author: 'Jane Smith',
-          technologies: ['Vue.js', 'Express', 'PostgreSQL'],
-          contributors: 5,
-          status: 'active',
-        },
-        {
-          id: '3',
-          title: 'AI Chat Bot',
-          description: 'Intelligent chatbot using natural language processing',
-          author: 'Mike Johnson',
-          technologies: ['Python', 'TensorFlow', 'FastAPI'],
-          contributors: 12,
-          status: 'active',
-        },
-      ]);
-      setLoading(false);
-    }, 1000);
-  }, []);
+  const t = useTranslations('home.trending');
+  const { projects, loading } = useTrendingProjects(6);

   if (loading) {
@@ .. @@
     return (
       <section className="py-20 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
-            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trending Projects</h2>
-            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
-              Discover the most popular projects in our community
-            </p>
+            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('title')}</h2>
+            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('subtitle')}</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
-            {[...Array(3)].map((_, i) => (
+            {[...Array(6)].map((_, i) => (
               <div key={i} className="bg-gray-50 rounded-xl p-6 animate-pulse">
                 <div className="h-6 bg-gray-200 rounded mb-3"></div>
                 <div className="h-4 bg-gray-200 rounded mb-4"></div>
@@ .. @@
   return (
     <section className="py-20 bg-white">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="text-center mb-16">
-          <h2 className="text-3xl font-bold text-gray-900 mb-4">Trending Projects</h2>
-          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
-            Discover the most popular projects in our community
-          </p>
+          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('title')}</h2>
+          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('subtitle')}</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {projects.map((project) => (
             <div
               key={project.id}
               className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
             >
-              <div className="flex items-center justify-between mb-4">
-                <Badge variant={project.status === 'active' ? 'success' : 'secondary'}>
-                  {project.status}
+              <div className="flex items-start justify-between mb-4">
+                <Badge variant={project.status === 'ACTIVE' ? 'success' : 'secondary'}>
+                  {project.status.toLowerCase()}
                 </Badge>
+                {project.price && (
+                  <span className="text-sm font-medium text-green-600">
+                    ${project.price}
+                  </span>
+                )}
               </div>

               <h3 className="text-xl font-semibold text-gray-900 mb-3">
@@ .. @@
               </p>

               <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
-                <span>by {project.author}</span>
+                <div className="flex items-center gap-2">
+                  <Avatar
+                    src={project.author.avatar}
+                    alt={project.author.username}
+                    size="sm"
+                  />
+                  <span>
+                    {project.author.firstName} {project.author.lastName}
+                  </span>
+                </div>
               </div>

               <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                 <div className="flex items-center gap-1">
                   <Users className="w-4 h-4" />
-                  <span>{project.contributors} contributors</span>
+                  <span>{project._count?.members || 0} members</span>
                 </div>
                 <div className="flex items-center gap-1">
                   <GitBranch className="w-4 h-4" />
-                  <span>Active</span>
+                  <span>{project._count?.contributions || 0} contributions</span>
                 </div>
               </div>

@@ .. @@
         </div>

         <div className="text-center mt-12">
-          <Button variant="outline" size="lg">
-            View All Projects
+          <Button variant="outline" size="lg" href="/projects">
+            {t('viewAll')}
             <ArrowRight className="w-5 h-5 ml-2" />
           </Button>
         </div>