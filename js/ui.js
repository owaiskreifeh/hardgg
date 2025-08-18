// ui.js
import { stats, gridSmall, gridMedium, gridLarge, gamesGrid, loading } from './dom.js';
import { games, filteredGames, currentPage, ITEMS_PER_PAGE, gridSize, updateGridSize } from './state.js';

// Toast management
let toastContainer = null;
let activeToasts = new Set();

export function showToast(message, type = 'info') {
    const container = getToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-60 px-4 py-3 rounded-lg gaming-font text-sm text-white transform translate-x-full transition-transform duration-300 ${
        type === 'success' ? 'bg-success' : 
        type === 'error' ? 'bg-error' : 
        type === 'warning' ? 'bg-warning' :
        'bg-primary'
    }`;
    toast.textContent = message;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    
    container.appendChild(toast);
    activeToasts.add(toast);
    
    // Animate in
    requestAnimationFrame(() => {
        toast.classList.remove('translate-x-full');
    });
    
    // Animate out
    const timeout = setTimeout(() => {
        dismissToast(toast);
    }, 3000);
    
    // Allow manual dismissal
    toast.addEventListener('click', () => {
        clearTimeout(timeout);
        dismissToast(toast);
    });
    
    return toast;
}

export function createToastContainer() {
    if (toastContainer) return toastContainer;
    
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.className = 'fixed top-4 right-4 z-60 space-y-2';
    toastContainer.setAttribute('aria-label', 'Notifications');
    document.body.appendChild(toastContainer);
    
    return toastContainer;
}

function getToastContainer() {
    return toastContainer || createToastContainer();
}

function dismissToast(toast) {
    toast.classList.add('translate-x-full');
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
        activeToasts.delete(toast);
    }, 300);
}

export function dismissAllToasts() {
    activeToasts.forEach(toast => {
        dismissToast(toast);
    });
}

export function setGridSize(size) {
    if (!['small', 'medium', 'large'].includes(size)) {
        console.warn(`Invalid grid size: ${size}`);
        return;
    }
    
    // Update state
    updateGridSize(size);
    
    // Update grid layout
    if (gamesGrid) {
        gamesGrid.className = `gaming-grid gaming-grid-${size}`;
    }
    
    // Update button states
    updateGridButtons(size);
    
    // Save to localStorage
    localStorage.setItem('gridSize', size);
    
    showToast(`Grid size changed to ${size}`, 'info');
}

function updateGridButtons(activeSize) {
    const buttons = [
        { element: gridSmall, size: 'small' },
        { element: gridMedium, size: 'medium' },
        { element: gridLarge, size: 'large' }
    ];
    
    buttons.forEach(({ element, size }) => {
        if (element) {
            // Remove active state
            element.classList.remove('gaming-button', 'text-primary');
            element.classList.add('gaming-button-secondary');
            
            // Add active state to current button
            if (size === activeSize) {
                element.classList.remove('gaming-button-secondary');
                element.classList.add('gaming-button', 'text-white');
            }
        }
    });
}

export function updateStats() {
    if (!stats) return;
    
    const totalGames = games.length;
    const filteredCount = filteredGames.length;
    const showingCount = Math.min(filteredCount, (currentPage + 1) * ITEMS_PER_PAGE);
    
    stats.textContent = `// SHOWING ${showingCount} OF ${filteredCount} GAMES (${totalGames} TOTAL)`;
    stats.setAttribute('aria-label', `Showing ${showingCount} of ${filteredCount} games out of ${totalGames} total`);
}

// Loading states
export function showLoading(message = 'Loading...') {
    if (loading) {
        loading.classList.remove('hidden');
        const loadingText = loading.querySelector('p');
        if (loadingText) {
            loadingText.textContent = message;
        }
    }
}

export function hideLoading() {
    if (loading) {
        loading.classList.add('hidden');
    }
}

export function showLoadingIndicator(message = 'Loading more games...') {
    const indicator = document.getElementById('loadingIndicator');
    if (indicator) {
        indicator.textContent = message;
        indicator.classList.remove('hidden');
    }
}

export function hideLoadingIndicator() {
    const indicator = document.getElementById('loadingIndicator');
    if (indicator) {
        indicator.classList.add('hidden');
    }
}

// Error handling
export function showError(message, duration = 5000) {
    const errorBoundary = document.getElementById('errorBoundary');
    if (errorBoundary) {
        errorBoundary.textContent = message;
        errorBoundary.classList.remove('hidden');
        
        setTimeout(() => {
            errorBoundary.classList.add('hidden');
        }, duration);
    } else {
        showToast(message, 'error');
    }
}

