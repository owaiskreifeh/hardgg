// state.js
export let games = [];
export let filteredGames = [];
export let fuse;
export let currentPage = 0;
export let selectedTags = new Set();
export let allTags = new Set();
export let gridSize = 'medium';
export const ITEMS_PER_PAGE = 20;
export const isMobile = window.innerWidth < 768;

export const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
export const favoriteGames = JSON.parse(localStorage.getItem('favoriteGames') || '[]');
export const searchHistory = new Set();
export let searchSuggestions = [];
export let isSuggestionClick = false;

export function saveRecentSearches() {
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
}
export function saveFavoriteGames() {
    localStorage.setItem('favoriteGames', JSON.stringify(favoriteGames));
}

export function updateGridSize(size) {
    gridSize = size;
}

export function setCurrentPage(page) {
    currentPage = page;
}

export function incrementCurrentPage() {
    currentPage++;
}

export function resetCurrentPage() {
    currentPage = 0;
} 