if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,t)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(s[c])return;let o={};const r=e=>i(e,c),l={module:{uri:c},exports:o,require:r};s[c]=Promise.all(n.map((e=>l[e]||r(e)))).then((e=>(t(...e),o)))}}define(["./workbox-07b1a30e"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-5ddcd9ed.js",revision:null},{url:"assets/index-ea327c72.css",revision:null},{url:"assets/workbox-window.prod.es5-295a6886.js",revision:null},{url:"index.html",revision:"4d860d84ebcc8df2c4c50605095cb8bb"},{url:"icons/icon-192.png",revision:"610c3cfccc8cd9f9371eec51266a6d79"},{url:"icons/icon-512.png",revision:"89b7c3e150faf0c1e3f38929749519ac"},{url:"manifest.webmanifest",revision:"8ceed42ac050c3570c2a9b251006c02b"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"),{allowlist:[/^\/eiketsu-deck\/$/,/^\/eiketsu-deck\/\?.*$/]})),e.registerRoute(/\.md5$/i,new e.NetworkFirst,"GET"),e.registerRoute(/https:\/\/fonts\.googleapis\.com\/.*$/i,new e.NetworkFirst,"GET"),e.registerRoute(/https:\/\/fonts\.gstatic\.com\/.*$/i,new e.NetworkFirst,"GET"),e.registerRoute(/^https:\/\/image\.eiketsu-taisen\.net\/.*\.(:?jpg|png|gif)$/i,new e.CacheFirst({cacheName:"image.eiketsu-taisen.net",plugins:[new e.ExpirationPlugin({maxAgeSeconds:259200})]}),"GET")}));
