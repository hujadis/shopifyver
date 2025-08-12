// XML Generation utilities - exact 1:1 match with WooCommerce structure

// Simulate WordPress wpautop function
const wpautop = (text) => {
  if (!text) return '';
  
  // Convert line breaks to <p> tags
  const paragraphs = text.split('\n\n').filter(p => p.trim());
  return paragraphs.map(p => `<p>${p.trim()}</p>`).join('');
};

// Extract YouTube URL from text
const extractYouTubeUrl = (text) => {
  if (!text) return '';
  
  const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/;
  const match = text.match(youtubeRegex);
  return match ? `https://www.youtube.com/watch?v=${match[1]}` : '';
};

// Sanitize text for XML CDATA
const sanitizeForXml = (text) => {
  if (!text) return '';
  
  // Remove any XML special characters that might break CDATA
  return text
    .replace(/[<>&]/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim();
};

// Format price
const formatPrice = (price) => {
  if (!price) return '0.00';
  return parseFloat(price).toFixed(2);
};

// Generate product XML with exact WooCommerce structure
export const generateProductXml = (products, withSizes = true) => {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<products>\n';
  
  products.forEach(product => {
    xml += '  <product>\n';
    
    // Product unique ID
    xml += `    <product-unique-id><![CDATA[${product.id}]]></product-unique-id>\n`;
    
    // Title
    xml += `    <title><![CDATA[${sanitizeForXml(product.title)}]]></title>\n`;
    
    // Long description with wpautop simulation
    const description = wpautop(product.description || '');
    xml += `    <long-description><![CDATA[${description}]]></long-description>\n`;
    
    // Video YouTube
    const youtubeUrl = extractYouTubeUrl(product.description || '');
    xml += `    <video-youtube>${youtubeUrl}</video-youtube>\n`;
    
    // Category mapping (using hardcoded categories)
    const category = product.category || {};
    xml += `    <parent-category-name><![CDATA[${category.parent || ''}]]></parent-category-name>\n`;
    xml += `    <sub-category-name><![CDATA[${category.sub || ''}]]></sub-category-name>\n`;
    xml += `    <sub2-category-name><![CDATA[${category.sub2 || ''}]]></sub2-category-name>\n`;
    xml += `    <category-id>${category.id || ''}</category-id>\n`;
    
    // Properties (brand, etc.)
    xml += '    <properties>\n';
    if (product.brand) {
      xml += '      <property>\n';
      xml += '        <id><![CDATA[pa_brand]]></id>\n';
      xml += '        <values>\n';
      xml += `          <value><![CDATA[${sanitizeForXml(product.brand)}]]></value>\n`;
      xml += '        </values>\n';
      xml += '      </property>\n';
    }
    xml += '    </properties>\n';
    
    // Colours and modifications
    if (withSizes && product.variants && product.variants.length > 0) {
      xml += '    <colours>\n';
      
      // Group variants by color
      const colorGroups = {};
      product.variants.forEach(variant => {
        const color = variant.color || 'Default';
        if (!colorGroups[color]) {
          colorGroups[color] = [];
        }
        colorGroups[color].push(variant);
      });
      
      Object.entries(colorGroups).forEach(([color, variants]) => {
        xml += '      <colour>\n';
        xml += `        <colour-title><![CDATA[${sanitizeForXml(color)}]]></colour-title>\n`;
        
        // Images
        if (variants[0] && variants[0].image) {
          xml += '        <images>\n';
          xml += '          <image>\n';
          xml += `            <url>${variants[0].image}</url>\n`;
          xml += '          </image>\n';
          xml += '        </images>\n';
        }
        
        // Modifications (sizes)
        xml += '        <modifications>\n';
        variants.forEach(variant => {
          xml += '          <modification>\n';
          xml += `            <modification-title><![CDATA[${sanitizeForXml(variant.size || 'Default')}]]></modification-title>\n`;
          xml += `            <weight>${variant.weight || '0'}</weight>\n`;
          xml += `            <length>${variant.length || '0'}</length>\n`;
          xml += `            <height>${variant.height || '0'}</height>\n`;
          xml += `            <width>${variant.width || '0'}</width>\n`;
          
          xml += '            <attributes>\n';
          xml += '              <barcodes>\n';
          xml += `                <barcode><![CDATA[${variant.barcode || ''}]]></barcode>\n`;
          xml += '              </barcodes>\n';
          xml += `              <supplier-code><![CDATA[${variant.sku || ''}]]></supplier-code>\n`;
          xml += '            </attributes>\n';
          xml += '          </modification>\n';
        });
        xml += '        </modifications>\n';
        xml += '      </colour>\n';
      });
      
      xml += '    </colours>\n';
    } else {
      // Without sizes - empty colour-title and no modifications
      xml += '    <colours>\n';
      xml += '      <colour>\n';
      xml += '        <colour-title></colour-title>\n';
      if (product.image) {
        xml += '        <images>\n';
        xml += '          <image>\n';
        xml += `            <url>${product.image}</url>\n`;
        xml += '          </image>\n';
        xml += '        </images>\n';
      }
      xml += '      </colour>\n';
      xml += '    </colours>\n';
    }
    
    xml += '  </product>\n';
  });
  
  xml += '</products>';
  return xml;
};

// Generate stock XML with exact WooCommerce structure
export const generateStockXml = (variants, withDiscount = false) => {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<products>\n';
  
  variants.forEach(variant => {
    xml += '  <product>\n';
    xml += `    <sku>${variant.sku || ''}</sku>\n`;
    xml += `    <ean>${variant.barcode || ''}</ean>\n`;
    
    if (withDiscount && variant.compare_at_price) {
      xml += `    <price-before-discount>${formatPrice(variant.compare_at_price)}</price-before-discount>\n`;
      xml += `    <price-after-discount>${formatPrice(variant.price)}</price-after-discount>\n`;
    } else {
      xml += `    <price>${formatPrice(variant.price)}</price>\n`;
    }
    
    xml += `    <stock>${variant.inventory_quantity || 0}</stock>\n`;
    xml += `    <collectionhours>${variant.delivery_time || '24-48 hours'}</collectionhours>\n`;
    xml += '  </product>\n';
  });
  
  xml += '</products>';
  return xml;
};

// Mock Shopify API functions (in real app, these would call actual Shopify API)
export const fetchShopifyProducts = async (shop, accessToken) => {
  // Mock data - in real app this would call Shopify API
  return [
    {
      id: 123456,
      title: 'Sample Product',
      description: 'This is a sample product description with some details about the product.',
      brand: 'Sample Brand',
      category: {
        parent: 'Vaikams ir kudikiams',
        sub: 'Zaislai vaikams iki 3 metu',
        sub2: 'Stumdukai, paspiriamos masineles',
        id: '123, 456'
      },
      image: 'https://example.com/image.jpg',
      variants: [
        {
          id: 1,
          sku: 'SKU123',
          barcode: '1234567890123',
          price: '29.99',
          compare_at_price: '39.99',
          inventory_quantity: 10,
          color: 'Red',
          size: 'Large',
          weight: '0.5',
          length: '10',
          height: '5',
          width: '5',
          image: 'https://example.com/image-red.jpg',
          delivery_time: '24-48 hours'
        },
        {
          id: 2,
          sku: 'SKU124',
          barcode: '1234567890124',
          price: '29.99',
          compare_at_price: '39.99',
          inventory_quantity: 5,
          color: 'Blue',
          size: 'Medium',
          weight: '0.4',
          length: '8',
          height: '4',
          width: '4',
          image: 'https://example.com/image-blue.jpg',
          delivery_time: '24-48 hours'
        }
      ]
    }
  ];
};

export const fetchShopifyVariants = async (shop, accessToken) => {
  // Mock data - in real app this would call Shopify API
  return [
    {
      sku: 'SKU123',
      barcode: '1234567890123',
      price: '29.99',
      compare_at_price: '39.99',
      inventory_quantity: 10,
      delivery_time: '24-48 hours'
    },
    {
      sku: 'SKU124',
      barcode: '1234567890124',
      price: '29.99',
      compare_at_price: '39.99',
      inventory_quantity: 5,
      delivery_time: '24-48 hours'
    }
  ];
};
