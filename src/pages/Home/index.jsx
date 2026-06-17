import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductoCard from '../../components/common/ProductoCard'
import styles from './Home.module.css'

function Home() {
  const [destacados, setDestacados] = useState([])
  const [productosGenerales, setProductosGenerales] = useState([]) // NUEVO ESTADO
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
        const soloDestacados = data.filter(p => p.destacado).slice(0, 10)
        setDestacados(soloDestacados)
        // Guardamos los primeros 8 productos para la grilla de abajo
        setProductosGenerales(data.slice(0, 8)) 
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
        setDestacados(data.filter(p => p.destacado).slice(0, 10))
        setProductosGenerales(data.slice(0, 8))
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
          <span data-testid="contador-productos" className={styles.contadorNumero}>+{contadorProductos}</span>
          <span className={styles.contadorLabel}>Productos</span>
        </div>
        <div className={styles.contadorDivider} />
        <div className={styles.contador}>
          <span data-testid="contador-clientes" className={styles.contadorNumero}>+{contadorClientes}</span>
          <span className={styles.contadorLabel}>Clientes</span>
        </div>
      </section>

      {/* Sección 1: Productos Destacados (Carrusel) */}
      <section className={styles.seccion}>
        <h2 className={styles.seccionTitulo}>
          Productos <span className={styles.accent}>Destacados</span>
        </h2>

        {/* Loader Skeleton */}
        {loading && (
          <div data-testid="skeleton-loader" className={styles.gridProductos}>
            {[1, 2, 3].map(i => (
              <div key={i} data-testid="skeleton-item" className={styles.skeletonCard} />
            ))}
          </div>
        )}

        {/* Mensaje de Error */}
        {error && (
          <div data-testid="error-productos" className={styles.error}>
            <p>Error al cargar las ofertas</p>
            <button className={styles.btnReintentar} onClick={handleReintentar}>
              Reintentar
            </button>
          </div>
        )}

        {/* Carrusel 3D */}
        {!loading && !error && (
          <div data-testid="carrusel-destacados" className={styles.carruselContenedor}>
            <button data-testid="btn-anterior" className={`${styles.carruselBtn} ${styles.btnLeft}`} onClick={handleAnterior}>
              ❮
            </button>

            <div className={styles.carruselPista}>
              {destacados.map((producto, index) => {
                let posicion = styles.oculto;
                
                if (index === carruselIndex) {
                  posicion = styles.centro;
                } else if (index === (carruselIndex - 1 + destacados.length) % destacados.length) {
                  posicion = styles.izquierda;
                } else if (index === (carruselIndex + 1) % destacados.length) {
                  posicion = styles.derecha;
                }

                return (
                  <div 
                    key={`destacado-${producto.id}`} 
                    className={`${styles.carruselItem} ${posicion}`}
                    onClick={() => {
                      if (posicion === styles.izquierda) handleAnterior();
                      if (posicion === styles.derecha) handleSiguiente();
                    }}
                  >
                    <ProductoCard producto={producto} />
                  </div>
                );
              })}
            </div>

            <button data-testid="btn-siguiente" className={`${styles.carruselBtn} ${styles.btnRight}`} onClick={handleSiguiente}>
              ❯
            </button>
          </div>
        )}
      </section>

      {/* NUEVA SECCIÓN: Catálogo General (Grilla) */}
      <section className={styles.seccion}>
        <h2 className={styles.seccionTitulo}>
          Nuevos <span className={styles.accent}>Ingresos</span>
        </h2>

        {loading && (
          <div className={styles.gridProductos}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={`skeleton-grid-${i}`} className={styles.skeletonCard} />
            ))}
          </div>
        )}

        {!loading && !error && (
          <div className={styles.gridProductos}>
            {productosGenerales.map(producto => (
              <ProductoCard key={`grilla-${producto.id}`} producto={producto} />
            ))}
          </div>
        )}
      </section>

    </main>
  )
}

export default Home