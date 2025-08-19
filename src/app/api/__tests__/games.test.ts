import { NextRequest } from 'next/server';
import { GET } from '../games/route';
import { GET as getGameById } from '../games/[id]/route';

// Mock the results data
jest.mock('@/lib/redis', () => ({
  getClient: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    exists: jest.fn()
  }))
}));

// Mock fs for reading results files
jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
  readdir: jest.fn()
}));

describe('Games API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/games', () => {
    it('should return games with pagination', async () => {
      const mockGames = [
        {
          id: '1',
          title: 'Test Game 1',
          description: 'Test description',
          image: 'test1.jpg',
          size: '2.5 GB',
          genre: ['Action'],
          tags: ['Adventure'],
          releaseDate: '2023-01-01',
          developer: 'Test Dev',
          publisher: 'Test Pub',
          language: ['English'],
          repackSize: '1.2 GB',
          originalSize: '2.5 GB',
          downloadLinks: { magnet: 'magnet:test1' },
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
        },
        {
          id: '2',
          title: 'Test Game 2',
          description: 'Test description 2',
          image: 'test2.jpg',
          size: '1.5 GB',
          genre: ['Racing'],
          tags: ['Sports'],
          releaseDate: '2023-02-01',
          developer: 'Test Dev 2',
          publisher: 'Test Pub 2',
          language: ['English', 'Spanish'],
          repackSize: '800 MB',
          originalSize: '1.5 GB',
          downloadLinks: { torrent: 'torrent:test2' },
          systemRequirements: {
            minimum: {
              os: 'Windows 10',
              processor: 'Intel i3',
              memory: '4 GB',
              graphics: 'GTX 750',
              storage: '2 GB'
            }
          },
          features: ['Single Player']
        }
      ];

      // Mock the file reading
      const fs = require('fs/promises');
      fs.readdir.mockResolvedValue(['results_page_1.json']);
      fs.readFile.mockResolvedValue(JSON.stringify({ games: mockGames }));

      const request = new NextRequest('http://localhost:3000/api/games?page=1&limit=20');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.games).toHaveLength(2);
      expect(data.pagination).toEqual({
        page: 1,
        limit: 20,
        total: 2,
        hasNext: false
      });
    });

    it('should handle search query', async () => {
      const mockGames = [
        {
          id: '1',
          title: 'Action Game',
          description: 'An action game',
          image: 'action.jpg',
          size: '2.5 GB',
          genre: ['Action'],
          tags: ['Adventure'],
          releaseDate: '2023-01-01',
          developer: 'Action Dev',
          publisher: 'Action Pub',
          language: ['English'],
          repackSize: '1.2 GB',
          originalSize: '2.5 GB',
          downloadLinks: { magnet: 'magnet:action' },
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
        }
      ];

      const fs = require('fs/promises');
      fs.readdir.mockResolvedValue(['results_page_1.json']);
      fs.readFile.mockResolvedValue(JSON.stringify({ games: mockGames }));

      const request = new NextRequest('http://localhost:3000/api/games?q=action');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.games).toHaveLength(1);
      expect(data.games[0].title).toBe('Action Game');
    });

    it('should handle genre filter', async () => {
      const mockGames = [
        {
          id: '1',
          title: 'Racing Game',
          description: 'A racing game',
          image: 'racing.jpg',
          size: '5.0 GB',
          genre: ['Racing'],
          tags: ['Sports'],
          releaseDate: '2023-01-01',
          developer: 'Racing Dev',
          publisher: 'Racing Pub',
          language: ['English'],
          repackSize: '2.5 GB',
          originalSize: '5.0 GB',
          downloadLinks: { magnet: 'magnet:racing' },
          systemRequirements: {
            minimum: {
              os: 'Windows 10',
              processor: 'Intel i5',
              memory: '8 GB',
              graphics: 'GTX 1060',
              storage: '10 GB'
            }
          },
          features: ['Multiplayer']
        }
      ];

      const fs = require('fs/promises');
      fs.readdir.mockResolvedValue(['results_page_1.json']);
      fs.readFile.mockResolvedValue(JSON.stringify({ games: mockGames }));

      const request = new NextRequest('http://localhost:3000/api/games?genre=Racing');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.games).toHaveLength(1);
      expect(data.games[0].genre).toContain('Racing');
    });

    it('should handle sorting', async () => {
      const mockGames = [
        {
          id: '1',
          title: 'Zebra Game',
          description: 'A zebra game',
          image: 'zebra.jpg',
          size: '1.0 GB',
          genre: ['Adventure'],
          tags: ['Wildlife'],
          releaseDate: '2023-01-01',
          developer: 'Zebra Dev',
          publisher: 'Zebra Pub',
          language: ['English'],
          repackSize: '500 MB',
          originalSize: '1.0 GB',
          downloadLinks: { magnet: 'magnet:zebra' },
          systemRequirements: {
            minimum: {
              os: 'Windows 10',
              processor: 'Intel i3',
              memory: '4 GB',
              graphics: 'GTX 750',
              storage: '2 GB'
            }
          },
          features: ['Single Player']
        },
        {
          id: '2',
          title: 'Alpha Game',
          description: 'An alpha game',
          image: 'alpha.jpg',
          size: '2.0 GB',
          genre: ['Action'],
          tags: ['Combat'],
          releaseDate: '2023-02-01',
          developer: 'Alpha Dev',
          publisher: 'Alpha Pub',
          language: ['English'],
          repackSize: '1.0 GB',
          originalSize: '2.0 GB',
          downloadLinks: { magnet: 'magnet:alpha' },
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
        }
      ];

      const fs = require('fs/promises');
      fs.readdir.mockResolvedValue(['results_page_1.json']);
      fs.readFile.mockResolvedValue(JSON.stringify({ games: mockGames }));

      const request = new NextRequest('http://localhost:3000/api/games?sortBy=title&sortOrder=asc');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.games[0].title).toBe('Alpha Game');
      expect(data.games[1].title).toBe('Zebra Game');
    });

    it('should handle errors gracefully', async () => {
      const fs = require('fs/promises');
      fs.readdir.mockRejectedValue(new Error('File system error'));

      const request = new NextRequest('http://localhost:3000/api/games');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBeDefined();
    });
  });

  describe('GET /api/games/[id]', () => {
    it('should return a specific game by ID', async () => {
      const mockGame = {
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
        downloadLinks: { magnet: 'magnet:test' },
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

      const fs = require('fs/promises');
      fs.readdir.mockResolvedValue(['results_page_1.json']);
      fs.readFile.mockResolvedValue(JSON.stringify({ games: [mockGame] }));

      const request = new NextRequest('http://localhost:3000/api/games/1');
      const response = await getGameById(request, { params: Promise.resolve({ id: '1' }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.game).toEqual(mockGame);
    });

    it('should return 404 for non-existent game', async () => {
      const fs = require('fs/promises');
      fs.readdir.mockResolvedValue(['results_page_1.json']);
      fs.readFile.mockResolvedValue(JSON.stringify({ games: [] }));

      const request = new NextRequest('http://localhost:3000/api/games/999');
      const response = await getGameById(request, { params: Promise.resolve({ id: '999' }) });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Game not found');
    });

    it('should handle errors gracefully', async () => {
      const fs = require('fs/promises');
      fs.readdir.mockRejectedValue(new Error('File system error'));

      const request = new NextRequest('http://localhost:3000/api/games/1');
      const response = await getGameById(request, { params: Promise.resolve({ id: '1' }) });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBeDefined();
    });
  });
});
