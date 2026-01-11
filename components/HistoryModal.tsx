import React, { useState } from 'react';
import { HistoryEntry, WeeklyPlan, MealType } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryEntry[];
  onRestore?: (entry: HistoryEntry) => void; // Optional future feature
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, history }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const hasDataForDay = (dayPlan: any) => {
    return Object.values(dayPlan).some((meal: any) => meal.items.trim().length > 0 || meal.notes.trim().length > 0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="bg-white w-full max-w-md max-h-[85vh] rounded-2xl shadow-xl flex flex-col relative z-10">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M12 20v-6M6 20V10M18 20V4"/></svg>
            Plan History
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p>No history yet.</p>
              <p className="text-xs mt-1">Completed weeks will appear here.</p>
            </div>
          ) : (
            history.map((entry) => (
              <div key={entry.id} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                <button 
                  onClick={() => toggleExpand(entry.id)}
                  className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors"
                >
                  <span className="font-semibold text-slate-700">
                    {formatDate(entry.startDate)} - {formatDate(entry.endDate)}
                  </span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className={`text-slate-400 transition-transform ${expandedId === entry.id ? 'rotate-180' : ''}`}
                  >
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </button>

                {expandedId === entry.id && (
                  <div className="p-4 border-t border-slate-100 space-y-6">
                    {Object.entries(entry.plan)
                      .filter(([_, dayPlan]) => hasDataForDay(dayPlan))
                      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()) // Ensure chronological order
                      .map(([date, dayPlan]) => {
                        const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                        return (
                          <div key={date} className="space-y-2">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{dayName}</h4>
                            <div className="space-y-2 pl-2 border-l-2 border-slate-200">
                              {(['Breakfast', 'Lunch', 'Dinner', 'Snack'] as MealType[]).map(type => {
                                const meal = dayPlan[type];
                                if (!meal.items.trim() && !meal.notes.trim()) return null;
                                return (
                                  <div key={type} className="text-sm">
                                    <span className="font-semibold text-slate-700 mr-2">{type}:</span>
                                    <span className="text-slate-600">{meal.items.replace(/\n/g, ', ')}</span>
                                    {meal.notes && (
                                      <div className="text-xs text-slate-400 italic mt-0.5 ml-2">Note: {meal.notes}</div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                    })}
                    
                    {Object.keys(entry.plan).length === 0 && (
                      <p className="text-sm text-slate-400 italic text-center">Empty week</p>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};