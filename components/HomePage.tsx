"use client"

export function HomePage() {
  const [apiMessage, setApiMessage] = useState<string | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)

  useEffect(() => {
    apiService
      .getApiTest()
      .then((data) => setApiMessage(data.q))
      .catch((err) => setApiError(err?.message || 'Error de conexión'))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Creación de Páginas Web</h1>
          <p className="mt-2 text-lg text-gray-600">
            Diseñamos y desarrollamos sitios web modernos, rápidos y optimizados para tu negocio.
          </p>
          <div className="mt-6">
            <a
              href="#contacto"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition-colors"
            >
              Solicitar una cotización
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6">
        {/* Servicios */}
        <section className="py-12 border-b">
          <h2 className="text-2xl font-semibold">Qué ofrecemos</h2>
          <p className="mt-2 text-gray-600">
            Soluciones completas para tu presencia digital, desde la idea hasta el lanzamiento.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-white rounded-lg border">
              <h3 className="font-medium">Diseño responsive</h3>
              <p className="mt-1 text-sm text-gray-600">Visualización óptima en móviles, tablets y escritorio.</p>
            </div>
            <div className="p-5 bg-white rounded-lg border">
              <h3 className="font-medium">SEO básico</h3>
              <p className="mt-1 text-sm text-gray-600">Buenas prácticas para mejorar tu visibilidad en buscadores.</p>
            </div>
            <div className="p-5 bg-white rounded-lg border">
              <h3 className="font-medium">E-commerce</h3>
              <p className="mt-1 text-sm text-gray-600">Tiendas online con carrito, pagos y gestión de productos.</p>
            </div>
            <div className="p-5 bg-white rounded-lg border">
              <h3 className="font-medium">Landing pages</h3>
              <p className="mt-1 text-sm text-gray-600">Páginas enfocadas en conversión para campañas específicas.</p>
            </div>
          </div>
          
          {/* Login Button */}
          <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
            Iniciar sesión
          </Link>
        </div>
      </nav>
    </div>
  )
}
