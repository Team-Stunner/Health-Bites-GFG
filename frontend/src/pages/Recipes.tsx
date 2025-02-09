import React from 'react';
import { motion } from 'framer-motion';
import  RecipeRecommendations  from '../components/RecipeRecommendations';

export const Recipes: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold mb-8"
            >
                Recipe Library
            </motion.h1>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <RecipeRecommendations />
            </motion.div>
        </div>
    );
};