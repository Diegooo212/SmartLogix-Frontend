import { useState, useEffect } from 'react'
import styles from './Productos.module.css'

const productoInicial = { id: null, nombre: '', precio: '', categoria: '', marca: '', stock: '', descripcion: '' }

function AdminProductos() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [form, setForm] = useState(productoInicial)
  const [errores, setErrores] = useState({})
  const [guardando, setGuardando] = useState(false)
  const [exitoso, setExitoso] = useState(false)
  const [eliminando, setEliminando] = useState(null)
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    fetch('/api/productos')
      .then(res => { if (!res.ok) throw new Error('Error'); return res.json() })
      .then(data => { setProductos(data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [])

  const validar = () => {
    const e = {}
    if (!form.nombre.trim()) e.nombre = 'El nombre es requerido'
    if (!form.precio || isNaN(form.precio)) e.precio = 'El precio es inválido'
    if (!form.categoria.trim()) e.categoria = 'La categoría es requerida'
    return e
  }

  const handleGuardar = async () => {
    const e = validar()
    if (Object.keys(e).length > 0) { setErrores(e); return }
    setGuardando(true)
    try {
      const url = form.id ? `/api/productos/${form.id}` : '/api/productos'
      const method = form.id ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!res.ok) throw new Error('Error')
      const data = await res.json()
      if (form.id) setProductos(productos.map(p => p.id === form.id ? data : p))
      else setProductos([...productos, data])
      setModalAbierto(false)
      setForm(productoInicial)
      setExitoso(true)
      setTimeout(() => setExitoso(false), 2000)
    } catch {
      setErrores({ servidor: 'Error al guardar el producto' })
    } finally {
      setGuardando(false)
    }
  }

  const handleEliminar = async (id) => {
    setEliminando(id)
    try {
      const res = await fetch(`/api/productos/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Error')
      setProductos(productos.filter(p => p.id !== id))
    } catch {
      setError(true)
    } finally {
      setEliminando(null)
    }
  }

  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.titulo}>Gestión de Productos</h1>
        <div className={styles.acciones}>
          <input data-testid="buscador-productos" className={styles.buscador} placeholder="Buscar producto..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
          <button data-testid="btn-nuevo-producto" className={styles.btnNuevo} onClick={() => { setForm(productoInicial); setErrores({}); setModalAbierto(true) }}>
            + Agregar producto
          </button>
        </div>
      </div>

      {exitoso && <div data-testid="exitoso" className={styles.exitoso}>✓ Producto guardado correctamente</div>}
      {loading && <div data-testid="skeleton-loader" className={styles.skeleton}><div data-testid="skeleton-item" /></div>}
      {error && <div data-testid="error-productos"><p>Error al cargar los productos</p></div>}

      {!loading && !error && (
        <div className={styles.tablaWrapper}>
          <table data-testid="tabla-productos" className={styles.tabla}>
            <thead>
              <tr><th>Nombre</th><th>Precio</th><th>Categoría</th><th>Stock</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {productosFiltrados.map(producto => (
                <tr key={producto.id} data-testid="producto-fila">
                  <td data-testid="fila-nombre">{producto.nombre}</td>
                  <td><span className={styles.precio}>${producto.precio.toLocaleString('es-CL')}</span></td>
                  <td data-testid="fila-categoria">{producto.categoria}</td>
                  <td data-testid="fila-stock">{producto.stock}</td>
                  <td>
                    <button data-testid={`btn-editar-${producto.id}`} className={styles.btnEditar} onClick={() => { setForm({ ...producto, precio: String(producto.precio) }); setModalAbierto(true) }}>Editar</button>
                    <button data-testid={`btn-eliminar-${producto.id}`} className={styles.btnEliminar} onClick={() => handleEliminar(producto.id)} disabled={eliminando === producto.id}>
                      {eliminando === producto.id ? 'Eliminando...' : 'Eliminar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalAbierto && (
        <div className={styles.modalOverlay}>
          <div data-testid="modal-producto" className={styles.modal}>
            <h2 className={styles.modalTitulo}>{form.id ? 'Editar producto' : 'Nuevo producto'}</h2>
            <div className={styles.form}>
              <div className={styles.fila}>
                <div className={styles.campo}>
                  <label className={styles.label}>Nombre</label>
                  <input data-testid="input-nombre" className={`${styles.input} ${errores.nombre ? styles.inputError : ''}`} value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
                  {errores.nombre && <span data-testid="error-nombre" className={styles.errorMsg}>{errores.nombre}</span>}
                </div>
                <div className={styles.campo}>
                  <label className={styles.label}>Precio</label>
                  <input data-testid="input-precio" className={`${styles.input} ${errores.precio ? styles.inputError : ''}`} value={form.precio} onChange={e => setForm({ ...form, precio: e.target.value })} />
                  {errores.precio && <span data-testid="error-precio" className={styles.errorMsg}>{errores.precio}</span>}
                </div>
              </div>
              <div className={styles.fila}>
                <div className={styles.campo}>
                  <label className={styles.label}>Categoría</label>
                  <input data-testid="input-categoria" className={`${styles.input} ${errores.categoria ? styles.inputError : ''}`} value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })} />
                  {errores.categoria && <span data-testid="error-categoria" className={styles.errorMsg}>{errores.categoria}</span>}
                </div>
                <div className={styles.campo}>
                  <label className={styles.label}>Marca</label>
                  <input data-testid="input-marca" className={styles.input} value={form.marca} onChange={e => setForm({ ...form, marca: e.target.value })} />
                </div>
              </div>
              <div className={styles.campo}>
                <label className={styles.label}>Stock</label>
                <input data-testid="input-stock" className={styles.input} value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
              </div>
              {errores.servidor && <span data-testid="error-servidor" className={styles.errorMsg}>{errores.servidor}</span>}
            </div>
            <div className={styles.modalAcciones}>
              <button data-testid="btn-guardar" className={styles.btnGuardar} onClick={handleGuardar} disabled={guardando}>
                {guardando ? 'Guardando...' : 'Guardar'}
              </button>
              <button data-testid="btn-cancelar" className={styles.btnCancelar} onClick={() => { setModalAbierto(false); setErrores({}) }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default AdminProductos