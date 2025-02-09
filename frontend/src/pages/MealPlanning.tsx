import React from 'react';
import { motion } from 'framer-motion';
import {MealPlanner}  from '../components/MealPlanner';
import { GroceryList } from '../components/GroceryList';
import { MealSuggestions } from '../components/MealSuggestions';

export const MealPlanning: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8"
      >
        Meal Planning
      </motion.h1>

      <div className="flex-col grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <MealPlanner />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GroceryList />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8"
      >
        <MealSuggestions />
      </motion.div>
    </div>
  );
};