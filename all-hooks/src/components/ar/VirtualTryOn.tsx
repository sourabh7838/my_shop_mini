import React, { useRef, useEffect, useState } from 'react'

interface VirtualTryOnProps {
  productImage: string
  productName: string
  onClose: () => void
}

export function VirtualTryOn({ productImage, productName, onClose }: VirtualTryOnProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isStreamActive, setIsStreamActive] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [overlayPosition, setOverlayPosition] = useState({ x: 50, y: 50, scale: 1 })

  useEffect(() => {
    startCamera()
    return () => stopCamera()
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsStreamActive(true)
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Unable to access camera. Please check permissions.')
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      setIsStreamActive(false)
    }
  }

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Draw product overlay
    const overlaySize = 200 * overlayPosition.scale
    const overlayX = (canvas.width * overlayPosition.x / 100) - overlaySize / 2
    const overlayY = (canvas.height * overlayPosition.y / 100) - overlaySize / 2

    const overlayImg = new Image()
    overlayImg.onload = () => {
      ctx.globalAlpha = 0.8
      ctx.drawImage(overlayImg, overlayX, overlayY, overlaySize, overlaySize)
      ctx.globalAlpha = 1.0

      const capturedDataUrl = canvas.toDataURL('image/jpeg')
      setCapturedImage(capturedDataUrl)
      setIsCapturing(true)
    }
    overlayImg.src = productImage
  }

  const resetCapture = () => {
    setCapturedImage(null)
    setIsCapturing(false)
  }

  const downloadImage = () => {
    if (!capturedImage) return

    const link = document.createElement('a')
    link.download = `${productName}-tryon.jpg`
    link.href = capturedImage
    link.click()
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isCapturing) return
    
    const touch = e.touches[0]
    const rect = videoRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = ((touch.clientX - rect.left) / rect.width) * 100
    const y = ((touch.clientY - rect.top) / rect.height) * 100

    setOverlayPosition(prev => ({
      ...prev,
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y))
    }))
  }

  const adjustScale = (delta: number) => {
    setOverlayPosition(prev => ({
      ...prev,
      scale: Math.max(0.5, Math.min(2, prev.scale + delta))
    }))
  }

  if (!isStreamActive) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-lg">Starting camera...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-screen bg-black relative">
      {/* Camera Feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
      
      {/* Product Overlay */}
      {!isCapturing && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: `${overlayPosition.x}%`,
            top: `${overlayPosition.y}%`,
            transform: `translate(-50%, -50%) scale(${overlayPosition.scale})`
          }}
        >
          <img
            src={productImage}
            alt={productName}
            className="w-32 h-32 object-contain opacity-80"
          />
        </div>
      )}
      
      {/* Captured Image */}
      {isCapturing && capturedImage && (
        <div className="absolute inset-0 bg-black">
          <img
            src={capturedImage}
            alt="Captured try-on"
            className="w-full h-full object-contain"
          />
        </div>
      )}
      
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{productName} - Virtual Try-On</h3>
          <button
            onClick={onClose}
            className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
          >
            ✕
          </button>
        </div>
        <p className="text-sm text-gray-300 mt-1">
          {isCapturing ? 'Review your try-on result' : 'Position the product overlay and capture'}
        </p>
      </div>
      
      {/* Controls */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-4">
        {!isCapturing ? (
          <>
            <button
              onClick={() => adjustScale(-0.1)}
              className="bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all"
            >
              🔍-
            </button>
            <button
              onClick={captureImage}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all"
            >
              📷 Capture
            </button>
            <button
              onClick={() => adjustScale(0.1)}
              className="bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all"
            >
              🔍+
            </button>
          </>
        ) : (
          <>
            <button
              onClick={resetCapture}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all"
            >
              🔄 Retake
            </button>
            <button
              onClick={downloadImage}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all"
            >
              💾 Save
            </button>
          </>
        )}
      </div>
      
      {/* Touch Area for Moving Overlay */}
      {!isCapturing && (
        <div
          className="absolute inset-0"
          onTouchMove={handleTouchMove}
          style={{ touchAction: 'none' }}
        />
      )}
    </div>
  )
} 