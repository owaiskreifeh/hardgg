import { filterAndSortGames, getUniqueGenres, getUniqueLanguages, getSizeRanges } from '../gameFilters';
import { Game } from '@/types/game';
import { SearchState } from '../../slices/searchSlice';

// Mock data for testing
const mockGames: Game[] = [
  {
    id: '1',
    title: 'Action Adventure Game',
    description: 'An exciting action adventure game',
    image: 'game1.jpg',
    size: '2.5 GB',
    genre: ['Action', 'Adventure'],
    tags: ['Open World', 'RPG'],
    releaseDate: '2023-01-15',
    developer: 'GameStudio A',
    publisher: 'Publisher A',
    language: ['English', 'Spanish'],
    repackSize: '1.2 GB',
    originalSize: '2.5 GB',
    downloadLinks: {
      magnet: 'magnet:link1',
      torrent: 'torrent:link1'
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
    features: ['Multiplayer', 'DLC Support']
  },
  {
    id: '2',
    title: 'Racing Simulator',
    description: 'Realistic racing simulation game',
    image: 'game2.jpg',
    size: '15.8 GB',
    genre: ['Racing', 'Simulation'],
    tags: ['Realistic', 'Sports'],
    releaseDate: '2023-06-20',
    developer: 'Racing Studio',
    publisher: 'Publisher B',
    language: ['English', 'French', 'German'],
    repackSize: '8.5 GB',
    originalSize: '15.8 GB',
    downloadLinks: {
      magnet: 'magnet:link2',
      direct: 'direct:link2'
    },
    systemRequirements: {
      minimum: {
        os: 'Windows 10',
        processor: 'Intel i7',
        memory: '16 GB',
        graphics: 'RTX 3070',
        storage: '20 GB'
      }
    },
    features: ['VR Support', 'Multiplayer']
  },
  {
    id: '3',
    title: 'Puzzle Master',
    description: 'Brain-teasing puzzle game',
    image: 'game3.jpg',
    size: '500 MB',
    genre: ['Puzzle', 'Strategy'],
    tags: ['Brain Training', 'Casual'],
    releaseDate: '2022-12-10',
    developer: 'Puzzle Dev',
    publisher: 'Publisher C',
    language: ['English'],
    repackSize: '250 MB',
    originalSize: '500 MB',
    downloadLinks: {
      torrent: 'torrent:link3'
    },
    systemRequirements: {
      minimum: {
        os: 'Windows 7',
        processor: 'Intel i3',
        memory: '4 GB',
        graphics: 'Integrated',
        storage: '1 GB'
      }
    },
    features: ['Single Player']
  }
];

describe('Game Filters', () => {
  describe('filterAndSortGames', () => {
    it('should return all games when no filters are applied', () => {
      const searchState: SearchState = {
        query: '',
        filters: {},
        sortBy: 'title',
        sortOrder: 'asc',
        gridSize: 'medium'
      };

      const result = filterAndSortGames(mockGames, searchState);
      expect(result).toHaveLength(3);
      expect(result[0].title).toBe('Action Adventure Game');
    });

    it('should filter games by search query', () => {
      const searchState: SearchState = {
        query: 'action',
        filters: {},
        sortBy: 'title',
        sortOrder: 'asc',
        gridSize: 'medium'
      };

      const result = filterAndSortGames(mockGames, searchState);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Action Adventure Game');
    });

    it('should filter games by genre', () => {
      const searchState: SearchState = {
        query: '',
        filters: { genre: ['Racing'] },
        sortBy: 'title',
        sortOrder: 'asc',
        gridSize: 'medium'
      };

      const result = filterAndSortGames(mockGames, searchState);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Racing Simulator');
    });

    it('should filter games by size', () => {
      const searchState: SearchState = {
        query: '',
        filters: { size: '1 GB' },
        sortBy: 'title',
        sortOrder: 'asc',
        gridSize: 'medium'
      };

      const result = filterAndSortGames(mockGames, searchState);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Puzzle Master');
    });

    it('should filter games by language', () => {
      const searchState: SearchState = {
        query: '',
        filters: { language: ['French'] },
        sortBy: 'title',
        sortOrder: 'asc',
        gridSize: 'medium'
      };

      const result = filterAndSortGames(mockGames, searchState);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Racing Simulator');
    });

    it('should sort games by title in ascending order', () => {
      const searchState: SearchState = {
        query: '',
        filters: {},
        sortBy: 'title',
        sortOrder: 'asc',
        gridSize: 'medium'
      };

      const result = filterAndSortGames(mockGames, searchState);
      expect(result[0].title).toBe('Action Adventure Game');
      expect(result[1].title).toBe('Puzzle Master');
      expect(result[2].title).toBe('Racing Simulator');
    });

    it('should sort games by title in descending order', () => {
      const searchState: SearchState = {
        query: '',
        filters: {},
        sortBy: 'title',
        sortOrder: 'desc',
        gridSize: 'medium'
      };

      const result = filterAndSortGames(mockGames, searchState);
      expect(result[0].title).toBe('Racing Simulator');
      expect(result[1].title).toBe('Puzzle Master');
      expect(result[2].title).toBe('Action Adventure Game');
    });

    it('should sort games by release date', () => {
      const searchState: SearchState = {
        query: '',
        filters: {},
        sortBy: 'releaseDate',
        sortOrder: 'desc',
        gridSize: 'medium'
      };

      const result = filterAndSortGames(mockGames, searchState);
      expect(result[0].title).toBe('Racing Simulator'); // 2023-06-20
      expect(result[1].title).toBe('Action Adventure Game'); // 2023-01-15
      expect(result[2].title).toBe('Puzzle Master'); // 2022-12-10
    });

    it('should sort games by size', () => {
      const searchState: SearchState = {
        query: '',
        filters: {},
        sortBy: 'size',
        sortOrder: 'desc',
        gridSize: 'medium'
      };

      const result = filterAndSortGames(mockGames, searchState);
      expect(result[0].title).toBe('Racing Simulator'); // 15.8 GB
      expect(result[1].title).toBe('Action Adventure Game'); // 2.5 GB
      expect(result[2].title).toBe('Puzzle Master'); // 500 MB
    });

    it('should apply multiple filters simultaneously', () => {
      const searchState: SearchState = {
        query: 'game',
        filters: { 
          genre: ['Action'],
          language: ['English']
        },
        sortBy: 'title',
        sortOrder: 'asc',
        gridSize: 'medium'
      };

      const result = filterAndSortGames(mockGames, searchState);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Action Adventure Game');
    });

    it('should handle case insensitive search', () => {
      const searchState: SearchState = {
        query: 'RACING',
        filters: {},
        sortBy: 'title',
        sortOrder: 'asc',
        gridSize: 'medium'
      };

      const result = filterAndSortGames(mockGames, searchState);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Racing Simulator');
    });

    it('should search in title, description, genre, and tags', () => {
      const searchState: SearchState = {
        query: 'puzzle',
        filters: {},
        sortBy: 'title',
        sortOrder: 'asc',
        gridSize: 'medium'
      };

      const result = filterAndSortGames(mockGames, searchState);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Puzzle Master');
    });
  });

  describe('getUniqueGenres', () => {
    it('should return unique genres from all games', () => {
      const result = getUniqueGenres(mockGames);
      expect(result).toContain('Action');
      expect(result).toContain('Adventure');
      expect(result).toContain('Racing');
      expect(result).toContain('Simulation');
      expect(result).toContain('Puzzle');
      expect(result).toContain('Strategy');
      expect(result).toContain('Open World');
      expect(result).toContain('RPG');
      expect(result).toContain('Realistic');
      expect(result).toContain('Sports');
      expect(result).toContain('Brain Training');
      expect(result).toContain('Casual');
    });

    it('should return sorted genres', () => {
      const result = getUniqueGenres(mockGames);
      expect(result).toEqual(result.slice().sort());
    });

    it('should handle empty games array', () => {
      const result = getUniqueGenres([]);
      expect(result).toEqual([]);
    });
  });

  describe('getUniqueLanguages', () => {
    it('should return unique languages from all games', () => {
      const result = getUniqueLanguages(mockGames);
      expect(result).toContain('English');
      expect(result).toContain('Spanish');
      expect(result).toContain('French');
      expect(result).toContain('German');
    });

    it('should return sorted languages', () => {
      const result = getUniqueLanguages(mockGames);
      expect(result).toEqual(result.slice().sort());
    });

    it('should handle empty games array', () => {
      const result = getUniqueLanguages([]);
      expect(result).toEqual([]);
    });
  });

  describe('getSizeRanges', () => {
    it('should return unique sizes sorted by size', () => {
      const result = getSizeRanges(mockGames);
      expect(result).toEqual(['500 MB', '2.5 GB', '15.8 GB']);
    });

    it('should handle empty games array', () => {
      const result = getSizeRanges([]);
      expect(result).toEqual([]);
    });

    it('should handle games with same size', () => {
      const gamesWithSameSize = [
        { ...mockGames[0], size: '1 GB' },
        { ...mockGames[1], size: '1 GB' }
      ];
      const result = getSizeRanges(gamesWithSameSize);
      expect(result).toEqual(['1 GB']);
    });
  });
});
