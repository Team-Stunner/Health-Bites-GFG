import React, { useEffect } from 'react';
import { Calendar, RefreshCw, Clock, Flame } from 'lucide-react';
import { useFood } from '../hooks/useFood';
import { motion } from 'framer-motion';

export const MealPlanner: React.FC = () => {
  const { weeklyMealPlan, generateMealPlan } = useFood();

  useEffect(() => {
    if (weeklyMealPlan.length === 0) {
      generateMealPlan();
    }
  }, [generateMealPlan, weeklyMealPlan.length]);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <Calendar className="h-6 w-6 mr-2 text-green-600" />
          Weekly Meal Plan
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generateMealPlan}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
        >
          <RefreshCw className="h-5 w-5 mr-2" />
          Regenerate Plan
        </motion.button>
      </div>

      <div className="space-y-6">
        {days.map((day, index) => (
          <motion.div
            key={day}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border-b border-gray-200 pb-4 last:border-b-0"
          >
            <h3 className="text-lg font-semibold mb-3">{day}</h3>
            {weeklyMealPlan[index] ? (
              <div className="flex items-center space-x-4">
                <img
                  src={weeklyMealPlan[index].image}
                  alt={weeklyMealPlan[index].name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div>
                  <h4 className="font-medium">{weeklyMealPlan[index].name}</h4>
                  <p className="text-sm text-gray-600">{weeklyMealPlan[index].description}</p>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Flame className="h-4 w-4 mr-1" />
                      {weeklyMealPlan[index].calories} cal
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {weeklyMealPlan[index].prepTime} min
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-24 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Loading meal...</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};