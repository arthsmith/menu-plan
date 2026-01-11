export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export interface MealEntry {
  items: string;
  notes: string;
}

export interface DayPlan {
  Breakfast: MealEntry;
  Lunch: MealEntry;
  Dinner: MealEntry;
  Snack: MealEntry;
}

export type WeeklyPlan = Record<string, DayPlan>;

export interface ManualItem {
  id: string;
  text: string;
}

export type CheckedState = Record<string, boolean>;

export interface ShoppingItem {
  item: string;
  category: string;
  checked?: boolean;
}

export interface ShoppingListResponse {
  items: ShoppingItem[];
}

export interface HistoryEntry {
  id: string;
  startDate: string;
  endDate: string;
  plan: WeeklyPlan;
}