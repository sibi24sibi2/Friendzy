import { Search, LogOut, Moon, Sun } from 'react-feather'
import { useAuth } from "../Api/AuthApi";
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { friendzyLogo } from '../assets/assets';

export default function TopNav() {

  const { currentUser, logout, isLoading, isDark, setIsDark } = useAuth();



  const welcomePaths = ['/', '/about', '/contact', '/signup', '/signin'];

  if (welcomePaths.includes(location.pathname)) {
    return (
      <header className={`fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-lg z-50 shadow-sm ${isLoading ? 'hidden' : ' block'} `}>
        <div className="container mx-auto px-4 lg:py-3 py-5">
          <nav className="flex items-center justify-between">
            <NavLink to="/" className="lg:text-2xl text-lg font-bold text-blue-900 hover:text-blue-700 transition">
              <img
                src={friendzyLogo}
                className='h-14 lg:h-20 w-auto my-[-24px]'
                alt="Logo"
              />
            </NavLink>
            <div className="flex items-center gap-6">
              <NavLink to="/about" className="text-blue-600  whitespace-nowrap text-xs md:text-base hover:text-blue-800 transition">
                About Us
              </NavLink>
              <NavLink to="/contact" className="text-blue-600 whitespace-nowrap text-xs md:text-base hover:text-blue-800 transition">
                Contact Us
              </NavLink>
              {!currentUser && <NavLink to="/signup">
                <button className="lg:px-6 lg:py-2 -translate-y-0.5 text-xs md:text-base text-blue-600 lg:bg-blue-600 lg:text-white lg:rounded-full lg:hover:bg-blue-700 transition">
                  Sign Up
                </button>
              </NavLink>}

            </div>
          </nav>
        </div>
      </header>
    );
  }


  return (
    <nav className={` bg-white dark:bg-gray-800 shadow-sm{ ${isLoading ? ' hidden' : 'block'} }`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 dark:invert">
          <img
            src={friendzyLogo}
            className='h-14 lg:h-20 w-auto my-[-24px]  '
            alt="Logo"
          />
        </div>

        <div className="flex-1 max-w-xl px-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="search"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>
          <button onClick={logout} className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            <span className="hidden sm:inline">Logout</span>
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  )
}

