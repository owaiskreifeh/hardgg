// Global variables
let games = [];
let filteredGames = [];
let fuse;
let currentPage = 0;
let selectedTags = new Set();
let allTags = new Set();
let gridSize = 'medium';
const ITEMS_PER_PAGE = 20;
const isMobile = window.innerWidth < 768;

// UX Enhancements
const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
const favoriteGames = JSON.parse(localStorage.getItem('favoriteGames') || '[]');
const searchHistory = new Set();
let searchSuggestions = [];
// Add a flag to track if a suggestion was clicked
let isSuggestionClick = false;

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

// DOM elements
const loading = document.getElementById('loading');
const stats = document.getElementById('stats');
const searchInput = document.getElementById('searchInput');
const gamesGrid = document.getElementById('gamesGrid');
const tagsContainer = document.getElementById('tagsContainer');
const modal = document.getElementById('gameModal');
const mobileModal = document.getElementById('mobileModal');
const modalContent = document.getElementById('modalContent');
const mobileContent = document.getElementById('mobileContent');
const mobileBack = document.getElementById('mobileBack');
const mobileClose = document.getElementById('mobileClose');
const gridSmall = document.getElementById('gridSmall');
const gridMedium = document.getElementById('gridMedium');
const gridLarge = document.getElementById('gridLarge');
// Add quick action buttons
const showFavoritesBtn = document.getElementById('showFavorites');
const showRecentBtn = document.getElementById('showRecent');
const clearFiltersBtn = document.getElementById('clearFilters');

// Modal menu logic
const menuButton = document.getElementById('menuButton');
const menuModal = document.getElementById('menuModal');
const closeMenuModal = document.getElementById('closeMenuModal');

// Create search suggestions dropdown
function createSearchSuggestions() {
    let suggestionsContainer = document.getElementById('searchSuggestions');
    if (!suggestionsContainer) {
        suggestionsContainer = document.createElement('div');
        suggestionsContainer.id = 'searchSuggestions';
        suggestionsContainer.className = 'absolute top-full left-0 right-0 bg-retro-darker border-2 border-retro-cyan rounded-none z-50 max-h-64 overflow-y-auto hidden';
        searchInput.parentNode.appendChild(suggestionsContainer);
    }
    return suggestionsContainer;
}

