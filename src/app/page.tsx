'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { StickySearchBar } from '@/components/StickySearchBar';
import { GameGrid } from '@/components/GameGrid';
import { FilterPanel } from '@/components/FilterPanel';
import { GameModal } from '@/components/GameModal';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { InfiniteScroll } from '@/components/InfiniteScroll';
import { MobileMenu } from '@/components/MobileMenu';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { useGames } from '@/store/hooks/useGames';
import { useSearch } from '@/store/hooks/useSearch';
import { useUI } from '@/store/hooks/useUI';
import { Game } from '@/types/game';
import { debounce } from '@/lib/utils';

export default function HomePage() {
  const {
    games,
    filteredGames,
    loading,
    loadingMore,
    error,
    selectedGame,
    hasMore,
    totalGames,
    loadGames,
    loadMore,
    selectGame,
    clearGame,
    resetPaginationState
  } = useGames();

  const {
    searchState,
    updateSearchQuery,
    updateSearchFilters,
    updateSorting,
    updateGridSize
  } = useSearch();

  const { 
    isModalOpen, 
    openModal, 
    closeModal,
    mobileMenuOpen,
    openMobileMenu,
    closeMobileMenu
  } = useUI();

  const [localModalOpen, setLocalModalOpen] = useState(false);

  // Debug logging
  console.log('HomePage render - searchState:', searchState);
  console.log('HomePage render - games:', games.length);
  console.log('HomePage render - loading:', loading);
  console.log('HomePage render - error:', error);

  // Debounced search function to prevent too many API calls
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (searchState) {
        resetPaginationState();
        loadGames();
      }
    }, 500), // Increased debounce time to 500ms
    [searchState, resetPaginationState, loadGames]
  );

  useEffect(() => {
    console.log('HomePage - Initial loadGames effect');
    loadGames();
  }, [loadGames]);

  // Handle search query changes with debouncing
  useEffect(() => {
    if (searchState?.query !== undefined) {
      // Only search if query has at least 2 characters or is empty
      if (searchState.query.length >= 2 || searchState.query.length === 0) {
        debouncedSearch(searchState.query);
      }
    }
  }, [searchState?.query, debouncedSearch]);

  // Handle filter and sort changes (no debouncing needed for these)
  useEffect(() => {
    if (searchState && (searchState.filters || searchState.sortBy || searchState.sortOrder)) {
      resetPaginationState();
      loadGames();
    }
  }, [searchState?.filters, searchState?.sortBy, searchState?.sortOrder, resetPaginationState, loadGames]);

  const handleGameClick = (game: Game) => {
    selectGame(game);
    setLocalModalOpen(true);
  };

  const handleCloseModal = () => {
    setLocalModalOpen(false);
    clearGame();
  };

  const handleSearchChange = (query: string) => {
    if (searchState) {
      updateSearchQuery(query);
    }
  };

  const handleFilterChange = (filters: any) => {
    if (searchState) {
      updateSearchFilters(filters);
    }
  };

  const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    if (searchState) {
      updateSorting(sortBy as any, sortOrder);
    }
  };

  const handleGridSizeChange = (gridSize: 'small' | 'medium' | 'large') => {
    if (searchState) {
      updateGridSize(gridSize);
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !loadingMore) {
      loadMore();
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error Loading Games</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={loadGames}
            className="gaming-button"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show loading if search state is not ready
  if (!searchState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      {/* Sticky Search Bar for Mobile */}
      <StickySearchBar
        value={searchState.query}
        onChange={handleSearchChange}
        placeholder="Search games..."
        loading={loading}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Hidden on Mobile */}
          <aside className="hidden lg:block lg:w-80 flex-shrink-0">
            <div className="sticky top-24">
              <SearchBar
                value={searchState.query}
                onChange={handleSearchChange}
                placeholder="Search games..."
                loading={loading}
              />

              <FilterPanel
                filters={searchState.filters}
                onFilterChange={handleFilterChange}
                onSortChange={handleSortChange}
                onGridSizeChange={handleGridSizeChange}
                gridSize={searchState.gridSize}
                sortBy={searchState.sortBy}
                sortOrder={searchState.sortOrder}
                totalGames={filteredGames.length}
              />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {loading && games.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <LoadingSpinner />
              </div>
            ) : (
              <InfiniteScroll
                onLoadMore={handleLoadMore}
                hasMore={hasMore}
                loading={loadingMore}
                totalLoaded={filteredGames.length}
                totalAvailable={totalGames}
              >
                <GameGrid
                  games={filteredGames}
                  gridSize={searchState.gridSize}
                  onGameClick={handleGameClick}
                />
              </InfiniteScroll>
            )}
          </div>
        </div>
      </main>

      {/* Floating Action Button for Mobile */}
      <FloatingActionButton
        onClick={openMobileMenu}
        showSearch={false}
      />

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={closeMobileMenu}
        searchValue={searchState.query}
        onSearchChange={handleSearchChange}
        filters={searchState.filters}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        onGridSizeChange={handleGridSizeChange}
        gridSize={searchState.gridSize}
        sortBy={searchState.sortBy}
        sortOrder={searchState.sortOrder}
        totalGames={filteredGames.length}
      />

      {/* Game Modal */}
      {localModalOpen && selectedGame && (
        <GameModal
          game={selectedGame}
          isOpen={localModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
