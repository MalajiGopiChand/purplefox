import { saveEnquiry, configured } from './backend.js';

const whatsappBase = 'https://wa.me/917075505617';
function contactData(form, source, id) {
  const d = new FormData(form);
  return { id, name: String(d.get('name') || '').trim(), phone: String(d.get('phone') || '').trim(), event: d.get('event') || 'To discuss', event_date: d.get('date') || null, location: String(d.get('location') || '').trim(), guests: d.get('guests') ? Number(d.get('guests')) : null, budget: d.get('budget') || '', details: String(d.get('details') || '').trim(), source, page: location.pathname };
}
function valid(form) {
  for (const field of form.querySelectorAll('[name="name"], [name="location"]')) {
    field.value = field.value.trim();
    field.setCustomValidity(field.required && !field.value ? 'Please enter this detail.' : '');
  }
  const phone = form.elements.phone, raw = phone.value.trim();
  phone.setCustomValidity(/^[+0-9 ()-]+$/.test(raw) && raw.replace(/\D/g, '').length >= 10 && raw.replace(/\D/g, '').length <= 15 ? '' : 'Enter a phone number with 10 to 15 digits.');
  return form.reportValidity();
}
function draft(record) {
  const lines = ['Hello Purple Fox Event Planners! I would like to plan an event.', '', `Name: ${record.name}`, `Mobile: ${record.phone}`, `Event: ${record.event}`, `Preferred date: ${record.event_date || 'Not decided yet'}`, `City / venue: ${record.location || 'To discuss'}`];
  if (record.guests) lines.push(`Expected guests: ${record.guests}`);
  if (record.budget) lines.push(`Approximate budget: ${record.budget}`);
  if (record.details) lines.push(`Special requirements: ${record.details}`);
  return whatsappBase + '?text=' + encodeURIComponent(lines.join('\n'));
}
function statusLink(status, message, href) {
  status.textContent = message + ' ';
  const a = document.createElement('a'); a.href = href; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = 'Open WhatsApp'; a.className = 'text-link'; a.dataset.directWhatsapp = 'true'; status.append(a);
}
function wire(form, status, source) {
  let submissionId = crypto.randomUUID();
  form.addEventListener('input', e => e.target.setCustomValidity?.(''));
  form.addEventListener('submit', async e => {
    e.preventDefault(); if (!valid(form)) return;
    if (form.elements.website?.value) return;
    const button = form.querySelector('[type="submit"]'), record = contactData(form, source, submissionId), url = draft(record);
    button.disabled = true; status.textContent = 'Saving your enquiry…';
    try {
      await saveEnquiry(record);
      statusLink(status, 'Your enquiry is saved. Review and send your message in WhatsApp.', url);
      submissionId = crypto.randomUUID();
      // Navigate only after a successful save. The link above remains a fallback.
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      statusLink(status, error.message + ' Your enquiry has not been saved.', url);
    } finally { button.disabled = false; }
  });
}
const form = document.querySelector('#enquiry-form');
if (form) {
  const now = new Date(); now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); form.elements.date.min = now.toISOString().slice(0, 10);
  wire(form, document.querySelector('#form-status'), 'event_form');
  const occasion = new URLSearchParams(location.search).get('event');
  if (occasion && [...form.elements.event.options].some(o => o.value === occasion)) form.elements.event.value = occasion;
  if (!configured) document.querySelector('#form-status').textContent = 'Online saving is being set up. You can still contact us directly by phone or WhatsApp.';
}
const dialog = document.createElement('dialog');
dialog.className = 'whatsapp-dialog'; dialog.setAttribute('aria-labelledby', 'wa-title');
dialog.innerHTML = `<button type="button" class="dialog-close" aria-label="Close enquiry">×</button><form id="whatsapp-enquiry"><p class="eyebrow">Let’s make it memorable</p><h2 id="wa-title">Say hello to Purple Fox.</h2><p>Leave your details so our team can follow up, then continue to WhatsApp.</p><div class="form-grid"><label>Full name<input name="name" autocomplete="name" maxlength="100" required></label><label>Mobile number<input name="phone" autocomplete="tel" type="tel" maxlength="20" required></label><label class="full">Your occasion<input name="event" maxlength="100" placeholder="Wedding, birthday, or something else"></label></div><label class="check-label"><input type="checkbox" required> I agree to be contacted about my event. <a href="/privacy-policy/">Privacy</a></label><button class="btn" type="submit">Save & continue to WhatsApp</button><p id="wa-status" role="status"></p></form>`;
document.body.append(dialog);
let trigger;
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => trigger?.focus());
wire(dialog.querySelector('form'), dialog.querySelector('#wa-status'), 'whatsapp');
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="https://wa.me/"]');
  if (!a || a.dataset.directWhatsapp || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
  e.preventDefault(); trigger = a; dialog.showModal();
});
