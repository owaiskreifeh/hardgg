import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  fetchGames,
  fetchGameById,
  filterGames,
  setSelectedGame,
  clearSelectedGame,
  clearError
} from '../slices/gamesSlice';
import {
  selectGames,
  selectFilteredGames,
  selectSelectedGame,
  selectGamesLoading,
  selectGamesError,
  selectLastFetched,
  selectFilteredGamesCount,
  selectTotalGamesCount
} from '../selectors';

export const useGames = () => {
  const dispatch = useAppDispatch();

  const games = useAppSelector(selectGames);
  const filteredGames = useAppSelector(selectFilteredGames);
  const selectedGame = useAppSelector(selectSelectedGame);
  const loading = useAppSelector(selectGamesLoading);
  const error = useAppSelector(selectGamesError);
  const lastFetched = useAppSelector(selectLastFetched);
  const filteredCount = useAppSelector(selectFilteredGamesCount);
  const totalCount = useAppSelector(selectTotalGamesCount);

  const loadGames = useCallback(() => dispatch(fetchGames()), [dispatch]);
  const loadGameById = useCallback((id: string) => dispatch(fetchGameById(id)), [dispatch]);
  const applyFilters = useCallback(() => dispatch(filterGames()), [dispatch]);
  const selectGame = useCallback((game: any) => dispatch(setSelectedGame(game)), [dispatch]);
  const clearGame = useCallback(() => dispatch(clearSelectedGame()), [dispatch]);
  const clearErrorState = useCallback(() => dispatch(clearError()), [dispatch]);

  // Check if we need to fetch games (if not loaded or stale)
  const shouldFetchGames = useCallback(() => {
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    return !games.length || !lastFetched || (Date.now() - lastFetched > CACHE_DURATION);
  }, [games.length, lastFetched]);

  // Auto-fetch games if needed
  useEffect(() => {
    if (shouldFetchGames()) {
      loadGames();
    }
  }, [shouldFetchGames, loadGames]);

  return {
    // State
    games,
    filteredGames,
    selectedGame,
    loading,
    error,
    lastFetched,
    filteredCount,
    totalCount,

    // Actions
    loadGames,
    loadGameById,
    applyFilters,
    selectGame,
    clearGame,
    clearErrorState,

    // Utilities
    shouldFetchGames
  };
};
