'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { GameGrid } from '@/components/GameGrid';
import { FilterPanel } from '@/components/FilterPanel';
import { GameModal } from '@/components/GameModal';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useGameStore } from '@/lib/store';
import { Game } from '@/types/game';

export default function HomePage() {
  const {
    games,
    filteredGames,
    loading,
    error,
    selectedGame,
    searchState,
    setSelectedGame,
    setSearchState,
    loadGames,
    filterGames
  } = useGameStore();

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadGames();
  }, [loadGames]);

  useEffect(() => {
    filterGames();
  }, [searchState, filterGames]);

  const handleGameClick = (game: Game) => {
    setSelectedGame(game);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGame(null);
  };

  const handleSearchChange = (query: string) => {
    setSearchState({ ...searchState, query });
  };

  const handleFilterChange = (filters: any) => {
    setSearchState({ ...searchState, filters });
  };

  const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    setSearchState({ ...searchState, sortBy: sortBy as any, sortOrder });
  };

  const handleGridSizeChange = (gridSize: 'small' | 'medium' | 'large') => {
    setSearchState({ ...searchState, gridSize });
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

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="sticky top-24">
              <SearchBar
                value={searchState.query}
                onChange={handleSearchChange}
                placeholder="Search games..."
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
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <LoadingSpinner />
              </div>
            ) : (
              <GameGrid
                games={filteredGames}
                gridSize={searchState.gridSize}
                onGameClick={handleGameClick}
              />
            )}
          </div>
        </div>
      </main>

      {/* Game Modal */}
      {isModalOpen && selectedGame && (
        <GameModal
          game={selectedGame}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
