import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download, Settings as SettingsIcon, BarChart3, Clock, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { label: 'Total Products', value: '1,234', icon: FileText, color: 'blue' },
    { label: 'Last Export', value: '2 hours ago', icon: Clock, color: 'green' },
    { label: 'Cache Hit Rate', value: '87%', icon: BarChart3, color: 'purple' },
    { label: 'Status', value: 'Active', icon: CheckCircle, color: 'green' },
  ];

  const quickActions = [
    {
      title: 'Export Products with Sizes',
      description: 'Generate XML with product variations and size information',
      icon: Download,
      href: '/xml-exporter?type=products&sizes=true',
      color: 'blue',
    },
    {
      title: 'Export Products without Sizes',
      description: 'Generate XML with basic product information',
      icon: FileText,
      href: '/xml-exporter?type=products&sizes=false',
      color: 'green',
    },
    {
      title: 'Export Stock with Discount',
      description: 'Generate stock XML including promotional pricing',
      icon: BarChart3,
      href: '/xml-exporter?type=stock&discount=true',
      color: 'purple',
    },
    {
      title: 'Export Stock without Discount',
      description: 'Generate stock XML with regular pricing',
      icon: Download,
      href: '/xml-exporter?type=stock&discount=false',
      color: 'orange',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Manage your Shopify XML exports with the same structure as WooCommerce
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                  <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                to={action.href}
                className="block bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start">
                  <div className={`p-2 rounded-lg bg-${action.color}-100`}>
                    <Icon className={`h-6 w-6 text-${action.color}-600`} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{action.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <div className="p-1 rounded-full bg-green-100">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-sm text-gray-900">Products exported successfully</span>
            </div>
            <span className="text-sm text-gray-500">2 hours ago</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <div className="p-1 rounded-full bg-blue-100">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-sm text-gray-900">Stock XML generated</span>
            </div>
            <span className="text-sm text-gray-500">4 hours ago</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <div className="p-1 rounded-full bg-purple-100">
                <SettingsIcon className="h-4 w-4 text-purple-600" />
              </div>
              <span className="text-sm text-gray-900">Settings updated</span>
            </div>
            <span className="text-sm text-gray-500">1 day ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
