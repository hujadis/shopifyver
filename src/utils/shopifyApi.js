// Shopify API utilities for fetching categories and products

// Fetch Shopify collections (categories)
export const fetchShopifyCollections = async (shop, accessToken) => {
  try {
    const response = await fetch(`https://${shop}/admin/api/2024-01/collections.json`, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status}`);
    }

    const data = await response.json();
    return data.collections || [];
  } catch (error) {
    console.error('Error fetching Shopify collections:', error);
    // Return mock data for development
    return [
      {
        id: 1,
        title: 'Electronics',
        handle: 'electronics',
        products_count: 25
      },
      {
        id: 2,
        title: 'Clothing',
        handle: 'clothing',
        products_count: 50
      },
      {
        id: 3,
        title: 'Home & Garden',
        handle: 'home-garden',
        products_count: 30
      },
      {
        id: 4,
        title: 'Sports & Outdoors',
        handle: 'sports-outdoors',
        products_count: 20
      },
      {
        id: 5,
        title: 'Books',
        handle: 'books',
        products_count: 15
      }
    ];
  }
};

// Fetch Shopify products
export const fetchShopifyProducts = async (shop, accessToken) => {
  try {
    const response = await fetch(`https://${shop}/admin/api/2024-01/products.json?limit=250`, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status}`);
    }

    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('Error fetching Shopify products:', error);
    // Return mock data for development
    return [
      {
        id: 123456,
        title: 'Sample Product',
        body_html: 'This is a sample product description with some details about the product.',
        vendor: 'Sample Brand',
        product_type: 'Electronics',
        tags: 'electronics, gadget',
        variants: [
          {
            id: 1,
            sku: 'SKU123',
            barcode: '1234567890123',
            price: '29.99',
            compare_at_price: '39.99',
            inventory_quantity: 10,
            option1: 'Red',
            option2: 'Large',
            weight: 0.5,
            weight_unit: 'kg',
            requires_shipping: true
          },
          {
            id: 2,
            sku: 'SKU124',
            barcode: '1234567890124',
            price: '29.99',
            compare_at_price: '39.99',
            inventory_quantity: 5,
            option1: 'Blue',
            option2: 'Medium',
            weight: 0.4,
            weight_unit: 'kg',
            requires_shipping: true
          }
        ],
        options: [
          {
            name: 'Color',
            values: ['Red', 'Blue']
          },
          {
            name: 'Size',
            values: ['Large', 'Medium']
          }
        ],
        images: [
          {
            id: 1,
            src: 'https://example.com/image.jpg',
            alt: 'Sample Product'
          }
        ],
        collections: [
          {
            id: 1,
            title: 'Electronics'
          }
        ]
      }
    ];
  }
};

// Fetch Shopify product variants for stock export
export const fetchShopifyVariants = async (shop, accessToken) => {
  try {
    const response = await fetch(`https://${shop}/admin/api/2024-01/products.json?limit=250&fields=variants`, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status}`);
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

    return variants;
  } catch (error) {
    console.error('Error fetching Shopify variants:', error);
    // Return mock data for development
    return [
      {
        id: 1,
        sku: 'SKU123',
        barcode: '1234567890123',
        price: '29.99',
        compare_at_price: '39.99',
        inventory_quantity: 10,
        product_title: 'Sample Product',
        product_id: 123456
      },
      {
        id: 2,
        sku: 'SKU124',
        barcode: '1234567890124',
        price: '29.99',
        compare_at_price: '39.99',
        inventory_quantity: 5,
        product_title: 'Sample Product',
        product_id: 123456
      }
    ];
  }
};
