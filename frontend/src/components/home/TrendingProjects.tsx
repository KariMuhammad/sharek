'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Star, Users, Clock, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { motion } from 'framer-motion'

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
  },
  {
    id: '3',
    title: 'Decentralized Social Network',
    description: 'Building a privacy-focused social platform using blockchain technology and decentralized protocols.',
    author: {
      id: '3',
      username: 'cryptodev',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    },
    technologies: ['Solidity', 'React', 'IPFS', 'Web3.js'],
    contributors: 15,
    rating: 4.7,
    status: 'ACTIVE',
    createdAt: '2024-01-08',
    githubLink: 'https://github.com/example/decentral-social',
  },
]

export function TrendingProjects() {
  const [projects, setProjects] = useState(mockProjects)
  const [loading, setLoading] = useState(false)

  // Simulate API call
  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      setProjects(mockProjects)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

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

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Trending Projects
            </h2>
            <p className="text-xl text-gray-600">
              Discover the most popular projects in our community
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
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
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
          >
            Trending Projects
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Discover the most popular projects in our community and join the collaboration
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <Badge variant={getStatusColor(project.status)} size="sm">
                  {project.status}
                </Badge>
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{project.rating}</span>
                </div>
              </div>

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
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button as={Link} href="/projects" variant="outline" size="lg">
            View All Projects
          </Button>
        </div>
      </div>
    </section>
  )
}