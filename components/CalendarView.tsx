import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Event } from '../types';

interface CalendarViewProps {
    events: Event[];
    onAddEvent: () => void;
    onSelectEvent: (event: Event) => void;
}

const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const monthName = 'September';
const year = 2024;

const generateCalendarDays = () => {
    // Static for September 2024
    const firstDay = new Date(year, 8, 1).getDay(); // 0 = Sunday
    const daysInMonth = 30;
    const days = Array.from({ length: firstDay }, (_, i) => ({ day: null, key: `empty-${i}` }));
    for (let day = 1; day <= daysInMonth; day++) {
        days.push({ day, key: day.toString() });
    }
    return days;
};

export const CalendarView: React.FC<CalendarViewProps> = ({ events, onAddEvent, onSelectEvent }) => {
    const [selectedDate, setSelectedDate] = useState(19);
    const calendarDays = generateCalendarDays();
    const eventsForSelectedDay = events.filter(e => new Date(e.date).getUTCDate() === selectedDate);

    return (
        <motion.div
            key="calendar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-gray-50 min-h-full text-gray-800"
        >
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">{monthName} {year}</h1>
                <button onClick={onAddEvent} className="text-violet-600 font-semibold">+ 일정 추가</button>
            </div>
            
            <div className="grid grid-cols-7 gap-y-2 text-center text-sm">
                {daysOfWeek.map(day => <div key={day} className="font-bold text-gray-500 py-2">{day}</div>)}
                {calendarDays.map(({day, key}) => (
                    <div 
                        key={key}
                        onClick={() => day && setSelectedDate(day)}
                        className={`py-2 rounded-full cursor-pointer transition-colors ${day === selectedDate ? 'bg-violet-600 text-white font-semibold' : day ? 'hover:bg-gray-200' : ''}`}
                    >
                        {day}
                    </div>
                ))}
            </div>

            <div className="mt-8">
                <h2 className="font-bold mb-4">{`9월 ${selectedDate}일 일정`}</h2>
                {eventsForSelectedDay.length > 0 ? (
                    <div className="space-y-3">
                        {eventsForSelectedDay.map(event => (
                            <div 
                                key={event.id} 
                                onClick={() => onSelectEvent(event)}
                                className="bg-white p-3 rounded-lg shadow-sm flex items-center border border-gray-200 cursor-pointer hover:bg-gray-100"
                            >
                                <div className="w-16 text-sm text-center mr-3 font-medium">
                                    <p>{event.time}</p>
                                </div>
                                <div className={`border-l-4 ${event.tagColor.replace('bg-', 'border-')} pl-4 flex-grow`}>
                                    <p className="font-semibold">{event.title}</p>
                                    <span className={`text-xs px-2 py-0.5 rounded-full text-white ${event.tagColor}`}>{event.tag}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm p-4 text-center">일정이 없습니다.</p>
                )}
            </div>
        </motion.div>
    );
};