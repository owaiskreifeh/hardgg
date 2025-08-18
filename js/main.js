// main.js
import { loadGames } from './games.js';
import { setupQuickActions, setupSearchInput } from './search.js';
import { setupMenuModal, setupGridControls, setupModalControls, setupKeyboardShortcuts } from './menu.js';
import { setGridSize } from './ui.js';
import { initializeDOMElements } from './dom.js';
import { initializeModalListeners } from './modal.js';

// Main initialization function
export function initializeApp() {
    console.log('🚀 Initializing app...');
    
    try {
        // Initialize DOM elements first
        console.log('🏗️ Initializing DOM elements...');
        initializeDOMElements();
        
        // Setup all event listeners
        console.log('📝 Setting up event listeners...');
        setupQuickActions();
        setupSearchInput();
        setupMenuModal();
        setupGridControls();
        setupModalControls();
        setupKeyboardShortcuts();
        initializeModalListeners();
        
        // Set initial grid size
        console.log('🎛️ Setting grid size...');
        setGridSize('medium');
        
        // Load games data
        console.log('🎮 Loading games...');
        loadGames();
        
        console.log('✅ App initialization complete!');
    } catch (error) {
        console.error('❌ Error during app initialization:', error);
    }
}

// Cleanup function for page unload
export function cleanup() {
    // Disconnect any observers
    if (window.imageObserver) {
        window.imageObserver.disconnect();
    }
    
    // Clear caches
    if (window.imageCache) {
        window.imageCache.clear();
    }
    
    if (window.tagCache) {
        window.tagCache.clear();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM loaded, starting app...');
    
    // Ensure all modals are hidden by default
    const modals = document.querySelectorAll('.gaming-modal');
    modals.forEach(modal => {
        if (!modal.classList.contains('hidden')) {
            console.log('🔍 Found modal that is not hidden:', modal.id);
            modal.classList.add('hidden');
        }
    });
    
    initializeApp();
});

// Cleanup on page unload
window.addEventListener('beforeunload', cleanup); 