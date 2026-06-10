import { useState, useEffect } from 'react'

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
      setProductos(productos.map(p =>
        p.id === id ? { ...p, destacado: !valorActual } : p
      ))
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
    if (isNaN(precio) || precio <= 0) {
      setErrorPrecio('El precio oferta debe ser mayor a 0')
      return
    }
    if (precio >= productoEditando.precio) {
      setErrorPrecio('El precio oferta debe ser menor al precio base')
      return
    }

    setGuardando(productoEditando.id)
    try {
      const res = await fetch(`/api/productos/${productoEditando.id}/oferta`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ precioOferta: precio }),
      })
      if (!res.ok) throw new Error('Error')
      setProductos(productos.map(p =>
        p.id === productoEditando.id ? { ...p, precioOferta: precio, enOferta: true } : p
      ))
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
    <main>
      <h1>Promociones y Productos Destacados</h1>

      {errorGuardar && (
        <div data-testid="error-guardar">Error al guardar los cambios</div>
      )}

      {/* CA4: Filtro */}
      <div data-testid="filtros-promociones">
        {['todos', 'destacados', 'oferta'].map(f => (
          <button
            key={f}
            data-testid={`filtro-${f}`}
            onClick={() => setFiltro(f)}
            style={{ fontWeight: filtro === f ? 'bold' : 'normal' }}
          >
            {f}
          </button>
        ))}
      </div>

      {loading && <div data-testid="skeleton-loader"><div data-testid="skeleton-item" /></div>}
      {error && <div data-testid="error-productos"><p>Error al cargar productos</p></div>}

      {!loading && !error && (
        <table data-testid="tabla-promociones">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio base</th>
              <th>Precio oferta</th>
              <th>Destacado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map(producto => (
              <tr key={producto.id} data-testid="promocion-fila">
                <td data-testid="fila-nombre">{producto.nombre}</td>
                <td data-testid="fila-precio">${producto.precio.toLocaleString('es-CL')}</td>
                <td data-testid={`precio-oferta-${producto.id}`}>
                  {producto.precioOferta
                    ? `$${producto.precioOferta.toLocaleString('es-CL')}`
                    : '-'
                  }
                </td>
                <td>
                  {/* CA1: Toggle destacado */}
                  <input
                    type="checkbox"
                    data-testid={`toggle-destacado-${producto.id}`}
                    checked={producto.destacado || false}
                    disabled={guardando === producto.id}
                    onChange={() => handleToggleDestacado(producto.id, producto.destacado)}
                  />
                </td>
                <td>
                  {/* CA2, CA3: Botón editar oferta */}
                  <button
                    data-testid={`btn-editar-oferta-${producto.id}`}
                    onClick={() => handleAbrirOferta(producto)}
                    disabled={guardando === producto.id}
                  >
                    Editar oferta
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* CA2, CA5: Modal precio oferta */}
      {modalAbierto && productoEditando && (
        <div data-testid="modal-oferta">
          <h2>Editar oferta — {productoEditando.nombre}</h2>
          <span data-testid="precio-base-modal">
            Precio base: ${productoEditando.precio.toLocaleString('es-CL')}
          </span>
          <input
            data-testid="input-precio-oferta"
            type="number"
            placeholder="Precio oferta"
            value={precioOferta}
            onChange={e => {
              setPrecioOferta(e.target.value)
              setErrorPrecio('')
            }}
          />
          {errorPrecio && (
            <span data-testid="error-precio-oferta">{errorPrecio}</span>
          )}
          <button data-testid="btn-guardar-oferta" onClick={handleGuardarOferta}>
            Guardar oferta
          </button>
          <button data-testid="btn-cancelar-modal" onClick={() => setModalAbierto(false)}>
            Cancelar
          </button>
        </div>
      )}
    </main>
  )
}

export default AdminPromociones