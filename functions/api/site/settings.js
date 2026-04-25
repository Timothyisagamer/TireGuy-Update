import { getContent, json } from '../../_utils.js';

export async function onRequest(context) {
  const content = await getContent(context.env.TG_DATA);
  return json({ settings: content.settings });
}
