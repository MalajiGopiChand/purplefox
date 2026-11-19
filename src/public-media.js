import { db, escapeHTML as esc } from './backend.js';

const host = document.querySelector('[data-published-photos]');
if (db && host) loadPhotos();
async function loadPhotos() {
  const slug = host.dataset.eventSlug;
  let query = db.from('media').select('id,title,alt,caption,storage_path,event_slug,placement').eq('published', true).order('created_at', { ascending: false }).limit(60);
  if (slug) query = query.eq('event_slug', slug).eq('placement', 'event');
  const { data, error } = await query;
  if (error || !data?.length) return;
  host.hidden = false;
  host.querySelector('.published-photo-grid').innerHTML = data.map(p => {
    const { data: { publicUrl } } = db.storage.from('event-images').getPublicUrl(p.storage_path);
    return `<figure class="published-photo"><button type="button" data-photo-url="${esc(publicUrl)}" data-photo-title="${esc(p.title)}" data-photo-alt="${esc(p.alt)}" aria-label="View ${esc(p.title)}"><img src="${esc(publicUrl)}" alt="${esc(p.alt)}" loading="lazy" width="1200" height="900"></button><figcaption><h3>${esc(p.title)}</h3><p>${esc(p.caption)}</p></figcaption></figure>`;
  }).join('');
  const dialog = document.createElement('dialog'); dialog.className = 'published-lightbox'; dialog.setAttribute('aria-label', 'Event photograph');
  dialog.innerHTML = '<button class="dialog-close" aria-label="Close photograph">×</button><img alt=""><h2></h2>';
  document.body.append(dialog); let opener;
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => opener?.focus());
  host.addEventListener('click', e => { const b = e.target.closest('[data-photo-url]'); if (!b) return; opener = b; dialog.querySelector('img').src = b.dataset.photoUrl; dialog.querySelector('img').alt = b.dataset.photoAlt; dialog.querySelector('h2').textContent = b.dataset.photoTitle; dialog.showModal(); });
}
