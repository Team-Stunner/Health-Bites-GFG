import React, { useState, useRef, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  Menu,
  User,
  Camera,
  Activity,
  Utensils,
  X,
  LogOut,
  Settings,
  ChevronDown,
  Dumbbell,
  ClipboardList,
  ScrollText,
  Cookie,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DietProfile, DietProfileData } from './DietProfile';

interface NavDropdownProps {
  label: string;
  icon: React.ReactNode;
  items: {
    label: string;
    icon: React.ReactNode;
    href: string;
  }[];
}

const navDropdowns: NavDropdownProps[] = [
  {
    label: 'Dashboard',
    icon: <Activity size={20} />,
    items: [
      { label: 'Daily Tracking', icon: <ClipboardList size={18} />, href: '/tracking' },
      { label: 'Exercise Log', icon: <Dumbbell size={18} />, href: '/exercise' },
    ]
  },
  {
    label: 'Nutrition',
    icon: <Utensils size={20} />,
    items: [
      { label: 'Meal Planning', icon: <ScrollText size={18} />, href: '/meal-planning' },
      { label: 'Recipe Library', icon: <Cookie size={18} />, href: '/recipes' },
    ]
  }
];

export const Header: React.FC = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDietProfile, setShowDietProfile] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navDropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const location = useLocation();
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (!Object.values(navDropdownRefs.current).some(ref => ref?.contains(event.target as Node))) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      const saveProfile = async () => {
        try {
          const response = await axios.post(`${backendUrl}/user/profile`, {
            name: user.name,
            email: user.email
          });
          localStorage.setItem('userid', JSON.stringify(response.data._id));
        } catch (error) {
          console.error("Error saving profile", error);
        }
      };
      saveProfile();
    }
  }, [user]);

  const handleLogin = () => loginWithRedirect();

  const handleLogout = () => {
    setShowDropdown(false);
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  const handleOpenDietProfile = () => {
    setShowDropdown(false);
    setShowDietProfile(true);
  };

  const handleSaveDietProfile = (data: DietProfileData) => {
    if (user) {
      // Profile update API call
    }
  };

  const NavDropdown: React.FC<NavDropdownProps & { index: number }> = ({ label, icon, items, index }) => {
    const isActive = activeDropdown === label;

    return (
      <div className="relative" ref={el => navDropdownRefs.current[label] = el}>
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ y: 0 }}
          onClick={() => setActiveDropdown(isActive ? null : label)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200
            ${items.some(item => location.pathname === item.href)
              ? 'bg-green-700/20 text-white font-semibold'
              : 'text-green-50 hover:bg-green-700/10 hover:text-white'}`}
        >
          {icon}
          <span>{label}</span>
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${isActive ? 'rotate-180' : ''}`}
          />
        </motion.button>

        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 z-50 border border-green-100"
            >
              {items.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-green-50 transition-all duration-200
                    ${location.pathname === item.href ? 'bg-green-50 text-green-600 font-medium' : ''}`}
                  onClick={() => setActiveDropdown(null)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const UserDropdown = () => (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-3 hover:bg-green-700/20 px-4 py-2 rounded-xl transition-all duration-200"
      >
        {user?.picture ? (
          <img
            src={user.picture}
            alt={user.given_name || 'User avatar'}
            className="w-8 h-8 rounded-full border-2 border-white/80 shadow-md"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center shadow-md">
            <User size={16} className="text-white" />
          </div>
        )}
        <span className="hidden md:inline font-medium text-white">{user?.given_name}</span>
        <ChevronDown
          size={16}
          className={`text-white transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
        />
      </motion.button>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 z-50 border border-green-100"
          >
            <button
              onClick={handleOpenDietProfile}
              className="w-full flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-green-50 transition-all duration-200"
            >
              <Settings size={18} />
              <span>Diet Profile</span>
            </button>
            <div className="border-t my-1 border-gray-100"></div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-all duration-200"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-1.5 hover:bg-green-700/20 rounded-xl lg:hidden transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>

              <Link to="/" className="flex items-center space-x-3">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white/10 p-2 rounded-xl"
                >
                  <Sparkles className="h-6 w-6 text-white" />
                </motion.div>
                <span className="text-xl font-bold">Health Bite</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-2">
              {isAuthenticated ? (
                <>
                  <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                    <Link
                      to="/food-recognition"
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200
                        ${location.pathname === '/food-recognition'
                          ? 'bg-green-700/20 text-white font-semibold'
                          : 'text-green-50 hover:bg-green-700/10 hover:text-white'}`}
                    >
                      <Camera size={20} />
                      <span>Food Recognition</span>
                    </Link>
                  </motion.div>
                  {navDropdowns.map((dropdown, index) => (
                    <NavDropdown key={dropdown.label} {...dropdown} index={index} />
                  ))}
                </>
              ) : (
                <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                  <Link
                    to="/"
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200
                      ${location.pathname === '/'
                        ? 'bg-green-700/20 text-white font-semibold'
                        : 'text-green-50 hover:bg-green-700/10 hover:text-white'}`}
                  >
                    <Sparkles size={20} />
                    <span>Home</span>
                  </Link>
                </motion.div>
              )}
            </nav>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <UserDropdown />
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
                    className="flex items-center space-x-2 bg-white text-green-600 px-5 py-2 rounded-xl hover:bg-green-50 transition-all duration-200 font-medium shadow-md"
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
              className="lg:hidden bg-green-700/20 border-t border-green-500"
            >
              <nav className="container mx-auto px-4 py-4 space-y-4">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/food-recognition"
                      className="flex items-center space-x-3 text-green-50 hover:text-white transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Camera size={20} />
                      <span>Food Recognition</span>
                    </Link>

                    {navDropdowns.map((dropdown) => (
                      <div key={dropdown.label} className="space-y-3">
                        <div className="flex items-center space-x-3 text-white font-medium">
                          {dropdown.icon}
                          <span>{dropdown.label}</span>
                        </div>
                        <div className="pl-8 space-y-3">
                          {dropdown.items.map((item) => (
                            <Link
                              key={item.href}
                              to={item.href}
                              className="flex items-center space-x-3 text-green-50 hover:text-white transition-colors"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {item.icon}
                              <span>{item.label}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <Link
                    to="/"
                    className="flex items-center space-x-3 text-green-50 hover:text-white transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Sparkles size={20} />
                    <span>Home</span>
                  </Link>
                )}
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
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Header