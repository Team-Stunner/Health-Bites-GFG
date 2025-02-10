import { useState, useCallback } from 'react';
import axios from 'axios';
import { Meal } from '../types/meal';

const SPOONACULAR_API_KEY = "abe392bcfc544c33b74fb20c9bee3c12";
const BASE_URL = 'https://api.spoonacular.com/recipes';

type MealTime = 'breakfast' | 'lunch' | 'dinner';

export const useFood = () => {
  const [weeklyMealPlan, setWeeklyMealPlan] = useState<Meal[][]>([]);
  const [dietType, setDietType] = useState<'vegetarian' | 'non-vegetarian'>('non-vegetarian');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [targetCalories, setTargetCalories] = useState<number>(2100); // Default to 2100 calories
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMeals = async (mealType: MealTime) => {
    const caloriesPerMeal = Math.round(targetCalories / 3);
    const tolerance = 100; // Allow for some variation in calories

    const params = {
      apiKey: SPOONACULAR_API_KEY,
      number: 7,
      // cuisine: 'indian',
      type: mealType,
      diet: dietType === 'vegetarian' ? 'vegetarian' : undefined,
      includeIngredients: ingredients.join(','),
      minCalories: caloriesPerMeal - tolerance,
      maxCalories: caloriesPerMeal + tolerance,
      fillIngredients: true,
      addRecipeInformation: true,
    };

    const response = await axios.get(`${BASE_URL}/complexSearch`, { params });
    const recipes = await Promise.all(
      response.data.results.map(async (result: any) => {
        const recipeInfo = await axios.get(`${BASE_URL}/${result.id}/information`, {
          params: { apiKey: SPOONACULAR_API_KEY }
        });
        return {
          id: result.id,
          name: result.title,
          image: result.image,
          description: recipeInfo.data.summary.replace(/<[^>]*>/g, '').slice(0, 150) + '...',
          calories: Math.round(result.nutrition?.nutrients?.find((n: any) => n.name === 'Calories')?.amount || 0),
          prepTime: recipeInfo.data.readyInMinutes,
          vegetarian: recipeInfo.data.vegetarian,
          type: mealType,
          ingredients: recipeInfo.data.extendedIngredients.map((ing: any) => ing.original),
          instructions: recipeInfo.data.analyzedInstructions[0]?.steps.map((step: any) => step.step) || [],
        };
      })
    );
    return recipes;
  };

  const generateMealPlan = useCallback(async () => {
    if (!SPOONACULAR_API_KEY) {
      setError('API key is not configured. Please add your Spoonacular API key to the environment variables.');
      return;
    }

    if (ingredients.length === 0) {
      setError('Please add at least one ingredient to generate meal plans.');
      return;
    }

    if (targetCalories < 1200 || targetCalories > 4000) {
      setError('Please enter a daily calorie target between 1200 and 4000.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // const breakfastMeals = await fetchMeals('breakfast');
      const lunchMeals = await fetchMeals('lunch');
      // const dinnerMeals = await fetchMeals('dinner');

      const weekPlan = Array.from({ length: 7 }, (_, i) => [
        // breakfastMeals[i],
        lunchMeals[i],
        // dinnerMeals[i],
      ]);

      setWeeklyMealPlan(weekPlan);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError('Invalid API key. Please check your Spoonacular API key configuration.');
      } else {
        setError('Failed to generate meal plan. Please try again.');
      }
      if (err instanceof Error) {
        console.error('Error generating meal plan:', err.message);
      } else {
        console.error('Error generating meal plan:', String(err));
      }
    } finally {
      setLoading(false);
    }
  }, [dietType, ingredients, targetCalories]);

  return {
    weeklyMealPlan,
    loading,
    error,
    dietType,
    setDietType,
    ingredients,
    setIngredients,
    targetCalories,
    setTargetCalories,
    generateMealPlan,
  };
};