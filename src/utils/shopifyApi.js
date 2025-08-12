// Shopify API utilities for fetching categories and products

// Fetch Shopify collections (categories)
export const fetchShopifyCollections = async (shop, accessToken) => {
  if (!shop || !accessToken) {
    throw new Error('Shop URL and Access Token are required');
  }

  // Ensure shop URL has proper format
  const cleanShop = shop.replace(/^https?:\/\//, '').replace(/\/$/, '');
  
  try {
    const response = await fetch(`https://${cleanShop}/admin/api/2024-01/collections.json`, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Shopify API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Shopify collections fetched:', data.collections?.length || 0, 'collections');
    return data.collections || [];
  } catch (error) {
    console.error('Error fetching Shopify collections:', error);
    throw error; // Re-throw to show real error to user
  }
};

// Fetch Shopify products
export const fetchShopifyProducts = async (shop, accessToken) => {
  if (!shop || !accessToken) {
    throw new Error('Shop URL and Access Token are required');
  }

  // Ensure shop URL has proper format
  const cleanShop = shop.replace(/^https?:\/\//, '').replace(/\/$/, '');
  
  try {
    const response = await fetch(`https://${cleanShop}/admin/api/2024-01/products.json?limit=250`, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Shopify API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Shopify products fetched:', data.products?.length || 0, 'products');
    return data.products || [];
  } catch (error) {
    console.error('Error fetching Shopify products:', error);
    throw error; // Re-throw to show real error to user
  }
};

// Fetch Shopify product variants for stock export
export const fetchShopifyVariants = async (shop, accessToken) => {
  if (!shop || !accessToken) {
    throw new Error('Shop URL and Access Token are required');
  }

  // Ensure shop URL has proper format
  const cleanShop = shop.replace(/^https?:\/\//, '').replace(/\/$/, '');
  
  try {
    const response = await fetch(`https://${cleanShop}/admin/api/2024-01/products.json?limit=250&fields=variants`, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Shopify API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const variants = [];
    
    data.products.forEach(product => {
      product.variants.forEach(variant => {
        variants.push({
          ...variant,
          product_title: product.title,
          product_id: product.id
        });
      });
    });

    console.log('Shopify variants fetched:', variants.length, 'variants');
    return variants;
  } catch (error) {
    console.error('Error fetching Shopify variants:', error);
    throw error; // Re-throw to show real error to user
  }
};
