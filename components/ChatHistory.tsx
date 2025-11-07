import React from 'react';
import { motion } from 'framer-motion';
import type { Contact, Message, Conversation } from '../types';
import { UserIcon } from './Icons';

interface ChatHistoryProps {
  chatHistory: Conversation[];
  contacts: Contact[];
  onSelectConversation: (conversation: Conversation) => void;
}

const getMessagePreview = (message: Message): string => {
    if (!message) return '대화 없음';
    switch (message.type) {
        case 'user':
            return `나: ${message.text}`;
        case 'ai':
            if (message.selectedGiftName) {
                return `AI: '${message.selectedGiftName}'을(를) 선택했습니다.`;
            }
            return `AI: ${message.recommendations[0]?.name || '선물'} 추천`;
        case 'ai_intro':
            return message.text;
    }
};

const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 60) return '방금 전';
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}분 전`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}시간 전`;
    
    return date.toLocaleDateString('ko-KR');
};


export const ChatHistory: React.FC<ChatHistoryProps> = ({ chatHistory, contacts, onSelectConversation }) => {
    const conversations = chatHistory
        .map(conversation => {
            const contact = contacts.find(c => c.id === conversation.contactId);
            if (!contact || conversation.messages.length <= 1) return null;
            const lastMessage = conversation.messages[conversation.messages.length - 1];
            return {
                conversation,
                contact,
                lastMessage
            };
        })
        .filter((c): c is { conversation: Conversation, contact: Contact, lastMessage: Message } => c !== null)
        .sort((a, b) => (b.lastMessage.timestamp || 0) - (a.lastMessage.timestamp || 0));

    return (
        <motion.div
            key="chatHistory"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-gray-50 min-h-full"
        >
            <h1 className="text-2xl font-bold mb-6 text-gray-900">대화 내역</h1>
            {conversations.length === 0 ? (
                <div className="text-center text-gray-500 mt-20">
                    <p>AI 선물 추천 대화 내역이 없습니다.</p>
                    <p className="text-sm">명함 상세 화면에서 추천을 받아보세요.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {conversations.map(({ conversation, contact, lastMessage }) => (
                        <motion.div
                            key={conversation.id}
                            onClick={() => onSelectConversation(conversation)}
                            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-100 flex items-center"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                                <UserIcon className="w-6 h-6 text-gray-500" />
                            </div>
                            <div className="flex-grow overflow-hidden">
                                <div className="flex justify-between items-center">
                                    <p className="font-bold text-gray-800">{contact.name}</p>
                                    <p className="text-xs text-gray-400 flex-shrink-0">{formatTimestamp(lastMessage.timestamp)}</p>
                                </div>
                                <p className="text-sm text-gray-500 truncate mt-1">
                                    {getMessagePreview(lastMessage)}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};