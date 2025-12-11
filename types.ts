export type Role = 'USER' | 'ADMIN';

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

export interface Recipe {
  id: string;
  name: string;
  calories: number;
  macros: { protein: string; carbs: string; fat: string };
  prepTime: string;
  tags: string[];
  explanation: string; // XAI component
  ingredients: string[]; // Added
  instructions: string[]; // Added
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
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
  USER_DASHBOARD = 'USER_DASHBOARD',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
}

export interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  data: NutritionData | null;
  imagePreview: string | null;
}

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: Role;
    plan: 'Free' | 'Pro';
    status: 'Active' | 'Suspended';
}

export interface HealthProfile {
  // English keys (Legacy/Internal)
  age?: string;
  weight?: string;
  height?: string;
  goal?: string;
  activityLevel?: string;
  conditions?: string[];
  allergies?: string[];
  preferences?: string[];
  dislikes?: string[];

  // Spanish keys (From Gemini RAG)
  edad?: string;
  peso?: string;
  talla?: string;
  objetivo?: string;
  actividad?: string;
  enfermedades?: string[];
  alergias?: string[];
  evitar?: string[];
}