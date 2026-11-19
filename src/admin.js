import { db, configured, statuses, allRows, escapeHTML as esc, readableDate } from './backend.js';

const $ = s => document.querySelector(s);
const login = $('#admin-login'), dashboard = $('#admin-dashboard'), status = $('#admin-status');
if (configured) { login.querySelector('button').disabled=false; login.querySelector('button').textContent='Sign in'; }
let enquiries = [], plans = [], photos = [], busy = false;
function message(text, error = false) { status.textContent = text; status.classList.toggle('error', error); }
async function task(action, success) {
  if (busy) return;
  busy = true; dashboard.setAttribute('aria-busy', 'true');
  const buttons = [...dashboard.querySelectorAll('button')]; buttons.forEach(b => b.disabled = true);
  try { await action(); if (success) message(success); }
  catch (e) { message(e.message || 'Something went wrong. Please try again.', true); }
  finally { busy = false; dashboard.removeAttribute('aria-busy'); buttons.forEach(b => b.disabled = false); }
}
async function refresh() {
  const result = await Promise.all([allRows('enquiries'), allRows('event_plans'), allRows('media')]);
  [enquiries, plans, photos] = result;
  renderEnquiries(); renderPlans(); renderPhotos();
  const metrics = [[enquiries.length, 'Saved enquiries'], [enquiries.filter(x => x.source === 'whatsapp').length, 'WhatsApp requests'], [enquiries.filter(x => x.status === 'New').length, 'New enquiries'], [plans.filter(x => !['Completed','Cancelled'].includes(x.status)).length, 'Active event plans']];
  $('#admin-metrics').innerHTML = metrics.map(([n, label]) => `<article><strong>${n}</strong><span>${label}</span></article>`).join('');
}
function filteredEnquiries() {
  const q = $('#enquiry-search').value.toLowerCase().trim(), filter = $('#enquiry-status').value;
  return enquiries.filter(x => (!filter || x.status === filter) && (!q || [x.name,x.phone,x.event,x.location].join(' ').toLowerCase().includes(q)));
}
function renderEnquiries() {
  const rows = filteredEnquiries(); $('#enquiry-count').textContent = `${rows.length} of ${enquiries.length} enquiries`;
  $('#enquiry-list').innerHTML = rows.length ? rows.map(x => `<article class="admin-card" data-id="${esc(x.id)}"><div class="admin-card-heading"><div><p class="eyebrow">${esc(x.source === 'whatsapp' ? 'WhatsApp request' : 'Event enquiry')} · ${esc(readableDate(x.created_at))}</p><h3>${esc(x.name)}</h3><p>${esc(x.phone)}</p></div><span class="status-badge">${esc(x.status)}</span></div><dl class="record-details"><div><dt>Occasion</dt><dd>${esc(x.event)}</dd></div><div><dt>Event date</dt><dd>${esc(readableDate(x.event_date))}</dd></div><div><dt>Venue / city</dt><dd>${esc(x.location || 'To discuss')}</dd></div><div><dt>Guests / budget</dt><dd>${esc(x.guests || '—')} · ${esc(x.budget || 'To discuss')}</dd></div></dl><p class="record-note">${esc(x.details)}</p><label>Follow-up notes<textarea data-enquiry-notes rows="2" maxlength="5000">${esc(x.admin_notes)}</textarea></label><div class="admin-actions"><label>Progress<select data-enquiry-status>${statuses.map(s => `<option${x.status===s?' selected':''}>${s}</option>`).join('')}</select></label><button class="btn btn-outline" data-save-enquiry>Save changes</button><button class="btn btn-outline" data-create-plan>Create event plan</button><a class="text-link" data-direct-whatsapp="true" href="https://wa.me/${x.phone.replace(/\D/g,'')}?text=${encodeURIComponent('Hello '+x.name+', this is Purple Fox Event Planners, following up on your event enquiry.')}" target="_blank" rel="noopener noreferrer">Follow up on WhatsApp</a></div></article>`).join('') : '<p class="empty-state">No enquiries match. New requests will appear here.</p>';
}
function renderPlans() {
  $('#plan-list').innerHTML = plans.length ? plans.map(x => `<article class="admin-card" data-id="${esc(x.id)}"><p class="eyebrow">${esc(x.status)} · ${esc(readableDate(x.event_date))}</p><h3>${esc(x.title)}</h3><p>${esc(x.client_name)} · ${esc(x.phone || 'No phone added')}</p><p>${esc(x.venue || 'Venue to be decided')}</p><p>${x.guests ? esc(x.guests)+' guests' : 'Guest count to be decided'} · ${x.budget != null ? '₹'+Number(x.budget).toLocaleString('en-IN') : 'Budget to be decided'}</p><p class="record-note">${esc(x.notes)}</p><button class="btn btn-outline" data-edit-plan>Edit plan</button></article>`).join('') : '<p class="empty-state">Your next celebration starts here. Create an event plan to keep every detail together.</p>';
}
function renderPhotos() {
  $('#photo-list').innerHTML = photos.length ? photos.map(x => {
    const { data: { publicUrl } } = db.storage.from('event-images').getPublicUrl(x.storage_path);
    return `<article class="admin-card" data-id="${esc(x.id)}"><img src="${esc(publicUrl)}" alt="${esc(x.alt)}" loading="lazy"><h3>${esc(x.title)}</h3><p>${esc(x.placement === 'event' ? 'Event & gallery · '+x.event_slug : 'Gallery')} · ${x.published ? 'Published' : 'Draft'}</p><div class="admin-actions"><button class="btn btn-outline" data-toggle-photo>${x.published ? 'Unpublish' : 'Publish'}</button><button class="text-link" data-delete-photo>Delete photo</button></div></article>`;
  }).join('') : '<p class="empty-state">No uploaded photographs yet. Add your first event moment.</p>';
}
function selectTab(tab) {
  document.querySelectorAll('[data-tab]').forEach(b => { const active = b.dataset.tab === tab; b.classList.toggle('selected', active); b.setAttribute('aria-pressed', String(active)); });
  for (const name of ['enquiries','plans','photos']) $('#panel-'+name).hidden = name !== tab;
}
document.querySelectorAll('[data-tab]').forEach(b => b.addEventListener('click', () => selectTab(b.dataset.tab)));
$('#enquiry-search').addEventListener('input', renderEnquiries); $('#enquiry-status').addEventListener('change', renderEnquiries);
if (!configured) { message('Supabase is not connected yet. Add the project environment settings and run the database setup before signing in.', true); login.querySelector('button').disabled = true; }
login.addEventListener('submit', async e => {
  e.preventDefault(); const button = login.querySelector('button'); button.disabled = true; message('Signing in…');
  try {
    const { data, error } = await db.auth.signInWithPassword({ email: login.elements.email.value.trim(), password: login.elements.password.value });
    if (error) throw new Error('Unable to sign in. Check your email and password.');
    const access = await db.rpc('is_admin');
    if (access.error || !access.data) { await db.auth.signOut(); throw new Error('This account does not have admin access.'); }
    $('#admin-user').textContent = data.user.email; login.elements.password.value = ''; login.hidden = true; dashboard.hidden = false;
    await refresh(); message('Welcome back. Your studio is up to date.');
  } catch (e) { message(e.message, true); } finally { button.disabled = false; }
});
db?.auth.onAuthStateChange(event => { if (event === 'SIGNED_OUT') { dashboard.hidden = true; login.hidden = false; enquiries=[];plans=[];photos=[]; $('#enquiry-list').replaceChildren();$('#plan-list').replaceChildren();$('#photo-list').replaceChildren();$('#admin-metrics').replaceChildren();$('#plan-form').reset(); message('You have signed out.'); } });
$('#admin-logout').addEventListener('click', () => task(async () => { const { error } = await db.auth.signOut(); if (error) throw error; }));
$('#admin-refresh').addEventListener('click', () => task(refresh, 'Data refreshed.'));
$('#enquiry-list').addEventListener('click', e => {
  const card = e.target.closest('[data-id]'); if (!card) return;
  const record = enquiries.find(x => x.id === card.dataset.id);
  if (e.target.closest('[data-save-enquiry]')) task(async () => { const { error } = await db.from('enquiries').update({ status: card.querySelector('[data-enquiry-status]').value, admin_notes: card.querySelector('[data-enquiry-notes]').value }).eq('id', record.id); if (error) throw error; await refresh(); }, 'Enquiry updated.');
  if (e.target.closest('[data-create-plan]')) { const f = $('#plan-form'); f.reset(); f.elements.title.value = record.event+' · '+record.name; f.elements.client_name.value = record.name; f.elements.phone.value = record.phone; f.elements.event_date.value = record.event_date || ''; f.elements.venue.value = record.location || ''; f.elements.guests.value = record.guests || ''; f.elements.notes.value = 'Enquiry: '+record.id+'\n'+record.details; selectTab('plans'); f.scrollIntoView({ block: 'start', behavior: 'smooth' }); f.elements.title.focus(); }
});
$('#plan-list').addEventListener('click', e => { if (!e.target.closest('[data-edit-plan]')) return; const p = plans.find(x => x.id === e.target.closest('[data-id]').dataset.id); const f = $('#plan-form'); for (const [key,value] of Object.entries(p)) if (f.elements[key]) f.elements[key].value = value ?? ''; $('#plan-form-title').textContent = 'Edit event plan'; f.scrollIntoView({ block:'start', behavior:'smooth' }); f.elements.title.focus(); });
$('#plan-form').addEventListener('reset', () => { $('#plan-form-title').textContent = 'Create an event plan'; });
$('#plan-form').addEventListener('submit', e => {
  e.preventDefault(); const f = e.currentTarget, d = new FormData(f); if (!String(d.get('title')).trim() || !String(d.get('client_name')).trim()) { message('Enter a plan title and client name.', true); return; }
  task(async () => { const record = Object.fromEntries(d); const id = record.id; delete record.id; record.title=record.title.trim(); record.client_name=record.client_name.trim(); record.event_date ||= null; record.guests = record.guests ? Number(record.guests) : null; record.budget = record.budget !== '' ? Number(record.budget) : null; const result = id ? await db.from('event_plans').update(record).eq('id', id) : await db.from('event_plans').insert(record); if (result.error) throw result.error; f.reset(); await refresh(); }, 'Event plan saved.');
});
$('#photo-form').addEventListener('submit', e => {
  e.preventDefault(); const f=e.currentTarget,d=new FormData(f),file=d.get('image');
  if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 8*1024*1024 || !file.size) { message('Choose a JPG, PNG or WebP photograph under 8 MB.', true); return; }
  task(async () => {
    const bitmap = await createImageBitmap(file); if (bitmap.width*bitmap.height > 40000000) { bitmap.close(); throw new Error('Choose a photograph under 40 megapixels.'); } bitmap.close();
    const ext = { 'image/jpeg':'jpg','image/png':'png','image/webp':'webp' }[file.type], path=crypto.randomUUID()+'.'+ext;
    const upload = await db.storage.from('event-images').upload(path,file,{contentType:file.type,upsert:false}); if (upload.error) throw upload.error;
    const { error } = await db.from('media').insert({title:String(d.get('title')).trim(),alt:String(d.get('alt')).trim(),caption:d.get('caption'),placement:d.get('placement'),event_slug:d.get('event_slug'),storage_path:path,published:d.has('published')});
    if (error) { await db.storage.from('event-images').remove([path]); throw error; }
    f.reset(); await refresh();
  }, 'Photograph uploaded. Published photos are now available on the website.');
});
$('#photo-list').addEventListener('click', e => {
  const card = e.target.closest('[data-id]'); if (!card) return; const photo=photos.find(x=>x.id===card.dataset.id);
  if (e.target.closest('[data-toggle-photo]')) task(async () => { const {error}=await db.from('media').update({published:!photo.published}).eq('id',photo.id); if(error)throw error;await refresh(); }, 'Photo visibility updated.');
  if (e.target.closest('[data-delete-photo]') && confirm('Permanently delete “'+photo.title+'” and its uploaded image?')) task(async () => { const {error}=await db.from('media').update({published:false}).eq('id',photo.id);if(error)throw error;const removal=await db.storage.from('event-images').remove([photo.storage_path]);if(removal.error)throw removal.error;const deletion=await db.from('media').delete().eq('id',photo.id);if(deletion.error)throw deletion.error;await refresh(); },'Photograph deleted.');
});
$('#admin-export').addEventListener('click', () => task(async () => {
  message('Preparing your Excel workbook…'); await refresh();
  const { downloadWorkbook } = await import('./export-workbook.js');
  await downloadWorkbook({ enquiries, plans, photos });
}, 'Excel workbook downloaded with all enquiries, event plans and photo records.'));
