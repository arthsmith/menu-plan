import React, { useState, useEffect, useRef } from 'react';
import { MealType, MealEntry } from '../types';

interface MealSlotProps {
  type: MealType;
  data: MealEntry;
  onChange: (field: keyof MealEntry, value: string) => void;
  icon: React.ReactNode;
}

export const MealSlot: React.FC<MealSlotProps> = ({ type, data, onChange, icon }) => {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea for items
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [data.items]);

  return (
    <div 
      className={`
        relative bg-white rounded-xl p-4 transition-all duration-300 border
        ${isFocused ? 'border-emerald-500 shadow-md ring-1 ring-emerald-500' : 'border-slate-200 shadow-sm'}
      `}
      onFocus={() => setIsFocused(true)}
      onBlur={(e) => {
        // Only remove focus if moving outside this component
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsFocused(false);
        }
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-1.5 rounded-lg transition-colors ${isFocused ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
          {icon}
        </div>
        <h3 className={`font-semibold text-sm uppercase tracking-wider transition-colors ${isFocused ? 'text-emerald-700' : 'text-slate-500'}`}>
          {type}
        </h3>
      </div>
      
      {/* Main Items Input */}
      <textarea
        ref={textareaRef}
        value={data.items}
        onChange={(e) => onChange('items', e.target.value)}
        placeholder="Enter items (one per line)"
        rows={1}
        className="w-full resize-none text-slate-800 placeholder-slate-300 bg-transparent border-none focus:ring-0 p-0 text-lg leading-relaxed font-medium mb-3"
      />

      {/* Notes/Link Input */}
      <div className="relative border-t border-slate-100 pt-2">
        <input 
          type="text"
          value={data.notes}
          onChange={(e) => onChange('notes', e.target.value)}
          placeholder="Notes or recipe link..."
          className="w-full text-sm text-slate-500 placeholder-slate-300 bg-transparent border-none focus:ring-0 p-0"
        />
        <div className="absolute right-0 top-2 text-slate-300 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        </div>
      </div>
    </div>
  );
};