import { getFaqs, json } from '../../_utils.js';

export async function onRequest(context) {
  const faqs = await getFaqs(context.env.TG_DATA);
  return json({ faqs: faqs.sort((a,b)=>(a.sort_order||0)-(b.sort_order||0)) });
}
