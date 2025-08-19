// utils.js
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

export function optimizeImageUrl(url, width = 300, height = 400) {
    if (!url || url.includes('picsum.photos')) return url;
    const optimizedUrl = new URL(url);
    optimizedUrl.searchParams.set('w', width);
    optimizedUrl.searchParams.set('h', height);
    optimizedUrl.searchParams.set('q', '85');
    optimizedUrl.searchParams.set('fit', 'crop');
    return optimizedUrl.toString();
}

export function preloadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

export function parseSizeToMB(sizeString) {
    const size = sizeString.toLowerCase();
    const number = parseFloat(size.replace(/[^\d.]/g, ''));

    if (size.includes('gb')) return number * 1024;
    if (size.includes('mb')) return number;
    if (size.includes('kb')) return number / 1024;

    return number;
} 