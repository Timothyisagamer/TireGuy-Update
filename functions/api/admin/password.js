import { getPassword, json, requireAdmin, setPassword } from '../../_utils.js';

export async function onRequestPost(context) {
  const sess = await requireAdmin(context);
  if (!sess) return json({ error: 'Unauthorized' }, 401);
  const body = await context.request.json().catch(() => null);
  const current = await getPassword(context.env.TG_DATA, context.env);
  if (!body?.currentPassword || body.currentPassword !== current) return json({ error: 'Current password is incorrect.' }, 400);
  if (!body?.newPassword || body.newPassword.length < 6) return json({ error: 'New password must be at least 6 characters.' }, 400);
  await setPassword(context.env.TG_DATA, body.newPassword);
  return json({ ok: true });
}
