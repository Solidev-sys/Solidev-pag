"use client"
import { useEffect, useState } from "react"
import ProtectedRoute from "@/components/auth/ProtectedRoute"

export default function AdminUsuarios() {
  const [list, setList] = useState<any[]>([])
  useEffect(()=>{ fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/users`, { credentials:'include' }).then(r=>r.json()).then(x=>setList(Array.isArray(x)?x:[])).catch(()=>setList([])) },[])
  return (
    <ProtectedRoute requireAdmin>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4 text-teal-300">Usuarios</h2>
        <div className="grid gap-3">
          {list.map((u:any)=> (
            <div key={u.id} className="border border-teal-500 rounded p-3">
              <div className="font-semibold text-white">{u.email}</div>
              <div className="text-sm text-teal-300">Rol: {u.rol} • Estado: {u.estado}</div>
            </div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  )
}