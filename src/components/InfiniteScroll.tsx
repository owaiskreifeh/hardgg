'use client';

import { useEffect, useRef, useCallback } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface InfiniteScrollProps {
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
  children: React.ReactNode;
  threshold?: number;
  className?: string;
  totalLoaded?: number;
  totalAvailable?: number;
}

/**
 * InfiniteScroll component that automatically loads more content when the user scrolls near the bottom.
 * Uses Intersection Observer API for efficient scroll detection.
 * 
 * @param onLoadMore - Function to call when more content should be loaded
 * @param hasMore - Whether there is more content available to load
 * @param loading - Whether content is currently being loaded
 * @param children - The content to render
 * @param threshold - Intersection threshold (0-1) for when to trigger loading
 * @param className - Additional CSS classes
 * @param totalLoaded - Number of items currently loaded
 * @param totalAvailable - Total number of items available
 */
export function InfiniteScroll({
  onLoadMore,
  hasMore,
  loading,
  children,
  threshold = 0.8,
  className = '',
  totalLoaded = 0,
  totalAvailable = 0
}: InfiniteScrollProps) {
  const observerRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !loading) {
        onLoadMore();
      }
    },
    [hasMore, loading, onLoadMore]
  );

  useEffect(() => {
    const element = observerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold,
      rootMargin: '100px'
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [handleObserver, threshold]);

  return (
    <div className={className}>
      {children}
      
      {hasMore && (
        <div
          ref={observerRef}
          className="flex justify-center items-center py-8"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <LoadingSpinner size="sm" />
              <span className="text-gray-400 text-sm">Loading more games...</span>
            </div>
          ) : (
            <div className="h-4" /> // Invisible trigger element
          )}
        </div>
      )}
      
      {!hasMore && children && (
        <div className="flex justify-center items-center py-8">
          <div className="text-center">
            <div className="text-4xl mb-2">🎮</div>
            <p className="text-gray-400 text-sm">
              {totalAvailable > 0 
                ? `You've loaded all ${totalAvailable} games!`
                : "You've reached the end! No more games to load."
              }
            </p>
            {totalLoaded > 0 && totalAvailable > 0 && (
              <p className="text-gray-500 text-xs mt-1">
                Loaded {totalLoaded} of {totalAvailable} games
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
