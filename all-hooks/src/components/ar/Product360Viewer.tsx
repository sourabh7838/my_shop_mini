import React, { useState, useRef, useEffect } from 'react'

interface Product360ViewerProps {
  images: string[]
  productName: string
  onClose?: () => void
}

export function Product360Viewer({ images, productName, onClose }: Product360ViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [isAutoRotate, setIsAutoRotate] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isAutoRotate) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length)
      }, 100)
    }
    return () => clearInterval(interval)
  }, [isAutoRotate, images.length])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.clientX)
    setIsAutoRotate(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    
    const deltaX = e.clientX - startX
    const sensitivity = 0.5
    const newIndex = Math.floor((currentIndex - deltaX * sensitivity / 100) % images.length)
    setCurrentIndex(newIndex < 0 ? images.length + newIndex : newIndex)
    setStartX(e.clientX)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setStartX(e.touches[0].clientX)
    setIsAutoRotate(false)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    
    const deltaX = e.touches[0].clientX - startX
    const sensitivity = 0.5
    const newIndex = Math.floor((currentIndex - deltaX * sensitivity / 100) % images.length)
    setCurrentIndex(newIndex < 0 ? images.length + newIndex : newIndex)
    setStartX(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
    setIsAutoRotate(false)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    setIsAutoRotate(false)
  }

  return (
    <div className="w-full h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden">
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{productName}</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAutoRotate(!isAutoRotate)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                isAutoRotate 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {isAutoRotate ? '⏸️ Stop' : '▶️ Auto'}
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="relative w-full h-80 bg-black">
        <div
          ref={containerRef}
          className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <img
            src={images[currentIndex]}
            alt={`${productName} - View ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain"
            draggable={false}
          />
        </div>
        
        {/* Navigation Controls */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
        >
          ‹
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
        >
          ›
        </button>
        
        {/* Progress Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="flex gap-1">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-white">
        <p className="text-sm text-gray-600">
          Drag to rotate • {currentIndex + 1} of {images.length} views • Tap Auto for continuous rotation
        </p>
      </div>
    </div>
  )
} 