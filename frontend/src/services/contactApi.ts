import api from './api';
import { Contact } from '../types';

export const contactApi = {
  // Get all contacts
  getAll: async (): Promise<Contact[]> => {
    const response = await api.get('/contacts');
    return response.data.data;
  },

  // Get contact by ID
  getById: async (id: string): Promise<Contact> => {
    const response = await api.get(`/contacts/${id}`);
    return response.data.data;
  },

  // Create new contact
  create: async (contact: Omit<Contact, 'id' | 'giftHistory'>): Promise<Contact> => {
    const response = await api.post('/contacts', contact);
    return response.data.data;
  },

  // Update contact
  update: async (id: string, contact: Partial<Contact>): Promise<Contact> => {
    const response = await api.put(`/contacts/${id}`, contact);
    return response.data.data;
  },

  // Delete contact
  delete: async (id: string): Promise<void> => {
    await api.delete(`/contacts/${id}`);
  },
};

