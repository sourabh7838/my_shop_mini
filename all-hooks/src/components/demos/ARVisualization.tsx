import React, { useState } from 'react'
import { Product3DViewer, ARProductViewer, Product360Viewer, VirtualTryOn, SpatialShopping } from '../ar'

// Sample product data
const sampleProducts = [
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    modelUrl: undefined, // Would be a GLTF file URL in production
    images360: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=400&h=400&fit=crop',
    ]
  },
  {
    id: '2',
    name: 'Smart Watch',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    modelUrl: undefined,
    images360: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=400&h=400&fit=crop',
    ]
  },
  {
    id: '3',
    name: 'Laptop',
    price: 1299.99,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
    modelUrl: undefined,
    images360: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
    ]
  }
]

type ViewMode = 'menu' | '3d' | 'ar' | '360' | 'tryon' | 'spatial'

export function ARVisualization() {
  const [viewMode, setViewMode] = useState<ViewMode>('menu')
  const [selectedProduct, setSelectedProduct] = useState(sampleProducts[0])

  const handleViewModeChange = (mode: '3d' | 'ar') => {
    setViewMode(mode)
  }

  const handleProductSelect = (product: any) => {
    setSelectedProduct(product)
  }

  const renderContent = () => {
    switch (viewMode) {
      case '3d':
        return (
          <Product3DViewer
            modelUrl={selectedProduct.modelUrl}
            productName={selectedProduct.name}
            onViewModeChange={handleViewModeChange}
          />
        )
      
      case 'ar':
        return (
          <ARProductViewer
            modelUrl={selectedProduct.modelUrl}
            productName={selectedProduct.name}
            onBack={() => setViewMode('menu')}
          />
        )
      
      case '360':
        return (
          <Product360Viewer
            images={selectedProduct.images360}
            productName={selectedProduct.name}
            onClose={() => setViewMode('menu')}
          />
        )
      
      case 'tryon':
        return (
          <VirtualTryOn
            productImage={selectedProduct.image}
            productName={selectedProduct.name}
            onClose={() => setViewMode('menu')}
          />
        )
      
      case 'spatial':
        return (
          <SpatialShopping
            products={sampleProducts}
            onProductSelect={handleProductSelect}
            onClose={() => setViewMode('menu')}
          />
        )
      
      default:
        return renderMenu()
    }
  }

  const renderMenu = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AR & 3D Visualization</h1>
        <p className="text-gray-600">Experience products in immersive ways</p>
      </div>

      {/* Product Selection */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Select a Product</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sampleProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className={`bg-white rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg ${
                selectedProduct.id === product.id ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
              <h3 className="font-semibold text-gray-900">{product.name}</h3>
              <p className="text-green-600 font-semibold">${product.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Visualization Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 3D Viewer */}
        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">3D Product Viewer</h3>
          <p className="text-gray-600 mb-4">
            Interactive 3D models with realistic lighting and materials
          </p>
          <button
            onClick={() => setViewMode('3d')}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View in 3D
          </button>
        </div>

        {/* AR Viewer */}
        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="text-4xl mb-4">📱</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">AR Experience</h3>
          <p className="text-gray-600 mb-4">
            Place products in your real environment using AR
          </p>
          <button
            onClick={() => setViewMode('ar')}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Try AR
          </button>
        </div>

        {/* 360 Viewer */}
        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="text-4xl mb-4">🔄</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">360° View</h3>
          <p className="text-gray-600 mb-4">
            Rotate and explore products from every angle
          </p>
          <button
            onClick={() => setViewMode('360')}
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            View 360°
          </button>
        </div>

        {/* Virtual Try-On */}
        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="text-4xl mb-4">👤</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Virtual Try-On</h3>
          <p className="text-gray-600 mb-4">
            Try products on yourself using your camera
          </p>
          <button
            onClick={() => setViewMode('tryon')}
            className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Try On
          </button>
        </div>

        {/* Spatial Shopping */}
        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="text-4xl mb-4">🏪</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Spatial Shopping</h3>
          <p className="text-gray-600 mb-4">
            Place multiple products in your space
          </p>
          <button
            onClick={() => setViewMode('spatial')}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Spatial Shop
          </button>
        </div>

        {/* Back to Main */}
        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="text-4xl mb-4">🏠</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Back to Main</h3>
          <p className="text-gray-600 mb-4">
            Return to the main application
          </p>
          <button
            onClick={() => window.history.back()}
            className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>

      {/* Features Info */}
      <div className="mt-12 bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Features Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">3D Visualization</h4>
            <ul className="space-y-1">
              <li>• Interactive 3D models with realistic rendering</li>
              <li>• Touch and gesture controls for rotation/zoom</li>
              <li>• High-quality lighting and materials</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">AR Features</h4>
            <ul className="space-y-1">
              <li>• Real-world product placement</li>
              <li>• Camera-based AR experiences</li>
              <li>• Spatial awareness and tracking</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">360° Experience</h4>
            <ul className="space-y-1">
              <li>• Complete product rotation views</li>
              <li>• Auto-rotation and manual control</li>
              <li>• High-resolution image sequences</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Virtual Try-On</h4>
            <ul className="space-y-1">
              <li>• Real-time camera integration</li>
              <li>• Product overlay positioning</li>
              <li>• Photo capture and sharing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="w-full">
      {renderContent()}
    </div>
  )
} 