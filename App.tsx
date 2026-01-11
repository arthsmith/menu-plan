import React, { useState, useEffect } from 'react';
import { CalendarStrip } from './components/CalendarStrip';
import { MealSlot } from './components/MealSlot';
import { ShoppingListSection } from './components/ShoppingListSection';
import { ConfirmationModal } from './components/ConfirmationModal';
import { HistoryModal } from './components/HistoryModal';
import { DayPlan, MealType, WeeklyPlan, ManualItem, CheckedState, MealEntry, HistoryEntry } from './types';

// Icons
const SunriseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 6 4-4 4 4"/><path d="M16 18a4 4 0 0 0-8 0"/></svg>;
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>;
const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 0 1 1-9-9Z"/></svg>;
const CoffeeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>;

const DEFAULT_ENTRY: MealEntry = { items: '', notes: '' };

const DEFAULT_SLOT: DayPlan = {
  Breakfast: { ...DEFAULT_ENTRY },
  Lunch: { ...DEFAULT_ENTRY },
  Dinner: { ...DEFAULT_ENTRY },
  Snack: { ...DEFAULT_ENTRY },
};

function App() {
  const [dates, setDates] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  
  // Data State
  const [plan, setPlan] = useState<WeeklyPlan>({});
  const [manualItems, setManualItems] = useState<ManualItem[]>([]);
  const [checkedItems, setCheckedItems] = useState<CheckedState>({});
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Initialize dates on mount
  useEffect(() => {
    initDates(new Date());
  }, []);

  const initDates = (startDate: Date) => {
    const next7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      return d;
    });
    setDates(next7Days);
    setSelectedDate(next7Days[0].toISOString().split('T')[0]);
  };

  // Load from LocalStorage
  useEffect(() => {
    const savedPlan = localStorage.getItem('familyMealPlan_v2');
    const savedManual = localStorage.getItem('familyManualItems_v2');
    const savedChecked = localStorage.getItem('familyCheckedItems_v2');
    const savedHistory = localStorage.getItem('familyMealHistory');

    if (savedPlan) {
      try {
        setPlan(JSON.parse(savedPlan));
      } catch (e) {
        console.error("Failed to parse plan", e);
      }
    }
    if (savedManual) setManualItems(JSON.parse(savedManual));
    if (savedChecked) setCheckedItems(JSON.parse(savedChecked));
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('familyMealPlan_v2', JSON.stringify(plan));
  }, [plan]);

  useEffect(() => {
    localStorage.setItem('familyManualItems_v2', JSON.stringify(manualItems));
  }, [manualItems]);

  useEffect(() => {
    localStorage.setItem('familyCheckedItems_v2', JSON.stringify(checkedItems));
  }, [checkedItems]);
  
  useEffect(() => {
    localStorage.setItem('familyMealHistory', JSON.stringify(history));
  }, [history]);

  const handleMealChange = (type: MealType, field: keyof MealEntry, value: string) => {
    setPlan((prev) => {
      const dayPlan = prev[selectedDate] || JSON.parse(JSON.stringify(DEFAULT_SLOT));
      return {
        ...prev,
        [selectedDate]: {
          ...dayPlan,
          [type]: {
            ...dayPlan[type],
            [field]: value
          }
        },
      };
    });
  };

  const handleAddManualItem = (text: string) => {
    const newItem: ManualItem = {
      id: Date.now().toString(),
      text: text
    };
    setManualItems(prev => [...prev, newItem]);
  };

  const handleRemoveManualItem = (id: string) => {
    setManualItems(prev => prev.filter(item => item.id !== id));
    const checkId = `manual-${id}`;
    if (checkedItems[checkId]) {
      const newChecked = { ...checkedItems };
      delete newChecked[checkId];
      setCheckedItems(newChecked);
    }
  };

  const handleToggleCheck = (id: string) => {
    setCheckedItems(prev => {
      const next = { ...prev };
      if (next[id]) {
        delete next[id];
      } else {
        next[id] = true;
      }
      return next;
    });
  };

  const handleResetWeek = () => {
    // 0. Check for content to archive
    const hasContent = Object.values(plan).some(day => 
      Object.values(day).some(meal => meal.items.trim().length > 0 || meal.notes.trim().length > 0)
    );

    if (hasContent && dates.length > 0) {
      const start = dates[0];
      const end = dates[dates.length - 1];
      const newEntry: HistoryEntry = {
        id: Date.now().toString(),
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        plan: JSON.parse(JSON.stringify(plan)) // Deep copy
      };
      
      // Save to history (keep max 4)
      setHistory(prev => [newEntry, ...prev].slice(0, 4));
    }

    // 1. Calculate next Sunday
    const today = new Date();
    const day = today.getDay(); // 0 is Sunday
    const diff = day === 0 ? 0 : 7 - day; 
    const nextSunday = new Date(today);
    nextSunday.setDate(today.getDate() + diff);

    // 2. Clear Current Data
    setPlan({});
    setManualItems([]);
    setCheckedItems({});
    
    // 3. Update Dates
    initDates(nextSunday);
    
    // 4. Close Modal
    setIsResetModalOpen(false);
  };

  const currentDayPlan = plan[selectedDate] || DEFAULT_SLOT;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-lg mx-auto shadow-2xl shadow-slate-200">
      {/* Header */}
      <header className="bg-white p-4 pb-2 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <span className="bg-emerald-500 text-white p-1.5 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
          </span>
          Menu Planner
        </h1>
        <div className="flex items-center gap-2">
           <button 
            onClick={() => setIsHistoryModalOpen(true)}
            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            title="View History"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20v-6M6 20V10M18 20V4"/></svg>
          </button>
          <button 
            onClick={() => setIsResetModalOpen(true)}
            className="text-xs font-semibold text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 border border-slate-200 hover:border-emerald-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
            New Week
          </button>
        </div>
      </header>

      {/* Date Strip */}
      <CalendarStrip 
        dates={dates} 
        selectedDate={selectedDate} 
        onSelectDate={setSelectedDate} 
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 overflow-y-auto">
        {/* Meal Slots for Selected Day */}
        <div className="space-y-4">
          <MealSlot 
            type="Breakfast" 
            data={currentDayPlan.Breakfast} 
            onChange={(field, v) => handleMealChange('Breakfast', field, v)}
            icon={<SunriseIcon />}
          />
          <MealSlot 
            type="Lunch" 
            data={currentDayPlan.Lunch} 
            onChange={(field, v) => handleMealChange('Lunch', field, v)}
            icon={<SunIcon />}
          />
          <MealSlot 
            type="Dinner" 
            data={currentDayPlan.Dinner} 
            onChange={(field, v) => handleMealChange('Dinner', field, v)}
            icon={<MoonIcon />}
          />
          <MealSlot 
            type="Snack" 
            data={currentDayPlan.Snack} 
            onChange={(field, v) => handleMealChange('Snack', field, v)}
            icon={<CoffeeIcon />}
          />
        </div>

        {/* Integrated Shopping List Section */}
        <ShoppingListSection 
          plan={plan}
          manualItems={manualItems}
          checkedItems={checkedItems}
          onAddManualItem={handleAddManualItem}
          onRemoveManualItem={handleRemoveManualItem}
          onToggleCheck={handleToggleCheck}
        />
        
        {/* Bottom spacer for scroll comfort */}
        <div className="h-12" />
      </main>

      {/* Reset Confirmation Modal */}
      <ConfirmationModal 
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleResetWeek}
        title="Start a New Week?"
        message="This will save your current meal plan to History, clear the board, and set the calendar to the upcoming Sunday. Are you sure?"
      />

      {/* History Modal */}
      <HistoryModal 
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={history}
      />
    </div>
  );
}

export default App;