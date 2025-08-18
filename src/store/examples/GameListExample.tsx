'use client';

import React, { useEffect } from 'react';
import { useGames, useSearch, useUI } from '../hooks';

export const GameListExample: React.FC = () => {
  const {
    games,
    filteredGames,
    loading,
    error,
    loadGames,
    selectGame
  } = useGames();

  const {
    query,
    filters,
    sortBy,
    sortOrder,
    updateSearchQuery,
    updateSingleFilter,
    clearAllFilters
  } = useSearch();

  const {
    showSuccess,
    showError,
    showInfo
  } = useUI();

  // Load games on component mount
  useEffect(() => {
    loadGames();
  }, [loadGames]);

  // Show notifications based on state changes
  useEffect(() => {
    if (error) {
      showError(`Failed to load games: ${error}`);
    }
  }, [error, showError]);

  useEffect(() => {
    if (games.length > 0) {
      showSuccess(`Loaded ${games.length} games successfully!`);
    }
  }, [games.length, showSuccess]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSearchQuery(e.target.value);
  };

  const handleGenreFilter = (genre: string) => {
    const currentGenres = filters.genre || [];
    const newGenres = currentGenres.includes(genre)
      ? currentGenres.filter(g => g !== genre)
      : [...currentGenres, genre];

    updateSingleFilter('genre', newGenres);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSingleFilter('sortBy', e.target.value);
  };

  const handleGameClick = (game: any) => {
    selectGame(game);
    showInfo(`Selected: ${game.title}`);
  };

  if (loading) {
    return <div className="text-center py-8">Loading games...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Game List Example</h1>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search games..."
          value={query}
          onChange={handleSearchChange}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => handleGenreFilter('Action')}
          className={`px-4 py-2 rounded ${
            filters.genre?.includes('Action')
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200'
          }`}
        >
          Action
        </button>
        <button
          onClick={() => handleGenreFilter('RPG')}
          className={`px-4 py-2 rounded ${
            filters.genre?.includes('RPG')
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200'
          }`}
        >
          RPG
        </button>
        <button
          onClick={clearAllFilters}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Clear Filters
        </button>
      </div>

      {/* Sort */}
      <div className="mb-6">
        <select
          value={sortBy}
          onChange={handleSortChange}
          className="p-2 border rounded"
        >
          <option value="title">Sort by Title</option>
          <option value="releaseDate">Sort by Release Date</option>
          <option value="size">Sort by Size</option>
        </select>
      </div>

      {/* Results */}
      <div className="mb-4">
        <p>
          Showing {filteredGames.length} of {games.length} games
        </p>
      </div>

      {/* Game Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            onClick={() => handleGameClick(game)}
            className="p-4 border rounded cursor-pointer hover:bg-gray-50"
          >
            <h3 className="font-semibold">{game.title}</h3>
            <p className="text-sm text-gray-600">{game.size}</p>
            <p className="text-sm text-gray-600">
              {game.genre.join(', ')}
            </p>
          </div>
        ))}
      </div>

      {filteredGames.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No games found matching your criteria.
        </div>
      )}
    </div>
  );
};
