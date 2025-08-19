const { expect } = require('chai');
const { filterAndSortGames } = require('../../src/store/utils/gameFilters');

// Mock data for integration tests
const mockGames = [
  {
    id: '1',
    title: 'Grand Theft Auto V',
    description: 'An action-adventure game set in Los Santos',
    image: 'gta5.jpg',
    size: '65.2 GB',
    genre: ['Action', 'Adventure', 'Open World'],
    tags: ['Crime', 'Multiplayer', 'Sandbox'],
    releaseDate: '2013-09-17',
    developer: 'Rockstar North',
    publisher: 'Rockstar Games',
    language: ['English', 'Spanish', 'French'],
    repackSize: '45.8 GB',
    originalSize: '65.2 GB',
    downloadLinks: {
      magnet: 'magnet:?xt=urn:btih:gta5magnet',
      torrent: 'https://example.com/gta5.torrent'
    },
    systemRequirements: {
      minimum: {
        os: 'Windows 10',
        processor: 'Intel Core i5-3470',
        memory: '8 GB RAM',
        graphics: 'NVIDIA GTX 660',
        storage: '72 GB'
      }
    },
    features: ['Multiplayer', 'DLC Support']
  },
  {
    id: '2',
    title: 'The Witcher 3: Wild Hunt',
    description: 'An action role-playing game with a vast open world',
    image: 'witcher3.jpg',
    size: '35.6 GB',
    genre: ['RPG', 'Action', 'Adventure'],
    tags: ['Fantasy', 'Open World', 'Story Rich'],
    releaseDate: '2015-05-19',
    developer: 'CD Projekt Red',
    publisher: 'CD Projekt',
    language: ['English', 'Polish', 'German'],
    repackSize: '28.3 GB',
    originalSize: '35.6 GB',
    downloadLinks: {
      magnet: 'magnet:?xt=urn:btih:witcher3magnet',
      direct: 'https://example.com/witcher3.zip'
    },
    systemRequirements: {
      minimum: {
        os: 'Windows 7',
        processor: 'Intel CPU Core i5-2500K',
        memory: '6 GB RAM',
        graphics: 'Nvidia GPU GeForce GTX 660',
        storage: '35 GB'
      }
    },
    features: ['Single Player', 'DLC Support']
  },
  {
    id: '3',
    title: 'Red Dead Redemption 2',
    description: 'A western-themed action-adventure game',
    image: 'rdr2.jpg',
    size: '150.0 GB',
    genre: ['Action', 'Adventure', 'Western'],
    tags: ['Open World', 'Story Rich', 'Multiplayer'],
    releaseDate: '2019-12-05',
    developer: 'Rockstar Games',
    publisher: 'Rockstar Games',
    language: ['English', 'Spanish'],
    repackSize: '95.2 GB',
    originalSize: '150.0 GB',
    downloadLinks: {
      magnet: 'magnet:?xt=urn:btih:rdr2magnet'
    },
    systemRequirements: {
      minimum: {
        os: 'Windows 10',
        processor: 'Intel Core i5-2500K',
        memory: '8 GB RAM',
        graphics: 'NVIDIA GTX 770',
        storage: '150 GB'
      }
    },
    features: ['Multiplayer', 'DLC Support']
  }
];

