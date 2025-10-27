"use client"

import type React from "react"
import { useState } from "react"
import "./App.css"

const handleRocket = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault()
  const button = e.currentTarget
  button.classList.add("launch")
  setTimeout(() => button.classList.remove("launch"), 1000)
}

export function LoginPage() {
  const [isLoginActive, setIsLoginActive] = useState<boolean>(true)

  const toggleForm = () => {
    setIsLoginActive(!isLoginActive)
  }

  return (
    <div className={`auth-container ${isLoginActive ? "login-active" : "signup-active"}`}>
      <div className="form-container">
        {/* LOGIN */}
        <div className="form-box login-box">
          <h2>Iniciar Sesión</h2>
          <form>
            <div className="input-box">
              <input type="email" required />
              <label>Correo electrónico</label>
            </div>
            <div className="input-box">
              <input type="password" required />
              <label>Contraseña</label>
            </div>
            <button type="submit" className="btn" onClick={handleRocket}>
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
        <div className="form-box signup-box">
          <h2>Registrarse</h2>
          <form>
            <div className="input-box">
              <input type="text" required />
              <label>Nombre de usuario</label>
            </div>
            <div className="input-box">
              <input type="email" required />
              <label>Correo electrónico</label>
            </div>
            <div className="input-box">
              <input type="password" required />
              <label>Contraseña</label>
            </div>
            <button type="submit" className="btn" onClick={handleRocket}>
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
  )
}

export default LoginPage
