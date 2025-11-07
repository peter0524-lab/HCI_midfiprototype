import { Request, Response } from 'express';
import { eventModel } from '../models/Event';

export const getAllEvents = (req: Request, res: Response) => {
  try {
    const events = eventModel.getAll();
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch events' });
  }
};

export const createEvent = (req: Request, res: Response) => {
  try {
    const eventData = req.body;
    const newEvent = eventModel.create(eventData);
    res.status(201).json({ success: true, data: newEvent });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create event' });
  }
};

export const updateEvent = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const eventData = req.body;
    const updatedEvent = eventModel.update(id, eventData);
    
    if (!updatedEvent) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }
    
    res.json({ success: true, data: updatedEvent });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update event' });
  }
};

export const deleteEvent = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = eventModel.delete(id);
    
    if (!success) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }
    
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete event' });
  }
};