// Generate search suggestions
function generateSearchSuggestions(query) {
    if (!query || query.length < 2) {
        return [];
    }
    
    const suggestions = [];
    
    // Add recent searches
    recentSearches.forEach(search => {
        if (search.toLowerCase().includes(query.toLowerCase()) && !suggestions.includes(search)) {
            suggestions.push({ text: search, type: 'recent' });
        }
    });
    
    // Add popular tags
    const popularTags = Array.from(allTags).filter(tag => 
        tag.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
    
    popularTags.forEach(tag => {
        if (!suggestions.some(s => s.text === tag)) {
            suggestions.push({ text: tag, type: 'tag' });
        }
    });
    
    // Add game titles
    const matchingGames = games.filter(game => 
        game.title.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 3);
    
    matchingGames.forEach(game => {
        if (!suggestions.some(s => s.text === game.title)) {
            suggestions.push({ text: game.title, type: 'game' });
        }
    });
    
    return suggestions.slice(0, 8);
}

// Show search suggestions
function showSearchSuggestions(query) {
    const suggestionsContainer = createSearchSuggestions();
    const suggestions = generateSearchSuggestions(query);
    
    if (suggestions.length === 0) {
        suggestionsContainer.classList.add('hidden');
        return;
    }
    
    suggestionsContainer.innerHTML = '';
    
    suggestions.forEach(suggestion => {
        const item = document.createElement('div');
        item.className = 'px-4 py-3 hover:bg-retro-cyan/20 cursor-pointer flex items-center gap-3 transition-colors';
        
        const icon = document.createElement('span');
        icon.className = 'text-retro-cyan text-sm';
        
        switch (suggestion.type) {
            case 'recent':
                icon.textContent = '🕒';
                break;
            case 'tag':
                icon.textContent = '🏷️';
                break;
            case 'game':
                icon.textContent = '🎮';
                break;
        }
        
        const text = document.createElement('span');
        text.className = 'text-white font-pixel text-sm';
        text.textContent = suggestion.text;
        
        item.appendChild(icon);
        item.appendChild(text);
        
        item.addEventListener('click', () => {
            searchInput.value = suggestion.text;
            suggestionsContainer.classList.add('hidden');
            isSuggestionClick = true; // Set flag before filtering
            filterGames();
            addToRecentSearches(suggestion.text);
        });
        
        suggestionsContainer.appendChild(item);
    });
    
    suggestionsContainer.classList.remove('hidden');
}

// Hide search suggestions
function hideSearchSuggestions() {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (suggestionsContainer) {
        suggestionsContainer.classList.add('hidden');
    }
}

// Add to recent searches
function addToRecentSearches(search) {
    if (!search || search.trim() === '') return;
    
    const trimmedSearch = search.trim();
    const index = recentSearches.indexOf(trimmedSearch);
    
    if (index > -1) {
        recentSearches.splice(index, 1);
    }
    
    recentSearches.unshift(trimmedSearch);
    
    if (recentSearches.length > 10) {
        recentSearches.pop();
    }
    
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
}

// Toggle favorite game
function toggleFavorite(game) {
    const gameId = game.title;
    const index = favoriteGames.indexOf(gameId);
    
    if (index > -1) {
        favoriteGames.splice(index, 1);
        showToast('Removed from favorites', 'info');
    } else {
        favoriteGames.unshift(gameId);
        showToast('Added to favorites', 'success');
    }
    
    localStorage.setItem('favoriteGames', JSON.stringify(favoriteGames));
    renderGames(); // Re-render to update favorite icons
}

// Show toast notification
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-60 px-4 py-3 rounded-lg font-pixel text-sm text-white transform translate-x-full transition-transform duration-300 ${
        type === 'success' ? 'bg-retro-green' : 
        type === 'error' ? 'bg-red-600' : 
        'bg-retro-cyan'
    }`;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.remove('translate-x-full');
    }, 100);
    
    // Animate out
    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Create toast container
function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'fixed top-4 right-4 z-60 space-y-2';
    document.body.appendChild(container);
    return container;
}

// Image optimization utilities
function optimizeImageUrl(url, width = 300, height = 400) {
    if (!url || url.includes('picsum.photos')) return url;
    
    // Add image optimization parameters
    const optimizedUrl = new URL(url);
    optimizedUrl.searchParams.set('w', width);
    optimizedUrl.searchParams.set('h', height);
    optimizedUrl.searchParams.set('q', '85');
    optimizedUrl.searchParams.set('fit', 'crop');
    
    return optimizedUrl.toString();
}

function preloadImage(src) {
    return new Promise((resolve, reject) => {
        if (imageCache.has(src)) {
            resolve(imageCache.get(src));
            return;
        }
        
        const img = new Image();
        img.onload = () => {
            imageCache.set(src, img);
            resolve(img);
        };
        img.onerror = reject;
        img.src = src;
    });
}

// Debounce function with improved performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize Fuse.js with optimized configuration
function initializeFuse() {
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
    fuse = new Fuse(games, fuseOptions);
}

// Extract all unique tags with memoization
const tagCache = new Map();
function extractTags() {
    if (tagCache.has(games.length)) {
        allTags = new Set(tagCache.get(games.length));
        renderTags();
        return;
    }
    
    games.forEach(game => {
        if (game.tags) {
            game.tags.forEach(tag => allTags.add(tag));
        }
    });
    
    tagCache.set(games.length, Array.from(allTags));
    renderTags();
}

// Render tags with virtual scrolling for large tag lists
function renderTags() {
    tagsContainer.innerHTML = '';
    const sortedTags = Array.from(allTags).sort();
    
    // Virtual scrolling for large tag lists
    const maxVisibleTags = 50;
    const visibleTags = sortedTags.slice(0, maxVisibleTags);
    
    visibleTags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = `tag-chip px-2 py-1 text-xs font-pixel rounded-none ${
            selectedTags.has(tag) ? 'active' : ''
        }`;
        tagElement.textContent = tag;
        tagElement.addEventListener('click', () => toggleTag(tag));
        tagsContainer.appendChild(tagElement);
    });
    
    // Add "show more" if needed
    if (sortedTags.length > maxVisibleTags) {
        const showMoreBtn = document.createElement('button');
        showMoreBtn.className = 'tag-chip px-2 py-1 text-xs font-pixel rounded-none';
        showMoreBtn.textContent = `+${sortedTags.length - maxVisibleTags} more`;
        showMoreBtn.addEventListener('click', () => {
            sortedTags.slice(maxVisibleTags).forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.className = `tag-chip px-2 py-1 text-xs font-pixel rounded-none ${
                    selectedTags.has(tag) ? 'active' : ''
                }`;
                tagElement.textContent = tag;
                tagElement.addEventListener('click', () => toggleTag(tag));
                tagsContainer.appendChild(tagElement);
            });
            showMoreBtn.remove();
        });
        tagsContainer.appendChild(showMoreBtn);
    }
}

// Toggle tag selection with performance optimization
function toggleTag(tag) {
    if (selectedTags.has(tag)) {
        selectedTags.delete(tag);
        showToast(`Removed filter: ${tag}`, 'info');
    } else {
        selectedTags.add(tag);
        showToast(`Added filter: ${tag}`, 'success');
    }
    renderTags();
    filterGames();
}

// Load games with improved error handling and caching
async function loadGames() {
    try {
        // Removed localStorage caching for gamesCache and gamesCacheTimestamp
        // Always fetch fresh data
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
        games = pages.flat();
        // Add normalizedTitle to all games
        games.forEach(game => {
            if (!game.normalizedTitle) {
                game.normalizedTitle = game.title.replace(/ - FitGirl Repacks$/i, '').toLowerCase();
            }
        });
        
        if (games.length === 0) {
            createSampleData();
        }
        
        filteredGames = [...games];
        initializeFuse();
        extractTags();
        renderGames();
        updateStats();
    } catch (error) {
        console.error('Error loading games:', error);
        createSampleData();
    }
}

// Create sample data with optimized generation
function createSampleData() {
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
    filteredGames = [...games];
    initializeFuse();
    extractTags();
    renderGames();
    updateStats();
}

// Set grid size with performance optimization
function setGridSize(size) {
    gridSize = size;
    if (gamesGrid) {
        gamesGrid.className = `grid gap-4 grid-${size}`;
    }
    // Update button states efficiently, with null checks
    [gridSmall, gridMedium, gridLarge].forEach((btn, idx) => {
        if (btn) {
            btn.classList.remove('bg-retro-pink', 'border-retro-orange');
            btn.classList.add('bg-retro-cyan', 'border-retro-cyan');
        } else {
            const names = ['gridSmall', 'gridMedium', 'gridLarge'];
            console.debug(`DEBUG: ${names[idx]} not found in DOM`);
        }
    });
    let activeButton = null;
    if (size === 'small' && gridSmall) activeButton = gridSmall;
    else if (size === 'medium' && gridMedium) activeButton = gridMedium;
    else if (size === 'large' && gridLarge) activeButton = gridLarge;
    if (activeButton) {
        activeButton.classList.remove('bg-retro-cyan', 'border-retro-cyan');
        activeButton.classList.add('bg-retro-pink', 'border-retro-orange');
    } else {
        console.debug(`DEBUG: active grid size button for '${size}' not found in DOM`);
    }
    showToast(`Grid size changed to ${size}`, 'info');
}

// Render games with virtual scrolling and optimized rendering
function renderGames() {
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
                currentPage++;
                observer.disconnect();
                renderGames();
            }
        }, { threshold: 0.1 });
        
        observer.observe(sentinel);
    }
}

// Create game card with optimized image loading and UX enhancements
function createGameCard(game, index) {
    const gameCard = document.createElement('div');
    gameCard.className = 'retro-card rounded-none overflow-hidden cursor-pointer portrait-card group';
    
    let imageUrl = game.image && typeof game.image === 'string' && game.image.trim() ? game.image : 'image.png';
    const optimizedImageUrl = optimizeImageUrl(imageUrl);
    const isFavorite = favoriteGames.includes(game.title);
    
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
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            
            <!-- Favorite button -->
            <button class="favorite-btn absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-black/70 z-10">
                <span class="text-lg ${isFavorite ? 'text-red-500' : 'text-white'}">${isFavorite ? '❤️' : '🤍'}</span>
            </button>
            
            <!-- Size info -->
            <div class="absolute bottom-0 left-0 right-0 p-2">
                <div class="text-xs text-retro-cyan font-pixel">
                    ${game.metadata?.originalSize || 'N/A'} → ${game.metadata?.repackSize || 'N/A'}
                </div>
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

// Create modal content with optimized image loading and enhanced UX
function createModalContent(game) {
    let imageUrl = game.image && typeof game.image === 'string' && game.image.trim() ? game.image : 'image.png';
    const optimizedImageUrl = optimizeImageUrl(imageUrl, 400, 300);
    const isFavorite = favoriteGames.includes(game.title);
    
    return `
        <div class="bg-retro-darker p-6 space-y-6">
            <div class="border-b-2 border-retro-cyan pb-4 flex justify-between items-start">
                <h2 class="text-2xl font-black retro-text text-retro-cyan mb-2 flex-1">
                    ${game.title.replace(' - FitGirl Repacks', '')}
                </h2>
                <div class="flex gap-2">
                    <button class="retro-button px-3 py-1 text-xs font-pixel modal-favorite-btn">
                        ${isFavorite ? '❤️' : '🤍'} ${isFavorite ? 'UNFAVORITE' : 'FAVORITE'}
                    </button>
                    <button class="retro-close px-4 py-2 font-pixel text-sm modal-close">✕ CLOSE</button>
                </div>
            </div>
            
            <img 
                src="${optimizedImageUrl}" 
                alt="${game.title}" 
                class="w-full max-w-md mx-auto rounded-none border-2 border-retro-cyan"
                loading="eager"
                decoding="async"
                onerror="this.onerror=null;this.src='image.png';"
            />
            
            <div class="space-y-4">
                <div>
                    <h3 class="text-retro-pink font-pixel text-sm mb-2">// TAGS</h3>
                    <div class="flex flex-wrap gap-2">
                        ${game.tags?.map(tag => 
                            `<span class="tag-chip px-2 py-1 text-xs font-pixel">${tag}</span>`
                        ).join('') || ''}
                    </div>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="retro-card p-4 rounded-none">
                        <div class="text-retro-cyan font-pixel text-sm mb-1">ORIGINAL SIZE</div>
                        <div class="text-white font-pixel text-xs">${game.metadata?.originalSize || 'N/A'}</div>
                    </div>
                    <div class="retro-card p-4 rounded-none">
                        <div class="text-retro-cyan font-pixel text-sm mb-1">REPACK SIZE</div>
                        <div class="text-white font-pixel text-xs">${game.metadata?.repackSize || 'N/A'}</div>
                    </div>
                    <div class="retro-card p-4 rounded-none">
                        <div class="text-retro-cyan font-pixel text-sm mb-1">LANGUAGES</div>
                        <div class="text-white font-pixel text-xs">${game.metadata?.languages || 'N/A'}</div>
                    </div>
                    <div class="retro-card p-4 rounded-none">
                        <div class="text-retro-cyan font-pixel text-sm mb-1">COMPANIES</div>
                        <div class="text-white font-pixel text-xs">${game.metadata?.companies || 'N/A'}</div>
                    </div>
                </div>
                
                <div class="retro-card p-4 rounded-none">
                    <h3 class="text-retro-green font-pixel text-sm mb-3">// REPACK FEATURES</h3>
                    <ul class="space-y-2">
                        ${game.repackFeatures?.map(feature => 
                            `<li class="flex items-start gap-2 text-xs font-pixel">
                                <span class="text-retro-green">▶</span>
                                <span class="text-white">${feature}</span>
                            </li>`
                        ).join('') || '<li class="text-xs font-pixel">No features listed</li>'}
                    </ul>
                </div>
                
                <div class="flex gap-4">
                    <a 
                        href="${game.url}" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        class="retro-button flex-1 text-center py-4 px-6 font-pixel text-sm"
                    >
                        >>> DOWNLOAD GAME <<<
                    </a>
                    <button 
                        onclick="shareGame('${game.title}', '${game.url}')"
                        class="retro-button px-6 py-4 font-pixel text-sm"
                    >
                        📤 SHARE
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Share game function
function shareGame(title, url) {
    if (navigator.share) {
        navigator.share({
            title: title,
            url: url
        }).catch(console.error);
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(`${title}: ${url}`).then(() => {
            showToast('Link copied to clipboard!', 'success');
        }).catch(() => {
            showToast('Failed to copy link', 'error');
        });
    }
}

// Open modal with performance optimization
function openModal(game) {
    const content = createModalContent(game);
    
    if (isMobile || window.innerWidth < 768) {
        mobileContent.innerHTML = content;
        mobileModal.classList.remove('hidden');
    } else {
        modalContent.innerHTML = content;
        modal.classList.remove('hidden');
    }
    
    document.body.classList.add('overflow-hidden');
    
    // Add close button listeners efficiently
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    // Add favorite button listener in modal
    const modalFavBtn = (isMobile || window.innerWidth < 768)
        ? mobileContent.querySelector('.modal-favorite-btn')
        : modalContent.querySelector('.modal-favorite-btn');
    if (modalFavBtn) {
        modalFavBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(game);
        });
    }
}

