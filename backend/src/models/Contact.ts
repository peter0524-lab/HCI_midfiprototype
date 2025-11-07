import { Contact } from '../types';
import { mockContacts } from '../data/mockData';

class ContactModel {
  private contacts: Contact[] = [...mockContacts];

  getAll(): Contact[] {
    return this.contacts;
  }

  getById(id: string): Contact | undefined {
    return this.contacts.find(c => c.id === id);
  }

  create(contact: Omit<Contact, 'id' | 'giftHistory'>): Contact {
    const newContact: Contact = {
      ...contact,
      id: Date.now().toString(),
      giftHistory: []
    };
    this.contacts.push(newContact);
    return newContact;
  }

  update(id: string, data: Partial<Contact>): Contact | null {
    const index = this.contacts.findIndex(c => c.id === id);
    if (index === -1) return null;

    this.contacts[index] = { ...this.contacts[index], ...data };
    return this.contacts[index];
  }

  delete(id: string): boolean {
    const index = this.contacts.findIndex(c => c.id === id);
    if (index === -1) return false;

    this.contacts.splice(index, 1);
    return true;
  }

  addGiftToHistory(contactId: string, gift: { name: string; price: string; date: string }): Contact | null {
    const contact = this.getById(contactId);
    if (!contact) return null;

    contact.giftHistory.push(gift);
    return contact;
  }
}

export const contactModel = new ContactModel();

