// api/gas.js
export default async function handler(req, res) {
  // Let the browser call us directly
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const r = await fetch(process.env.GAS_WEBAPP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body || {})
    });
    const json = await r.json();
    res.status(200).json(json);
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
}