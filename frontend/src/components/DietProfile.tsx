import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, X, Scale, Ruler, Apple, Utensils } from 'lucide-react';

interface DietProfileProps {
    onClose: () => void;
    onSave: (data: DietProfileData) => void;
    initialData?: DietProfileData;
}

export interface DietProfileData {
    weight: number;
    height: number;
    targetCalories: number;
    dietType: 'vegetarian' | 'non-vegetarian';
    activityLevel: 'sedentary' | 'moderate' | 'active';
    healthGoals: string[];
    allergies: string[];
}

const defaultFormData: DietProfileData = {
    weight: 70,
    height: 170,
    targetCalories: 2000,
    dietType: 'vegetarian',
    activityLevel: 'moderate',
    healthGoals: [],
    allergies: [],
};

export const DietProfile: React.FC<DietProfileProps> = ({ onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState<DietProfileData>(defaultFormData);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const healthGoalOptions = [
        'Weight Loss',
        'Muscle Gain',
        'Maintain Weight',
        'Better Health',
        'More Energy',
    ];

    const commonAllergies = [
        'Dairy',
        'Nuts',
        'Shellfish',
        'Eggs',
        'Soy',
        'Wheat',
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const toggleHealthGoal = (goal: string) => {
        setFormData(prev => ({
            ...prev,
            healthGoals: prev.healthGoals.includes(goal)
                ? prev.healthGoals.filter(g => g !== goal)
                : [...prev.healthGoals, goal],
        }));
    };

    const toggleAllergy = (allergy: string) => {
        setFormData(prev => ({
            ...prev,
            allergies: prev.allergies.includes(allergy)
                ? prev.allergies.filter(a => a !== allergy)
                : [...prev.allergies, allergy],
        }));
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
                <div className="p-6 border-b sticky top-0 bg-white z-10">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {initialData ? 'Edit Diet Profile' : 'Complete Your Diet Profile'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="h-6 w-6 text-gray-500" />
                        </button>
                    </div>
                    <p className="text-gray-600 mt-2">
                        {initialData
                            ? 'Update your diet preferences and health information'
                            : 'Help us personalize your experience by providing some basic information'
                        }
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-8">
                    {/* Basic Measurements */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="flex items-center text-gray-700 font-medium">
                                <Scale className="h-5 w-5 mr-2 text-green-600" />
                                Weight (kg)
                            </label>
                            <input
                                type="number"
                                value={formData.weight}
                                onChange={e => setFormData(prev => ({ ...prev, weight: Number(e.target.value) }))}
                                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                min="30"
                                max="200"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center text-gray-700 font-medium">
                                <Ruler className="h-5 w-5 mr-2 text-green-600" />
                                Height (cm)
                            </label>
                            <input
                                type="number"
                                value={formData.height}
                                onChange={e => setFormData(prev => ({ ...prev, height: Number(e.target.value) }))}
                                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                min="100"
                                max="250"
                                required
                            />
                        </div>
                    </div>

                    {/* Diet Type and Calories */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="flex items-center text-gray-700 font-medium">
                                <Utensils className="h-5 w-5 mr-2 text-green-600" />
                                Diet Type
                            </label>
                            <select
                                value={formData.dietType}
                                onChange={e => setFormData(prev => ({ ...prev, dietType: e.target.value as 'vegetarian' | 'non-vegetarian' }))}
                                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                required
                            >
                                <option value="vegetarian">Vegetarian</option>
                                <option value="non-vegetarian">Non-Vegetarian</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center text-gray-700 font-medium">
                                <Apple className="h-5 w-5 mr-2 text-green-600" />
                                Target Daily Calories
                            </label>
                            <input
                                type="number"
                                value={formData.targetCalories}
                                onChange={e => setFormData(prev => ({ ...prev, targetCalories: Number(e.target.value) }))}
                                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                min="1200"
                                max="4000"
                                step="50"
                                required
                            />
                        </div>
                    </div>

                    {/* Activity Level */}
                    <div className="space-y-2">
                        <label className="block text-gray-700 font-medium">Activity Level</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {['sedentary', 'moderate', 'active'].map((level) => (
                                <button
                                    key={level}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, activityLevel: level as any }))}
                                    className={`p-4 rounded-lg border-2 transition-colors ${formData.activityLevel === level
                                            ? 'border-green-500 bg-green-50'
                                            : 'border-gray-200 hover:border-green-200'
                                        }`}
                                >
                                    <h3 className="font-medium capitalize">{level}</h3>
                                    <p className="text-sm text-gray-600">
                                        {level === 'sedentary' && 'Little to no exercise'}
                                        {level === 'moderate' && '3-5 days of exercise'}
                                        {level === 'active' && 'Daily exercise'}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Health Goals */}
                    <div className="space-y-2">
                        <label className="block text-gray-700 font-medium">Health Goals</label>
                        <div className="flex flex-wrap gap-2">
                            {healthGoalOptions.map((goal) => (
                                <button
                                    key={goal}
                                    type="button"
                                    onClick={() => toggleHealthGoal(goal)}
                                    className={`px-4 py-2 rounded-full transition-colors ${formData.healthGoals.includes(goal)
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                        }`}
                                >
                                    {goal}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Allergies */}
                    <div className="space-y-2">
                        <label className="block text-gray-700 font-medium">Allergies & Restrictions</label>
                        <div className="flex flex-wrap gap-2">
                            {commonAllergies.map((allergy) => (
                                <button
                                    key={allergy}
                                    type="button"
                                    onClick={() => toggleAllergy(allergy)}
                                    className={`px-4 py-2 rounded-full transition-colors ${formData.allergies.includes(allergy)
                                            ? 'bg-red-500 text-white'
                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                        }`}
                                >
                                    {allergy}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center"
                        >
                            <Save className="h-5 w-5 mr-2" />
                            Save Profile
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};