import api from './api';
import { User } from '../types';

export const authApi = {
  // Login
  login: async (): Promise<void> => {
    await api.post('/auth/login');
  },

  // Get user profile
  getProfile: async (): Promise<User> => {
    const response = await api.get('/auth/profile');
    return response.data.data;
  },

  // Update profile
  updateProfile: async (user: Partial<User>): Promise<User> => {
    const response = await api.put('/auth/profile', user);
    return response.data.data;
  },
};

