const CACHE_NAME = 'verbkosh-cache-v1';
// उन फ़ाइलों की सूची जिन्हें हम Offline के लिए सुरक्षित (Cache) करना चाहते हैं
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192x192.png',
  './icon-512x512.png'
];

// Install Event: फ़ाइलों को Cache में सेव करना
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching App Assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Fetch Event: जब इंटरनेट न हो तो Cache से डेटा दिखाना
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // अगर फ़ाइल Cache में है, तो उसे दिखाओ, वर्ना इंटरनेट (Network) से लाओ
      return cachedResponse || fetch(event.request);
    })
  );
});

// Activate Event: पुरानी Cache को डिलीट करना (ताकि अपडेटेड वर्ज़न मिल सके)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});
