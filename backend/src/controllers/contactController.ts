import { Request, Response } from 'express';
import { contactModel } from '../models/Contact';

export const getAllContacts = (req: Request, res: Response) => {
  try {
    const contacts = contactModel.getAll();
    res.json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch contacts' });
  }
};

export const getContactById = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const contact = contactModel.getById(id);
    
    if (!contact) {
      return res.status(404).json({ success: false, error: 'Contact not found' });
    }
    
    res.json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch contact' });
  }
};

export const createContact = (req: Request, res: Response) => {
  try {
    const contactData = req.body;
    const newContact = contactModel.create(contactData);
    res.status(201).json({ success: true, data: newContact });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create contact' });
  }
};

export const updateContact = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const contactData = req.body;
    const updatedContact = contactModel.update(id, contactData);
    
    if (!updatedContact) {
      return res.status(404).json({ success: false, error: 'Contact not found' });
    }
    
    res.json({ success: true, data: updatedContact });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update contact' });
  }
};

export const deleteContact = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = contactModel.delete(id);
    
    if (!success) {
      return res.status(404).json({ success: false, error: 'Contact not found' });
    }
    
    res.json({ success: true, message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete contact' });
  }
};

