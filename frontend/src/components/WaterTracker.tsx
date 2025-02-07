import React from 'react';
import { Droplets, Plus, Minus } from 'lucide-react';

export const WaterTracker: React.FC = () => {
  const [glasses, setGlasses] = React.useState(4);
  const goal = 8;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Water Intake</h2>
        <div className="flex items-center text-blue-500">
          <Droplets size={24} />
          <span className="ml-2 font-medium">{glasses} / {goal} glasses</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setGlasses(prev => Math.max(0, prev - 1))}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <Minus size={24} className="text-gray-500" />
        </button>
        
        <div className="flex-1 mx-4">
          <div className="h-4 bg-blue-100 rounded-full">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all"
              style={{ width: `${(glasses / goal) * 100}%` }}
            />
          </div>
        </div>
        
        <button 
          onClick={() => setGlasses(prev => Math.min(goal, prev + 1))}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <Plus size={24} className="text-gray-500" />
        </button>
      </div>
    </div>
  );
};