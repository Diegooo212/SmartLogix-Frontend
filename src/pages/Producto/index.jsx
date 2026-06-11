import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styles from './Producto.module.css'

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

  const precioFinal = producto
    ? producto.descuento > 0
      ? producto.precio * (1 - producto.descuento / 100)
      : producto.precio
    : 0

  return (
    <main className={styles.main}>
      {loading && (
        <div data-testid="skeleton-loader" className={styles.skeletonWrapper}>
          <div className={styles.skeletonImagen} />
          <div className={styles.skeletonInfo}>
            {[1,2,3,4].map(i => <div key={i} data-testid="skeleton-item" className={styles.skeletonLinea} />)}
          </div>
        </div>
      )}

      {error && (
        <div data-testid="error-producto" className={styles.error}>
          <p>Error al cargar el producto</p>
          <button onClick={() => navigate(-1)}>Volver</button>
        </div>
      )}

      {!loading && !error && producto && (
        <div data-testid="detalle-producto" className={styles.detalle}>
          <div className={styles.imagenWrapper}>
            <img
              data-testid="producto-imagen"
              className={styles.imagen}
              src={producto.imagen || '/placeholder.jpg'}
              alt={producto.nombre}
            />
          </div>

          <div className={styles.info}>
            <span data-testid="producto-categoria" className={styles.categoria}>{producto.categoria}</span>
            <h1 data-testid="producto-nombre" className={styles.nombre}>{producto.nombre}</h1>
            <span data-testid="producto-marca" className={styles.marca}>{producto.marca}</span>
            <p data-testid="producto-descripcion" className={styles.descripcion}>{producto.descripcion}</p>

            <div className={styles.precios}>
              {producto.descuento > 0 && (
                <span data-testid="precio-original" className={styles.precioOriginal}>
                  ${producto.precio.toLocaleString('es-CL')}
                </span>
              )}
              <span data-testid="precio-final" className={styles.precioFinal}>
                ${precioFinal.toLocaleString('es-CL')}
              </span>
              {producto.descuento > 0 && (
                <span data-testid="badge-descuento" className={styles.badgeDescuento}>
                  -{producto.descuento}%
                </span>
              )}
            </div>

            <span data-testid="stock-disponible" className={styles.stock}>
              {producto.stock > 0 ? `${producto.stock} disponibles` : 'Sin stock'}
            </span>

            <div data-testid="selector-cantidad" className={styles.selectorCantidad}>
              <button data-testid="btn-decrementar" className={styles.btnCantidad}
                onClick={() => cantidad > 1 && setCantidad(c => c - 1)}>-</button>
              <span data-testid="cantidad-seleccionada" className={styles.cantidad}>{cantidad}</span>
              <button data-testid="btn-incrementar" className={styles.btnCantidad}
                onClick={() => cantidad < producto.stock && setCantidad(c => c + 1)}>+</button>
            </div>

            <div className={styles.acciones}>
              {agregado && (
                <div data-testid="confirmacion-agregado" className={styles.confirmacion}>
                  ✓ Producto agregado al carrito
                </div>
              )}
              <button
                data-testid="btn-agregar-carrito"
                className={styles.btnAgregar}
                onClick={handleAgregarCarrito}
                disabled={producto.stock === 0}
              >
                {agregado ? '¡Agregado!' : 'Agregar al carrito'}
              </button>
              <button
                data-testid="btn-volver"
                className={styles.btnVolver}
                onClick={() => navigate('/catalogo')}
              >
                ← Volver al catálogo
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default Producto