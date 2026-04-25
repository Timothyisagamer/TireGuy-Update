import { json, KEYS, getCommunity, requireAdmin, writeJson } from '../../_utils.js';

export async function onRequest(context) {
  const sess = await requireAdmin(context);
  if (!sess) return json({ error: 'Unauthorized' }, 401);
  const { method } = context.request;
  const url = new URL(context.request.url);
  const id = url.searchParams.get('id');

  if (method === 'GET') {
    const posts = await getCommunity(context.env.TG_DATA);
    return json({ posts: posts.sort((a,b)=>(b.pinned?1:0)-(a.pinned?1:0)) });
  }

  if (method === 'POST') {
    const body = await context.request.json().catch(() => null);
    if (!body?.title) return json({ error: 'Title required' }, 400);
    const posts = await getCommunity(context.env.TG_DATA);
    const item = { id: crypto.randomUUID(), created_at: new Date().toISOString(), author:'TireGuy Team', ...body };
    posts.push(item);
    await writeJson(context.env.TG_DATA, KEYS.community, posts);
    return json({ ok: true, post: item });
  }

  if (method === 'PUT') {
    if (!id) return json({ error: 'id required' }, 400);
    const body = await context.request.json().catch(() => null);
    const posts = await getCommunity(context.env.TG_DATA);
    const updated = posts.map(x => x.id === id ? { ...x, ...body, id, updated_at: new Date().toISOString() } : x);
    await writeJson(context.env.TG_DATA, KEYS.community, updated);
    return json({ ok: true });
  }

  if (method === 'DELETE') {
    if (!id) return json({ error: 'id required' }, 400);
    const posts = await getCommunity(context.env.TG_DATA);
    await writeJson(context.env.TG_DATA, KEYS.community, posts.filter(x => x.id !== id));
    return json({ ok: true });
  }

  return json({ error: 'Method not allowed' }, 405);
}
