import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
    Save, X, Scale, Ruler, Apple, Activity,
    Target, AlertCircle, ChevronRight, Loader2
} from 'lucide-react';

interface DietProfileProps {
    onClose: () => void;
    onSave: (data: DietProfileData) => void;
}

export interface DietProfileData {
    userid: String;
    weight: number;
    height: number;
    targetCalories: number;
    dietType: 'vegetarian' | 'non-vegetarian';
    activityLevel: 'sedentary' | 'moderate' | 'active';
    healthGoals: string[];
    allergies: string[];
}

const defaultFormData: DietProfileData = {
    userid: '',
    weight: 70,
    height: 170,
    targetCalories: 2000,
    dietType: 'vegetarian',
    activityLevel: 'moderate',
    healthGoals: [],
    allergies: [],
};

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

const calculateBMI = (weight: number, height: number): number => {
    const heightInMeters = height / 100;
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
};

const getBMICategory = (bmi: number): string => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
};

export const DietProfile: React.FC<DietProfileProps> = ({ onClose, onSave }) => {
    const backendurl = import.meta.env.VITE_BACKEND_URL;
    const userid = localStorage.getItem('userid') || '';

    const [formData, setFormData] = useState<DietProfileData>({
        ...defaultFormData,
        userid,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [showBMI, setShowBMI] = useState(false);

    const bmi = calculateBMI(formData.weight, formData.height);
    const bmiCategory = getBMICategory(bmi);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${backendurl}/user/profile/${userid}`);
                setFormData(prev => ({ ...prev, ...response.data }));
            } catch (err) {
                setError("Failed to load profile. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userid, backendurl]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.weight || !formData.height || !formData.targetCalories || !formData.dietType || !formData.activityLevel) {
            setError("Please fill in all required fields.");
            return;
        }

        try {
            setSaving(true);
            const response = await axios.put(`${backendurl}/user/updateprofile`, formData);

            await Swal.fire({
                title: 'Success!',
                text: 'Your diet profile has been updated successfully.',
                icon: 'success',
                confirmButtonText: 'Great!',
                confirmButtonColor: '#22c55e',
                customClass: {
                    popup: 'rounded-xl',
                    confirmButton: 'rounded-lg',
                }
            });

            onSave(response.data);
        } catch (error) {
            console.error("Error updating profile:", error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to update profile. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#ef4444',
                customClass: {
                    popup: 'rounded-xl',
                    confirmButton: 'rounded-lg',
                }
            });
            setError("Failed to update profile. Please try again.");
        } finally {
            setSaving(false);
        }
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

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white p-8 rounded-xl shadow-xl flex flex-col items-center"
                >
                    <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
                    <p className="mt-4 text-lg font-medium text-gray-700">Loading your profile...</p>
                </motion.div>
            </div>
        );
    }

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <h3 className="text-xl font-semibold text-gray-800">Basic Measurements</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative">
                                <label className="text-gray-700 font-medium flex items-center gap-2">
                                    <Scale className="w-5 h-5" />
                                    Weight (kg)
                                </label>
                                <input
                                    type="number"
                                    value={formData.weight}
                                    onChange={e => setFormData(prev => ({ ...prev, weight: Number(e.target.value) }))}
                                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div className="relative">
                                <label className="text-gray-700 font-medium flex items-center gap-2">
                                    <Ruler className="w-5 h-5" />
                                    Height (cm)
                                </label>
                                <input
                                    type="number"
                                    value={formData.height}
                                    onChange={e => setFormData(prev => ({ ...prev, height: Number(e.target.value) }))}
                                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>

                        <motion.div
                            className="mt-4"
                            initial={false}
                            animate={{ height: showBMI ? 'auto' : 0, opacity: showBMI ? 1 : 0 }}
                        >
                            {showBMI && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-lg font-medium text-gray-800">Your BMI</h4>
                                            <p className="text-gray-600">Body Mass Index</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-3xl font-bold text-green-600">{bmi}</p>
                                            <p className="text-sm text-gray-600">{bmiCategory}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>

                        <button
                            type="button"
                            onClick={() => setShowBMI(!showBMI)}
                            className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1"
                        >
                            {showBMI ? 'Hide' : 'Show'} BMI Calculator
                            <ChevronRight className={`w-4 h-4 transform transition-transform ${showBMI ? 'rotate-90' : ''}`} />
                        </button>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <h3 className="text-xl font-semibold text-gray-800">Diet Preferences</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-gray-700 font-medium flex items-center gap-2">
                                    <Apple className="w-5 h-5" />
                                    Diet Type
                                </label>
                                <select
                                    value={formData.dietType}
                                    onChange={e => setFormData(prev => ({ ...prev, dietType: e.target.value as 'vegetarian' | 'non-vegetarian' }))}
                                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    required
                                >
                                    <option value="vegetarian">Vegetarian</option>
                                    <option value="non-vegetarian">Non-Vegetarian</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-gray-700 font-medium flex items-center gap-2">
                                    <Target className="w-5 h-5" />
                                    Target Calories
                                </label>
                                <input
                                    type="number"
                                    value={formData.targetCalories}
                                    onChange={e => setFormData(prev => ({ ...prev, targetCalories: Number(e.target.value) }))}
                                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-gray-700 font-medium flex items-center gap-2">
                                <Activity className="w-5 h-5" />
                                Activity Level
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {['sedentary', 'moderate', 'active'].map((level) => (
                                    <motion.button
                                        key={level}
                                        type="button"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
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
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <h3 className="text-xl font-semibold text-gray-800">Goals & Restrictions</h3>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-gray-700 font-medium">Health Goals</label>
                                <div className="flex flex-wrap gap-2">
                                    {healthGoalOptions.map((goal) => (
                                        <motion.button
                                            key={goal}
                                            type="button"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => toggleHealthGoal(goal)}
                                            className={`px-4 py-2 rounded-full transition-colors ${formData.healthGoals.includes(goal)
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                                }`}
                                        >
                                            {goal}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-gray-700 font-medium flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5" />
                                    Allergies & Restrictions
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {commonAllergies.map((allergy) => (
                                        <motion.button
                                            key={allergy}
                                            type="button"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => toggleAllergy(allergy)}
                                            className={`px-4 py-2 rounded-full transition-colors ${formData.allergies.includes(allergy)
                                                    ? 'bg-red-500 text-white'
                                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                                }`}
                                        >
                                            {allergy}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
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
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Your Diet Profile</h2>
                            <p className="text-gray-600 mt-1">Step {currentStep} of 3</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="h-6 w-6 text-gray-500" />
                        </button>
                    </div>

                    <div className="mt-4 flex gap-2">
                        {[1, 2, 3].map((step) => (
                            <motion.div
                                key={step}
                                className={`h-2 rounded-full flex-1 ${step <= currentStep ? 'bg-green-500' : 'bg-gray-200'
                                    }`}
                                initial={false}
                                animate={{
                                    backgroundColor: step <= currentStep ? '#22c55e' : '#e5e7eb'
                                }}
                            />
                        ))}
                    </div>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 text-red-600 p-4 text-center"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="p-6 space-y-8">
                    <AnimatePresence mode="wait">
                        {renderStep()}
                    </AnimatePresence>

                    <div className="flex justify-between space-x-4">
                        {currentStep > 1 && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={() => setCurrentStep(step => step - 1)}
                                className="px-6 py-2 rounded-lg border hover:bg-gray-50"
                            >
                                Previous
                            </motion.button>
                        )}
                        <div className="flex-1" />
                        {currentStep < 3 ? (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={() => setCurrentStep(step => step + 1)}
                                className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                            >
                                Next
                            </motion.button>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={saving}
                                className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                                {saving ? 'Saving...' : 'Save Profile'}
                            </motion.button>
                        )}
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};