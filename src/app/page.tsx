'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
import { DebugPanel } from '@/components/DebugPanel';
import { useGames } from '@/store/hooks/useGames';
import { useSearch } from '@/store/hooks/useSearch';
import { useUI } from '@/store/hooks/useUI';
import { Game } from '@/types/game';
import { debounce } from '@/lib/utils';

export default function HomePage() {
  const renderCount = useRef(0);
  renderCount.current += 1;
  
  // Track previous search state to prevent unnecessary API calls
  const prevSearchState = useRef<any>(null);

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
  console.log('🏠 HomePage render:', {
    renderCount: renderCount.current,
    searchState: searchState ? {
      query: searchState.query,
      filters: searchState.filters,
      sortBy: searchState.sortBy,
      sortOrder: searchState.sortOrder
    } : null,
    gamesCount: games.length,
    filteredGamesCount: filteredGames.length,
    loading,
    error,
    timestamp: new Date().toISOString()
  });

  // Consolidated effect for handling all search and filter changes
  useEffect(() => {
    console.log('🎯 HomePage - Consolidated search/filter effect triggered:', {
      query: searchState?.query,
      filters: searchState?.filters,
      sortBy: searchState?.sortBy,
      sortOrder: searchState?.sortOrder,
      loading,
      filteredGamesCount: filteredGames.length,
      timestamp: new Date().toISOString()
    });
    
    // Only trigger search if we have a valid search state
    if (searchState) {
      const hasQuery = searchState.query && searchState.query.length >= 2;
      const hasFilters = searchState.filters && Object.keys(searchState.filters).length > 0;
      const hasSorting = searchState.sortBy || searchState.sortOrder;
      
      // Check if search state has actually changed
      const currentSearchState = {
        query: searchState.query,
        filters: searchState.filters,
        sortBy: searchState.sortBy,
        sortOrder: searchState.sortOrder
      };
      
      const hasChanged = JSON.stringify(currentSearchState) !== JSON.stringify(prevSearchState.current);
      
      // Only trigger API call if:
      // 1. Search state has actually changed
      // 2. We're not currently loading
      // 3. We have a valid search criteria (query with 2+ chars, filters, or sorting) OR we're clearing the search
      if (hasChanged && !loading) {
        const shouldTriggerSearch = hasQuery || hasFilters || hasSorting || searchState.query === '';
        
        if (shouldTriggerSearch) {
          console.log('🎯 HomePage - Search state changed, triggering API call');
          prevSearchState.current = currentSearchState;
          resetPaginationState();
          loadGames();
        } else {
          console.log('🎯 HomePage - Search state changed but no valid search criteria (query too short), skipping API call');
          prevSearchState.current = currentSearchState;
        }
      } else if (hasChanged) {
        console.log('🎯 HomePage - Search state changed but currently loading, skipping API call');
        prevSearchState.current = currentSearchState;
      } else {
        console.log('🎯 HomePage - Search state unchanged, no action needed');
      }
    }
  }, [searchState?.query, searchState?.filters, searchState?.sortBy, searchState?.sortOrder, resetPaginationState, loadGames, loading]);

  const handleGameClick = (game: Game) => {
    selectGame(game);
    setLocalModalOpen(true);
  };

  const handleCloseModal = () => {
    setLocalModalOpen(false);
    clearGame();
  };

  const handleSearchChange = (query: string) => {
    console.log('🔍 HomePage handleSearchChange:', {
      from: searchState?.query,
      to: query,
      timestamp: new Date().toISOString()
    });
    if (searchState) {
      updateSearchQuery(query);
    }
  };

  const handleFilterChange = (filters: any) => {
    console.log('🎛️ HomePage handleFilterChange:', {
      from: searchState?.filters,
      to: filters,
      timestamp: new Date().toISOString()
    });
    if (searchState) {
      updateSearchFilters(filters);
    }
  };

  const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    console.log('📊 HomePage handleSortChange:', {
      from: { sortBy: searchState?.sortBy, sortOrder: searchState?.sortOrder },
      to: { sortBy, sortOrder },
      timestamp: new Date().toISOString()
    });
    if (searchState) {
      updateSorting(sortBy as any, sortOrder);
    }
  };

  const handleGridSizeChange = (gridSize: 'small' | 'medium' | 'large') => {
    console.log('📱 HomePage handleGridSizeChange:', {
      from: searchState?.gridSize,
      to: gridSize,
      timestamp: new Date().toISOString()
    });
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
            {loading && filteredGames.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <LoadingSpinner />
              </div>
            ) : filteredGames.length === 0 && !loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  No games found
                </h3>
                <p className="text-gray-400 max-w-md">
                  {searchState.query ? (
                    <>No games match your search for "<span className="text-white">{searchState.query}</span>". Try different keywords or clear your search.</>
                  ) : (
                    <>Try adjusting your filters or search terms to find what you're looking for.</>
                  )}
                </p>
                {searchState.query && (
                  <button
                    onClick={() => handleSearchChange('')}
                    className="mt-4 gaming-button"
                  >
                    Clear Search
                  </button>
                )}
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

      {/* Debug Panel */}
      <DebugPanel
        searchState={searchState}
        gamesState={{
          games,
          filteredGames,
          loading,
          loadingMore,
          currentPage: 1, // You might want to get this from the store
          hasMore
        }}
        renderCount={renderCount.current}
      />
    </div>
  );
}
