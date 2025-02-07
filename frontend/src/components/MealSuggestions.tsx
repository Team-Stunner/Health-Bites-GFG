import React from 'react';
import { ChevronRight } from 'lucide-react';

interface MealCardProps {
  title: string;
  calories: number;
  image: string;
}

const MealCard: React.FC<MealCardProps> = ({ title, calories, image }) => {
  return (
    <div className="flex items-center bg-white rounded-lg shadow-sm p-3 mb-3">
      <img 
        src={image} 
        alt={title} 
        className="w-16 h-16 rounded-lg object-cover"
      />
      <div className="ml-4 flex-1">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-gray-500">{calories} calories</p>
      </div>
      <ChevronRight className="text-gray-400" size={20} />
    </div>
  );
};

export const MealSuggestions: React.FC = () => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-4">Recommended Meals</h2>
      <div className="space-y-3">
        <MealCard
          title="Quinoa Buddha Bowl"
          calories={450}
          image="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300"
        />
        <MealCard
          title="Grilled Salmon Salad"
          calories={380}
          image="https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=300"
        />
        <MealCard
          title="Avocado Toast"
          calories={320}
          image="https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=300"
        />
      </div>
    </div>
  );
};