import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    password: '',
    confirmPassword: '',
    telefono: '',
  })
  const [errores, setErrores] = useState({})
  const [loading, setLoading] = useState(false)
  const [exitoso, setExitoso] = useState(false)
  const [errorServidor, setErrorServidor] = useState(false)

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrores({ ...errores, [e.target.name]: '' })
  }

  const validar = () => {
    const nuevosErrores = {}

    if (!form.nombre.trim()) nuevosErrores.nombre = 'El nombre es requerido'
    if (!form.apellido.trim()) nuevosErrores.apellido = 'El apellido es requerido'
    if (!form.correo.includes('@')) nuevosErrores.correo = 'Correo inválido'
    if (form.password.length < 8) nuevosErrores.password = 'Mínimo 8 caracteres'
    if (form.password !== form.confirmPassword) nuevosErrores.confirmPassword = 'Las contraseñas no coinciden'

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
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Error del servidor')
      setExitoso(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch {
      setErrorServidor(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <h1>Crear cuenta</h1>

      {/* CA8: Registro exitoso */}
      {exitoso && (
        <div data-testid="registro-exitoso">
          Cuenta creada correctamente. Redirigiendo...
        </div>
      )}

      {/* CA9: Error del servidor */}
      {errorServidor && (
        <div data-testid="error-servidor">
          Error al crear la cuenta. Intenta nuevamente.
        </div>
      )}

      {/* CA1: Campos del formulario */}
      <input
        data-testid="input-nombre"
        name="nombre"
        placeholder="Nombre"
        value={form.nombre}
        onChange={handleChange}
      />
      {errores.nombre && <span data-testid="error-nombre">{errores.nombre}</span>}

      <input
        data-testid="input-apellido"
        name="apellido"
        placeholder="Apellido"
        value={form.apellido}
        onChange={handleChange}
      />
      {errores.apellido && <span data-testid="error-apellido">{errores.apellido}</span>}

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

      <input
        data-testid="input-confirm-password"
        name="confirmPassword"
        type="password"
        placeholder="Confirmar contraseña"
        value={form.confirmPassword}
        onChange={handleChange}
      />
      {errores.confirmPassword && (
        <span data-testid="error-confirm-password">{errores.confirmPassword}</span>
      )}

      <input
        data-testid="input-telefono"
        name="telefono"
        placeholder="Teléfono (opcional)"
        value={form.telefono}
        onChange={handleChange}
      />

      {/* CA6: Botón registrar */}
      <button
        data-testid="btn-registrar"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Registrando...' : 'Crear cuenta'}
      </button>

      {/* CA7: Link a login */}
      <button
        data-testid="link-login"
        onClick={() => navigate('/login')}
      >
        ¿Ya tienes cuenta? Inicia sesión
      </button>
    </main>
  )
}

export default Register