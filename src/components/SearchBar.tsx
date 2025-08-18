'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { debounce } from '@/lib/utils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  loading?: boolean;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
  loading = false
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);

  // Memoized debounced function to prevent recreation on every render
  const debouncedOnChange = useMemo(
    () => debounce(onChange, 300),
    [onChange]
  );

  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    debouncedOnChange(newValue);
  }, [debouncedOnChange]);

  const handleClear = useCallback(() => {
    setLocalValue('');
    onChange('');
  }, [onChange]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setLocalValue(suggestion);
    onChange(suggestion);
  }, [onChange]);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        {loading ? (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-retro-cyan"></div>
          </div>
        ) : (
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        )}
        <input
          type="text"
          value={localValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="gaming-input w-full pl-10 pr-10 py-3"
        />
        {localValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
            aria-label="Clear search"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Search suggestions could go here */}
      {localValue && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gaming-card border border-gaming-border rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
          {/* Quick search suggestions */}
          <div className="p-2">
            <div className="text-xs text-gray-400 mb-2 px-2">Quick searches</div>
            <button
              onClick={() => handleSuggestionClick('Action')}
              className="block w-full text-left px-2 py-1 text-sm text-gray-300 hover:bg-gaming-border rounded transition-colors duration-200"
            >
              Action Games
            </button>
            <button
              onClick={() => handleSuggestionClick('RPG')}
              className="block w-full text-left px-2 py-1 text-sm text-gray-300 hover:bg-gaming-border rounded transition-colors duration-200"
            >
              RPG Games
            </button>
            <button
              onClick={() => handleSuggestionClick('Open World')}
              className="block w-full text-left px-2 py-1 text-sm text-gray-300 hover:bg-gaming-border rounded transition-colors duration-200"
            >
              Open World Games
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
