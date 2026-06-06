import { useState, useEffect } from 'react'

const productoInicial = {
  id: null, nombre: '', precio: '', categoria: '', marca: '', stock: '', descripcion: ''
}

function AdminProductos() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [form, setForm] = useState(productoInicial)
  const [errores, setErrores] = useState({})
  const [guardando, setGuardando] = useState(false)
  const [exitoso, setExitoso] = useState(false)
  const [eliminando, setEliminando] = useState(null)
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    fetch('/api/productos')
      .then(res => {
        if (!res.ok) throw new Error('Error')
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

  const validar = () => {
    const nuevosErrores = {}
    if (!form.nombre.trim()) nuevosErrores.nombre = 'El nombre es requerido'
    if (!form.precio || isNaN(form.precio)) nuevosErrores.precio = 'El precio es inválido'
    if (!form.categoria.trim()) nuevosErrores.categoria = 'La categoría es requerida'
    return nuevosErrores
  }

  const handleGuardar = async () => {
    const nuevosErrores = validar()
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores)
      return
    }
    setGuardando(true)
    try {
      const url = form.id ? `/api/productos/${form.id}` : '/api/productos'
      const method = form.id ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Error')
      const data = await res.json()
      if (form.id) {
        setProductos(productos.map(p => p.id === form.id ? data : p))
      } else {
        setProductos([...productos, data])
      }
      setModalAbierto(false)
      setForm(productoInicial)
      setExitoso(true)
      setTimeout(() => setExitoso(false), 2000)
    } catch {
      setErrores({ servidor: 'Error al guardar el producto' })
    } finally {
      setGuardando(false)
    }
  }

  const handleEliminar = async (id) => {
    setEliminando(id)
    try {
      const res = await fetch(`/api/productos/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Error')
      setProductos(productos.filter(p => p.id !== id))
    } catch {
      setError(true)
    } finally {
      setEliminando(null)
    }
  }

  const handleEditar = (producto) => {
    setForm({ ...producto, precio: String(producto.precio) })
    setModalAbierto(true)
  }

  const handleNuevo = () => {
    setForm(productoInicial)
    setErrores({})
    setModalAbierto(true)
  }

  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <main>
      <h1>Gestión de Productos</h1>

      {exitoso && <div data-testid="exitoso">Producto guardado correctamente</div>}

      {/* CA1: Botón agregar producto */}
      <button data-testid="btn-nuevo-producto" onClick={handleNuevo}>
        Agregar producto
      </button>

      {/* CA5: Buscador */}
      <input
        data-testid="buscador-productos"
        placeholder="Buscar producto..."
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
      />

      {loading && <div data-testid="skeleton-loader"><div data-testid="skeleton-item" /></div>}
      {error && <div data-testid="error-productos"><p>Error al cargar los productos</p></div>}

      {/* CA2: Tabla de productos */}
      {!loading && !error && (
        <table data-testid="tabla-productos">
          <thead>
            <tr>
              <th>Nombre</th><th>Precio</th><th>Categoría</th><th>Stock</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map(producto => (
              <tr key={producto.id} data-testid="producto-fila">
                <td data-testid="fila-nombre">{producto.nombre}</td>
                <td data-testid="fila-precio">${producto.precio.toLocaleString('es-CL')}</td>
                <td data-testid="fila-categoria">{producto.categoria}</td>
                <td data-testid="fila-stock">{producto.stock}</td>
                <td>
                  <button
                    data-testid={`btn-editar-${producto.id}`}
                    onClick={() => handleEditar(producto)}
                  >
                    Editar
                  </button>
                  <button
                    data-testid={`btn-eliminar-${producto.id}`}
                    onClick={() => handleEliminar(producto.id)}
                    disabled={eliminando === producto.id}
                  >
                    {eliminando === producto.id ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* CA3, CA4: Modal de formulario */}
      {modalAbierto && (
        <div data-testid="modal-producto">
          <input
            data-testid="input-nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={e => setForm({ ...form, nombre: e.target.value })}
          />
          {errores.nombre && <span data-testid="error-nombre">{errores.nombre}</span>}

          <input
            data-testid="input-precio"
            placeholder="Precio"
            value={form.precio}
            onChange={e => setForm({ ...form, precio: e.target.value })}
          />
          {errores.precio && <span data-testid="error-precio">{errores.precio}</span>}

          <input
            data-testid="input-categoria"
            placeholder="Categoría"
            value={form.categoria}
            onChange={e => setForm({ ...form, categoria: e.target.value })}
          />
          {errores.categoria && <span data-testid="error-categoria">{errores.categoria}</span>}

          <input
            data-testid="input-marca"
            placeholder="Marca"
            value={form.marca}
            onChange={e => setForm({ ...form, marca: e.target.value })}
          />

          <input
            data-testid="input-stock"
            placeholder="Stock"
            value={form.stock}
            onChange={e => setForm({ ...form, stock: e.target.value })}
          />

          {errores.servidor && <span data-testid="error-servidor">{errores.servidor}</span>}

          <button
            data-testid="btn-guardar"
            onClick={handleGuardar}
            disabled={guardando}
          >
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>

          <button
            data-testid="btn-cancelar"
            onClick={() => { setModalAbierto(false); setErrores({}) }}
          >
            Cancelar
          </button>
        </div>
      )}
    </main>
  )
}

export default AdminProductos