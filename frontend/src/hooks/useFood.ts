import { useState, useCallback } from 'react';
import type { FoodItem, Recipe } from '../types';
import { recipes } from '../data/recipes';

interface FoodLogItem {
  food: string;
  calories: number;
  timestamp: Date;
}

export function useFood() {
  const [weeklyMealPlan, setWeeklyMealPlan] = useState<FoodItem[]>([]);
  const [dailyLog, setDailyLog] = useState<FoodLogItem[]>([]);

  const generateMealPlan = useCallback(() => {
    // In a real app, this would call an API to get personalized recommendations
    const newPlan = recipes
      .sort(() => Math.random() - 0.5)
      .slice(0, 7)
      .map(recipe => ({
        ...recipe,
        calories: Math.floor(Math.random() * 400) + 300,
        prepTime: Math.floor(Math.random() * 30) + 15
      }));
    
    setWeeklyMealPlan(newPlan);
  }, []);

  const addFoodItem = useCallback((food: string, calories: number) => {
    setDailyLog(prev => [...prev, {
      food,
      calories,
      timestamp: new Date()
    }]);
  }, []);

  return {
    weeklyMealPlan,
    generateMealPlan,
    dailyLog,
    addFoodItem
  };
}