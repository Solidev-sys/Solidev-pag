import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Product } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Función para limpiar strings que pueden tener backticks
export function cleanString(str: string | undefined | null): string {
  if (!str) return ''
  return str.toString().trim().replace(/`/g, '')
}

// Función para convertir precio a número
export function parsePrice(price: string | number | undefined | null): number {
  if (typeof price === 'number') return price
  if (typeof price === 'string') {
    const cleaned = price.replace(/[^\d.-]/g, '') // Remover caracteres no numéricos excepto punto y guión
    const parsed = parseFloat(cleaned)
    return isNaN(parsed) ? 0 : parsed
  }
  return 0
}

// Función para procesar imágenes del carrusel
export function processCarouselImages(imgCarrusel: any): string[] {
  if (!imgCarrusel) return []
  
  try {
    // Si es un objeto con propiedad imagenes
    if (typeof imgCarrusel === 'object' && imgCarrusel.imagenes) {
      if (Array.isArray(imgCarrusel.imagenes)) {
        return imgCarrusel.imagenes
          .map((img: string) => cleanString(img))
          .filter((img: string) => img.length > 0)
      }
    }
    
    // Si es directamente un array
    if (Array.isArray(imgCarrusel)) {
      return imgCarrusel
        .map((img: string) => cleanString(img))
        .filter((img: string) => img.length > 0)
    }
    
    // Si es un string (JSON)
    if (typeof imgCarrusel === 'string') {
      try {
        // Limpiar el string JSON de caracteres problemáticos
        let cleanedJson = imgCarrusel.trim()
        
        // Remover comillas de escape adicionales
        cleanedJson = cleanedJson.replace(/\\"/g, '"')
        
        // Intentar parsear el JSON limpio
        const parsed = JSON.parse(cleanedJson)
        console.log('[CAROUSEL-DEBUG] JSON parseado:', parsed)
        
        return processCarouselImages(parsed) // Recursión para procesar el objeto parseado
      } catch (parseError) {
        console.warn('[CAROUSEL-DEBUG] Error parseando JSON del carrusel:', parseError, 'JSON original:', imgCarrusel)
        
        // Intentar extraer URLs manualmente si el JSON está malformado
        const urlMatches = imgCarrusel.match(/https?:\/\/[^\s"']+/g)
        if (urlMatches) {
          console.log('[CAROUSEL-DEBUG] URLs extraídas manualmente:', urlMatches)
          return urlMatches
            .map((url: string) => cleanString(url))
            .filter((url: string) => url.length > 0)
        }
        
        return []
      }
    }
  } catch (error) {
    console.warn('[CAROUSEL-DEBUG] Error general procesando carrusel:', error)
  }
  
  return []
}

// Función principal para transformar producto de API a formato frontend
export function transformApiProduct(apiProduct: any): Product | null {
  try {
    // Validar campos requeridos
    if (!apiProduct.id || !apiProduct.nombre || apiProduct.precio === undefined) {
      console.warn('Producto con datos incompletos:', apiProduct)
      return null
    }
    
    const price = parsePrice(apiProduct.precio)
    const originalPrice = apiProduct.precio_original ? parsePrice(apiProduct.precio_original) : undefined
    const discount = typeof apiProduct.descuento === 'number' ? apiProduct.descuento : 0
    
    console.log('[TRANSFORM-DEBUG] Procesando carrusel para producto:', apiProduct.id, 'img_carrusel:', apiProduct.img_carrusel)
    const carouselImages = processCarouselImages(apiProduct.img_carrusel)
    console.log('[TRANSFORM-DEBUG] Carrusel procesado:', carouselImages)
    
    const videoUrl = cleanString(apiProduct.video_url) || undefined
    
    return {
      id: apiProduct.id,
      name: cleanString(apiProduct.nombre),
      price: price,
      originalPrice: originalPrice,
      discount: discount,
      gradient: `linear-gradient(135deg, #${Math.floor(Math.random()*16777215).toString(16)} 0%, #${Math.floor(Math.random()*16777215).toString(16)} 100%)`,
      description: cleanString(apiProduct.descripcion),
      stock: typeof apiProduct.stock === 'number' ? apiProduct.stock : 0,
      image: cleanString(apiProduct.imagen_url) || '/images/default-product.jpg',
      videoUrl: videoUrl,
      carousel: carouselImages.length > 0 ? carouselImages : undefined
    }
  } catch (error) {
    console.error('[TRANSFORM-DEBUG] Error transforming product:', error, apiProduct)
    return null
  }
}
