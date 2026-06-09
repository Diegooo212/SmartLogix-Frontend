import { useState, useEffect } from 'react'

const STOCK_MINIMO = 5

function AdminInventario() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [actualizando, setActualizando] = useState(null)
  const [errorActualizar, setErrorActualizar] = useState(false)
  const [stockAnterior, setStockAnterior] = useState(null)

  useEffect(() => {
    fetch('/api/productos')
      .then(res => {
        if (!res.ok) throw new Error('Error')
        return res.json()
      })
      .then(data => {
        setProductos(data)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [])

  const handleActualizarStock = async (id, nuevoStock) => {
    if (nuevoStock < 0) return
    const anterior = productos.find(p => p.id === id).stock
    setStockAnterior(anterior)
    setActualizando(id)
    setErrorActualizar(false)

    setProductos(productos.map(p =>
      p.id === id ? { ...p, stock: nuevoStock } : p
    ))

    try {
      const res = await fetch(`/api/productos/${id}/stock`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: nuevoStock }),
      })
      if (!res.ok) throw new Error('Error')
    } catch {
      setProductos(productos.map(p =>
        p.id === id ? { ...p, stock: anterior } : p
      ))
      setErrorActualizar(true)
    } finally {
      setActualizando(null)
    }
  }

  const handleIncrementar = (id, stockActual) => {
    handleActualizarStock(id, stockActual + 1)
  }

  const handleDecrementar = (id, stockActual) => {
    if (stockActual > 0) handleActualizarStock(id, stockActual - 1)
  }

  const handleInputStock = (id, valor) => {
    const nuevoStock = parseInt(valor)
    if (!isNaN(nuevoStock) && nuevoStock >= 0) {
      handleActualizarStock(id, nuevoStock)
    }
  }

  return (
    <main>
      <h1>Gestión de Inventario</h1>

      {errorActualizar && (
        <div data-testid="error-actualizar">
          Error al actualizar el inventario
        </div>
      )}

      {loading && (
        <div data-testid="skeleton-loader">
          <div data-testid="skeleton-item" />
        </div>
      )}

      {error && (
        <div data-testid="error-inventario">
          <p>Error al cargar el inventario</p>
        </div>
      )}

      {!loading && !error && (
        <table data-testid="tabla-inventario">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Stock actual</th>
              <th>Ajustar stock</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(producto => (
              <tr
                key={producto.id}
                data-testid="inventario-fila"
                data-alerta={producto.stock < STOCK_MINIMO ? 'true' : 'false'}
                style={{
                  backgroundColor: producto.stock < STOCK_MINIMO ? '#ff4444' : 'transparent'
                }}
              >
                <td data-testid="fila-nombre">{producto.nombre}</td>
                <td data-testid="fila-categoria">{producto.categoria}</td>
                <td data-testid={`stock-actual-${producto.id}`}>{producto.stock}</td>
                <td>
                  <button
                    data-testid={`btn-decrementar-${producto.id}`}
                    onClick={() => handleDecrementar(producto.id, producto.stock)}
                    disabled={actualizando === producto.id}
                  >
                    -
                  </button>
                  <input
                    data-testid={`input-stock-${producto.id}`}
                    type="number"
                    value={producto.stock}
                    disabled={actualizando === producto.id}
                    onChange={e => handleInputStock(producto.id, e.target.value)}
                  />
                  <button
                    data-testid={`btn-incrementar-${producto.id}`}
                    onClick={() => handleIncrementar(producto.id, producto.stock)}
                    disabled={actualizando === producto.id}
                  >
                    +
                  </button>
                  {actualizando === producto.id && (
                    <span data-testid={`actualizando-${producto.id}`}>Guardando...</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}

export default AdminInventario