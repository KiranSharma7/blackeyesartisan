'use client'

import { useState } from 'react'
import Image from 'next/image'
import { HttpTypes } from '@medusajs/types'
import { cn } from '@lib/util/cn'

interface ProductImageGalleryProps {
  images: HttpTypes.StoreProductImage[] | null
  title: string
}

export default function ProductImageGallery({
  images,
  title,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  // If no images, show placeholder
  if (!images || images.length === 0) {
    return (
      <div className="relative bg-white border-2 border-ink rounded-[2rem] shadow-hard-xl overflow-hidden aspect-square">
        <div className="absolute inset-0 flex items-center justify-center bg-stone/20">
          <span className="text-ink/40 font-medium">No image available</span>
        </div>
      </div>
    )
  }

  const selectedImage = images[selectedIndex]

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div
        className="relative bg-white border-2 border-ink rounded-[2rem] shadow-hard-xl
                    overflow-hidden aspect-square"
      >
        <Image
          src={selectedImage.url}
          alt={`${title} - Image ${selectedIndex + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnails - Only show if more than 1 image */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                'relative rounded-xl border-2 border-ink overflow-hidden aspect-square transition-all',
                selectedIndex === index
                  ? 'shadow-hard-sm bg-acid'
                  : 'hover:-translate-y-1'
              )}
            >
              <Image
                src={image.url}
                alt={`${title} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="100px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
