import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Home.module.css'

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
    let p = 0, c = 0
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
        setDestacados(data.filter(p => p.destacado).slice(0, 10))
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }

  const handleAnterior = () => setCarruselIndex(i => (i > 0 ? i - 1 : destacados.length - 1))
  const handleSiguiente = () => setCarruselIndex(i => (i < destacados.length - 1 ? i + 1 : 0))

  return (
    <main className={styles.main}>

      {/* Hero */}
      <section data-testid="hero" className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.heroBadge}>⚡ Tecnología de última generación</span>
          <h1 className={styles.heroTitle}>
            Bienvenido a <span className={styles.heroAccent}>SmartLogix</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Los mejores productos tecnológicos con precios imbatibles y envío a todo Chile.
          </p>
          <div className={styles.heroBtns}>
            <button className={styles.btnPrimario} onClick={() => navigate('/catalogo')}>
              Ver ofertas
            </button>
            <button className={styles.btnSecundario} onClick={() => navigate('/catalogo')}>
              Ver catálogo
            </button>
          </div>
        </div>
        <div className={styles.heroGlow} />
      </section>

      {/* Contadores */}
      <section data-testid="hero-contadores" className={styles.contadores}>
        <div className={styles.contador}>
          <span data-testid="contador-productos" className={styles.contadorNumero}>
            +{contadorProductos}
          </span>
          <span className={styles.contadorLabel}>Productos</span>
        </div>
        <div className={styles.contadorDivider} />
        <div className={styles.contador}>
          <span data-testid="contador-clientes" className={styles.contadorNumero}>
            +{contadorClientes}
          </span>
          <span className={styles.contadorLabel}>Clientes</span>
        </div>
      </section>

      {/* Carrusel */}
      <section className={styles.seccion}>
        <h2 className={styles.seccionTitulo}>Productos <span className={styles.accent}>Destacados</span></h2>

        {loading && (
          <div data-testid="skeleton-loader" className={styles.skeletonGrid}>
            {[1,2,3,4,5].map(i => (
              <div key={i} data-testid="skeleton-item" className={styles.skeletonCard} />
            ))}
          </div>
        )}

        {error && (
          <div data-testid="error-productos" className={styles.error}>
            <p>Error al cargar las ofertas</p>
            <button className={styles.btnReintentar} onClick={handleReintentar}>
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && (
          <div data-testid="carrusel-destacados" className={styles.carrusel}>
            <button data-testid="btn-anterior" className={styles.carruselBtn} onClick={handleAnterior}>
              ←
            </button>
            <div data-testid="lista-productos" className={styles.carruselGrid}>
              {destacados.map(producto => (
                <div
                  key={producto.id}
                  data-testid="producto-card"
                  className={styles.card}
                  onClick={() => navigate(`/producto/${producto.id}`)}
                >
                  <div className={styles.cardImagen} />
                  <div className={styles.cardInfo}>
                    <span data-testid="producto-categoria" className={styles.cardCategoria}>
                      {producto.categoria}
                    </span>
                    <span data-testid="producto-nombre" className={styles.cardNombre}>
                      {producto.nombre}
                    </span>
                    <span data-testid="producto-precio" className={styles.cardPrecio}>
                      ${producto.precio.toLocaleString('es-CL')}
                    </span>
                    <button
                      data-testid="btn-carrito"
                      className={styles.btnCarrito}
                      onClick={e => e.stopPropagation()}
                    >
                      Agregar al carrito
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button data-testid="btn-siguiente" className={styles.carruselBtn} onClick={handleSiguiente}>
              →
            </button>
          </div>
        )}
      </section>
    </main>
  )
}

export default Home