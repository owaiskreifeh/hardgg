const fs = require('fs');
const path = require('path');
const { gameOperations, disconnectRedis } = require('../src/lib/redis');

async function loadDataToRedis() {
  try {
    console.log('Starting data loading process...');
    
    const resultsDir = path.join(__dirname, '../results');
    const files = fs.readdirSync(resultsDir)
      .filter(file => file.endsWith('.json'))
      .sort((a, b) => {
        const aNum = parseInt(a.match(/results_page_(\d+)\.json/)[1]);
        const bNum = parseInt(b.match(/results_page_(\d+)\.json/)[1]);
        return aNum - bNum;
      });

    console.log(`Found ${files.length} JSON files to process`);

    let allGames = [];
    let gameId = 1;

    for (const file of files) {
      console.log(`Processing ${file}...`);
      
      const filePath = path.join(resultsDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const games = JSON.parse(fileContent);

      // Transform the data to match our Game interface
      const transformedGames = games.map(game => {
        // Extract genres from tags - genres are typically broader categories
        const genreKeywords = ['Action', 'RPG', 'Strategy', 'Adventure', 'Shooter', 'Racing', 'Sports', 'Puzzle', 'Simulation', 'Horror', 'Sci-Fi', 'Fantasy', 'Open World', 'Multiplayer', 'Indie', 'Platformer', 'Fighting', 'Stealth', 'Survival', 'Roguelike', 'Metroidvania', 'Visual Novel', 'Point & Click', 'Turn-based', 'Real-time'];
        
        const genres = (game.tags || []).filter(tag => 
          genreKeywords.some(keyword => 
            tag.toLowerCase().includes(keyword.toLowerCase())
          )
        );
        
        // Tags are all the original tags, excluding the ones used as genres
        const tags = (game.tags || []).filter(tag => 
          !genres.includes(tag)
        );
        
        // Extract a cleaner description by removing metadata info
        const cleanDescription = game.description
          .replace(/Genres\/Tags:.*?(?=\s*Companies:|$)/gi, '')
          .replace(/Companies:.*?(?=\s*Languages:|$)/gi, '')
          .replace(/Languages:.*?(?=\s*Original Size:|$)/gi, '')
          .replace(/Original Size:.*?(?=\s*Repack Size:|$)/gi, '')
          .replace(/Repack Size:.*?(?=\s*Download|$)/gi, '')
          .replace(/Download.*$/gi, '')
          .trim();
        
        // Create notes from repack features if available
        const notes = game.repackFeatures && game.repackFeatures.length > 0 
          ? game.repackFeatures.join('\n• ')
          : undefined;

        const transformedGame = {
          id: gameId.toString(),
          title: game.title,
          description: cleanDescription || game.description,
          image: game.image,
          size: game.metadata?.originalSize || 'Unknown',
          genre: genres.length > 0 ? genres : (game.tags || []).slice(0, 3), // Fallback to first 3 tags if no genres found
          tags: tags.length > 0 ? tags : (game.tags || []).slice(3), // Remaining tags
          releaseDate: new Date().toISOString().split('T')[0], // Default date since not in data
          developer: game.metadata?.companies?.split(',')[0]?.trim() || 'Unknown',
          publisher: game.metadata?.companies?.split(',')[1]?.trim() || game.metadata?.companies || 'Unknown',
          language: game.metadata?.languages?.split('/') || ['English'],
          repackSize: game.metadata?.repackSize || 'Unknown',
          originalSize: game.metadata?.originalSize || 'Unknown',
          downloadLinks: {
            direct: game.url,
          },
          systemRequirements: {
            minimum: {
              os: 'Windows 10',
              processor: 'Intel Core i5',
              memory: '8 GB RAM',
              graphics: 'NVIDIA GeForce GTX 970',
              storage: game.metadata?.originalSize || 'Unknown',
            },
          },
          features: game.repackFeatures || [],
          notes: notes,
          url: game.url,
        };
        gameId++;
        return transformedGame;
      });

      allGames = allGames.concat(transformedGames);
    }

    console.log(`Total games to load: ${allGames.length}`);

    // Clear existing data
    await gameOperations.clearGames();

    // Store all games in Redis
    await gameOperations.storeGames(allGames);

    console.log('Data loading completed successfully!');
    
    // Get and display some stats
    const count = await gameOperations.getGameCount();
    console.log(`Games stored in Redis: ${count}`);

  } catch (error) {
    console.error('Error loading data:', error);
    process.exit(1);
  } finally {
    await disconnectRedis();
  }
}

// Run the script
loadDataToRedis();
