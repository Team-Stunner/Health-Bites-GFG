import React, { useEffect, useState } from 'react';
import { ChevronDown, Calendar, Clock, Utensils, AlertCircle } from 'lucide-react';
import axios from 'axios';
import moment from 'moment';

interface MealEntry {
  foodName: string;
  calorieCount: number;
  mealTime: string;
}

interface DailyMealPlan {
  date: string;
  meals: MealEntry[];
  totalCalories: number;
}

interface UserProfile {
  targetCalories: number;
}

const CalorieProgress: React.FC<{ current: number; goal: number }> = ({ current, goal }) => {
  const percentage = Math.min((current / goal) * 100, 100);
  const remaining = Math.max(goal - current, 0);
  const isOverLimit = current > goal;

  return (
    <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2">
        <div
          className={`h-full transition-all duration-1000 ease-out ${isOverLimit
              ? 'bg-gradient-to-r from-red-400 to-red-500'
              : 'bg-gradient-to-r from-green-400 to-emerald-500'
            }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-xl">
            <Utensils className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Daily Calories</h3>
        </div>
        <span className={`text-sm font-medium px-3 py-1 rounded-full ${isOverLimit
            ? 'bg-red-100 text-red-600'
            : 'bg-green-100 text-green-600'
          }`}>
          {Math.round(percentage)}%
        </span>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-1">
          <p className={`text-3xl font-bold ${isOverLimit ? 'text-red-600' : 'text-gray-800'
            }`}>
            {current}
          </p>
          <p className="text-sm text-gray-500">Consumed</p>
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-bold text-gray-800">{remaining}</p>
          <p className="text-sm text-gray-500">Remaining</p>
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-bold text-gray-800">{goal}</p>
          <p className="text-sm text-gray-500">Daily Goal</p>
        </div>
      </div>

      {isOverLimit && (
        <div className="mt-4 flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm font-medium">
            You've exceeded your daily calorie goal
          </p>
        </div>
      )}
    </div>
  );
};

const MealHistoryCard: React.FC<{ mealPlan: DailyMealPlan }> = ({ mealPlan }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-4">
          <div className="bg-green-50 p-2 rounded-lg">
            <Calendar className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              {moment(mealPlan.date).format('MMMM D, YYYY')}
            </h3>
            <p className="text-sm text-gray-500">
              {mealPlan.meals.length} meals • {mealPlan.totalCalories} calories
            </p>
          </div>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-gray-400 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`}
        />
      </div>

      {isExpanded && (
        <div className="bg-gray-50 border-t border-gray-100 p-4 space-y-3">
          {mealPlan.meals.length > 0 ? (
            mealPlan.meals.map((meal, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-50 p-2 rounded-md">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{meal.foodName}</p>
                    <p className="text-sm text-gray-500">
                      {moment(meal.mealTime).format('h:mm A')}
                    </p>
                  </div>
                </div>
                <span className="font-medium text-gray-700">
                  {meal.calorieCount} cal
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              No meals recorded for this day
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const DailyProgress: React.FC = () => {
  const [mealHistory, setMealHistory] = useState<DailyMealPlan[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userid = localStorage.getItem('userid');
        if (!userid) {
          throw new Error('User ID not found');
        }

        // Fetch both meal history and user profile in parallel
        const [mealResponse, profileResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/meal/food-history/${userid}`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/profile/${userid}`)
        ]);

        setMealHistory(mealResponse.data.mealPlans);
        setUserProfile(profileResponse.data);
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  const todayMealPlan = mealHistory[0] || { totalCalories: 0 };
  const calorieGoal = userProfile?.targetCalories || 2000; // Fallback to 2000 if not set

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      <CalorieProgress
        current={todayMealPlan.totalCalories}
        goal={calorieGoal}
      />

      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Meal History</h2>
        <div className="space-y-4">
          {mealHistory.length > 0 ? (
            mealHistory.map((mealPlan, index) => (
              <MealHistoryCard key={index} mealPlan={mealPlan} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No meal history available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};