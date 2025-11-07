import React, { useState } from 'react';
import type { Contact, View, Gift, OcrData, Message, Conversation, User, Event } from '../types';
import { AnimatePresence } from 'framer-motion';
import { BottomNav } from '../components/common/BottomNav';
import { ContactList } from '../components/contact/ContactList';
import { AddContactForm } from '../components/contact/AddContactForm';
import { ContactDetail } from '../components/contact/ContactDetail';
import { GiftChat } from '../components/gift/GiftChat';
import { GiftHistory } from '../components/gift/GiftHistory';
import { MyProfile } from '../components/profile/MyProfile';
import { CalendarView } from '../components/calendar/CalendarView';
import { OcrScanner } from '../components/contact/OcrScanner';
import { ChatHistory } from '../components/chat/ChatHistory';
import { EditProfileForm } from '../components/profile/EditProfileForm';
import { EventForm } from '../components/calendar/EventForm';


interface MainScreenProps {
  contacts: Contact[];
  addContact: (contact: Omit<Contact, 'id' | 'giftHistory'>) => void;
  updateContact: (contact: Contact) => void;
  deleteContact: (contactId: string) => void;
  selectedContact: Contact | null;
  setSelectedContact: (contact: Contact | null) => void;
  addGiftToHistory: (contactId: string, gift: Gift) => void;
  ocrData: OcrData | null;
  setOcrData: (data: OcrData | null) => void;
  chatHistory: Conversation[];
  saveChatHistory: (contactId: string, messages: Message[], conversationId?: string) => void;
  userProfile: User;
  updateUserProfile: (user: User) => void;
  events: Event[];
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (eventId: string) => void;
}

