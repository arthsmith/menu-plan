import React from 'react';
import { ShoppingItem } from '../types';

interface ShoppingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  items: ShoppingItem[];
  onToggleItem: (index: number) => void;
}

export const ShoppingListModal: React.FC<ShoppingListModalProps> = ({ 
  isOpen, 
  onClose, 
  isLoading, 
  items, 
  onToggleItem 
}) => {
  if (!isOpen) return null;

  // Group items by category
  const groupedItems = items.reduce((acc, item, index) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push({ ...item, originalIndex: index });
    return acc;
  }, {} as Record<string, (ShoppingItem & { originalIndex: number })[]>);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="bg-white w-full max-w-md h-[85vh] sm:h-[80vh] sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col pointer-events-auto transform transition-transform duration-300">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            Shopping List
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
              <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <p>Planning your groceries...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="m19 11-8-8-8 6v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8Z"/><path d="M5 19h14"/><path d="M9 22v-9"/></svg>
              <p>No items yet. Add some meals!</p>
            </div>
          ) : (
            Object.entries(groupedItems).map(([category, categoryItems]) => (
              <div key={category}>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">{category}</h3>
                <div className="space-y-2">
                  {(categoryItems as (ShoppingItem & { originalIndex: number })[]).map((item) => (
                    <div 
                      key={item.originalIndex}
                      onClick={() => onToggleItem(item.originalIndex)}
                      className={`
                        flex items-start gap-3 p-3 rounded-lg transition-all cursor-pointer border
                        ${item.checked ? 'bg-slate-50 border-transparent' : 'bg-white border-slate-200 hover:border-emerald-300 shadow-sm'}
                      `}
                    >
                      <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${item.checked ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-white'}`}>
                        {item.checked && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M20 6 9 17l-5-5"/></svg>}
                      </div>
                      <span className={`text-base leading-snug flex-1 ${item.checked ? 'text-slate-400 line-through' : 'text-slate-700 font-medium'}`}>
                        {item.item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};