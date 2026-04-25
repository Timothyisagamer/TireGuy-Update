import { requireAdmin, json } from '../../_utils.js';

export async function onRequest(context) {
  const sess = await requireAdmin(context);
  return json({ authenticated: !!sess });
}
