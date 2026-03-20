export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const response = await fetch('https://www.oblio.eu/api/authorize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.OBLIO_EMAIL,
        client_secret: process.env.OBLIO_SECRET,
        grant_type: 'client_credentials'
      })
    });
    const data = await response.json();
    if (!response.ok) return res.status(401).json({ error: 'Autentificare eșuată', details: data });
    res.status(200).json({ access_token: data.access_token, expires_in: data.expires_in });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
