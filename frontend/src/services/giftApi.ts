import api from './api';
import { GiftRecommendation, Contact, OcrData } from '../types';

export const giftApi = {
  // Get gift recommendations from AI
  recommend: async (contactId: string, prompt: string): Promise<GiftRecommendation[]> => {
    const response = await api.post('/gifts/recommend', { contactId, prompt });
    return response.data.data;
  },

  // Add gift to contact's history
  addToHistory: async (contactId: string, gift: { name: string; price: string; date: string }): Promise<Contact> => {
    const response = await api.post(`/gifts/${contactId}`, gift);
    return response.data.data;
  },

  // Scan business card (OCR)
  scanBusinessCard: async (imageBase64: string): Promise<OcrData> => {
    const response = await api.post('/gifts/ocr/scan', { image: imageBase64 });
    return response.data.data;
  },
};

