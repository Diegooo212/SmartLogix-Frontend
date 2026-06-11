import { useState, useEffect } from 'react'
import styles from './Promociones.module.css'

function AdminPromociones() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [filtro, setFiltro] = useState('todos')
  const [guardando, setGuardando] = useState(null)
  const [errorGuardar, setErrorGuardar] = useState(false)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [productoEditando, setProductoEditando] = useState(null)
  const [precioOferta, setPrecioOferta] = useState('')
  const [errorPrecio, setErrorPrecio] = useState('')

  useEffect(() => {
    fetch('/api/productos')
      .then(res => { if (!res.ok) throw new Error('Error'); return res.json() })
      .then(data => { setProductos(data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [])

  const handleToggleDestacado = async (id, valorActual) => {
    setGuardando(id)
    setErrorGuardar(false)
    try {
      const res = await fetch(`/api/productos/${id}/destacado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destacado: !valorActual }),
      })
      if (!res.ok) throw new Error('Error')
      setProductos(productos.map(p => p.id === id ? { ...p, destacado: !valorActual } : p))
    } catch {
      setErrorGuardar(true)
    } finally {
      setGuardando(null)
    }
  }

  const handleAbrirOferta = (producto) => {
    setProductoEditando(producto)
    setPrecioOferta(producto.precioOferta ? String(producto.precioOferta) : '')
    setErrorPrecio('')
    setModalAbierto(true)
  }

  const handleGuardarOferta = async () => {
    const precio = parseFloat(precioOferta)
    if (isNaN(precio) || precio <= 0) { setErrorPrecio('El precio oferta debe ser mayor a 0'); return }
    if (precio >= productoEditando.precio) { setErrorPrecio('El precio oferta debe ser menor al precio base'); return }
    setGuardando(productoEditando.id)
    try {
      const res = await fetch(`/api/productos/${productoEditando.id}/oferta`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ precioOferta: precio }),
      })
      if (!res.ok) throw new Error('Error')
      setProductos(productos.map(p => p.id === productoEditando.id ? { ...p, precioOferta: precio, enOferta: true } : p))
      setModalAbierto(false)
    } catch {
      setErrorGuardar(true)
    } finally {
      setGuardando(null)
    }
  }

  const productosFiltrados = productos.filter(p => {
    if (filtro === 'destacados') return p.destacado
    if (filtro === 'oferta') return p.enOferta
    return true
  })

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.titulo}>Promociones y Destacados</h1>
        <div data-testid="filtros-promociones" className={styles.filtros}>
          {['todos', 'destacados', 'oferta'].map(f => (
            <button key={f} data-testid={`filtro-${f}`} className={`${styles.btnFiltro} ${filtro === f ? styles.btnFiltroActivo : ''}`} onClick={() => setFiltro(f)}>{f}</button>
          ))}
        </div>
      </div>

      {errorGuardar && <div data-testid="error-guardar" className={styles.errorGuardar}>Error al guardar los cambios</div>}
      {loading && <div data-testid="skeleton-loader" className={styles.skeleton}><div data-testid="skeleton-item" /></div>}
      {error && <div data-testid="error-productos"><p>Error al cargar productos</p></div>}

      {!loading && !error && (
        <div className={styles.tablaWrapper}>
          <table data-testid="tabla-promociones" className={styles.tabla}>
            <thead>
              <tr><th>Producto</th><th>Precio base</th><th>Precio oferta</th><th>Destacado</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {productosFiltrados.map(producto => (
                <tr key={producto.id} data-testid="promocion-fila">
                  <td data-testid="fila-nombre">{producto.nombre}</td>
                  <td><span className={styles.precioBase}>${producto.precio.toLocaleString('es-CL')}</span></td>
                  <td><span data-testid={`precio-oferta-${producto.id}`} className={styles.precioOferta}>{producto.precioOferta ? `$${producto.precioOferta.toLocaleString('es-CL')}` : '-'}</span></td>
                  <td>
                    <input type="checkbox" data-testid={`toggle-destacado-${producto.id}`} className={styles.toggle} checked={producto.destacado || false} disabled={guardando === producto.id} onChange={() => handleToggleDestacado(producto.id, producto.destacado)} />
                  </td>
                  <td>
                    <button data-testid={`btn-editar-oferta-${producto.id}`} className={styles.btnEditarOferta} onClick={() => handleAbrirOferta(producto)} disabled={guardando === producto.id}>Editar oferta</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalAbierto && productoEditando && (
        <div className={styles.modalOverlay}>
          <div data-testid="modal-oferta" className={styles.modal}>
            <h2 className={styles.modalTitulo}>Editar oferta — {productoEditando.nombre}</h2>
            <p data-testid="precio-base-modal" className={styles.precioBaseModal}>Precio base: ${productoEditando.precio.toLocaleString('es-CL')}</p>
            <div className={styles.campo}>
              <label className={styles.label}>Precio oferta</label>
              <input data-testid="input-precio-oferta" className={styles.input} type="number" placeholder="Precio oferta" value={precioOferta} onChange={e => { setPrecioOferta(e.target.value); setErrorPrecio('') }} />
              {errorPrecio && <span data-testid="error-precio-oferta" className={styles.errorMsg}>{errorPrecio}</span>}
            </div>
            <div className={styles.modalAcciones}>
              <button data-testid="btn-guardar-oferta" className={styles.btnGuardar} onClick={handleGuardarOferta}>Guardar oferta</button>
              <button data-testid="btn-cancelar-modal" className={styles.btnCancelar} onClick={() => setModalAbierto(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default AdminPromociones