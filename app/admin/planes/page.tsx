"use client"
import { useEffect, useState } from "react"
import { Package, DollarSign, Calendar, Zap, Edit2, Trash2, RefreshCw, X, Check, FileText } from "lucide-react"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import AdminSidebar from "@/components/admin/AdminSidebar"
import { adminApiService } from "@/lib/api"

export default function AdminPlanes() {
  const [list, setList] = useState<any[]>([])
  const [form, setForm] = useState({ codigo: '', nombre: '', precio: 0, moneda: 'CLP', ciclo_fact: 'mensual', activo: true })
  const [error, setError] = useState<string | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [editMode, setEditMode] = useState<'nombre' | 'precio' | 'resumen' | null>(null)
  const [editValue, setEditValue] = useState<string>('')

  useEffect(() => {
    adminApiService.getPlans().then((x: any) => setList(Array.isArray(x) ? x : [])).catch(() => setList([]))
  }, [])

  const create = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      if (!form.codigo || !form.nombre) throw new Error('Completa código y nombre')
      if (!form.precio || form.precio <= 0) throw new Error('Ingresa un precio en CLP mayor a 0')
      const payload = {
        codigo: form.codigo,
        nombre: form.nombre,
        precio_centavos: Math.round(Number(form.precio) * 100),
        moneda: form.moneda,
        ciclo_fact: form.ciclo_fact,
        activo: form.activo
      }
      await adminApiService.createPlan(payload as any)
      const x = await adminApiService.getPlans()
      setList(Array.isArray(x) ? x : [])
      setForm({ codigo: '', nombre: '', precio: 0, moneda: 'CLP', ciclo_fact: 'mensual', activo: true })
    } catch (err: any) {
      setError(err?.message || 'Error')
    }
  }

  const remove = async (id: number) => {
    try {
      await adminApiService.deletePlan(id)
      const x = await adminApiService.getPlans()
      setList(Array.isArray(x) ? x : [])
      setSelectedPlan(null)
    } catch { }
  }

  const syncMp = async (id: number) => {
    try {
      setError(null)
      const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/planes/${id}/sync-mercadopago`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })
      const data = await resp.json()
      if (!resp.ok) throw new Error(data.error || 'Error al sincronizar')
      const x = await adminApiService.getPlans()
      setList(Array.isArray(x) ? x : [])
    } catch (e: any) {
      setError(e?.message || 'Error al sincronizar')
    }
  }

  const startEdit = (type: 'nombre' | 'precio' | 'resumen', currentValue: string) => {
    setEditMode(type)
    setEditValue(currentValue)
  }

  const cancelEdit = () => {
    setEditMode(null)
    setEditValue('')
  }

  const saveEdit = async () => {
    if (!selectedPlan || !editMode) return

    try {
      setError(null)
      const payload: any = {}
      if (editMode === 'precio') {
        const amount = Math.round(parseFloat(editValue || '0') * 100)
        if (!amount || amount <= 0) throw new Error('Ingresa un precio válido')
        payload.precio_centavos = amount
      } else if (editMode === 'nombre') {
        payload.nombre = editValue
      } else if (editMode === 'resumen') {
        payload.resumen = editValue
      }

      await adminApiService.updatePlan(selectedPlan.id, payload)
      const x = await adminApiService.getPlans()
      const updated = Array.isArray(x) ? x : []
      setList(updated)
      setSelectedPlan(updated.find((p: any) => p.id === selectedPlan.id) || null)

      cancelEdit()
    } catch (err: any) {
      setError(err?.message || 'Error al actualizar')
    }
  }

  return (
    <ProtectedRoute requireAdmin>
      <AdminSidebar />
      <div className="min-h-screen p-8 pt-28 bg-home-dark-1">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Gestión de Planes
          </h2>
          <p className="text-slate-400">
            Administra los planes de suscripción de tu plataforma
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
            {error}
          </div>
        )}

        {/* Create Plan Form */}
        <form onSubmit={create} className="mb-8 bg-dark-surface backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-emerald-400 mb-4">Crear Nuevo Plan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              value={form.codigo}
              onChange={e => setForm({ ...form, codigo: e.target.value })}
              placeholder="Código del plan"
              className="p-3 rounded-xl bg-dark-secondary border border-slate-700 text-white focus:border-emerald-500 focus:outline-none transition-all"
            />
            <input
              value={form.nombre}
              onChange={e => setForm({ ...form, nombre: e.target.value })}
              placeholder="Nombre del plan"
              className="p-3 rounded-xl bg-dark-secondary border border-slate-700 text-white focus:border-emerald-500 focus:outline-none transition-all"
            />
            <input
              type="number"
              value={form.precio}
              onChange={e => setForm({ ...form, precio: parseInt(e.target.value || '0') })}
              placeholder="Precio en CLP"
              className="p-3 rounded-xl bg-dark-secondary border border-slate-700 text-white focus:border-emerald-500 focus:outline-none transition-all"
            />
            <select
              value={form.moneda}
              onChange={e => setForm({ ...form, moneda: e.target.value })}
              className="p-3 rounded-xl bg-dark-secondary border border-slate-700 text-white focus:border-emerald-500 focus:outline-none transition-all"
            >
              <option value="CLP">CLP</option>
            </select>
            <select
              value={form.ciclo_fact}
              onChange={e => setForm({ ...form, ciclo_fact: e.target.value })}
              className="p-3 rounded-xl bg-dark-secondary border border-slate-700 text-white focus:border-emerald-500 focus:outline-none transition-all"
            >
              <option value="mensual">Mensual</option>
              <option value="anual">Anual</option>
            </select>
            <button
              type="submit"
              className="p-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #10B981, #00d9ff)',
                color: 'white',
                boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)'
              }}
            >
              Crear Plan
            </button>
          </div>
        </form>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {list.map((plan: any) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan)}
              // Ajuste de estilos base de la tarjeta
              className="group relative bg-dark-surface backdrop-blur-sm border border-dark-card rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:border-emerald-400/60 hover:shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-1"
            >
              {/* Icon Header */}
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #10B981, #00d9ff)',
                    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  <Package className="w-7 h-7 text-white" />
                </div>
                {plan.activo ? (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Activo
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-500/20 text-slate-400 border border-slate-500/30">
                    Inactivo
                  </span>
                )}
              </div>

              {/* Plan Info */}
              <h3 className="text-xl font-bold text-white mb-1">{plan.nombre}</h3>
              <p className="text-sm text-slate-400 mb-4">{plan.codigo}</p>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-black text-emerald-400">
                  ${(plan.precio_centavos / 100).toLocaleString('es-CL')}
                </span>
                <span className="text-slate-400 text-sm">/{plan.ciclo_fact}</span>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>{plan.moneda}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span>Ciclo {plan.ciclo_fact}</span>
                </div>
                {plan.mp_preapproval_plan_id && (
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs">MP Sync</span>
                  </div>
                )}
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/0 to-cyan-500/0 group-hover:from-emerald-500/5 group-hover:to-cyan-500/5 transition-all duration-300 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {list.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <Package className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg">No hay planes creados</p>
          </div>
        )}

        {/* Plan Detail Modal */}
        {selectedPlan && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPlan(null)}
          >
            <div
              // Ajuste del fondo del modal
              className="bg-dark-surface border border-emerald-500/30 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
              style={{
                boxShadow: '0 0 60px rgba(16, 185, 129, 0.2)'
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedPlan.nombre}</h2>
                  <p className="text-slate-400">{selectedPlan.codigo}</p>
                </div>
                <button
                  onClick={() => setSelectedPlan(null)}
                  // Ajuste del botón de cierre
                  className="p-2 rounded-xl bg-dark-secondary hover:bg-slate-700 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-dark-secondary rounded-xl p-4">
                  <p className="text-sm text-slate-400 mb-1">Precio</p>
                  {editMode === 'precio' ? (
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        // Ajuste del input
                        className="flex-1 p-2 rounded-lg bg-dark-main border border-emerald-500 text-white text-xl font-bold"
                        autoFocus
                      />
                      <button onClick={saveEdit} className="p-2 rounded-lg bg-emerald-500 text-white">
                        <Check className="w-5 h-5" />
                      </button>
                      <button onClick={cancelEdit} className="p-2 rounded-lg bg-slate-700 text-white">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-2xl font-bold text-emerald-400">
                      ${(selectedPlan.precio_centavos / 100).toLocaleString('es-CL')}
                    </p>
                  )}
                </div>

                <div className="bg-dark-secondary rounded-xl p-4">
                  <p className="text-sm text-slate-400 mb-1">Ciclo</p>
                  <p className="text-xl font-bold text-white capitalize">{selectedPlan.ciclo_fact}</p>
                </div>

                <div className="bg-dark-secondary rounded-xl p-4">
                  <p className="text-sm text-slate-400 mb-1">Moneda</p>
                  <p className="text-xl font-bold text-white">{selectedPlan.moneda}</p>
                </div>

                <div className="bg-dark-secondary rounded-xl p-4">
                  <p className="text-sm text-slate-400 mb-1">Estado</p>
                  <p className={`text-xl font-bold ${selectedPlan.activo ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {selectedPlan.activo ? 'Activo' : 'Inactivo'}
                  </p>
                </div>
              </div>

              {/* Name Edit Section */}
              <div className="bg-dark-secondary rounded-xl p-4 mb-6">
                <p className="text-sm text-slate-400 mb-2">Nombre del Plan</p>
                {editMode === 'nombre' ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      // Ajuste del input
                      className="flex-1 p-2 rounded-lg bg-dark-main border border-emerald-500 text-white text-lg font-semibold"
                      autoFocus
                    />
                    <button onClick={saveEdit} className="p-2 rounded-lg bg-emerald-500 text-white">
                      <Check className="w-5 h-5" />
                    </button>
                    <button onClick={cancelEdit} className="p-2 rounded-lg bg-slate-700 text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <p className="text-lg font-semibold text-white">{selectedPlan.nombre}</p>
                )}
              </div>

              <div className="bg-dark-secondary rounded-xl p-4 mb-6">
                <p className="text-sm text-slate-400 mb-2">Descripción del Plan</p>
                {editMode === 'resumen' ? (
                  <div className="flex gap-2">
                    <textarea
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      className="flex-1 p-2 rounded-lg bg-dark-main border border-emerald-500 text-white text-sm min-h-[100px]"
                      autoFocus
                    />
                    <div className="flex flex-col gap-2">
                      <button onClick={saveEdit} className="p-2 rounded-lg bg-emerald-500 text-white">
                        <Check className="w-5 h-5" />
                      </button>
                      <button onClick={cancelEdit} className="p-2 rounded-lg bg-slate-700 text-white">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-300 whitespace-pre-line">{selectedPlan.resumen || 'Sin descripción'}</p>
                )}
              </div>

              {/* MercadoPago Info */}
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
                <p className="text-sm text-yellow-400 font-medium mb-1">MercadoPago Plan ID</p>
                <p className="text-yellow-300 font-mono text-sm">{selectedPlan.mp_preapproval_plan_id || 'N/A'}</p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <button
                  onClick={() => startEdit('nombre', selectedPlan.nombre)}
                  disabled={editMode !== null}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-cyan-600/20 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Edit2 className="w-4 h-4" />
                  Cambiar Nombre
                </button>

                <button
                  onClick={() => startEdit('precio', (selectedPlan.precio_centavos / 100).toString())}
                  disabled={editMode !== null}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-600/20 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <DollarSign className="w-4 h-4" />
                  Cambiar Precio
                </button>

                <button
                  onClick={() => startEdit('resumen', selectedPlan.resumen || '')}
                  disabled={editMode !== null}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-indigo-600/20 border border-indigo-500/50 text-indigo-300 hover:bg-indigo-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileText className="w-4 h-4" />
                  Cambiar Descripción
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => syncMp(selectedPlan.id)}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-blue-600/20 border border-blue-500/50 text-blue-300 hover:bg-blue-600/30 transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  Sincronizar MP
                </button>

                <button
                  onClick={() => remove(selectedPlan.id)}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-red-600/20 border border-red-500/50 text-red-300 hover:bg-red-600/30 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar Plan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
