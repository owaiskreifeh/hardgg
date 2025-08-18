'use client';

import { SearchBar } from './SearchBar';
import { cn } from '@/lib/utils';

interface StickySearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function StickySearchBar({
  value,
  onChange,
  placeholder = 'Search games...',
  className = ''
}: StickySearchBarProps) {
  return (
    <div className={cn(
      'sticky top-0 z-20 bg-gaming-bg/95 backdrop-blur-sm border-b border-gaming-border p-4 lg:hidden',
      className
    )}>
      <SearchBar
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full"
      />
    </div>
  );
}
