import React from 'react';
import { Target, Droplet, Leaf } from 'lucide-react';

interface NutrientBarProps {
  label: string;
  current: number;
  goal: number;
  icon: React.ReactNode;
}

const NutrientBar: React.FC<NutrientBarProps> = ({ label, current, goal, icon }) => {
  const percentage = Math.min((current / goal) * 100, 100);
  
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          {icon}
          <span className="ml-2 text-sm font-medium">{label}</span>
        </div>
        <span className="text-sm text-gray-500">
          {current}g / {goal}g
        </span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full">
        <div 
          className="h-full bg-green-600 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export const NutritionGoals: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-lg font-semibold mb-6">Nutrition Goals</h2>
      <NutrientBar 
        label="Protein"
        current={45}
        goal={60}
        icon={<Target size={18} className="text-blue-500" />}
      />
      <NutrientBar 
        label="Carbs"
        current={120}
        goal={200}
        icon={<Leaf size={18} className="text-green-500" />}
      />
      <NutrientBar 
        label="Fats"
        current={35}
        goal={50}
        icon={<Droplet size={18} className="text-yellow-500" />}
      />
    </div>
  );
};