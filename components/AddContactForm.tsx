import React, { useState, useEffect } from 'react';
import type { Contact, OcrData } from '../types';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, CameraIcon } from './Icons';

interface AddContactFormProps {
  onAddContact: (contact: Omit<Contact, 'id' | 'giftHistory'>) => void;
  onUpdateContact?: (contact: Contact) => void;
  onBack: () => void;
  onScan: () => void;
  initialData?: OcrData | null;
  existingContact?: Contact | null;
}

export const AddContactForm: React.FC<AddContactFormProps> = ({ onAddContact, onUpdateContact, onBack, onScan, initialData, existingContact }) => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  
  const isEditMode = !!existingContact;

  useEffect(() => {
    const data = existingContact || initialData;
    if (data) {
        setName(data.name || '');
        setTitle(data.title || '');
        setCompany(data.company || '');
        setPhone(data.phone || '');
        setEmail(data.email || '');
        if ('notes' in data) {
            setNotes(data.notes || '');
        }
    }
  }, [initialData, existingContact]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !company) return;
    
    if (isEditMode && onUpdateContact) {
        onUpdateContact({
            ...existingContact,
            name, title, company, phone, email, notes
        });
    } else {
        onAddContact({ name, title, company, phone, email, notes });
    }
  };

  return (
    <motion.div
        key="addContact"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="p-4 bg-gray-50 min-h-full"
    >
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 mr-2">
          <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? '명함 수정' : '명함 추가'}</h1>
      </div>
      
      {!isEditMode && (
        <div className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg mb-6">
            <p className="text-gray-500 mb-4">카메라로 명함을 스캔하거나 정보를 직접 입력하세요.</p>
            <button onClick={onScan} className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center justify-center mx-auto">
                <CameraIcon className="w-5 h-5 mr-2"/> OCR 스캔
            </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="이름" value={name} onChange={e => setName(e.target.value)} className="w-full bg-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-violet-500 border border-gray-200" required />
        <input type="text" placeholder="직책" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-violet-500 border border-gray-200" />
        <input type="text" placeholder="회사명" value={company} onChange={e => setCompany(e.target.value)} className="w-full bg-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-violet-500 border border-gray-200" required />
        <input type="tel" placeholder="연락처" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-violet-500 border border-gray-200" />
        <input type="email" placeholder="이메일" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-violet-500 border border-gray-200" />
        <textarea placeholder="메모" value={notes} onChange={e => setNotes(e.target.value)} className="w-full bg-white rounded-lg p-3 h-24 focus:outline-none focus:ring-2 focus:ring-violet-500 border border-gray-200" />
        <button type="submit" className="w-full bg-violet-600 text-white font-bold py-3 rounded-lg hover:bg-violet-700 transition-colors">
          {isEditMode ? '변경사항 저장' : '명함 저장'}
        </button>
      </form>
    </motion.div>
  );
};