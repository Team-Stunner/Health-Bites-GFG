import React, { useState } from 'react';
import { Clock, Flame, Plus, X, Filter, Loader2, ChefHat, Utensils, AlertCircle, Dumbbell, Wheat, Droplet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Swal from 'sweetalert2';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface RecipeFilters {
  numberOfMeals: number;
  dietType: 'vegetarian' | 'non-vegetarian';
  cuisinePreference?: string;
  maxCalories?: number;
  minCalories?: number;
  maxProtein?: number;
  minProtein?: number;
  maxCarbs?: number;
  minCarbs?: number;
  maxFat?: number;
  minFat?: number;
}

interface Recipe {
  id?: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  cookingTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

const LIMITS = {
  calories: { min: 50, max: 2000 },
  protein: { min: 0, max: 200 },
  carbs: { min: 0, max: 300 },
  fat: { min: 0, max: 100 }
};

const CUISINE_OPTIONS = [
  'Any',
  'Italian',
  'Indian',
  'Chinese',
  'Mexican',
  'Mediterranean',
  'Japanese',
  'Thai',
  'American'
];

const RecipeRecommendations: React.FC = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const [filters, setFilters] = useState<RecipeFilters>({
    numberOfMeals: 3,
    dietType: 'non-vegetarian',
    cuisinePreference: 'Any',
    maxCalories: undefined,
    minCalories: undefined,
    maxProtein: undefined,
    minProtein: undefined,
    maxCarbs: undefined,
    minCarbs: undefined,
    maxFat: undefined,
    minFat: undefined
  });

  const validateMinMax = (min: number | undefined, max: number | undefined, field: string, limits: { min: number; max: number }) => {
    const errors: { [key: string]: string } = {};

    if (min !== undefined) {
      if (min < limits.min) errors[`min${field}`] = `Min ${field.toLowerCase()} cannot be less than ${limits.min}`;
      if (max !== undefined && min > max) errors[`min${field}`] = `Min ${field.toLowerCase()} cannot be greater than max`;
    }

    if (max !== undefined && max > limits.max) {
      errors[`max${field}`] = `Max ${field.toLowerCase()} cannot exceed ${limits.max}`;
    }

    return errors;
  };

  const validateFilters = () => {
    const errors: { [key: string]: string } = {};

    Object.assign(errors,
      validateMinMax(filters.minCalories, filters.maxCalories, 'Calories', LIMITS.calories),
      validateMinMax(filters.minProtein, filters.maxProtein, 'Protein', LIMITS.protein),
      validateMinMax(filters.minCarbs, filters.maxCarbs, 'Carbs', LIMITS.carbs),
      validateMinMax(filters.minFat, filters.maxFat, 'Fat', LIMITS.fat)
    );

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentIngredient.trim() && !ingredients.includes(currentIngredient.trim())) {
      setIngredients([...ingredients, currentIngredient.trim()]);
      setCurrentIngredient('');
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter(i => i !== ingredient));
  };

  const handleFilterChange = (key: keyof RecipeFilters, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: key === "dietType" ? (value as 'vegetarian' | 'non-vegetarian') : value === '' ? undefined : Number(value)
    }));
    setValidationErrors({});
  };

  const generateRecipes = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFilters()) return;
    if (ingredients.length === 0) {
      setError('Please add at least one ingredient');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${backendUrl}/meal/generate-meal-plan`, {
        ingredients,
        dietType: filters.dietType,
        numberOfMeals: filters.numberOfMeals,
        cuisinePreference: filters.cuisinePreference !== 'Any' ? filters.cuisinePreference : undefined,
        nutritionRequirements: {
          minCalories: filters.minCalories,
          maxCalories: filters.maxCalories,
          minProtein: filters.minProtein,
          maxProtein: filters.maxProtein,
          minCarbs: filters.minCarbs,
          maxCarbs: filters.maxCarbs,
          minFat: filters.minFat,
          maxFat: filters.maxFat
        }
      });

      if (response.data.success && response.data.recipes) {
        setRecipes(response.data.recipes);
      } else {
        throw new Error('Failed to generate recipes');
      }
    } catch (err) {
      setError('Failed to generate recipes. Please try again.');
      console.error('Error generating recipes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToMealPlan = async (recipe: Recipe) => {
    try {
      const userId = localStorage.getItem('userid');
      if (!userId) {
        Swal.fire({
          icon: 'error',
          title: 'Not Logged In',
          text: 'Please log in to add meals to your plan'
        });
        return;
      }

      const response = await axios.post(`${backendUrl}/meal/add-food`, {
        userid: userId,
        foodName: recipe.title,
        calories: recipe.nutrition.calories,
        mealTime: new Date().toISOString()
      });

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Recipe Added!',
          text: `Added ${recipe.title} to your meal plan`,
          showConfirmButton: false,
          timer: 2000
        });
      }
    } catch (error) {
      console.error("Error adding recipe to meal plan:", error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to add recipe to meal plan'
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-6">Recipe Generator</h2>

          <form onSubmit={handleAddIngredient} className="mb-6">
            <div className="flex gap-4">
              <input
                type="text"
                value={currentIngredient}
                onChange={(e) => setCurrentIngredient(e.target.value)}
                placeholder="Enter an ingredient"
                className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </form>

          <div className="flex flex-wrap gap-2 mb-6">
            {ingredients.map((ingredient) => (
              <div
                key={ingredient}
                className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2"
              >
                <span>{ingredient}</span>
                <button
                  onClick={() => handleRemoveIngredient(ingredient)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <Filter className="w-5 h-5" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Number of Meals</label>
                    <input
                      type="number"
                      value={filters.numberOfMeals}
                      onChange={(e) => handleFilterChange('numberOfMeals', e.target.value)}
                      min="1"
                      max="7"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Diet Type</label>
                    <select
                      value={filters.dietType}
                      onChange={(e) => handleFilterChange('dietType', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    >
                      <option value="non-vegetarian">Non-Vegetarian</option>
                      <option value="vegetarian">Vegetarian</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cuisine Preference</label>
                    <select
                      value={filters.cuisinePreference}
                      onChange={(e) => handleFilterChange('cuisinePreference', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    >
                      {CUISINE_OPTIONS.map(cuisine => (
                        <option key={cuisine} value={cuisine}>{cuisine}</option>
                      ))}
                    </select>
                  </div>

                  {Object.entries(LIMITS).map(([nutrient, limits]) => (
                    <div key={nutrient} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 capitalize">{nutrient}</label>
                      <div className="flex gap-2">
                        <div>
                          <input
                            type="number"
                            placeholder={`Min ${limits.min}`}
                            value={filters[`min${nutrient.charAt(0).toUpperCase() + nutrient.slice(1)}` as keyof RecipeFilters] || ''}
                            onChange={(e) => handleFilterChange(`min${nutrient.charAt(0).toUpperCase() + nutrient.slice(1)}` as keyof RecipeFilters, e.target.value)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                          />
                          {validationErrors[`min${nutrient.charAt(0).toUpperCase() + nutrient.slice(1)}`] && (
                            <p className="text-red-500 text-xs mt-1">
                              {validationErrors[`min${nutrient.charAt(0).toUpperCase() + nutrient.slice(1)}`]}
                            </p>
                          )}
                        </div>
                        <div>
                          <input
                            type="number"
                            placeholder={`Max ${limits.max}`}
                            value={filters[`max${nutrient.charAt(0).toUpperCase() + nutrient.slice(1)}` as keyof RecipeFilters] || ''}
                            onChange={(e) => handleFilterChange(`max${nutrient.charAt(0).toUpperCase() + nutrient.slice(1)}` as keyof RecipeFilters, e.target.value)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                          />
                          {validationErrors[`max${nutrient.charAt(0).toUpperCase() + nutrient.slice(1)}`] && (
                            <p className="text-red-500 text-xs mt-1">
                              {validationErrors[`max${nutrient.charAt(0).toUpperCase() + nutrient.slice(1)}`]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={generateRecipes}
            disabled={isLoading}
            className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Recipes...
              </>
            ) : (
              <>
                <ChefHat className="w-5 h-5" />
                Generate Recipes
              </>
            )}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}
        </div>

        {recipes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe, index) => (
              <motion.div
                key={recipe.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4">{recipe.title}</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{recipe.cookingTime} mins</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Utensils className="w-4 h-4 text-gray-500" />
                      <span className={`capitalize ${getDifficultyColor(recipe.difficulty)}`}>
                        {recipe.difficulty}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span>{recipe.nutrition.calories} kcal</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dumbbell className="w-4 h-4 text-blue-500" />
                      <span>{recipe.nutrition.protein}g protein</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wheat className="w-4 h-4 text-yellow-500" />
                      <span>{recipe.nutrition.carbs}g carbs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Droplet className="w-4 h-4 text-green-500" />
                      <span>{recipe.nutrition.fat}g fat</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <button
                      onClick={() => setSelectedRecipe(recipe)}
                      className="text-green-500 hover:text-green-600 font-medium"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleAddToMealPlan(recipe)}
                      className="text-blue-500 hover:text-blue-600 font-medium"
                    >
                      Add to Meal Plan
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <AnimatePresence>
          {selectedRecipe && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedRecipe(null)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-semibold">{selectedRecipe.title}</h2>
                    <button
                      onClick={() => setSelectedRecipe(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Ingredients:</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedRecipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="text-gray-700">{ingredient}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Instructions:</h3>
                    <ol className="list-decimal list-inside space-y-2">
                      {selectedRecipe.instructions.map((instruction, index) => (
                        <li key={index} className="text-gray-700">{instruction}</li>
                      ))}
                    </ol>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => handleAddToMealPlan(selectedRecipe)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Add to Meal Plan
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RecipeRecommendations;