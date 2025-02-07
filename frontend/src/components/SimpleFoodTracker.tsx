import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface FoodEntry {
    name: string;
    calories: number;
    id: string;
}

export const SimpleFoodTracker: React.FC = () => {
    const [foodName, setFoodName] = useState('');
    const [calories, setCalories] = useState('');
    const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
    const [totalCalories, setTotalCalories] = useState(0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (foodName && calories) {
            const caloriesNum = parseInt(calories);
            const newEntry: FoodEntry = {
                name: foodName,
                calories: caloriesNum,
                id: Date.now().toString()
            };

            setFoodEntries([...foodEntries, newEntry]);
            setTotalCalories(totalCalories + caloriesNum);
            setFoodName('');
            setCalories('');
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Track Your Food</h2>

            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                <div>
                    <label htmlFor="foodName" className="block text-sm font-medium text-gray-700 mb-1">
                        Food Name
                    </label>
                    <input
                        type="text"
                        id="foodName"
                        value={foodName}
                        onChange={(e) => setFoodName(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Enter food name"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="calories" className="block text-sm font-medium text-gray-700 mb-1">
                        Calories
                    </label>
                    <input
                        type="number"
                        id="calories"
                        value={calories}
                        onChange={(e) => setCalories(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Enter calories"
                        min="0"
                        required
                    />
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Food
                </motion.button>
            </form>

            <div className="bg-green-50 rounded-lg p-4 mb-6">
                <p className="text-lg font-semibold text-green-800">
                    Total Calories Today: {totalCalories}
                </p>
            </div>

            {foodEntries.length > 0 && (
                <div className="space-y-3">
                    <h3 className="font-medium text-gray-700">Today's Entries</h3>
                    {foodEntries.map((entry) => (
                        <motion.div
                            key={entry.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-50 p-3 rounded-lg flex justify-between items-center"
                        >
                            <span className="font-medium">{entry.name}</span>
                            <span className="text-gray-600">{entry.calories} cal</span>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};