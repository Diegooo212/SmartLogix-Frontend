import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const productosIniciales = [
  { id: 1, nombre: 'Laptop Gamer', precio: 899990, cantidad: 1, stock: 10 },
  { id: 2, nombre: 'Mouse Inalámbrico', precio: 24990, cantidad: 2, stock: 25 },
]

function Carrito() {
  const navigate = useNavigate()
  const [items, setItems] = useState(productosIniciales)
  const [eliminado, setEliminado] = useState(false)
  const [vaciado, setVaciado] = useState(false)

  const handleIncrementar = (id) => {
    setItems(items.map(item =>
      item.id === id && item.cantidad < item.stock
        ? { ...item, cantidad: item.cantidad + 1 }
        : item
    ))
  }

  const handleDecrementar = (id) => {
    setItems(items.map(item =>
      item.id === id && item.cantidad > 1
        ? { ...item, cantidad: item.cantidad - 1 }
        : item
    ))
  }

  const handleEliminar = (id) => {
    setItems(items.filter(item => item.id !== id))
    setEliminado(true)
    setTimeout(() => setEliminado(false), 2000)
  }

  const handleVaciar = () => {
    setItems([])
    setVaciado(true)
  }

  const total = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0)

  return (
    <main>
      <h1>Mi carrito</h1>

      {/* CA7: Confirmación al eliminar */}
      {eliminado && (
        <div data-testid="confirmacion-eliminado">
          Producto eliminado del carrito
        </div>
      )}

      {/* CA5: Carrito vacío */}
      {items.length === 0 ? (
        <div data-testid="carrito-vacio">
          <p>Tu carrito está vacío</p>
          <button
            data-testid="btn-ir-catalogo"
            onClick={() => navigate('/catalogo')}
          >
            Ir al catálogo
          </button>
        </div>
      ) : (
        <>
          {/* CA1, CA2, CA3: Lista de productos */}
          <div data-testid="lista-carrito">
            {items.map(item => (
              <div key={item.id} data-testid="carrito-item">
                <span data-testid="item-nombre">{item.nombre}</span>
                <span data-testid="item-precio">
                  ${item.precio.toLocaleString('es-CL')}
                </span>

                {/* CA2: Selector de cantidad */}
                <div data-testid="selector-cantidad">
                  <button
                    data-testid={`btn-decrementar-${item.id}`}
                    onClick={() => handleDecrementar(item.id)}
                  >
                    -
                  </button>
                  <span data-testid={`cantidad-${item.id}`}>{item.cantidad}</span>
                  <button
                    data-testid={`btn-incrementar-${item.id}`}
                    onClick={() => handleIncrementar(item.id)}
                  >
                    +
                  </button>
                </div>

                {/* CA3: Subtotal por producto */}
                <span data-testid="item-subtotal">
                  ${(item.precio * item.cantidad).toLocaleString('es-CL')}
                </span>

                {/* CA4: Botón eliminar */}
                <button
                  data-testid={`btn-eliminar-${item.id}`}
                  onClick={() => handleEliminar(item.id)}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>

          {/* CA6: Total del carrito */}
          <div data-testid="resumen-carrito">
            <span data-testid="total-carrito">
              ${total.toLocaleString('es-CL')}
            </span>
          </div>

          {/* CA8: Botón vaciar carrito */}
          <button data-testid="btn-vaciar" onClick={handleVaciar}>
            Vaciar carrito
          </button>

          {/* CA9: Botón ir a checkout */}
          <button
            data-testid="btn-checkout"
            onClick={() => navigate('/checkout')}
          >
            Proceder al pago
          </button>

          {/* CA10: Botón seguir comprando */}
          <button
            data-testid="btn-seguir-comprando"
            onClick={() => navigate('/catalogo')}
          >
            Seguir comprando
          </button>
        </>
      )}
    </main>
  )
}

export default Carrito