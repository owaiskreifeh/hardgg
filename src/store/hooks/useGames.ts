import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  fetchGames,
  fetchGameById,
  loadMoreGames,
  setSelectedGame,
  clearSelectedGame,
  clearError,
  resetPagination
} from '../slices/gamesSlice';
import {
  selectGames,
  selectFilteredGames,
  selectSelectedGame,
  selectGamesLoading,
  selectGamesLoadingMore,
  selectGamesError,
  selectLastFetched,
  selectFilteredGamesCount,
  selectTotalGamesCount,
  selectCurrentPage,
  selectHasMore,
  selectTotalGames
} from '../selectors';

export const useGames = () => {
  const dispatch = useAppDispatch();

  const games = useAppSelector(selectGames);
  const filteredGames = useAppSelector(selectFilteredGames);
  const selectedGame = useAppSelector(selectSelectedGame);
  const loading = useAppSelector(selectGamesLoading);
  const loadingMore = useAppSelector(selectGamesLoadingMore);
  const error = useAppSelector(selectGamesError);
  const lastFetched = useAppSelector(selectLastFetched);
  const filteredCount = useAppSelector(selectFilteredGamesCount);
  const totalCount = useAppSelector(selectTotalGamesCount);
  const currentPage = useAppSelector(selectCurrentPage);
  const hasMore = useAppSelector(selectHasMore);
  const totalGames = useAppSelector(selectTotalGames);

  const loadGames = useCallback(() => {
    try {
      dispatch(fetchGames(1));
    } catch (error) {
      console.error('Error loading games:', error);
    }
  }, [dispatch]);
  
  const loadMore = useCallback(() => {
    try {
      dispatch(loadMoreGames());
    } catch (error) {
      console.error('Error loading more games:', error);
    }
  }, [dispatch]);
  
  const loadGameById = useCallback((id: string) => dispatch(fetchGameById(id)), [dispatch]);
  const selectGame = useCallback((game: any) => dispatch(setSelectedGame(game)), [dispatch]);
  const clearGame = useCallback(() => dispatch(clearSelectedGame()), [dispatch]);
  const clearErrorState = useCallback(() => dispatch(clearError()), [dispatch]);
  const resetPaginationState = useCallback(() => dispatch(resetPagination()), [dispatch]);

  // Check if we need to fetch games (if not loaded or stale)
  const shouldFetchGames = useCallback(() => {
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    return !games.length || !lastFetched || (Date.now() - lastFetched > CACHE_DURATION);
  }, [games.length, lastFetched]);

  // Auto-fetch games if needed
  useEffect(() => {
    if (shouldFetchGames()) {
      // Add a small delay to ensure store is hydrated
      const timer = setTimeout(() => {
        loadGames();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [shouldFetchGames, loadGames]);

  return {
    // State
    games,
    filteredGames,
    selectedGame,
    loading,
    loadingMore,
    error,
    lastFetched,
    filteredCount,
    totalCount,
    currentPage,
    hasMore,
    totalGames,

    // Actions
    loadGames,
    loadMore,
    loadGameById,
    selectGame,
    clearGame,
    clearErrorState,
    resetPaginationState,

    // Utilities
    shouldFetchGames
  };
};
