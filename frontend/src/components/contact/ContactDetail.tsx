import React from 'react';
import type { Contact } from '../../types';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, GiftIcon, UserIcon, PencilIcon, TrashIcon } from '../common/Icons';

interface ContactDetailProps {
  contact: Contact;
  onBack: () => void;
  onRecommendGift: () => void;
  onViewHistory: () => void;
  onEdit: () => void;
  onDelete: (contactId: string) => void;
}

export const ContactDetail: React.FC<ContactDetailProps> = ({ contact, onBack, onRecommendGift, onViewHistory, onEdit, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm(`${contact.name}님의 명함을 삭제하시겠습니까?`)) {
      onDelete(contact.id);
    }
  };

  return (
    <motion.div
        key="contactDetail"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="absolute inset-0 bg-gray-50 p-4 flex flex-col"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
            <button onClick={onBack} className="p-2 mr-2">
            <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">개인 명함</h1>
        </div>
        <div className="flex items-center gap-2">
            <button onClick={onEdit} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                <PencilIcon className="h-5 w-5 text-gray-600"/>
            </button>
            <button onClick={handleDelete} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                <TrashIcon className="h-5 w-5 text-gray-600"/>
            </button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-violet-500 to-indigo-500 rounded-2xl p-6 shadow-lg text-white flex-shrink-0">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-4">
              <UserIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{contact.name}</h2>
            <p className="text-sm opacity-90">{contact.title}</p>
            <p className="text-sm opacity-90">{contact.company}</p>
          </div>
        </div>
      </div>

      <div className="my-6 grid grid-cols-2 gap-4">
          <button onClick={onViewHistory} className="bg-white p-4 rounded-lg text-left hover:bg-gray-100 shadow-sm border border-gray-200">
              <p className="font-bold text-gray-600">선물 내역</p>
              <p className="text-2xl font-light mt-1">{contact.giftHistory.length} <span className="text-sm">건</span></p>
          </button>
          <div className="bg-white p-4 rounded-lg text-left shadow-sm border border-gray-200">
              <p className="font-bold text-gray-600">다음 기념일</p>
              <p className="text-sm text-gray-400 mt-2">미정</p>
          </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg space-y-3 shadow-sm border border-gray-200">
          <p className="font-bold text-lg mb-2 text-gray-900">명함 정보</p>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">연락처</span>
            <span className="font-medium text-gray-700">{contact.phone}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">이메일</span>
            <span className="font-medium text-gray-700">{contact.email}</span>
          </div>
           {contact.notes && <div className="text-sm pt-3 border-t border-gray-100">
            <span className="text-gray-500 block mb-1">메모</span>
            <p className="text-gray-700">{contact.notes}</p>
          </div>}
      </div>

      <div className="mt-auto pt-4">
        <button onClick={onRecommendGift} className="w-full bg-violet-600 text-white font-bold py-4 rounded-lg hover:bg-violet-700 transition-colors flex items-center justify-center">
          <GiftIcon className="h-5 w-5 mr-2" />
          AI 선물 추천 받기
        </button>
      </div>
    </motion.div>
  );
};