var CACHE="habits-v3";
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.add(location.href).catch(()=>{})).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{if(e.request.method!=="GET"||e.request.url.startsWith("chrome-extension://")||e.request.url.startsWith("blob:"))return;e.respondWith(caches.match(e.request).then(cached=>{const fresh=fetch(e.request.clone()).then(r=>{if(r&&r.status===200){const clone=r.clone();caches.open(CACHE).then(c=>c.put(e.request,clone));}return r;}).catch(()=>caches.match(location.href));return cached||fresh;}));});
