'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useProjects } from '@/hooks/useProjects';
import ProjectCard from '@/components/projects/ProjectCard';
import ProjectFilters from '@/components/projects/ProjectFilters';
import { Search } from 'lucide-react';

export default function ProjectsPage() {
  const t = useTranslations('projects');
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    technologies: [] as string[],
    page: 1,
    limit: 12,
  });

  const { projects, loading, pagination } = useProjects(filters);

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('title')}</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('subtitle')}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <ProjectFilters
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Projects Grid */}
          <div className="lg:w-3/4">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('filters.search')}
                value={filters.search}
                onChange={(e) => handleFilterChange({ search: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="flex gap-2 mb-4">
                      {[...Array(3)].map((_, j) => (
                        <div key={j} className="h-6 w-16 bg-gray-200 rounded-full"></div>
                      ))}
                    </div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : projects.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <div className="flex gap-2">
                      {[...Array(pagination.totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => handlePageChange(i + 1)}
                          className={`px-4 py-2 rounded-lg ${
                            pagination.page === i + 1
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('empty.title')}</h3>
                <p className="text-gray-600">{t('empty.description')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}