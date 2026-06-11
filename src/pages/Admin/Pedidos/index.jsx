import { useState, useEffect } from 'react'
import styles from './Pedidos.module.css'

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
      .then(res => { if (!res.ok) throw new Error('Error'); return res.json() })
      .then(data => { setPedidos(data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
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
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.titulo}>Gestión de Pedidos</h1>
        <div className={styles.filtros}>
          <select data-testid="filtro-estado" className={styles.select} value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
            {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
          <input data-testid="buscador-pedidos" className={styles.buscador} placeholder="Buscar por ID o cliente..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
        </div>
      </div>

      {exitoso && <div data-testid="exitoso" className={styles.exitoso}>✓ Estado actualizado correctamente</div>}
      {errorActualizar && <div data-testid="error-actualizar" className={styles.errorActualizar}>Error al actualizar el estado del pedido</div>}

      {loading && <div data-testid="skeleton-loader" className={styles.skeleton}><div data-testid="skeleton-item" /></div>}
      {error && <div data-testid="error-pedidos"><p>Error al cargar los pedidos</p></div>}

      {!loading && !error && (
        <div className={styles.tablaWrapper}>
          <table data-testid="tabla-pedidos" className={styles.tabla}>
            <thead>
              <tr>
                <th>ID</th><th>Cliente</th><th>Total</th><th>Estado</th><th>Cambiar estado</th>
              </tr>
            </thead>
            <tbody>
              {pedidosFiltrados.map(pedido => (
                <tr key={pedido.id} data-testid="pedido-fila">
                  <td><span className={styles.idPedido}>#{pedido.id}</span></td>
                  <td data-testid="fila-cliente">{pedido.cliente}</td>
                  <td><span className={styles.total}>${pedido.total.toLocaleString('es-CL')}</span></td>
                  <td data-testid={`estado-${pedido.id}`}>{pedido.estado}</td>
                  <td>
                    <select
                      data-testid={`select-estado-${pedido.id}`}
                      className={styles.selectEstado}
                      value={pedido.estado}
                      disabled={actualizando === pedido.id}
                      onChange={e => handleCambiarEstado(pedido.id, e.target.value)}
                    >
                      {ESTADOS.filter(e => e !== 'Todos').map(estado => (
                        <option key={estado} value={estado}>{estado}</option>
                      ))}
                    </select>
                    {actualizando === pedido.id && <span data-testid={`cargando-${pedido.id}`} className={styles.cargando}>Actualizando...</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}

export default AdminPedidos