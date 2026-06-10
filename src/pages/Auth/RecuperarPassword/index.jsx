import { useState } from 'react'

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
      <div data-testid="confirmacion-exitosa">
        <p>Te hemos enviado las instrucciones a tu correo</p>
      </div>
    )
  }

  return (
    <main>
      <h1>Recuperar contraseña</h1>

      {/* CA5: Toast de error */}
      {errorToast && (
        <div data-testid="toast-error">
          Error de red. Intenta nuevamente.
        </div>
      )}

      {/* CA1: Campo de correo */}
      <input
        data-testid="input-correo"
        type="email"
        placeholder="Correo electrónico"
        value={correo}
        onChange={e => {
          setCorreo(e.target.value)
          setErrorCorreo('')
        }}
      />
      {errorCorreo && <span data-testid="error-correo">{errorCorreo}</span>}

      {/* CA3: Botón con estado de carga */}
      <button
        data-testid="btn-enviar"
        onClick={handleEnviar}
        disabled={loading}
      >
        {loading ? 'Enviando...' : 'Enviar instrucciones'}
      </button>
    </main>
  )
}

export default RecuperarPassword