import React, { useState } from 'react';
import { Settings as SettingsIcon, Upload, Download, Trash2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [settings, setSettings] = useState({
    defaultDeliveryTime: '24-48 hours',
    cacheEnabled: true,
    cacheDuration: 7200,
    rateLimitEnabled: true,
    rateLimitRequests: 100,
    rateLimitWindow: 900,
  });

  const [csvFile, setCsvFile] = useState(null);

  const handleSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
      toast.success('CSV file uploaded successfully!');
    } else {
      toast.error('Please select a valid CSV file');
    }
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to backend
    toast.success('Settings saved successfully!');
  };

  const handleClearCache = () => {
    // In a real app, this would clear cache
    toast.success('Cache cleared successfully!');
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'shopify-xml-exporter-settings.json';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Settings exported successfully!');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">
          Configure your Shopify XML exporter settings
        </p>
      </div>

      {/* Delivery Times */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Delivery Times</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Delivery Time
            </label>
            <input
              type="text"
              name="defaultDeliveryTime"
              value={settings.defaultDeliveryTime}
              onChange={handleSettingChange}
              placeholder="24-48 hours"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Default delivery time for products
            </p>
          </div>
        </div>
      </div>

      {/* Caching */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Caching</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Enable Caching</h3>
              <p className="text-sm text-gray-500">Cache XML exports for better performance</p>
            </div>
            <input
              type="checkbox"
              name="cacheEnabled"
              checked={settings.cacheEnabled}
              onChange={handleSettingChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          
          {settings.cacheEnabled && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cache Duration (seconds)
              </label>
              <input
                type="number"
                name="cacheDuration"
                value={settings.cacheDuration}
                onChange={handleSettingChange}
                min="300"
                max="86400"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                How long to cache XML exports (300-86400 seconds)
              </p>
            </div>
          )}
          
          <button
            onClick={handleClearCache}
            className="flex items-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Cache
          </button>
        </div>
      </div>

      {/* Rate Limiting */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Rate Limiting</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Enable Rate Limiting</h3>
              <p className="text-sm text-gray-500">Limit API requests to prevent abuse</p>
            </div>
            <input
              type="checkbox"
              name="rateLimitEnabled"
              checked={settings.rateLimitEnabled}
              onChange={handleSettingChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          
          {settings.rateLimitEnabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requests per Window
                </label>
                <input
                  type="number"
                  name="rateLimitRequests"
                  value={settings.rateLimitRequests}
                  onChange={handleSettingChange}
                  min="10"
                  max="1000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Window (seconds)
                </label>
                <input
                  type="number"
                  name="rateLimitWindow"
                  value={settings.rateLimitWindow}
                  onChange={handleSettingChange}
                  min="60"
                  max="3600"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category Mapping */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Category Mapping</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Categories CSV
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {csvFile && (
                <span className="text-sm text-green-600">
                  ✓ {csvFile.name}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Upload a CSV file with category mappings (separator: `)
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Actions</h2>
        
        <div className="flex space-x-4">
          <button
            onClick={handleSaveSettings}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </button>
          
          <button
            onClick={handleExportSettings}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Settings
          </button>
        </div>
      </div>

      {/* API Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">API Information</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Environment Variables</h3>
            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <span className="text-sm font-mono text-gray-700">SHOPIFY_ACCESS_TOKEN</span>
                <span className="text-sm text-gray-500">Required</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <span className="text-sm font-mono text-gray-700">SHOPIFY_API_KEY</span>
                <span className="text-sm text-gray-500">Optional</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-900">API Endpoints</h3>
            <div className="mt-2 space-y-2">
              <div className="p-3 bg-gray-50 rounded-md">
                <code className="text-sm text-gray-700">
                  GET /api/xml/products?shop=your-shop.myshopify.com&with_size=true
                </code>
              </div>
              <div className="p-3 bg-gray-50 rounded-md">
                <code className="text-sm text-gray-700">
                  GET /api/xml/stock?shop=your-shop.myshopify.com&discount=false
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
