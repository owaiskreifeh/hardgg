import { configureStore } from '@reduxjs/toolkit';
import gamesReducer, {
  fetchGames,
  loadMoreGames,
  fetchGameById,
  setSelectedGame,
  clearError,
  clearSelectedGame,
  resetPagination
} from '../gamesSlice';
import { Game } from '@/types/game';

// Mock fetch
global.fetch = jest.fn();

// Mock data
const mockGame: Game = {
  id: '1',
  title: 'Test Game',
  description: 'A test game',
  image: 'test.jpg',
  size: '2.5 GB',
  genre: ['Action'],
  tags: ['Adventure'],
  releaseDate: '2023-01-01',
  developer: 'Test Dev',
  publisher: 'Test Pub',
  language: ['English'],
  repackSize: '1.2 GB',
  originalSize: '2.5 GB',
  downloadLinks: {
    magnet: 'magnet:test'
  },
  systemRequirements: {
    minimum: {
      os: 'Windows 10',
      processor: 'Intel i5',
      memory: '8 GB',
      graphics: 'GTX 1060',
      storage: '5 GB'
    }
  },
  features: ['Multiplayer']
};

const mockGamesResponse = {
  games: [mockGame],
  pagination: {
    page: 1,
    limit: 20,
    total: 1,
    hasNext: false
  }
};

