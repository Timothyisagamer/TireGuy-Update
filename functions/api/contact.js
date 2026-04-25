import { appendItem, json, KEYS } from '../_utils.js';

export async function onRequestPost(context) {
  const body = await context.request.json().catch(() => null);
  if (!body?.name || !body?.message) return json({ error: 'Name and message are required.' }, 400);
  const saved = await appendItem(context.env.TG_DATA, KEYS.contacts, body);
  return json({ ok: true, inquiry: saved });
}
