export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const credentials = Buffer.from(`${process.env.OBLIO_EMAIL}:${process.env.OBLIO_SECRET}`).toString('base64');
    
    const response = await fetch('https://www.oblio.eu/api/authorize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Authorization': `Basic ${credentials}`
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.OBLIO_EMAIL,
        client_secret: process.env.OBLIO_SECRET
      }).toString()
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(200).json({
        status: 'EROARE',
        oblio_raspuns: data,
        email_folosit: process.env.OBLIO_EMAIL,
        secret_primele6: (process.env.OBLIO_SECRET||'').substring(0,6) + '...'
      });
    }
    res.status(200).json({
      status: 'CONECTAT',
      email_folosit: process.env.OBLIO_EMAIL,
      token_primit: data.access_token ? 'DA' : 'NU'
    });
  } catch (e) {
    res.status(200).json({ status: 'EROARE', mesaj: e.message });
  }
}
