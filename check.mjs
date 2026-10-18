import {readFile,readdir,stat} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {site,events,gallery,packages} from './src/data.mjs';
import {pages} from './src/pages.mjs';
const root=path.resolve('dist');let links=0,photos=0;const hashes=new Map();
for(const [route] of pages){const file=path.join(root,route,'index.html');const html=await readFile(file,'utf8');assert.equal((html.match(/<h1[ >]/g)||[]).length,1,route+': one h1');assert.match(html,/<meta name="description"/);assert.ok(html.includes('href="'+site.origin+route+'"'));assert.ok(!/coming soon|on their way|latest updates/i.test(html),route+': stale update copy');
for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){const raw=m[1].replaceAll('&amp;','&');if(raw.startsWith('/')){const pathname=raw.split(/[?#]/)[0];const target=path.join(root,pathname);const info=await stat(target).catch(()=>null);assert.ok(info,route+': missing '+raw);if(info.isDirectory())await stat(path.join(target,'index.html'));links++;}if(raw.startsWith('https://wa.me/')){assert.equal(new URL(raw).pathname,'/'+site.phone);assert.ok(new URL(raw).searchParams.get('text').startsWith('Hello Purple Fox Event Planners!'));}}
const pagePhotos=[];for(const m of html.matchAll(/<img\b[^>]+>/g)){if(!m[0].includes('src='))continue;const src=m[0].match(/src="([^"]+)"/)[1];if(src.includes('logo'))continue;assert.match(m[0],/alt="[^"]+"/);assert.ok(!pagePhotos.includes(src),route+': duplicate photograph '+src);pagePhotos.push(src);photos++;if(!hashes.has(src))hashes.set(src,createHash('sha256').update(await readFile(path.join(root,src))).digest('hex'));}
}
assert.equal(new Set(hashes.values()).size,hashes.size,'Duplicate image file content under different filenames');assert.equal(events.length,16);assert.equal(new Set(events.map(e=>e.image)).size,16);assert.equal(gallery.length,new Set(gallery.map(g=>g.image)).size);assert.equal(packages.length,3);assert.equal(site.origin,'https://purplefox-ten.vercel.app');assert.equal(site.phone,'917075505617');
console.log(`PASS: ${pages.length} pages; ${links} local links/assets; ${photos} photo placements; ${hashes.size} unique photographs. No duplicate photo on any page. Metadata, WhatsApp links, asset integrity and old-update removal verified.`);

