interface ProductDetailsProps {
  description: string
  videoUrl?: string
}

export function ProductDetails({ description, videoUrl }: ProductDetailsProps) {
  return (
    <section className="grid lg:grid-cols-2 gap-8">
      {/* Description */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Descripción</h2>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>

      {/* Video */}
      {videoUrl && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Video</h2>
          <div className="aspect-video rounded-lg overflow-hidden">
            <iframe
              src={videoUrl}
              title="Video del producto"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  )
}
