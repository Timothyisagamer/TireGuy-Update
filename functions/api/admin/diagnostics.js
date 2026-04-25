import { json, KEYS, listItems, requireAdmin, writeJson } from '../../_utils.js';

export async function onRequest(context) {
  const sess = await requireAdmin(context);
  if (!sess) return json({ error: 'Unauthorized' }, 401);
  const { method } = context.request;
  const url = new URL(context.request.url);
  const id = url.searchParams.get('id');

  if (method === 'DELETE') {
    if (!id) return json({ error: 'id required' }, 400);
    let items = await listItems(context.env.TG_DATA, KEYS.diagnostics);
    items = items.filter(x => x.id !== id);
    await writeJson(context.env.TG_DATA, KEYS.diagnostics, items);
    return json({ ok: true });
  }

  // GET
  const items = (await listItems(context.env.TG_DATA, KEYS.diagnostics)).reverse();
  return json({ diagnostics: items });
}
