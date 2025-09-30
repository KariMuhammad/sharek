@@ .. @@
 'use client';

+import { useTranslations } from 'next-intl';
 import { Users, GitBranch, Calendar, DollarSign } from 'lucide-react';
+import { Project } from '@/hooks/useProjects';
 import Button from '@/components/ui/Button';
 import Badge from '@/components/ui/Badge';
 import Avatar from '@/components/ui/Avatar';

-interface Project {
-  id: string;
-  title: string;
-  description: string;
-  author: string;
-  technologies: string[];
-  contributors: number;
-  status: 'pending' | 'active' | 'completed';
-  price?: number;
-  createdAt: string;
-}
-
 interface ProjectCardProps {
   project: Project;
+  compact?: boolean;
 }

-export default function ProjectCard({ project }: ProjectCardProps) {
+export default function ProjectCard({ project, compact = false }: ProjectCardProps) {
+  const t = useTranslations('projects.card');
+
   return (
-    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
+    <div className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 ${
+      compact ? 'p-4' : 'p-6'
+    }`}>
       <div className="flex items-start justify-between mb-4">
-        <Badge variant={project.status === 'active' ? 'success' : 'secondary'}>
-          {project.status}
+        <Badge variant={project.status === 'ACTIVE' ? 'success' : 'secondary'}>
+          {project.status.toLowerCase()}
         </Badge>
         {project.price && (
           <div className="flex items-center gap-1 text-green-600">
             <DollarSign className="w-4 h-4" />
             <span className="font-medium">${project.price}</span>
           </div>
         )}
       </div>

-      <h3 className="text-xl font-semibold text-gray-900 mb-3">
+      <h3 className={`font-semibold text-gray-900 mb-3 ${compact ? 'text-lg' : 'text-xl'}`}>
         {project.title}
       </h3>

-      <p className="text-gray-600 mb-4 line-clamp-2">
+      <p className={`text-gray-600 mb-4 line-clamp-2 ${compact ? 'text-sm' : ''}`}>
         {project.description}
       </p>

       <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
-        <span>by {project.author}</span>
+        <div className="flex items-center gap-2">
+          <Avatar
+            src={project.author.avatar}
+            alt={project.author.username}
+            size="xs"
+          />
+          <span>
+            {t('author')} {project.author.firstName} {project.author.lastName}
+          </span>
+        </div>
       </div>

       <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
         <div className="flex items-center gap-1">
           <Users className="w-4 h-4" />
-          <span>{project.contributors} contributors</span>
+          <span>{project._count?.members || 0} {t('members')}</span>
         </div>
         <div className="flex items-center gap-1">
           <GitBranch className="w-4 h-4" />
-          <span>Active</span>
+          <span>{project._count?.contributions || 0} {t('contributions')}</span>
         </div>
         <div className="flex items-center gap-1">
           <Calendar className="w-4 h-4" />
-          <span>{new Date(project.createdAt).toLocaleDateString()}</span>
+          <span>{new Date(project.createdAt).toLocaleDateString()}</span>
         </div>
       </div>

       <div className="flex flex-wrap gap-2 mb-4">
         {project.technologies.slice(0, 3).map((tech) => (
           <Badge key={tech} variant="outline" size="sm">
             {tech}
           </Badge>
         ))}
         {project.technologies.length > 3 && (
           <Badge variant="outline" size="sm">
             +{project.technologies.length - 3}
           </Badge>
         )}
       </div>

-      <div className="flex gap-3">
-        <Button variant="outline" size="sm" className="flex-1">
-          View Details
+      <div className={`flex gap-3 ${compact ? 'flex-col' : ''}`}>
+        <Button 
+          variant="outline" 
+          size="sm" 
+          className="flex-1" 
+          href={`/projects/${project.id}`}
+        >
+          {t('viewDetails')}
         </Button>
-        <Button size="sm" className="flex-1">
-          Request to Join
+        <Button size="sm" className="flex-1">
+          {t('requestToJoin')}
         </Button>
       </div>
     </div>