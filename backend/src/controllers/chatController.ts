import { Request, Response } from 'express';
import { conversationModel } from '../models/Conversation';

export const getAllConversations = (req: Request, res: Response) => {
  try {
    const conversations = conversationModel.getAll();
    res.json({ success: true, data: conversations });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch conversations' });
  }
};

export const getConversationsByContact = (req: Request, res: Response) => {
  try {
    const { contactId } = req.params;
    const conversations = conversationModel.getByContactId(contactId);
    res.json({ success: true, data: conversations });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch conversations' });
  }
};

export const saveConversation = (req: Request, res: Response) => {
  try {
    const { contactId } = req.params;
    const { messages, conversationId } = req.body;
    
    if (!messages) {
      return res.status(400).json({ success: false, error: 'messages are required' });
    }
    
    if (conversationId) {
      // Update existing conversation
      const existing = conversationModel.getById(conversationId);
      if (existing) {
        const updated = conversationModel.update(conversationId, {
          ...existing,
          messages
        });
        return res.json({ success: true, data: updated });
      }
    }
    
    // Create new conversation
    const newConversation = conversationModel.create({
      contactId,
      messages
    });
    
    res.status(201).json({ success: true, data: newConversation });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to save conversation' });
  }
};

