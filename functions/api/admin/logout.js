import { getCookie, json } from '../../_utils.js';

export async function onRequestPost(context) {
  const token = getCookie(context.request, 'tg_admin_session');
  if (token) await context.env.TG_DATA.delete(`session:${token}`);
  return json({ ok: true }, 200, {
    'set-cookie': 'tg_admin_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Secure'
  });
}
