import React, { useState, useEffect } from 'react';
import type { Contact } from '../types';
import { motion } from 'framer-motion';
import { LogoIcon, PlusIcon, ChevronLeftIcon, ChevronRightIcon, ViewColumnsIcon, Squares2X2Icon, SearchIcon } from './Icons';

interface ContactListProps {
  contacts: Contact[];
  onSelectContact: (contact: Contact) => void;
  onAdd: () => void;
}

type Layout = 'slide' | 'grid';

const useMediaQuery = (query: string): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);

    mediaQueryList.addEventListener('change', listener);
    return () => mediaQueryList.removeEventListener('change', listener);
  }, [query]);

  return matches;
};

const BusinessCard: React.FC<{ contact: Contact; onClick: () => void; }> = ({ contact, onClick }) => (
    <motion.div
        onClick={onClick}
        className="bg-white rounded-xl p-6 shadow-sm text-gray-800 border border-gray-200 h-full w-full flex flex-col cursor-pointer"
        whileHover={{ scale: 1.02, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)" }}
        whileTap={{ scale: 0.98 }}
    >
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-xl font-bold">{contact.name}</h3>
                <p className="text-sm text-gray-500">{contact.title}</p>
            </div>
            <LogoIcon className="h-8 w-8 text-violet-500" />
        </div>
        <div className="mt-6 border-t border-gray-100 pt-4 flex-grow flex flex-col justify-end">
            <p className="text-sm text-gray-700 font-semibold">{contact.company}</p>
            <p className="text-xs text-gray-500 mt-1">{contact.email}</p>
            <p className="text-xs text-gray-500">{contact.phone}</p>
        </div>
    </motion.div>
);


const SlideLayout: React.FC<{ contacts: Contact[]; onSelectContact: (contact: Contact) => void; }> = ({ contacts, onSelectContact }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
      if (activeIndex >= contacts.length && contacts.length > 0) {
        setActiveIndex(contacts.length - 1);
      } else if (contacts.length === 0) {
        setActiveIndex(0);
      }
    }, [contacts, activeIndex]);
  
    if (contacts.length === 0) return null;

    const handleNext = () => setActiveIndex((prev) => (prev + 1) % contacts.length);
    const handlePrev = () => setActiveIndex((prev) => (prev - 1 + contacts.length) % contacts.length);
  
    return (
      <div className="w-full h-full flex flex-col items-center justify-center relative">
        <div className="relative w-full h-[300px] flex items-center justify-center">
          {contacts.map((contact, index) => {
            const offset = index - activeIndex;
            return (
              <motion.div
                key={contact.id}
                className="absolute w-[380px] h-[240px]"
                style={{ transformOrigin: 'bottom center' }}
                initial={false}
                animate={{
                  x: offset * 75,
                  rotate: offset * 10,
                  scale: 1 - Math.abs(offset) * 0.1,
                  zIndex: contacts.length - Math.abs(offset),
                  opacity: Math.abs(offset) < 4 ? 1 : 0,
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                drag={index === activeIndex ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(e, { offset, velocity }) => {
                  if (offset.x < -100 || velocity.x < -500) {
                    handleNext();
                  } else if (offset.x > 100 || velocity.x > 500) {
                    handlePrev();
                  }
                }}
              >
                <BusinessCard
                  contact={contact}
                  onClick={() => {
                      if (index === activeIndex) onSelectContact(contact);
                      else setActiveIndex(index);
                  }}
                />
              </motion.div>
            );
          })}
        </div>
        <div className="absolute bottom-8 flex items-center gap-6">
          <button onClick={handlePrev} className="p-3 rounded-full bg-white shadow-md hover:bg-gray-100 transition" aria-label="Previous card">
            <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
          </button>
          <span className="text-gray-600 font-medium tabular-nums">{activeIndex + 1} / {contacts.length}</span>
          <button onClick={handleNext} className="p-3 rounded-full bg-white shadow-md hover:bg-gray-100 transition" aria-label="Next card">
            <ChevronRightIcon className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>
    );
};

const GridLayout: React.FC<{ contacts: Contact[]; onSelectContact: (contact: Contact) => void; }> = ({ contacts, onSelectContact }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.05
          }
        }
    };
    
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-4 md:px-8 pt-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
        {contacts.map(contact => (
            <motion.div key={contact.id} variants={itemVariants} className="h-[240px]">
                <BusinessCard contact={contact} onClick={() => onSelectContact(contact)} />
            </motion.div>
        ))}
        </motion.div>
    );
};
  

export const ContactList: React.FC<ContactListProps> = ({ contacts, onSelectContact, onAdd }) => {
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const [layout, setLayout] = useState<Layout>('slide');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredContacts = contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1
        }
      }
    };
  
    const itemVariants = {
      hidden: { y: 20, opacity: 0 },
      visible: { y: 0, opacity: 1 }
    };
  
    return (
      <motion.div
          key="contactList"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="bg-gray-50 h-full flex flex-col"
      >
        <div className="p-4 md:px-8 md:pt-8 flex-shrink-0">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-gray-900">명함집</h1>
                    {isDesktop && (
                    <div className="flex items-center gap-1 p-1 bg-gray-200 rounded-lg">
                        <button
                        onClick={() => setLayout('slide')}
                        className={`p-1.5 rounded-md transition-colors ${layout === 'slide' ? 'bg-white text-violet-600 shadow-sm' : 'text-gray-500 hover:text-gray-600'}`}
                        aria-label="Slide view"
                        >
                        <ViewColumnsIcon className="w-5 h-5" />
                        </button>
                        <button
                        onClick={() => setLayout('grid')}
                        className={`p-1.5 rounded-md transition-colors ${layout === 'grid' ? 'bg-white text-violet-600 shadow-sm' : 'text-gray-500 hover:text-gray-600'}`}
                        aria-label="Grid view"
                        >
                        <Squares2X2Icon className="w-5 h-5" />
                        </button>
                    </div>
                    )}
                </div>
                <button onClick={onAdd} className="p-2 rounded-full bg-violet-600 hover:bg-violet-700 transition">
                    <PlusIcon className="h-6 w-6 text-white" />
                </button>
            </div>
             <div className="mt-4">
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <SearchIcon className="w-5 h-5 text-gray-400" />
                    </span>
                    <input
                        type="text"
                        placeholder="이름으로 검색"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                </div>
            </div>
        </div>
        
        <div className="flex-grow relative overflow-y-auto">
            {contacts.length === 0 ? (
                <div className="text-center text-gray-500 mt-20">
                    <p>명함이 없습니다.</p>
                    <p className="text-sm">오른쪽 상단 '+' 버튼을 눌러 추가하세요.</p>
                </div>
            ) : filteredContacts.length === 0 ? (
                <div className="text-center text-gray-500 mt-20">
                    <p>검색 결과가 없습니다.</p>
                </div>
            ) : isDesktop ? (
                layout === 'slide' ? (
                    <SlideLayout contacts={filteredContacts} onSelectContact={onSelectContact} />
                ) : (
                    <GridLayout contacts={filteredContacts} onSelectContact={onSelectContact} />
                )
            ) : (
                <motion.div 
                    className="space-y-4 p-4 pt-0"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {filteredContacts.map(contact => (
                        <motion.div key={contact.id} variants={itemVariants}>
                            <BusinessCard contact={contact} onClick={() => onSelectContact(contact)} />
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
      </motion.div>
    );
};