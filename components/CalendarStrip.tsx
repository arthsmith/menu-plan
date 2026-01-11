import React, { useEffect, useRef } from 'react';

interface CalendarStripProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  dates: Date[];
}

export const CalendarStrip: React.FC<CalendarStripProps> = ({ selectedDate, onSelectDate, dates }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isSelected = (date: Date) => formatDate(date) === selectedDate;

  // Scroll active date into view on mount
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeEl = scrollContainerRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedDate]);

  return (
    <div className="w-full bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto no-scrollbar py-4 px-4 gap-3 snap-x"
      >
        {dates.map((date) => {
          const dateStr = formatDate(date);
          const active = isSelected(date);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
          const dayNumber = date.getDate();
          const isToday = formatDate(new Date()) === dateStr;

          return (
            <button
              key={dateStr}
              data-active={active}
              onClick={() => onSelectDate(dateStr)}
              className={`
                flex-shrink-0 flex flex-col items-center justify-center w-14 h-20 rounded-2xl transition-all duration-200 snap-center
                ${active 
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 scale-105' 
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100'}
              `}
            >
              <span className={`text-xs font-medium uppercase tracking-wide ${active ? 'text-emerald-100' : 'text-slate-400'}`}>
                {isToday ? 'Today' : dayName}
              </span>
              <span className={`text-xl font-bold mt-1 ${active ? 'text-white' : 'text-slate-700'}`}>
                {dayNumber}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};