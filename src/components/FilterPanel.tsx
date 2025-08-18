'use client';

import { useState } from 'react';
import {
  Filter,
  Grid3X3,
  Grid,
  List,
  ChevronDown,
  ChevronUp,
  X,
  RotateCcw
} from 'lucide-react';
import { GameFilter } from '@/types/game';
import { cn } from '@/lib/utils';

interface FilterPanelProps {
  filters: GameFilter;
  onFilterChange: (filters: GameFilter) => void;
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  onGridSizeChange: (gridSize: 'small' | 'medium' | 'large') => void;
  gridSize: 'small' | 'medium' | 'large';
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  totalGames: number;
  className?: string;
}

const GENRES = ['Action', 'Adventure', 'RPG', 'Strategy', 'Simulation', 'Sports', 'Racing', 'Puzzle', 'Horror', 'Fighting'];
const TAGS = ['Open World', 'Story Rich', 'Multiplayer', 'Single Player', 'Co-op', 'VR', 'Controller', 'Moddable'];
const SIZES = ['1 GB', '5 GB', '10 GB', '25 GB', '50 GB', '100 GB'];
const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Japanese', 'Korean', 'Chinese'];

export function FilterPanel({
  filters,
  onFilterChange,
  onSortChange,
  onGridSizeChange,
  gridSize,
  sortBy,
  sortOrder,
  totalGames,
  className = ''
}: FilterPanelProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['sort', 'grid']);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const updateFilter = (key: keyof GameFilter, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value =>
    Array.isArray(value) ? value.length > 0 : Boolean(value)
  );

  return (
    <div className={cn('space-y-4', className)}>
      {/* Results Count */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400">
          {totalGames} game{totalGames !== 1 ? 's' : ''} found
        </span>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-gaming-primary hover:text-gaming-primary-dark transition-colors duration-200 flex items-center gap-1"
          >
            <RotateCcw size={12} />
            Clear filters
          </button>
        )}
      </div>

      {/* Sort Section */}
      <div className="gaming-card p-4">
        <button
          onClick={() => toggleSection('sort')}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <div className="flex items-center gap-2">
            <Filter size={16} />
            <span className="font-medium">Sort & Filter</span>
          </div>
          {expandedSections.includes('sort') ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {expandedSections.includes('sort') && (
          <div className="space-y-3">
            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value, sortOrder)}
                className="gaming-input w-full text-sm"
              >
                <option value="title">Title</option>
                <option value="releaseDate">Release Date</option>
                <option value="size">Size</option>
                <option value="popularity">Popularity</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Order</label>
              <div className="flex gap-2">
                <button
                  onClick={() => onSortChange(sortBy, 'asc')}
                  className={cn(
                    'flex-1 py-2 px-3 rounded text-sm transition-colors duration-200',
                    sortOrder === 'asc'
                      ? 'bg-gaming-primary text-white'
                      : 'bg-gaming-card border border-gaming-border text-gray-300 hover:bg-gaming-border'
                  )}
                >
                  Ascending
                </button>
                <button
                  onClick={() => onSortChange(sortBy, 'desc')}
                  className={cn(
                    'flex-1 py-2 px-3 rounded text-sm transition-colors duration-200',
                    sortOrder === 'desc'
                      ? 'bg-gaming-primary text-white'
                      : 'bg-gaming-card border border-gaming-border text-gray-300 hover:bg-gaming-border'
                  )}
                >
                  Descending
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Grid Size Section */}
      <div className="gaming-card p-4">
        <button
          onClick={() => toggleSection('grid')}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <div className="flex items-center gap-2">
            <Grid3X3 size={16} />
            <span className="font-medium">View Options</span>
          </div>
          {expandedSections.includes('grid') ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {expandedSections.includes('grid') && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Grid Size</label>
              <div className="flex gap-2">
                <button
                  onClick={() => onGridSizeChange('small')}
                  className={cn(
                    'flex-1 py-2 px-3 rounded text-sm transition-colors duration-200 flex items-center justify-center gap-1',
                    gridSize === 'small'
                      ? 'bg-gaming-primary text-white'
                      : 'bg-gaming-card border border-gaming-border text-gray-300 hover:bg-gaming-border'
                  )}
                >
                  <Grid3X3 size={14} />
                  Small
                </button>
                <button
                  onClick={() => onGridSizeChange('medium')}
                  className={cn(
                    'flex-1 py-2 px-3 rounded text-sm transition-colors duration-200 flex items-center justify-center gap-1',
                    gridSize === 'medium'
                      ? 'bg-gaming-primary text-white'
                      : 'bg-gaming-card border border-gaming-border text-gray-300 hover:bg-gaming-border'
                  )}
                >
                  <Grid size={14} />
                  Medium
                </button>
                <button
                  onClick={() => onGridSizeChange('large')}
                  className={cn(
                    'flex-1 py-2 px-3 rounded text-sm transition-colors duration-200 flex items-center justify-center gap-1',
                    gridSize === 'large'
                      ? 'bg-gaming-primary text-white'
                      : 'bg-gaming-card border border-gaming-border text-gray-300 hover:bg-gaming-border'
                  )}
                >
                  <List size={14} />
                  Large
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Genre Filter */}
      <div className="gaming-card p-4">
        <button
          onClick={() => toggleSection('genre')}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <span className="font-medium">Genre</span>
          {expandedSections.includes('genre') ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {expandedSections.includes('genre') && (
          <div className="space-y-2">
            {GENRES.map((genre) => (
              <label key={genre} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.genre?.includes(genre) || false}
                  onChange={(e) => {
                    const currentGenres = filters.genre || [];
                    if (e.target.checked) {
                      updateFilter('genre', [...currentGenres, genre]);
                    } else {
                      updateFilter('genre', currentGenres.filter(g => g !== genre));
                    }
                  }}
                  className="rounded border-gaming-border bg-gaming-card text-gaming-primary focus:ring-gaming-primary"
                />
                <span className="text-sm text-gray-300">{genre}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Size Filter */}
      <div className="gaming-card p-4">
        <button
          onClick={() => toggleSection('size')}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <span className="font-medium">Max Size</span>
          {expandedSections.includes('size') ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {expandedSections.includes('size') && (
          <div className="space-y-2">
            {SIZES.map((size) => (
              <label key={size} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="size"
                  checked={filters.size === size}
                  onChange={() => updateFilter('size', size)}
                  className="border-gaming-border bg-gaming-card text-gaming-primary focus:ring-gaming-primary"
                />
                <span className="text-sm text-gray-300">{size}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
