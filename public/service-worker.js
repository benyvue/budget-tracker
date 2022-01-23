//cache name
const CACHE_NAME = 'budget-tracker'
//data cache name
const DATA_CACHE_NAME = 'data-cache-budget'

const FILES_TO_CACHE = [
  './index.html',
  './css/styles.css',
  './manifest.json',
  './js/index.js',
  './icons/icon-72x72.png',
  './icons/icon-96x96.png',
  './icons/icon-128x128.png',
  './icons/icon-144x144.png',
  './icons/icon-152x152.png',
  './icons/icon-192x192.png',
  './icons/icon-384x384.png',
  './icons/icon-512x512.png',
]

// adding files to the precache so that the application can use the cache (installing service worker)
self.addEventListener('install', function (e) {
  e.waitUntil(
      caches.open(CACHE_NAME).then(function (cache) {
        console.log('installing cache : ' + CACHE_NAME)
        return cache.addAll(FILES_TO_CACHE)
      })
    )
});

// activate a service worker
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      let cacheKeeplist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      });
          cacheKeeplist.push(CACHE_NAME);
          // returns a promise that resolves once all old versions of the cache have been deleted 
          return Promise.all(keyList.map(function (key, i) {
              if (cacheKeeplist.indexOf(key) === -1) {
              console.log('deleting cache : ' + keyList[i] );
              return caches.delete(keyList[i]);
              }
          })
      );
  })
  )
});

// retrieving information from the cache 
self.addEventListener('fetch', function (e) {
  console.log('fetch request : ' + e.request.url)
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) { // if cache is available, respond with cache
        console.log('responding with cache : ' + e.request.url)
      //   console.log(e.request.url)
        return request
      } else {       // if there are no cache, try fetching request
        console.log('file is not cached, fetching : ' + e.request.url)
      //   console.log(e.request.url)
        return fetch(e.request)
      }

      // You can omit if/else for console.log & put one line below like this too.
      // return request || fetch(e.request)
    })
  )
});
