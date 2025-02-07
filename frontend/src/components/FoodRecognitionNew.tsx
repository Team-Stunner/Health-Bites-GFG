/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Camera, Image as ImageIcon, Check, Loader2, Upload } from 'lucide-react';
import { useFood } from '../hooks/useFood';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

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

export const FoodRecognitionNew: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [recognizedFood, setRecognizedFood] = useState<RecognizedFood | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);
    const { addFoodItem } = useFood();

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
            // const compressedImage = await compressImage(file);
            const formData = new FormData();
            formData.append('image', file);


            const response = await axios.post('http://localhost:5000/analyze', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
            });

            setAnalysisResult(response.data.calorie_info);
        } catch (err) {
            console.error('Error analyzing image:', err);
            setError('Failed to analyze image. Please try again with a smaller image.');
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

    return (
        <div className="bg-white rounded-lg shadow-md p-8 min-h-[800px]">
            <h2 className="text-3xl font-bold mb-8 flex items-center text-gray-800">
                <Camera className="h-8 w-8 mr-3 text-green-600" />
                Food Recognition
            </h2>

            <div className="grid grid-cols-1 gap-8">
                <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-xl">
                        <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-700">
                            <Upload className="h-5 w-5 mr-2 text-green-600" />
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
                                className={`flex items-center justify-center w-full border-2 border-dashed rounded-xl cursor-pointer transition-colors ${selectedImage ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-green-400'
                                    }`}
                            >
                                <div className={`w-full ${selectedImage ? 'h-[400px]' : 'h-64'} relative`}>
                                    {selectedImage ? (
                                        <>
                                            <img
                                                src={selectedImage}
                                                alt="Selected food"
                                                className="h-full w-full object-contain rounded-lg"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-opacity rounded-lg flex items-center justify-center">
                                                <p className="text-transparent hover:text-white transition-colors font-medium">
                                                    Click to change image
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full">
                                            <ImageIcon className="h-16 w-16 text-gray-400 mb-4" />
                                            <div className="text-center">
                                                <p className="text-sm font-medium text-gray-600 mb-1">
                                                    Click to upload or drag and drop
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Recommended: Images under 5MB
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.label>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleAnalyzeClick}
                            disabled={!selectedImage || isLoading}
                            className={`mt-6 w-full py-4 px-6 rounded-xl text-white font-medium flex items-center justify-center gap-3 transition-colors ${!selectedImage || isLoading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-green-600 hover:bg-green-700'
                                }`}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Analyzing your food...
                                </>
                            ) : (
                                <>
                                    <Camera className="h-5 w-5" />
                                    Analyze Food Image
                                </>
                            )}
                        </motion.button>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-red-50 text-red-600 p-6 rounded-xl"
                        >
                            <p className="font-medium">{error}</p>
                        </motion.div>
                    )}

                    <AnimatePresence>
                        {analysisResult && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-green-50 rounded-xl p-6"
                            >
                                <h3 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
                                    <Check className="h-6 w-6 mr-2 text-green-600" />
                                    Analysis Results
                                </h3>
                                <div className="prose max-w-none">
                                    <pre className="whitespace-pre-wrap text-gray-700 bg-white p-6 rounded-xl shadow-sm border border-green-100">
                                        {analysisResult}
                                    </pre>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};