import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Game } from '@/types/game';
import { filterAndSortGames } from '../utils/gameFilters';

// Async thunk for fetching games with pagination
export const fetchGames = createAsyncThunk(
  'games/fetchGames',
  async (page: number = 1, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      console.log('🎮 GamesSlice fetchGames called:', {
        page,
        timestamp: new Date().toISOString(),
        searchState: state.search ? {
          query: state.search.query,
          filters: state.search.filters,
          sortBy: state.search.sortBy,
          sortOrder: state.search.sortOrder
        } : null
      });
      
      // Always read current search state so page 1 requests include query/filters
      const searchState = state.search || {
        query: '',
        filters: {},
        sortBy: 'title',
        sortOrder: 'asc'
      };
      
      console.log('🎮 GamesSlice searchState for fetch:', searchState);
      
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      });

      // Add search parameters from searchState
      if (searchState.query) {
        params.append('q', searchState.query);
      }

      if (searchState.filters?.genre?.length) {
        params.append('genre', searchState.filters.genre.join(','));
      }

      if (searchState.filters?.size) {
        params.append('size', searchState.filters.size);
      }

      if (searchState.filters?.language?.length) {
        params.append('language', searchState.filters.language.join(','));
      }

      if (searchState.sortBy) {
        params.append('sortBy', searchState.sortBy);
      }

      if (searchState.sortOrder) {
        params.append('sortOrder', searchState.sortOrder);
      }

      const url = `/api/games?${params.toString()}`;
      console.log('🎮 GamesSlice fetching URL:', url);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch games: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      
      console.log('🎮 GamesSlice fetchGames success:', {
        gamesCount: data.games?.length || 0,
        pagination: data.pagination,
        isInitialLoad: page === 1,
        timestamp: new Date().toISOString()
      });
      
      return {
        games: data.games,
        pagination: data.pagination,
        isInitialLoad: page === 1
      };
    } catch (error) {
      console.error('🎮 GamesSlice fetchGames error:', error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to load games'
      );
    }
  }
);

