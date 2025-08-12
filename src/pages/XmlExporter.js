import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Download, Copy, ExternalLink, Eye, EyeOff, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateProductXml, generateStockXml, transformShopifyProduct } from '../utils/xmlGenerator';
import { fetchShopifyCollections, fetchShopifyProducts, fetchShopifyVariants } from '../utils/shopifyApi';
import { getParentCategories, getSubCategories, getSub2Categories } from '../utils/categories';

const XmlExporter = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    shop: searchParams.get('shop') || '',
    accessToken: '',
    type: searchParams.get('type') || 'products',
    withSizes: searchParams.get('sizes') === 'true',
    discount: searchParams.get('discount') === 'true',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [xmlResult, setXmlResult] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [shopifyCollections, setShopifyCollections] = useState([]);
  const [isLoadingCollections, setIsLoadingCollections] = useState(false);
  const [categoryMapping, setCategoryMapping] = useState({});
  const [selectedMapping, setSelectedMapping] = useState({
    shopifyCategory: '',
    pluginParent: '',
    pluginSub: '',
    pluginSub2: ''
  });

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

  // Load Shopify collections when credentials are provided
  const loadShopifyCollections = async () => {
    if (!formData.shop || !formData.accessToken) {
      toast.error('Please enter both Shop URL and Access Token');
      return;
    }
    
    setIsLoadingCollections(true);
    try {
      const collections = await fetchShopifyCollections(formData.shop, formData.accessToken);
      setShopifyCollections(collections);
      toast.success(`Loaded ${collections.length} Shopify collections`);
    } catch (error) {
      console.error('Error loading collections:', error);
      
      // Show more specific error messages
      if (error.message.includes('401')) {
        toast.error('Invalid Access Token. Please check your credentials.');
      } else if (error.message.includes('404')) {
        toast.error('Shop not found. Please check your shop URL.');
      } else if (error.message.includes('403')) {
        toast.error('Access denied. Please check your app permissions.');
      } else if (error.message.includes('Custom domain not supported')) {
        toast.error('Custom domains are not supported. Use your Shopify shop URL (e.g., "your-shop.myshopify.com")');
      } else {
        toast.error(`Failed to load collections: ${error.message}`);
      }
    } finally {
      setIsLoadingCollections(false);
    }
  };

  // Add category mapping
  const addCategoryMapping = () => {
    if (!selectedMapping.shopifyCategory || !selectedMapping.pluginParent) {
      toast.error('Please select both Shopify category and plugin parent category');
      return;
    }

    const mapping = {
      [selectedMapping.shopifyCategory]: {
        parent: selectedMapping.pluginParent,
        sub: selectedMapping.pluginSub,
        sub2: selectedMapping.pluginSub2,
        id: '123, 456' // Mock category ID
      }
    };

    setCategoryMapping(prev => ({ ...prev, ...mapping }));
    setSelectedMapping({
      shopifyCategory: '',
      pluginParent: '',
      pluginSub: '',
      pluginSub2: ''
    });
    toast.success('Category mapping added successfully!');
  };

  // Remove category mapping
  const removeCategoryMapping = (shopifyCategory) => {
    setCategoryMapping(prev => {
      const newMapping = { ...prev };
      delete newMapping[shopifyCategory];
      return newMapping;
    });
    toast.success('Category mapping removed');
  };

  const handleExport = async () => {
    if (!formData.shop) {
      toast.error('Please enter your Shopify shop URL');
      return;
    }

    if (!formData.accessToken) {
      toast.error('Please enter your Shopify access token');
      return;
    }

    setIsLoading(true);
    const url = generateApiUrl();
    setApiUrl(url);

    try {
      let xmlResult = '';
      
      if (formData.type === 'products') {
        // Fetch products from Shopify
        const shopifyProducts = await fetchShopifyProducts(formData.shop, formData.accessToken);
        
        // Transform products with category mapping
        const transformedProducts = shopifyProducts.map(product => 
          transformShopifyProduct(product, categoryMapping)
        );
        
        // Generate product XML
        xmlResult = generateProductXml(transformedProducts, formData.withSizes);
        toast.success(`Generated XML for ${transformedProducts.length} products`);
      } else {
        // Fetch variants from Shopify
        const variants = await fetchShopifyVariants(formData.shop, formData.accessToken);
        
        // Generate stock XML
        xmlResult = generateStockXml(variants, formData.discount);
        toast.success(`Generated XML for ${variants.length} variants`);
      }
      
      setXmlResult(xmlResult);
    } catch (error) {
      console.error('Export error:', error);
      
      // Show more specific error messages
      if (error.message.includes('401')) {
        toast.error('Invalid Access Token. Please check your credentials.');
      } else if (error.message.includes('404')) {
        toast.error('Shop not found. Please check your shop URL.');
      } else if (error.message.includes('403')) {
        toast.error('Access denied. Please check your app permissions.');
      } else {
        toast.error(`Failed to generate XML: ${error.message}`);
      }
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

          {/* Access Token */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shopify Access Token
            </label>
            <div className="relative">
              <input
                type={showToken ? "text" : "password"}
                name="accessToken"
                value={formData.accessToken}
                onChange={handleInputChange}
                placeholder="shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showToken ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Your Shopify private app access token
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

        {/* Load Shopify Collections */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Shopify Collections</h3>
            <button
              onClick={loadShopifyCollections}
              disabled={!formData.shop || !formData.accessToken || isLoadingCollections}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingCollections ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Load Collections
                </>
              )}
            </button>
          </div>
          
          {shopifyCollections.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Available Shopify Collections:</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {shopifyCollections.map(collection => (
                  <div key={collection.id} className="text-sm text-gray-600">
                    • {collection.title} ({collection.products_count} products)
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Category Mapping */}
        {formData.type === 'products' && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Mapping</h3>
            
            {/* Add New Mapping */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Add Category Mapping</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Shopify Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shopify Category
                  </label>
                  <select
                    value={selectedMapping.shopifyCategory}
                    onChange={(e) => setSelectedMapping(prev => ({
                      ...prev,
                      shopifyCategory: e.target.value
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Shopify category</option>
                    {shopifyCollections.map(collection => (
                      <option key={collection.id} value={collection.title}>{collection.title}</option>
                    ))}
                  </select>
                </div>

                {/* Plugin Parent Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plugin Parent Category
                  </label>
                  <select
                    value={selectedMapping.pluginParent}
                    onChange={(e) => setSelectedMapping(prev => ({
                      ...prev,
                      pluginParent: e.target.value,
                      pluginSub: '',
                      pluginSub2: ''
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select parent category</option>
                    {getParentCategories().map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Plugin Sub Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plugin Sub Category
                  </label>
                  <select
                    value={selectedMapping.pluginSub}
                    onChange={(e) => setSelectedMapping(prev => ({
                      ...prev,
                      pluginSub: e.target.value,
                      pluginSub2: ''
                    }))}
                    disabled={!selectedMapping.pluginParent}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">Select sub category</option>
                    {selectedMapping.pluginParent && getSubCategories(selectedMapping.pluginParent).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Plugin Sub2 Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plugin Sub2 Category
                  </label>
                  <select
                    value={selectedMapping.pluginSub2}
                    onChange={(e) => setSelectedMapping(prev => ({
                      ...prev,
                      pluginSub2: e.target.value
                    }))}
                    disabled={!selectedMapping.pluginSub}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">Select sub2 category</option>
                    {selectedMapping.pluginSub && getSub2Categories(selectedMapping.pluginParent, selectedMapping.pluginSub).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mt-4">
                <button
                  onClick={addCategoryMapping}
                  disabled={!selectedMapping.shopifyCategory || !selectedMapping.pluginParent}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Mapping
                </button>
              </div>
            </div>

            {/* Current Mappings */}
            {Object.keys(categoryMapping).length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Current Category Mappings</h4>
                <div className="space-y-2">
                  {Object.entries(categoryMapping).map(([shopifyCategory, pluginCategory]) => (
                    <div key={shopifyCategory} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {shopifyCategory} → {pluginCategory.parent}
                        </div>
                        <div className="text-xs text-gray-500">
                          {pluginCategory.sub && `${pluginCategory.sub}`}
                          {pluginCategory.sub2 && ` → ${pluginCategory.sub2}`}
                        </div>
                      </div>
                      <button
                        onClick={() => removeCategoryMapping(shopifyCategory)}
                        className="ml-2 px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <p className="mt-2 text-sm text-gray-500">
              Map your Shopify categories to the exact WordPress plugin category structure
            </p>
          </div>
        )}

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
