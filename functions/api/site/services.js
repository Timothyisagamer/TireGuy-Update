import { getContent, json } from '../../_utils.js';

export async function onRequest(context) {
  const content = await getContent(context.env.TG_DATA);
  const services = (content.services || [])
    .filter(s => s.visible !== false)
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  return json({ services });
}
