import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Carrito.module.css'

const productosIniciales = [
  { id: 1, nombre: 'Laptop Gamer', precio: 899990, cantidad: 1, stock: 10 },
  { id: 2, nombre: 'Mouse Inalámbrico', precio: 24990, cantidad: 2, stock: 25 },
]

function Carrito() {
  const navigate = useNavigate()
  const [items, setItems] = useState(productosIniciales)
  const [eliminado, setEliminado] = useState(false)

  const handleIncrementar = id => setItems(items.map(item =>
    item.id === id && item.cantidad < item.stock ? { ...item, cantidad: item.cantidad + 1 } : item
  ))

  const handleDecrementar = id => setItems(items.map(item =>
    item.id === id && item.cantidad > 1 ? { ...item, cantidad: item.cantidad - 1 } : item
  ))

  const handleEliminar = id => {
    setItems(items.filter(item => item.id !== id))
    setEliminado(true)
    setTimeout(() => setEliminado(false), 2000)
  }

  const handleVaciar = () => setItems([])
  const total = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0)

  return (
    <main className={styles.main}>
      <h1 className={styles.titulo}>Mi carrito</h1>

      {eliminado && <div data-testid="confirmacion-eliminado" className={styles.confirmacion}>✓ Producto eliminado del carrito</div>}

      {items.length === 0 ? (
        <div data-testid="carrito-vacio" className={styles.vacio}>
          <span className={styles.vacioIcono}>🛒</span>
          <p className={styles.vacioTexto}>Tu carrito está vacío</p>
          <button data-testid="btn-ir-catalogo" className={styles.btnIrCatalogo} onClick={() => navigate('/catalogo')}>
            Ir al catálogo
          </button>
        </div>
      ) : (
        <div className={styles.layout}>
          <div data-testid="lista-carrito" className={styles.items}>
            {items.map(item => (
              <div key={item.id} data-testid="carrito-item" className={styles.item}>
                <div className={styles.itemImagen} />
                <div className={styles.itemInfo}>
                  <span data-testid="item-nombre" className={styles.itemNombre}>{item.nombre}</span>
                  <span data-testid="item-precio" className={styles.itemPrecio}>${item.precio.toLocaleString('es-CL')}</span>
                </div>
                <div className={styles.itemAcciones}>
                  <div data-testid="selector-cantidad" className={styles.selectorCantidad}>
                    <button data-testid={`btn-decrementar-${item.id}`} className={styles.btnCantidad} onClick={() => handleDecrementar(item.id)}>-</button>
                    <span data-testid={`cantidad-${item.id}`} className={styles.cantidad}>{item.cantidad}</span>
                    <button data-testid={`btn-incrementar-${item.id}`} className={styles.btnCantidad} onClick={() => handleIncrementar(item.id)}>+</button>
                  </div>
                  <span data-testid="item-subtotal" className={styles.subtotal}>${(item.precio * item.cantidad).toLocaleString('es-CL')}</span>
                  <button data-testid={`btn-eliminar-${item.id}`} className={styles.btnEliminar} onClick={() => handleEliminar(item.id)}>Eliminar</button>
                </div>
              </div>
            ))}
          </div>

          <div data-testid="resumen-carrito" className={styles.resumen}>
            <h2 className={styles.resumenTitulo}>Resumen</h2>
            <div className={styles.resumenFila}>
              <span className={styles.resumenLabel}>Total</span>
              <span data-testid="total-carrito" className={styles.resumenTotal}>${total.toLocaleString('es-CL')}</span>
            </div>
            <button data-testid="btn-checkout" className={styles.btnCheckout} onClick={() => navigate('/checkout')}>
              Proceder al pago
            </button>
            <button data-testid="btn-seguir-comprando" className={styles.btnSeguir} onClick={() => navigate('/catalogo')}>
              Seguir comprando
            </button>
            <button data-testid="btn-vaciar" className={styles.btnVaciar} onClick={handleVaciar}>
              Vaciar carrito
            </button>
          </div>
        </div>
      )}
    </main>
  )
}

export default Carrito