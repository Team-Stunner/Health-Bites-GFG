import React from 'react';
import { Activity, Flame } from 'lucide-react';

interface ExerciseCardProps {
  title: string;
  duration: string;
  calories: number;
  time: string;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ title, duration, calories, time }) => {
  return (
    <div className="flex items-center bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
        <Activity className="text-red-500" size={24} />
      </div>
      <div className="ml-4 flex-1">
        <h3 className="font-medium">{title}</h3>
        <div className="flex items-center text-sm text-gray-500">
          <span>{duration}</span>
          <span className="mx-2">•</span>
          <Flame size={16} className="text-red-500" />
          <span className="ml-1">{calories} cal</span>
        </div>
      </div>
      <span className="text-sm text-gray-500">{time}</span>
    </div>
  );
};

export const ExerciseTracker: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Today's Activities</h2>
      <div className="space-y-4">
        <ExerciseCard
          title="Morning Run"
          duration="30 min"
          calories={320}
          time="7:00 AM"
        />
        <ExerciseCard
          title="Yoga Session"
          duration="45 min"
          calories={180}
          time="6:00 PM"
        />
      </div>
    </div>
  );
};