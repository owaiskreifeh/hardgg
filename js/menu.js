// menu.js
import { menuButton, menuModal, closeMenuModal, menuAbout, menuSettings, menuFavorites, menuRecent, menuHelp, menuContact, gridSmall, gridMedium, gridLarge, mobileBack, mobileClose, modal, mobileModal } from './dom.js';
import { setGridSize } from './ui.js';
import { closeModal } from './modal.js';
import { showToast } from './ui.js';

export function setupMenuModal() {
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
        
        // Setup menu button event listeners
        setupMenuButtons();
    }
}

function setupMenuButtons() {
    // About button
    if (menuAbout) {
        menuAbout.addEventListener('click', () => {
            showAboutPage();
            menuModal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        });
    }
    
    // Settings button
    if (menuSettings) {
        menuSettings.addEventListener('click', () => {
            showSettingsPage();
            menuModal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        });
    }
    
    // Favorites button
    if (menuFavorites) {
        menuFavorites.addEventListener('click', () => {
            showFavoritesPage();
            menuModal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        });
    }
    
    // Recent button
    if (menuRecent) {
        menuRecent.addEventListener('click', () => {
            showRecentPage();
            menuModal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        });
    }
    
    // Help button
    if (menuHelp) {
        menuHelp.addEventListener('click', () => {
            showHelpPage();
            menuModal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        });
    }
    
    // Contact button
    if (menuContact) {
        menuContact.addEventListener('click', () => {
            showContactPage();
            menuModal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        });
    }
}

// Page functions
function showAboutPage() {
    const content = `
        <div class="gaming-modal-header">
            <h2 class="gaming-font-bold text-xl text-primary">About</h2>
            <button class="gaming-modal-close" onclick="closePageModal()">✕</button>
        </div>
        <div class="gaming-modal-body">
            <div class="space-y-6">
                <div>
                    <h3 class="text-secondary gaming-font text-lg mb-4">Modern Gaming Hub</h3>
                    <p class="text-white mb-4">
                        A next-generation gaming platform designed to provide gamers with an immersive and intuitive experience. 
                        Built with modern web technologies and a focus on performance and accessibility.
                    </p>
                    <p class="text-white mb-4">
                        Features include advanced search capabilities, tag-based filtering, favorites system, and responsive design 
                        that works seamlessly across all devices.
                    </p>
                </div>
                <div>
                    <h4 class="text-primary gaming-font text-sm mb-3">// TECHNOLOGIES</h4>
                    <div class="flex flex-wrap gap-2">
                        <span class="gaming-tag">JavaScript ES6+</span>
                        <span class="gaming-tag">CSS3</span>
                        <span class="gaming-tag">HTML5</span>
                        <span class="gaming-tag">Progressive Web App</span>
                        <span class="gaming-tag">Responsive Design</span>
                    </div>
                </div>
                <div>
                    <h4 class="text-primary gaming-font text-sm mb-3">// VERSION</h4>
                    <p class="text-white">v1.0.0 - Modern Gaming Experience</p>
                </div>
            </div>
        </div>
    `;
    showPageModal(content);
}

function showSettingsPage() {
    const content = `
        <div class="gaming-modal-header">
            <h2 class="gaming-font-bold text-xl text-primary">Settings</h2>
            <button class="gaming-modal-close" onclick="closePageModal()">✕</button>
        </div>
        <div class="gaming-modal-body">
            <div class="space-y-6">
                <div>
                    <h3 class="text-secondary gaming-font text-lg mb-4">Display Settings</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="text-white gaming-font text-sm">Default Grid Size:</label>
                            <div class="flex gap-2 mt-2">
                                <button class="gaming-button-secondary px-3 py-1 text-xs">Small</button>
                                <button class="gaming-button px-3 py-1 text-xs">Medium</button>
                                <button class="gaming-button-secondary px-3 py-1 text-xs">Large</button>
                            </div>
                        </div>
                        <div>
                            <label class="text-white gaming-font text-sm">Theme:</label>
                            <div class="flex gap-2 mt-2">
                                <button class="gaming-button px-3 py-1 text-xs">Dark</button>
                                <button class="gaming-button-secondary px-3 py-1 text-xs">Light</button>
                                <button class="gaming-button-secondary px-3 py-1 text-xs">Auto</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 class="text-secondary gaming-font text-lg mb-4">Search Settings</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="text-white gaming-font text-sm">Search Suggestions:</label>
                            <div class="flex gap-2 mt-2">
                                <button class="gaming-button px-3 py-1 text-xs">Enabled</button>
                                <button class="gaming-button-secondary px-3 py-1 text-xs">Disabled</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    showPageModal(content);
}

function showFavoritesPage() {
    const content = `
        <div class="gaming-modal-header">
            <h2 class="gaming-font-bold text-xl text-primary">Favorites</h2>
            <button class="gaming-modal-close" onclick="closePageModal()">✕</button>
        </div>
        <div class="gaming-modal-body">
            <div class="space-y-6">
                <div>
                    <h3 class="text-secondary gaming-font text-lg mb-4">Your Favorite Games</h3>
                    <p class="text-white mb-4">
                        Manage your favorite games collection. Games you've marked as favorites will appear here.
                    </p>
                    <div class="text-center py-8">
                        <div class="text-6xl mb-4">❤️</div>
                        <p class="text-muted gaming-font">No favorites yet</p>
                        <p class="text-muted text-sm">Start browsing games and add them to your favorites!</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    showPageModal(content);
}

