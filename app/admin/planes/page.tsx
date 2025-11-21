"use client"
import { useEffect, useState } from "react"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { adminApiService } from "@/lib/api"

export default function AdminPlanes() {
  const [list, setList] = useState<any[]>([])
  const [form, setForm] = useState({ codigo: '', nombre: '', precio: 0, moneda: 'CLP', ciclo_fact: 'mensual', activo: true })
  const [error, setError] = useState<string | null>(null)

  useEffect(()=>{ adminApiService.getPlans().then((x:any)=>setList(Array.isArray(x)?x:[]) ).catch(()=>setList([])) },[])

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
      setList(Array.isArray(x)?x:[])
    } catch (err:any) { setError(err?.message||'Error') }
  }

  const remove = async (id:number) => {
    try { await adminApiService.deletePlan(id); const x=await adminApiService.getPlans(); setList(Array.isArray(x)?x:[]) } catch{}
  }

  const syncMp = async (id:number) => {
    try {
      setError(null)
      const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/planes/${id}/sync-mercadopago`, { method:'POST', credentials:'include', headers:{'Content-Type':'application/json'} })
      const data = await resp.json()
      if (!resp.ok) throw new Error(data.error || 'Error al sincronizar')
      const x = await adminApiService.getPlans()
      setList(Array.isArray(x)?x:[])
    } catch (e:any) { setError(e?.message || 'Error al sincronizar') }
  }

  return (
    <ProtectedRoute requireAdmin>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4 text-teal-300">Planes</h2>
        {error && <p className="text-red-400 mb-3">{error}</p>}
        <form onSubmit={create} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <input value={form.codigo} onChange={e=>setForm({...form,codigo:e.target.value})} placeholder="Código" className="p-3 rounded bg-neutral-800 text-white" />
          <input value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} placeholder="Nombre" className="p-3 rounded bg-neutral-800 text-white" />
          <input type="number" value={form.precio} onChange={e=>setForm({...form,precio:parseInt(e.target.value||'0')})} placeholder="Precio en CLP" className="p-3 rounded bg-neutral-800 text-white" />
          <select value={form.moneda} onChange={e=>setForm({...form,moneda:e.target.value})} className="p-3 rounded bg-neutral-800 text-white">
            <option value="CLP">CLP</option>
          </select>
          <select value={form.ciclo_fact} onChange={e=>setForm({...form,ciclo_fact:e.target.value})} className="p-3 rounded bg-neutral-800 text-white">
            <option value="mensual">Mensual</option>
            <option value="anual">Anual</option>
          </select>
          <button type="submit" className="p-3 rounded bg-teal-500 text-neutral-900 font-semibold">Crear</button>
        </form>
        <div className="grid gap-3">
          {list.map((p:any)=> (
            <div key={p.id} className="border border-teal-500 rounded p-3 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">{p.nombre}</div>
                <div className="text-sm text-teal-300">{p.codigo} • {(p.precio_centavos/100).toLocaleString('es-CL',{style:'currency',currency:p.moneda})} • {p.ciclo_fact}</div>
                {p.mp_preapproval_plan_id && (
                  <div className="text-xs text-teal-400 mt-1">MP Plan ID: {p.mp_preapproval_plan_id}</div>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={()=>syncMp(p.id)} className="px-3 py-2 rounded bg-teal-500 text-neutral-900">Sincronizar MP</button>
                <button onClick={()=>remove(p.id)} className="px-3 py-2 rounded border border-teal-500 text-teal-300">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  )
}