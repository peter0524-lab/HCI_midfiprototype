import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SplashScreen } from './components/auth/SplashScreen';
import { LoginScreen } from './components/auth/LoginScreen';
import { MainScreen } from './pages/MainScreen';
import type { Contact, Gift, OcrData, Message, Conversation, User, Event } from './types';
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

  // Load initial data from API (disabled for MVP demo - refresh resets all data)
  useEffect(() => {
    const loadData = async () => {
      try {
        // For MVP: Don't load previous data, start fresh on every refresh
        // Load only user profile for display
        const profileData = await authApi.getProfile();
        setUserProfile(profileData);
        
        // Initialize with sample contacts for MVP demo
        const sampleContacts: Contact[] = [
          {
            id: '1',
            name: '박서준',
            company: '스타트업코리아',
            title: '대표이사',
            phone: '010-1234-5678',
            email: 'park@startup.kr',
            notes: '스타트업 액셀러레이터 운영 중. 혁신적인 제품을 좋아함',
            giftHistory: []
          },
          {
            id: '2',
            name: '이하나',
            company: '글로벌미디어',
            title: '팀장',
            phone: '010-2345-6789',
            email: 'lee@globalmedia.com',
            notes: '미디어 콘텐츠 제작 전문가. 감각적인 디자인 선호',
            giftHistory: []
          },
          {
            id: '3',
            name: '김민수',
            company: '디자인하우스',
            title: '센터장',
            phone: '010-3456-7890',
            email: 'kim@designhouse.com',
            notes: '미니멀리즘 인테리어 전문가. 심플하고 실용적인 것 선호',
            giftHistory: []
          }
        ];
        setContacts(sampleContacts);
        setEvents([]);
        setChatHistory([]);
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
      // For MVP: Create contact locally without saving to backend
      const created: Contact = {
        ...newContact,
        id: Date.now().toString(),
        giftHistory: []
      };
      setContacts(prev => [...prev, created]);
      setOcrData(null);
    } catch (error) {
      console.error('Failed to add contact:', error);
    }
  };
  
  const updateContact = async (updatedContact: Contact) => {
    try {
      // For MVP: Update contact locally without saving to backend
      setContacts(prev => prev.map(c => c.id === updatedContact.id ? updatedContact : c));
      if (selectedContact?.id === updatedContact.id) {
        setSelectedContact(updatedContact);
      }
    } catch (error) {
      console.error('Failed to update contact:', error);
    }
  };

  const deleteContact = async (contactId: string) => {
    try {
      // For MVP: Delete contact locally without saving to backend
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
      // For MVP: Save chat locally without saving to backend
      const saved: Conversation = {
        id: conversationId || Date.now().toString(),
        contactId,
        messages
      };
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
      // For MVP: Create event locally without saving to backend
      const created: Event = {
        ...newEvent,
        id: Date.now().toString()
      };
      setEvents(prev => [...prev, created]);
    } catch (error) {
      console.error('Failed to add event:', error);
    }
  };

  const updateEvent = async (updatedEvent: Event) => {
    try {
      // For MVP: Update event locally without saving to backend
      setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    } catch (error) {
      console.error('Failed to update event:', error);
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      // For MVP: Delete event locally without saving to backend
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
