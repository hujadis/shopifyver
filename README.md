# Shopify XML Exporter (React)

A modern React-based application that exports Shopify products as XML with the same structure as the WooCommerce plugin. This app provides a beautiful web interface for generating XML feeds and managing exports.

## 🚀 Features

- **Modern React UI** - Beautiful, responsive interface built with React and Tailwind CSS
- **XML Export** - Generate XML with identical structure to WooCommerce plugin
- **Real-time Preview** - See generated XML before downloading
- **API Integration** - RESTful API endpoints for external systems
- **Settings Management** - Configure delivery times, caching, and rate limiting
- **Category Mapping** - Upload CSV files for category hierarchies
- **Vercel Ready** - Optimized for easy deployment on Vercel

## 📋 XML Structure

The app generates **identical XML structure** to your WooCommerce plugin:

### Products Export
```xml
<products>
  <product>
    <product-unique-id><![CDATA[123456]]></product-unique-id>
    <title><![CDATA[Product Name]]></title>
    <long-description><![CDATA[<p>Product description</p>]]></long-description>
    <video-youtube>https://youtube.com/watch?v=...</video-youtube>
    <parent-category-name><![CDATA[Main Category]]></parent-category-name>
    <sub-category-name><![CDATA[Sub Category]]></sub-category-name>
    <sub2-category-name><![CDATA[Sub Sub Category]]></sub2-category-name>
    <category-id>123, 456</category-id>
    <properties>
      <property>
        <id><![CDATA[pa_brand]]></id>
        <values>
          <value><![CDATA[Brand Name]]></value>
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
</products>
```

### Stock Export
```xml
<products>
  <product>
    <sku>SKU123</sku>
    <ean>1234567890123</ean>
    <price>29.99</price>
    <stock>10</stock>
    <collectionhours>24-48 hours</collectionhours>
  </product>
</products>
```

## 🛠️ Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Local Development
```bash
# Clone the repository
git clone <repository-url>
cd shopify-xml-exporter-react

# Install dependencies
npm install

# Start development server
npm start
```

The app will be available at `http://localhost:3000`

## 🚀 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Set Environment Variables**
   ```bash
   vercel env add SHOPIFY_ACCESS_TOKEN
   vercel env add SHOPIFY_API_KEY
   ```

### Manual Deployment
```bash
# Build for production
npm run build

# Deploy the build folder to your hosting provider
```

## 📱 Usage

### Dashboard
- View export statistics
- Quick access to common exports
- Recent activity tracking

### XML Exporter
1. Enter your Shopify shop URL
2. Select export type (Products or Stock)
3. Configure options (sizes, discounts)
4. Generate and download XML

### Settings
- Configure delivery times
- Manage caching settings
- Set rate limiting
- Upload category CSV files

## 🔧 Configuration

### Environment Variables
| Variable | Description | Required |
|----------|-------------|----------|
| `SHOPIFY_ACCESS_TOKEN` | Your Shopify app access token | ✅ Yes |
| `SHOPIFY_API_KEY` | Your Shopify app API key | ❌ Optional |

### Category Mapping
Upload a CSV file with category hierarchies using the ` character as separator:
```csv
Vaikams ir kudikiams; Zaislai vaikams iki 3 metu; Stumdukai, paspiriamos masineles
Kvepalai, Kosmetika; Kvepalai; Kvepalai moterims
```

## 🎯 API Endpoints

### Products Export
```
GET /api/xml/products?shop=your-shop.myshopify.com&with_size=true
GET /api/xml/products?shop=your-shop.myshopify.com&with_size=false
```

### Stock Export
```
GET /api/xml/stock?shop=your-shop.myshopify.com&discount=true
GET /api/xml/stock?shop=your-shop.myshopify.com&discount=false
```

## 🎨 UI Components

### Built with:
- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **React Router** - Client-side routing
- **React Hot Toast** - Toast notifications
- **React Dropzone** - File upload handling

### Features:
- **Responsive Design** - Works on all devices
- **Dark Mode Ready** - Easy to add dark theme
- **Accessible** - WCAG compliant
- **Fast Loading** - Optimized bundle size

## 🔒 Security

- **Input Validation** - All inputs validated
- **Rate Limiting** - Configurable request limits
- **CORS Protection** - Secure cross-origin requests
- **Environment Variables** - Secure configuration

## 📊 Performance

- **Code Splitting** - Lazy-loaded components
- **Caching** - Configurable XML caching
- **Optimized Build** - Minified production bundle
- **CDN Ready** - Static asset optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For support and questions:
- Open an issue on GitHub
- Check the documentation
- Contact the development team

## 🎉 Success!

Your React-based Shopify XML exporter is now ready to deploy on Vercel with:
- ✅ Beautiful, modern UI
- ✅ Identical XML structure to WooCommerce
- ✅ Easy deployment on Vercel
- ✅ Full configuration management
- ✅ API endpoints for external systems
