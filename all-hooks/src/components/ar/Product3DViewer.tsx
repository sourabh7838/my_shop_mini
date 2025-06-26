import React, { useRef, useState, useEffect } from 'react'

interface Product3DViewerProps {
  modelUrl?: string
  productName: string
  onViewModeChange?: (mode: '3d' | 'ar') => void
}

export function Product3DViewer({ modelUrl, productName, onViewModeChange }: Product3DViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [rotation, setRotation] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Simple 3D cube rendering using 2D canvas
    const drawCube = () => {
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const size = 80

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, '#f3f4f6')
      gradient.addColorStop(1, '#e5e7eb')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw 3D cube effect
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(rotation)

      // Front face
      ctx.fillStyle = '#4f46e5'
      ctx.fillRect(-size/2, -size/2, size, size)

      // Top face
      ctx.fillStyle = '#6366f1'
      ctx.beginPath()
      ctx.moveTo(-size/2, -size/2)
      ctx.lineTo(size/2, -size/2)
      ctx.lineTo(size/2 + 20, -size/2 - 20)
      ctx.lineTo(-size/2 + 20, -size/2 - 20)
      ctx.closePath()
      ctx.fill()

      // Right face
      ctx.fillStyle = '#3730a3'
      ctx.beginPath()
      ctx.moveTo(size/2, -size/2)
      ctx.lineTo(size/2, size/2)
      ctx.lineTo(size/2 + 20, size/2 - 20)
      ctx.lineTo(size/2 + 20, -size/2 - 20)
      ctx.closePath()
      ctx.fill()

      ctx.restore()

      // Add product name
      ctx.fillStyle = '#1f2937'
      ctx.font = '16px -apple-system, BlinkMacSystemFont, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(productName, centerX, centerY + size + 30)

      // Add rotation indicator
      ctx.fillStyle = '#6b7280'
      ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif'
      ctx.fillText('Drag to rotate', centerX, centerY + size + 50)
    }

    drawCube()
    setIsLoading(false)

    // Auto-rotation
    const interval = setInterval(() => {
      setRotation(prev => prev + 0.01)
    }, 50)

    return () => clearInterval(interval)
  }, [rotation, productName])

  const handleMouseDown = (e: React.MouseEvent) => {
    const startX = e.clientX
    const startRotation = rotation

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX
      setRotation(startRotation + deltaX * 0.01)
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    const startX = e.touches[0].clientX
    const startRotation = rotation

    const handleTouchMove = (e: TouchEvent) => {
      const deltaX = e.touches[0].clientX - startX
      setRotation(startRotation + deltaX * 0.01)
    }

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }

    document.addEventListener('touchmove', handleTouchMove)
    document.addEventListener('touchend', handleTouchEnd)
  }

  return (
    <div className="w-full h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden">
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{productName}</h3>
          <div className="flex gap-2">
            <button
              onClick={() => onViewModeChange?.('3d')}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              3D View
            </button>
            <button
              onClick={() => onViewModeChange?.('ar')}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              AR View
            </button>
          </div>
        </div>
      </div>
      
      <div className="relative w-full h-80 flex items-center justify-center">
        {isLoading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading 3D Model...</p>
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            style={{ touchAction: 'none' }}
          />
        )}
      </div>
      
      <div className="p-4 bg-white">
        <p className="text-sm text-gray-600">
          Drag to rotate the 3D model. Tap AR View to see it in your space.
        </p>
      </div>
    </div>
  )
} 