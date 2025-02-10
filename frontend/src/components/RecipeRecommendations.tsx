import React, { useState } from 'react';
import { Clock, Flame, Plus, X, Filter, Users, Loader2, ChefHat, Utensils, AlertCircle, Dumbbell, Wheat, Droplet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useDiet } from '../Context/Calary';
const backendurl = import.meta.env.VITE_BACKEND_URL;


interface RecipeFilters {
  numberOfMeals: number;
  dietType: 'vegetarian' | 'non-vegetarian';
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
  id: number;
  title: string;
  image: string;
  usedIngredientCount: number;
  missedIngredientCount: number;
  likes: number;
  readyInMinutes?: number;
  calories?: number;
}

interface RecipeDetails {
  id: number;
  title: string;
  instructions: string;
  calories: number;
}

interface FoodEntry {
  name: string;
  calories: number;
  id: string;
}

const LIMITS = {
  calories: { min: 50, max: 2000 },
  protein: { min: 0, max: 200 },
  carbs: { min: 0, max: 300 },
  fat: { min: 0, max: 100 }
};

const API_KEY = "88f4e80b21f244a991d779efdd7992cb";

const RecipeRecommendations: React.FC = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeDetails | null>(null);
  const [userCalories, setUserCalories] = useState<number>(0);
  const [recipeCalories, setRecipeCalories] = useState<any>([]);
      const { todayCalories, setTodayCalories, foodEntries, setFoodEntries } = useDiet();
  
  const [filters, setFilters] = useState<RecipeFilters>({
    numberOfMeals: 3,
    dietType: 'non-vegetarian',
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

  const fetchRecipes = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFilters()) return;
    if (ingredients.length === 0) {
      setError('Please add at least one ingredient');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const ingredientList = ingredients.join(',');
      const response = await fetch(
        `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${API_KEY}&ingredients=${ingredientList}&number=${filters.numberOfMeals}&ranking=2&ignorePantry=true`
      );

      if (!response.ok) throw new Error('Failed to fetch recipes');

      const data = await response.json();
      setRecipes(data);
    
      let caloriesArray: number[] = [];
  
      for (let i = 0; i < data.length; i++) {
        const response = await fetch(`https://api.spoonacular.com/recipes/${data[i].id}/nutritionWidget.json?apiKey=${API_KEY}`);
        const caldata = await response.json();
        caloriesArray.push(caldata.calories);
      }
  
      setRecipeCalories(caloriesArray); // Update state once after loop
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recipes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewRecipe = async (recipeId: number,calorie:number) => {
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}`
      );
      if (!response.ok) throw new Error('Failed to fetch recipe details');
      const data = await response.json();
      setSelectedRecipe({
        id: data.id,
        title: data.title,
        instructions: data.instructions || 'No instructions available.',
        calories: calorie || 0
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recipe details');
    }
  };

  const  handleAddCalories = async (calories: number,foodName:string) => {
    if (foodName && calories) {
      const caloriesNum = calories;
      const newEntry: FoodEntry = {
          name: foodName,
          calories: caloriesNum,
          id: Date.now().toString()
      };

      try {
          const userid = localStorage.getItem('userid') || '';
          const response = await axios.post(`${backendurl}/meal/add-food`, {
              userid,
              foodName,
              calories: caloriesNum,
              mealTime: new Date().toISOString() // You can make this dynamic
          });

          if (response.data.dailyMealPlan.totalCalories) {
            console.log(response.data.dailyMealPlan.totalCalories);
              setTodayCalories(response.data.dailyMealPlan.totalCalories);
              setFoodEntries([...foodEntries, ...response.data.dailyMealPlan.meals]);
          }

          // setFoodName('');
          // setCalories('');
      } catch (error) {
          console.error("Error adding food:", error);
      }
  }
    // setUserCalories(prev => prev + calories);
    setSelectedRecipe(null);
  };

  const renderNutritionFilter = (
    label: string,
    minKey: keyof RecipeFilters,
    maxKey: keyof RecipeFilters,
    limits: { min: number; max: number },
    icon: React.ReactNode
  ) => (
    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
      <div className="flex items-center space-x-2 text-gray-700 font-medium">
        {icon}
        <span>{label}</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Minimum</label>
          <input
            type="number"
            value={filters[minKey] || ''}
            onChange={(e) => handleFilterChange(minKey, e.target.value)}
            className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm ${validationErrors[minKey] ? 'border-red-300' : ''
              }`}
            placeholder={`Min: ${limits.min}`}
          />
          {validationErrors[minKey] && (
            <p className="mt-1 text-xs text-red-500">{validationErrors[minKey]}</p>
          )}
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Maximum</label>
          <input
            type="number"
            value={filters[maxKey] || ''}
            onChange={(e) => handleFilterChange(maxKey, e.target.value)}
            className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm ${validationErrors[maxKey] ? 'border-red-300' : ''
              }`}
            placeholder={`Max: ${limits.max}`}
          />
          {validationErrors[maxKey] && (
            <p className="mt-1 text-xs text-red-500">{validationErrors[maxKey]}</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <ChefHat className="h-8 w-8 text-green-600" />
              <h1 className="text-3xl font-bold text-gray-900">Recipe Finder</h1>
            </div>
            <div className="text-sm text-gray-500 flex items-center">
              <Utensils className="h-4 w-4 mr-2" />
              {ingredients.length} ingredients selected
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Your Ingredients</h2>
                <span className="text-sm text-gray-500">{ingredients.length}/10 max</span>
              </div>

              <form onSubmit={handleAddIngredient} className="flex gap-2">
                <input
                  type="text"
                  value={currentIngredient}
                  onChange={(e) => setCurrentIngredient(e.target.value)}
                  placeholder="Add an ingredient (e.g., chicken, tomatoes)"
                  className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  maxLength={30}
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="p-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  disabled={ingredients.length >= 10}
                >
                  <Plus className="h-5 w-5" />
                </motion.button>
              </form>

              <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                  {ingredients.map((ingredient) => (
                    <motion.span
                      key={ingredient}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="inline-flex items-center bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium"
                    >
                      {ingredient}
                      <button
                        onClick={() => handleRemoveIngredient(ingredient)}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Recipe Preferences</h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="text-green-600 hover:text-green-700 flex items-center text-sm font-medium"
                >
                  <Filter className="h-4 w-4 mr-1" />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
              </div>

              <form onSubmit={fetchRecipes} className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                  <h3 className="font-medium text-gray-700">Basic Settings</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Recipes
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={filters.numberOfMeals}
                        onChange={(e) => handleFilterChange('numberOfMeals', parseInt(e.target.value))}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Diet Type
                      </label>
                      <select
                        value={filters.dietType}
                        onChange={(e) => handleFilterChange('dietType', e.target.value)}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      >
                        <option value="non-vegetarian">Non-Vegetarian</option>
                        <option value="vegetarian">Vegetarian</option>
                      </select>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      <h3 className="font-medium text-gray-700">Nutritional Requirements</h3>
                      <div className="space-y-4">
                        {renderNutritionFilter(
                          'Calories',
                          'minCalories',
                          'maxCalories',
                          LIMITS.calories,
                          <Flame className="h-5 w-5 text-orange-500" />
                        )}
                        {renderNutritionFilter(
                          'Protein',
                          'minProtein',
                          'maxProtein',
                          LIMITS.protein,
                          <Dumbbell className="h-5 w-5 text-blue-500" />
                        )}
                        {renderNutritionFilter(
                          'Carbohydrates',
                          'minCarbs',
                          'maxCarbs',
                          LIMITS.carbs,
                          <Wheat className="h-5 w-5 text-amber-500" />
                        )}
                        {renderNutritionFilter(
                          'Fat',
                          'minFat',
                          'maxFat',
                          LIMITS.fat,
                          <Droplet className="h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading || ingredients.length === 0}
                  className={`w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors ${(isLoading || ingredients.length === 0) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Finding Recipes...
                    </span>
                  ) : (
                    'Find Recipes'
                  )}
                </motion.button>
              </form>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg flex items-center"
            >
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </motion.div>
          )}
        </div>

        {recipes.length > 0 && (
          console.log(recipes),
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Found Recipes</h2>
              <div className="bg-green-100 px-4 py-2 rounded-lg">
                <span className="text-green-800 font-medium">Total Calories: {todayCalories}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe,index) => (
                
                <motion.div
                  key={recipe.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative h-48">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-semibold text-white">{recipe.title}</h3>
                    </div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-900">{recipe.likes}</span>
                      </div>
                    </div>
                  </div>
                  <p>Calories: {recipeCalories[index] || "Loading..."}</p> 

                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        {recipe.readyInMinutes && (
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-blue-500" />
                            <span className="font-medium">{recipe.readyInMinutes} min</span>
                          </span>
                        )}
                        {recipe.calories && (
                          <span className="flex items-center">
                            <Flame className="h-4 w-4 mr-1 text-orange-500" />
                            <span className="font-medium">{recipe.calories} cal</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                        <span className="text-sm text-gray-600">
                          {recipe.usedIngredientCount} ingredients available
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleViewRecipe(recipe.id,recipeCalories[index])}
                      className="w-full mt-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      View Recipe
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {selectedRecipe && (
            console.log(selectedRecipe),
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
                className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-gray-900">{selectedRecipe.title}</h3>
                    <button
                      onClick={() => setSelectedRecipe(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <div className="prose prose-green max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: selectedRecipe.instructions }} />
                  </div>

                  <div className="flex justify-end space-x-4 pt-4 border-t">
                    <button
                      onClick={() => setSelectedRecipe(null)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => handleAddCalories(selectedRecipe.calories,selectedRecipe.title)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Add to My Calories ({selectedRecipe.calories} cal)
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