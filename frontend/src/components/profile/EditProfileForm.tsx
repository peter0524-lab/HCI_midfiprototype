import React, { useState, useEffect } from 'react';
import type { User } from '../../types';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from '../common/Icons';

interface EditProfileFormProps {
  user: User;
  onSave: (user: User) => void;
  onBack: () => void;
}

export const EditProfileForm: React.FC<EditProfileFormProps> = ({ user, onSave, onBack }) => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  useEffect(() => {
    setName(user.name);
    setTitle(user.title);
    setCompany(user.company);
    setPhone(user.phone);
    setEmail(user.email);
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !company) return;
    onSave({ name, title, company, phone, email });
  };

  return (
    <motion.div
        key="editProfile"
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
        <h1 className="text-2xl font-bold text-gray-900">내 명함 수정</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="이름" value={name} onChange={e => setName(e.target.value)} className="w-full bg-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-violet-500 border border-gray-200" required />
        <input type="text" placeholder="직책" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-violet-500 border border-gray-200" />
        <input type="text" placeholder="회사/부서" value={company} onChange={e => setCompany(e.target.value)} className="w-full bg-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-violet-500 border border-gray-200" required />
        <input type="tel" placeholder="연락처" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-violet-500 border border-gray-200" />
        <input type="email" placeholder="이메일" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-violet-500 border border-gray-200" />
        <button type="submit" className="w-full bg-violet-600 text-white font-bold py-3 rounded-lg hover:bg-violet-700 transition-colors">
          변경사항 저장
        </button>
      </form>
    </motion.div>
  );
};
