import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
  const [productos, setProductos] = useState([])
  const [destacados, setDestacados] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [carruselIndex, setCarruselIndex] = useState(0)
  const [contadorProductos, setContadorProductos] = useState(0)
  const [contadorClientes, setContadorClientes] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/productos')
      .then(res => {
        if (!res.ok) throw new Error('Error del servidor')
        return res.json()
      })
      .then(data => {
        setProductos(data)
        const soloDestacados = data.filter(p => p.destacado).slice(0, 10)
        setDestacados(soloDestacados)
        setLoading(false)
        animarContadores()
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [])

  const animarContadores = () => {
    let p = 0
    let c = 0
    const intervalo = setInterval(() => {
      p += 100
      c += 50
      setContadorProductos(p)
      setContadorClientes(c)
      if (p >= 1000 && c >= 500) clearInterval(intervalo)
    }, 50)
  }

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
        const soloDestacados = data.filter(p => p.destacado).slice(0, 10)
        setDestacados(soloDestacados)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }

  const handleAnterior = () => {
    setCarruselIndex(i => (i > 0 ? i - 1 : destacados.length - 1))
  }

  const handleSiguiente = () => {
    setCarruselIndex(i => (i < destacados.length - 1 ? i + 1 : 0))
  }

  return (
    <main>
      {/* CA1: Hero */}
      <section data-testid="hero">
        <h1>Bienvenido a SmartLogix</h1>
        <button onClick={() => navigate('/catalogo')}>Ver ofertas</button>
        <button onClick={() => navigate('/catalogo')}>Ver catálogo</button>
      </section>

      {/* CA5: Contadores animados */}
      <section data-testid="hero-contadores">
        <span data-testid="contador-productos">+{contadorProductos} Productos</span>
        <span data-testid="contador-clientes">+{contadorClientes} Clientes</span>
      </section>

      {/* CA7: Skeleton loaders */}
      {loading && (
        <div data-testid="skeleton-loader">
          {[1,2,3,4,5].map(i => (
            <div key={i} data-testid="skeleton-item" />
          ))}
        </div>
      )}

      {/* CA8: Error */}
      {error && (
        <div data-testid="error-productos">
          <p>Error al cargar las ofertas</p>
          <button onClick={handleReintentar}>Reintentar</button>
        </div>
      )}

      {/* CA2: Carrusel de productos destacados */}
      {!loading && !error && (
        <section data-testid="carrusel-destacados">
          <button data-testid="btn-anterior" onClick={handleAnterior}>←</button>

          <div data-testid="lista-productos">
            {destacados.map(producto => (
              <div
                key={producto.id}
                data-testid="producto-card"
                onClick={() => navigate(`/producto/${producto.id}`)}
                style={{ cursor: 'pointer' }}
              >
                {/* CA3: Nombre, precio, categoría y botón carrito */}
                <span data-testid="producto-nombre">{producto.nombre}</span>
                <span data-testid="producto-precio">${producto.precio.toLocaleString('es-CL')}</span>
                <span data-testid="producto-categoria">{producto.categoria}</span>
                <button
                  data-testid="btn-carrito"
                  onClick={e => e.stopPropagation()}
                >
                  Agregar al carrito
                </button>
              </div>
            ))}
          </div>

          <button data-testid="btn-siguiente" onClick={handleSiguiente}>→</button>
        </section>
      )}
    </main>
  )
}

export default Home