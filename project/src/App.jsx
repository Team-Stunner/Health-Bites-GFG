import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { Login } from './components/auth/Login';
import { PreferencesSetup } from './components/auth/PreferencesSetup';
import { DailyTracker } from './components/tracking/DailyTracker';
import { FoodRecognition } from './components/tracking/FoodRecognition';
import { MealPlanner } from './components/meal-planning/MealPlanner';
import { RecipeRecommendations } from './components/meal-planning/RecipeRecommendations';
import { GroceryList } from './components/meal-planning/GroceryList';

function App() {
  return (
    <Router>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<RecipeRecommendations />} />
                <Route path="/login" element={<Login />} />
                <Route path="/preferences" element={<PreferencesSetup />} />
                <Route path="/tracker" element={<DailyTracker />} />
                <Route path="/recognition" element={<FoodRecognition />} />
                <Route path="/meal-planner" element={<MealPlanner />} />
                <Route path="/recipes" element={<RecipeRecommendations />} />
                <Route path="/grocery-list" element={<GroceryList />} />
              </Routes>
            </main>
            <Footer />
          </div>
    </Router>
  );
}

export default App;