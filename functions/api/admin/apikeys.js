import { json, KEYS, getApiKeys, requireAdmin, writeJson } from '../../_utils.js';

export async function onRequest(context) {
  const sess = await requireAdmin(context);
  if (!sess) return json({ error: 'Unauthorized' }, 401);
  const { method } = context.request;

  if (method === 'GET') {
    const keys = await getApiKeys(context.env.TG_DATA);
    const masked = {};
    for (const [k, v] of Object.entries(keys)) {
      masked[k] = v && v.length > 12 ? v.slice(0, 8) + '••••' + v.slice(-4) : (v ? '(set)' : '');
    }
    return json({ keys: masked, has: Object.fromEntries(Object.entries(keys).map(([k,v]) => [k, !!v])) });
  }

  if (method === 'POST') {
    const body = await context.request.json().catch(() => null);
    const { service, key } = body || {};
    if (!service) return json({ error: 'Service name required' }, 400);
    const keys = await getApiKeys(context.env.TG_DATA);
    if (key === '' || key == null) {
      delete keys[service];
    } else {
      keys[service] = key;
    }
    await writeJson(context.env.TG_DATA, KEYS.apiKeys, keys);
    return json({ ok: true });
  }

  return json({ error: 'Method not allowed' }, 405);
}
