import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

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

    if (ordenPrecio === 'asc') {
      resultado.sort((a, b) => a.precio - b.precio)
    } else if (ordenPrecio === 'desc') {
      resultado.sort((a, b) => b.precio - a.precio)
    }

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
    <main>
      <h1>Catálogo de productos</h1>

      {/* CA1: Barra de búsqueda */}
      <input
        data-testid="barra-busqueda"
        type="text"
        placeholder="Buscar productos..."
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
      />

      {/* CA2: Filtro por categoría */}
      <select
        data-testid="filtro-categoria"
        value={categoriaSeleccionada}
        onChange={e => setCategoriaSeleccionada(e.target.value)}
      >
        {categorias.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      {/* CA3: Filtro por marca */}
      <select
        data-testid="filtro-marca"
        value={marcaSeleccionada}
        onChange={e => setMarcaSeleccionada(e.target.value)}
      >
        {marcas.map(marca => (
          <option key={marca} value={marca}>{marca}</option>
        ))}
      </select>

      {/* CA4: Ordenar por precio */}
      <select
        data-testid="orden-precio"
        value={ordenPrecio}
        onChange={e => setOrdenPrecio(e.target.value)}
      >
        <option value="ninguno">Sin orden</option>
        <option value="asc">Menor precio</option>
        <option value="desc">Mayor precio</option>
      </select>

      {/* CA9: Botón limpiar filtros */}
      <button data-testid="btn-limpiar" onClick={handleLimpiarFiltros}>
        Limpiar filtros
      </button>

      {/* CA8: Loading */}
      {loading && (
        <div data-testid="skeleton-loader">
          {[1,2,3,4,5].map(i => (
            <div key={i} data-testid="skeleton-item" />
          ))}
        </div>
      )}

      {/* CA10: Error */}
      {error && (
        <div data-testid="error-catalogo">
          <p>Error al cargar el catálogo</p>
          <button onClick={() => window.location.reload()}>Reintentar</button>
        </div>
      )}

      {/* CA5, CA6, CA7: Lista de productos */}
      {!loading && !error && (
        <>
          <span data-testid="contador-resultados">
            {productosFiltrados.length} productos encontrados
          </span>

          {productosFiltrados.length === 0 ? (
            <div data-testid="sin-resultados">
              <p>No se encontraron productos</p>
            </div>
          ) : (
            <div data-testid="lista-productos">
              {productosFiltrados.map(producto => (
                <div
                  key={producto.id}
                  data-testid="producto-card"
                  onClick={() => navigate(`/producto/${producto.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <span data-testid="producto-nombre">{producto.nombre}</span>
                  <span data-testid="producto-precio">${producto.precio.toLocaleString('es-CL')}</span>
                  <span data-testid="producto-categoria">{producto.categoria}</span>
                  <span data-testid="producto-marca">{producto.marca}</span>
                  <button
                    data-testid="btn-carrito"
                    onClick={e => e.stopPropagation()}
                  >
                    Agregar al carrito
                  </button>
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