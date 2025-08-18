# Redux Store Documentation

This directory contains the Redux store setup using Redux Toolkit, Redux Thunk, and Redux Persist for state management and local caching.

## Structure

```
src/store/
├── index.ts                 # Main store configuration
├── hooks.ts                 # Typed Redux hooks
├── Provider.tsx            # Redux Provider component
├── selectors.ts            # State selectors
├── slices/                 # Redux slices
│   ├── gamesSlice.ts       # Games state management
│   ├── searchSlice.ts      # Search and filter state
│   └── uiSlice.ts          # UI state management
├── hooks/                  # Custom hooks
│   ├── index.ts           # Hook exports
│   ├── useGames.ts        # Games management hook
│   ├── useSearch.ts       # Search management hook
│   └── useUI.ts           # UI management hook
└── utils/                  # Utility functions
    └── gameFilters.ts      # Game filtering logic
```

## Features

### 🎮 Games Management
- **State Persistence**: Games data is cached locally using Redux Persist
- **Async Loading**: Automatic data fetching with loading states
- **Error Handling**: Comprehensive error management
- **Caching**: Smart caching with configurable cache duration

### 🔍 Search & Filtering
- **Real-time Search**: Instant search across game titles, descriptions, genres, and tags
- **Advanced Filtering**: Filter by genre, language, size, and more
- **Sorting**: Sort by title, release date, or size
- **Grid Size Control**: Adjustable grid layout

### 🎨 UI State Management
- **Modal Management**: Centralized modal state
- **Loading States**: Global and component-specific loading indicators
- **Theme Support**: Light/dark theme switching
- **Notifications**: Toast notification system
- **Sidebar Control**: Responsive sidebar management

## Usage

### Basic Setup

```tsx
// In your component
import { useGames, useSearch, useUI } from '@/store/hooks';

function MyComponent() {
  const { games, loading, loadGames } = useGames();
  const { query, updateSearchQuery } = useSearch();
  const { showSuccess, showError } = useUI();

  // Use the hooks...
}
```

### Games Management

```tsx
const {
  games,              // All games
  filteredGames,      // Filtered games based on search
  selectedGame,       // Currently selected game
  loading,           // Loading state
  error,             // Error state
  loadGames,         // Load all games
  loadGameById,      // Load specific game
  selectGame,        // Select a game
  clearGame,         // Clear selection
} = useGames();
```

### Search & Filtering

```tsx
const {
  query,              // Search query
  filters,            // Active filters
  sortBy,             // Sort field
  sortOrder,          // Sort direction
  gridSize,           // Grid size
  updateSearchQuery,  // Update search
  updateSingleFilter, // Update specific filter
  clearAllFilters,    // Clear all filters
  resetAllSearch,     // Reset everything
} = useSearch();
```

### UI Management

```tsx
const {
  isModalOpen,        // Modal state
  isLoading,          // Loading state
  theme,              // Current theme
  notifications,      // Active notifications
  openModal,          // Open modal
  closeModal,         // Close modal
  showSuccess,        // Show success notification
  showError,          // Show error notification
  toggleTheme,        // Toggle theme
} = useUI();
```

## Persistence

The store uses Redux Persist to cache data locally:

- **Games Data**: Cached for 5 minutes with automatic refresh
- **Search State**: Persisted across sessions
- **UI State**: Not persisted (resets on page reload)

## Performance Optimizations

- **Memoized Selectors**: Efficient state access with `createSelector`
- **Automatic Filtering**: Filters are applied automatically when search state changes
- **Smart Caching**: Prevents unnecessary API calls
- **Optimistic Updates**: Immediate UI feedback

## Error Handling

- **Network Errors**: Automatic retry with exponential backoff
- **User Feedback**: Toast notifications for errors
- **Graceful Degradation**: Fallback to cached data when offline

## Development

### Adding New Actions

1. Add action to the appropriate slice
2. Update selectors if needed
3. Create custom hook if necessary
4. Update documentation

### Adding New Slices

1. Create slice file in `slices/`
2. Add to root reducer in `index.ts`
3. Update persistence configuration
4. Create selectors
5. Create custom hook
6. Update documentation

## Best Practices

- Use typed hooks (`useAppDispatch`, `useAppSelector`)
- Prefer selectors over direct state access
- Use custom hooks for complex logic
- Keep slices focused and single-purpose
- Use meaningful action names
- Handle loading and error states
- Test selectors and reducers
