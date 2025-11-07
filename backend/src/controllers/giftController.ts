import { Request, Response } from 'express';
import { getGiftRecommendations, extractContactInfoFromImage } from '../services/geminiService';
import { contactModel } from '../models/Contact';

export const recommendGifts = async (req: Request, res: Response) => {
  try {
    const { contactId, prompt } = req.body;
    
    if (!contactId || !prompt) {
      return res.status(400).json({ 
        success: false, 
        error: 'contactId and prompt are required' 
      });
    }
    
    const contact = contactModel.getById(contactId);
    if (!contact) {
      return res.status(404).json({ success: false, error: 'Contact not found' });
    }
    
    const recommendations = await getGiftRecommendations(contact, prompt);
    res.json({ success: true, data: recommendations });
  } catch (error) {
    console.error('Gift recommendation error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate recommendations' });
  }
};

export const addGiftToHistory = (req: Request, res: Response) => {
  try {
    const { contactId } = req.params;
    const { name, price, date } = req.body;
    
    if (!name || !price || !date) {
      return res.status(400).json({ 
        success: false, 
        error: 'name, price, and date are required' 
      });
    }
    
    const updatedContact = contactModel.addGiftToHistory(contactId, { name, price, date });
    
    if (!updatedContact) {
      return res.status(404).json({ success: false, error: 'Contact not found' });
    }
    
    res.json({ success: true, data: updatedContact });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to add gift to history' });
  }
};

export const scanBusinessCard = async (req: Request, res: Response) => {
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ success: false, error: 'image is required' });
    }
    
    const ocrData = await extractContactInfoFromImage(image);
    res.json({ success: true, data: ocrData });
  } catch (error) {
    console.error('OCR error:', error);
    res.status(500).json({ success: false, error: 'Failed to scan business card' });
  }
};

