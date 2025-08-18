import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { GameFilter } from '@/types/game';
import {
  setQuery,
  setFilters,
  updateFilter,
  setSortBy,
  setSortOrder,
  setGridSize,
  clearFilters,
  resetSearch
} from '../slices/searchSlice';
import { filterGames } from '../slices/gamesSlice';
import {
  selectSearchState,
  selectSearchQuery,
  selectSearchFilters,
  selectSortBy,
  selectSortOrder,
  selectGridSize,
  selectHasActiveFilters,
  selectActiveFiltersCount
} from '../selectors';

export const useSearch = () => {
  const dispatch = useAppDispatch();

  const searchState = useAppSelector(selectSearchState);
  const query = useAppSelector(selectSearchQuery);
  const filters = useAppSelector(selectSearchFilters);
  const sortBy = useAppSelector(selectSortBy);
  const sortOrder = useAppSelector(selectSortOrder);
  const gridSize = useAppSelector(selectGridSize);
  const hasActiveFilters = useAppSelector(selectHasActiveFilters);
  const activeFiltersCount = useAppSelector(selectActiveFiltersCount);

  const updateSearchQuery = (newQuery: string) => {
    dispatch(setQuery(newQuery));
  };

  const updateSearchFilters = (newFilters: any) => {
    dispatch(setFilters(newFilters));
  };

  const updateSingleFilter = (key: keyof GameFilter, value: any) => {
    dispatch(updateFilter({ key, value }));
  };

  const updateSorting = (newSortBy: 'title' | 'releaseDate' | 'size', newSortOrder: 'asc' | 'desc') => {
    dispatch(setSortBy(newSortBy));
    dispatch(setSortOrder(newSortOrder));
  };

  const updateGridSize = (newGridSize: 'small' | 'medium' | 'large') => {
    dispatch(setGridSize(newGridSize));
  };

  const clearAllFilters = () => {
    dispatch(clearFilters());
  };

  const resetAllSearch = () => {
    dispatch(resetSearch());
  };

  const applySearchAndFilters = useCallback(() => {
    dispatch(filterGames());
  }, [dispatch]);

  // Auto-apply filters when search state changes
  useEffect(() => {
    applySearchAndFilters();
  }, [searchState, applySearchAndFilters]);

  return {
    // State
    searchState,
    query,
    filters,
    sortBy,
    sortOrder,
    gridSize,
    hasActiveFilters,
    activeFiltersCount,

    // Actions
    updateSearchQuery,
    updateSearchFilters,
    updateSingleFilter,
    updateSorting,
    updateGridSize,
    clearAllFilters,
    resetAllSearch,
    applySearchAndFilters
  };
};
