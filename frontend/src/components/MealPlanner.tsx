import React, { useState } from 'react';
import { ChefHat, Plus, X, Clock, Flame, UtensilsCrossed, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Swal from 'sweetalert2';

interface Recipe {
  id: number;
  title: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl: string;
  image: string;
  nutrition: {
    nutrients: {
      name: string;
      amount: number;
      unit: string;
    }[];
  };
  usedIngredientCount: number;
  missedIngredientCount: number;
  likes: number;
}

export const MealPlanner: React.FC = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [preferences, setPreferences] = useState({
    diet: 'vegetarian',
    maxReadyTime: 60,
  });

  const handleAddIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (newIngredient.trim() && !ingredients.includes(newIngredient.trim())) {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient('');
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter(ing => ing !== ingredient));
  };

  const findRecipes = async () => {
    if (ingredients.length === 0) {
      await Swal.fire({
        title: 'No Ingredients',
        text: 'Please add some ingredients first!',
        icon: 'warning',
        confirmButtonColor: '#16a34a'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
        params: {
          apiKey: import.meta.env.VITE_SPOONACULAR_API_KEY,
          includeIngredients: ingredients.join(','),
          addRecipeNutrition: true,
          diet: preferences.diet || undefined,
          maxReadyTime: preferences.maxReadyTime,
          number: 9,
          sort: 'max-used-ingredients',
          ranking: 2,
        },
      });

      setRecipes(response.data.results);

      await Swal.fire({
        title: 'Recipes Found!',
        text: `Found ${response.data.results.length} recipes using your ingredients.`,
        icon: 'success',
        confirmButtonText: 'Great!',
        confirmButtonColor: '#16a34a',
      });
    } catch (error) {
      console.error('Error finding recipes:', error);
      await Swal.fire({
        title: 'Error!',
        text: 'Failed to find recipes. Please try again.',
        icon: 'error',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setLoading(false);
    }
  };

  const getNutrientValue = (recipe: Recipe, nutrientName: string) => {
    const nutrient = recipe.nutrition.nutrients.find(n => n.name === nutrientName);
    return nutrient ? Math.round(nutrient.amount) : 0;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold flex items-center text-gray-800">
            <ChefHat className="h-8 w-8 mr-3 text-green-600" />
            Smart Recipe Finder
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-700">
                <UtensilsCrossed className="h-5 w-5 mr-2 text-green-600" />
                Your Ingredients
              </h3>

              <form onSubmit={handleAddIngredient} className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  placeholder="Add ingredient..."
                  className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200"
                >
                  <Plus className="h-5 w-5" />
                </motion.button>
              </form>

              <div className="flex flex-wrap gap-2 mb-6">
                {ingredients.map((ingredient) => (
                  <motion.span
                    key={ingredient}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-50 text-green-700"
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
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diet Preference
                </label>
                <select
                  value={preferences.diet}
                  onChange={(e) => setPreferences({ ...preferences, diet: e.target.value })}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                >
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="paleo">Paleo</option>
                  <option value="">No Restrictions</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Cooking Time (minutes)
                </label>
                <input
                  type="number"
                  value={preferences.maxReadyTime}
                  onChange={(e) => setPreferences({ ...preferences, maxReadyTime: parseInt(e.target.value) })}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  min="10"
                  max="180"
                  step="5"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={findRecipes}
                disabled={loading || ingredients.length === 0}
                className="w-full py-3 px-4 rounded-lg text-white font-medium bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <ChefHat className={`h-5 w-5 mr-2 ${loading ? 'animate-bounce' : ''}`} />
                {loading ? 'Finding recipes...' : 'Find Recipes'}
              </motion.button>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {recipes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {recipes.map((recipe) => (
                <motion.div
                  key={recipe.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-gray-900 mb-2 flex-1">{recipe.title}</h4>
                      <a
                        href={recipe.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-blue-500" />
                        {recipe.readyInMinutes} min
                      </span>
                      <span className="flex items-center">
                        <UtensilsCrossed className="h-4 w-4 mr-1 text-purple-500" />
                        {recipe.servings} servings
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        {recipe.usedIngredientCount} ingredients used
                      </span>
                      {recipe.missedIngredientCount > 0 && (
                        <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">
                          {recipe.missedIngredientCount} missing
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center">
                        <Flame className="h-4 w-4 mr-1 text-red-500" />
                        <div>
                          <p className="text-gray-500">Calories</p>
                          <p className="font-medium">{getNutrientValue(recipe, 'Calories')}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-500">Protein</p>
                        <p className="font-medium">{getNutrientValue(recipe, 'Protein')}g</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};