import React from 'react';
import { motion } from 'framer-motion';
import { UserIcon, PencilIcon } from '../common/Icons';
import type { User, Contact } from '../../types';

interface MyProfileProps {
  user: User;
  contacts: Contact[];
  onEdit: () => void;
}

export const MyProfile: React.FC<MyProfileProps> = ({ user, contacts, onEdit }) => {
  const allGifts = contacts
    .flatMap(contact => contact.giftHistory.map(gift => ({
      ...gift,
      recipientName: contact.name,
      id: `${contact.id}-${gift.name}-${gift.date}`
    })))
    .sort((a, b) => new Date(b.date.replace(/\./g, '-')).getTime() - new Date(a.date.replace(/\./g, '-')).getTime());

  return (
    <motion.div
        key="myProfile"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="p-4 bg-gray-50 min-h-full text-gray-800"
    >
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">내 명함</h1>
            <button onClick={onEdit} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                <PencilIcon className="w-5 h-5 text-gray-600"/>
            </button>
        </div>
      
      <div className="bg-gradient-to-br from-violet-500 to-indigo-500 rounded-2xl p-6 shadow-lg text-white">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-4">
              <UserIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-sm opacity-90">{user.title}</p>
            <p className="text-sm opacity-90">{user.company}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-bold text-gray-600 mb-2">연락처 정보</h3>
          <p className="text-sm"><strong>Phone:</strong> {user.phone}</p>
          <p className="text-sm"><strong>Email:</strong> {user.email}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-600">내가 준 선물 내역</h3>
            {allGifts.length > 0 ? (
                <div className="space-y-3 mt-2 max-h-40 overflow-y-auto">
                    {allGifts.map(gift => (
                        <div key={gift.id} className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                            <div>
                                <p className="font-semibold">{gift.name}</p>
                                <p className="text-xs text-gray-500">To: {gift.recipientName}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-gray-700">{gift.price}</p>
                                <p className="text-xs text-gray-400">{gift.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-gray-500 mt-2">선물 내역이 없습니다.</p>
            )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-600">앱 정보</h3>
            <p className="text-sm mt-2">버전: 1.0.0</p>
            <p className="text-sm">GPT-4b: AI Gift Assistant</p>
        </div>
      </div>
    </motion.div>
  );
};