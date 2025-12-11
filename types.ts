export interface NutritionData {
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  healthScore: number;
  description: string;
  advice: string;
  ingredients?: string[];
}

export interface HistoryItem {
  id: string;
  foodName: string;
  calories: number;
  timeAgo: string;
  icon?: string;
}

export enum AppState {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
}

export interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  data: NutritionData | null;
  imagePreview: string | null;
}