
const DEFAULT_PASSWORD = 'admin123!';
const DEFAULT_SETTINGS = {
  shop_name:'TireGuy Automotive',
  address:'107 W. Broadway, Burns, KS 66840',
  phone:'(620) 726-3160',
  email:'TireGuyAutomotive@gmail.com',
  hours_weekday:'Monday - Friday: 8:30AM - 5PM',
  hours_weekend:'Weekends: Closed',
  facebook:'https://www.facebook.com/tire.guy.141793/',
  instagram:'#',
  twitter:'#',
  youtube:'#',
  linkedin:'#',
  tiktok:'#',
  show_ai_diagnostics:true,
  show_community:true,
  tagline:'Quality You Can Feel',
  hero_headline:'TIRES & AUTO CARE <em>DONE RIGHT</em>',
  hero_sub:'Fast, reliable service from technicians who actually care.',
  about_heading:'WHY CHOOSE TIREGUY?',
  about_body:`We started TireGuy Automotive with one goal: to give every driver in this community the kind of honest, fast, and affordable auto care that's hard to find at the big chains.\n\nOver the past decade, we've built our reputation one car at a time. From a quick oil change to a complete tire overhaul, we treat every vehicle like it belongs to a family member — because it just might.\n\nWhat sets us apart is our honesty and transparency. We tell you exactly what's wrong and we don't pad the bill with services you don't need. That's our promise.\n\nStop by, give us a call, or use our free diagnostics tool. We're here to help.`
};

const DEFAULT_SERVICES = [
  {id:1,icon:'🛞',name:'Tire Rotation',description:'Extend tire life and maintain even tread wear across all four wheels.',time_estimate:'~30 min',visible:true,sort_order:1},
  {id:2,icon:'🔧',name:'Oil Change',description:'Full synthetic or conventional oil change with filter replacement and top-off.',time_estimate:'~30–45 min',visible:true,sort_order:2},
  {id:3,icon:'🛑',name:'Brake Service',description:'Pad replacement, rotor inspection, and caliper check for all wheel positions.',time_estimate:'~1–2 hours',visible:true,sort_order:3},
  {id:4,icon:'🔋',name:'Battery Replacement',description:'Battery testing, replacement, and terminal cleaning to keep you starting every time.',time_estimate:'~30 min',visible:true,sort_order:4},
  {id:5,icon:'❄️',name:'A/C Service',description:'Refrigerant recharge, leak check, and system performance test.',time_estimate:'~1 hour',visible:true,sort_order:5},
  {id:6,icon:'🌡️',name:'Coolant Flush',description:'Drain old coolant, flush the system, and refill with fresh antifreeze.',time_estimate:'~1 hour',visible:true,sort_order:6},
  {id:7,icon:'🔍',name:'Vehicle Inspection',description:'Comprehensive multi-point inspection covering all major systems.',time_estimate:'~45 min',visible:true,sort_order:7},
  {id:8,icon:'⚙️',name:'Wheel Alignment',description:'Computer-aided alignment to manufacturer specs for better handling and tire life.',time_estimate:'~1 hour',visible:true,sort_order:8},
  {id:9,icon:'🛻',name:'Tire Mounting & Balancing',description:'Professional mounting and precision balancing for a smooth, vibration-free ride.',time_estimate:'~45 min',visible:true,sort_order:9},
  {id:10,icon:'🚗',name:'Full Tire Package',description:'4 new tires, mounted, balanced, and aligned. Brand and size selection available.',time_estimate:'~2 hours',visible:true,sort_order:10}
];

const DEFAULT_COMMUNITY = [
  {id:'c1',title:'Welcome to TireGuy Automotive!',content:'Thanks for choosing TireGuy! Check out our services or try our free Diagnostics tool.',category:'announcement',pinned:true,author:'TireGuy Team',created_at:new Date().toISOString()},
  {id:'c2',title:'Winter Tire Special — 15% Off',content:'Get 15% off all winter tires this month.',category:'promotion',pinned:false,author:'TireGuy Team',created_at:new Date().toISOString()},
  {id:'c3',title:'How often should I rotate my tires?',content:'Most manufacturers recommend every 5,000 to 7,500 miles.',category:'tip',pinned:false,author:'TireGuy Team',created_at:new Date().toISOString()}
];

