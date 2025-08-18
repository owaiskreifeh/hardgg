const { gameOperations, disconnectRedis } = require('../src/lib/redis');

async function testSetup() {
  try {
    console.log('🧪 Testing Docker setup...\n');

    // Test Redis connection
    console.log('1. Testing Redis connection...');
    const count = await gameOperations.getGameCount();
    console.log(`   ✅ Redis connected. Games in database: ${count}\n`);

    // Test getting games
    console.log('2. Testing game retrieval...');
    const games = await gameOperations.getAllGames();
    console.log(`   ✅ Retrieved ${games.length} games\n`);

    // Test search functionality
    console.log('3. Testing search functionality...');
    const searchResults = await gameOperations.searchGames('Action');
    console.log(`   ✅ Search for "Action" returned ${searchResults.length} results\n`);

    // Test filtering
    console.log('4. Testing filtering...');
    const filteredResults = await gameOperations.filterGames({ genre: ['Action'] });
    console.log(`   ✅ Filter by Action genre returned ${filteredResults.length} results\n`);

    // Test getting a specific game
    if (games.length > 0) {
      console.log('5. Testing individual game retrieval...');
      const game = await gameOperations.getGameById(games[0].id);
      console.log(`   ✅ Retrieved game: ${game.title}\n`);
    }

    console.log('🎉 All tests passed! Setup is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  } finally {
    await disconnectRedis();
  }
}

// Run the test
testSetup();
