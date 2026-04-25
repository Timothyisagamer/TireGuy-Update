import { getCommunity, json } from '../../_utils.js';

export async function onRequest(context) {
  const posts = await getCommunity(context.env.TG_DATA);
  return json({ posts: posts.sort((a,b)=>(b.pinned?1:0)-(a.pinned?1:0)) });
}
