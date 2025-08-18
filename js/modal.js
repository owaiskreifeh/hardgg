// modal.js
import { modal, mobileModal, modalContent, mobileContent, mobileBack, mobileClose } from './dom.js';
import { favoriteGames } from './state.js';
import { optimizeImageUrl } from './utils.js';
import { showToast } from './ui.js';

// Check if device is mobile
const isMobile = window.innerWidth < 768;

export function openModal(game) {
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
    
    // Add share button listener
    const shareBtn = (isMobile || window.innerWidth < 768)
        ? mobileContent.querySelector('.share-btn')
        : modalContent.querySelector('.share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            shareGame(game.title, game.url);
        });
    }
}

export function closeModal() {
    modal.classList.add('hidden');
    mobileModal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
}

export function createModalContent(game) {
    let imageUrl = game.image && typeof game.image === 'string' && game.image.trim() ? game.image : 'image.png';
    const optimizedImageUrl = optimizeImageUrl(imageUrl, 400, 300);
    const isFavorite = favoriteGames.includes(game.title);
    
    return `
        <div class="gaming-modal-header">
            <h2 class="gaming-font-bold text-xl text-primary mb-2 flex-1">
                ${game.title.replace(' - FitGirl Repacks', '')}
            </h2>
            <div class="flex gap-2">
                <button class="gaming-button px-3 py-1 text-xs modal-favorite-btn">
                    ${isFavorite ? '❤️' : '🤍'} ${isFavorite ? 'UNFAVORITE' : 'FAVORITE'}
                </button>
                <button class="gaming-modal-close modal-close">✕</button>
            </div>
        </div>
            
            <div class="gaming-modal-body">
                <img 
                    src="${optimizedImageUrl}" 
                    alt="${game.title}" 
                    class="w-full max-w-md mx-auto rounded-lg border-2 border-primary mb-6"
                    loading="eager"
                    decoding="async"
                    onerror="this.onerror=null;this.src='image.png';"
                />
                
                <div class="space-y-6">
                    <div>
                        <h3 class="text-secondary gaming-font text-sm mb-3">// TAGS</h3>
                        <div class="flex flex-wrap gap-2">
                            ${game.tags?.map(tag => 
                                `<span class="gaming-tag">${tag}</span>`
                            ).join('') || ''}
                        </div>
                    </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="gaming-card p-4">
                        <div class="text-primary gaming-font text-sm mb-1">ORIGINAL SIZE</div>
                        <div class="text-white text-xs">${game.metadata?.originalSize || 'N/A'}</div>
                    </div>
                    <div class="gaming-card p-4">
                        <div class="text-primary gaming-font text-sm mb-1">REPACK SIZE</div>
                        <div class="text-white text-xs">${game.metadata?.repackSize || 'N/A'}</div>
                    </div>
                    <div class="gaming-card p-4">
                        <div class="text-primary gaming-font text-sm mb-1">LANGUAGES</div>
                        <div class="text-white text-xs">${game.metadata?.languages || 'N/A'}</div>
                    </div>
                    <div class="gaming-card p-4">
                        <div class="text-primary gaming-font text-sm mb-1">COMPANIES</div>
                        <div class="text-white text-xs">${game.metadata?.companies || 'N/A'}</div>
                    </div>
                </div>
                
                <div class="gaming-card p-4">
                    <h3 class="text-success gaming-font text-sm mb-3">// REPACK FEATURES</h3>
                    <ul class="space-y-2">
                        ${game.repackFeatures?.map(feature => 
                            `<li class="flex items-start gap-2 text-xs">
                                <span class="text-success">▶</span>
                                <span class="text-white">${feature}</span>
                            </li>`
                        ).join('') || '<li class="text-xs">No features listed</li>'}
                    </ul>
                </div>
                
                <div class="flex gap-4">
                    <a 
                        href="${game.url}" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        class="gaming-button flex-1 text-center py-4 px-6 text-sm"
                    >
                        >>> DOWNLOAD GAME <<<
                    </a>
                    <button 
                        class="share-btn gaming-button px-6 py-4 text-sm"
                    >
                        📤 SHARE
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Share game function
export function shareGame(title, url) {
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

// Initialize modal event listeners
export function initializeModalListeners() {
    // Mobile modal close buttons
    if (mobileBack) {
        mobileBack.addEventListener('click', closeModal);
    }
    if (mobileClose) {
        mobileClose.addEventListener('click', closeModal);
    }
    
    // Desktop modal close on outside click
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
    
    // Mobile modal close on outside click
    if (mobileModal) {
        mobileModal.addEventListener('click', (e) => {
            if (e.target === mobileModal) closeModal();
        });
    }
    
    // Keyboard: Escape closes modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// Helper functions that need to be imported or defined
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
    
    // Update UI if needed
    if (typeof window.updateFavoritesUI === 'function') {
        window.updateFavoritesUI();
    }
    
    // Re-render modal content to update favorite button
    const currentModal = (isMobile || window.innerWidth < 768) ? mobileModal : modal;
    if (!currentModal.classList.contains('hidden')) {
        const content = createModalContent(game);
        if (isMobile || window.innerWidth < 768) {
            mobileContent.innerHTML = content;
        } else {
            modalContent.innerHTML = content;
        }
        
        // Re-add event listeners
        const modalFavBtn = (isMobile || window.innerWidth < 768)
            ? mobileContent.querySelector('.modal-favorite-btn')
            : modalContent.querySelector('.modal-favorite-btn');
        if (modalFavBtn) {
            modalFavBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleFavorite(game);
            });
        }
        
        const shareBtn = (isMobile || window.innerWidth < 768)
            ? mobileContent.querySelector('.share-btn')
            : modalContent.querySelector('.share-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                shareGame(game.title, game.url);
            });
        }
    }
}

// showToast is now imported from ui.js

// Export additional utility functions
export function isModalOpen() {
    return !modal.classList.contains('hidden') || !mobileModal.classList.contains('hidden');
}

export function getCurrentModal() {
    if (!mobileModal.classList.contains('hidden')) {
        return mobileModal;
    } else if (!modal.classList.contains('hidden')) {
        return modal;
    }
    return null;
}

export function updateModalContent(game) {
    const content = createModalContent(game);
    if (isMobile || window.innerWidth < 768) {
        mobileContent.innerHTML = content;
    } else {
        modalContent.innerHTML = content;
    }
} 