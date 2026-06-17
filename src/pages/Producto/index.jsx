import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCarrito } from '../../context/CarritoContext'
import styles from './Producto.module.css'

function Producto() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { agregarProducto } = useCarrito()
  const [producto, setProducto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [cantidad, setCantidad] = useState(1)
  const [agregado, setAgregado] = useState(false)
  const [tabActiva, setTabActiva] = useState('descripcion')

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
    agregarProducto(producto, cantidad)
    setAgregado(true)
    setTimeout(() => setAgregado(false), 2000)
  }

  const tieneOferta = producto?.precioOferta && producto.precioOferta < producto.precio
  const precioFinal = tieneOferta ? producto.precioOferta : producto?.precio
  const stockTexto = producto?.stock > 100 ? '+100 disponibles' : `${producto?.stock} disponibles`

  return (
    <main className={styles.main}>
      {loading && (
        <div data-testid="skeleton-loader" className={styles.skeletonWrapper}>
          <div className={styles.skeletonImagen} />
          <div className={styles.skeletonInfo}>
            {[1,2,3,4].map(i => <div key={i} data-testid="skeleton-item" className={styles.skeletonLinea} style={{ width: `${[80,60,40,90][i-1]}%` }} />)}
          </div>
        </div>
      )}

      {error && (
        <div data-testid="error-producto" className={styles.error}>
          <span>😕</span>
          <p>Error al cargar el producto</p>
          <button className={styles.btnVolver} onClick={() => navigate(-1)}>Volver</button>
        </div>
      )}

      {!loading && !error && producto && (
        <div data-testid="detalle-producto">

          {/* Breadcrumb */}
          <div className={styles.breadcrumb}>
            <button onClick={() => navigate('/')}>Inicio</button>
            <span>›</span>
            <button onClick={() => navigate('/catalogo')}>Catálogo</button>
            <span>›</span>
            <span>{producto.nombre}</span>
          </div>

          <div className={styles.detalle}>
            {/* Imagen */}
            <div className={styles.imagenWrapper}>
              {producto.imagen
                ? <img data-testid="producto-imagen" src={producto.imagen} alt={producto.nombre} className={styles.imagen} />
                : <div data-testid="producto-imagen" className={styles.imagenPlaceholder}>
                    <span className={styles.placeholderIcono}>🖥️</span>
                  </div>
              }
              {tieneOferta && (
                <span className={styles.badgeOferta}>
                  -{Math.round((1 - producto.precioOferta / producto.precio) * 100)}% OFF
                </span>
              )}
            </div>

            {/* Info */}
            <div className={styles.info}>
              <div className={styles.infoHeader}>
                <span data-testid="producto-categoria" className={styles.categoria}>{producto.categoria}</span>
                <span className={styles.productoId}>ID: #{producto.id}</span>
              </div>

              <h1 data-testid="producto-nombre" className={styles.nombre}>{producto.nombre}</h1>
              <span data-testid="producto-marca" className={styles.marca}>Marca: {producto.marca}</span>

              {/* Precios */}
              <div className={styles.precios}>
                {tieneOferta && (
                  <span data-testid="precio-original" className={styles.precioOriginal}>
                    ${producto.precio.toLocaleString('es-CL')}
                  </span>
                )}
                <span data-testid="precio-final" className={styles.precioFinal}>
                  ${precioFinal?.toLocaleString('es-CL')}
                </span>
                {tieneOferta && (
                  <span data-testid="badge-descuento" className={styles.badgeDescuento}>
                    -{Math.round((1 - producto.precioOferta / producto.precio) * 100)}% OFF
                  </span>
                )}
              </div>

              {/* Stock */}
              <div className={styles.stockWrapper}>
                <span
                  data-testid="stock-disponible"
                  className={`${styles.stock} ${producto.stock <= 5 ? styles.stockBajo : ''}`}
                >
                  {producto.stock === 0 ? '❌ Sin stock' : `✅ ${stockTexto}`}
                </span>
              </div>

              {/* Garantía */}
              {producto.garantia && (
                <div className={styles.garantia}>
                  🛡️ Garantía: <strong>{producto.garantia}</strong>
                </div>
              )}

              {/* Selector cantidad */}
              <div className={styles.cantidadWrapper}>
                <span className={styles.cantidadLabel}>Cantidad</span>
                <div data-testid="selector-cantidad" className={styles.selectorCantidad}>
                  <button
                    data-testid="btn-decrementar"
                    className={styles.btnCantidad}
                    onClick={() => cantidad > 1 && setCantidad(c => c - 1)}
                  >-</button>
                  <span data-testid="cantidad-seleccionada" className={styles.cantidad}>{cantidad}</span>
                  <button
                    data-testid="btn-incrementar"
                    className={styles.btnCantidad}
                    onClick={() => cantidad < producto.stock && setCantidad(c => c + 1)}
                  >+</button>
                </div>
              </div>

              {/* Acciones */}
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
                  {agregado ? '¡Agregado! ✓' : '🛒 Agregar al carrito'}
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

          {/* Tabs de información */}
          <div className={styles.tabsWrapper}>
            <div className={styles.tabs}>
              {[
                { id: 'descripcion', label: 'Descripción' },
                { id: 'especificaciones', label: 'Especificaciones' },
                { id: 'sobre', label: 'Sobre este producto' },
              ].map(tab => (
                <button
                  key={tab.id}
                  className={`${styles.tab} ${tabActiva === tab.id ? styles.tabActivo : ''}`}
                  onClick={() => setTabActiva(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className={styles.tabContenido}>
              {tabActiva === 'descripcion' && (
                <p data-testid="producto-descripcion" className={styles.tabTexto}>
                  {producto.descripcion || 'Sin descripción disponible.'}
                </p>
              )}
              {tabActiva === 'especificaciones' && (
                <p className={styles.tabTexto}>
                  {producto.especificaciones || 'Sin especificaciones disponibles.'}
                </p>
              )}
              {tabActiva === 'sobre' && (
                <p className={styles.tabTexto}>
                  {producto.sobre || 'Sin información adicional.'}
                </p>
              )}
            </div>
          </div>

        </div>
      )}
    </main>
  )
}

export default Producto