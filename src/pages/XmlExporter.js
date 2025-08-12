import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Download, FileText, Settings as SettingsIcon, Copy, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

const XmlExporter = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    shop: searchParams.get('shop') || '',
    type: searchParams.get('type') || 'products',
    withSizes: searchParams.get('sizes') === 'true',
    discount: searchParams.get('discount') === 'true',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [xmlResult, setXmlResult] = useState('');
  const [apiUrl, setApiUrl] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const generateApiUrl = () => {
    const { shop, type, withSizes, discount } = formData;
    if (!shop) return '';

    const baseUrl = window.location.origin;
    if (type === 'products') {
      return `${baseUrl}/api/xml/products?shop=${shop}&with_size=${withSizes}`;
    } else {
      return `${baseUrl}/api/xml/stock?shop=${shop}&discount=${discount}`;
    }
  };

  const handleExport = async () => {
    if (!formData.shop) {
      toast.error('Please enter your Shopify shop URL');
      return;
    }

    setIsLoading(true);
    const url = generateApiUrl();
    setApiUrl(url);

    try {
      // In a real app, this would call your backend API
      // For now, we'll simulate the response
      toast.success('XML export generated successfully!');
      
      // Simulate XML response
      const mockXml = `<?xml version="1.0" encoding="UTF-8"?>
<products>
  <product>
    <product-unique-id><![CDATA[123456]]></product-unique-id>
    <title><![CDATA[Sample Product]]></title>
    <long-description><![CDATA[<p>Product description</p>]]></long-description>
    <video-youtube></video-youtube>
    <parent-category-name><![CDATA[Vaikams ir kudikiams]]></parent-category-name>
    <sub-category-name><![CDATA[Zaislai vaikams iki 3 metu]]></sub-category-name>
    <sub2-category-name><![CDATA[Stumdukai, paspiriamos masineles]]></sub2-category-name>
    <category-id>123, 456</category-id>
    <properties>
      <property>
        <id><![CDATA[pa_brand]]></id>
        <values>
          <value><![CDATA[Sample Brand]]></value>
        </values>
      </property>
    </properties>
    <colours>
      <colour>
        <colour-title><![CDATA[Red]]></colour-title>
        <images>
          <image>
            <url>https://example.com/image.jpg</url>
          </image>
        </images>
        <modifications>
          <modification>
            <modification-title><![CDATA[Large]]></modification-title>
            <weight>0.5</weight>
            <length>10</length>
            <height>5</height>
            <width>5</width>
            <attributes>
              <barcodes>
                <barcode><![CDATA[1234567890123]]></barcode>
              </barcodes>
              <supplier-code><![CDATA[SKU123]]></supplier-code>
            </attributes>
          </modification>
        </modifications>
      </colour>
    </colours>
  </product>
</products>`;
      
      setXmlResult(mockXml);
    } catch (error) {
      toast.error('Failed to generate XML export');
      console.error('Export error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const downloadXml = () => {
    const blob = new Blob([xmlResult], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shopify-export-${formData.type}-${Date.now()}.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('XML file downloaded!');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">XML Exporter</h1>
        <p className="mt-2 text-gray-600">
          Generate XML exports with the same structure as your WooCommerce plugin
        </p>
      </div>

      {/* Configuration Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Export Configuration</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shop URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shopify Shop URL
            </label>
            <input
              type="text"
              name="shop"
              value={formData.shop}
              onChange={handleInputChange}
              placeholder="your-shop.myshopify.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Enter your Shopify shop URL without https://
            </p>
          </div>

          {/* Export Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Export Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="products">Products</option>
              <option value="stock">Stock & Prices</option>
            </select>
          </div>

          {/* Products Options */}
          {formData.type === 'products' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Include Sizes
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="withSizes"
                  checked={formData.withSizes}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Include product variations and size information
                </span>
              </div>
            </div>
          )}

          {/* Stock Options */}
          {formData.type === 'stock' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Include Discounts
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="discount"
                  checked={formData.discount}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Include promotional pricing information
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Export Button */}
        <div className="mt-6">
          <button
            onClick={handleExport}
            disabled={isLoading || !formData.shop}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Generate XML Export
              </>
            )}
          </button>
        </div>
      </div>

      {/* API URL Display */}
      {apiUrl && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">API Endpoint</h3>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={apiUrl}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
            />
            <button
              onClick={() => copyToClipboard(apiUrl)}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              <Copy className="h-4 w-4" />
            </button>
            <a
              href={apiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Use this URL to integrate with external systems
          </p>
        </div>
      )}

      {/* XML Result */}
      {xmlResult && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Generated XML</h3>
            <button
              onClick={downloadXml}
              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Download XML
            </button>
          </div>
          <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto text-sm">
            <code>{xmlResult}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

export default XmlExporter;
