import api from './api';
import { Conversation, Message } from '../types';

export const chatApi = {
  // Get all conversations
  getAll: async (): Promise<Conversation[]> => {
    const response = await api.get('/chats');
    return response.data.data;
  },

  // Get conversations by contact ID
  getByContactId: async (contactId: string): Promise<Conversation[]> => {
    const response = await api.get(`/chats/${contactId}`);
    return response.data.data;
  },

  // Save conversation
  save: async (contactId: string, messages: Message[], conversationId?: string): Promise<Conversation> => {
    const response = await api.post(`/chats/${contactId}`, { messages, conversationId });
    return response.data.data;
  },
};

