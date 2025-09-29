'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

interface ProjectFiltersProps {
  filters: {
    status: string
    technologies: string[]
    priceRange: number[]
    sortBy: string
  }
  onFilterChange: (filters: any) => void
}

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'FULFILLED', label: 'Fulfilled' },
]

const technologyOptions = [
  'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Node.js',
  'Python', 'Django', 'Flask', 'Java', 'Spring', 'C#', '.NET',
  'PHP', 'Laravel', 'Ruby', 'Rails', 'Go', 'Rust', 'Swift',
  'Kotlin', 'Flutter', 'React Native', 'MongoDB', 'PostgreSQL',
  'MySQL', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP'
]

export function ProjectFilters({ filters, onFilterChange }: ProjectFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters)

  const handleStatusChange = (status: string) => {
    const newFilters = { ...localFilters, status }
    setLocalFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleTechnologyToggle = (tech: string) => {
    const technologies = localFilters.technologies.includes(tech)
      ? localFilters.technologies.filter(t => t !== tech)
      : [...localFilters.technologies, tech]
    
    const newFilters = { ...localFilters, technologies }
    setLocalFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handlePriceRangeChange = (range: number[]) => {
    const newFilters = { ...localFilters, priceRange: range }
    setLocalFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const newFilters = {
      status: '',
      technologies: [],
      priceRange: [0, 1000],
      sortBy: 'newest',
    }
    setLocalFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <div className="space-y-6">
      {/* Status Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Status</h3>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleStatusChange(option.value)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                localFilters.status === option.value
                  ? 'bg-primary-100 border-primary-300 text-primary-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Technology Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Technologies</h3>
        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
          {technologyOptions.map((tech) => (
            <button
              key={tech}
              onClick={() => handleTechnologyToggle(tech)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                localFilters.technologies.includes(tech)
                  ? 'bg-primary-100 border-primary-300 text-primary-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tech}
            </button>
          ))}
        </div>
        {localFilters.technologies.length > 0 && (
          <div className="mt-3">
            <p className="text-sm text-gray-600 mb-2">Selected technologies:</p>
            <div className="flex flex-wrap gap-1">
              {localFilters.technologies.map((tech) => (
                <Badge key={tech} variant="primary" size="sm">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Price Range Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-xs text-gray-600 mb-1">Min Price</label>
              <input
                type="number"
                min="0"
                max="10000"
                value={localFilters.priceRange[0]}
                onChange={(e) => handlePriceRangeChange([parseInt(e.target.value) || 0, localFilters.priceRange[1]])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-600 mb-1">Max Price</label>
              <input
                type="number"
                min="0"
                max="10000"
                value={localFilters.priceRange[1]}
                onChange={(e) => handlePriceRangeChange([localFilters.priceRange[0], parseInt(e.target.value) || 1000])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          <div className="text-sm text-gray-600">
            ${localFilters.priceRange[0]} - ${localFilters.priceRange[1]}
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      <div className="pt-4 border-t border-gray-200">
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          className="w-full"
        >
          Clear All Filters
        </Button>
      </div>
    </div>
  )
}