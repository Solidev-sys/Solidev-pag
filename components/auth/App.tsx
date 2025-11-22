"use client"

import type React from "react"
import { useState, FormEvent } from "react"
import "./LoginStyles.css"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

const handleRocket = (e: FormEvent<HTMLButtonElement>) => {
  e.preventDefault()
  const button = e.currentTarget
  button.classList.add("launch")
  setTimeout(() => button.classList.remove("launch"), 1000)
}

export function LoginPage() {
  const [isLoginActive, setIsLoginActive] = useState<boolean>(true)
  const { login, register } = useAuth()
  const router = useRouter()

  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginError, setLoginError] = useState<string | null>(null)
  const [regUsername, setRegUsername] = useState("")
  const [regEmail, setRegEmail] = useState("")
  const [regPassword, setRegPassword] = useState("")
  const [regError, setRegError] = useState<string | null>(null)
  const [loadingLogin, setLoadingLogin] = useState(false)
  const [loadingReg, setLoadingReg] = useState(false)

  const toggleForm = () => {
    setIsLoginActive(!isLoginActive)
  }

  const doLogin = async () => {
    if (loadingLogin) return
    setLoadingLogin(true)
    const res = await login(loginEmail, loginPassword)
    setLoadingLogin(false)
    if (res.success) router.replace(res.redirectUrl || "/")
    else setLoginError(res.message || "Credenciales inválidas")
  }

  const doRegister = async () => {
    if (loadingReg) return
    setLoadingReg(true)
    const res = await register({ username: regUsername || regEmail, name: regUsername, email: regEmail, password: regPassword, rut: "", phone: "", address: "", comuna: "", region: "" })
    setLoadingReg(false)
    if (res.success) router.replace("/")
    else setRegError(res.message || 'Error al registrar')
  }

  return (
    <div className="login-screen">
      {/* Botón fuera del contenedor con estilo .btn */}
      <Link href="/" className="btn return-btn">Volver al inicio</Link>
      <div className={`container ${isLoginActive ? "login-active" : "signup-active"}`}>
        <div className="form-container">
        {/* LOGIN */}
        <div className={`form-box login-box ${isLoginActive ? 'active' : ''}`}>
          <h2>Iniciar Sesión</h2>
          <form onSubmit={(e)=>{e.preventDefault(); doLogin()}}>
            <div className="input-box">
              <input type="email" required value={loginEmail} onChange={(e)=>setLoginEmail(e.target.value)} />
              <label>Correo electrónico</label>
            </div>
            <div className="input-box">
              <input type="password" required value={loginPassword} onChange={(e)=>setLoginPassword(e.target.value)} />
              <label>Contraseña</label>
            </div>
            {loginError && <p className="text-red-400 mb-2">{loginError}</p>}
            <button type="submit" className="btn" onClick={(e)=>{handleRocket(e); doLogin()}}>
              Entrar
            </button>
            <p className="toggle-text">
              ¿No tienes cuenta?{" "}
              <span className="toggle-link" onClick={toggleForm}>
                Crear cuenta
              </span>
            </p>
          </form>
        </div>

        {/* REGISTRO */}
        <div className={`form-box signup-box ${!isLoginActive ? 'active' : ''}`}>
          <h2>Registrarse</h2>
          <form onSubmit={(e)=>{e.preventDefault(); doRegister()}}>
            <div className="input-box">
              <input type="text" required value={regUsername} onChange={(e)=>setRegUsername(e.target.value)} />
              <label>Nombre de usuario</label>
            </div>
            <div className="input-box">
              <input type="email" required value={regEmail} onChange={(e)=>setRegEmail(e.target.value)} />
              <label>Correo electrónico</label>
            </div>
            <div className="input-box">
              <input type="password" required value={regPassword} onChange={(e)=>setRegPassword(e.target.value)} />
              <label>Contraseña</label>
            </div>
            {regError && <p className="text-red-400 mb-2">{regError}</p>}
            <button type="submit" className="btn" onClick={(e)=>{handleRocket(e); doRegister()}}>
              Registrarse
            </button>
            <p className="toggle-text">
              ¿Ya tienes cuenta?{" "}
              <span className="toggle-link" onClick={toggleForm}>
                Iniciar sesión
              </span>
            </p>
          </form>
        </div>
        </div>

        {/* PANEL ANIMADO */}
        <div className="slider-panel">
          <div className="panel-content">
          {isLoginActive ? (
            <>
              <h2>¡Hola de nuevo!</h2>
              <p>Accede con tus credenciales para continuar.</p>
            </>
          ) : (
            <>
              <h2>¡Bienvenido!</h2>
              <p>Regístrate para unirte a nuestra comunidad.</p>
            </>
          )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
