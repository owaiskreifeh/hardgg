'use client';

import { useEffect } from 'react';
import { X, Search, Filter } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { FilterPanel } from './FilterPanel';
import { GameFilter } from '@/types/game';
import { cn } from '@/lib/utils';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters: GameFilter;
  onFilterChange: (filters: GameFilter) => void;
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  onGridSizeChange: (gridSize: 'small' | 'medium' | 'large') => void;
  gridSize: 'small' | 'medium' | 'large';
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  totalGames: number;
}

export function MobileMenu({
  isOpen,
  onClose,
  searchValue,
  onSearchChange,
  filters,
  onFilterChange,
  onSortChange,
  onGridSizeChange,
  gridSize,
  sortBy,
  sortOrder,
  totalGames
}: MobileMenuProps) {
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Mobile Menu */}
      <div className={cn(
        'fixed inset-y-0 left-0 w-80 bg-gaming-bg border-r border-gaming-border z-50 transform transition-transform duration-300 ease-in-out lg:hidden',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gaming-border">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gaming-primary" />
            <h2 className="text-lg font-semibold text-white">Filters & Search</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Search Bar */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Search size={16} className="text-gaming-primary" />
              <span className="text-sm font-medium text-gray-300">Search</span>
            </div>
            <SearchBar
              value={searchValue}
              onChange={onSearchChange}
              placeholder="Search games..."
              className="w-full"
            />
          </div>

          {/* Filter Panel */}
          <FilterPanel
            filters={filters}
            onFilterChange={onFilterChange}
            onSortChange={onSortChange}
            onGridSizeChange={onGridSizeChange}
            gridSize={gridSize}
            sortBy={sortBy}
            sortOrder={sortOrder}
            totalGames={totalGames}
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gaming-border">
          <button
            onClick={onClose}
            className="w-full gaming-button py-3"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
}
