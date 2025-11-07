import React from 'react';
import type { Contact } from '../../types';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from '../common/Icons';

interface GiftHistoryProps {
  contact: Contact;
  onBack: () => void;
}

export const GiftHistory: React.FC<GiftHistoryProps> = ({ contact, onBack }) => {
  return (
    <motion.div
        key="giftHistory"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="absolute inset-0 bg-gray-50 p-4"
    >
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 mr-2">
          <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
        </button>
        <div>
            <h1 className="text-2xl font-bold text-gray-900">선물 이력</h1>
            <p className="text-sm text-gray-500">{contact.name}님</p>
        </div>
      </div>

      {contact.giftHistory.length === 0 ? (
         <div className="text-center text-gray-500 mt-20">
            <p>아직 선물 내역이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-3">
            {contact.giftHistory.map((gift, index) => (
                <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white p-4 rounded-lg flex items-center justify-between shadow-sm border border-gray-200"
                >
                    <div>
                        <p className="font-semibold text-gray-800">{gift.name}</p>
                        <p className="text-xs text-gray-400 mt-1">{gift.date}</p>
                    </div>
                    <p className="font-medium text-sm text-gray-700">{gift.price}</p>
                </motion.div>
            ))}
        </div>
      )}
    </motion.div>
  );
};
