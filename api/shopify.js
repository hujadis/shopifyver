// Vercel serverless function to proxy Shopify API calls
export default async function handler(req, res) {
  try {
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

  // Handle both GET and POST requests
  let shop, accessToken, endpoint, params = {};
  
  if (req.method === 'GET') {
    // Extract parameters from query string
    shop = req.query.shop;
    accessToken = req.query.accessToken;
    endpoint = req.query.endpoint;
    params = {
      limit: req.query.limit,
      fields: req.query.fields
    };
    
    console.log('GET request parameters:', { 
      shop: shop ? 'provided' : 'missing', 
      accessToken: accessToken ? 'provided' : 'missing', 
      endpoint: endpoint || 'missing',
      params: Object.keys(params).length > 0 ? 'provided' : 'none'
    });
    
    // If no endpoint specified, return test response
    if (!endpoint) {
      return res.status(200).json({ 
        message: 'Shopify API proxy is working!',
        method: req.method,
        timestamp: new Date().toISOString()
      });
    }
  } else if (req.method === 'POST') {
    // Extract parameters from request body
    console.log('Request body:', req.body);
    ({ shop, accessToken, endpoint, params = {} } = req.body);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {

    if (!shop || !accessToken || !endpoint) {
      console.log('Missing parameters:', { shop: !!shop, accessToken: !!accessToken, endpoint: !!endpoint });
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Clean shop URL - remove https:// and trailing slash
    let cleanShop = shop.replace(/^https?:\/\//, '').replace(/\/$/, '');
    console.log('Original shop URL:', shop);
    console.log('Cleaned shop URL:', cleanShop);
    
    // If it's not a myshopify.com URL, try to construct it
    if (!cleanShop.includes('.myshopify.com')) {
      // For custom domains like "leclat.lt", we need to find the actual Shopify shop
      // This is a common issue - custom domains don't work with Shopify Admin API
      console.log('Custom domain detected:', cleanShop);
      console.log('Note: Custom domains like "leclat.lt" cannot be used with Shopify Admin API');
      console.log('You need to use the actual Shopify shop URL (e.g., "your-shop.myshopify.com")');
      
      return res.status(400).json({ 
        error: 'Custom domain not supported',
        details: `The domain "${cleanShop}" appears to be a custom domain. Shopify Admin API requires the actual Shopify shop URL (e.g., "your-shop.myshopify.com"). Please check your Shopify admin for the correct shop URL.`
      });
    }
    
    // Build API URL
    const apiUrl = `https://${cleanShop}/admin/api/2024-01/${endpoint}`;
    
    // Add query parameters
    const url = new URL(apiUrl);
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.append(key, value);
      }
    });

    console.log('Making Shopify API request to:', url.toString());
    console.log('With headers:', { 'X-Shopify-Access-Token': accessToken ? 'provided' : 'missing' });

    // Make request to Shopify API
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json'
      }
    });

    console.log('Shopify API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Shopify API error response:', errorText);
      return res.status(response.status).json({ 
        error: `Shopify API error: ${response.status}`,
        details: errorText
      });
    }

    const data = await response.json();
    console.log('Shopify API success, data keys:', Object.keys(data));
    res.status(200).json(data);

  } catch (error) {
    console.error('Shopify API proxy error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
  } catch (error) {
    console.error('Outer handler error:', error);
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
}
