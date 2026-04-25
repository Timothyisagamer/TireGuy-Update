import { getContent, json, requireAdmin, saveContent } from '../../_utils.js';

export async function onRequestGet(context) {
  const sess = await requireAdmin(context);
  if (!sess) return json({ error: 'Unauthorized' }, 401);
  const content = await getContent(context.env.TG_DATA);
  return json(content);
}

export async function onRequestPost(context) {
  const sess = await requireAdmin(context);
  if (!sess) return json({ error: 'Unauthorized' }, 401);
  const body = await context.request.json().catch(() => null);
  const saved = await saveContent(context.env.TG_DATA, body || {});
  return json({ ok: true, ...saved });
}
