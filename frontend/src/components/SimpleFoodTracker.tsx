import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDiet } from '../Context/Calary';
import axios from 'axios';
import Swal from 'sweetalert2';

interface FoodEntry {
    name: string;
    calories: number;
    id: string;
}

export const SimpleFoodTracker: React.FC = () => {
    const backendurl = import.meta.env.VITE_BACKEND_URL;
    const [foodName, setFoodName] = useState('');
    const [calories, setCalories] = useState('');
    const { todayCalories, setTodayCalories, foodEntries, setFoodEntries } = useDiet();

    useEffect(() => {
        console.log("todayCalories updated:", todayCalories);
    }, [todayCalories]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (foodName && calories) {
            const caloriesNum = parseInt(calories);
            const newEntry: FoodEntry = {
                name: foodName,
                calories: caloriesNum,
                id: Date.now().toString()
            };

            try {
                const userid = localStorage.getItem('userid') || '';
                const response = await axios.post(`${backendurl}/meal/add-food`, {
                    userid,
                    foodName,
                    calories: caloriesNum,
                    mealTime: new Date().toISOString()
                });

                if (response.data.dailyMealPlan.totalCalories) {
                    setTodayCalories(response.data.dailyMealPlan.totalCalories);
                    setFoodEntries([...foodEntries, ...response.data.dailyMealPlan.meals]);

                    // Show success message
                    await Swal.fire({
                        title: 'Food Added!',
                        text: `Added ${foodName} (${caloriesNum} calories) to your food diary`,
                        icon: 'success',
                        confirmButtonText: 'Great!',
                        confirmButtonColor: '#16a34a',
                        showClass: {
                            popup: 'animate__animated animate__fadeInDown'
                        },
                        hideClass: {
                            popup: 'animate__animated animate__fadeOutUp'
                        }
                    });

                    setFoodName('');
                    setCalories('');
                }
            } catch (error) {
                console.error("Error adding food:", error);
                // Show error message
                await Swal.fire({
                    title: 'Error!',
                    text: 'Failed to add food entry. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#ef4444',
                    showClass: {
                        popup: 'animate__animated animate__fadeInDown'
                    },
                    hideClass: {
                        popup: 'animate__animated animate__fadeOutUp'
                    }
                });
            }
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
                    Total Calories Today: {todayCalories}
                </p>
            </div>

            {foodEntries !== undefined && foodEntries
                .slice()
                .sort((a: any, b: any) => new Date(b.mealTime).getTime() - new Date(a.mealTime).getTime())
                .map((entry: any) => (
                    <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-50 p-3 rounded-lg flex justify-between items-center mb-2"
                    >
                        <span className="font-medium">{entry.foodName}</span>
                        <span className="text-gray-600">{entry.calorieCount} cal</span>
                        <span className="text-gray-600">
                            {new Date(entry.mealTime).toLocaleTimeString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                            })}
                        </span>
                    </motion.div>
                ))
            }
        </div>
    );
};