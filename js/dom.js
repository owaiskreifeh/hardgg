// dom.js
// DOM element getters - these will be called after DOM is loaded
export function getLoading() { return document.getElementById('loading'); }
export function getStats() { return document.getElementById('stats'); }
export function getSearchInput() { return document.getElementById('searchInput'); }
export function getGamesGrid() { return document.getElementById('gamesGrid'); }
export function getTagsContainer() { return document.getElementById('tagsContainer'); }
export function getModal() { return document.getElementById('gameModal'); }
export function getMobileModal() { return document.getElementById('mobileModal'); }
export function getModalContent() { return document.getElementById('modalContent'); }
export function getMobileContent() { return document.getElementById('mobileContent'); }
export function getMobileBack() { return document.getElementById('mobileBack'); }
export function getMobileClose() { return document.getElementById('mobileClose'); }
export function getGridSmall() { return document.getElementById('gridSmall'); }
export function getGridMedium() { return document.getElementById('gridMedium'); }
export function getGridLarge() { return document.getElementById('gridLarge'); }
export function getShowFavoritesBtn() { return document.getElementById('showFavorites'); }
export function getShowRecentBtn() { return document.getElementById('showRecent'); }
export function getClearFiltersBtn() { return document.getElementById('clearFilters'); }
export function getMenuButton() { return document.getElementById('menuButton'); }
export function getMenuModal() { return document.getElementById('menuModal'); }
export function getCloseMenuModal() { return document.getElementById('closeMenuModal'); }
export function getMenuAbout() { return document.getElementById('menuAbout'); }
export function getMenuSettings() { return document.getElementById('menuSettings'); }
export function getMenuFavorites() { return document.getElementById('menuFavorites'); }
export function getMenuRecent() { return document.getElementById('menuRecent'); }
export function getMenuHelp() { return document.getElementById('menuHelp'); }
export function getMenuContact() { return document.getElementById('menuContact'); }

// For backward compatibility, we'll create these after DOM loads
let loading, stats, searchInput, gamesGrid, tagsContainer, modal, mobileModal, 
    modalContent, mobileContent, mobileBack, mobileClose, gridSmall, gridMedium, 
    gridLarge, showFavoritesBtn, showRecentBtn, clearFiltersBtn, menuButton, 
    menuModal, closeMenuModal, menuAbout, menuSettings, menuFavorites, menuRecent, 
    menuHelp, menuContact;

export function initializeDOMElements() {
    loading = getLoading();
    stats = getStats();
    searchInput = getSearchInput();
    gamesGrid = getGamesGrid();
    tagsContainer = getTagsContainer();
    modal = getModal();
    mobileModal = getMobileModal();
    modalContent = getModalContent();
    mobileContent = getMobileContent();
    mobileBack = getMobileBack();
    mobileClose = getMobileClose();
    gridSmall = getGridSmall();
    gridMedium = getGridMedium();
    gridLarge = getGridLarge();
    showFavoritesBtn = getShowFavoritesBtn();
    showRecentBtn = getShowRecentBtn();
    clearFiltersBtn = getClearFiltersBtn();
    menuButton = getMenuButton();
    menuModal = getMenuModal();
    closeMenuModal = getCloseMenuModal();
    menuAbout = getMenuAbout();
    menuSettings = getMenuSettings();
    menuFavorites = getMenuFavorites();
    menuRecent = getMenuRecent();
    menuHelp = getMenuHelp();
    menuContact = getMenuContact();
    
    // Debug DOM elements
    console.log('🔍 DOM Elements Check:');
    console.log('loading:', loading);
    console.log('gamesGrid:', gamesGrid);
    console.log('stats:', stats);
    console.log('searchInput:', searchInput);
    console.log('tagsContainer:', tagsContainer);
}

// Export the elements for use in other modules
export { loading, stats, searchInput, gamesGrid, tagsContainer, modal, mobileModal, 
         modalContent, mobileContent, mobileBack, mobileClose, gridSmall, gridMedium, 
         gridLarge, showFavoritesBtn, showRecentBtn, clearFiltersBtn, menuButton, 
         menuModal, closeMenuModal, menuAbout, menuSettings, menuFavorites, menuRecent, 
         menuHelp, menuContact }; 