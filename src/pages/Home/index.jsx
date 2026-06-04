import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/productos')
      .then(res => {
        if (!res.ok) throw new Error('Error del servidor')
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

  const handleReintentar = () => {
    setError(false)
    setLoading(true)
    fetch('/api/productos')
      .then(res => {
        if (!res.ok) throw new Error('Error del servidor')
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
  }

  return (
    <main>
      {/* CA1: Hero con título y botones */}
      <section data-testid="hero">
        <h1>Bienvenido a SmartLogix</h1>
        <button onClick={() => navigate('/catalogo')}>Ver ofertas</button>
        <button onClick={() => navigate('/catalogo')}>Ver catálogo</button>
      </section>

      {/* CA5: Contadores del hero */}
      <section data-testid="hero-contadores">
        <span data-testid="contador-productos">+1000 Productos</span>
        <span data-testid="contador-clientes">+500 Clientes</span>
      </section>

      {/* Sección más vendidos */}
      <section data-testid="mas-vendidos">
        <h2>Más vendidos</h2>

        {/* CA7: Skeleton loaders mientras carga */}
        {loading && (
          <div data-testid="skeleton-loader">
            {[1,2,3,4,5].map(i => (
              <div key={i} data-testid="skeleton-item" />
            ))}
          </div>
        )}

        {/* CA8: Error con botón reintentar */}
        {error && (
          <div data-testid="error-productos">
            <p>Error al cargar las ofertas</p>
            <button onClick={handleReintentar}>Reintentar</button>
          </div>
        )}

        {/* CA2, CA3, CA6: Lista de productos */}
        {!loading && !error && (
          <div data-testid="lista-productos">
            {productos.map(producto => (
              <div
                key={producto.id}
                data-testid="producto-card"
                onClick={() => navigate(`/producto/${producto.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <span data-testid="producto-nombre">{producto.nombre}</span>
                <span data-testid="producto-precio">${producto.precio.toLocaleString('es-CL')}</span>
                <span data-testid="producto-categoria">{producto.categoria}</span>
                <button data-testid="btn-carrito">Agregar al carrito</button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default Home