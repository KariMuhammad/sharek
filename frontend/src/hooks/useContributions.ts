import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

export interface Contribution {
  id: string;
  projectId: string;
  userId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
  message?: string;
  createdAt: string;
  updatedAt: string;
  project: {
    id: string;
    title: string;
    author: {
      id: string;
      username: string;
      firstName?: string;
      lastName?: string;
      avatar?: string;
    };
  };
  user?: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    skills?: string[];
  };
}

export const useContributions = () => {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContributions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/contributions/my-requests');
      setContributions(response.data.data.contributions);
    } catch (error) {
      console.error('Failed to fetch contributions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContributions();
  }, []);

  const requestContribution = async (projectId: string, message?: string) => {
    try {
      await api.post('/contributions', { projectId, message });
      toast.success('Contribution request sent!');
      fetchContributions();
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to send request');
      throw error;
    }
  };

  const cancelContribution = async (contributionId: string) => {
    try {
      await api.delete(`/contributions/${contributionId}`);
      toast.success('Contribution request cancelled');
      fetchContributions();
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to cancel request');
    }
  };

  return {
    contributions,
    loading,
    requestContribution,
    cancelContribution,
    refetch: fetchContributions,
  };
};

export const useProjectContributions = (projectId: string) => {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjectContributions = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/contributions/project/${projectId}`);
      setContributions(response.data.data.contributions);
    } catch (error) {
      console.error('Failed to fetch project contributions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProjectContributions();
    }
  }, [projectId]);

  const updateContribution = async (contributionId: string, status: string, message?: string) => {
    try {
      await api.patch(`/contributions/${contributionId}`, { status, message });
      toast.success(`Contribution ${status.toLowerCase()}`);
      fetchProjectContributions();
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to update contribution');
    }
  };

  return {
    contributions,
    loading,
    updateContribution,
    refetch: fetchProjectContributions,
  };
};