export const MainScreen: React.FC<MainScreenProps> = (props) => {
  const { contacts, addContact, updateContact, deleteContact, selectedContact, setSelectedContact, addGiftToHistory, ocrData, setOcrData, chatHistory, saveChatHistory, userProfile, updateUserProfile, events, addEvent, updateEvent, deleteEvent } = props;
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [chatBackDestination, setChatBackDestination] = useState<View>('contactDetail');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleAddContact = (contact: Omit<Contact, 'id' | 'giftHistory'>) => {
    addContact(contact);
    setCurrentView('home');
  };

  const handleUpdateContact = (contact: Contact) => {
    updateContact(contact);
    setCurrentView('contactDetail');
  };

  const handleDeleteContact = (contactId: string) => {
    deleteContact(contactId);
    setCurrentView('home');
  };

  const handleUpdateProfile = (user: User) => {
    updateUserProfile(user);
    setCurrentView('myProfile');
  };
  
  const handleSaveEvent = (event: Omit<Event, 'id'> | Event) => {
    if ('id' in event) {
        updateEvent(event);
    } else {
        addEvent(event);
    }
    setCurrentView('calendar');
  };

  const handleDeleteEvent = (eventId: string) => {
      deleteEvent(eventId);
      setCurrentView('calendar');
  }

  const handleScanComplete = (data: OcrData) => {
    setOcrData(data);
    setCurrentView('addContact');
  };
  
  const handleSelectConversation = (conversation: Conversation) => {
    const contact = contacts.find(c => c.id === conversation.contactId);
    if (contact) {
      setSelectedContact(contact);
      setSelectedConversation(conversation);
      setChatBackDestination('chatHistory');
      setCurrentView('chat');
    }
  };
  
  const handleNewRecommendation = () => {
    if (!selectedContact) return;

    const contactConversations = chatHistory
        .filter(c => c.contactId === selectedContact.id)
        .sort((a, b) => {
            const lastMsgA = a.messages[a.messages.length - 1]?.timestamp || 0;
            const lastMsgB = b.messages[b.messages.length - 1]?.timestamp || 0;
            return lastMsgB - lastMsgA;
        });
    
    const lastConversation = contactConversations[0];
    
    let conversationToResume: Conversation | null = null;
    if (lastConversation) {
        const hasSelectedGift = lastConversation.messages.some(m => m.type === 'ai' && m.selectedGiftName);
        if (!hasSelectedGift) {
            conversationToResume = lastConversation;
        }
    }

    if (conversationToResume) {
        setSelectedConversation(conversationToResume);
    } else {
        const newConversation: Conversation = {
            id: Date.now().toString(),
            contactId: selectedContact.id,
            messages: [
                { 
                    type: 'ai_intro', 
                    text: `안녕하세요! ${selectedContact.name}님을 위한 선물을 추천해드릴게요. 예산이나 특별한 상황을 알려주세요.`, 
                    timestamp: Date.now() 
                }
            ],
        };
        saveChatHistory(selectedContact.id, newConversation.messages, newConversation.id);
        setSelectedConversation(newConversation);
    }
    
    setChatBackDestination('contactDetail');
    setCurrentView('chat');
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <ContactList contacts={contacts} onSelectContact={(c) => {setSelectedContact(c); setCurrentView('contactDetail');}} onAdd={() => {setOcrData(null); setCurrentView('addContact');}} />;
      case 'calendar':
        return <CalendarView events={events} onAddEvent={() => {setSelectedEvent(null); setCurrentView('eventForm')}} onSelectEvent={(e) => {setSelectedEvent(e); setCurrentView('eventForm')}} />;
      case 'myProfile':
        return <MyProfile user={userProfile} contacts={contacts} onEdit={() => setCurrentView('editProfile')} />;
      case 'editProfile':
        return <EditProfileForm user={userProfile} onSave={handleUpdateProfile} onBack={() => setCurrentView('myProfile')} />;
      case 'addContact':
        return <AddContactForm onAddContact={handleAddContact} onBack={() => setCurrentView('home')} onScan={() => setCurrentView('ocrScanner')} initialData={ocrData} />;
      case 'editContact':
        return <AddContactForm existingContact={selectedContact} onUpdateContact={handleUpdateContact} onAddContact={()=>{}} onBack={() => setCurrentView('contactDetail')} onScan={() => {}} />;
      case 'ocrScanner':
        return <OcrScanner onBack={() => setCurrentView('addContact')} onScanComplete={handleScanComplete} />;
      case 'contactDetail':
        if (selectedContact) {
          return <ContactDetail 
                    contact={selectedContact} 
                    onBack={() => {setCurrentView('home'); setSelectedContact(null);}}
                    onRecommendGift={handleNewRecommendation}
                    onViewHistory={() => setCurrentView('history')}
                    onEdit={() => setCurrentView('editContact')}
                    onDelete={handleDeleteContact}
                  />;
        }
        return null;
      case 'chat':
        if (selectedContact) {
            return <GiftChat 
                contact={selectedContact} 
                onBack={() => setCurrentView(chatBackDestination)}
                addGiftToHistory={addGiftToHistory}
                initialMessages={selectedConversation ? selectedConversation.messages : []}
                onSaveHistory={saveChatHistory}
                conversationId={selectedConversation?.id}
            />;
        }
        return null;
      case 'history':
        if (selectedContact) {
            return <GiftHistory contact={selectedContact} onBack={() => setCurrentView('contactDetail')} />;
        }
        return null;
      case 'chatHistory':
        return <ChatHistory 
                  chatHistory={chatHistory}
                  contacts={contacts}
                  onSelectConversation={handleSelectConversation}
                />;
      case 'eventForm':
        return <EventForm event={selectedEvent} onSave={handleSaveEvent} onBack={() => setCurrentView('calendar')} onDelete={handleDeleteEvent} />;
      default:
        return <ContactList contacts={contacts} onSelectContact={(c) => {setSelectedContact(c); setCurrentView('contactDetail');}} onAdd={() => setCurrentView('addContact')} />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="flex-grow overflow-y-auto">
        <AnimatePresence mode="wait">
            {renderCurrentView()}
        </AnimatePresence>
      </div>
      <BottomNav currentView={currentView} onViewChange={setCurrentView} />
    </div>
  );
};