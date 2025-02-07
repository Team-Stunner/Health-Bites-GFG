import React, { useState } from 'react';
import { Clock, Flame, Search, MapPin, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { recipes } from '../data/recipes';
import { restaurants } from '../data/restaurants';
import type { Recipe } from '../types';

export const RecipeRecommendations: React.FC = () => {
  const [searchIngredients, setSearchIngredients] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const filteredRecipes = searchIngredients
    ? recipes.filter(recipe =>
        recipe.ingredients.some(ingredient =>
          ingredient.toLowerCase().includes(searchIngredients.toLowerCase())
        )
      )
    : recipes;

  const findNearbyRestaurants = (recipe: Recipe) => {
    return restaurants.filter(restaurant =>
      recipe.tags.some(tag =>
        restaurant.cuisine.toLowerCase().includes(tag.toLowerCase())
      )
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Recipe Recommendations</h2>
        <div className="relative">
          <input
            type="text"
            value={searchIngredients}
            onChange={(e) => setSearchIngredients(e.target.value)}
            placeholder="Search by ingredients (e.g., chicken, quinoa)"
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-green-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRecipes.map((recipe) => (
          <motion.div
            key={recipe.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100"
          >
            <img
              src={recipe.image}
              alt={recipe.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{recipe.name}</h3>
              <p className="text-gray-600 mb-4">{recipe.description}</p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center">
                  <Flame className="h-4 w-4 mr-1" />
                  {recipe.calories} cal
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {recipe.prepTime} min
                </span>
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-2">Ingredients:</h4>
                <div className="flex flex-wrap gap-2">
                  {recipe.ingredients.map((ingredient) => (
                    <span
                      key={ingredient}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {recipe.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedRecipe(selectedRecipe?.id === recipe.id ? null : recipe)}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
              >
                {selectedRecipe?.id === recipe.id ? 'Hide Details' : 'View Recipe'}
              </motion.button>
            </div>

            <AnimatePresence>
              {selectedRecipe?.id === recipe.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 border-t border-gray-200">
                    <h4 className="font-medium mb-3">Nearby Restaurants Serving Similar Cuisine:</h4>
                    <div className="space-y-3">
                      {findNearbyRestaurants(recipe).map((restaurant) => (
                        <motion.div
                          key={restaurant.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <img
                            src={restaurant.image}
                            alt={restaurant.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div>
                            <h5 className="font-medium">{restaurant.name}</h5>
                            <p className="text-sm text-gray-600 flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {restaurant.address}
                            </p>
                            <div className="flex items-center mt-1">
                              <Star className="h-4 w-4 text-yellow-400" />
                              <span className="ml-1 text-sm">{restaurant.rating}</span>
                              <span className="mx-2 text-gray-400">•</span>
                              <span className="text-sm text-gray-600">{restaurant.priceRange}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};