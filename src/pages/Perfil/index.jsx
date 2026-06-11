import { useState, useEffect } from 'react'
import styles from './Perfil.module.css'

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
      .then(res => { if (!res.ok) throw new Error('Error'); return res.json() })
      .then(data => { setPerfil(data); setForm(data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [])

  const validar = () => {
    const nuevosErrores = {}
    if (!form.nombre?.trim()) nuevosErrores.nombre = 'El nombre es requerido'
    if (!form.correo?.includes('@')) nuevosErrores.correo = 'Correo inválido'
    return nuevosErrores
  }

  const handleGuardar = async () => {
    const nuevosErrores = validar()
    if (Object.keys(nuevosErrores).length > 0) { setErrores(nuevosErrores); return }
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

  const iniciales = perfil ? `${perfil.nombre?.[0] || ''}${perfil.apellido?.[0] || ''}`.toUpperCase() : ''

  return (
    <main className={styles.main}>
      <h1 className={styles.titulo}>Mi perfil</h1>

      {loading && (
        <div data-testid="skeleton-loader" className={styles.skeleton}>
          {[1,2,3,4].map(i => <div key={i} data-testid="skeleton-item" className={styles.skeletonLinea} />)}
        </div>
      )}

      {error && <div data-testid="error-perfil"><p>Error al cargar el perfil</p></div>}

      {guardadoExitoso && <div data-testid="guardado-exitoso" className={styles.exitoso}>✓ Perfil actualizado correctamente</div>}
      {errorGuardar && <div data-testid="error-guardar" className={styles.errorGuardar}>Error al guardar los cambios</div>}

      {!loading && !error && perfil && (
        <div data-testid="contenido-perfil" className={styles.card}>
          <div className={styles.header}>
            <div className={styles.avatar}>{iniciales}</div>
            {!editando && (
              <button data-testid="btn-editar" className={styles.btnEditar} onClick={() => setEditando(true)}>
                Editar perfil
              </button>
            )}
          </div>

          {!editando ? (
            <div data-testid="vista-perfil" className={styles.grid}>
              <div className={styles.campo}>
                <span className={styles.label}>Nombre</span>
                <span data-testid="perfil-nombre" className={styles.valor}>{perfil.nombre}</span>
              </div>
              <div className={styles.campo}>
                <span className={styles.label}>Apellido</span>
                <span data-testid="perfil-apellido" className={styles.valor}>{perfil.apellido}</span>
              </div>
              <div className={styles.campo}>
                <span className={styles.label}>Correo</span>
                <span data-testid="perfil-correo" className={styles.valor}>{perfil.correo}</span>
              </div>
              <div className={styles.campo}>
                <span className={styles.label}>Teléfono</span>
                <span data-testid="perfil-telefono" className={styles.valor}>{perfil.telefono}</span>
              </div>
            </div>
          ) : (
            <div data-testid="form-edicion" className={styles.grid}>
              <div className={styles.campo}>
                <span className={styles.label}>Nombre</span>
                <input data-testid="input-nombre" className={`${styles.input} ${errores.nombre ? styles.inputError : ''}`} value={form.nombre || ''} onChange={e => setForm({ ...form, nombre: e.target.value })} />
                {errores.nombre && <span data-testid="error-nombre" className={styles.errorMsg}>{errores.nombre}</span>}
              </div>
              <div className={styles.campo}>
                <span className={styles.label}>Apellido</span>
                <input data-testid="input-apellido" className={styles.input} value={form.apellido || ''} onChange={e => setForm({ ...form, apellido: e.target.value })} />
              </div>
              <div className={styles.campo}>
                <span className={styles.label}>Correo</span>
                <input data-testid="input-correo" className={`${styles.input} ${errores.correo ? styles.inputError : ''}`} value={form.correo || ''} onChange={e => setForm({ ...form, correo: e.target.value })} />
                {errores.correo && <span data-testid="error-correo" className={styles.errorMsg}>{errores.correo}</span>}
              </div>
              <div className={styles.campo}>
                <span className={styles.label}>Teléfono</span>
                <input data-testid="input-telefono" className={styles.input} value={form.telefono || ''} onChange={e => setForm({ ...form, telefono: e.target.value })} />
              </div>

              <div className={styles.acciones}>
                <button data-testid="btn-guardar" className={styles.btnGuardar} onClick={handleGuardar} disabled={guardando}>
                  {guardando ? 'Guardando...' : 'Guardar cambios'}
                </button>
                <button data-testid="btn-cancelar" className={styles.btnCancelar} onClick={handleCancelar}>
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  )
}

export default Perfil