// Close modal
function closeModal() {
    modal.classList.add('hidden');
    mobileModal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
}

// Update stats with performance optimization
function updateStats() {
    const totalGames = games.length;
    const filteredCount = filteredGames.length;
    const showingCount = Math.min(filteredCount, (currentPage + 1) * ITEMS_PER_PAGE);
    stats.textContent = `// SHOWING ${showingCount} OF ${filteredCount} GAMES (${totalGames} TOTAL)`;
}

// Filter games with optimized search and enhanced UX
function filterGames() {
    currentPage = 0;
    let query = searchInput.value.trim();
    // Preprocess query: remove 'fit girl repacks' for better matching, but only if not from suggestion click
    if (!isSuggestionClick) {
        query = query.replace(/fit\s*girl\s*repacks/gi, '').trim();
    }
    let baseGames = [...games];
    
    // Filter by selected tags
    if (selectedTags.size > 0) {
        baseGames = baseGames.filter(game => 
            game.tags && game.tags.some(tag => selectedTags.has(tag))
        );
    }
    
    // If suggestion was clicked, try exact match first
    if (isSuggestionClick && query) {
        const exactMatch = baseGames.find(game => game.title.toLowerCase() === query.toLowerCase());
        if (exactMatch) {
            filteredGames = [exactMatch];
            renderGames();
            updateStats();
            isSuggestionClick = false;
            // Show results feedback
            if (searchInput.value.trim() && filteredGames.length === 0) {
                showToast('No games found. Try different keywords or tags.', 'info');
            } else if (searchInput.value.trim() && filteredGames.length > 0) {
                showToast(`Found ${filteredGames.length} games`, 'success');
            }
            return;
        }
    }
    // Filter by search query with improved performance
    if (query) {
        const searchFuse = new Fuse(baseGames, {
            keys: ['title', 'normalizedTitle', 'tags', 'metadata.companies', 'description'],
            threshold: 0.3,
            minMatchCharLength: 2,
            useExtendedSearch: true
        });
        const results = searchFuse.search(query);
        filteredGames = results.map(result => result.item);
        
        // Add to recent searches
        addToRecentSearches(searchInput.value.trim());
    } else {
        filteredGames = baseGames;
    }
    
    renderGames();
    updateStats();
    
    // Show results feedback
    if (searchInput.value.trim() && filteredGames.length === 0) {
        showToast('No games found. Try different keywords or tags.', 'info');
    } else if (searchInput.value.trim() && filteredGames.length > 0) {
        showToast(`Found ${filteredGames.length} games`, 'success');
    }
    // Reset the suggestion click flag
    isSuggestionClick = false;
}

