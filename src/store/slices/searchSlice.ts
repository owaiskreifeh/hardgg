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
      console.log('🔍 SearchSlice setQuery:', {
        from: state.query,
        to: action.payload,
        timestamp: new Date().toISOString()
      });
      state.query = action.payload;
    },
    setFilters: (state, action: PayloadAction<GameFilter>) => {
      console.log('🎛️ SearchSlice setFilters:', {
        from: state.filters,
        to: action.payload,
        timestamp: new Date().toISOString()
      });
      state.filters = action.payload;
    },
    updateFilter: (state, action: PayloadAction<{ key: keyof GameFilter; value: any }>) => {
      const { key, value } = action.payload;
      console.log('🎛️ SearchSlice updateFilter:', {
        key,
        from: state.filters?.[key],
        to: value,
        timestamp: new Date().toISOString()
      });
      if (!state.filters) {
        state.filters = {};
      }
      state.filters[key] = value;
    },
    setSortBy: (state, action: PayloadAction<'title' | 'releaseDate' | 'size'>) => {
      console.log('📊 SearchSlice setSortBy:', {
        from: state.sortBy,
        to: action.payload,
        timestamp: new Date().toISOString()
      });
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      console.log('📊 SearchSlice setSortOrder:', {
        from: state.sortOrder,
        to: action.payload,
        timestamp: new Date().toISOString()
      });
      state.sortOrder = action.payload;
    },
    setGridSize: (state, action: PayloadAction<'small' | 'medium' | 'large'>) => {
      console.log('📱 SearchSlice setGridSize:', {
        from: state.gridSize,
        to: action.payload,
        timestamp: new Date().toISOString()
      });
      state.gridSize = action.payload;
    },
    clearFilters: (state) => {
      console.log('🧹 SearchSlice clearFilters:', {
        from: state.filters,
        timestamp: new Date().toISOString()
      });
      state.filters = {};
    },
    resetSearch: (state) => {
      console.log('🔄 SearchSlice resetSearch:', {
        from: {
          query: state.query,
          filters: state.filters,
          sortBy: state.sortBy,
          sortOrder: state.sortOrder,
          gridSize: state.gridSize
        },
        timestamp: new Date().toISOString()
      });
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
