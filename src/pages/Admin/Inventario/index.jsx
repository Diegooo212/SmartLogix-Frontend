import { useState, useEffect } from 'react'
import styles from './Inventario.module.css'

const STOCK_MINIMO = 5

function AdminInventario() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [actualizando, setActualizando] = useState(null)
  const [errorActualizar, setErrorActualizar] = useState(false)

  useEffect(() => {
    fetch('/api/productos')
      .then(res => { if (!res.ok) throw new Error('Error'); return res.json() })
      .then(data => { setProductos(data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [])

  const handleActualizarStock = async (id, nuevoStock) => {
    if (nuevoStock < 0) return
    const anterior = productos.find(p => p.id === id).stock
    setActualizando(id)
    setErrorActualizar(false)
    setProductos(productos.map(p => p.id === id ? { ...p, stock: nuevoStock } : p))
    try {
      const res = await fetch(`/api/productos/${id}/stock`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: nuevoStock }),
      })
      if (!res.ok) throw new Error('Error')
    } catch {
      setProductos(productos.map(p => p.id === id ? { ...p, stock: anterior } : p))
      setErrorActualizar(true)
    } finally {
      setActualizando(null)
    }
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.titulo}>Gestión de Inventario</h1>

      {errorActualizar && <div data-testid="error-actualizar" className={styles.errorActualizar}>Error al actualizar el inventario</div>}
      {loading && <div data-testid="skeleton-loader" className={styles.skeleton}><div data-testid="skeleton-item" /></div>}
      {error && <div data-testid="error-inventario"><p>Error al cargar el inventario</p></div>}

      {!loading && !error && (
        <div className={styles.tablaWrapper}>
          <table data-testid="tabla-inventario" className={styles.tabla}>
            <thead>
              <tr><th>Producto</th><th>Categoría</th><th>Stock actual</th><th>Ajustar stock</th></tr>
            </thead>
            <tbody>
              {productos.map(producto => (
                <tr
                  key={producto.id}
                  data-testid="inventario-fila"
                  data-alerta={producto.stock < STOCK_MINIMO ? 'true' : 'false'}
                  className={producto.stock < STOCK_MINIMO ? styles.filaAlerta : ''}
                >
                  <td data-testid="fila-nombre">{producto.nombre}</td>
                  <td data-testid="fila-categoria">{producto.categoria}</td>
                  <td>
                    <span
                      data-testid={`stock-actual-${producto.id}`}
                      className={producto.stock < STOCK_MINIMO ? styles.stockBajo : ''}
                    >
                      {producto.stock}
                    </span>
                  </td>
                  <td>
                    <div className={styles.selectorStock}>
                      <button data-testid={`btn-decrementar-${producto.id}`} className={styles.btnStock} disabled={actualizando === producto.id} onClick={() => producto.stock > 0 && handleActualizarStock(producto.id, producto.stock - 1)}>-</button>
                      <input data-testid={`input-stock-${producto.id}`} className={styles.inputStock} type="number" value={producto.stock} disabled={actualizando === producto.id} onChange={e => { const v = parseInt(e.target.value); if (!isNaN(v) && v >= 0) handleActualizarStock(producto.id, v) }} />
                      <button data-testid={`btn-incrementar-${producto.id}`} className={styles.btnStock} disabled={actualizando === producto.id} onClick={() => handleActualizarStock(producto.id, producto.stock + 1)}>+</button>
                      {actualizando === producto.id && <span data-testid={`actualizando-${producto.id}`} className={styles.guardando}>Guardando...</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}

export default AdminInventario