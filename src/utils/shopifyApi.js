// Shopify API utilities for fetching categories and products

// Fetch Shopify collections (categories)
export const fetchShopifyCollections = async (shop, accessToken) => {
  if (!shop || !accessToken) {
    throw new Error('Shop URL and Access Token are required');
  }

  try {
    // Clean shop URL - remove https:// if present
    const cleanShop = shop.replace(/^https?:\/\//, '').replace(/\/$/, '');
    
    // Use GET request with query parameters to avoid POST issues
    const params = new URLSearchParams({
      shop: cleanShop,
      accessToken,
      endpoint: 'collections.json'
    });
    
    const response = await fetch(`/api/shopify?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
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

  try {
    // Clean shop URL - remove https:// if present
    const cleanShop = shop.replace(/^https?:\/\//, '').replace(/\/$/, '');
    
    // Use GET request with query parameters to avoid POST issues
    const params = new URLSearchParams({
      shop: cleanShop,
      accessToken,
      endpoint: 'products.json',
      limit: '250'
    });
    
    const response = await fetch(`/api/shopify?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
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

  try {
    // Clean shop URL - remove https:// if present
    const cleanShop = shop.replace(/^https?:\/\//, '').replace(/\/$/, '');
    
    // Use GET request with query parameters to avoid POST issues
    const params = new URLSearchParams({
      shop: cleanShop,
      accessToken,
      endpoint: 'products.json',
      limit: '250',
      fields: 'variants'
    });
    
    const response = await fetch(`/api/shopify?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
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
