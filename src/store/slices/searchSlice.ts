import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameFilter } from '@/types/game';

export interface SearchState {
  query: string;
  filters: GameFilter;
  sortBy: 'title' | 'releaseDate' | 'size';
  sortOrder: 'asc' | 'desc';
  gridSize: 'small' | 'medium' | 'large';
}

const initialState: SearchState = {
  query: '',
  filters: {},
  sortBy: 'title',
  sortOrder: 'asc',
  gridSize: 'medium'
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setFilters: (state, action: PayloadAction<GameFilter>) => {
      state.filters = action.payload;
    },
    updateFilter: (state, action: PayloadAction<{ key: keyof GameFilter; value: any }>) => {
      const { key, value } = action.payload;
      if (!state.filters) {
        state.filters = {};
      }
      state.filters[key] = value;
    },
    setSortBy: (state, action: PayloadAction<'title' | 'releaseDate' | 'size'>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },
    setGridSize: (state, action: PayloadAction<'small' | 'medium' | 'large'>) => {
      state.gridSize = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    resetSearch: (state) => {
      state.query = '';
      state.filters = {};
      state.sortBy = 'title';
      state.sortOrder = 'asc';
      state.gridSize = 'medium';
    }
  }
});

export const {
  setQuery,
  setFilters,
  updateFilter,
  setSortBy,
  setSortOrder,
  setGridSize,
  clearFilters,
  resetSearch
} = searchSlice.actions;

export default searchSlice.reducer;
