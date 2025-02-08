import React from 'react';
import { motion } from 'framer-motion';
import { DailyTracker } from '../components/DailyTracker';
import { NutritionGoals } from '../components/NutritionGoals';
import { WaterTracker } from '../components/WaterTracker';
import { DailyProgress } from '../components/DailyProgress';

export const Tracking: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8"
      >
        Track Your Progress
      </motion.h1>

      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8"> */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <DailyProgress />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <NutritionGoals />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <WaterTracker />
          </motion.div>
        </div>
      </div>
    // </div>
  );
};