import { useState, useEffect } from 'react'

function Perfil() {
  const [perfil, setPerfil] = useState(null)
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [editando, setEditando] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [guardadoExitoso, setGuardadoExitoso] = useState(false)
  const [errorGuardar, setErrorGuardar] = useState(false)
  const [errores, setErrores] = useState({})

  useEffect(() => {
    fetch('/api/perfil')
      .then(res => {
        if (!res.ok) throw new Error('Error')
        return res.json()
      })
      .then(data => {
        setPerfil(data)
        setForm(data)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [])

  const validar = () => {
    const nuevosErrores = {}
    if (!form.nombre?.trim()) nuevosErrores.nombre = 'El nombre es requerido'
    if (!form.correo?.includes('@')) nuevosErrores.correo = 'Correo inválido'
    return nuevosErrores
  }

  const handleGuardar = async () => {
    const nuevosErrores = validar()
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores)
      return
    }

    setGuardando(true)
    try {
      const res = await fetch('/api/perfil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Error')
      setPerfil(form)
      setEditando(false)
      setGuardadoExitoso(true)
      setTimeout(() => setGuardadoExitoso(false), 2000)
    } catch {
      setErrorGuardar(true)
    } finally {
      setGuardando(false)
    }
  }

  const handleCancelar = () => {
    setForm(perfil)
    setEditando(false)
    setErrores({})
    setErrorGuardar(false)
  }

  return (
    <main>
      <h1>Mi perfil</h1>

      {loading && <div data-testid="skeleton-loader"><div data-testid="skeleton-item" /></div>}

      {error && <div data-testid="error-perfil"><p>Error al cargar el perfil</p></div>}

      {guardadoExitoso && (
        <div data-testid="guardado-exitoso">Perfil actualizado correctamente</div>
      )}

      {errorGuardar && (
        <div data-testid="error-guardar">Error al guardar los cambios</div>
      )}

      {!loading && !error && perfil && (
        <div data-testid="contenido-perfil">

          {/* CA1: Datos del perfil */}
          {!editando ? (
            <div data-testid="vista-perfil">
              <span data-testid="perfil-nombre">{perfil.nombre}</span>
              <span data-testid="perfil-apellido">{perfil.apellido}</span>
              <span data-testid="perfil-correo">{perfil.correo}</span>
              <span data-testid="perfil-telefono">{perfil.telefono}</span>

              {/* CA2: Botón editar */}
              <button
                data-testid="btn-editar"
                onClick={() => setEditando(true)}
              >
                Editar perfil
              </button>
            </div>
          ) : (
            /* CA3: Formulario de edición */
            <div data-testid="form-edicion">
              <input
                data-testid="input-nombre"
                value={form.nombre || ''}
                onChange={e => setForm({ ...form, nombre: e.target.value })}
              />
              {errores.nombre && <span data-testid="error-nombre">{errores.nombre}</span>}

              <input
                data-testid="input-apellido"
                value={form.apellido || ''}
                onChange={e => setForm({ ...form, apellido: e.target.value })}
              />

              <input
                data-testid="input-correo"
                value={form.correo || ''}
                onChange={e => setForm({ ...form, correo: e.target.value })}
              />
              {errores.correo && <span data-testid="error-correo">{errores.correo}</span>}

              <input
                data-testid="input-telefono"
                value={form.telefono || ''}
                onChange={e => setForm({ ...form, telefono: e.target.value })}
              />

              {/* CA4: Botones guardar y cancelar */}
              <button
                data-testid="btn-guardar"
                onClick={handleGuardar}
                disabled={guardando}
              >
                {guardando ? 'Guardando...' : 'Guardar cambios'}
              </button>

              <button
                data-testid="btn-cancelar"
                onClick={handleCancelar}
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      )}
    </main>
  )
}

export default Perfil