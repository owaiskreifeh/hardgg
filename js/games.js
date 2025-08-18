// games.js
import { games, filteredGames, currentPage, ITEMS_PER_PAGE, allTags, selectedTags, favoriteGames, recentSearches, incrementCurrentPage, resetCurrentPage } from './state.js';
import { gamesGrid, loading, stats } from './dom.js';
import { optimizeImageUrl } from './utils.js';
import { extractTags } from './tags.js';
import { openModal } from './modal.js';
import { showToast } from './ui.js';

// Performance optimizations
const imageCache = new Map();
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.dataset.src;
            if (src) {
                img.src = src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        }
    });
}, {
    rootMargin: '50px 0px',
    threshold: 0.1
});

export async function loadGames() {
    console.log('🎮 Starting loadGames...');
    try {
        if (loading) {
            loading.classList.remove('hidden');
        }
        
        console.log('📡 Fetching game data...');
        // Fetch all available pages
        const promises = [];
        const maxPages = 117; // Load all available pages
        
        for (let i = 1; i <= maxPages; i++) {
            promises.push(
                fetch(`results/results_page_${i}.json`, { 
                    signal: AbortSignal.timeout(5000) // 5 second timeout
                })
                    .then(response => response.ok ? response.json() : [])
                    .catch(() => [])
            );
        }

        const pages = await Promise.all(promises);
        console.log(`📊 Fetched ${pages.length} pages`);
        
        games.length = 0; // Clear existing games
        games.push(...pages.flat());
        console.log(`🎯 Total games loaded: ${games.length}`);
        
        // Add normalizedTitle to all games
        games.forEach(game => {
            if (!game.normalizedTitle) {
                game.normalizedTitle = game.title.replace(/ - FitGirl Repacks$/i, '').toLowerCase();
            }
        });
        
        if (games.length === 0) {
            console.log('⚠️ No games found, creating sample data...');
            createSampleData();
        }
        
        filteredGames.length = 0;
        filteredGames.push(...games);
        
        console.log('🔍 Initializing search and tags...');
        // Initialize search and tags
        initializeFuse();
        extractTags();
        renderGames();
        updateStats();
        
        if (loading) {
            loading.classList.add('hidden');
        }
        console.log('✅ Games loaded successfully!');
    } catch (error) {
        console.error('❌ Error loading games:', error);
        createSampleData();
        if (loading) {
            loading.classList.add('hidden');
        }
    }
}

export function createSampleData() {
    const sampleTags = ['Action', 'RPG', 'Strategy', 'Adventure', 'Shooter', 'Racing', 'Sports', 'Puzzle', 'Simulation', 'Horror', 'Sci-Fi', 'Fantasy', 'Open World', '3D', 'Multiplayer', 'Indie', 'Platformer', 'Fighting'];
    
    const sampleGames = [];
    for (let i = 0; i < 50; i++) {
        const randomTags = sampleTags.slice().sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 5) + 2);
        const title = `Game ${i + 1} - Epic Adventure - FitGirl Repacks`;
        sampleGames.push({
            title: title,
            normalizedTitle: title.replace(/ - FitGirl Repacks$/i, '').toLowerCase(),
            image: `https://picsum.photos/300/400?random=${i + 1}`,
            tags: randomTags,
            repackFeatures: [
                "100% Lossless & MD5 Perfect",
                "NOTHING ripped, NOTHING re-encoded",
                `Compressed from ${Math.floor(Math.random() * 80 + 20)} to ${Math.floor(Math.random() * 30 + 5)} GB`,
                `Installation takes ${Math.floor(Math.random() * 60 + 5)} minutes`,
                `HDD space: ${Math.floor(Math.random() * 50 + 10)} GB`
            ],
            description: `An epic ${randomTags[0].toLowerCase()} game with stunning graphics and immersive gameplay.`,
            url: `https://fitgirl-repacks.site/game-${i + 1}/`,
            metadata: {
                companies: `Game Studio ${i + 1}`,
                languages: "ENG/MULTI8",
                originalSize: `${Math.floor(Math.random() * 80 + 20)} GB`,
                repackSize: `${Math.floor(Math.random() * 30 + 5)} GB`
            }
        });
    }
    
    games.push(...sampleGames);
    
    // Add normalizedTitle to all games
    games.forEach(game => {
        if (!game.normalizedTitle) {
            game.normalizedTitle = game.title.replace(/ - FitGirl Repacks$/i, '').toLowerCase();
        }
    });
    
    filteredGames.length = 0;
    filteredGames.push(...games);
    
    initializeFuse();
    extractTags();
    renderGames();
    updateStats();
}

