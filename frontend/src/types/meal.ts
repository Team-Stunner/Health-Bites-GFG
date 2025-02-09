export interface Meal {
  id: number;
  name: string;
  image: string;
  description: string;
  calories: number;
  prepTime: number;
  vegetarian: boolean;
  type: 'breakfast' | 'lunch' | 'dinner';
  ingredients: string[];
  instructions: string[];
}