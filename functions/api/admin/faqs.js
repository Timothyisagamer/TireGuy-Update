import { json, KEYS, getFaqs, requireAdmin, writeJson } from '../../_utils.js';

export async function onRequest(context) {
  const sess = await requireAdmin(context);
  if (!sess) return json({ error: 'Unauthorized' }, 401);
  const { method } = context.request;
  const url = new URL(context.request.url);
  const id = url.searchParams.get('id');

  if (method === 'GET') {
    const faqs = await getFaqs(context.env.TG_DATA);
    return json({ faqs: faqs.sort((a,b)=>(a.sort_order||0)-(b.sort_order||0)) });
  }

  if (method === 'POST') {
    const body = await context.request.json().catch(() => null);
    if (!body?.question) return json({ error: 'Question required' }, 400);
    const faqs = await getFaqs(context.env.TG_DATA);
    const item = { id: crypto.randomUUID(), sort_order: faqs.length + 1, ...body };
    faqs.push(item);
    await writeJson(context.env.TG_DATA, KEYS.faqs, faqs);
    return json({ ok: true, faq: item });
  }

  if (method === 'PUT') {
    if (!id) return json({ error: 'id required' }, 400);
    const body = await context.request.json().catch(() => null);
    const faqs = await getFaqs(context.env.TG_DATA);
    const updated = faqs.map(x => x.id === id ? { ...x, ...body, id } : x);
    await writeJson(context.env.TG_DATA, KEYS.faqs, updated);
    return json({ ok: true });
  }

  if (method === 'DELETE') {
    if (!id) return json({ error: 'id required' }, 400);
    const faqs = await getFaqs(context.env.TG_DATA);
    await writeJson(context.env.TG_DATA, KEYS.faqs, faqs.filter(x => x.id !== id));
    return json({ ok: true });
  }

  return json({ error: 'Method not allowed' }, 405);
}
