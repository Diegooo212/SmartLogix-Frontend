import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Login.module.css'

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
    if (Object.keys(nuevosErrores).length > 0) { setErrores(nuevosErrores); return }
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
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.logo}>
          Smart<span className={styles.logoAccent}>Logix</span>
        </div>
        <h1 className={styles.titulo}>Iniciar sesión</h1>

        {exitoso && <div data-testid="login-exitoso" className={styles.exitoso}>Bienvenido de vuelta. Redirigiendo...</div>}
        {errorServidor && <div data-testid="error-credenciales" className={styles.errorCredenciales}>Correo o contraseña incorrectos</div>}

        <div className={styles.form}>
          <div className={styles.campo}>
            <label className={styles.label}>Correo electrónico</label>
            <input
              data-testid="input-correo"
              name="correo"
              type="email"
              className={`${styles.input} ${errores.correo ? styles.inputError : ''}`}
              placeholder="tu@correo.cl"
              value={form.correo}
              onChange={handleChange}
            />
            {errores.correo && <span data-testid="error-correo" className={styles.errorMsg}>{errores.correo}</span>}
          </div>

          <div className={styles.campo}>
            <label className={styles.label}>Contraseña</label>
            <input
              data-testid="input-password"
              name="password"
              type="password"
              className={`${styles.input} ${errores.password ? styles.inputError : ''}`}
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
            />
            {errores.password && <span data-testid="error-password" className={styles.errorMsg}>{errores.password}</span>}
          </div>

          <button data-testid="btn-login" className={styles.btnSubmit} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </div>

        <div className={styles.links}>
          <button data-testid="link-recuperar" className={styles.link} onClick={() => navigate('/recuperar-password')}>
            ¿Olvidaste tu contraseña?
          </button>
          <button data-testid="link-registro" className={styles.link} onClick={() => navigate('/registro')}>
            ¿No tienes cuenta? Regístrate
          </button>
        </div>
      </div>
    </main>
  )
}

export default Login