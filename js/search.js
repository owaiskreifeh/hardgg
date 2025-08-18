// search.js
import { games, allTags, recentSearches, searchSuggestions, saveRecentSearches, filteredGames, currentPage, selectedTags, favoriteGames, resetCurrentPage } from './state.js';
import { searchInput, showFavoritesBtn, showRecentBtn, clearFiltersBtn } from './dom.js';
import { renderGames, updateStats } from './games.js';
import { renderTags } from './tags.js';
import { showToast } from './ui.js';
import { debounce } from './utils.js';

let isSuggestionClick = false;

export function createSearchSuggestions() {
    let suggestionsContainer = document.getElementById('searchSuggestions');
    if (!suggestionsContainer) {
        suggestionsContainer = document.createElement('div');
        suggestionsContainer.id = 'searchSuggestions';
        suggestionsContainer.className = 'absolute top-full left-0 right-0 bg-retro-darker border-2 border-retro-cyan rounded-none z-50 max-h-64 overflow-y-auto hidden';
        searchInput.parentNode.appendChild(suggestionsContainer);
    }
    return suggestionsContainer;
}

export function generateSearchSuggestions(query) {
    if (!query || query.length < 2) {
        return [];
    }
    const suggestions = [];
    recentSearches.forEach(search => {
        if (search.toLowerCase().includes(query.toLowerCase()) && !suggestions.includes(search)) {
            suggestions.push({ text: search, type: 'recent' });
        }
    });
    const popularTags = Array.from(allTags).filter(tag => 
        tag.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
    popularTags.forEach(tag => {
        if (!suggestions.some(s => s.text === tag)) {
            suggestions.push({ text: tag, type: 'tag' });
        }
    });
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

export function showSearchSuggestions(query) {
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
            case 'recent': icon.textContent = '🕒'; break;
            case 'tag': icon.textContent = '🏷️'; break;
            case 'game': icon.textContent = '🎮'; break;
        }
        const text = document.createElement('span');
        text.className = 'text-white font-pixel text-sm';
        text.textContent = suggestion.text;
        item.appendChild(icon);
        item.appendChild(text);
        item.addEventListener('click', () => {
            searchInput.value = suggestion.text;
            suggestionsContainer.classList.add('hidden');
            isSuggestionClick = true;
            filterGames();
            addToRecentSearches(suggestion.text);
        });
        suggestionsContainer.appendChild(item);
    });
    suggestionsContainer.classList.remove('hidden');
}

export function hideSearchSuggestions() {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (suggestionsContainer) {
        suggestionsContainer.classList.add('hidden');
    }
}

export function addToRecentSearches(search) {
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
    saveRecentSearches();
} 

export function filterGames() {
    resetCurrentPage();
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
            filteredGames.length = 0;
            filteredGames.push(exactMatch);
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
        filteredGames.length = 0;
        filteredGames.push(...results.map(result => result.item));
        
        // Add to recent searches
        addToRecentSearches(searchInput.value.trim());
    } else {
        filteredGames.length = 0;
        filteredGames.push(...baseGames);
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

// Quick action button handlers
export function setupQuickActions() {
    // Show favorites button
    if (showFavoritesBtn) {
        showFavoritesBtn.addEventListener('click', () => {
            filteredGames.length = 0;
            filteredGames.push(...games.filter(game => favoriteGames.includes(game.title)));
            resetCurrentPage();
            renderGames();
            updateStats();
            showToast(`Showing ${filteredGames.length} favorite games`, 'info');
        });
    }
    
    // Show recent searches button
    if (showRecentBtn) {
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
    }
    
    // Clear filters button
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
            searchInput.value = '';
            selectedTags.clear();
            renderTags();
            filterGames();
            showToast('Cleared all filters', 'info');
        });
    }
}

// Setup search input event listeners
export function setupSearchInput() {
    if (searchInput) {
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
    }
} 