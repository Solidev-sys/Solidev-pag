"use client"

import { useEffect, useState } from "react"
import { FileText, Calendar, DollarSign, Download, Eye, Search, SlidersHorizontal, TrendingUp, Activity, Filter, X, ChevronDown, Receipt } from "lucide-react"
import AdminSidebar from "@/components/admin/AdminSidebar"

export default function AdminFacturas() {
  const [list, setList] = useState<any[]>([])
  const [filteredList, setFilteredList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("fecha_desc")
  const [showFilters, setShowFilters] = useState(false)
  const [previewPdf, setPreviewPdf] = useState<string | null>(null)
  const [dateFilter, setDateFilter] = useState({ desde: "", hasta: "" })
  const [montoFilter, setMontoFilter] = useState({ min: "", max: "" })

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/admin/facturas`, { 
      credentials: 'include' 
    })
      .then(r => r.json())
      .then(x => {
        const data = Array.isArray(x) ? x : []
        setList(data)
        setFilteredList(data)
        setLoading(false)
      })
      .catch(() => {
        setList([])
        setFilteredList([])
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    let filtered = [...list]

    if (searchTerm) {
      filtered = filtered.filter(f => 
        f.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.id.toString().includes(searchTerm)
      )
    }

    if (dateFilter.desde) {
      filtered = filtered.filter(f => new Date(f.emitida_en) >= new Date(dateFilter.desde))
    }
    if (dateFilter.hasta) {
      filtered = filtered.filter(f => new Date(f.emitida_en) <= new Date(dateFilter.hasta))
    }

    if (montoFilter.min) {
      filtered = filtered.filter(f => f.total_cent >= parseFloat(montoFilter.min) * 100)
    }
    if (montoFilter.max) {
      filtered = filtered.filter(f => f.total_cent <= parseFloat(montoFilter.max) * 100)
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "fecha_desc": return new Date(b.emitida_en).getTime() - new Date(a.emitida_en).getTime()
        case "fecha_asc": return new Date(a.emitida_en).getTime() - new Date(b.emitida_en).getTime()
        case "monto_desc": return b.total_cent - a.total_cent
        case "monto_asc": return a.total_cent - b.total_cent
        default: return 0
      }
    })

    setFilteredList(filtered)
  }, [searchTerm, sortBy, dateFilter, montoFilter, list])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const formatCurrency = (cents: number) => {
    return (cents / 100).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })
  }

  const handleDownloadPdf = (rutaPdf: string, numero: string) => {
    const link = document.createElement('a')
    link.href = rutaPdf
    link.download = `factura_${numero}.pdf`
    link.click()
  }

  const handlePreviewPdf = (rutaPdf: string) => {
    setPreviewPdf(rutaPdf)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setDateFilter({ desde: "", hasta: "" })
    setMontoFilter({ min: "", max: "" })
    setSortBy("fecha_desc")
  }

  const totalFacturado = filteredList.reduce((sum, f) => sum + f.total_cent, 0)

  if (loading) {
    return (
      <>
        <AdminSidebar />
        <div className="min-h-screen bg-home-dark-1 flex items-center justify-center">
          <div className="text-center">
            <div 
              className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #00d9ff, #667EEA)',
                animation: 'pulse 2s ease-in-out infinite'
              }}
            >
              <Activity className="w-8 h-8 text-white animate-pulse" />
            </div>
            <p className="text-home-white text-lg font-semibold">Cargando facturas...</p>
          </div>
        </div>
      </>
    )
  }


  return (
    <>
      <AdminSidebar />
      <div className="min-h-screen bg-home-dark-1 py-8 px-4 sm:px-6 lg:px-8">
        {/* Patrón de fondo sutil */}
        <div 
          className="fixed inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #00d9ff 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header Premium */}
          <div className="mb-10">
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 blur-[120px] opacity-20 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, #00d9ff, #667EEA, transparent)',
              }}
            />

            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #00d9ff, #667EEA)',
                    boxShadow: '0 8px 24px rgba(0, 217, 255, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
                  }}
                >
                  <Receipt className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h1 
                    className="text-4xl font-black tracking-tight"
                    style={{
                      background: 'linear-gradient(135deg, #00d9ff, #667EEA, #00F2FE)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      backgroundSize: '200%',
                      animation: 'gradient-flow 4s ease infinite'
                    }}
                  >
                    Facturas
                  </h1>
                  <p className="text-home-gray-ui-1 text-sm font-medium">
                    Gestiona y descarga todas las facturas emitidas
                  </p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                {/* Total Facturas */}
                <div 
                  className="relative bg-home-dark-3 rounded-2xl p-5 border backdrop-blur-sm overflow-hidden group hover:scale-105 transition-all duration-500"
                  style={{
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.05), rgba(102, 126, 234, 0.05))'
                    }}
                  />
                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-home-gray-ui-2 text-sm font-medium mb-1">Total Facturas</p>
                      <p className="text-home-white text-3xl font-black">{filteredList.length}</p>
                    </div>
                    <FileText className="w-8 h-8 text-home-gray-ui-1" strokeWidth={2} />
                  </div>
                </div>

                {/* Total Facturado */}
                <div 
                  className="relative rounded-2xl p-5 border backdrop-blur-sm overflow-hidden group hover:scale-105 transition-all duration-500"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.1), rgba(102, 126, 234, 0.05))',
                    borderColor: 'rgba(0, 217, 255, 0.3)',
                    boxShadow: '0 4px 20px rgba(0, 217, 255, 0.2)'
                  }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(0, 217, 255, 0.15), transparent 70%)'
                    }}
                  />
                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-[#00d9ff] text-sm font-medium mb-1">Total Facturado</p>
                      <p className="text-home-white text-2xl font-black">
                        {formatCurrency(totalFacturado)}
                      </p>
                    </div>
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, #00d9ff, #667EEA)',
                        boxShadow: '0 4px 16px rgba(0, 217, 255, 0.4)'
                      }}
                    >
                      <DollarSign className="w-5 h-5 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                </div>

                {/* Promedio */}
                <div 
                  className="relative rounded-2xl p-5 border backdrop-blur-sm overflow-hidden group hover:scale-105 transition-all duration-500"
                  style={{
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.05))',
                    borderColor: 'rgba(102, 126, 234, 0.3)',
                    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.2)'
                  }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(102, 126, 234, 0.15), transparent 70%)'
                    }}
                  />
                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-[#667EEA] text-sm font-medium mb-1">Promedio</p>
                      <p className="text-home-white text-2xl font-black">
                        {filteredList.length > 0 ? formatCurrency(totalFacturado / filteredList.length) : '$0'}
                      </p>
                    </div>
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, #667EEA, #764BA2)',
                        boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)'
                      }}
                    >
                      <TrendingUp className="w-5 h-5 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Barra de búsqueda y filtros */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Búsqueda */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-home-gray-ui-1" strokeWidth={2} />
                <input
                  type="text"
                  placeholder="Buscar por número de factura o ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border bg-home-dark-3 text-home-white placeholder-home-gray-ui-2 focus:outline-none focus:ring-2 transition-all"
                  style={{
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
                  }}
                />
              </div>

              {/* Ordenar */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-12 pr-10 py-3 rounded-xl border bg-home-dark-3 text-home-white focus:outline-none focus:ring-2 transition-all cursor-pointer"
                  style={{
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                    minWidth: '200px'
                  }}
                >
                  <option value="fecha_desc">Más recientes</option>
                  <option value="fecha_asc">Más antiguas</option>
                  <option value="monto_desc">Mayor monto</option>
                  <option value="monto_asc">Menor monto</option>
                </select>
                <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-home-gray-ui-1 pointer-events-none" strokeWidth={2} />
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-home-gray-ui-1 pointer-events-none" strokeWidth={2} />
              </div>

              {/* Botón filtros */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border transition-all hover:scale-105"
                style={{
                  background: showFilters ? 'linear-gradient(135deg, rgba(0, 217, 255, 0.1), rgba(102, 126, 234, 0.05))' : 'rgba(255, 255, 255, 0.02)',
                  borderColor: showFilters ? 'rgba(0, 217, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                  boxShadow: showFilters ? '0 4px 16px rgba(0, 217, 255, 0.2)' : '0 4px 16px rgba(0, 0, 0, 0.2)'
                }}
              >
                <Filter className="w-5 h-5 text-home-white" strokeWidth={2} />
                <span className="text-home-white font-semibold">Filtros</span>
              </button>
            </div>

            {/* Panel de filtros expandible */}
            {showFilters && (
              <div 
                className="rounded-xl p-6 border backdrop-blur-sm"
                style={{
                  background: 'linear-gradient(135deg, rgba(25, 24, 25, 0.9), rgba(17, 17, 17, 0.8))',
                  borderColor: 'rgba(0, 217, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Filtro de fechas */}
                  <div>
                    <label className="block text-home-white font-semibold mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#00d9ff]" strokeWidth={2} />
                      Rango de fechas
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="date"
                        value={dateFilter.desde}
                        onChange={(e) => setDateFilter({ ...dateFilter, desde: e.target.value })}
                        className="px-4 py-2 rounded-lg border bg-home-dark-3 text-home-white focus:outline-none focus:ring-2"
                        style={{
                          borderColor: 'rgba(255, 255, 255, 0.1)',
                          colorScheme: 'dark'
                        }}
                      />
                      <input
                        type="date"
                        value={dateFilter.hasta}
                        onChange={(e) => setDateFilter({ ...dateFilter, hasta: e.target.value })}
                        className="px-4 py-2 rounded-lg border bg-home-dark-3 text-home-white focus:outline-none focus:ring-2"
                        style={{
                          borderColor: 'rgba(255, 255, 255, 0.1)',
                          colorScheme: 'dark'
                        }}
                      />
                    </div>
                  </div>

                  {/* Filtro de montos */}
                  <div>
                    <label className="block text-home-white font-semibold mb-3 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-[#667EEA]" strokeWidth={2} />
                      Rango de montos
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        placeholder="Mínimo"
                        value={montoFilter.min}
                        onChange={(e) => setMontoFilter({ ...montoFilter, min: e.target.value })}
                        className="px-4 py-2 rounded-lg border bg-home-dark-3 text-home-white placeholder-home-gray-ui-2 focus:outline-none focus:ring-2"
                        style={{
                          borderColor: 'rgba(255, 255, 255, 0.1)'
                        }}
                      />
                      <input
                        type="number"
                        placeholder="Máximo"
                        value={montoFilter.max}
                        onChange={(e) => setMontoFilter({ ...montoFilter, max: e.target.value })}
                        className="px-4 py-2 rounded-lg border bg-home-dark-3 text-home-white placeholder-home-gray-ui-2 focus:outline-none focus:ring-2"
                        style={{
                          borderColor: 'rgba(255, 255, 255, 0.1)'
                        }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={clearFilters}
                  className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg border transition-all hover:scale-105"
                  style={{
                    background: 'rgba(220, 38, 38, 0.1)',
                    borderColor: 'rgba(220, 38, 38, 0.3)',
                    color: '#DC2626'
                  }}
                >
                  <X className="w-4 h-4" strokeWidth={2} />
                  <span className="font-semibold">Limpiar filtros</span>
                </button>
              </div>
            )}
          </div>

          {/* Grid de Facturas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredList.map((factura: any, index: number) => (
              <div
                key={factura.id}
                className="group relative rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-500"
                style={{
                  opacity: 0,
                  animation: `fadeInUp 0.6s ease forwards ${index * 0.1}s`
                }}
              >
                {/* Borde animado superior */}
                <div 
                  className="h-1 w-full"
                  style={{
                    background: 'linear-gradient(90deg, #00d9ff, #667EEA, #00d9ff)',
                    backgroundSize: '200%',
                    animation: 'gradient-flow 3s ease infinite'
                  }}
                />

                {/* Card Container */}
                <div 
                  className="relative backdrop-blur-sm border"
                  style={{
                    background: 'linear-gradient(180deg, rgba(0, 217, 255, 0.03) 0%, rgba(17, 17, 17, 0.95) 100%)',
                    borderColor: 'rgba(0, 217, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 217, 255, 0.1)'
                  }}
                >
                  {/* Patrón de fondo interno */}
                  <div 
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                      backgroundImage: 'radial-gradient(circle at 2px 2px, #00d9ff 1px, transparent 1px)',
                      backgroundSize: '32px 32px'
                    }}
                  />

                  <div className="relative p-6">
                    {/* Header de la tarjeta */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{
                              background: 'linear-gradient(135deg, #00d9ff, #667EEA)',
                              boxShadow: '0 4px 16px rgba(0, 217, 255, 0.3)'
                            }}
                          >
                            <FileText className="w-5 h-5 text-white" strokeWidth={2} />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-home-white">
                              {factura.numero}
                            </h3>
                            <p className="text-xs text-home-gray-ui-2 font-mono">ID: {factura.id}</p>
                          </div>
                        </div>
                      </div>

                      {/* Badge de monto */}
                      <div 
                        className="relative flex items-center gap-2 px-4 py-2 rounded-xl border backdrop-blur-sm"
                        style={{
                          background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.1), rgba(102, 126, 234, 0.05))',
                          borderColor: 'rgba(0, 217, 255, 0.3)',
                          boxShadow: '0 4px 16px rgba(0, 217, 255, 0.2)'
                        }}
                      >
                        <DollarSign 
                          className="w-4 h-4 text-[#00d9ff]" 
                          strokeWidth={2.5}
                        />
                        <span className="text-sm font-bold text-[#00d9ff]">
                          {formatCurrency(factura.total_cent)}
                        </span>
                      </div>
                    </div>

                    {/* Detalles de montos */}
                    <div 
                      className="relative rounded-xl p-4 mb-4 border overflow-hidden"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01))',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
                      }}
                    >
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-home-gray-ui-2 text-xs uppercase tracking-wider mb-1 font-semibold">
                            Neto
                          </p>
                          <p className="text-home-white font-bold text-sm">
                            {formatCurrency(factura.neto_cent)}
                          </p>
                        </div>
                        <div>
                          <p className="text-home-gray-ui-2 text-xs uppercase tracking-wider mb-1 font-semibold">
                            IVA
                          </p>
                          <p className="text-home-white font-bold text-sm">
                            {formatCurrency(factura.impuesto_cent)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[#00d9ff] text-xs uppercase tracking-wider mb-1 font-semibold">
                            Total
                          </p>
                          <p 
                            className="font-black text-base"
                            style={{
                              background: 'linear-gradient(135deg, #00d9ff, #667EEA)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text'
                            }}
                          >
                            {formatCurrency(factura.total_cent)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Fecha de emisión */}
                    <div 
                      className="rounded-xl p-3 border backdrop-blur-sm mb-4"
                      style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        borderColor: 'rgba(255, 255, 255, 0.08)'
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#667EEA]" strokeWidth={2} />
                        <span className="text-xs text-home-gray-ui-2 uppercase font-semibold">Emitida</span>
                        <span className="text-home-white font-bold text-sm ml-auto">
                          {formatDate(factura.emitida_en)}
                        </span>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handlePreviewPdf(factura.ruta_pdf)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all hover:scale-105 group/btn"
                        style={{
                          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.05))',
                          borderColor: 'rgba(102, 126, 234, 0.3)',
                          boxShadow: '0 4px 16px rgba(102, 126, 234, 0.2)'
                        }}
                      >
                        <Eye className="w-5 h-5 text-[#667EEA] group-hover/btn:scale-110 transition-transform" strokeWidth={2} />
                        <span className="text-[#667EEA] font-bold text-sm">Vista Previa</span>
                      </button>

                      <button
                        onClick={() => handleDownloadPdf(factura.ruta_pdf, factura.numero)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all hover:scale-105 group/btn"
                        style={{
                          background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.1), rgba(0, 242, 254, 0.05))',
                          borderColor: 'rgba(0, 217, 255, 0.3)',
                          boxShadow: '0 4px 16px rgba(0, 217, 255, 0.2)'
                        }}
                      >
                        <Download className="w-5 h-5 text-[#00d9ff] group-hover/btn:scale-110 transition-transform" strokeWidth={2} />
                        <span className="text-[#00d9ff] font-bold text-sm">Descargar</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Estado vacío (Empty State) */}
          {filteredList.length === 0 && (
            <div className="text-center py-20">
              <Receipt className="w-16 h-16 mx-auto mb-4 text-home-gray-ui-2 opacity-40" strokeWidth={1} />
              <p className="text-home-gray-ui-1 text-xl font-semibold mb-2">
                No se encontraron facturas
              </p>
              <p className="text-home-gray-ui-2">
                Ajusta tus filtros o limpia la búsqueda para ver más resultados.
              </p>
            </div>
          )}
        </div>

        {/* Modal de Vista Previa de PDF */}
        {previewPdf && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setPreviewPdf(null)}
          >
            <div 
              className="bg-home-dark-3 rounded-2xl p-6 max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              onClick={e => e.stopPropagation()}
              style={{
                boxShadow: '0 0 80px rgba(0, 217, 255, 0.4)'
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-home-white flex items-center gap-3">
                  <Eye className="w-6 h-6 text-[#00d9ff]" />
                  Vista Previa de Factura
                </h2>
                <button
                  onClick={() => setPreviewPdf(null)}
                  className="p-2 rounded-xl bg-home-dark-4 hover:bg-home-dark-5 transition-colors"
                >
                  <X className="w-6 h-6 text-home-gray-ui-2" />
                </button>
              </div>
              
              <div className="flex-1 w-full border border-home-border-light rounded-xl overflow-hidden">
                {/* Usa un iframe para mostrar el PDF */}
                <iframe 
                  src={previewPdf} 
                  className="w-full h-full" 
                  title="Vista Previa de Factura"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes gradient-flow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  )
}