export function hideError() {
    const errorBoundary = document.getElementById('errorBoundary');
    if (errorBoundary) {
        errorBoundary.classList.add('hidden');
    }
}

// Progress indicators
export function showProgress(progress, message = 'Loading...') {
    const progressBar = document.getElementById('progressBar') || createProgressBar();
    const progressFill = progressBar.querySelector('.progress-bar-fill');
    const progressText = progressBar.querySelector('.progress-text');
    
    if (progressFill) {
        progressFill.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }
    
    if (progressText) {
        progressText.textContent = message;
    }
    
    progressBar.classList.remove('hidden');
}

export function hideProgress() {
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.classList.add('hidden');
    }
}

function createProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.id = 'progressBar';
    progressBar.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-retro-darker border-2 border-retro-cyan p-6 rounded-none z-50 hidden';
    
    progressBar.innerHTML = `
        <div class="text-center mb-4">
            <div class="spinner mx-auto mb-2"></div>
            <p class="progress-text text-retro-cyan font-pixel text-sm">Loading...</p>
        </div>
        <div class="progress-bar">
            <div class="progress-bar-fill" style="width: 0%"></div>
        </div>
    `;
    
    document.body.appendChild(progressBar);
    return progressBar;
}

// UI state management
export function setUIState(state) {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.setAttribute('data-ui-state', state);
    }
}

export function getUIState() {
    const mainContent = document.getElementById('main-content');
    return mainContent ? mainContent.getAttribute('data-ui-state') : null;
}

// Accessibility helpers
export function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        if (announcement.parentNode) {
            announcement.parentNode.removeChild(announcement);
        }
    }, 1000);
}

// Theme management
export function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

export function getTheme() {
    return localStorage.getItem('theme') || 'default';
}

export function toggleTheme() {
    const currentTheme = getTheme();
    const newTheme = currentTheme === 'default' ? 'dark' : 'default';
    setTheme(newTheme);
    return newTheme;
}

// Responsive helpers
export function isMobile() {
    return window.innerWidth < 768;
}

export function isTablet() {
    return window.innerWidth >= 768 && window.innerWidth < 1024;
}

export function isDesktop() {
    return window.innerWidth >= 1024;
}

// Animation helpers
export function animateElement(element, animation, duration = 300) {
    if (!element) return;
    
    element.classList.add(animation);
    
    setTimeout(() => {
        element.classList.remove(animation);
    }, duration);
}

export function fadeIn(element, duration = 300) {
    if (!element) return;
    
    element.style.opacity = '0';
    element.style.transition = `opacity ${duration}ms ease-in-out`;
    
    requestAnimationFrame(() => {
        element.style.opacity = '1';
    });
}

export function fadeOut(element, duration = 300) {
    if (!element) return;
    
    element.style.transition = `opacity ${duration}ms ease-in-out`;
    element.style.opacity = '0';
    
    setTimeout(() => {
        if (element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }, duration);
}

// Utility functions
export function debounce(func, wait) {
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

export function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Initialize UI
export function initializeUI() {
    // Load saved grid size
    const savedGridSize = localStorage.getItem('gridSize');
    if (savedGridSize && ['small', 'medium', 'large'].includes(savedGridSize)) {
        setGridSize(savedGridSize);
    } else {
        setGridSize('medium');
    }
    
    // Load saved theme
    const savedTheme = getTheme();
    setTheme(savedTheme);
    
    // Create toast container
    createToastContainer();
    
    // Set up responsive listeners
    window.addEventListener('resize', debounce(() => {
        // Update UI based on screen size changes
        if (isMobile()) {
            document.body.classList.add('mobile');
            document.body.classList.remove('tablet', 'desktop');
        } else if (isTablet()) {
            document.body.classList.add('tablet');
            document.body.classList.remove('mobile', 'desktop');
        } else {
            document.body.classList.add('desktop');
            document.body.classList.remove('mobile', 'tablet');
        }
    }, 250));
    
    // Initial responsive setup
    if (isMobile()) {
        document.body.classList.add('mobile');
    } else if (isTablet()) {
        document.body.classList.add('tablet');
    } else {
        document.body.classList.add('desktop');
    }
}

// Export additional utility functions
export function getCurrentGridSize() {
    return gridSize;
}

export function getActiveToastsCount() {
    return activeToasts.size;
}

export function isToastVisible() {
    return activeToasts.size > 0;
}

export function getUIStats() {
    return {
        gridSize: getCurrentGridSize(),
        activeToasts: getActiveToastsCount(),
        isMobile: isMobile(),
        isTablet: isTablet(),
        isDesktop: isDesktop(),
        theme: getTheme(),
        uiState: getUIState()
    };
} 