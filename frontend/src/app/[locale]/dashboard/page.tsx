'use client';

import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks/useAuth';
import { useProjects } from '@/hooks/useProjects';
import { useContributions } from '@/hooks/useContributions';
import { Plus, Folder, Users, Activity } from 'lucide-react';
import Button from '@/components/ui/Button';
import ProjectCard from '@/components/projects/ProjectCard';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { projects, loading: projectsLoading } = useProjects({ limit: 6 });
  const { contributions, loading: contributionsLoading } = useContributions();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const myProjects = projects.filter(p => p.authorId === user?.id);
  const myContributions = contributions.filter(c => c.status === 'ACCEPTED');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-lg text-gray-600">
            {t('welcome')}, {user?.firstName || user?.username}!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Folder className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{myProjects.length}</p>
                <p className="text-sm text-gray-600">{t('myProjects')}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{myContributions.length}</p>
                <p className="text-sm text-gray-600">{t('myContributions')}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{contributions.length}</p>
                <p className="text-sm text-gray-600">{t('recentActivity')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
            <Button href="/projects/create">
              <Plus className="w-4 h-4 mr-2" />
              {t('createProject')}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Projects */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">{t('myProjects')}</h2>
              <Button variant="outline" size="sm" href="/projects">
                View All
              </Button>
            </div>

            {projectsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="flex gap-2">
                      {[...Array(3)].map((_, j) => (
                        <div key={j} className="h-6 w-16 bg-gray-200 rounded-full"></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : myProjects.length > 0 ? (
              <div className="space-y-4">
                {myProjects.slice(0, 3).map((project) => (
                  <div key={project.id} className="bg-white rounded-xl shadow-sm">
                    <ProjectCard project={project} compact />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-8 shadow-sm text-center">
                <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                <p className="text-gray-600 mb-4">Create your first project to get started</p>
                <Button href="/projects/create">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
              </div>
            )}
          </div>

          {/* My Contributions */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">{t('myContributions')}</h2>
              <Button variant="outline" size="sm" href="/contributions">
                View All
              </Button>
            </div>

            {contributionsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                ))}
              </div>
            ) : myContributions.length > 0 ? (
              <div className="space-y-4">
                {myContributions.slice(0, 3).map((contribution) => (
                  <div key={contribution.id} className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="font-medium text-gray-900 mb-2">
                      {contribution.project.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      by {contribution.project.author.firstName} {contribution.project.author.lastName}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        {contribution.status.toLowerCase()}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(contribution.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-8 shadow-sm text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No contributions yet</h3>
                <p className="text-gray-600 mb-4">Start contributing to projects</p>
                <Button href="/projects">Browse Projects</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}