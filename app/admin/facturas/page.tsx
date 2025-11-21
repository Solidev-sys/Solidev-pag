"use client"
import { useEffect, useState } from "react"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { adminApiService } from "@/lib/api"

export default function AdminFacturas() {
  const [list, setList] = useState<any[]>([])
  useEffect(()=>{ adminApiService.getInvoices().then((x:any)=>setList(Array.isArray(x)?x:[])).catch(()=>setList([])) },[])
  return (
    <ProtectedRoute requireAdmin>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4 text-teal-300">Facturas</h2>
        <div className="grid gap-3">
          {list.map((f:any)=> (
            <div key={f.id} className="border border-teal-500 rounded p-3">
              <div className="font-semibold text-white">{f.numero}</div>
              <div className="text-sm text-teal-300">Total: {(f.total_cent/100).toLocaleString('es-CL',{style:'currency',currency:'CLP'})} • Emitida: {f.emitida_en}</div>
            </div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  )
}