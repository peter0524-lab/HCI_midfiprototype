import api from './api';
import { Event } from '../types';

export const eventApi = {
  // Get all events
  getAll: async (): Promise<Event[]> => {
    const response = await api.get('/events');
    return response.data.data;
  },

  // Create event
  create: async (event: Omit<Event, 'id'>): Promise<Event> => {
    const response = await api.post('/events', event);
    return response.data.data;
  },

  // Update event
  update: async (id: string, event: Partial<Event>): Promise<Event> => {
    const response = await api.put(`/events/${id}`, event);
    return response.data.data;
  },

  // Delete event
  delete: async (id: string): Promise<void> => {
    await api.delete(`/events/${id}`);
  },
};

