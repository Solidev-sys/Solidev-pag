"use client"

import { useState } from "react"
import Image from "next/image"

interface ProductGalleryProps {
  images: string[]
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square bg-muted rounded-lg overflow-hidden">
        <Image
          src={images[selectedImage] || "/placeholder.svg"}
          alt={productName}
          width={600}
          height={600}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`aspect-square w-20 rounded-lg overflow-hidden border-2 transition-colors ${
              selectedImage === index ? "border-primary" : "border-transparent hover:border-muted-foreground/50"
            }`}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`${productName} vista ${index + 1}`}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
