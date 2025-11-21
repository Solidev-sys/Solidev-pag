"use client"
import { useEffect, useState } from "react"
import ProtectedRoute from "@/components/auth/ProtectedRoute"

export default function AdminSuscripciones() {
  const [list, setList] = useState<any[]>([])
  useEffect(()=>{ fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/suscripciones`, { credentials:'include' }).then(r=>r.json()).then(x=>setList(Array.isArray(x)?x:[])).catch(()=>setList([])) },[])
  return (
    <ProtectedRoute requireAdmin>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4 text-teal-300">Suscripciones</h2>
        <div className="grid gap-3">
          {list.map((s:any)=> (
            <div key={s.id} className="border border-teal-500 rounded p-3">
              <div className="font-semibold text-white">{s.Usuario?.email} • {s.Plan?.nombre}</div>
              <div className="text-sm text-teal-300">Estado: {s.estado} • Inicio: {s.fecha_inicio || '-'} • Próximo cobro: {s.proximo_cobro || '-'}</div>
            </div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  )
}