import { useState } from 'react'
import styles from './RecuperarPassword.module.css'

function RecuperarPassword() {
  const [correo, setCorreo] = useState('')
  const [errorCorreo, setErrorCorreo] = useState('')
  const [loading, setLoading] = useState(false)
  const [exitoso, setExitoso] = useState(false)
  const [errorToast, setErrorToast] = useState(false)

  const validar = () => {
    if (!correo.includes('@')) {
      setErrorCorreo('Correo inválido')
      return false
    }
    setErrorCorreo('')
    return true
  }

  const handleEnviar = async () => {
    if (!validar()) return
    setLoading(true)
    setErrorToast(false)
    try {
      const res = await fetch('/api/auth/recuperar-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo }),
      })
      if (!res.ok) throw new Error('Error')
      setExitoso(true)
    } catch {
      setErrorToast(true)
      setTimeout(() => setErrorToast(false), 3000)
    } finally {
      setLoading(false)
    }
  }

  if (exitoso) {
    return (
      <main className={styles.main}>
        <div className={styles.card}>
          <div data-testid="confirmacion-exitosa" className={styles.confirmacion}>
            <span className={styles.confirmacionIcono}>✉️</span>
            <h2 className={styles.confirmacionTitulo}>¡Correo enviado!</h2>
            <p className={styles.confirmacionMsg}>
              Te hemos enviado las instrucciones a tu correo
            </p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.logo}>
          Smart<span className={styles.logoAccent}>Logix</span>
        </div>
        <h1 className={styles.titulo}>Recuperar contraseña</h1>
        <p className={styles.subtitulo}>
          Ingresa tu correo y te enviaremos las instrucciones para restablecer tu contraseña.
        </p>

        {errorToast && (
          <div data-testid="toast-error" className={styles.toast}>
            Error de red. Intenta nuevamente.
          </div>
        )}

        <div className={styles.form}>
          <div className={styles.campo}>
            <label className={styles.label}>Correo electrónico</label>
            <input
              data-testid="input-correo"
              type="email"
              className={`${styles.input} ${errorCorreo ? styles.inputError : ''}`}
              placeholder="tu@correo.cl"
              value={correo}
              onChange={e => { setCorreo(e.target.value); setErrorCorreo('') }}
            />
            {errorCorreo && <span data-testid="error-correo" className={styles.errorMsg}>{errorCorreo}</span>}
          </div>

          <button
            data-testid="btn-enviar"
            className={styles.btnSubmit}
            onClick={handleEnviar}
            disabled={loading}
          >
            {loading ? 'Enviando...' : 'Enviar instrucciones'}
          </button>
        </div>
      </div>
    </main>
  )
}

export default RecuperarPassword