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

// Transform Shopify product to match our XML structure
export const transformShopifyProduct = (shopifyProduct, categoryMapping) => {
  const mappedCategory = categoryMapping[shopifyProduct.product_type] || categoryMapping[shopifyProduct.collections?.[0]?.title] || {};
  
  return {
    id: shopifyProduct.id,
    title: shopifyProduct.title,
    description: shopifyProduct.body_html || '',
    brand: shopifyProduct.vendor || '',
    category: {
      parent: mappedCategory.parent || '',
      sub: mappedCategory.sub || '',
      sub2: mappedCategory.sub2 || '',
      id: mappedCategory.id || ''
    },
    image: shopifyProduct.images?.[0]?.src || '',
    variants: shopifyProduct.variants?.map(variant => ({
      id: variant.id,
      sku: variant.sku || '',
      barcode: variant.barcode || '',
      price: variant.price || '0.00',
      compare_at_price: variant.compare_at_price || '',
      inventory_quantity: variant.inventory_quantity || 0,
      color: variant.option1 || '',
      size: variant.option2 || '',
      weight: variant.weight || '0',
      length: '10', // Default values - could be enhanced
      height: '5',
      width: '5',
      image: shopifyProduct.images?.[0]?.src || '',
      delivery_time: '24-48 hours'
    })) || []
  };
};
