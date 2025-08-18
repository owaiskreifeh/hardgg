import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Game } from '@/types/game';
import { filterAndSortGames } from '../utils/gameFilters';

// Async thunk for fetching games with pagination
export const fetchGames = createAsyncThunk(
  'games/fetchGames',
  async (page: number = 1, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      console.log('Current state:', state); // Debug log
      
      // For initial load (page 1), don't depend on search state
      let searchState = null;
      if (page > 1) {
        searchState = state.search || {
          query: '',
          filters: {},
          sortBy: 'title',
          sortOrder: 'asc'
        };
      }
      
      console.log('Search state:', searchState); // Debug log
      
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      });

      // Only add search parameters if searchState exists
      if (searchState) {
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
      }

      const url = `/api/games?${params.toString()}`;
      console.log('Fetching URL:', url); // Debug log

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch games: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return {
        games: data.games,
        pagination: data.pagination,
        isInitialLoad: page === 1
      };
    } catch (error) {
      console.error('Error in fetchGames:', error); // Debug log
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
      state.selectedGame = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedGame: (state) => {
      state.selectedGame = null;
    },
    resetPagination: (state) => {
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
        if (action.meta.arg === 1) {
          state.loading = true;
        } else {
          state.loadingMore = true;
        }
        state.error = null;
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        const { games, pagination, isInitialLoad } = action.payload;
        
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
        state.loading = false;
        state.loadingMore = false;
        state.error = action.payload as string;
      })
      // Load more games
      .addCase(loadMoreGames.pending, (state) => {
        state.loadingMore = true;
        state.error = null;
      })
      .addCase(loadMoreGames.fulfilled, (state, action) => {
        const { games, pagination } = action.payload;
        
        if (games.length > 0) {
          state.games = [...state.games, ...games];
          state.filteredGames = [...state.filteredGames, ...games];
          state.currentPage = pagination.page;
          state.hasMore = pagination.hasNext;
        }
        
        state.loadingMore = false;
      })
      .addCase(loadMoreGames.rejected, (state, action) => {
        state.loadingMore = false;
        state.error = action.payload as string;
      })
      // Fetch game by ID
      .addCase(fetchGameById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGameById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedGame = action.payload;
      })
      .addCase(fetchGameById.rejected, (state, action) => {
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