describe('Game Search Integration Tests', function() {
  describe('Search Functionality', function() {
    it('should find games by title search', function() {
      const searchState = {
        query: 'Witcher',
        filters: {},
        sortBy: 'title',
        sortOrder: 'asc',
        gridSize: 'medium'
      };

      const results = filterAndSortGames(mockGames, searchState);
      
      expect(results).to.have.length(1);
      expect(results[0].title).to.equal('The Witcher 3: Wild Hunt');
    });

    it('should find games by title search', function() {
      const searchState = {
        query: 'Grand Theft',
        filters: {},
        sortBy: 'title',
        sortOrder: 'asc',
        gridSize: 'medium'
      };

      const results = filterAndSortGames(mockGames, searchState);
      
      expect(results).to.have.length(1);
      expect(results[0].title).to.equal('Grand Theft Auto V');
    });

    it('should find games by genre search', function() {
      const searchState = {
        query: 'RPG',
        filters: {},
        sortBy: 'title',
        sortOrder: 'asc',
        gridSize: 'medium'
      };

      const results = filterAndSortGames(mockGames, searchState);
      
      expect(results).to.have.length(1);
      expect(results[0].title).to.equal('The Witcher 3: Wild Hunt');
    });
  });

  describe('Filtering Functionality', function() {
    it('should filter by genre', function() {
      const searchState = {
        query: '',
        filters: { genre: ['Action'] },
        sortBy: 'title',
        sortOrder: 'asc',
        gridSize: 'medium'
      };

      const results = filterAndSortGames(mockGames, searchState);
      
      expect(results).to.have.length(3);
      results.forEach(game => {
        expect(game.genre).to.include('Action');
      });
    });

    it('should filter by size range', function() {
      const searchState = {
        query: '',
        filters: { size: '50 GB' },
        sortBy: 'title',
        sortOrder: 'asc',
        gridSize: 'medium'
      };

      const results = filterAndSortGames(mockGames, searchState);
      
      expect(results).to.have.length(1);
      expect(results[0].title).to.equal('The Witcher 3: Wild Hunt');
    });

    it('should filter by language', function() {
      const searchState = {
        query: '',
        filters: { language: ['Polish'] },
        sortBy: 'title',
        sortOrder: 'asc',
        gridSize: 'medium'
      };

      const results = filterAndSortGames(mockGames, searchState);
      
      expect(results).to.have.length(1);
      expect(results[0].title).to.equal('The Witcher 3: Wild Hunt');
    });

    it('should apply multiple filters', function() {
      const searchState = {
        query: '',
        filters: { 
          genre: ['Action'],
          language: ['English']
        },
        sortBy: 'title',
        sortOrder: 'asc',
        gridSize: 'medium'
      };

      const results = filterAndSortGames(mockGames, searchState);
      
      expect(results).to.have.length(3);
      results.forEach(game => {
        expect(game.genre).to.include('Action');
        expect(game.language).to.include('English');
      });
    });
  });

  describe('Sorting Functionality', function() {
    it('should sort by title ascending', function() {
      const searchState = {
        query: '',
        filters: {},
        sortBy: 'title',
        sortOrder: 'asc',
        gridSize: 'medium'
      };

      const results = filterAndSortGames(mockGames, searchState);
      
      expect(results[0].title).to.equal('Grand Theft Auto V');
      expect(results[1].title).to.equal('Red Dead Redemption 2');
      expect(results[2].title).to.equal('The Witcher 3: Wild Hunt');
    });

    it('should sort by title descending', function() {
      const searchState = {
        query: '',
        filters: {},
        sortBy: 'title',
        sortOrder: 'desc',
        gridSize: 'medium'
      };

      const results = filterAndSortGames(mockGames, searchState);
      
      expect(results[0].title).to.equal('The Witcher 3: Wild Hunt');
      expect(results[1].title).to.equal('Red Dead Redemption 2');
      expect(results[2].title).to.equal('Grand Theft Auto V');
    });

    it('should sort by release date descending', function() {
      const searchState = {
        query: '',
        filters: {},
        sortBy: 'releaseDate',
        sortOrder: 'desc',
        gridSize: 'medium'
      };

      const results = filterAndSortGames(mockGames, searchState);
      
      expect(results[0].title).to.equal('Red Dead Redemption 2'); // 2019-12-05
      expect(results[1].title).to.equal('The Witcher 3: Wild Hunt'); // 2015-05-19
      expect(results[2].title).to.equal('Grand Theft Auto V'); // 2013-09-17
    });

    it('should sort by size descending', function() {
      const searchState = {
        query: '',
        filters: {},
        sortBy: 'size',
        sortOrder: 'desc',
        gridSize: 'medium'
      };

      const results = filterAndSortGames(mockGames, searchState);
      
      expect(results[0].title).to.equal('Red Dead Redemption 2'); // 150.0 GB
      expect(results[1].title).to.equal('Grand Theft Auto V'); // 65.2 GB
      expect(results[2].title).to.equal('The Witcher 3: Wild Hunt'); // 35.6 GB
    });
  });

  describe('Complex Search Scenarios', function() {
    it('should handle search with filters and sorting', function() {
      const searchState = {
        query: 'Action',
        filters: { 
          genre: ['Action'],
          language: ['English']
        },
        sortBy: 'releaseDate',
        sortOrder: 'desc',
        gridSize: 'medium'
      };

      const results = filterAndSortGames(mockGames, searchState);
      
      expect(results).to.have.length(3);
      expect(results[0].title).to.equal('Red Dead Redemption 2');
      expect(results[1].title).to.equal('The Witcher 3: Wild Hunt');
      expect(results[2].title).to.equal('Grand Theft Auto V');
    });

    it('should handle case insensitive search', function() {
      const searchState = {
        query: 'WITCHER',
        filters: {},
        sortBy: 'title',
        sortOrder: 'asc',
        gridSize: 'medium'
      };

      const results = filterAndSortGames(mockGames, searchState);
      
      expect(results).to.have.length(1);
      expect(results[0].title).to.equal('The Witcher 3: Wild Hunt');
    });

    it('should handle partial word search', function() {
      const searchState = {
        query: 'Redemption',
        filters: {},
        sortBy: 'title',
        sortOrder: 'asc',
        gridSize: 'medium'
      };

      const results = filterAndSortGames(mockGames, searchState);
      
      expect(results).to.have.length(1);
      expect(results[0].title).to.equal('Red Dead Redemption 2');
    });
  });

  describe('Edge Cases', function() {
    it('should handle empty search results', function() {
      const searchState = {
        query: 'NonExistentGame',
        filters: {},
        sortBy: 'title',
        sortOrder: 'asc',
        gridSize: 'medium'
      };

      const results = filterAndSortGames(mockGames, searchState);
      
      expect(results).to.have.length(0);
    });

    it('should handle empty filters', function() {
      const searchState = {
        query: '',
        filters: {},
        sortBy: 'title',
        sortOrder: 'asc',
        gridSize: 'medium'
      };

      const results = filterAndSortGames(mockGames, searchState);
      
      expect(results).to.have.length(3);
    });

    it('should handle games with missing properties', function() {
      const incompleteGame = {
        id: '4',
        title: 'Incomplete Game',
        description: 'A game with missing properties',
        image: 'incomplete.jpg',
        size: '10 GB',
        genre: [],
        tags: [],
        releaseDate: '2023-01-01',
        developer: '',
        publisher: '',
        language: [],
        repackSize: '5 GB',
        originalSize: '10 GB',
        downloadLinks: {},
        systemRequirements: {
          minimum: {
            os: 'Windows 10',
            processor: 'Intel i5',
            memory: '8 GB',
            graphics: 'GTX 1060',
            storage: '10 GB'
          }
        },
        features: []
      };

      const gamesWithIncomplete = [...mockGames, incompleteGame];
      const searchState = {
        query: '',
        filters: {},
        sortBy: 'title',
        sortOrder: 'asc',
        gridSize: 'medium'
      };

      const results = filterAndSortGames(gamesWithIncomplete, searchState);
      
      expect(results).to.have.length(4);
      expect(results[0].title).to.equal('Grand Theft Auto V');
      expect(results[1].title).to.equal('Incomplete Game');
      expect(results[2].title).to.equal('Red Dead Redemption 2');
      expect(results[3].title).to.equal('The Witcher 3: Wild Hunt');
    });
  });
});
