'use client';

import { useState } from 'react';
import { Menu, X, Search, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="gaming-header">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <h1 className="gaming-logo text-2xl">
              FitGirl Repacks
            </h1>
            <span className="hidden sm:inline-block text-sm text-gray-400">
              Modern Gaming Hub
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#"
              className="text-gray-300 hover:text-gaming-primary transition-colors duration-200"
            >
              Home
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-gaming-primary transition-colors duration-200"
            >
              Games
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-gaming-primary transition-colors duration-200"
            >
              About
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-gaming-primary transition-colors duration-200"
            >
              Contact
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              className="p-2 text-gray-400 hover:text-gaming-primary transition-colors duration-200"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <button
              className="p-2 text-gray-400 hover:text-gaming-primary transition-colors duration-200"
              aria-label="Settings"
            >
              <Settings size={20} />
            </button>
            <button className="gaming-button text-sm">
              Download
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-400 hover:text-gaming-primary transition-colors duration-200"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            'md:hidden transition-all duration-300 ease-in-out overflow-hidden',
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div className="py-4 space-y-4 border-t border-gaming-border">
            <a
              href="#"
              className="block text-gray-300 hover:text-gaming-primary transition-colors duration-200"
            >
              Home
            </a>
            <a
              href="#"
              className="block text-gray-300 hover:text-gaming-primary transition-colors duration-200"
            >
              Games
            </a>
            <a
              href="#"
              className="block text-gray-300 hover:text-gaming-primary transition-colors duration-200"
            >
              About
            </a>
            <a
              href="#"
              className="block text-gray-300 hover:text-gaming-primary transition-colors duration-200"
            >
              Contact
            </a>
            <div className="pt-4 border-t border-gaming-border">
              <button className="gaming-button w-full">
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
