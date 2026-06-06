import { useState, useEffect } from 'react'

const ESTADOS = ['Todos', 'Pendiente', 'En Preparación', 'Despachado', 'Entregado', 'Cancelado']

function AdminPedidos() {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [filtroEstado, setFiltroEstado] = useState('Todos')
  const [busqueda, setBusqueda] = useState('')
  const [actualizando, setActualizando] = useState(null)
  const [errorActualizar, setErrorActualizar] = useState(false)
  const [exitoso, setExitoso] = useState(false)

  useEffect(() => {
    fetch('/api/pedidos')
      .then(res => {
        if (!res.ok) throw new Error('Error')
        return res.json()
      })
      .then(data => {
        setPedidos(data)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [])

  const handleCambiarEstado = async (id, nuevoEstado) => {
    setActualizando(id)
    setErrorActualizar(false)
    try {
      const res = await fetch(`/api/pedidos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado }),
      })
      if (!res.ok) throw new Error('Error')
      setPedidos(pedidos.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p))
      setExitoso(true)
      setTimeout(() => setExitoso(false), 2000)
    } catch {
      setErrorActualizar(true)
    } finally {
      setActualizando(null)
    }
  }

  const pedidosFiltrados = pedidos.filter(p => {
    const coincideEstado = filtroEstado === 'Todos' || p.estado === filtroEstado
    const coincideBusqueda = p.id.toString().includes(busqueda) ||
      p.cliente.toLowerCase().includes(busqueda.toLowerCase())
    return coincideEstado && coincideBusqueda
  })

  return (
    <main>
      <h1>Gestión de Pedidos</h1>

      {exitoso && <div data-testid="exitoso">Estado actualizado correctamente</div>}
      {errorActualizar && (
        <div data-testid="error-actualizar">Error al actualizar el estado del pedido</div>
      )}

      {/* CA2: Filtro por estado */}
      <select
        data-testid="filtro-estado"
        value={filtroEstado}
        onChange={e => setFiltroEstado(e.target.value)}
      >
        {ESTADOS.map(estado => (
          <option key={estado} value={estado}>{estado}</option>
        ))}
      </select>

      {/* CA3: Buscador */}
      <input
        data-testid="buscador-pedidos"
        placeholder="Buscar por ID o cliente..."
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
      />

      {loading && <div data-testid="skeleton-loader"><div data-testid="skeleton-item" /></div>}
      {error && <div data-testid="error-pedidos"><p>Error al cargar los pedidos</p></div>}

      {/* CA1: Tabla de pedidos */}
      {!loading && !error && (
        <table data-testid="tabla-pedidos">
          <thead>
            <tr>
              <th>ID</th><th>Cliente</th><th>Total</th><th>Estado</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidosFiltrados.map(pedido => (
              <tr key={pedido.id} data-testid="pedido-fila">
                <td data-testid="fila-id">#{pedido.id}</td>
                <td data-testid="fila-cliente">{pedido.cliente}</td>
                <td data-testid="fila-total">${pedido.total.toLocaleString('es-CL')}</td>
                <td data-testid={`estado-${pedido.id}`}>{pedido.estado}</td>
                <td>
                  <select
                    data-testid={`select-estado-${pedido.id}`}
                    value={pedido.estado}
                    disabled={actualizando === pedido.id}
                    onChange={e => handleCambiarEstado(pedido.id, e.target.value)}
                  >
                    {ESTADOS.filter(e => e !== 'Todos').map(estado => (
                      <option key={estado} value={estado}>{estado}</option>
                    ))}
                  </select>
                  {actualizando === pedido.id && (
                    <span data-testid={`cargando-${pedido.id}`}>Actualizando...</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}

export default AdminPedidos