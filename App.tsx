import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SplashScreen } from './components/SplashScreen';
import { LoginScreen } from './components/LoginScreen';
import { MainScreen } from './components/MainScreen';
import type { Contact, Gift, OcrData, Message, Conversation, User, Event } from './types';
import { mockContacts, mockChatHistory, mockUser, mockEvents } from './constants';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [ocrData, setOcrData] = useState<OcrData | null>(null);
  const [chatHistory, setChatHistory] = useState<Conversation[]>(mockChatHistory);
  const [userProfile, setUserProfile] = useState<User>(mockUser);
  const [events, setEvents] = useState<Event[]>(mockEvents);


  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const addContact = (newContact: Omit<Contact, 'id' | 'giftHistory'>) => {
    setContacts(prev => [...prev, { ...newContact, id: Date.now().toString(), giftHistory: [] }]);
    setOcrData(null); // Clear OCR data after adding
  };
  
  const updateContact = (updatedContact: Contact) => {
    setContacts(prev => prev.map(c => c.id === updatedContact.id ? updatedContact : c));
    if (selectedContact?.id === updatedContact.id) {
      setSelectedContact(updatedContact);
    }
  };

  const deleteContact = (contactId: string) => {
    setContacts(prev => prev.filter(c => c.id !== contactId));
    setSelectedContact(null);
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

  const updateChatHistory = (contactId: string, messages: Message[], conversationId?: string) => {
    setChatHistory(prev => {
        const convoId = conversationId || Date.now().toString();
        const existingConvoIndex = prev.findIndex(c => c.id === convoId);

        if (existingConvoIndex > -1) {
            // Update existing conversation
            const updatedHistory = [...prev];
            updatedHistory[existingConvoIndex] = {
                ...updatedHistory[existingConvoIndex],
                messages,
            };
            return updatedHistory;
        } else {
            // Add new conversation with a specific or new ID
            const newConversation: Conversation = {
                id: convoId,
                contactId,
                messages,
            };
            return [...prev, newConversation];
        }
    });
  };

  const updateUserProfile = (updatedProfile: User) => {
    setUserProfile(updatedProfile);
  };

  const addEvent = (newEvent: Omit<Event, 'id'>) => {
    setEvents(prev => [...prev, { ...newEvent, id: Date.now().toString() }]);
  };

  const updateEvent = (updatedEvent: Event) => {
    setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
  };

  const deleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
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
