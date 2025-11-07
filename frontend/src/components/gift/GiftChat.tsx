import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Contact, GiftRecommendation, Gift, Message } from '../../types';
import { giftApi } from '../../services/giftApi';
import { ArrowLeftIcon, ArrowUpIcon, LogoIcon } from '../common/Icons';

interface GiftChatProps {
  contact: Contact;
  onBack: () => void;
  addGiftToHistory: (contactId: string, gift: Gift) => void;
  initialMessages: Message[];
  onSaveHistory: (contactId: string, messages: Message[], conversationId?: string) => void;
  conversationId?: string;
}

export const GiftChat: React.FC<GiftChatProps> = ({ contact, onBack, addGiftToHistory, initialMessages, onSaveHistory, conversationId }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const messagesRef = useRef(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    return () => {
      // Always save on unmount if there are any meaningful messages.
      if (messagesRef.current.length > 1) {
          onSaveHistory(contact.id, messagesRef.current, conversationId);
      }
    };
  }, [contact.id, onSaveHistory, conversationId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;
    const userMessage: Message = { type: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const recommendations = await giftApi.recommend(contact.id, input);
      const aiMessage: Message = { type: 'ai', recommendations, timestamp: Date.now() };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to get recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSelectGift = (rec: GiftRecommendation) => {
    // Find the message block to ensure we don't re-select
    const messageBlock = messages.find(m => m.type === 'ai' && m.recommendations.includes(rec));
    if (messageBlock && messageBlock.type === 'ai' && messageBlock.selectedGiftName) {
      return; // A gift has already been selected from this block
    }

    const newGift: Gift = {
        name: rec.name,
        price: rec.price,
        date: new Date().toISOString().split('T')[0].replace(/-/g, '.')
    };
    addGiftToHistory(contact.id, newGift);
    
    const confirmationMessage: Message = { 
        type: 'ai_intro', 
        text: `'${rec.name}'을(를) 선물 내역에 추가했습니다.`,
        timestamp: Date.now()
    };

    setMessages(prev => {
        const updatedMessages = prev.map(msg => {
            if (msg.type === 'ai' && msg.recommendations.includes(rec)) {
                return { ...msg, selectedGiftName: rec.name };
            }
            return msg;
        });
        return [...updatedMessages, confirmationMessage];
    });
  };

  return (
    <motion.div
      key="giftChat"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="absolute inset-0 bg-white flex flex-col"
    >
      <header className="bg-white p-4 flex items-center flex-shrink-0 border-b border-gray-200">
        <button onClick={onBack} className="p-2 mr-2">
          <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-900">AI 선물 추천</h1>
          <p className="text-sm text-gray-500">{contact.name}님</p>
        </div>
      </header>

      <main className="flex-grow p-4 overflow-y-auto bg-gray-50">
        <div className="space-y-6">
          {messages.map((msg, index) => (
            <div key={index}>
              {msg.type === 'ai_intro' && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center flex-shrink-0"><LogoIcon className="w-5 h-5"/></div>
                  <div className="bg-gray-100 rounded-lg p-3 max-w-xs text-sm text-gray-800">
                    <p>{msg.text}</p>
                  </div>
                </div>
              )}
              {msg.type === 'user' && (
                <div className="flex justify-end">
                  <div className="bg-violet-600 rounded-lg p-3 max-w-xs text-sm text-white">
                    <p>{msg.text}</p>
                  </div>
                </div>
              )}
              {msg.type === 'ai' && (
                 <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center flex-shrink-0"><LogoIcon className="w-5 h-5"/></div>
                    <div className="flex-1 space-y-3">
                        {msg.recommendations.map((rec, recIndex) => {
                            const isSelected = msg.selectedGiftName === rec.name;
                            const hasSelectionInBlock = !!msg.selectedGiftName;

                            return (
                                <motion.div
                                    key={recIndex}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: recIndex * 0.1 }}
                                    className={`bg-white border rounded-lg p-3 text-sm text-gray-800 transition-all duration-300 ${
                                        isSelected 
                                        ? 'border-violet-500 border-2 shadow-lg' 
                                        : hasSelectionInBlock 
                                        ? 'opacity-50' 
                                        : 'border-gray-200'
                                    }`}
                                >
                                    <p className="font-bold">{rec.name}</p>
                                    <p className="text-gray-600 my-1">{rec.description}</p>
                                    <p className="text-violet-600 font-medium">{rec.price}</p>
                                    <button 
                                        onClick={() => handleSelectGift(rec)}
                                        disabled={hasSelectionInBlock}
                                        className={`text-xs text-white px-3 py-1 rounded-full mt-2 transition-colors ${
                                            isSelected
                                            ? 'bg-green-500'
                                            : 'bg-violet-600 hover:bg-violet-700'
                                        } ${hasSelectionInBlock ? 'cursor-not-allowed opacity-70' : ''}`}
                                    >
                                        {isSelected ? '선택 완료' : '선택 및 기록'}
                                    </button>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center flex-shrink-0 animate-pulse"><LogoIcon className="w-5 h-5 text-white"/></div>
                <div className="bg-gray-100 rounded-lg p-3 max-w-xs text-sm">
                    <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    </div>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="p-4 flex-shrink-0 border-t border-gray-200 bg-white">
        <div className="flex items-center bg-gray-100 rounded-lg p-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder="3-5만원대 출장 선물"
            className="flex-grow bg-transparent focus:outline-none px-2 text-gray-800"
            disabled={isLoading || !conversationId}
          />
          <button onClick={handleSend} disabled={isLoading || !conversationId} className="bg-violet-600 rounded-md p-2 disabled:bg-gray-400">
            <ArrowUpIcon className="h-5 w-5 text-white" />
          </button>
        </div>
      </footer>
    </motion.div>
  );
};