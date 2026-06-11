import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Catalogo.module.css'

function Catalogo() {
  const [productos, setProductos] = useState([])
  const [productosFiltrados, setProductosFiltrados] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas')
  const [marcaSeleccionada, setMarcaSeleccionada] = useState('Todas')
  const [ordenPrecio, setOrdenPrecio] = useState('ninguno')
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/productos')
      .then(res => {
        if (!res.ok) throw new Error('Error del servidor')
        return res.json()
      })
      .then(data => {
        setProductos(data)
        setProductosFiltrados(data)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    let resultado = [...productos]
    if (busqueda.trim() !== '') {
      resultado = resultado.filter(p =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.marca.toLowerCase().includes(busqueda.toLowerCase())
      )
    }
    if (categoriaSeleccionada !== 'Todas') {
      resultado = resultado.filter(p => p.categoria === categoriaSeleccionada)
    }
    if (marcaSeleccionada !== 'Todas') {
      resultado = resultado.filter(p => p.marca === marcaSeleccionada)
    }
    if (ordenPrecio === 'asc') resultado.sort((a, b) => a.precio - b.precio)
    else if (ordenPrecio === 'desc') resultado.sort((a, b) => b.precio - a.precio)
    setProductosFiltrados(resultado)
  }, [busqueda, categoriaSeleccionada, marcaSeleccionada, ordenPrecio, productos])

  const categorias = ['Todas', ...new Set(productos.map(p => p.categoria))]
  const marcas = ['Todas', ...new Set(productos.map(p => p.marca))]

  const handleLimpiarFiltros = () => {
    setBusqueda('')
    setCategoriaSeleccionada('Todas')
    setMarcaSeleccionada('Todas')
    setOrdenPrecio('ninguno')
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.titulo}>
        Catálogo de <span className={styles.accent}>Productos</span>
      </h1>

      <div className={styles.filtros}>
        <input
          data-testid="barra-busqueda"
          className={styles.barraBusqueda}
          type="text"
          placeholder="Buscar productos..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
        <select
          data-testid="filtro-categoria"
          className={styles.select}
          value={categoriaSeleccionada}
          onChange={e => setCategoriaSeleccionada(e.target.value)}
        >
          {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <select
          data-testid="filtro-marca"
          className={styles.select}
          value={marcaSeleccionada}
          onChange={e => setMarcaSeleccionada(e.target.value)}
        >
          {marcas.map(marca => <option key={marca} value={marca}>{marca}</option>)}
        </select>
        <select
          data-testid="orden-precio"
          className={styles.select}
          value={ordenPrecio}
          onChange={e => setOrdenPrecio(e.target.value)}
        >
          <option value="ninguno">Sin orden</option>
          <option value="asc">Menor precio</option>
          <option value="desc">Mayor precio</option>
        </select>
        <button data-testid="btn-limpiar" className={styles.btnLimpiar} onClick={handleLimpiarFiltros}>
          Limpiar filtros
        </button>
      </div>

      {loading && (
        <div data-testid="skeleton-loader" className={styles.skeletonGrid}>
          {[1,2,3,4,5].map(i => <div key={i} data-testid="skeleton-item" className={styles.skeletonCard} />)}
        </div>
      )}

      {error && (
        <div data-testid="error-catalogo" className={styles.error}>
          <p>Error al cargar el catálogo</p>
          <button className={styles.btnReintentar} onClick={() => window.location.reload()}>Reintentar</button>
        </div>
      )}

      {!loading && !error && (
        <>
          <span data-testid="contador-resultados" className={styles.contadorResultados}>
            {productosFiltrados.length} productos encontrados
          </span>
          {productosFiltrados.length === 0 ? (
            <div data-testid="sin-resultados" className={styles.sinResultados}>
              <p>No se encontraron productos</p>
            </div>
          ) : (
            <div data-testid="lista-productos" className={styles.grid}>
              {productosFiltrados.map(producto => (
                <div
                  key={producto.id}
                  data-testid="producto-card"
                  className={styles.card}
                  onClick={() => navigate(`/producto/${producto.id}`)}
                >
                  <div className={styles.cardImagen} />
                  <div className={styles.cardInfo}>
                    <span data-testid="producto-categoria" className={styles.cardCategoria}>{producto.categoria}</span>
                    <span data-testid="producto-nombre" className={styles.cardNombre}>{producto.nombre}</span>
                    <span data-testid="producto-marca" className={styles.cardMarca}>{producto.marca}</span>
                    <span data-testid="producto-precio" className={styles.cardPrecio}>${producto.precio.toLocaleString('es-CL')}</span>
                    <button data-testid="btn-carrito" className={styles.btnCarrito} onClick={e => e.stopPropagation()}>
                      Agregar al carrito
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  )
}

export default Catalogo