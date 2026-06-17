import { useNavigate } from 'react-router-dom'
import { useCarrito } from '../../context/CarritoContext'
import styles from './ProductoCard.module.css'

function ProductoCard({ producto }) {
  const navigate = useNavigate()
  const { agregarProducto } = useCarrito()

  const stockTexto = producto.stock > 100 ? '+100 Unid.' : `${producto.stock} Unid.`
  const tieneOferta = producto.precioOferta && producto.precioOferta < producto.precio

  return (
    <div
      data-testid="producto-card"
      className={styles.card}
      onClick={() => navigate(`/producto/${producto.id}`)}
    >
      {/* Imagen */}
      <div className={styles.imagenWrapper}>
        {producto.imagen
          ? <img src={producto.imagen} alt={producto.nombre} className={styles.imagen} />
          : <div className={styles.imagenPlaceholder}>
              <span className={styles.placeholderIcono}>🖥️</span>
            </div>
        }

        {/* Badge oferta — arriba izquierda */}
        {tieneOferta && (
          <span className={styles.badgeOferta}>
            -{Math.round((1 - producto.precioOferta / producto.precio) * 100)}%
          </span>
        )}

        {/* Badge stock — arriba derecha */}
        <span className={`${styles.badgeStock} ${producto.stock <= 5 ? styles.badgeStockBajo : ''}`}>
          {stockTexto}
        </span>
      </div>

      <div className={styles.cardInfo}>
        <span data-testid="producto-categoria" className={styles.cardCategoria}>{producto.categoria}</span>
        <span data-testid="producto-nombre" className={styles.cardNombre}>{producto.nombre}</span>
        <span data-testid="producto-marca" className={styles.cardMarca}>{producto.marca}</span>

        <div className={styles.precios}>
          {tieneOferta && (
            <span className={styles.precioOriginal}>${producto.precio.toLocaleString('es-CL')}</span>
          )}
          <span data-testid="producto-precio" className={styles.cardPrecio}>
            ${(tieneOferta ? producto.precioOferta : producto.precio).toLocaleString('es-CL')}
          </span>
        </div>

        <button
          data-testid="btn-carrito"
          className={styles.btnCarrito}
          onClick={e => { e.stopPropagation(); agregarProducto(producto, 1) }}
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  )
}

export default ProductoCard