// Test Shopify API access
export default async function handler(req, res) {
  try {
    const { shop, accessToken } = req.query;
    
    if (!shop || !accessToken) {
      return res.status(400).json({ 
        error: 'Missing shop or accessToken',
        example: '/api/test-shopify?shop=nkpxup-pc.myshopify.com&accessToken=shpat_xxx'
      });
    }

    // Test 1: Basic shop info
    console.log('Testing shop:', shop);
    console.log('Testing with token:', accessToken ? 'provided' : 'missing');
    
    const shopResponse = await fetch(`https://${shop}/admin/api/2024-01/shop.json`, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json'
      }
    });

    console.log('Shop API response status:', shopResponse.status);
    
    if (!shopResponse.ok) {
      const errorText = await shopResponse.text();
      return res.status(shopResponse.status).json({
        error: 'Shop API failed',
        status: shopResponse.status,
        details: errorText
      });
    }

    const shopData = await shopResponse.json();
    
    // Test 2: Collections endpoint
    const collectionsResponse = await fetch(`https://${shop}/admin/api/2024-01/collections.json`, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json'
      }
    });

    console.log('Collections API response status:', collectionsResponse.status);
    
    let collectionsData = null;
    if (collectionsResponse.ok) {
      collectionsData = await collectionsResponse.json();
    }

    res.status(200).json({
      success: true,
      shop: {
        name: shopData.shop?.name,
        domain: shopData.shop?.domain,
        email: shopData.shop?.email
      },
      collections: {
        status: collectionsResponse.status,
        count: collectionsData?.collections?.length || 0,
        data: collectionsData?.collections?.slice(0, 3) || [] // First 3 collections
      }
    });

  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({ 
      error: 'Test failed',
      details: error.message 
    });
  }
}
