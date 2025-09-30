import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

interface User {
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

interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    isAuthenticated: false,
  });
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = Cookies.get('accessToken');
      if (!token) {
        setAuthState({ user: null, loading: false, isAuthenticated: false });
        return;
      }

      const response = await api.get('/auth/me');
      setAuthState({
        user: response.data.data.user,
        loading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      setAuthState({ user: null, loading: false, isAuthenticated: false });
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, accessToken, refreshToken } = response.data.data;

      Cookies.set('accessToken', accessToken);
      Cookies.set('refreshToken', refreshToken);

      setAuthState({
        user,
        loading: false,
        isAuthenticated: true,
      });

      toast.success('Login successful!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Login failed');
      throw error;
    }
  };

  const register = async (userData: {
    email: string;
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { user, accessToken, refreshToken } = response.data.data;

      Cookies.set('accessToken', accessToken);
      Cookies.set('refreshToken', refreshToken);

      setAuthState({
        user,
        loading: false,
        isAuthenticated: true,
      });

      toast.success('Registration successful!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Registration failed');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
    }

    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    setAuthState({ user: null, loading: false, isAuthenticated: false });
    toast.success('Logged out successfully');
    router.push('/');
  };

  const updateProfile = async (profileData: Partial<User>) => {
    try {
      const response = await api.put('/users/profile', profileData);
      setAuthState(prev => ({
        ...prev,
        user: response.data.data.user,
      }));
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Update failed');
      throw error;
    }
  };

  return {
    ...authState,
    login,
    register,
    logout,
    updateProfile,
    checkAuth,
  };
};