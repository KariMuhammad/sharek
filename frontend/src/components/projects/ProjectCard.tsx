'use client'

import Link from 'next/link'
import { Star, Users, Clock, ExternalLink, DollarSign } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'

interface Project {
  id: string
  title: string
  description: string
  author: {
    id: string
    username: string
    avatar?: string
  }
  technologies: string[]
  contributors: number
  rating: number
  status: string
  createdAt: string
  githubLink?: string
  price?: number
}

interface ProjectCardProps {
  project: Project
  viewMode?: 'grid' | 'list'
}

export function ProjectCard({ project, viewMode = 'grid' }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'success'
      case 'PENDING':
        return 'warning'
      case 'FULFILLED':
        return 'primary'
      default:
        return 'secondary'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Badge variant={getStatusColor(project.status)} size="sm">
                  {project.status}
                </Badge>
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{project.rating}</span>
                </div>
                {project.price && (
                  <div className="flex items-center space-x-1 text-sm text-green-600">
                    <DollarSign className="w-4 h-4" />
                    <span>${project.price}</span>
                  </div>
                )}
              </div>
              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
              <Link href={`/projects/${project.id}`}>
                {project.title}
              </Link>
            </h3>

            <p className="text-gray-600 mb-4 line-clamp-2">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {project.technologies.slice(0, 4).map((tech) => (
                <Badge key={tech} variant="secondary" size="sm">
                  {tech}
                </Badge>
              ))}
              {project.technologies.length > 4 && (
                <Badge variant="secondary" size="sm">
                  +{project.technologies.length - 4}
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar
                  src={project.author.avatar}
                  alt={project.author.username}
                  size="sm"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {project.author.username}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{project.contributors} contributors</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(project.createdAt)}</span>
                    </span>
                  </div>
                </div>
              </div>

              <Button
                as={Link}
                href={`/projects/${project.id}`}
                variant="outline"
                size="sm"
              >
                View Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <Badge variant={getStatusColor(project.status)} size="sm">
          {project.status}
        </Badge>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{project.rating}</span>
          </div>
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {project.price && (
        <div className="flex items-center space-x-1 text-green-600 mb-3">
          <DollarSign className="w-4 h-4" />
          <span className="font-semibold">${project.price}</span>
        </div>
      )}

      <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
        <Link href={`/projects/${project.id}`}>
          {project.title}
        </Link>
      </h3>

      <p className="text-gray-600 mb-4 line-clamp-3">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {project.technologies.slice(0, 3).map((tech) => (
          <Badge key={tech} variant="secondary" size="sm">
            {tech}
          </Badge>
        ))}
        {project.technologies.length > 3 && (
          <Badge variant="secondary" size="sm">
            +{project.technologies.length - 3}
          </Badge>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar
            src={project.author.avatar}
            alt={project.author.username}
            size="sm"
          />
          <div>
            <p className="text-sm font-medium text-gray-900">
              {project.author.username}
            </p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span className="flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span>{project.contributors}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{formatDate(project.createdAt)}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}