function showRecentPage() {
    const content = `
        <div class="gaming-modal-header">
            <h2 class="gaming-font-bold text-xl text-primary">Recent Searches</h2>
            <button class="gaming-modal-close" onclick="closePageModal()">✕</button>
        </div>
        <div class="gaming-modal-body">
            <div class="space-y-6">
                <div>
                    <h3 class="text-secondary gaming-font text-lg mb-4">Recent Activity</h3>
                    <p class="text-white mb-4">
                        Your recent search history and viewed games.
                    </p>
                    <div class="text-center py-8">
                        <div class="text-6xl mb-4">🕒</div>
                        <p class="text-muted gaming-font">No recent activity</p>
                        <p class="text-muted text-sm">Start searching for games to see your history here!</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    showPageModal(content);
}

function showHelpPage() {
    const content = `
        <div class="gaming-modal-header">
            <h2 class="gaming-font-bold text-xl text-primary">Help & Support</h2>
            <button class="gaming-modal-close" onclick="closePageModal()">✕</button>
        </div>
        <div class="gaming-modal-body">
            <div class="space-y-6">
                <div>
                    <h3 class="text-secondary gaming-font text-lg mb-4">Getting Started</h3>
                    <div class="space-y-4">
                        <div>
                            <h4 class="text-primary gaming-font text-sm mb-2">// SEARCHING GAMES</h4>
                            <p class="text-white text-sm">Use the search bar to find games by title, tags, or description. Search suggestions will appear as you type.</p>
                        </div>
                        <div>
                            <h4 class="text-primary gaming-font text-sm mb-2">// FILTERING BY TAGS</h4>
                            <p class="text-white text-sm">Click on tags below the search bar to filter games by genre, platform, or other categories.</p>
                        </div>
                        <div>
                            <h4 class="text-primary gaming-font text-sm mb-2">// GRID CONTROLS</h4>
                            <p class="text-white text-sm">Use the S, M, L buttons to change the grid size and view more or fewer games at once.</p>
                        </div>
                        <div>
                            <h4 class="text-primary gaming-font text-sm mb-2">// FAVORITES</h4>
                            <p class="text-white text-sm">Click the heart icon on any game card to add it to your favorites. Access favorites from the menu.</p>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 class="text-secondary gaming-font text-lg mb-4">Keyboard Shortcuts</h3>
                    <div class="space-y-2">
                        <div class="flex justify-between">
                            <span class="text-white text-sm">Escape</span>
                            <span class="text-muted text-sm">Close modals</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-white text-sm">Ctrl/Cmd + K</span>
                            <span class="text-muted text-sm">Focus search</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    showPageModal(content);
}

