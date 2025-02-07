import React, { useState, useRef, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  User,
  Home,
  Activity,
  Utensils,
  Book,
  Camera,
  X,
  LogOut,
  Settings,
  ChevronDown,
  Dumbbell,
  ClipboardList,
  ScrollText,
  Cookie
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
    label: 'Track & Exercise',
    icon: <Activity size={20} />,
    items: [
      { label: 'Daily Tracking', icon: <ClipboardList size={18} />, href: '/tracking' },
      { label: 'Exercise Log', icon: <Dumbbell size={18} />, href: '/exercise' },
      { label: 'Food Recognition', icon: <Camera size={18} />, href: '/food-recognition' },
    ]
  },
  {
    label: 'Meal & Recipes',
    icon: <Utensils size={20} />,
    items: [
      { label: 'Meal Planning', icon: <ScrollText size={18} />, href: '/meal-planning' },
      { label: 'Recipe Library', icon: <Cookie size={18} />, href: '/recipes' }
    ]
  }
];

export const Header: React.FC = () => {
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

      // Close nav dropdowns when clicking outside
      if (!Object.values(navDropdownRefs.current).some(ref => ref?.contains(event.target as Node))) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const NavDropdown: React.FC<NavDropdownProps & { index: number }> = ({ label, icon, items, index }) => {
    const isActive = activeDropdown === label;

    return (
      <div
        className="relative"
        ref={el => navDropdownRefs.current[label] = el}
      >
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ y: 0 }}
          onClick={() => setActiveDropdown(isActive ? null : label)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${items.some(item => location.pathname === item.href)
              ? 'text-white font-semibold'
              : 'text-green-100 hover:text-white'
            }`}
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
            >
              {items.map((item, itemIndex) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-green-50 transition-colors ${location.pathname === item.href ? 'bg-green-50 text-green-600 font-medium' : ''
                    }`}
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
        className="flex items-center space-x-2 hover:bg-green-700 px-3 py-2 rounded-lg transition-colors"
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
        <span className="hidden md:inline font-medium">{user?.given_name}</span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
        />
      </motion.button>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
          >
            <button
              onClick={handleOpenDietProfile}
              className="w-full flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-green-50 transition-colors"
            >
              <Settings size={18} />
              <span>Diet Profile</span>
            </button>
            <div className="border-t my-1"></div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
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
            <nav className="hidden lg:flex items-center space-x-6">
              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                <Link
                  to="/"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${location.pathname === '/' ? 'text-white font-semibold' : 'text-green-100 hover:text-white'
                    }`}
                >
                  <Home size={20} />
                  <span>Home</span>
                </Link>
              </motion.div>

              {isAuthenticated && navDropdowns.map((dropdown, index) => (
                <NavDropdown key={dropdown.label} {...dropdown} index={index} />
              ))}
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
              <nav className="container mx-auto px-4 py-4 space-y-4">
                <Link
                  to="/"
                  className="flex items-center space-x-2 text-green-100 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Home size={20} />
                  <span>Home</span>
                </Link>

                {isAuthenticated && navDropdowns.map((dropdown, index) => (
                  <div key={dropdown.label} className="space-y-2">
                    <div className="flex items-center space-x-2 text-white font-medium">
                      {dropdown.icon}
                      <span>{dropdown.label}</span>
                    </div>
                    <div className="pl-6 space-y-2">
                      {dropdown.items.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          className="flex items-center space-x-2 text-green-100 hover:text-white transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
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