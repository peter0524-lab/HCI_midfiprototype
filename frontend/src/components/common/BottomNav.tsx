import React from 'react';
import type { View } from '../../types';
import { HomeIcon, CalendarIcon, ChatIcon, UserIcon } from './Icons';

interface BottomNavProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { view: 'home', icon: HomeIcon, label: '명함집' },
    { view: 'calendar', icon: CalendarIcon, label: '일정' },
    { view: 'chatHistory', icon: ChatIcon, label: 'LLM' },
    { view: 'myProfile', icon: UserIcon, label: 'My' },
  ] as const;

  return (
    <div className="bg-white px-4 py-2 flex justify-around items-center border-t border-gray-200">
      {navItems.map(item => {
        const isActive = item.view === currentView;
        return (
          <button 
            key={item.view}
            onClick={() => onViewChange(item.view)} 
            className={`flex flex-col items-center transition-colors w-16 ${isActive ? 'text-violet-600' : 'text-gray-400 hover:text-violet-500'}`}
          >
            <item.icon className="h-6 w-6" />
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};