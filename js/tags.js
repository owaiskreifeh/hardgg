// tags.js
import { allTags, selectedTags, games, filteredGames, currentPage } from './state.js';
import { tagsContainer } from './dom.js';
// Remove circular import - we'll handle this differently
import { showToast } from './ui.js';
import { filterGames } from './search.js';

// Performance optimizations
const tagCache = new Map();

export function extractTags() {
    // Check cache first for performance
    if (tagCache.has(games.length)) {
        allTags.clear();
        allTags.add(...tagCache.get(games.length));
        renderTags();
        return;
    }
    
    // Clear existing tags
    allTags.clear();
    
    // Extract all unique tags from games
    games.forEach(game => {
        if (game.tags) {
            game.tags.forEach(tag => allTags.add(tag));
        }
    });
    
    // Cache the results for performance
    tagCache.set(games.length, Array.from(allTags));
    renderTags();
}

export function renderTags() {
    if (!tagsContainer) {
        console.warn('Tags container not found');
        return;
    }
    
    tagsContainer.innerHTML = '';
    const sortedTags = Array.from(allTags).sort();
    
    // Virtual scrolling for large tag lists
    const maxVisibleTags = 50;
    const visibleTags = sortedTags.slice(0, maxVisibleTags);
    
    visibleTags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = `gaming-tag ${
            selectedTags.has(tag) ? 'active' : ''
        }`;
        tagElement.textContent = tag;
        tagElement.setAttribute('role', 'button');
        tagElement.setAttribute('tabindex', '0');
        tagElement.setAttribute('aria-pressed', selectedTags.has(tag));
        tagElement.addEventListener('click', () => toggleTag(tag));
        tagElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleTag(tag);
            }
        });
        tagsContainer.appendChild(tagElement);
    });
    
    // Add "show more" button if needed
    if (sortedTags.length > maxVisibleTags) {
        const showMoreBtn = document.createElement('button');
        showMoreBtn.className = 'gaming-tag';
        showMoreBtn.textContent = `+${sortedTags.length - maxVisibleTags} more`;
        showMoreBtn.setAttribute('aria-label', `Show ${sortedTags.length - maxVisibleTags} more tags`);
        showMoreBtn.addEventListener('click', () => {
            // Show remaining tags
            sortedTags.slice(maxVisibleTags).forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.className = `gaming-tag ${
                    selectedTags.has(tag) ? 'active' : ''
                }`;
                tagElement.textContent = tag;
                tagElement.setAttribute('role', 'button');
                tagElement.setAttribute('tabindex', '0');
                tagElement.setAttribute('aria-pressed', selectedTags.has(tag));
                tagElement.addEventListener('click', () => toggleTag(tag));
                tagElement.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleTag(tag);
                    }
                });
                tagsContainer.appendChild(tagElement);
            });
            showMoreBtn.remove();
        });
        tagsContainer.appendChild(showMoreBtn);
    }
}

export function toggleTag(tag) {
    if (selectedTags.has(tag)) {
        selectedTags.delete(tag);
        showToast(`Removed filter: ${tag}`, 'info');
    } else {
        selectedTags.add(tag);
        showToast(`Added filter: ${tag}`, 'success');
    }
    
    // Update tag visual state
    updateTagVisualState(tag);
    
    // Trigger game filtering
    filterGames();
}

// Update visual state of a specific tag
function updateTagVisualState(tag) {
    const tagElements = tagsContainer.querySelectorAll('.gaming-tag');
    tagElements.forEach(element => {
        if (element.textContent === tag) {
            if (selectedTags.has(tag)) {
                element.classList.add('active');
                element.setAttribute('aria-pressed', 'true');
            } else {
                element.classList.remove('active');
                element.setAttribute('aria-pressed', 'false');
            }
        }
    });
}

// Clear all selected tags
export function clearSelectedTags() {
    selectedTags.clear();
    renderTags();
    showToast('Cleared all tag filters', 'info');
}

// Get selected tags count
export function getSelectedTagsCount() {
    return selectedTags.size;
}

// Get all available tags
export function getAllTags() {
    return Array.from(allTags);
}

// Get selected tags
export function getSelectedTags() {
    return Array.from(selectedTags);
}

// Check if a tag is selected
export function isTagSelected(tag) {
    return selectedTags.has(tag);
}

// Add a tag to selection
export function addTag(tag) {
    if (!selectedTags.has(tag)) {
        selectedTags.add(tag);
        updateTagVisualState(tag);
        showToast(`Added filter: ${tag}`, 'success');
        filterGames();
    }
}

// Remove a tag from selection
export function removeTag(tag) {
    if (selectedTags.has(tag)) {
        selectedTags.delete(tag);
        updateTagVisualState(tag);
        showToast(`Removed filter: ${tag}`, 'info');
        filterGames();
    }
}

// Get tags by category (if implemented)
export function getTagsByCategory(category) {
    // This could be extended to categorize tags
    // For now, return all tags
    return Array.from(allTags);
}

// Get popular tags (most used)
export function getPopularTags(limit = 10) {
    const tagCounts = new Map();
    
    games.forEach(game => {
        if (game.tags) {
            game.tags.forEach(tag => {
                tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
            });
        }
    });
    
    return Array.from(tagCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([tag]) => tag);
}

// Search tags
export function searchTags(query) {
    if (!query) return Array.from(allTags);
    
    return Array.from(allTags).filter(tag => 
        tag.toLowerCase().includes(query.toLowerCase())
    );
}

// Initialize tag functionality
export function initializeTags() {
    // Add keyboard navigation for tags
    tagsContainer.addEventListener('keydown', (e) => {
        const activeElement = document.activeElement;
        const tagElements = Array.from(tagsContainer.querySelectorAll('.tag-chip'));
        const currentIndex = tagElements.indexOf(activeElement);
        
        switch (e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % tagElements.length;
                tagElements[nextIndex]?.focus();
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                const prevIndex = currentIndex <= 0 ? tagElements.length - 1 : currentIndex - 1;
                tagElements[prevIndex]?.focus();
                break;
            case 'Home':
                e.preventDefault();
                tagElements[0]?.focus();
                break;
            case 'End':
                e.preventDefault();
                tagElements[tagElements.length - 1]?.focus();
                break;
        }
    });
}

// showToast is imported from ui.js

// Export additional utility functions
export function getTagStats() {
    const totalTags = allTags.size;
    const selectedCount = selectedTags.size;
    const availableCount = totalTags - selectedCount;
    
    return {
        total: totalTags,
        selected: selectedCount,
        available: availableCount,
        percentage: totalTags > 0 ? Math.round((selectedCount / totalTags) * 100) : 0
    };
}

export function exportSelectedTags() {
    return Array.from(selectedTags);
}

export function importSelectedTags(tags) {
    if (Array.isArray(tags)) {
        selectedTags.clear();
        tags.forEach(tag => {
            if (allTags.has(tag)) {
                selectedTags.add(tag);
            }
        });
        renderTags();
        filterGames();
    }
}

export function resetTags() {
    selectedTags.clear();
    renderTags();
    showToast('Reset all tag selections', 'info');
} 