import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redisClient = createClient({
  url: redisUrl
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

// Connect to Redis
export async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

// Disconnect from Redis
export async function disconnectRedis() {
  if (redisClient.isOpen) {
    await redisClient.disconnect();
  }
}

// Game data operations
export const gameOperations = {
  // Store all games
  async storeGames(games: any[]) {
    await connectRedis();

    // Store games as a JSON array
    await redisClient.set('games:all', JSON.stringify(games));

    // Store individual games for quick access
    for (const game of games) {
      await redisClient.set(`game:${game.id}`, JSON.stringify(game));
    }

    // Store game count
    await redisClient.set('games:count', games.length.toString());

    console.log(`Stored ${games.length} games in Redis`);
  },

  // Get all games
  async getAllGames() {
    await connectRedis();
    const gamesData = await redisClient.get('games:all');
    return gamesData ? JSON.parse(gamesData) : [];
  },

  // Get game by ID
  async getGameById(id: string) {
    await connectRedis();
    const gameData = await redisClient.get(`game:${id}`);
    return gameData ? JSON.parse(gameData) : null;
  },

  // Get game count
  async getGameCount() {
    await connectRedis();
    const count = await redisClient.get('games:count');
    return count ? parseInt(count) : 0;
  },

  // Search games
  async searchGames(query: string) {
    await connectRedis();
    const games = await this.getAllGames();

    if (!query.trim()) return games;

    const searchTerm = query.toLowerCase();
    return games.filter((game: any) =>
      game.title.toLowerCase().includes(searchTerm) ||
      game.description.toLowerCase().includes(searchTerm) ||
      game.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm)) ||
      game.metadata?.companies?.toLowerCase().includes(searchTerm)
    );
  },

  // Filter games
  async filterGames(filters: any) {
    await connectRedis();
    const games = await this.getAllGames();

    return games.filter((game: any) => {
      // Genre filter
      if (filters.genre?.length) {
        const gameGenres = game.tags || [];
        if (!filters.genre.some((g: string) => gameGenres.includes(g))) {
          return false;
        }
      }

      // Size filter
      if (filters.size) {
        const gameSize = game.metadata?.repackSize;
        if (gameSize) {
          const gameSizeNum = parseFloat(gameSize.replace(' GB', ''));
          const filterSizeNum = parseFloat(filters.size.replace(' GB', ''));
          if (gameSizeNum > filterSizeNum) {
            return false;
          }
        }
      }

      // Language filter
      if (filters.language?.length) {
        const gameLanguages = game.metadata?.languages || '';
        if (!filters.language.some((lang: string) => gameLanguages.includes(lang))) {
          return false;
        }
      }

      return true;
    });
  },

  // Clear all game data
  async clearGames() {
    await connectRedis();
    const keys = await redisClient.keys('game:*');
    const allKeys = await redisClient.keys('games:*');

    if (keys.length > 0) {
      await redisClient.del(keys);
    }
    if (allKeys.length > 0) {
      await redisClient.del(allKeys);
    }

    console.log('Cleared all game data from Redis');
  }
};
