import { Event } from '../types';
import { mockEvents } from '../data/mockData';

class EventModel {
  private events: Event[] = [...mockEvents];

  getAll(): Event[] {
    return this.events;
  }

  getById(id: string): Event | undefined {
    return this.events.find(e => e.id === id);
  }

  create(event: Omit<Event, 'id'>): Event {
    const newEvent: Event = {
      ...event,
      id: Date.now().toString()
    };
    this.events.push(newEvent);
    return newEvent;
  }

  update(id: string, data: Partial<Event>): Event | null {
    const index = this.events.findIndex(e => e.id === id);
    if (index === -1) return null;

    this.events[index] = { ...this.events[index], ...data };
    return this.events[index];
  }

  delete(id: string): boolean {
    const index = this.events.findIndex(e => e.id === id);
    if (index === -1) return false;

    this.events.splice(index, 1);
    return true;
  }
}

export const eventModel = new EventModel();

