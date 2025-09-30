import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

export interface Project {
  id: string;
  title: string;
  description: string;
  purpose?: string;
  technologies: string[];
  tasks: string[];
  githubLink?: string;
  status: 'PENDING' | 'ACTIVE' | 'FULFILLED' | 'CANCELLED';
  price?: number;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
  members?: Array<{
    id: string;
    userId: string;
    role: 'AUTHOR' | 'CONTRIBUTOR' | 'ADMIN';
  }>;
  _count?: {
    contributions: number;
    members: number;
  };
}

interface ProjectFilters {
  search?: string;
  status?: string;
  technologies?: string[];
  page?: number;
  limit?: number;
}

export const useProjects = (filters: ProjectFilters = {}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.technologies?.length) {
        filters.technologies.forEach(tech => params.append('technologies', tech));
      }
      params.append('page', (filters.page || 1).toString());
      params.append('limit', (filters.limit || 12).toString());

      const response = await api.get(`/projects?${params.toString()}`);
      setProjects(response.data.data);
      setPagination(response.data.pagination);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to fetch projects');
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [filters.search, filters.status, filters.technologies, filters.page, filters.limit]);

  return {
    projects,
    loading,
    error,
    pagination,
    refetch: fetchProjects,
  };
};

export const useTrendingProjects = (limit: number = 6) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await api.get(`/projects/trending?limit=${limit}`);
        setProjects(response.data.data.projects);
      } catch (error) {
        console.error('Failed to fetch trending projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, [limit]);

  return { projects, loading };
};

export const useProject = (projectId: string) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;

    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/projects/${projectId}`);
        setProject(response.data.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.error?.message || 'Failed to fetch project');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  return { project, loading, error };
};

export const useCreateProject = () => {
  const [loading, setLoading] = useState(false);

  const createProject = async (projectData: Partial<Project>) => {
    try {
      setLoading(true);
      const response = await api.post('/projects', projectData);
      toast.success('Project created successfully!');
      return response.data.data.project;
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to create project');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { createProject, loading };
};