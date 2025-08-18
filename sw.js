const CACHE_NAME = 'fitgirl-repacks-v1.0.0';
const STATIC_CACHE = 'static-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-v1.0.0';

// Files to cache immediately
const STATIC_FILES = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/tailwind-config.js',
    'https://cdn.jsdelivr.net/npm/fuse.js@7.0.0',
    'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap'
];

// Install event - cache static files
self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .catch(error => {
                console.log('Cache installation failed:', error);
            })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker activating...');
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
    );
    self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip analytics and external APIs
    if (url.hostname.includes('clarity.ms') || 
        url.hostname.includes('analytics') ||
        url.pathname.includes('api/')) {
        return;
    }

    // Handle different types of requests
    if (url.pathname.endsWith('.json')) {
        // Cache JSON data dynamically
        event.respondWith(handleJsonRequest(request));
    } else if (url.pathname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
        // Cache images dynamically
        event.respondWith(handleImageRequest(request));
    } else {
        // Handle static files
        event.respondWith(handleStaticRequest(request));
    }
});

// Handle static file requests
async function handleStaticRequest(request) {
    try {
        // Try cache first
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        // Fallback to network
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse.ok) {
            const url = new URL(request.url);
            if (url.protocol === 'http:' || url.protocol === 'https:') {
                const cache = await caches.open(STATIC_CACHE);
                cache.put(request, networkResponse.clone());
            }
        }
        
        return networkResponse;
    } catch (error) {
        console.log('Static request failed:', error);
        
        // Return offline page if available
        const offlineResponse = await caches.match('/offline.html');
        if (offlineResponse) {
            return offlineResponse;
        }
        
        throw error;
    }
}

// Handle JSON data requests
async function handleJsonRequest(request) {
    try {
        // Try cache first
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            // Return cached data but also update in background
            updateCacheInBackground(request);
            return cachedResponse;
        }

        // Fallback to network
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const url = new URL(request.url);
            if (url.protocol === 'http:' || url.protocol === 'https:') {
                // Cache the response
                const cache = await caches.open(DYNAMIC_CACHE);
                cache.put(request, networkResponse.clone());
            }
        }
        
        return networkResponse;
    } catch (error) {
        console.log('JSON request failed:', error);
        throw error;
    }
}

// Handle image requests
async function handleImageRequest(request) {
    try {
        // Try cache first
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        // Fallback to network
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const url = new URL(request.url);
            if (url.protocol === 'http:' || url.protocol === 'https:') {
                // Cache the response
                const cache = await caches.open(DYNAMIC_CACHE);
                cache.put(request, networkResponse.clone());
            }
        }
        
        return networkResponse;
    } catch (error) {
        console.log('Image request failed:', error);
        
        // Return placeholder image if available
        const placeholderResponse = await caches.match('/placeholder.jpg');
        if (placeholderResponse) {
            return placeholderResponse;
        }
        
        throw error;
    }
}

// Update cache in background
async function updateCacheInBackground(request) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            const url = new URL(request.url);
            if (url.protocol === 'http:' || url.protocol === 'https:') {
                const cache = await caches.open(DYNAMIC_CACHE);
                cache.put(request, response);
            }
        }
    } catch (error) {
        console.log('Background cache update failed:', error);
    }
}

// Background sync for offline actions
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    try {
        // Perform background sync tasks
        console.log('Performing background sync...');
        
        // Example: Sync any pending data
        const pendingData = await getPendingData();
        if (pendingData.length > 0) {
            await syncPendingData(pendingData);
        }
    } catch (error) {
        console.log('Background sync failed:', error);
    }
}

// Get pending data from IndexedDB
async function getPendingData() {
    // Implementation would depend on your data storage strategy
    return [];
}

// Sync pending data to server
async function syncPendingData(data) {
    // Implementation would depend on your API
    console.log('Syncing data:', data);
}

// Push notification handling
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/icon-192x192.png',
            badge: '/badge-72x72.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: 1
            },
            actions: [
                {
                    action: 'explore',
                    title: 'View Games',
                    icon: '/icon-192x192.png'
                },
                {
                    action: 'close',
                    title: 'Close',
                    icon: '/icon-192x192.png'
                }
            ]
        };

        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Notification click handling
self.addEventListener('notificationclick', event => {
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Message handling for communication with main thread
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_URLS') {
        event.waitUntil(
            caches.open(DYNAMIC_CACHE)
                .then(cache => {
                    return cache.addAll(event.data.urls);
                })
        );
    }
}); 