import { json, KEYS, listItems, requireAdmin, writeJson } from '../../_utils.js';

export async function onRequest(context) {
  const sess = await requireAdmin(context);
  if (!sess) return json({ error: 'Unauthorized' }, 401);
  const { method } = context.request;
  const url = new URL(context.request.url);
  const id = url.searchParams.get('id');

  if (method === 'DELETE') {
    if (!id) return json({ error: 'id required' }, 400);
    let items = await listItems(context.env.TG_DATA, KEYS.contacts);
    items = items.filter(x => x.id !== id);
    await writeJson(context.env.TG_DATA, KEYS.contacts, items);
    return json({ ok: true });
  }

  if (method === 'PUT') {
    if (!id) return json({ error: 'id required' }, 400);
    const body = await context.request.json().catch(() => null);
    let items = await listItems(context.env.TG_DATA, KEYS.contacts);
    items = items.map(x => x.id === id ? { ...x, ...body, id, updated_at: new Date().toISOString() } : x);
    await writeJson(context.env.TG_DATA, KEYS.contacts, items);
    return json({ ok: true });
  }

  // GET
  const items = (await listItems(context.env.TG_DATA, KEYS.contacts)).reverse();
  return json({ contacts: items });
}
