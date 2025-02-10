import React, { useState } from 'react';
import { Calendar, RefreshCw, Clock, Flame, Coffee, UtensilsCrossed, ChefHat, Plus, X, Utensils } from 'lucide-react';
import { useFood } from '../hooks/useFood';
import { motion, AnimatePresence } from 'framer-motion';

const commonIngredients = [
  'Rice', 'Tomatoes', 'Onions', 'Potatoes', 'Carrots', 'Garlic',
  'Ginger', 'Bell Peppers', 'Spinach', 'Chickpeas', 'Lentils',
  'Mushrooms', 'Cauliflower', 'Green Peas', 'Sweet Potatoes',
  'Cabbage', 'Corn', 'Beans', 'Paneer', 'Tofu'
];

export const MealPlanner: React.FC = () => {
  const {
    weeklyMealPlan,
    generateMealPlan,
    loading,
    error,
    dietType,
    setDietType,
    ingredients,
    setIngredients
  } = useFood();
  const [newIngredient, setNewIngredient] = useState('');
  const [selectedMeal, setSelectedMeal] = useState<number | null>(null);
  const [activeDay, setActiveDay] = useState(0);
  const [showCommonIngredients, setShowCommonIngredients] = useState(false);

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

  const handleCommonIngredientClick = (ingredient: string) => {
    if (!ingredients.includes(ingredient)) {
      setIngredients([...ingredients, ingredient]);
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealIcons = {
    breakfast: <Coffee className="h-5 w-5 text-amber-500" />,
    lunch: <Utensils className="h-5 w-5 text-green-500" />,
    dinner: <ChefHat className="h-5 w-5 text-purple-500" />,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <h2 className="text-3xl font-bold flex items-center">
                <Calendar className="h-8 w-8 mr-3" />
                Weekly Meal Planner
              </h2>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={generateMealPlan}
                disabled={loading || ingredients.length === 0}
                className="px-6 py-3 bg-white text-green-700 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-70"
              >
                <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Generating Plan...' : 'Generate Weekly Plan'}
              </motion.button>
            </div>
          </div>

          {/* Settings Panel */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Diet Type Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Diet Preference
                </label>
                <select
                  value={dietType}
                  onChange={(e) => setDietType(e.target.value as 'vegetarian' | 'non-vegetarian')}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                >
                  <option value="vegetarian">Vegetarian</option>
                  <option value="non-vegetarian">Non-Vegetarian</option>
                </select>
              </div>

              {/* Ingredient Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Add Ingredients
                </label>
                <form onSubmit={handleAddIngredient} className="flex gap-2">
                  <input
                    type="text"
                    value={newIngredient}
                    onChange={(e) => setNewIngredient(e.target.value)}
                    placeholder="Enter ingredient..."
                    className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                  </motion.button>
                </form>
              </div>
            </div>

            {/* Common Ingredients */}
            <div className="mt-6">
              <button
                onClick={() => setShowCommonIngredients(!showCommonIngredients)}
                className="text-sm font-medium text-green-600 hover:text-green-700 flex items-center gap-2"
              >
                {showCommonIngredients ? 'Hide' : 'Show'} Common Ingredients
                <motion.span
                  animate={{ rotate: showCommonIngredients ? 180 : 0 }}
                  className="inline-block"
                >
                  ▼
                </motion.span>
              </button>
              <AnimatePresence>
                {showCommonIngredients && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 flex flex-wrap gap-2">
                      {commonIngredients.map((ingredient) => (
                        <button
                          key={ingredient}
                          onClick={() => handleCommonIngredientClick(ingredient)}
                          disabled={ingredients.includes(ingredient)}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${ingredients.includes(ingredient)
                              ? 'bg-green-100 text-green-700 cursor-not-allowed'
                              : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-700'
                            }`}
                        >
                          {ingredient}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Selected Ingredients */}
            {ingredients.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Selected Ingredients ({ingredients.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {ingredients.map((ingredient) => (
                    <motion.span
                      key={ingredient}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-50 text-green-700 border border-green-200"
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
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Meal Plan Content */}
          {weeklyMealPlan.length > 0 ? (
            <>
              {/* Days Navigation */}
              <div className="border-b border-gray-200 bg-white">
                <div className="flex overflow-x-auto">
                  {days.map((day, index) => (
                    <button
                      key={day}
                      onClick={() => setActiveDay(index)}
                      className={`flex-1 min-w-[120px] py-4 px-6 text-center font-medium transition-colors ${activeDay === index
                          ? 'text-green-600 border-b-2 border-green-600'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Meals Grid */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {weeklyMealPlan[activeDay]?.map((meal, mealIndex) => (
                    <motion.div
                      key={meal?.id || mealIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: mealIndex * 0.1 }}
                      className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 overflow-hidden cursor-pointer"
                      onClick={() => setSelectedMeal(meal?.id || null)}
                    >
                      {meal ? (
                        <>
                          <div className="relative">
                            <img
                              src={meal.image}
                              alt={meal.name}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-2 right-2 flex gap-2">
                              <div className="p-2 rounded-full bg-white/90 shadow-sm">
                                {mealIcons[meal.type]}
                              </div>
                            </div>
                          </div>
                          <div className="p-4">
                            <h4 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">
                              {meal.name}
                            </h4>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {meal.description}
                            </p>
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-blue-500" />
                                <span>{meal.prepTime} min</span>
                              </div>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${meal.vegetarian
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                  }`}
                              >
                                {meal.vegetarian ? 'Veg' : 'Non-Veg'}
                              </span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center justify-center h-48 bg-gray-50">
                          <p className="text-gray-500">Loading meal...</p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center">
              <p className="text-gray-500">
                Add ingredients and click "Generate Weekly Plan" to create your meal plan
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Meal Details Modal */}
      <AnimatePresence>
        {selectedMeal && weeklyMealPlan.flat().find(meal => meal?.id === selectedMeal) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedMeal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {(() => {
                const meal = weeklyMealPlan.flat().find(m => m?.id === selectedMeal);
                return meal ? (
                  <>
                    <div className="relative h-64">
                      <img
                        src={meal.image}
                        alt={meal.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => setSelectedMeal(null)}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/90 text-gray-700 hover:text-gray-900 transition-colors"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-16rem)]">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold text-gray-900">{meal.name}</h3>
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1 text-gray-600">
                            <Clock className="h-5 w-5" />
                            {meal.prepTime} min
                          </span>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="bg-gray-50 rounded-xl p-4">
                          <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                            <UtensilsCrossed className="h-5 w-5 text-green-600" />
                            Ingredients
                          </h4>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {meal.ingredients.map((ingredient, index) => (
                              <li
                                key={index}
                                className="flex items-center gap-2 text-gray-700"
                              >
                                <span className="w-2 h-2 rounded-full bg-green-500" />
                                {ingredient}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                            <ChefHat className="h-5 w-5 text-purple-600" />
                            Instructions
                          </h4>
                          <ol className="space-y-4">
                            {meal.instructions.map((step, index) => (
                              <li
                                key={index}
                                className="flex gap-4 text-gray-700"
                              >
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-medium">
                                  {index + 1}
                                </span>
                                <p>{step}</p>
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    </div>
                  </>
                ) : null;
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};