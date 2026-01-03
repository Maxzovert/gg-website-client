import React, { useState, useEffect, useRef } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import Loader from './Loader'

const WebsiteCarousel = () => {
  const [images, setImages] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [deviceType, setDeviceType] = useState(null)
  const intervalRef = useRef(null)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

  // Detect device type based on window width
  const detectDeviceType = () => {
    const isMobile = window.innerWidth <= 768
    return isMobile ? 'mobile' : 'desktop'
  }

  // Update device type on mount and window resize
  useEffect(() => {
    const updateDeviceType = () => {
      const newDeviceType = detectDeviceType()
      setDeviceType(newDeviceType)
    }

    // Set initial device type immediately
    updateDeviceType()

    // Listen for window resize
    window.addEventListener('resize', updateDeviceType)

    return () => {
      window.removeEventListener('resize', updateDeviceType)
    }
  }, [])

  // Fetch carousel images when device type is determined
  useEffect(() => {
    if (!deviceType) return

    const fetchCarouselImages = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_URL}/api/carousel?device_type=${deviceType}`)
        if (!response.ok) {
          throw new Error('Failed to fetch carousel images')
        }
        const data = await response.json()
        // Only set images for the current device type
        setImages(data || [])
        setCurrentIndex(0)
      } catch (error) {
        console.error('Error fetching carousel images:', error)
        setImages([])
      } finally {
        setLoading(false)
      }
    }

    fetchCarouselImages()
  }, [deviceType, API_URL])

  useEffect(() => {
    // Auto-loop functionality - only if there's more than one image
    if (images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
      }, 3000) // 3 seconds

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    }
  }, [images.length])

  const goToPrevious = () => {
    if (images.length === 0) return
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
    // Reset auto-loop timer when manually navigating
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    if (images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
      }, 3000)
    }
  }

  const goToNext = () => {
    if (images.length === 0) return
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    // Reset auto-loop timer when manually navigating
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    if (images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
      }, 3000)
    }
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
    // Reset auto-loop timer when manually navigating
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    if (images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
      }, 3000)
    }
  }

  if (loading) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-gray-100">
        <Loader size="xl"/>
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">No carousel images available</p>
      </div>
    )
  }

  return (
    <div className="relative w-full h-[500px] overflow-hidden bg-gray-100">
      {/* Carousel Images */}
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((item, index) => (
          <div
            key={item.id}
            className="min-w-full h-full flex items-center justify-center"
          >
            <img
              src={item.image_url}
              alt={`Carousel ${index + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/1200x500?text=Image+Not+Found'
              }}
            />
          </div>
        ))}
      </div>

      {/* Navigation Buttons - Only show if more than one image */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 z-10"
            aria-label="Previous image"
          >
            <FaChevronLeft className="text-xl" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 z-10"
            aria-label="Next image"
          >
            <FaChevronRight className="text-xl" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-white w-8'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default WebsiteCarousel