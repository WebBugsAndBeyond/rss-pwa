const CACHE_NAME = 'pwa-cache-v1';

const urlsToCache = [
    '/',
    '/index.html',
];

function isStaticAsset(pathName) {
    const staticAssetPattern = /\.(html?|css|js|png|jpe*g|gif|ico|svg)$/i;
    const isMatch = staticAssetPattern.test(pathName);
    return isMatch;
}

function isFeedRequest(pathName) {
    const feedRequestPattern = /\/feed$/i;
    const isMatch = feedRequestPattern.test(pathName);
    return isMatch;
}

function saveResponseToRequestInCache(request, responseToCache, cache) {
    return cache.put(request, responseToCache);
}

function isResponseSuccessful(response) {
    const is200 = (response?.status ?? 0) === 200;
    return is200;
}

function isBasicResponse(response) {
    const isBasic = (response?.type ?? '') === 'basic';
    return isBasic;
}

function isStaticAssetResponseSuccessful(response) {
    const isSuccessful = isResponseSuccessful(response);
    const isBasic = isBasicResponse(response);
    return isSuccessful && isBasic;
}

function saveClonedResponseToRequestIfSuccessful(successCriteria, caches, cacheName, request, response) {
    if (successCriteria(response)) {
        const responseToCache = response.clone();
        caches.open(cacheName).then(saveResponseToRequestInCache.bind(self, request, responseToCache));
    }
    return response;
}

async function fetchResponseIfNotInCache(successfulResponseCriteria, caches, cacheName, request) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }
    const response = await fetch(request).then(
        saveClonedResponseToRequestIfSuccessful.bind(
            self,
            successfulResponseCriteria,
            caches,
            cacheName,
            request,
        ),
    );
    return response;
}

async function getCachedResponse(caches, request) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        console.log(`Serving from cache: ${request.url}`);
        return cachedResponse;
    }
    return null;
}

function createErroXMLDocument(message) {
    const xmlDocument = `<?xml version="1.0" encoding="UTF-8"?>
        <error>
            <message>${message}</message>
        </error>
    `;
    return xmlDocument;
}

function createXMLResponse(xmlDocument) {
    const response = new Response(xmlDocument, {
        status: 500,
        headers: {
            'Content-Type': 'application/xml',
        },
    });
    return response;
}

async function fetchResponseFromNetworkFirstThenCache(
    successCriteria,
    caches,
    cacheName,
    request,
) {
    try {
        const networkResponse = await fetch(request);
        if (successCriteria(networkResponse)) {
            const responseToCache = networkResponse.clone();
            const cache = await caches.open(cacheName);
            if (cache) {
                cache.put(request, responseToCache);
            }
            return networkResponse;
        }
    } catch (error) {
        console.error(error);
    }

    console.log(`Network request response unsuccessful for: ${request.url}`);
    console.log(`Attempting cache fallback for: ${request.url}`);
    const cachedResponse = await getCachedResponse(caches, request);
    if (cachedResponse) {
        return cachedResponse;
    }
    const errorMessage = `The request failed and there is no cache entry for ${request.url}`;
    const errorDocument = createErroXMLDocument(errorMessage);
    const errorResponse = createXMLResponse(errorDocument);
    return errorResponse;
}



self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
              .then(cache => {
                console.log(`Caching app shell in ${CACHE_NAME}`);
                return cache.addAll(urlsToCache);
              })
              .then(() => {
                return self.skipWaiting();
              })
              .catch(console.error)
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(cacheNames.map((cacheName) => {
                if (cacheName !== CACHE_NAME) {
                    console.log(`Deleting old cache ${cacheName}`);
                    return caches.delete(cacheName);
                }
            }))
        }).then(() => {
            return self.clients.claim();
        }),
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') {
        return;
    }

    const url = new URL(event.request.url);
    if (isStaticAsset(url.pathname) || url.pathname === '/') {
        event.respondWith(fetchResponseIfNotInCache(
            isStaticAssetResponseSuccessful,
            caches,
            CACHE_NAME,
            event.request,
        ));
    } else if (isFeedRequest(url.pathname)) {
        event.respondWith(fetchResponseFromNetworkFirstThenCache(
            isResponseSuccessful,
            caches,
            CACHE_NAME,
            event.request,
        ));
    }
});
