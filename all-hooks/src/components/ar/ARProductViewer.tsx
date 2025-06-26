import React, { useEffect, useRef, useState } from 'react'

interface ARProductViewerProps {
  modelUrl?: string
  productName: string
  onBack: () => void
}

export function ARProductViewer({ modelUrl, productName, onBack }: ARProductViewerProps) {
  const arSceneRef = useRef<HTMLDivElement>(null)
  const [isARSupported, setIsARSupported] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if AR is supported
    const checkARSupport = async () => {
      try {
        // Check for WebXR support
        if ('xr' in navigator && navigator.xr) {
          const isSupported = await navigator.xr.isSessionSupported('immersive-ar')
          setIsARSupported(isSupported)
        } else {
          setIsARSupported(false)
        }
      } catch (error) {
        console.log('AR not supported:', error)
        setIsARSupported(false)
      }
      setIsLoading(false)
    }

    checkARSupport()
  }, [])

  useEffect(() => {
    if (!arSceneRef.current || !isARSupported) return

    // Initialize AR scene
    const scene = arSceneRef.current
    scene.innerHTML = `
      <a-scene
        vr-mode-ui="enabled: false"
        arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
        renderer="logarithmicDepthBuffer: true;"
        embedded
        arjs="sourceType: webcam; debugUIEnabled: false;"
      >
        <a-marker preset="hiro">
          <a-box position="0 0.5 0" material="color: #4f46e5;" scale="1 1 1"></a-box>
        </a-marker>
        <a-entity camera></a-entity>
      </a-scene>
    `
  }, [isARSupported])

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-lg">Checking AR Support...</p>
        </div>
      </div>
    )
  }

  if (!isARSupported) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white p-6">
          <div className="text-6xl mb-4">📱</div>
          <h2 className="text-2xl font-bold mb-4">AR Not Supported</h2>
          <p className="text-gray-300 mb-6">
            Your device doesn't support AR features. Try using a device with AR capabilities.
          </p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to 3D View
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-screen bg-black relative">
      {/* AR Scene */}
      <div ref={arSceneRef} className="w-full h-full" />
      
      {/* AR Instructions Overlay */}
      <div className="absolute top-4 left-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">{productName}</h3>
        <p className="text-sm text-gray-300">
          Point your camera at a flat surface to place the product in AR
        </p>
      </div>
      
      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-4 right-4 bg-black bg-opacity-75 text-white p-3 rounded-full hover:bg-opacity-90 transition-all"
      >
        ✕
      </button>
      
      {/* AR Controls */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-4">
        <button className="bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all">
          📷 Capture
        </button>
        <button className="bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all">
          🔄 Reset
        </button>
      </div>
    </div>
  )
} 