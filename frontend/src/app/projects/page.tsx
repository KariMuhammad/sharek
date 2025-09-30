'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Grid2x2 as Grid, List, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { ProjectFilters } from '@/components/projects/ProjectFilters'
import Link from 'next/link'

// Mock data - replace with actual API call
const mockProjects = [
  {
    id: '1',
    title: 'AI-Powered Code Review Tool',
    description: 'An intelligent code review assistant that helps developers write better code using machine learning algorithms.',
    author: {
      id: '1',
      username: 'alexdev',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    },
    technologies: ['Python', 'TensorFlow', 'React', 'Node.js'],
    contributors: 8,
    rating: 4.8,
    status: 'ACTIVE',
    createdAt: '2024-01-15',
    githubLink: 'https://github.com/example/ai-code-review',
    price: 500,
  },
  {
    id: '2',
    title: 'Sustainable Energy Dashboard',
    description: 'Real-time monitoring dashboard for renewable energy systems with predictive analytics and optimization.',
    author: {
      id: '2',
      username: 'greentech',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
    },
    technologies: ['Vue.js', 'D3.js', 'Python', 'PostgreSQL'],
    contributors: 12,
    rating: 4.9,
    status: 'ACTIVE',
    createdAt: '2024-01-10',
    githubLink: 'https://github.com/example/energy-dashboard',
    price: 750,
  },
  // Add more mock projects...
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState(mockProjects)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    status: '',
    technologies: [] as string[],
    priceRange: [0, 1000],
    sortBy: 'newest',
  })

  // Simulate API call
  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      setProjects(mockProjects)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [filters, searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search logic
  }

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters)
  }

  const filteredProjects = projects.filter(project => {
    if (searchQuery && !project.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (filters.status && project.status !== filters.status) {
      return false
    }
    if (filters.technologies.length > 0) {
      const hasMatchingTech = filters.technologies.some(tech => 
        project.technologies.includes(tech)
      )
      if (!hasMatchingTech) return false
    }
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Explore Projects
            </h1>
            <p className="text-gray-600">
              Discover amazing projects and find your next collaboration opportunity
            </p>
          </div>
          <div className="mt-4 lg:mt-0">
            <Button as={Link} href="/projects/new" variant="primary">
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search projects by title, description, or technology..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <div className="flex items-center space-x-1 border border-gray-300 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>

          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <ProjectFilters
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <p className="text-gray-600">
              {filteredProjects.length} projects found
            </p>
            {(searchQuery || filters.status || filters.technologies.length > 0) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('')
                  setFilters({
                    status: '',
                    technologies: [],
                    priceRange: [0, 1000],
                    sortBy: 'newest',
                  })
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
          
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="popular">Most popular</option>
            <option value="rating">Highest rated</option>
          </select>
        </div>

        {/* Projects Grid/List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="flex space-x-2 mb-4">
                  <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="h-8 bg-gray-200 rounded-full w-8"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No projects found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or create a new project
            </p>
            <Button as={Link} href="/projects/new" variant="primary">
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
          }>
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}

        {/* Load More */}
        {filteredProjects.length > 0 && !loading && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Projects
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}