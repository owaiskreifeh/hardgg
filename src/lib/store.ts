import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import Fuse from 'fuse.js';
import { Game, GameState, SearchState, GameFilter } from '@/types/game';
import { getRandomImage, parseFileSize } from '@/lib/utils';

// Mock data - replace with actual API call
const mockGames: Game[] = [
  {
    id: '1',
    title: 'Cyberpunk 2077',
    description: 'An open-world action-adventure story set in Night City, a megalopolis obsessed with power, glamour and body modification.',
    image: getRandomImage(300, 200),
    size: '50 GB',
    genre: ['RPG', 'Action', 'Adventure'],
    tags: ['Open World', 'Cyberpunk', 'Story Rich'],
    releaseDate: '2020-12-10',
    developer: 'CD Projekt Red',
    publisher: 'CD Projekt',
    language: ['English', 'Polish'],
    repackSize: '25 GB',
    originalSize: '50 GB',
    downloadLinks: {
      magnet: 'magnet:?xt=urn:btih:example1',
      torrent: 'https://example.com/cyberpunk.torrent',
    },
    systemRequirements: {
      minimum: {
        os: 'Windows 10',
        processor: 'Intel Core i5-3570K',
        memory: '8 GB RAM',
        graphics: 'NVIDIA GeForce GTX 970',
        storage: '70 GB',
      },
      recommended: {
        os: 'Windows 10',
        processor: 'Intel Core i7-4790',
        memory: '12 GB RAM',
        graphics: 'NVIDIA GeForce GTX 1060',
        storage: '70 GB',
      },
    },
    features: ['Ray Tracing', 'DLSS', 'HDR'],
  },
  {
    id: '2',
    title: 'Red Dead Redemption 2',
    description: 'America, 1899. The end of the wild west era has begun. After a robbery goes badly wrong in the western town of Blackwater.',
    image: getRandomImage(300, 200),
    size: '150 GB',
    genre: ['Action', 'Adventure', 'Western'],
    tags: ['Open World', 'Western', 'Story Rich'],
    releaseDate: '2019-12-05',
    developer: 'Rockstar Games',
    publisher: 'Rockstar Games',
    language: ['English', 'Spanish', 'French'],
    repackSize: '75 GB',
    originalSize: '150 GB',
    downloadLinks: {
      magnet: 'magnet:?xt=urn:btih:example2',
      torrent: 'https://example.com/rdr2.torrent',
    },
    systemRequirements: {
      minimum: {
        os: 'Windows 10',
        processor: 'Intel Core i5-2500K',
        memory: '8 GB RAM',
        graphics: 'NVIDIA GeForce GTX 770',
        storage: '150 GB',
      },
    },
    features: ['4K Support', 'HDR', 'Surround Sound'],
  },
  // Add more mock games here...
];

interface GameStore extends GameState {
  // Actions
  setGames: (games: Game[]) => void;
  setFilteredGames: (games: Game[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedGame: (game: Game | null) => void;
  setSearchState: (searchState: SearchState) => void;
  
  // Async actions
  loadGames: () => Promise<void>;
  filterGames: () => void;
  
  // Utility actions
  clearFilters: () => void;
  resetSearch: () => void;
}

const initialSearchState: SearchState = {
  query: '',
  filters: {},
  sortBy: 'title',
  sortOrder: 'asc',
  gridSize: 'medium',
};

const initialGameState: GameState = {
  games: [],
  filteredGames: [],
  loading: false,
  error: null,
  selectedGame: null,
  searchState: initialSearchState,
};

export const useGameStore = create<GameStore>()(
  devtools(
    (set, get) => ({
      ...initialGameState,

      setGames: (games) => set({ games }),
      setFilteredGames: (filteredGames) => set({ filteredGames }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setSelectedGame: (selectedGame) => set({ selectedGame }),
      setSearchState: (searchState) => set({ searchState }),

      loadGames: async () => {
        set({ loading: true, error: null });
        
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // In a real app, this would be an API call
          // const response = await fetch('/api/games');
          // const games = await response.json();
          
          set({ games: mockGames, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load games',
            loading: false 
          });
        }
      },

      filterGames: () => {
        const { games, searchState } = get();
        
        if (!games.length) {
          set({ filteredGames: [] });
          return;
        }

        let filtered = [...games];

        // Apply search query
        if (searchState.query.trim()) {
          const fuse = new Fuse(games, {
            keys: ['title', 'description', 'genre', 'tags', 'developer', 'publisher'],
            threshold: 0.3,
            includeScore: true,
          });
          
          const results = fuse.search(searchState.query);
          filtered = results.map(result => result.item);
        }

        // Apply filters
        if (searchState.filters.genre?.length) {
          filtered = filtered.filter(game =>
            game.genre.some(g => searchState.filters.genre!.includes(g))
          );
        }

        if (searchState.filters.tags?.length) {
          filtered = filtered.filter(game =>
            game.tags.some(tag => searchState.filters.tags!.includes(tag))
          );
        }

        if (searchState.filters.size) {
          const maxSize = parseFileSize(searchState.filters.size);
          filtered = filtered.filter(game => parseFileSize(game.size) <= maxSize);
        }

        if (searchState.filters.language?.length) {
          filtered = filtered.filter(game =>
            game.language.some(lang => searchState.filters.language!.includes(lang))
          );
        }

        if (searchState.filters.developer) {
          filtered = filtered.filter(game =>
            game.developer.toLowerCase().includes(searchState.filters.developer!.toLowerCase())
          );
        }

        if (searchState.filters.publisher) {
          filtered = filtered.filter(game =>
            game.publisher.toLowerCase().includes(searchState.filters.publisher!.toLowerCase())
          );
        }

        // Apply sorting
        filtered.sort((a, b) => {
          let aValue: any, bValue: any;

          switch (searchState.sortBy) {
            case 'title':
              aValue = a.title.toLowerCase();
              bValue = b.title.toLowerCase();
              break;
            case 'releaseDate':
              aValue = new Date(a.releaseDate);
              bValue = new Date(b.releaseDate);
              break;
            case 'size':
              aValue = parseFileSize(a.size);
              bValue = parseFileSize(b.size);
              break;
            case 'popularity':
              // Mock popularity based on ID for demo
              aValue = parseInt(a.id);
              bValue = parseInt(b.id);
              break;
            default:
              aValue = a.title.toLowerCase();
              bValue = b.title.toLowerCase();
          }

          if (searchState.sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });

        set({ filteredGames: filtered });
      },

      clearFilters: () => {
        const { searchState } = get();
        set({
          searchState: {
            ...searchState,
            filters: {},
          },
        });
      },

      resetSearch: () => {
        set({
          searchState: initialSearchState,
        });
      },
    }),
    {
      name: 'game-store',
    }
  )
);
