import { useState, useEffect } from 'react';
import api from '@/lib/api';

export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  skills: string[];
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Rating {
  id: string;
  senderId: string;
  receiverId: string;
  projectId?: string;
  rating: number;
  comment?: string;
  createdAt: string;
  sender: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
}

export const useUser = (userId: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/users/${userId}`);
        setUser(response.data.data.user);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return { user, loading };
};

export const useUserRatings = (userId: string) => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchRatings = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/ratings/user/${userId}`);
        setRatings(response.data.data.ratings);
        setAverageRating(response.data.data.averageRating);
      } catch (error) {
        console.error('Failed to fetch user ratings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [userId]);

  return { ratings, averageRating, loading };
};

export const useTopContributors = (limit: number = 6) => {
  const [contributors, setContributors] = useState<Array<User & { averageRating: number; totalRatings: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopContributors = async () => {
      try {
        // This would need a specific endpoint in the backend
        // For now, we'll simulate with sample data
        const sampleContributors = [
          {
            id: '1',
            username: 'johndoe',
            firstName: 'John',
            lastName: 'Doe',
            bio: 'Full-stack developer with 5+ years experience',
            skills: ['React', 'Node.js', 'TypeScript', 'Python'],
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            averageRating: 4.8,
            totalRatings: 24,
            email: '',
            isActive: true,
            createdAt: '',
            updatedAt: '',
          },
          {
            id: '2',
            username: 'janesmith',
            firstName: 'Jane',
            lastName: 'Smith',
            bio: 'Frontend specialist and UI/UX designer',
            skills: ['React', 'Vue.js', 'CSS', 'Figma'],
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
            averageRating: 4.9,
            totalRatings: 18,
            email: '',
            isActive: true,
            createdAt: '',
            updatedAt: '',
          },
          {
            id: '3',
            username: 'mikewilson',
            firstName: 'Mike',
            lastName: 'Wilson',
            bio: 'Backend developer and DevOps engineer',
            skills: ['Python', 'Django', 'AWS', 'Docker'],
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            averageRating: 4.7,
            totalRatings: 31,
            email: '',
            isActive: true,
            createdAt: '',
            updatedAt: '',
          },
        ];
        
        setContributors(sampleContributors.slice(0, limit));
      } catch (error) {
        console.error('Failed to fetch top contributors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopContributors();
  }, [limit]);

  return { contributors, loading };
};