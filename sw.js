const CACHE_NAME='i-muslim-shell-v5';
const API_CACHE='i-muslim-api-v1';
const APP_SHELL=['./','./index.html','./manifest.webmanifest','./icons/icon.svg','./features.css','./features.js'];
const API_HOSTS=new Set(['api.alquran.cloud','api.aladhan.com']);

self.addEventListener('install',event=>{
 event.waitUntil((async()=>{
  const cache=await caches.open(CACHE_NAME);
  await cache.addAll(APP_SHELL);
  await self.skipWaiting();
 })());
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(k=>k!==CACHE_NAME&&k!==API_CACHE).map(k=>caches.delete(k)));
  await self.clients.claim();
 })());
});
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);
 if(req.method!=='GET'||req.headers.has('range'))return;
 if(url.origin!==self.location.origin){
  if(!API_HOSTS.has(url.hostname))return;
  event.respondWith((async()=>{
   const cache=await caches.open(API_CACHE);
   try{
    const response=await fetch(req);
    const type=response.headers.get('content-type')||'';
    if(response.ok&&type.includes('json'))await cache.put(req,response.clone());
    return response;
   }catch(error){
    return (await cache.match(req))||Response.error();
   }
  })());
  return;
 }
 if(req.mode==='navigate'){
  event.respondWith((async()=>{
   try{
    const response=await fetch(req);
    if(response&&response.ok){const cache=await caches.open(CACHE_NAME);await cache.put('./index.html',response.clone())}
    return response;
   }catch(error){return (await caches.match('./index.html'))||Response.error()}
  })());
  return;
 }
 event.respondWith((async()=>{
  const cached=await caches.match(req);
  if(cached)return cached;
  try{
   const response=await fetch(req);
   if(response&&response.ok&&response.type==='basic'){const cache=await caches.open(CACHE_NAME);await cache.put(req,response.clone())}
   return response;
  }catch(error){return Response.error()}
 })());
});
