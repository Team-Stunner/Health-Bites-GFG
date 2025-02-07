import React from 'react';
import { Circle } from 'lucide-react';

interface ProgressProps {
  current: number;
  goal: number;
  label: string;
}

const ProgressCircle: React.FC<ProgressProps> = ({ current, goal, label }) => {
  const percentage = Math.min((current / goal) * 100, 100);
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-20">
        <Circle 
          size={80}
          className="transform -rotate-90 text-green-200"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold">{Math.round(percentage)}%</span>
        </div>
      </div>
      <span className="mt-2 text-sm text-gray-600">{label}</span>
    </div>
  );
};

export const DailyProgress: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-lg font-semibold mb-4">Today's Progress</h2>
      <div className="flex justify-around">
        <ProgressCircle current={1200} goal={2000} label="Calories" />
        <ProgressCircle current={45} goal={60} label="Protein" />
        <ProgressCircle current={120} goal={200} label="Carbs" />
      </div>
    </div>
  );
};