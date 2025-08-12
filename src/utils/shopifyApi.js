// Shopify API utilities for fetching categories and products

// Fetch Shopify product types (categories)
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
    
    // Extract unique product types from products
    const productTypes = [...new Set(data.products?.map(product => product.product_type).filter(Boolean))];
    
    // Convert to collection-like format
    const collections = productTypes.map((type, index) => ({
      id: index + 1,
      title: type,
      handle: type.toLowerCase().replace(/\s+/g, '-'),
      products_count: data.products?.filter(product => product.product_type === type).length || 0
    }));
    
    console.log('Shopify product types fetched:', collections.length, 'types');
    return collections;
  } catch (error) {
    console.error('Error fetching Shopify product types:', error);
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
