import React, { useState } from 'react';
import { WeeklyPlan, ManualItem, CheckedState } from '../types';

interface ShoppingListSectionProps {
  plan: WeeklyPlan;
  manualItems: ManualItem[];
  checkedItems: CheckedState;
  onAddManualItem: (text: string) => void;
  onRemoveManualItem: (id: string) => void;
  onToggleCheck: (id: string) => void;
}

export const ShoppingListSection: React.FC<ShoppingListSectionProps> = ({
  plan,
  manualItems,
  checkedItems,
  onAddManualItem,
  onRemoveManualItem,
  onToggleCheck,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (inputValue.trim()) {
      onAddManualItem(inputValue.trim());
      setInputValue('');
    }
  };

  // 1. Flatten meal plan into list items, handling newlines
  const mealItems = Object.entries(plan).flatMap(([date, dayPlan]) => {
    return Object.entries(dayPlan).flatMap(([slot, data]) => {
      // Split by newline and filter empty lines
      const lines = data.items.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      
      return lines.map((line) => {
        // Create a unique ID based on date, slot, and the item text itself
        // This helps keep checkboxes persistent if items are reordered within the slot slightly
        // or if lines are inserted.
        const id = `meal-${date}-${slot}-${line}`;
        return {
          id,
          text: line,
          isManual: false,
        };
      });
    });
  });

  // 2. Map manual items to common structure
  const manualListItems = manualItems.map((item) => ({
    id: `manual-${item.id}`,
    text: item.text,
    isManual: true,
    originalId: item.id
  }));

  // 3. Combine and sort
  const allItems = [...manualListItems, ...mealItems];

  const sortedItems = allItems.sort((a, b) => {
    const aChecked = !!checkedItems[a.id];
    const bChecked = !!checkedItems[b.id];
    if (aChecked === bChecked) return 0;
    return aChecked ? 1 : -1; // Checked items go to bottom
  });

  return (
    <div className="mt-8 pt-6 border-t border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        Shopping List
      </h2>

      {/* Manual Input Area */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add extra items (e.g. Milk)"
          className="flex-1 rounded-xl border-slate-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 py-3 px-4 text-slate-700 bg-white"
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2 rounded-xl font-semibold transition-colors shadow-sm shadow-emerald-200"
        >
          Add
        </button>
      </form>

      {/* List */}
      <div className="space-y-3">
        {sortedItems.length === 0 ? (
          <div className="text-center py-8 text-slate-400 bg-slate-100/50 rounded-xl border border-dashed border-slate-200">
            <p>Your list is empty.</p>
            <p className="text-sm">Enter one item per line in your meal plan.</p>
          </div>
        ) : (
          sortedItems.map((item) => {
            const isChecked = !!checkedItems[item.id];
            
            return (
              <div 
                key={item.id}
                className={`
                  group flex items-center gap-3 p-3.5 rounded-xl transition-all duration-200 border
                  ${isChecked 
                    ? 'bg-slate-50 border-transparent' 
                    : 'bg-white border-slate-200 shadow-sm hover:border-emerald-300'}
                `}
              >
                <button
                  onClick={() => onToggleCheck(item.id)}
                  className={`
                    flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors
                    ${isChecked 
                      ? 'bg-slate-300 border-slate-300' 
                      : 'border-slate-300 bg-white group-hover:border-emerald-400'}
                  `}
                >
                  {isChecked && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M20 6 9 17l-5-5"/></svg>}
                </button>
                
                <div 
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => onToggleCheck(item.id)}
                >
                  <p className={`text-base font-medium truncate transition-all ${isChecked ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                    {item.text}
                  </p>
                </div>

                {item.isManual && (
                  <button
                    onClick={() => item.isManual && onRemoveManualItem(item.originalId!)}
                    className="p-2 text-slate-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    aria-label="Remove item"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};