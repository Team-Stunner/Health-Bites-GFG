import React from 'react';
import { motion } from 'framer-motion';

export const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <motion.div
        className="h-16 w-16 relative"
        animate={{
          rotate: 360
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="absolute top-0 left-0 right-0 bottom-0 border-4 border-green-200 rounded-full" />
        <div className="absolute top-0 left-0 right-0 bottom-0 border-4 border-green-600 rounded-full border-t-transparent animate-spin" />
      </motion.div>
    </div>
  );
};