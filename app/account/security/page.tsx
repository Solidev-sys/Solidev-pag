"use client"
import { useState } from "react"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { apiService } from "@/lib/api"

export default function SecurityPage() {
  const [emailForm, setEmailForm] = useState({ current: "", next: "" })
  const [passForm, setPassForm] = useState({ current: "", next: "" })
  const [emailMsg, setEmailMsg] = useState<string | null>(null)
  const [passMsg, setPassMsg] = useState<string | null>(null)
  const [loadingEmail, setLoadingEmail] = useState(false)
  const [loadingPass, setLoadingPass] = useState(false)

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoadingEmail(true)
    setEmailMsg(null)
    try {
      const res = await apiService.changeEmail({ currentPassword: emailForm.current, newEmail: emailForm.next })
      setEmailMsg(res.message)
    } catch (err: any) {
      setEmailMsg(err?.message || 'Error al actualizar email')
    } finally { setLoadingEmail(false) }
  }

  const submitPass = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoadingPass(true)
    setPassMsg(null)
    try {
      const res = await apiService.changePassword({ currentPassword: passForm.current, newPassword: passForm.next })
      setPassMsg(res.message)
    } catch (err: any) {
      setPassMsg(err?.message || 'Error al actualizar contraseña')
    } finally { setLoadingPass(false) }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-neutral-900 text-teal-100">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <h1 className="text-2xl font-bold text-teal-300 mb-6">Seguridad y cuenta</h1>
          <div className="grid gap-8">
            <form onSubmit={submitEmail} className="border-2 border-teal-500 rounded-xl p-6 bg-neutral-800">
              <h2 className="text-lg font-semibold text-white mb-4">Cambiar correo</h2>
              <input value={emailForm.current} onChange={e=>setEmailForm({...emailForm,current:e.target.value})} placeholder="Contraseña actual" type="password" className="w-full mb-3 p-3 rounded bg-neutral-700 text-white" />
              <input value={emailForm.next} onChange={e=>setEmailForm({...emailForm,next:e.target.value})} placeholder="Nuevo correo" type="email" className="w-full mb-4 p-3 rounded bg-neutral-700 text-white" />
              {emailMsg && <p className={emailMsg.toLowerCase().includes('actualizado')?"text-green-400":"text-red-400"}>{emailMsg}</p>}
              <button disabled={loadingEmail} className="mt-4 w-full bg-teal-500 text-neutral-900 font-semibold rounded-full py-3">{loadingEmail?'Actualizando…':'Actualizar correo'}</button>
            </form>
            <form onSubmit={submitPass} className="border-2 border-teal-500 rounded-xl p-6 bg-neutral-800">
              <h2 className="text-lg font-semibold text-white mb-4">Cambiar contraseña</h2>
              <input value={passForm.current} onChange={e=>setPassForm({...passForm,current:e.target.value})} placeholder="Contraseña actual" type="password" className="w-full mb-3 p-3 rounded bg-neutral-700 text-white" />
              <input value={passForm.next} onChange={e=>setPassForm({...passForm,next:e.target.value})} placeholder="Nueva contraseña" type="password" className="w-full mb-4 p-3 rounded bg-neutral-700 text-white" />
              {passMsg && <p className={passMsg.toLowerCase().includes('actualizada')?"text-green-400":"text-red-400"}>{passMsg}</p>}
              <button disabled={loadingPass} className="mt-4 w-full bg-teal-500 text-neutral-900 font-semibold rounded-full py-3">{loadingPass?'Actualizando…':'Actualizar contraseña'}</button>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
