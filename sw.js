if(!self.define){let e,i={};const s=(s,n)=>(s=new URL(s+".js",n).href,i[s]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=i,document.head.appendChild(e)}else e=s,importScripts(s),i()})).then((()=>{let e=i[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(n,t)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(i[c])return;let o={};const r=e=>s(e,c),l={module:{uri:c},exports:o,require:r};i[c]=Promise.all(n.map((e=>l[e]||r(e)))).then((e=>(t(...e),o)))}}define(["./workbox-07cd8e31"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index.2de9f9aa.js",revision:null},{url:"assets/index.31f88bae.css",revision:null},{url:"index.html",revision:"4abf7ed05015618297ddfc7b72cac410"},{url:"icons/icon-192.png",revision:"610c3cfccc8cd9f9371eec51266a6d79"},{url:"icons/icon-512.png",revision:"89b7c3e150faf0c1e3f38929749519ac"},{url:"manifest.webmanifest",revision:"8ceed42ac050c3570c2a9b251006c02b"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"),{allowlist:[/^\/eiketsu-deck\/$/,/^\/eiketsu-deck\/\?.*$/]})),e.registerRoute(/\.md5$/i,new e.NetworkFirst,"GET"),e.registerRoute(/https:\/\/fonts\.googleapis\.com\/.*$/i,new e.NetworkFirst,"GET"),e.registerRoute(/https:\/\/fonts\.gstatic\.com\/.*$/i,new e.NetworkFirst,"GET"),e.registerRoute(/^https:\/\/image\.eiketsu-taisen\.net\/.*\.(:?jpg|png|gif)$/i,new e.CacheFirst({cacheName:"image.eiketsu-taisen.net",plugins:[new e.ExpirationPlugin({maxAgeSeconds:259200})]}),"GET")}));
