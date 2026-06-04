import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ correo: '', password: '' })
  const [errores, setErrores] = useState({})
  const [loading, setLoading] = useState(false)
  const [errorServidor, setErrorServidor] = useState(false)
  const [exitoso, setExitoso] = useState(false)

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrores({ ...errores, [e.target.name]: '' })
    setErrorServidor(false)
  }

  const validar = () => {
    const nuevosErrores = {}
    if (!form.correo.includes('@')) nuevosErrores.correo = 'Correo inválido'
    if (form.password.length < 8) nuevosErrores.password = 'Mínimo 8 caracteres'
    return nuevosErrores
  }

  const handleSubmit = async () => {
    const nuevosErrores = validar()
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores)
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Credenciales incorrectas')
      setExitoso(true)
      setTimeout(() => navigate('/'), 2000)
    } catch {
      setErrorServidor(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <h1>Iniciar sesión</h1>

      {/* CA7: Login exitoso */}
      {exitoso && (
        <div data-testid="login-exitoso">
          Bienvenido de vuelta. Redirigiendo...
        </div>
      )}

      {/* CA6: Error de credenciales */}
      {errorServidor && (
        <div data-testid="error-credenciales">
          Correo o contraseña incorrectos
        </div>
      )}

      {/* CA1: Campos del formulario */}
      <input
        data-testid="input-correo"
        name="correo"
        type="email"
        placeholder="Correo electrónico"
        value={form.correo}
        onChange={handleChange}
      />
      {errores.correo && <span data-testid="error-correo">{errores.correo}</span>}

      <input
        data-testid="input-password"
        name="password"
        type="password"
        placeholder="Contraseña"
        value={form.password}
        onChange={handleChange}
      />
      {errores.password && <span data-testid="error-password">{errores.password}</span>}

      {/* CA2: Botón iniciar sesión */}
      <button
        data-testid="btn-login"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </button>

      {/* CA4: Link a registro */}
      <button
        data-testid="link-registro"
        onClick={() => navigate('/registro')}
      >
        ¿No tienes cuenta? Regístrate
      </button>

      {/* CA5: Link recuperar contraseña */}
      <button
        data-testid="link-recuperar"
        onClick={() => navigate('/recuperar-password')}
      >
        ¿Olvidaste tu contraseña?
      </button>
    </main>
  )
}

export default Login