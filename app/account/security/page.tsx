"use client"
import { useState } from "react"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { apiService } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"

export default function SecurityPage() {
  const { user } = useAuth()
  const [emailForm, setEmailForm] = useState({ current: "", next: "" })
  const [passForm, setPassForm] = useState({ current: "", next: "" })
  const [phoneForm, setPhoneForm] = useState({ next: "" })
  const [emailMsg, setEmailMsg] = useState<string | null>(null)
  const [passMsg, setPassMsg] = useState<string | null>(null)
  const [phoneMsg, setPhoneMsg] = useState<string | null>(null)
  const [loadingEmail, setLoadingEmail] = useState(false)
  const [loadingPass, setLoadingPass] = useState(false)
  const [loadingPhone, setLoadingPhone] = useState(false)
  const [showEmail, setShowEmail] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [showPhone, setShowPhone] = useState(false)

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
  
  const submitPhone = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoadingPhone(true)
    setPhoneMsg(null)
    try {
      const res = await apiService.changePhone(phoneForm.next)
      setPhoneMsg(res.message)
    } catch (err: any) {
      setPhoneMsg(err?.message || 'Error al actualizar teléfono')
    } finally { setLoadingPhone(false) }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-neutral-900 text-teal-100">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <h1 className="text-2xl font-bold text-teal-300 mb-6">Seguridad y cuenta</h1>
          
          <div className="border border-teal-500/40 rounded-xl p-6 bg-neutral-800 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-teal-300 font-semibold">{user?.username}</p>
                <p className="text-xs text-teal-200">{user?.email || 'Correo no disponible'}</p>
              </div>
              <span className="text-xs text-neutral-400">Rol: {user?.rol || 'cliente'}</span>
            </div>
          </div>
          
          <div className="grid gap-6">
            <div className="border-2 border-teal-500 rounded-xl p-6 bg-neutral-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Correo</h2>
                <button onClick={()=>setShowEmail(v=>!v)} className="px-3 py-1 rounded bg-teal-500 text-neutral-900 font-semibold">{showEmail?'Cancelar':'Modificar'}</button>
              </div>
              {!showEmail ? (
                <p className="text-sm text-teal-200">{user?.email || 'Sin correo'}</p>
              ) : (
                <form onSubmit={submitEmail}>
                  <input value={emailForm.current} onChange={e=>setEmailForm({...emailForm,current:e.target.value})} placeholder="Contraseña actual" type="password" className="w-full mb-3 p-3 rounded bg-neutral-700 text-white" />
                  <input value={emailForm.next} onChange={e=>setEmailForm({...emailForm,next:e.target.value})} placeholder="Nuevo correo" type="email" className="w-full mb-4 p-3 rounded bg-neutral-700 text-white" />
                  {emailMsg && <p className={emailMsg.toLowerCase().includes('actualizado')?"text-green-400":"text-red-400"}>{emailMsg}</p>}
                  <button disabled={loadingEmail} className="mt-2 w-full bg-teal-500 text-neutral-900 font-semibold rounded-full py-3">{loadingEmail?'Actualizando…':'Actualizar correo'}</button>
                </form>
              )}
            </div>
            
            <div className="border-2 border-teal-500 rounded-xl p-6 bg-neutral-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Contraseña</h2>
                <button onClick={()=>setShowPass(v=>!v)} className="px-3 py-1 rounded bg-teal-500 text-neutral-900 font-semibold">{showPass?'Cancelar':'Modificar'}</button>
              </div>
              {!showPass ? (
                <p className="text-sm text-teal-200">••••••••</p>
              ) : (
                <form onSubmit={submitPass}>
                  <input value={passForm.current} onChange={e=>setPassForm({...passForm,current:e.target.value})} placeholder="Contraseña actual" type="password" className="w-full mb-3 p-3 rounded bg-neutral-700 text-white" />
                  <input value={passForm.next} onChange={e=>setPassForm({...passForm,next:e.target.value})} placeholder="Nueva contraseña" type="password" className="w-full mb-4 p-3 rounded bg-neutral-700 text-white" />
                  {passMsg && <p className={passMsg.toLowerCase().includes('actualizada')?"text-green-400":"text-red-400"}>{passMsg}</p>}
                  <button disabled={loadingPass} className="mt-2 w-full bg-teal-500 text-neutral-900 font-semibold rounded-full py-3">{loadingPass?'Actualizando…':'Actualizar contraseña'}</button>
                </form>
              )}
            </div>
            
            <div className="border-2 border-teal-500 rounded-xl p-6 bg-neutral-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Teléfono</h2>
                <button onClick={()=>setShowPhone(v=>!v)} className="px-3 py-1 rounded bg-teal-500 text-neutral-900 font-semibold">{showPhone?'Cancelar':'Modificar'}</button>
              </div>
              {!showPhone ? (
                <p className="text-sm text-teal-200">No disponible</p>
              ) : (
                <form onSubmit={submitPhone}>
                  <input value={phoneForm.next} onChange={e=>setPhoneForm({next:e.target.value})} placeholder="Nuevo teléfono" className="w-full mb-4 p-3 rounded bg-neutral-700 text-white" />
                  {phoneMsg && <p className={phoneMsg.toLowerCase().includes('actualizado')?"text-green-400":"text-red-400"}>{phoneMsg}</p>}
                  <button disabled={loadingPhone} className="mt-2 w-full bg-teal-500 text-neutral-900 font-semibold rounded-full py-3">{loadingPhone?'Actualizando…':'Actualizar teléfono'}</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
