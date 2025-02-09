import React, { useState } from 'react';
import { Camera, Image as ImageIcon, Check, Loader2, Upload, Utensils } from 'lucide-react';
import { useFood } from '../hooks/useFood';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useDiet } from '../Context/Calary';
const backendurl = import.meta.env.VITE_BACKEND_URL;

interface RecognizedFood {
    name: string;
    calories: number;
    confidence: number;
    nutrients: {
        protein: string;
        carbs: string;
        fat: string;
    };
}

interface FoodEntry {
    name: string;
    calories: number;
    id: string;
}

export const FoodRecognitionNew: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [recognizedFood, setRecognizedFood] = useState<RecognizedFood | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [foodName, setFoodName] = useState('');
    const [calories, setCalories] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);
    const { addFoodItem } = useFood();

    const { todayCalories, setTodayCalories, foodEntries, setFoodEntries } = useDiet();

    const compressImage = async (file: File): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 800;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                resolve(blob);
                            } else {
                                reject(new Error('Failed to compress image'));
                            }
                        },
                        'image/jpeg',
                        0.7
                    );
                };
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const analyzeFoodImage = async (file: File) => {
        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await axios.post(`${backendurl}/analysis/analyze`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log(response.data);

            // Update state with the analysis results
            setAnalysisResult(response.data.raw_analysis);
            setFoodName(response.data.dish_name || 'Unknown');
            setCalories(response.data.total_calories || 0);

        } catch (err) {
            console.error('Error analyzing image:', err);
            setError('Failed to analyze image. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const compressedImage = await compressImage(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setSelectedImage(reader.result as string);
                };
                reader.readAsDataURL(compressedImage);
                setAnalysisResult(null);
            } catch (err) {
                setError('Failed to process image. Please try a different image.');
            }
        }
    };

    const handleAnalyzeClick = () => {
        const input = document.querySelector('#image-input') as HTMLInputElement;
        const file = input.files?.[0];
        if (file) {
            analyzeFoodImage(file);
        } else {
            setError('Please select an image first');
        }
    };

    const handlesubmit = async (e: React.FormEvent) => {
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
                    mealTime: new Date().toISOString() // You can make this dynamic
                });

                if (response.data.dailyMealPlan.totalCalories) {
                    setTodayCalories(response.data.dailyMealPlan.totalCalories);
                    setFoodEntries([...foodEntries, ...response.data.dailyMealPlan.meals]);
                }

                setFoodName('');
                setCalories('');
            } catch (error) {
                console.error("Error adding food:", error);
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 min-h-[800px] border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold flex items-center text-gray-800">
                        <Camera className="h-8 w-8 mr-3 text-green-600" />
                        Food Recognition
                    </h2>
                    <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-lg">
                        <Utensils className="h-5 w-5 text-green-600" />
                        <span className="text-green-700 font-medium">Today's Calories: {todayCalories}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    <motion.div
                        className="space-y-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="text-xl font-semibold mb-6 flex items-center text-gray-700">
                                <Upload className="h-6 w-6 mr-3 text-green-600" />
                                Upload Food Image
                            </h3>

                            <div className="relative">
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    id="image-input"
                                    disabled={isLoading}
                                />
                                <motion.label
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    htmlFor="image-input"
                                    className={`flex items-center justify-center w-full border-3 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${selectedImage
                                        ? 'border-green-400 bg-green-50/50'
                                        : 'border-gray-200 hover:border-green-400 hover:bg-green-50/30'
                                        }`}
                                >
                                    <div className={`w-full ${selectedImage ? 'h-[400px]' : 'h-72'} relative`}>
                                        {selectedImage ? (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="h-full"
                                            >
                                                <img
                                                    src={selectedImage}
                                                    alt="Selected food"
                                                    className="h-full w-full object-contain rounded-xl"
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 rounded-xl flex items-center justify-center group">
                                                    <p className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity transform scale-95 group-hover:scale-100">
                                                        Click to change image
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full">
                                                <div className="p-6 bg-green-50 rounded-full mb-4">
                                                    <ImageIcon className="h-12 w-12 text-green-600" />
                                                </div>
                                                <div className="text-center space-y-2">
                                                    <p className="text-base font-medium text-gray-700">
                                                        Click to upload or drag and drop
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Recommended: High-quality images under 5MB
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.label>
                            </div>

                            <div className="mt-8 space-y-4">
                                <motion.button
                                    onClick={handleAnalyzeClick}
                                    disabled={!selectedImage || isLoading}
                                    className="w-full py-4 px-6 rounded-xl text-white font-semibold bg-gradient-to-r from-green-500 to-green-600 shadow-md hover:shadow-lg transition-all duration-300 hover:brightness-105 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            <span>Analyzing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Camera className="h-5 w-5" />
                                            <span>Analyze Food Image</span>
                                        </>
                                    )}
                                </motion.button>

                                <motion.button
                                    onClick={handlesubmit}
                                    disabled={!foodName || !calories}
                                    className="w-full py-4 px-6 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-500 to-blue-600 shadow-md hover:shadow-lg transition-all duration-300 hover:brightness-105 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Check className="h-5 w-5" />
                                    <span>Add Food Entry</span>
                                </motion.button>
                            </div>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="bg-red-50 border border-red-100 text-red-600 p-6 rounded-xl shadow-sm"
                                >
                                    <p className="font-medium flex items-center">
                                        <span className="bg-red-100 p-1 rounded-full mr-2">⚠️</span>
                                        {error}
                                    </p>
                                </motion.div>
                            )}

                            {analysisResult && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="bg-gradient-to-br from-green-50 to-green-50/30 rounded-2xl p-8 border border-green-100"
                                >
                                    <h3 className="text-xl font-semibold text-green-800 mb-6 flex items-center">
                                        <Check className="h-6 w-6 mr-3 text-green-600" />
                                        Analysis Results
                                    </h3>
                                    <div className="prose max-w-none">
                                        <pre className="whitespace-pre-wrap text-gray-700 bg-white p-6 rounded-xl shadow-sm border border-green-100 overflow-auto max-h-[400px]">
                                            {analysisResult}
                                        </pre>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};