import { createClient } from '@supabase/supabase-js';

const url = __SUPABASE_URL__;
const key = __SUPABASE_KEY__;
export const configured = Boolean(url && key);
export const db = configured ? createClient(url, key, { auth: { persistSession: false, detectSessionInUrl: false } }) : null;

export function requireDatabase() {
  if (!db) throw new Error('Online enquiries are being set up. Please call +91 70755 05617 or use the WhatsApp link below.');
  return db;
}

export async function saveEnquiry(record) {
  const { error } = await requireDatabase().rpc('submit_enquiry', { payload: record });
  if (error) throw new Error('Your enquiry could not be saved. Please try again, or contact us directly.');
}

export const statuses = ['New', 'Contacted', 'Quoted', 'Confirmed', 'Closed'];
export function readableDate(value) { return value ? new Date(value).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : 'Not decided'; }
export function escapeHTML(value) { return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

export async function allRows(table) {
  let rows = [], from = 0;
  for (;;) {
    const { data, error } = await requireDatabase().from(table).select('*').order('created_at', { ascending: false }).order('id').range(from, from + 499);
    if (error) throw error;
    rows.push(...data);
    if (data.length < 500) return rows;
    from += 500;
  }
}