function showContactPage() {
    const content = `
        <div class="gaming-modal-header">
            <h2 class="gaming-font-bold text-xl text-primary">Contact</h2>
            <button class="gaming-modal-close" onclick="closePageModal()">✕</button>
        </div>
        <div class="gaming-modal-body">
            <div class="space-y-6">
                <div>
                    <h3 class="text-secondary gaming-font text-lg mb-4">Get in Touch</h3>
                    <p class="text-white mb-4">
                        Have questions, suggestions, or need support? We'd love to hear from you!
                    </p>
                    <div class="space-y-4">
                        <div>
                            <h4 class="text-primary gaming-font text-sm mb-2">// EMAIL</h4>
                            <p class="text-white text-sm">support@moderngaminghub.com</p>
                        </div>
                        <div>
                            <h4 class="text-primary gaming-font text-sm mb-2">// GITHUB</h4>
                            <p class="text-white text-sm">github.com/modern-gaming-hub</p>
                        </div>
                        <div>
                            <h4 class="text-primary gaming-font text-sm mb-2">// DISCORD</h4>
                            <p class="text-white text-sm">discord.gg/modern-gaming-hub</p>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 class="text-secondary gaming-font text-lg mb-4">Report Issues</h3>
                    <p class="text-white text-sm">
                        Found a bug or have a feature request? Please include as much detail as possible 
                        including your browser, operating system, and steps to reproduce.
                    </p>
                </div>
            </div>
        </div>
    `;
    showPageModal(content);
}

function showPageModal(content) {
    // Create page modal if it doesn't exist
    let pageModal = document.getElementById('pageModal');
    if (!pageModal) {
        pageModal = document.createElement('div');
        pageModal.id = 'pageModal';
        pageModal.className = 'gaming-modal';
        pageModal.innerHTML = `
            <div class="gaming-modal-content max-w-2xl w-full">
                <div id="pageModalContent"></div>
            </div>
        `;
        document.body.appendChild(pageModal);
        
        // Add close functionality
        pageModal.addEventListener('click', (e) => {
            if (e.target === pageModal) {
                closePageModal();
            }
        });
        
        // Add escape key functionality
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !pageModal.classList.contains('hidden')) {
                closePageModal();
            }
        });
    }
    
    // Show modal with content
    document.getElementById('pageModalContent').innerHTML = content;
    pageModal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    
    // Make closePageModal function globally available
    window.closePageModal = closePageModal;
}

function closePageModal() {
    const pageModal = document.getElementById('pageModal');
    if (pageModal) {
        pageModal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    }
}

export function setupGridControls() {
    // Grid size controls
    if (gridSmall) gridSmall.addEventListener('click', () => setGridSize('small'));
    if (gridMedium) gridMedium.addEventListener('click', () => setGridSize('medium'));
    if (gridLarge) gridLarge.addEventListener('click', () => setGridSize('large'));
}

export function setupModalControls() {
    // Mobile modal close
    if (mobileBack) mobileBack.addEventListener('click', closeModal);
    if (mobileClose) mobileClose.addEventListener('click', closeModal);
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
    
    if (mobileModal) {
        mobileModal.addEventListener('click', (e) => {
            if (e.target === mobileModal) closeModal();
        });
    }
    
    // Keyboard: Escape closes modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

// Keyboard shortcuts functionality
export function setupKeyboardShortcuts() {
    const keyboardHelp = document.getElementById('keyboardHelp');
    const closeKeyboardHelp = document.getElementById('closeKeyboardHelp');
    
    // Setup keyboard help modal
    if (keyboardHelp && closeKeyboardHelp) {
        // Close button functionality
        closeKeyboardHelp.addEventListener('click', () => {
            keyboardHelp.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        });
        
        // Close when clicking outside
        keyboardHelp.addEventListener('click', (e) => {
            if (e.target === keyboardHelp) {
                keyboardHelp.classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
            }
        });
        
        // Escape key closes keyboard help
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !keyboardHelp.classList.contains('hidden')) {
                keyboardHelp.classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
            }
        });
    }
    
    // Global keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Don't trigger shortcuts when typing in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        switch (e.key) {
            case '/':
                e.preventDefault();
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.focus();
                }
                break;
                
            case '?':
                e.preventDefault();
                if (keyboardHelp) {
                    keyboardHelp.classList.remove('hidden');
                    document.body.classList.add('overflow-hidden');
                }
                break;
                
            case 'f':
            case 'F':
                e.preventDefault();
                const showFavoritesBtn = document.getElementById('showFavorites');
                if (showFavoritesBtn) {
                    showFavoritesBtn.click();
                }
                break;
                
            case 'r':
            case 'R':
                e.preventDefault();
                const showRecentBtn = document.getElementById('showRecent');
                if (showRecentBtn) {
                    showRecentBtn.click();
                }
                break;
                
            case 'c':
            case 'C':
                e.preventDefault();
                const clearFiltersBtn = document.getElementById('clearFilters');
                if (clearFiltersBtn) {
                    clearFiltersBtn.click();
                }
                break;
        }
    });
} 