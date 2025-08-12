// Test Shopify products API access
export default async function handler(req, res) {
  try {
    const { shop, accessToken } = req.query;
    
    if (!shop || !accessToken) {
      return res.status(400).json({ 
        error: 'Missing shop or accessToken',
        example: '/api/test-products?shop=nkpxup-pc.myshopify.com&accessToken=shpat_xxx'
      });
    }

    console.log('Testing products for shop:', shop);
    
    // Test products endpoint
    const productsResponse = await fetch(`https://${shop}/admin/api/2024-01/products.json?limit=5`, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json'
      }
    });

    console.log('Products API response status:', productsResponse.status);
    
    let productsData = null;
    if (productsResponse.ok) {
      productsData = await productsResponse.json();
    } else {
      const errorText = await productsResponse.text();
      console.log('Products API error:', errorText);
    }

    res.status(200).json({
      success: true,
      products: {
        status: productsResponse.status,
        count: productsData?.products?.length || 0,
        data: productsData?.products?.slice(0, 3) || [] // First 3 products
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
