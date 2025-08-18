import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';
import { getUniqueGenres, getUniqueLanguages, getSizeRanges } from './utils/gameFilters';

// Basic selectors
export const selectGames = (state: RootState) => state.games.games;
export const selectFilteredGames = (state: RootState) => state.games.filteredGames;
export const selectSelectedGame = (state: RootState) => state.games.selectedGame;
export const selectGamesLoading = (state: RootState) => state.games.loading;
export const selectGamesLoadingMore = (state: RootState) => state.games.loadingMore;
export const selectGamesError = (state: RootState) => state.games.error;
export const selectLastFetched = (state: RootState) => state.games.lastFetched;
export const selectCurrentPage = (state: RootState) => state.games.currentPage;
export const selectHasMore = (state: RootState) => state.games.hasMore;
export const selectTotalGames = (state: RootState) => state.games.totalGames;

export const selectSearchState = (state: RootState) => state.search;
export const selectSearchQuery = (state: RootState) => state.search.query;
export const selectSearchFilters = (state: RootState) => state.search.filters;
export const selectSortBy = (state: RootState) => state.search.sortBy;
export const selectSortOrder = (state: RootState) => state.search.sortOrder;
export const selectGridSize = (state: RootState) => state.search.gridSize;

export const selectUIState = (state: RootState) => state.ui;
export const selectIsModalOpen = (state: RootState) => state.ui.isModalOpen;
export const selectUILoading = (state: RootState) => state.ui.isLoading;
export const selectSidebarOpen = (state: RootState) => state.ui.sidebarOpen;
export const selectMobileMenuOpen = (state: RootState) => state.ui.mobileMenuOpen;
export const selectTheme = (state: RootState) => state.ui.theme;
export const selectNotifications = (state: RootState) => state.ui.notifications;

// Memoized selectors
export const selectUniqueGenres = createSelector(
  [selectGames],
  (games) => getUniqueGenres(games)
);

export const selectUniqueLanguages = createSelector(
  [selectGames],
  (games) => getUniqueLanguages(games)
);

export const selectSizeRanges = createSelector(
  [selectGames],
  (games) => getSizeRanges(games)
);

export const selectFilteredGamesCount = createSelector(
  [selectFilteredGames],
  (filteredGames) => filteredGames.length
);

export const selectTotalGamesCount = createSelector(
  [selectGames],
  (games) => games.length
);

export const selectHasActiveFilters = createSelector(
  [selectSearchState],
  (searchState) => {
    const hasQuery = searchState.query.length > 0;
    const hasFilters = Object.keys(searchState.filters).length > 0;
    const hasCustomSort = searchState.sortBy !== 'title' || searchState.sortOrder !== 'asc';

    return hasQuery || hasFilters || hasCustomSort;
  }
);

export const selectActiveFiltersCount = createSelector(
  [selectSearchState],
  (searchState) => {
    let count = 0;

    if (searchState.query.length > 0) count++;
    if (searchState.filters.genre?.length) count += searchState.filters.genre.length;
    if (searchState.filters.language?.length) count += searchState.filters.language.length;
    if (searchState.filters.size) count++;
    if (searchState.sortBy !== 'title' || searchState.sortOrder !== 'asc') count++;

    return count;
  }
);
