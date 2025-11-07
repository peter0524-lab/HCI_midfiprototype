import { Conversation } from '../types';
import { mockChatHistory } from '../data/mockData';

class ConversationModel {
  private conversations: Conversation[] = [...mockChatHistory];

  getAll(): Conversation[] {
    return this.conversations;
  }

  getByContactId(contactId: string): Conversation[] {
    return this.conversations.filter(c => c.contactId === contactId);
  }

  getById(id: string): Conversation | undefined {
    return this.conversations.find(c => c.id === id);
  }

  create(conversation: Omit<Conversation, 'id'>): Conversation {
    const newConversation: Conversation = {
      ...conversation,
      id: Date.now().toString()
    };
    this.conversations.push(newConversation);
    return newConversation;
  }

  update(id: string, conversation: Conversation): Conversation | null {
    const index = this.conversations.findIndex(c => c.id === id);
    if (index === -1) return null;

    this.conversations[index] = conversation;
    return this.conversations[index];
  }
}

export const conversationModel = new ConversationModel();

