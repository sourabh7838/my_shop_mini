import React, { useState, useRef, useEffect } from 'react'

interface Product {
  id: string
  name: string
  price: number
  image: string
  modelUrl?: string
}

interface SpatialShoppingProps {
  products: Product[]
  onProductSelect: (product: Product) => void
  onClose: () => void
}

export function SpatialShopping({ products, onProductSelect, onClose }: SpatialShoppingProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [placedProducts, setPlacedProducts] = useState<Array<{
    id: string
    product: Product
    position: { x: number; y: number; z: number }
    rotation: number
  }>>([])
  const [isPlacing, setIsPlacing] = useState(false)
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0, z: 0 })
  const [isARSupported, setIsARSupported] = useState(false)

  useEffect(() => {
    checkARSupport()
  }, [])

  const checkARSupport = async () => {
    try {
      if ('xr' in navigator) {
        const isSupported = await (navigator as any).xr.isSessionSupported('immersive-ar')
        setIsARSupported(isSupported)
      } else {
        setIsARSupported(false)
      }
    } catch (error) {
      console.log('AR not supported:', error)
      setIsARSupported(false)
    }
  }

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product)
    setIsPlacing(true)
  }

  const handlePlaceProduct = (event: React.MouseEvent) => {
    if (!selectedProduct || !isPlacing) return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 10 - 5
    const y = ((event.clientY - rect.top) / rect.height) * 10 - 5

    const newPlacedProduct = {
      id: `${selectedProduct.id}-${Date.now()}`,
      product: selectedProduct,
      position: { x, y, z: 0 },
      rotation: Math.random() * Math.PI * 2
    }

    setPlacedProducts(prev => [...prev, newPlacedProduct])
    setSelectedProduct(null)
    setIsPlacing(false)
  }

  const removePlacedProduct = (id: string) => {
    setPlacedProducts(prev => prev.filter(p => p.id !== id))
  }

  const clearAllProducts = () => {
    setPlacedProducts([])
  }

  if (!isARSupported) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="text-6xl mb-4">🏪</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Spatial Shopping</h2>
          <p className="text-gray-600 mb-6">
            Experience products in your space with AR. Your device needs AR capabilities to use this feature.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-screen bg-black relative">
      {/* AR Environment */}
      <div
        className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden"
        onClick={handlePlaceProduct}
      >
        {/* Grid Pattern for Spatial Reference */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-20 grid-rows-20 w-full h-full">
            {Array.from({ length: 400 }).map((_, i) => (
              <div key={i} className="border border-gray-600"></div>
            ))}
          </div>
        </div>

        {/* Placed Products */}
        {placedProducts.map((placed) => (
          <div
            key={placed.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{
              left: `${(placed.position.x + 5) * 10}%`,
              top: `${(placed.position.y + 5) * 10}%`,
              transform: `translate(-50%, -50%) rotate(${placed.rotation}rad)`
            }}
            onClick={() => onProductSelect(placed.product)}
          >
            <div className="relative">
              <img
                src={placed.product.image}
                alt={placed.product.name}
                className="w-16 h-16 object-cover rounded-lg shadow-lg"
              />
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                   onClick={(e) => {
                     e.stopPropagation()
                     removePlacedProduct(placed.id)
                   }}>
                ✕
              </div>
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              ${placed.product.price}
            </div>
          </div>
        ))}

        {/* Placement Indicator */}
        {isPlacing && selectedProduct && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-16 h-16 border-2 border-blue-500 border-dashed rounded-lg flex items-center justify-center bg-blue-500 bg-opacity-20">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-12 h-12 object-cover rounded"
              />
            </div>
            <p className="text-white text-center mt-2 text-sm">Tap to place</p>
          </div>
        )}
      </div>

      {/* Header */}
      <div className="absolute top-4 left-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Spatial Shopping</h3>
          <button
            onClick={onClose}
            className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
          >
            ✕
          </button>
        </div>
        <p className="text-sm text-gray-300 mt-1">
          {isPlacing 
            ? `Placing ${selectedProduct?.name} - Tap anywhere to place`
            : 'Select products to place in your space'
          }
        </p>
      </div>

      {/* Product Selection Panel */}
      {!isPlacing && (
        <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold">Available Products</h4>
            {placedProducts.length > 0 && (
              <button
                onClick={clearAllProducts}
                className="text-red-400 text-sm hover:text-red-300 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductSelect(product)}
                className="flex-shrink-0 cursor-pointer hover:scale-105 transition-transform"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <p className="text-xs text-center mt-1 text-gray-300">{product.name}</p>
                <p className="text-xs text-center text-green-400">${product.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cancel Placement Button */}
      {isPlacing && (
        <div className="absolute bottom-4 left-4 right-4 flex justify-center">
          <button
            onClick={() => {
              setSelectedProduct(null)
              setIsPlacing(false)
            }}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancel Placement
          </button>
        </div>
      )}
    </div>
  )
} 