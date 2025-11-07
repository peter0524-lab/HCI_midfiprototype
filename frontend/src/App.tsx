import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SplashScreen } from './components/auth/SplashScreen';
import { LoginScreen } from './components/auth/LoginScreen';
import { MainScreen } from './pages/MainScreen';
import type { Contact, Gift, OcrData, Message, Conversation, User, Event } from './types';
import { contactApi } from './services/contactApi';
import { eventApi } from './services/eventApi';
import { chatApi } from './services/chatApi';
import { authApi } from './services/authApi';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [ocrData, setOcrData] = useState<OcrData | null>(null);
  const [chatHistory, setChatHistory] = useState<Conversation[]>([]);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);

  // Load initial data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        const [contactsData, eventsData, chatsData, profileData] = await Promise.all([
          contactApi.getAll(),
          eventApi.getAll(),
          chatApi.getAll(),
          authApi.getProfile()
        ]);
        setContacts(contactsData);
        setEvents(eventsData);
        setChatHistory(chatsData);
        setUserProfile(profileData);
      } catch (error) {
        console.error('Failed to load initial data:', error);
      } finally {
        setTimeout(() => setIsLoading(false), 2000);
      }
    };
    loadData();
  }, []);

  const handleLogin = async () => {
    try {
      await authApi.login();
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const addContact = async (newContact: Omit<Contact, 'id' | 'giftHistory'>) => {
    try {
      const created = await contactApi.create(newContact);
      setContacts(prev => [...prev, created]);
      setOcrData(null);
    } catch (error) {
      console.error('Failed to add contact:', error);
    }
  };
  
  const updateContact = async (updatedContact: Contact) => {
    try {
      const updated = await contactApi.update(updatedContact.id, updatedContact);
      setContacts(prev => prev.map(c => c.id === updated.id ? updated : c));
      if (selectedContact?.id === updated.id) {
        setSelectedContact(updated);
      }
    } catch (error) {
      console.error('Failed to update contact:', error);
    }
  };

  const deleteContact = async (contactId: string) => {
    try {
      await contactApi.delete(contactId);
      setContacts(prev => prev.filter(c => c.id !== contactId));
      setSelectedContact(null);
    } catch (error) {
      console.error('Failed to delete contact:', error);
    }
  };

  const addGiftToHistory = (contactId: string, gift: Gift) => {
    setContacts(prev => prev.map(c => 
      c.id === contactId 
        ? { ...c, giftHistory: [...c.giftHistory, gift] } 
        : c
    ));
    if (selectedContact && selectedContact.id === contactId) {
      setSelectedContact(prev => prev ? { ...prev, giftHistory: [...prev.giftHistory, gift] } : null);
    }
  };

  const updateChatHistory = async (contactId: string, messages: Message[], conversationId?: string) => {
    try {
      const saved = await chatApi.save(contactId, messages, conversationId);
      setChatHistory(prev => {
        const existingIndex = prev.findIndex(c => c.id === saved.id);
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex] = saved;
          return updated;
        }
        return [...prev, saved];
      });
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  };

  const updateUserProfile = async (updatedProfile: User) => {
    try {
      const updated = await authApi.updateProfile(updatedProfile);
      setUserProfile(updated);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const addEvent = async (newEvent: Omit<Event, 'id'>) => {
    try {
      const created = await eventApi.create(newEvent);
      setEvents(prev => [...prev, created]);
    } catch (error) {
      console.error('Failed to add event:', error);
    }
  };

  const updateEvent = async (updatedEvent: Event) => {
    try {
      const updated = await eventApi.update(updatedEvent.id, updatedEvent);
      setEvents(prev => prev.map(e => e.id === updated.id ? updated : e));
    } catch (error) {
      console.error('Failed to update event:', error);
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      await eventApi.delete(eventId);
      setEvents(prev => prev.filter(e => e.id !== eventId));
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  const renderContent = () => {
    if (!isAuthenticated) {
      return (
        <AnimatePresence>
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoginScreen onLogin={handleLogin} />
          </motion.div>
        </AnimatePresence>
      );
    }
    return <MainScreen 
             contacts={contacts} 
             addContact={addContact}
             updateContact={updateContact}
             deleteContact={deleteContact}
             selectedContact={selectedContact}
             setSelectedContact={setSelectedContact}
             addGiftToHistory={addGiftToHistory}
             ocrData={ocrData}
             setOcrData={setOcrData}
             chatHistory={chatHistory}
             saveChatHistory={updateChatHistory}
             userProfile={userProfile}
             updateUserProfile={updateUserProfile}
             events={events}
             addEvent={addEvent}
             updateEvent={updateEvent}
             deleteEvent={deleteEvent}
           />;
  };

  return (
    <div className="relative h-screen w-screen bg-white text-gray-800 overflow-hidden font-sans">
      <AnimatePresence>
        {isLoading ? (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SplashScreen />
          </motion.div>
        ) : (
          renderContent()
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
