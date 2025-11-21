"use client"
import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const { register } = useAuth()
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const res = await register({ username: email, name, email, password, rut: '', phone, address: '', comuna: '', region: '' })
    setLoading(false)
    if (res.success) router.replace('/')
    else setError(res.message || 'Error al registrar')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-neutral-800 border border-teal-500 rounded-xl p-6">
        <h1 className="text-xl font-bold mb-4 text-teal-300">Crear cuenta</h1>
        {error && <p className="text-red-400 mb-3">{error}</p>}
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nombre" className="w-full mb-3 p-3 rounded bg-neutral-700 text-white" />
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full mb-3 p-3 rounded bg-neutral-700 text-white" />
        <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Teléfono" className="w-full mb-3 p-3 rounded bg-neutral-700 text-white" />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Contraseña" className="w-full mb-4 p-3 rounded bg-neutral-700 text-white" />
        <button type="submit" disabled={loading} className="w-full py-3 rounded bg-teal-500 text-neutral-900 font-semibold">{loading? 'Creando…':'Registrarse'}</button>
        <button type="button" onClick={()=>router.push('/login')} className="w-full mt-3 py-3 rounded border border-teal-500 text-teal-300">Ya tengo cuenta</button>
      </form>
    </div>
  )
}