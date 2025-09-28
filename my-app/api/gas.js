export default async function handler(req, res) {
  // CORS for browser calls
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // quick health check (GET /api/gas)
  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, route: '/api/gas', tip: 'POST {action:"ping"}' });
  }

  const GAS = process.env.GAS_WEBAPP_URL;
  if (!GAS) {
    return res.status(500).json({ ok: false, error: 'Missing env GAS_WEBAPP_URL' });
  }

  try {
    const upstream = await fetch(GAS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body || {})
    });

    // If Apps Script returned HTML (error page), forward a clean JSON error
    const text = await upstream.text();
    try {
      const json = JSON.parse(text);
      return res.status(200).json(json);
    } catch {
      return res.status(502).json({
        ok: false,
        error: 'Upstream did not return JSON. Check doPost(action).',
        upstreamSample: text.slice(0, 120)
      });
    }
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e) });
  }
}
