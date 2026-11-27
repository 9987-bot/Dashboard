const V="depot-v17",ICO="depot-ico",IH=["coin-images.coingecko.com","assets.coingecko.com"];const FILES=["./","index.html","manifest.webmanifest","icon-180.png","icon-512.png"];let icoUntil=0;
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x!==ICO).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("message",e=>{if(e.data&&e.data.ico)icoUntil=Date.now()+120000});
self.addEventListener("fetch",e=>{const u=new URL(e.request.url);if(e.request.method!=="GET")return;
 if(IH.includes(u.hostname)){e.respondWith(caches.open(ICO).then(c=>c.match(u.href).then(hit=>{if(hit)return hit;if(Date.now()>icoUntil)return Response.error();return fetch(e.request).then(r=>{if(r&&(r.ok||r.type==="opaque"))c.put(u.href,r.clone());return r})})));return}
 if(u.origin!==location.origin)return;
 e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>{const net=fetch(e.request).then(r=>{if(r&&r.ok){const cp=r.clone();caches.open(V).then(c=>c.put(e.request,cp))}return r}).catch(()=>hit||caches.match("index.html"));return hit||net}))});
