import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Game } from '@/types/game';
import { filterAndSortGames } from '../utils/gameFilters';

// Async thunk for fetching games
export const fetchGames = createAsyncThunk(
  'games/fetchGames',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/games');
      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }
      const data = await response.json();
      return data.games;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to load games'
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

// Thunk for filtering games
export const filterGames = createAsyncThunk(
  'games/filterGames',
  async (_, { getState, dispatch }) => {
    const state = getState() as any;
    const { games } = state.games;
    const { searchState } = state.search;

    const filteredGames = filterAndSortGames(games, searchState);
    dispatch(setFilteredGames(filteredGames));

    return filteredGames;
  }
);

interface GamesState {
  games: Game[];
  filteredGames: Game[];
  selectedGame: Game | null;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: GamesState = {
  games: [],
  filteredGames: [],
  selectedGame: null,
  loading: false,
  error: null,
  lastFetched: null
};

const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    setFilteredGames: (state, action: PayloadAction<Game[]>) => {
      state.filteredGames = action.payload;
    },
    setSelectedGame: (state, action: PayloadAction<Game | null>) => {
      state.selectedGame = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedGame: (state) => {
      state.selectedGame = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch games
      .addCase(fetchGames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.loading = false;
        state.games = action.payload;
        state.filteredGames = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.loading = false;
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
  setFilteredGames,
  setSelectedGame,
  clearError,
  clearSelectedGame
} = gamesSlice.actions;

export default gamesSlice.reducer;
