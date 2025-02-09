import React, { useEffect, useState } from 'react';
import { Calendar, RefreshCw, Clock, Flame, Coffee, UtensilsCrossed, ChefHat, Plus, X } from 'lucide-react';
import { useFood } from '../hooks/useFood';
import { motion, AnimatePresence } from 'framer-motion';

export const MealPlanner: React.FC = () => {
  const { 
    weeklyMealPlan, 
    generateMealPlan, 
    loading, 
    error, 
    dietType, 
    setDietType, 
    ingredients, 
    setIngredients,
    targetCalories,
    setTargetCalories 
  } = useFood();
  const [newIngredient, setNewIngredient] = useState('');
  const [selectedMeal, setSelectedMeal] = useState<number | null>(null);

  useEffect(() => {
    if (weeklyMealPlan.length === 0 ) {//&& ingredients.length > 0
      generateMealPlan();
    }
  }, [generateMealPlan, weeklyMealPlan.length, ingredients.length]);

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

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealIcons = {
    breakfast: <Coffee className="h-5 w-5 text-orange-500" />,
    lunch: <UtensilsCrossed className="h-5 w-5 text-green-500" />,
    dinner: <ChefHat className="h-5 w-5 text-purple-500" />,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
          <h2 className="text-2xl font-bold flex items-center">
            <Calendar className="h-6 w-6 mr-2 text-green-600" />
            Indian Weekly Meal Plan
          </h2>
          
          <div className="w-full sm:w-auto space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1">
                <label htmlFor="calories" className="block text-sm font-medium text-gray-700 mb-1">
                  Daily Calories Target
                </label>
                <input
                  type="number"
                  id="calories"
                  min="1200"
                  max="4000"
                  value={targetCalories}
                  onChange={(e) => setTargetCalories(Number(e.target.value))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  placeholder="Enter daily calories"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Each meal will target {Math.round(targetCalories / 3)} calories
                </p>
              </div>
            </div>

            <form onSubmit={handleAddIngredient} className="flex gap-2">
              <input
                type="text"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                placeholder="Add ingredient..."
                className="flex-1 min-w-[200px] rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
              <button
                type="submit"
                className="p-2 rounded-md bg-green-100 text-green-600 hover:bg-green-200"
              >
                <Plus className="h-5 w-5" />
              </button>
            </form>

            {ingredients.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ingredient) => (
                  <span
                    key={ingredient}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-50 text-green-700"
                  >
                    {ingredient}
                    <button
                      onClick={() => handleRemoveIngredient(ingredient)}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4">
              <select
                value={dietType}
                onChange={(e) => setDietType(e.target.value as 'vegetarian' | 'non-vegetarian')}
                className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              >
                <option value="vegetarian">Vegetarian</option>
                <option value="non-vegetarian">Non-Vegetarian</option>
              </select>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={generateMealPlan}
                disabled={loading || ingredients.length === 0}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
              >
                <RefreshCw className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Generating...' : 'Generate Plan'}
              </motion.button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-8">
          {days.map((day, dayIndex) => (
            <motion.div
              key={day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: dayIndex * 0.1 }}
              className="border-b border-gray-200 pb-6 last:border-b-0"
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-800 bg-gray-50 p-3 rounded-lg">
                {day}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {weeklyMealPlan[dayIndex]?.map((meal, mealIndex) => (
                  <motion.div
                    key={meal?.id || mealIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (dayIndex * 3 + mealIndex) * 0.05 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden cursor-pointer"
                    onClick={() => setSelectedMeal(meal?.id || null)}
                  >
                    {meal ? (
                      <>
                        <div className="relative">
                          <img
                            src={meal.image}
                            alt={meal.name}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute top-2 right-2 flex gap-2">
                            {mealIcons[meal.type]}
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-lg text-gray-900">{meal.name}</h4>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{meal.description}</p>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span className="flex items-center">
                              <Flame className="h-4 w-4 mr-1 text-red-500" />
                              {meal.calories} cal
                              <span className="text-xs ml-1">
                                ({Math.round((meal.calories / (targetCalories / 3)) * 100)}% of target)
                              </span>
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-blue-500" />
                              {meal.prepTime} min
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              meal.vegetarian 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
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
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selectedMeal && weeklyMealPlan.flat().find(meal => meal?.id === selectedMeal) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
              onClick={() => setSelectedMeal(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                {(() => {
                  const meal = weeklyMealPlan.flat().find(m => m?.id === selectedMeal);
                  return meal ? (
                    <>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold">{meal.name}</h3>
                        <button
                          onClick={() => setSelectedMeal(null)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-6 w-6" />
                        </button>
                      </div>
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold mb-2">Ingredients:</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {meal.ingredients.map((ingredient, index) => (
                              <li key={index} className="text-gray-700">{ingredient}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Instructions:</h4>
                          <ol className="list-decimal list-inside space-y-2">
                            {meal.instructions.map((step, index) => (
                              <li key={index} className="text-gray-700">{step}</li>
                            ))}
                          </ol>
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
    </div>
  );
};