import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SupportBot } from './components/SupportBot';
import { Home } from './pages/Home';
import { Tracking } from './pages/Tracking';
import { MealPlanning } from './pages/MealPlanning';
import { Exercise } from './pages/Exercise';
import { Recipes } from './pages/Recipes';
import { ProtectedRoute } from './components/ProtectedRoute';
import { FoodRecognitionNew } from './pages/FoodRecognitionNew';

import { DietProvider } from './Context/Calary';

// Wrapper component to handle home page redirection
const HomeWrapper = () => {

  
  const { isAuthenticated } = useAuth0();
  return isAuthenticated ? <Navigate to="/food-recognition" replace /> : <Home />;
};

function App() {

  return (
    <Auth0Provider
      domain="dev-3saa5w2monm3q0wf.us.auth0.com"
      clientId="KWfBmQUat9NjJUfkUEzjtyxcBfJ9eHxx"
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
<Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
          <DietProvider>  
            <Routes>
              <Route path="/" element={<HomeWrapper />} />
              {/* <Route path="/home" element={<UserHome />} /> */}

              <Route path="/tracking" element={
                <ProtectedRoute>
                  <Tracking />
                </ProtectedRoute>
              } />
              <Route path="/meal-planning" element={
                <ProtectedRoute>
                  <MealPlanning />
                </ProtectedRoute>
              } />
              <Route path="/exercise" element={
                <ProtectedRoute>
                  <Exercise />
                </ProtectedRoute>
              } />
              <Route path="/food-recognition" element={
                <ProtectedRoute>
                  <FoodRecognitionNew />
                </ProtectedRoute>
              } />
              <Route path="/recipes" element={
                <ProtectedRoute>
                  <Recipes />
                </ProtectedRoute>
              } />
            </Routes>
            </DietProvider>
          </main>
          <Footer />
          <SupportBot />
        </div>
      </Router>
    </Auth0Provider>
  );
}

export default App;