const DEFAULT_FAQS = [
  {id:'f1',question:'Do you sell and install tires?',answer:'Yes! We carry a wide selection for all vehicle types. Call ahead or bring your vehicle in for sizing.',sort_order:1},
  {id:'f2',question:'How long does a tire rotation take?',answer:'About 30 minutes. No appointment needed for walk-ins, though calling ahead helps us prepare.',sort_order:2},
  {id:'f3',question:'What tire brands do you carry?',answer:'Michelin, Goodyear, Bridgestone, Cooper, and more. We can also order specific brands on request.',sort_order:3},
  {id:'f4',question:'Do you offer warranties on services?',answer:'Yes — most services include a parts and labor warranty. Ask at time of service for specifics.',sort_order:4},
  {id:'f5',question:'How do I contact TireGuy?',answer:'Call us at (620) 726-3160, email TireGuyAutomotive@gmail.com, or use the contact form on this website.',sort_order:5}
];

export const KEYS = {
  content:     'site_content_v1',
  contacts:    'contact_inquiries_v1',
  diagnostics: 'diagnostics_logs_v1',
  password:    'admin_password_v1',
  community:   'community_posts_v1',
  faqs:        'site_faqs_v1',
  apiKeys:     'api_keys_v1'
};

export async function readJson(kv, key, fallback) {
  const raw = await kv.get(key);
  if (!raw) return structuredClone(fallback);
  try { return JSON.parse(raw); } catch { return structuredClone(fallback); }
}

export async function writeJson(kv, key, value) {
  await kv.put(key, JSON.stringify(value));
}

export async function getContent(kv) {
  return await readJson(kv, KEYS.content, { settings: DEFAULT_SETTINGS, services: DEFAULT_SERVICES });
}

export async function saveContent(kv, content) {
  const safe = {
    settings: { ...DEFAULT_SETTINGS, ...(content?.settings || {}) },
    services: Array.isArray(content?.services) ? content.services : DEFAULT_SERVICES
  };
  await writeJson(kv, KEYS.content, safe);
  return safe;
}

export async function getCommunity(kv) {
  return await readJson(kv, KEYS.community, DEFAULT_COMMUNITY);
}

export async function getFaqs(kv) {
  return await readJson(kv, KEYS.faqs, DEFAULT_FAQS);
}

export async function getApiKeys(kv) {
  return await readJson(kv, KEYS.apiKeys, {});
}

export async function getPassword(kv, env) {
  return (await kv.get(KEYS.password)) || env.TG_ADMIN_BOOTSTRAP_PASSWORD || DEFAULT_PASSWORD;
}

export async function setPassword(kv, value) {
  await kv.put(KEYS.password, value);
}

export function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...extraHeaders
    }
  });
}

export function getCookie(request, name) {
  const cookie = request.headers.get('cookie') || '';
  const parts = cookie.split(';').map(v => v.trim());
  const found = parts.find(v => v.startsWith(name + '='));
  return found ? decodeURIComponent(found.split('=').slice(1).join('=')) : '';
}

export async function requireAdmin(context) {
  const token = getCookie(context.request, 'tg_admin_session');
  if (!token) return null;
  const kvKey = `session:${token}`;
  const raw = await context.env.TG_DATA.get(kvKey);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    if (data?.exp && data.exp > Date.now()) return { token, ...data };
  } catch {}
  return null;
}

export async function createSession(context) {
  const token = crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '');
  const data = { exp: Date.now() + 1000 * 60 * 60 * 24 * 7 };
  await context.env.TG_DATA.put(`session:${token}`, JSON.stringify(data), { expirationTtl: 60 * 60 * 24 * 7 });
  return token;
}

export async function listItems(kv, key) {
  const arr = await readJson(kv, key, []);
  return Array.isArray(arr) ? arr : [];
}

export async function appendItem(kv, key, item) {
  const arr = await listItems(kv, key);
  arr.push({ id: crypto.randomUUID(), created_at: new Date().toISOString(), ...item });
  await writeJson(kv, key, arr);
  return arr[arr.length - 1];
}
