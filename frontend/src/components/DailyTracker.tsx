import React, { useState } from 'react';
import { Plus, PieChart } from 'lucide-react';
import { format } from 'date-fns';
import { useFood } from '../hooks/useFood';
import { motion } from 'framer-motion';

export const DailyTracker: React.FC = () => {
  const { dailyLog, addFoodItem } = useFood();
  const [newFood, setNewFood] = useState('');
  const [calories, setCalories] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFood && calories) {
      addFoodItem(newFood, parseInt(calories));
      setNewFood('');
      setCalories('');
    }
  };

  const totalCalories = dailyLog.reduce((sum, item) => sum + item.calories, 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <PieChart className="h-6 w-6 mr-2 text-green-600" />
        Daily Food Tracker
      </h2>

      <form onSubmit={handleSubmit} className="flex gap-4 mb-6">
        <input
          type="text"
          value={newFood}
          onChange={(e) => setNewFood(e.target.value)}
          placeholder="Food item"
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
        <input
          type="number"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          placeholder="Calories"
          className="w-32 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add
        </motion.button>
      </form>

      <motion.div 
        className="bg-green-50 rounded-lg p-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-semibold text-green-800">Daily Summary</h3>
        <p className="text-green-600">Total Calories: {totalCalories}</p>
      </motion.div>

      <div className="space-y-4">
        {dailyLog.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div>
              <h4 className="font-medium">{item.food}</h4>
              <p className="text-sm text-gray-500">
                {format(item.timestamp, 'h:mm a')}
              </p>
            </div>
            <span className="font-medium">{item.calories} cal</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};