import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, User, Home, Activity, Utensils, Book, Button } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "lucide-react";

export const Header = () => {

  return (
    <header className="bg-green-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Activity className="h-6 w-6" />
            <span className="text-xl font-bold">Health Bite</span>
          </Link>

          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="flex items-center space-x-2 hover:text-green-200 transition-colors">
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link to="/tracker" className="flex items-center space-x-2 hover:text-green-200 transition-colors">
              <Activity className="h-5 w-5" />
              <span>Track</span>
            </Link>
            <Link to="/meal-planner" className="flex items-center space-x-2 hover:text-green-200 transition-colors">
              <Utensils className="h-5 w-5" />
              <span>Meal Plan</span>
            </Link>
            <Link to="/recipes" className="flex items-center space-x-2 hover:text-green-200 transition-colors">
              <Book className="h-5 w-5" />
              <span>Recipes</span>
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
           
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:text-green-200 hover:bg-green-700 md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/">Home</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/tracker">Track</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/meal-planner">Meal Plan</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/recipes">Recipes</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};
