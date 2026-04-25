import { createSession, getPassword, json } from '../../_utils.js';

export async function onRequestPost(context) {
  const body = await context.request.json().catch(() => null);
  const password = await getPassword(context.env.TG_DATA, context.env);
  if (!body?.password || body.password !== password) return json({ error: 'Invalid password.' }, 401);
  const token = await createSession(context);
  return json({ ok: true }, 200, {
    'set-cookie': `tg_admin_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800; Secure`
  });
}
