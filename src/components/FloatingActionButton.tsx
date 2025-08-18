'use client';

import { Filter, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingActionButtonProps {
  onClick: () => void;
  className?: string;
  showSearch?: boolean;
}

export function FloatingActionButton({
  onClick,
  className = '',
  showSearch = false
}: FloatingActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'fixed bottom-6 right-6 w-14 h-14 bg-gaming-primary hover:bg-gaming-primary-dark text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-30 lg:hidden flex items-center justify-center',
        'transform hover:scale-105 active:scale-95',
        className
      )}
      aria-label="Open filters and search"
    >
      {showSearch ? (
        <Search size={24} />
      ) : (
        <Filter size={24} />
      )}
    </button>
  );
}
