'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Zap,
  Menu, 
  X, 
  ChevronDown,
  BarChart3,
  Users,
  CircleDollarSign,
  Clock,
  DollarSign,
} from "lucide-react";

import { UserButton } from "@civic/auth/react";



const Navbar: React.FC = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  // const [isLoggedIn,setIsLoggedIn] = useState(false)

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-gray-900 shadow-lg' : 'bg-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Branding */}
          <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-400 to-emerald-400 rounded-lg p-2 mr-2">
                <Zap className="h-5 w-5 text-black" />
              </div>
              <span className="text-lg font-bold text-white">PayStream</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-gray-300 hover:text-blue-400 hover:bg-gray-800/60"
            >
              Dashboard
            </Link>
            <Link
              href="/payments"
              className="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-gray-300 hover:text-blue-400 hover:bg-gray-800/60"
            >
              Docs
            </Link>
            
            {/* Services dropdown */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-gray-300 hover:text-blue-400 hover:bg-gray-800/60"
              >
                Services
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-gray-900 rounded-xl shadow-lg shadow-blue-900/20 py-2 z-10 border border-gray-800">
                  <Link
                    href="/payroll"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-emerald-400"
                    onClick={() => setShowDropdown(false)}
                  >
                    <Users className="inline-block h-4 w-4 mr-2 text-blue-400" />
                    Payroll
                  </Link>
                  <Link
                    href="/crypto-exchange"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-emerald-400"
                    onClick={() => setShowDropdown(false)}
                  >
                    <DollarSign className="inline-block h-4 w-4 mr-2 text-purple-400" />
                    Crypto Payment
                  </Link>
                  <Link
                    href="/scheduled-pay"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-emerald-400"
                    onClick={() => setShowDropdown(false)}
                  >
                    <Clock className="inline-block h-4 w-4 mr-2 text-emerald-400" />
                    Scheduled Payments
                  </Link>
                </div>
              )}
            </div>
            
            <Link
              href="/stable-coins"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 transition-colors duration-200 hover:text-blue-400 hover:bg-gray-800/60"
            >
              <CircleDollarSign className="inline-block h-4 w-4 mr-1" />
              Stablecoins
            </Link>
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-3">
              <UserButton className="px-8 py-4 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-blue-400 to-emerald-400 hover:shadow-lg hover:shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center justify-center sm:w-auto"/>
          </div>
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-emerald-400 hover:bg-gray-800/60 focus:outline-none transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!showMobileMenu ? (
                <Menu className="block h-6 w-6" />
              ) : (
                <X className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on state */}
      {showMobileMenu && (
        <div className="md:hidden bg-gray-900 shadow-lg border-t border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-emerald-400 hover:bg-gray-800"
              onClick={() => setShowMobileMenu(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/analytics"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-emerald-400 hover:bg-gray-800"
              onClick={() => setShowMobileMenu(false)}
            >
              <BarChart3 className="inline-block h-4 w-4 mr-2 text-blue-400" />
              Payroll
            </Link>
            <Link
              href="/payroll"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-emerald-400 hover:bg-gray-800"
              onClick={() => setShowMobileMenu(false)}
            >
              <DollarSign className="inline-block h-4 w-4 mr-2 text-blue-400" />
              Crypto payments
            </Link>
            <Link
              href="/stable-coins"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-emerald-400 hover:bg-gray-800"
              onClick={() => setShowMobileMenu(false)}
            >
              <CircleDollarSign className="inline-block h-4 w-4 mr-2 text-emerald-400" />
              Stablecoins
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;