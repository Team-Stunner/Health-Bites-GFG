export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  image?: string;
  description?: string;
  prepTime?: number;
  ingredients: string[];
  tags: string[];
}

export interface DailyGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface UserPreferences {
  dietaryRestrictions: string[];
  healthGoals: string;
  allergies: string[];
}

export interface MealPlan {
  breakfast: FoodItem[];
  lunch: FoodItem[];
  dinner: FoodItem[];
  snacks: FoodItem[];
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  cuisine: string;
  rating: number;
  priceRange: string;
  image: string;
}

export interface Recipe extends FoodItem {
  instructions: string[];
}