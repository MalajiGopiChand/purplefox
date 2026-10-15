import {mkdir,writeFile,copyFile,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {site} from './src/data.mjs';
import {pages} from './src/pages.mjs';
import {header,footer,esc} from './src/components.mjs';
const version=createHash('sha256').update(await readFile('src/style.css')).update(await readFile('src/app.js')).digest('hex').slice(0,12);
const schema=JSON.stringify({'@context':'https://schema.org','@type':'Organization',name:site.name,url:site.origin,telephone:'+'+site.phone,logo:site.origin+'/images/logo-badge.webp',sameAs:[site.instagram]});
for(const [route,title,description,body] of pages){
 const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} | Purple Fox Event Planners</title><meta name="description" content="${esc(description)}"><meta name="theme-color" content="#49234f"><link rel="canonical" href="${site.origin}${route}"><meta property="og:type" content="website"><meta property="og:title" content="${esc(title)} | Purple Fox"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${site.origin}${route}"><meta property="og:image" content="${site.origin}/images/v2-home-garden.webp"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/favicon.png"><link rel="apple-touch-icon" href="/images/logo-badge.png"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet"><link rel="stylesheet" href="/style.css?v=${version}"><script type="application/ld+json">${schema}</script><script src="/app.js?v=${version}" defer></script></head><body>${header(route)}<main id="main">${body}</main>${footer}</body></html>`;
 const dir='dist'+(route==='/'?'':route);await mkdir(dir,{recursive:true});await writeFile(dir+'/index.html',html);
}
await copyFile('dist/404/index.html','dist/404.html');
await copyFile('src/style.css','dist/style.css');await copyFile('src/app.js','dist/app.js');
await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\nSitemap: ${site.origin}/sitemap.xml\n`);
await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.filter(p=>p[0]!='/404/').map(p=>`<url><loc>${site.origin}${p[0]}</loc></url>`).join('')}</urlset>`);
await writeFile('dist/_headers','/style.css\n  Cache-Control: public, max-age=0, must-revalidate\n/app.js\n  Cache-Control: public, max-age=0, must-revalidate\n');
console.log(`Built ${pages.length} pages for ${site.origin} (assets ${version}).`);
