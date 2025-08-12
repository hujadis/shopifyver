// Vercel serverless function to proxy Shopify API calls
export default async function handler(req, res) {
  console.log('API called:', req.method, req.url);
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Request body:', req.body);
    const { shop, accessToken, endpoint, params = {} } = req.body;

    if (!shop || !accessToken || !endpoint) {
      console.log('Missing parameters:', { shop: !!shop, accessToken: !!accessToken, endpoint: !!endpoint });
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Clean shop URL
    const cleanShop = shop.replace(/^https?:\/\//, '').replace(/\/$/, '');
    
    // Build API URL
    const apiUrl = `https://${cleanShop}/admin/api/2024-01/${endpoint}`;
    
    // Add query parameters
    const url = new URL(apiUrl);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    // Make request to Shopify API
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ 
        error: `Shopify API error: ${response.status}`,
        details: errorText
      });
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('Shopify API proxy error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