export function renderGames() {
    loading.classList.add('hidden');
    
    if (currentPage === 0) {
        gamesGrid.innerHTML = '';
    }
    
    const itemsToShow = filteredGames.slice(0, (currentPage + 1) * ITEMS_PER_PAGE);
    const fragment = document.createDocumentFragment();
    
    const startIndex = currentPage * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredGames.length);
    
    for (let i = startIndex; i < endIndex; i++) {
        const game = filteredGames[i];
        const gameCard = createGameCard(game, i);
        fragment.appendChild(gameCard);
    }
    
    gamesGrid.appendChild(fragment);
    
    // Infinite scroll with improved performance
    if (filteredGames.length > itemsToShow.length) {
        const sentinel = document.createElement('div');
        sentinel.className = 'h-4 w-full';
        sentinel.style.gridColumn = '1 / -1';
        gamesGrid.appendChild(sentinel);
        
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                incrementCurrentPage();
                observer.disconnect();
                renderGames();
            }
        }, { threshold: 0.1 });
        
        observer.observe(sentinel);
    }
}

export function createGameCard(game, index) {
    const gameCard = document.createElement('div');
    gameCard.className = 'game-card group cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-gaming-xl';
    gameCard.style.height = '400px';
    
    const isFavorite = favoriteGames.includes(game.title);
    const optimizedImageUrl = optimizeImageUrl(game.image, 300, 400);
    
    gameCard.innerHTML = `
        <div class="relative h-3/4 overflow-hidden">
            <img 
                data-src="${optimizedImageUrl}" 
                alt="${game.title}" 
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
                decoding="async"
                onerror="this.onerror=null;this.src='image.png';"
            />
            
            <!-- Favorite button -->
            <div class="absolute top-2 right-2">
                <button class="favorite-btn retro-button px-2 py-1 text-xs font-pixel">
                    ${isFavorite ? '❤️' : '🤍'}
                </button>
            </div>
            
            <!-- Quick actions overlay -->
            <div class="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <div class="flex gap-2">
                    <button class="retro-button px-3 py-1 text-xs font-pixel view-btn">
                        👁️ VIEW
                    </button>
                    <a href="${game.url}" target="_blank" rel="noopener noreferrer" 
                       class="retro-button px-3 py-1 text-xs font-pixel" onclick="event.stopPropagation()">
                        ⬇️ DOWNLOAD
                    </a>
                </div>
            </div>
        </div>
        <div class="p-3 h-1/4 flex flex-col justify-between">
            <h3 class="text-retro-cyan font-pixel text-xs leading-tight line-clamp-2">
                ${game.title.replace(' - FitGirl Repacks', '')}
            </h3>
            <div class="flex flex-wrap gap-1 mt-1">
                ${game.tags?.slice(0, 2).map(tag => 
                    `<span class="bg-retro-purple/30 text-retro-purple text-xs px-1 py-0.5 font-pixel">${tag}</span>`
                ).join('') || ''}
            </div>
        </div>
    `;
    
    // Add intersection observer for lazy loading
    const img = gameCard.querySelector('img');
    if (img) {
        imageObserver.observe(img);
    }
    
    // Favorite button event
    const favBtn = gameCard.querySelector('.favorite-btn');
    if (favBtn) {
        favBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(game);
        });
    }
    
    // View button event
    const viewBtn = gameCard.querySelector('.view-btn');
    if (viewBtn) {
        viewBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openModal(game);
        });
    }
    
    gameCard.addEventListener('click', () => openModal(game));
    
    return gameCard;
}

// Helper functions
function initializeFuse() {
    // Initialize Fuse.js for search functionality
    if (typeof Fuse !== 'undefined') {
        const fuseOptions = {
            keys: [
                { name: 'title', weight: 0.5 },
                { name: 'normalizedTitle', weight: 0.5 },
                { name: 'tags', weight: 0.3 },
                { name: 'description', weight: 0.1 }
            ],
            threshold: 0.3,
            includeScore: true,
            minMatchCharLength: 2,
            useExtendedSearch: true,
            distance: 100
        };
        window.fuse = new Fuse(games, fuseOptions);
    }
}

export function updateStats() {
    const totalGames = games.length;
    const filteredCount = filteredGames.length;
    const showingCount = Math.min(filteredCount, (currentPage + 1) * ITEMS_PER_PAGE);
    if (stats) {
        stats.textContent = `// SHOWING ${showingCount} OF ${filteredCount} GAMES (${totalGames} TOTAL)`;
    }
}

function toggleFavorite(game) {
    const index = favoriteGames.indexOf(game.title);
    if (index > -1) {
        favoriteGames.splice(index, 1);
        showToast(`Removed ${game.title.replace(' - FitGirl Repacks', '')} from favorites`, 'info');
    } else {
        favoriteGames.push(game.title);
        showToast(`Added ${game.title.replace(' - FitGirl Repacks', '')} to favorites`, 'success');
    }
    
    // Save to localStorage
    localStorage.setItem('favoriteGames', JSON.stringify(favoriteGames));
}

// Export additional utility functions
export function resetPagination() {
    resetCurrentPage();
}

export function getCurrentGames() {
    return filteredGames;
}

export function getGameByIndex(index) {
    return filteredGames[index];
}

export function getTotalGames() {
    return games.length;
}

export function getFilteredGamesCount() {
    return filteredGames.length;
} 