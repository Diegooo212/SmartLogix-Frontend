import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Register.module.css'
import { useAuth } from '../../../context/AuthContext'

function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ nombre: '', apellido: '', correo: '', password: '', confirmPassword: '', telefono: '' })
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
    if (Object.keys(nuevosErrores).length > 0) { setErrores(nuevosErrores); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Error')
      const data = await res.json()
      login(data.usuario)
      setExitoso(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch {
      setErrorServidor(true)
    } finally {
      setLoading(false)
    }
 }

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.logo}>Smart<span className={styles.logoAccent}>Logix</span></div>
        <h1 className={styles.titulo}>Crear cuenta</h1>

        {exitoso && <div data-testid="registro-exitoso" className={styles.exitoso}>Cuenta creada correctamente. Redirigiendo...</div>}
        {errorServidor && <div data-testid="error-servidor" className={styles.errorServidor}>Error al crear la cuenta. Intenta nuevamente.</div>}

        <div className={styles.form}>
          <div className={styles.fila}>
            <div className={styles.campo}>
              <label className={styles.label}>Nombre</label>
              <input data-testid="input-nombre" name="nombre" className={`${styles.input} ${errores.nombre ? styles.inputError : ''}`} placeholder="Tu nombre" value={form.nombre} onChange={handleChange} />
              {errores.nombre && <span data-testid="error-nombre" className={styles.errorMsg}>{errores.nombre}</span>}
            </div>
            <div className={styles.campo}>
              <label className={styles.label}>Apellido</label>
              <input data-testid="input-apellido" name="apellido" className={`${styles.input} ${errores.apellido ? styles.inputError : ''}`} placeholder="Tu apellido" value={form.apellido} onChange={handleChange} />
              {errores.apellido && <span data-testid="error-apellido" className={styles.errorMsg}>{errores.apellido}</span>}
            </div>
          </div>

          <div className={styles.campo}>
            <label className={styles.label}>Correo electrónico</label>
            <input data-testid="input-correo" name="correo" type="email" className={`${styles.input} ${errores.correo ? styles.inputError : ''}`} placeholder="tu@correo.cl" value={form.correo} onChange={handleChange} />
            {errores.correo && <span data-testid="error-correo" className={styles.errorMsg}>{errores.correo}</span>}
          </div>

          <div className={styles.fila}>
            <div className={styles.campo}>
              <label className={styles.label}>Contraseña</label>
              <input data-testid="input-password" name="password" type="password" className={`${styles.input} ${errores.password ? styles.inputError : ''}`} placeholder="••••••••" value={form.password} onChange={handleChange} />
              {errores.password && <span data-testid="error-password" className={styles.errorMsg}>{errores.password}</span>}
            </div>
            <div className={styles.campo}>
              <label className={styles.label}>Confirmar contraseña</label>
              <input data-testid="input-confirm-password" name="confirmPassword" type="password" className={`${styles.input} ${errores.confirmPassword ? styles.inputError : ''}`} placeholder="••••••••" value={form.confirmPassword} onChange={handleChange} />
              {errores.confirmPassword && <span data-testid="error-confirm-password" className={styles.errorMsg}>{errores.confirmPassword}</span>}
            </div>
          </div>

          <div className={styles.campo}>
            <label className={styles.label}>Teléfono (opcional)</label>
            <input data-testid="input-telefono" name="telefono" className={styles.input} placeholder="+56 9 1234 5678" value={form.telefono} onChange={handleChange} />
          </div>

          <button data-testid="btn-registrar" className={styles.btnSubmit} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </div>

        <button data-testid="link-login" className={styles.linkLogin} onClick={() => navigate('/login')}>
          ¿Ya tienes cuenta? Inicia sesión
        </button>
      </div>
    </main>
  )
}

export default Register