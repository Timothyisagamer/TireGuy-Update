import { appendItem, getApiKeys, json, KEYS } from '../_utils.js';

export async function onRequestPost(context) {
  const body = await context.request.json().catch(() => null);
  if (!body?.vehicle || !body?.symptoms) return json({ error: 'Vehicle and symptoms are required.' }, 400);

  let result = '';

  // Try OpenRouter AI if key is configured
  const apiKeys = await getApiKeys(context.env.TG_DATA);
  const openrouterKey = apiKeys.openrouter || context.env.OPENROUTER_API_KEY || '';

  if (openrouterKey) {
    try {
      const prompt = `You are an automotive diagnostic assistant for TireGuy Automotive, a tire and auto care shop in Burns, KS. A customer has submitted the following vehicle information:

Vehicle: ${body.vehicle}
Mileage: ${body.mileage || 'Not specified'}
Symptoms: ${body.symptoms}
When did it start: ${body.when || 'Not specified'}
Additional details: ${body.extra || 'None'}

Provide a concise, professional diagnostic report in exactly this format:
MOST LIKELY CAUSE(S)
[2-3 sentences describing probable causes]

SEVERITY
[Low / Medium / High — one word with brief reason]

RECOMMENDED SERVICE
[Specific service name]

ESTIMATED COST RANGE
[Realistic range or "Inspection required for accurate estimate"]

SAFE TO DRIVE?
[Yes / With caution / No — with brief reason]

IMMEDIATE NEXT STEP
[One actionable sentence]`;

      const aiRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openrouterKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://tireguyautomotive.com',
          'X-Title': 'TireGuy Automotive Diagnostics'
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 600
        })
      });

      if (aiRes.ok) {
        const aiData = await aiRes.json();
        result = aiData.choices?.[0]?.message?.content?.trim() || '';
      }
    } catch (e) {
      // Fall through to client-side result
    }
  }

  // Fall back to client-provided result if AI failed or no key
  if (!result) result = body.result || 'Diagnostic analysis unavailable. Please bring your vehicle in for a hands-on inspection.';

  const saved = await appendItem(context.env.TG_DATA, KEYS.diagnostics, {
    customer_name: body.customer_name || 'Guest',
    vehicle: body.vehicle,
    mileage: body.mileage,
    symptoms: body.symptoms,
    when: body.when,
    extra: body.extra,
    result,
    ai_powered: !!openrouterKey
  });

  return json({ ok: true, log: saved, result, ai_powered: !!openrouterKey });
}
