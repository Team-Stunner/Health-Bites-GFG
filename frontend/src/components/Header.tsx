import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, User, Home, Activity, Utensils, Book, Camera, X, LogOut, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DietProfile, DietProfileData } from './DietProfile';

const navItems = [
  { label: 'Home', icon: <Home size={20} />, href: '/' },
  { label: 'Track', icon: <Activity size={20} />, href: '/tracking', requiresAuth: true },
  { label: 'Meal Plan', icon: <Utensils size={20} />, href: '/meal-planning', requiresAuth: true },
  { label: 'Exercise', icon: <Book size={20} />, href: '/exercise', requiresAuth: true },
  { label: 'Food Recognition', icon: <Camera size={20} />, href: '/food-recognition', requiresAuth: true },
];

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDietProfile, setShowDietProfile] = useState(false);
  const location = useLocation();
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect();
  };

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  const handleNavClick = (e: React.MouseEvent, requiresAuth: boolean) => {
    if (requiresAuth && !isAuthenticated) {
      e.preventDefault();
      handleLogin();
    }
  };

  const handleOpenDietProfile = () => {
    setShowDietProfile(true);
  };

  const handleSaveDietProfile = (data: DietProfileData) => {
    if (user) {
      localStorage.setItem(`dietProfile_${user.sub}`, JSON.stringify(data));
      setShowDietProfile(false);
    }
  };

  const getCurrentDietProfile = (): DietProfileData | undefined => {
    if (user) {
      const profileData = localStorage.getItem(`dietProfile_${user.sub}`);
      if (profileData) {
        return JSON.parse(profileData);
      }
    }
    return undefined;
  };

  const NavLink = ({ item }: { item: typeof navItems[0] }) => {
    const Component = item.requiresAuth && !isAuthenticated ? 'div' : Link;

    return (
      <Component
        to={item.href}
        onClick={(e) => handleNavClick(e, item.requiresAuth || false)}
        className={`flex items-center space-x-2 transition-colors ${location.pathname === item.href
          ? 'text-white font-semibold'
          : 'text-green-100 hover:text-white'
          } ${item.requiresAuth && !isAuthenticated ? 'cursor-pointer opacity-75 hover:opacity-100' : ''}`}
      >
        {item.icon}
        <span>{item.label}</span>
        {item.requiresAuth && !isAuthenticated && (
          <span className="text-xs ml-1"></span>
        )}
      </Component>
    );
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-green-600 text-white shadow-lg sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-1 hover:bg-green-700 rounded-full lg:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
              <Link to="/" className="flex items-center space-x-2">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Activity className="h-6 w-6" />
                </motion.div>
                <span className="text-xl font-bold">Health Bite</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <motion.div
                  key={item.label}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  <NavLink item={item} />
                </motion.div>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <motion.div
                  className="flex items-center space-x-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleOpenDietProfile}
                    className="flex items-center space-x-2 hover:bg-green-700 px-3 py-1 rounded-lg transition-colors"
                  >
                    <Settings size={20} />
                    <span className="hidden md:inline">Diet Profile</span>
                  </motion.button>

                  <motion.div
                    className="flex items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    {user?.picture ? (
                      <img
                        src={user.picture}
                        alt={user.name || 'User avatar'}
                        className="w-8 h-8 rounded-full border-2 border-white"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center">
                        <User size={16} />
                      </div>
                    )}
                    <span className="hidden md:inline font-medium">{user?.name}</span>
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="flex items-center space-x-2 hover:bg-green-700 px-3 py-1 rounded-lg transition-colors"
                  >
                    <LogOut size={20} />
                    <span className="hidden md:inline">Logout</span>
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  className="flex items-center space-x-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogin}
                    className="flex items-center space-x-2 bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors font-medium"
                  >
                    <User size={20} />
                    <span>Sign In</span>
                  </motion.button>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden bg-green-700"
            >
              <nav className="container mx-auto px-4 py-4">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <NavLink item={item} />
                  </motion.div>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Diet Profile Modal */}
      <AnimatePresence>
        {showDietProfile && (
          <DietProfile
            onClose={() => setShowDietProfile(false)}
            onSave={handleSaveDietProfile}
            initialData={getCurrentDietProfile()}
          />
        )}
      </AnimatePresence>
    </>
  );
};