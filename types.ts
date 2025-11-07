export interface Gift {
  name: string;
  price: string;
  date: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  tag: string;
  tagColor: string;
}

export interface Contact {
  id: string;
  name: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  notes?: string;
  giftHistory: Gift[];
}

export interface User {
  name: string;
  title: string;
  company: string;
  phone: string;
  email: string;
}

export type OcrData = Partial<Omit<Contact, 'id' | 'giftHistory'>>;

export type View = 'home' | 'chat' | 'history' | 'addContact' | 'contactDetail' | 'myProfile' | 'calendar' | 'ocrScanner' | 'chatHistory' | 'editContact' | 'editProfile' | 'eventForm';

export interface GiftRecommendation {
  name:string;
  description: string;
  price: string;
}

export type Message = 
  | { type: 'user'; text: string; timestamp?: number; }
  | { type: 'ai'; recommendations: GiftRecommendation[]; timestamp?: number; selectedGiftName?: string; }
  | { type: 'ai_intro'; text: string; timestamp?: number; };

export interface Conversation {
  id: string;
  contactId: string;
  messages: Message[];
}