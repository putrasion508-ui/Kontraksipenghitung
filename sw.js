// Service worker — cache app shell agar bisa dibuka offline.
const CACHE='kontraksi-v1';
const ASSETS=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.url.includes('overpass')||req.url.includes('google.com/maps')){return;}
  e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(res=>{
    if(req.method==='GET'&&res.ok&&new URL(req.url).origin===location.origin){const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy));}
    return res;
  }).catch(()=>caches.match('./index.html'))));
});