document.addEventListener('DOMContentLoaded', function() {
    // Modal menu logic
    const menuButton = document.getElementById('menuButton');
    const menuModal = document.getElementById('menuModal');
    const closeMenuModal = document.getElementById('closeMenuModal');

    if (!menuButton) console.error('DEBUG: #menuButton not found in DOM');
    if (!menuModal) console.error('DEBUG: #menuModal not found in DOM');
    if (!closeMenuModal) console.error('DEBUG: #closeMenuModal not found in DOM');

    if (menuButton && menuModal && closeMenuModal) {
        menuButton.addEventListener('click', () => {
            menuModal.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
        });
        closeMenuModal.addEventListener('click', () => {
            menuModal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        });
        // Close modal when clicking outside the menu card
        menuModal.addEventListener('click', (e) => {
            if (e.target === menuModal) {
                menuModal.classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
            }
        });
        // Keyboard: Escape closes modal
        document.addEventListener('keydown', (e) => {
            if (!menuModal.classList.contains('hidden') && e.key === 'Escape') {
                menuModal.classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
            }
        });
    }

    // Add event listeners for quick action buttons
    if (typeof showFavoritesBtn !== 'undefined' && showFavoritesBtn) {
        showFavoritesBtn.addEventListener('click', () => {
            filteredGames = games.filter(game => favoriteGames.includes(game.title));
            currentPage = 0;
            renderGames();
            updateStats();
            showToast(`Showing ${filteredGames.length} favorite games`, 'info');
        });
    } else {
        console.warn('DEBUG: #showFavorites not found in DOM');
    }
    if (typeof showRecentBtn !== 'undefined' && showRecentBtn) {
        showRecentBtn.addEventListener('click', () => {
            if (recentSearches.length === 0) {
                showToast('No recent searches', 'info');
                return;
            }
            let dropdown = document.getElementById('recentSearchDropdown');
            if (!dropdown) {
                dropdown = document.createElement('div');
                dropdown.id = 'recentSearchDropdown';
                dropdown.className = 'absolute left-1/2 transform -translate-x-1/2 mt-2 bg-retro-darker border-2 border-retro-cyan rounded-none z-50 max-h-64 overflow-y-auto shadow-lg';
                dropdown.style.minWidth = '200px';
                document.body.appendChild(dropdown);
            }
            dropdown.innerHTML = '';
            recentSearches.forEach(search => {
                const item = document.createElement('div');
                item.className = 'px-4 py-3 hover:bg-retro-cyan/20 cursor-pointer text-white font-pixel text-sm';
                item.textContent = search;
                item.addEventListener('click', () => {
                    searchInput.value = search;
                    isSuggestionClick = true;
                    filterGames();
                    dropdown.classList.add('hidden');
                });
                dropdown.appendChild(item);
            });
            const rect = showRecentBtn.getBoundingClientRect();
            dropdown.style.position = 'absolute';
            dropdown.style.top = `${rect.bottom + window.scrollY + 4}px`;
            dropdown.style.left = `${rect.left + window.scrollX}px`;
            dropdown.style.display = 'block';
            dropdown.classList.remove('hidden');
            function hideDropdown(e) {
                if (!dropdown.contains(e.target) && e.target !== showRecentBtn) {
                    dropdown.classList.add('hidden');
                    document.removeEventListener('mousedown', hideDropdown);
                }
            }
            document.addEventListener('mousedown', hideDropdown);
        });
    } else {
        console.warn('DEBUG: #showRecent not found in DOM');
    }
    if (typeof clearFiltersBtn !== 'undefined' && clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
            searchInput.value = '';
            selectedTags.clear();
            renderTags();
            filterGames();
            showToast('Cleared all filters', 'info');
        });
    } else {
        console.warn('DEBUG: #clearFilters not found in DOM');
    }

    // Enhanced search input handling
    if (typeof searchInput !== 'undefined' && searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            const query = e.target.value.trim();
            if (query.length >= 2) {
                showSearchSuggestions(query);
            } else {
                hideSearchSuggestions();
            }
            filterGames();
        }, 300));

        searchInput.addEventListener('focus', () => {
            if (searchInput.value.trim().length >= 2) {
                showSearchSuggestions(searchInput.value.trim());
            }
        });

        searchInput.addEventListener('blur', () => {
            setTimeout(hideSearchSuggestions, 200);
        });
    } else {
        console.warn('DEBUG: #searchInput not found in DOM');
    }

    // Grid size controls
    if (typeof gridSmall !== 'undefined' && gridSmall) gridSmall.addEventListener('click', () => setGridSize('small'));
    else console.warn('DEBUG: #gridSmall not found in DOM');
    if (typeof gridMedium !== 'undefined' && gridMedium) gridMedium.addEventListener('click', () => setGridSize('medium'));
    else console.warn('DEBUG: #gridMedium not found in DOM');
    if (typeof gridLarge !== 'undefined' && gridLarge) gridLarge.addEventListener('click', () => setGridSize('large'));
    else console.warn('DEBUG: #gridLarge not found in DOM');

    // Mobile modal close
    if (typeof mobileBack !== 'undefined' && mobileBack) mobileBack.addEventListener('click', closeModal);
    else console.warn('DEBUG: #mobileBack not found in DOM');
    if (typeof mobileClose !== 'undefined' && mobileClose) mobileClose.addEventListener('click', closeModal);
    else console.warn('DEBUG: #mobileClose not found in DOM');
    if (typeof modal !== 'undefined' && modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    } else {
        console.warn('DEBUG: #gameModal not found in DOM');
    }
    if (typeof mobileModal !== 'undefined' && mobileModal) {
        mobileModal.addEventListener('click', (e) => {
            if (e.target === mobileModal) closeModal();
        });
    } else {
        console.warn('DEBUG: #mobileModal not found in DOM');
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    setGridSize('medium');
    loadGames();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    imageObserver.disconnect();
    imageCache.clear();
    tagCache.clear();
}); 