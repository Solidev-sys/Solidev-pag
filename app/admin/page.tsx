"use client"
import Link from "next/link"
import ProtectedRoute from "@/components/auth/ProtectedRoute"

export default function AdminHome() {
  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen p-8">
        <h1 className="text-2xl font-bold mb-6 text-teal-300">Panel de administrador</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/admin/planes" className="border border-teal-500 rounded p-4">Planes</Link>
          <Link href="/admin/suscripciones" className="border border-teal-500 rounded p-4">Suscripciones</Link>
          <Link href="/admin/facturas" className="border border-teal-500 rounded p-4">Facturas</Link>
          <Link href="/admin/usuarios" className="border border-teal-500 rounded p-4">Usuarios</Link>
        </div>
      </div>
    </ProtectedRoute>
  )
}