// Async thunk for loading more games
export const loadMoreGames = createAsyncThunk(
  'games/loadMoreGames',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const { currentPage, hasMore } = state.games;
      const searchState = state.search || {
        query: '',
        filters: {},
        sortBy: 'title',
        sortOrder: 'asc'
      };
      
      if (!hasMore) {
        return { games: [], pagination: null, isInitialLoad: false };
      }

      const nextPage = currentPage + 1;
      
      // Build query parameters
      const params = new URLSearchParams({
        page: nextPage.toString(),
        limit: '20'
      });

      // Add search parameters if they exist
      if (searchState && searchState.query) {
        params.append('q', searchState.query);
      }

      if (searchState && searchState.filters?.genre?.length) {
        params.append('genre', searchState.filters.genre.join(','));
      }

      if (searchState && searchState.filters?.size) {
        params.append('size', searchState.filters.size);
      }

      if (searchState && searchState.filters?.language?.length) {
        params.append('language', searchState.filters.language.join(','));
      }

      if (searchState && searchState.sortBy) {
        params.append('sortBy', searchState.sortBy);
      }

      if (searchState && searchState.sortOrder) {
        params.append('sortOrder', searchState.sortOrder);
      }

      const response = await fetch(`/api/games?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch more games');
      }
      const data = await response.json();
      return {
        games: data.games,
        pagination: data.pagination,
        isInitialLoad: false
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to load more games'
      );
    }
  }
);

// Async thunk for fetching game by ID
export const fetchGameById = createAsyncThunk(
  'games/fetchGameById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/games/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch game');
      }
      const data = await response.json();
      return data.game;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to load game'
      );
    }
  }
);

interface GamesState {
  games: Game[];
  filteredGames: Game[];
  selectedGame: Game | null;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  lastFetched: number | null;
  currentPage: number;
  hasMore: boolean;
  totalGames: number;
}

const initialState: GamesState = {
  games: [],
  filteredGames: [],
  selectedGame: null,
  loading: false,
  loadingMore: false,
  error: null,
  lastFetched: null,
  currentPage: 1,
  hasMore: true,
  totalGames: 0
};

const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    setSelectedGame: (state, action: PayloadAction<Game | null>) => {
      console.log('🎮 GamesSlice setSelectedGame:', {
        from: state.selectedGame?.id,
        to: action.payload?.id,
        timestamp: new Date().toISOString()
      });
      state.selectedGame = action.payload;
    },
    clearError: (state) => {
      console.log('🎮 GamesSlice clearError:', {
        from: state.error,
        timestamp: new Date().toISOString()
      });
      state.error = null;
    },
    clearSelectedGame: (state) => {
      console.log('🎮 GamesSlice clearSelectedGame:', {
        from: state.selectedGame?.id,
        timestamp: new Date().toISOString()
      });
      state.selectedGame = null;
    },
    resetPagination: (state) => {
      console.log('🎮 GamesSlice resetPagination:', {
        from: {
          currentPage: state.currentPage,
          gamesCount: state.games.length,
          filteredGamesCount: state.filteredGames.length
        },
        timestamp: new Date().toISOString()
      });
      state.currentPage = 1;
      state.hasMore = true;
      state.games = [];
      state.filteredGames = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch games
      .addCase(fetchGames.pending, (state, action) => {
        console.log('🎮 GamesSlice fetchGames.pending:', {
          page: action.meta.arg,
          isInitialLoad: action.meta.arg === 1,
          timestamp: new Date().toISOString()
        });
        if (action.meta.arg === 1) {
          state.loading = true;
        } else {
          state.loadingMore = true;
        }
        state.error = null;
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        const { games, pagination, isInitialLoad } = action.payload;
        
        console.log('🎮 GamesSlice fetchGames.fulfilled:', {
          gamesCount: games.length,
          isInitialLoad,
          pagination,
          previousGamesCount: state.games.length,
          timestamp: new Date().toISOString()
        });
        
        if (isInitialLoad) {
          state.loading = false;
          state.games = games;
          state.filteredGames = games;
          state.currentPage = pagination.page;
        } else {
          state.loadingMore = false;
          state.games = [...state.games, ...games];
          state.filteredGames = [...state.filteredGames, ...games];
          state.currentPage = pagination.page;
        }
        
        state.hasMore = pagination.hasNext;
        state.totalGames = pagination.total;
        state.lastFetched = Date.now();
      })
      .addCase(fetchGames.rejected, (state, action) => {
        console.log('🎮 GamesSlice fetchGames.rejected:', {
          error: action.payload,
          timestamp: new Date().toISOString()
        });
        state.loading = false;
        state.loadingMore = false;
        state.error = action.payload as string;
      })
      // Load more games
      .addCase(loadMoreGames.pending, (state) => {
        console.log('🎮 GamesSlice loadMoreGames.pending:', {
          timestamp: new Date().toISOString()
        });
        state.loadingMore = true;
        state.error = null;
      })
      .addCase(loadMoreGames.fulfilled, (state, action) => {
        const { games, pagination } = action.payload;
        
        console.log('🎮 GamesSlice loadMoreGames.fulfilled:', {
          gamesCount: games.length,
          pagination,
          previousGamesCount: state.games.length,
          timestamp: new Date().toISOString()
        });
        
        if (games.length > 0) {
          state.games = [...state.games, ...games];
          state.filteredGames = [...state.filteredGames, ...games];
          state.currentPage = pagination.page;
          state.hasMore = pagination.hasNext;
        }
        
        state.loadingMore = false;
      })
      .addCase(loadMoreGames.rejected, (state, action) => {
        console.log('🎮 GamesSlice loadMoreGames.rejected:', {
          error: action.payload,
          timestamp: new Date().toISOString()
        });
        state.loadingMore = false;
        state.error = action.payload as string;
      })
      // Fetch game by ID
      .addCase(fetchGameById.pending, (state) => {
        console.log('🎮 GamesSlice fetchGameById.pending:', {
          timestamp: new Date().toISOString()
        });
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGameById.fulfilled, (state, action) => {
        console.log('🎮 GamesSlice fetchGameById.fulfilled:', {
          gameId: action.payload?.id,
          timestamp: new Date().toISOString()
        });
        state.loading = false;
        state.selectedGame = action.payload;
      })
      .addCase(fetchGameById.rejected, (state, action) => {
        console.log('🎮 GamesSlice fetchGameById.rejected:', {
          error: action.payload,
          timestamp: new Date().toISOString()
        });
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const {
  setSelectedGame,
  clearError,
  clearSelectedGame,
  resetPagination
} = gamesSlice.actions;

export default gamesSlice.reducer;
