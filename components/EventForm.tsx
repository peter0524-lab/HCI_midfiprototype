import React, { useState, useEffect } from 'react';
import type { Event } from '../types';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, TrashIcon } from './Icons';

interface EventFormProps {
  event: Event | null;
  onSave: (event: Omit<Event, 'id'> | Event) => void;
  onBack: () => void;
  onDelete: (eventId: string) => void;
}

const tags = [
    { label: '회의', color: 'bg-violet-500' },
    { label: '업무', color: 'bg-blue-500' },
    { label: '개인', color: 'bg-green-500' },
    { label: '기념일', color: 'bg-pink-500' },
];

export const EventForm: React.FC<EventFormProps> = ({ event, onSave, onBack, onDelete }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2024-09-19');
  const [time, setTime] = useState('');
  const [tag, setTag] = useState('회의');
  const [tagColor, setTagColor] = useState('bg-violet-500');

  const isEditMode = !!event;

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDate(event.date);
      setTime(event.time);
      setTag(event.tag);
      setTagColor(event.tagColor);
    }
  }, [event]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time) return;
    const selectedTag = tags.find(t => t.label === tag) || tags[0];
    const eventData = { title, date, time, tag: selectedTag.label, tagColor: selectedTag.color };
    if (isEditMode) {
      onSave({ ...event, ...eventData });
    } else {
      onSave(eventData);
    }
  };

  const handleDelete = () => {
    if (event && window.confirm(`'${event.title}' 일정을 삭제하시겠습니까?`)) {
      onDelete(event.id);
    }
  };

  return (
    <motion.div
      key="eventForm"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="p-4 bg-gray-50 min-h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
            <button onClick={onBack} className="p-2 mr-2">
            <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? '일정 수정' : '일정 추가'}</h1>
        </div>
        {isEditMode && (
            <button onClick={handleDelete} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                <TrashIcon className="h-5 w-5 text-gray-600"/>
            </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="일정 제목" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-violet-500 border border-gray-200" required />
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-violet-500 border border-gray-200" required />
        <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full bg-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-violet-500 border border-gray-200" required />
        
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">태그</label>
            <div className="flex flex-wrap gap-2">
                {tags.map(t => (
                    <button
                        key={t.label}
                        type="button"
                        onClick={() => setTag(t.label)}
                        className={`px-3 py-1 text-sm rounded-full transition-all ${tag === t.label ? `${t.color} text-white ring-2 ring-offset-1 ring-violet-500` : 'bg-gray-200 text-gray-600'}`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>
        </div>

        <button type="submit" className="w-full bg-violet-600 text-white font-bold py-3 rounded-lg hover:bg-violet-700 transition-colors">
          {isEditMode ? '변경사항 저장' : '일정 저장'}
        </button>
      </form>
    </motion.div>
  );
};
