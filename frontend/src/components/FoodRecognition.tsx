import React, { useState } from 'react';
import { Camera, Image as ImageIcon, Check } from 'lucide-react';
import { useFood } from '../hooks/useFood';
import { motion, AnimatePresence } from 'framer-motion';

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

export const FoodRecognition: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [recognizedFood, setRecognizedFood] = useState<RecognizedFood | null>(null);
  const { addFoodItem } = useFood();

  // Simulate food recognition with dummy data
  const recognizeFoodFromImage = () => {
    // Simulated API response
    const dummyRecognition: RecognizedFood = {
      name: 'Grilled Chicken Salad',
      calories: 350,
      confidence: 0.92,
      nutrients: {
        protein: '25g',
        carbs: '15g',
        fat: '12g'
      }
    };
    setRecognizedFood(dummyRecognition);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        recognizeFoodFromImage();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddToLog = () => {
    if (recognizedFood) {
      addFoodItem(recognizedFood.name, recognizedFood.calories);
      setSelectedImage(null);
      setRecognizedFood(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <Camera className="h-6 w-6 mr-2 text-green-600" />
        Food Recognition
      </h2>

      <div className="mb-6">
        <label className="block mb-4">
          <span className="sr-only">Choose image</span>
          <div className="relative">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageSelect}
              id="image-input"
            />
            <motion.label
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              htmlFor="image-input"
              className="flex items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors"
            >
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Selected food"
                  className="h-full w-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                </div>
              )}
            </motion.label>
          </div>
        </label>
      </div>

      <AnimatePresence>
        {recognizedFood && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-50 rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold text-green-800 mb-4">
              Recognition Results
            </h3>
            <div className="space-y-3">
              <p className="flex items-center">
                <Check className="h-5 w-5 text-green-600 mr-2" />
                <span className="font-medium">{recognizedFood.name}</span>
                <span className="ml-2 text-sm text-gray-600">
                  ({(recognizedFood.confidence * 100).toFixed(1)}% confidence)
                </span>
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-3 rounded-md">
                  <p className="text-sm text-gray-600">Calories</p>
                  <p className="font-semibold">{recognizedFood.calories}</p>
                </div>
                <div className="bg-white p-3 rounded-md">
                  <p className="text-sm text-gray-600">Protein</p>
                  <p className="font-semibold">{recognizedFood.nutrients.protein}</p>
                </div>
                <div className="bg-white p-3 rounded-md">
                  <p className="text-sm text-gray-600">Carbs</p>
                  <p className="font-semibold">{recognizedFood.nutrients.carbs}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToLog}
                className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
              >
                Add to Food Log
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};