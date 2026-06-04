import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

function Producto() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [producto, setProducto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [cantidad, setCantidad] = useState(1)
  const [agregado, setAgregado] = useState(false)

  useEffect(() => {
    fetch(`/api/productos/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Error del servidor')
        return res.json()
      })
      .then(data => {
        setProducto(data)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [id])

  const handleAgregarCarrito = () => {
    setAgregado(true)
    setTimeout(() => setAgregado(false), 2000)
  }

  const handleIncrementar = () => {
    if (producto && cantidad < producto.stock) {
      setCantidad(c => c + 1)
    }
  }

  const handleDecrementar = () => {
    if (cantidad > 1) setCantidad(c => c - 1)
  }

  const precioFinal = producto
    ? producto.descuento > 0
      ? producto.precio * (1 - producto.descuento / 100)
      : producto.precio
    : 0

  return (
    <main>
      {/* CA8: Loading */}
      {loading && (
        <div data-testid="skeleton-loader">
          <div data-testid="skeleton-item" />
        </div>
      )}

      {/* CA9: Error */}
      {error && (
        <div data-testid="error-producto">
          <p>Error al cargar el producto</p>
          <button onClick={() => navigate(-1)}>Volver</button>
        </div>
      )}

      {!loading && !error && producto && (
        <div data-testid="detalle-producto">

          {/* CA1: Imagen del producto */}
          <img
            data-testid="producto-imagen"
            src={producto.imagen || '/placeholder.jpg'}
            alt={producto.nombre}
          />

          {/* CA2: Información del producto */}
          <h1 data-testid="producto-nombre">{producto.nombre}</h1>
          <span data-testid="producto-marca">{producto.marca}</span>
          <span data-testid="producto-categoria">{producto.categoria}</span>
          <p data-testid="producto-descripcion">{producto.descripcion}</p>

          {/* CA3: Precio con descuento */}
          {producto.descuento > 0 && (
            <span data-testid="precio-original" style={{ textDecoration: 'line-through' }}>
              ${producto.precio.toLocaleString('es-CL')}
            </span>
          )}
          <span data-testid="precio-final">
            ${precioFinal.toLocaleString('es-CL')}
          </span>
          {producto.descuento > 0 && (
            <span data-testid="badge-descuento">-{producto.descuento}%</span>
          )}

          {/* CA4: Stock disponible */}
          <span data-testid="stock-disponible">
            {producto.stock > 0 ? `${producto.stock} disponibles` : 'Sin stock'}
          </span>

          {/* CA5: Selector de cantidad */}
          <div data-testid="selector-cantidad">
            <button data-testid="btn-decrementar" onClick={handleDecrementar}>-</button>
            <span data-testid="cantidad-seleccionada">{cantidad}</span>
            <button data-testid="btn-incrementar" onClick={handleIncrementar}>+</button>
          </div>

          {/* CA6: Botón agregar al carrito */}
          <button
            data-testid="btn-agregar-carrito"
            onClick={handleAgregarCarrito}
            disabled={producto.stock === 0}
          >
            {agregado ? '¡Agregado!' : 'Agregar al carrito'}
          </button>

          {/* CA7: Botón volver al catálogo */}
          <button
            data-testid="btn-volver"
            onClick={() => navigate('/catalogo')}
          >
            Volver al catálogo
          </button>

          {/* CA10: Confirmación visual al agregar */}
          {agregado && (
            <div data-testid="confirmacion-agregado">
              Producto agregado al carrito
            </div>
          )}
        </div>
      )}
    </main>
  )
}

export default Producto