describe('Games Slice', () => {
  let store: ReturnType<typeof setupStore>;

  const setupStore = () => {
    return configureStore({
      reducer: {
        games: gamesReducer,
        search: (state = { query: '', filters: {}, sortBy: 'title', sortOrder: 'asc', gridSize: 'medium' }) => state
      }
    });
  };

  beforeEach(() => {
    store = setupStore();
    jest.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = store.getState().games;
      expect(state).toEqual({
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
      });
    });
  });

  describe('Reducers', () => {
    it('should set selected game', () => {
      store.dispatch(setSelectedGame(mockGame));
      const state = store.getState().games;
      expect(state.selectedGame).toEqual(mockGame);
    });

    it('should clear selected game', () => {
      store.dispatch(setSelectedGame(mockGame));
      store.dispatch(clearSelectedGame());
      const state = store.getState().games;
      expect(state.selectedGame).toBeNull();
    });

    it('should clear error', () => {
      // First set an error by dispatching a failed action
      store.dispatch({ type: 'games/fetchGames/rejected', payload: 'Test error' });
      expect(store.getState().games.error).toBe('Test error');
      
      store.dispatch(clearError());
      const state = store.getState().games;
      expect(state.error).toBeNull();
    });

    it('should reset pagination', () => {
      // First add some games and change pagination
      store.dispatch({
        type: 'games/fetchGames/fulfilled',
        payload: {
          games: [mockGame],
          pagination: { page: 2, limit: 20, total: 1, hasNext: false },
          isInitialLoad: false
        }
      });

      store.dispatch(resetPagination());
      const state = store.getState().games;
      expect(state.currentPage).toBe(1);
      expect(state.hasMore).toBe(true);
      expect(state.games).toEqual([]);
      expect(state.filteredGames).toEqual([]);
    });
  });

  describe('Async Thunks', () => {
    describe('fetchGames', () => {
      it('should handle pending state for initial load', () => {
        store.dispatch(fetchGames.pending('', 1));
        const state = store.getState().games;
        expect(state.loading).toBe(true);
        expect(state.loadingMore).toBe(false);
        expect(state.error).toBeNull();
      });

      it('should handle pending state for subsequent pages', () => {
        store.dispatch(fetchGames.pending('', 2));
        const state = store.getState().games;
        expect(state.loading).toBe(false);
        expect(state.loadingMore).toBe(true);
        expect(state.error).toBeNull();
      });

      it('should handle fulfilled state for initial load', () => {
        store.dispatch({
          type: 'games/fetchGames/fulfilled',
          payload: {
            games: [mockGame],
            pagination: { page: 1, limit: 20, total: 1, hasNext: false },
            isInitialLoad: true
          }
        });

        const state = store.getState().games;
        expect(state.loading).toBe(false);
        expect(state.games).toEqual([mockGame]);
        expect(state.filteredGames).toEqual([mockGame]);
        expect(state.currentPage).toBe(1);
        expect(state.hasMore).toBe(false);
        expect(state.totalGames).toBe(1);
        expect(state.lastFetched).toBeDefined();
      });

      it('should handle fulfilled state for subsequent pages', () => {
        // First add initial games
        store.dispatch({
          type: 'games/fetchGames/fulfilled',
          payload: {
            games: [mockGame],
            pagination: { page: 1, limit: 20, total: 2, hasNext: true },
            isInitialLoad: true
          }
        });

        const secondGame = { ...mockGame, id: '2', title: 'Second Game' };
        store.dispatch({
          type: 'games/fetchGames/fulfilled',
          payload: {
            games: [secondGame],
            pagination: { page: 2, limit: 20, total: 2, hasNext: false },
            isInitialLoad: false
          }
        });

        const state = store.getState().games;
        expect(state.loadingMore).toBe(false);
        expect(state.games).toEqual([mockGame, secondGame]);
        expect(state.filteredGames).toEqual([mockGame, secondGame]);
        expect(state.currentPage).toBe(2);
        expect(state.hasMore).toBe(false);
      });

      it('should handle rejected state', () => {
        store.dispatch({
          type: 'games/fetchGames/rejected',
          payload: 'Failed to fetch games'
        });

        const state = store.getState().games;
        expect(state.loading).toBe(false);
        expect(state.loadingMore).toBe(false);
        expect(state.error).toBe('Failed to fetch games');
      });
    });

    describe('loadMoreGames', () => {
      it('should handle pending state', () => {
        store.dispatch(loadMoreGames.pending(''));
        const state = store.getState().games;
        expect(state.loadingMore).toBe(true);
        expect(state.error).toBeNull();
      });

      it('should handle fulfilled state', () => {
        // First add initial games
        store.dispatch({
          type: 'games/fetchGames/fulfilled',
          payload: {
            games: [mockGame],
            pagination: { page: 1, limit: 20, total: 2, hasNext: true },
            isInitialLoad: true
          }
        });

        const secondGame = { ...mockGame, id: '2', title: 'Second Game' };
        store.dispatch({
          type: 'games/loadMoreGames/fulfilled',
          payload: {
            games: [secondGame],
            pagination: { page: 2, limit: 20, total: 2, hasNext: false },
            isInitialLoad: false
          }
        });

        const state = store.getState().games;
        expect(state.loadingMore).toBe(false);
        expect(state.games).toEqual([mockGame, secondGame]);
        expect(state.filteredGames).toEqual([mockGame, secondGame]);
        expect(state.currentPage).toBe(2);
        expect(state.hasMore).toBe(false);
      });

      it('should handle rejected state', () => {
        store.dispatch({
          type: 'games/loadMoreGames/rejected',
          payload: 'Failed to load more games'
        });

        const state = store.getState().games;
        expect(state.loadingMore).toBe(false);
        expect(state.error).toBe('Failed to load more games');
      });
    });

    describe('fetchGameById', () => {
      it('should handle pending state', () => {
        store.dispatch(fetchGameById.pending('', '1'));
        const state = store.getState().games;
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
      });

      it('should handle fulfilled state', () => {
        store.dispatch({
          type: 'games/fetchGameById/fulfilled',
          payload: mockGame
        });

        const state = store.getState().games;
        expect(state.loading).toBe(false);
        expect(state.selectedGame).toEqual(mockGame);
      });

      it('should handle rejected state', () => {
        store.dispatch({
          type: 'games/fetchGameById/rejected',
          payload: 'Failed to fetch game'
        });

        const state = store.getState().games;
        expect(state.loading).toBe(false);
        expect(state.error).toBe('Failed to fetch game');
      });
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete fetch games flow', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockGamesResponse
      });

      await store.dispatch(fetchGames(1));

      const state = store.getState().games;
      expect(state.games).toEqual([mockGame]);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle fetch games error', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await store.dispatch(fetchGames(1));

      const state = store.getState().games;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Network error');
    });

    it('should handle fetch game by id flow', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ game: mockGame })
      });

      await store.dispatch(fetchGameById('1'));

      const state = store.getState().games;
      expect(state.selectedGame).toEqual(mockGame);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });
});
