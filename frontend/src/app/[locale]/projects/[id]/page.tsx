'use client';

import { useTranslations } from 'next-intl';
import { useProject } from '@/hooks/useProjects';
import { useContributions } from '@/hooks/useContributions';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { 
  Github, 
  Users, 
  Calendar, 
  DollarSign, 
  MessageCircle,
  ExternalLink,
  Star
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import { toast } from 'react-hot-toast';

interface ProjectPageProps {
  params: { id: string; locale: string };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const t = useTranslations('project');
  const { project, loading, error } = useProject(params.id);
  const { requestContribution } = useContributions();
  const { isAuthenticated, user } = useAuth();
  const [requesting, setRequesting] = useState(false);
  const [message, setMessage] = useState('');

  const handleRequestContribution = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to request contribution');
      return;
    }

    try {
      setRequesting(true);
      await requestContribution(params.id, message);
      setMessage('');
    } catch (error) {
      // Error handled in hook
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm p-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="h-32 bg-gray-200 rounded mb-6"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
              </div>
              <div>
                <div className="h-48 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project not found</h1>
          <p className="text-gray-600 mb-8">The project you're looking for doesn't exist.</p>
          <Button href="/projects">Back to Projects</Button>
        </div>
      </div>
    );
  }

  const isAuthor = user?.id === project.authorId;
  const hasRequested = false; // This would come from contributions data

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-8 border-b">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant={project.status === 'ACTIVE' ? 'success' : 'secondary'}>
                    {project.status.toLowerCase()}
                  </Badge>
                  {project.price && (
                    <div className="flex items-center gap-1 text-green-600">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-medium">${project.price}</span>
                    </div>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{project.title}</h1>
                <p className="text-lg text-gray-600">{project.description}</p>
              </div>
            </div>

            {/* Author Info */}
            <div className="flex items-center gap-4 mb-6">
              <Avatar
                src={project.author.avatar}
                alt={project.author.username}
                size="md"
              />
              <div>
                <h3 className="font-medium text-gray-900">
                  {project.author.firstName} {project.author.lastName}
                </h3>
                <p className="text-sm text-gray-600">@{project.author.username}</p>
              </div>
            </div>

            {/* Action Buttons */}
            {!isAuthor && (
              <div className="flex gap-4">
                <Button
                  onClick={handleRequestContribution}
                  loading={requesting}
                  disabled={hasRequested}
                  className="flex-1 sm:flex-none"
                >
                  {hasRequested ? t('joinRequested') : t('requestToJoin')}
                </Button>
                {project.githubLink && (
                  <Button variant="outline" href={project.githubLink} target="_blank">
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Purpose */}
              {project.purpose && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('purpose')}</h2>
                  <p className="text-gray-600">{project.purpose}</p>
                </div>
              )}

              {/* Technologies */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('technologies')}</h2>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Tasks */}
              {project.tasks.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('tasks')}</h2>
                  <ul className="space-y-2">
                    {project.tasks.map((task, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-600">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Contribution Request Form */}
              {!isAuthor && isAuthenticated && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Send a message with your request
                  </h3>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell the author why you'd like to contribute to this project..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                  />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Project Stats */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Project Info</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {project._count?.members || 0} members
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {project._count?.contributions || 0} contributions
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Created {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Team Members */}
              {project.members && project.members.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">{t('members')}</h3>
                  <div className="space-y-3">
                    {project.members.map((member) => (
                      <div key={member.id} className="flex items-center gap-3">
                        <Avatar size="sm" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Member</p>
                          <p className="text-xs text-gray-600">{member.role.toLowerCase()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}