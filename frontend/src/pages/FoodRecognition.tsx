import React from 'react';
import { motion } from 'framer-motion';
import { FoodRecognition as FoodRecognitionComponent } from '../components/FoodRecognition';
import { DailyTracker } from '../components/DailyTracker';

export const FoodRecognition: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8"
      >
        Food Recognition
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <FoodRecognitionComponent />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <DailyTracker />
        </motion.div>
      </div>
    </div>
  );
};