import { useState, useEffect } from 'react'

function AdminDashboard() {
  const [metricas, setMetricas] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('mes')

  useEffect(() => {
    fetch(`/api/admin/dashboard?periodo=${periodoSeleccionado}`)
      .then(res => {
        if (!res.ok) throw new Error('Error')
        return res.json()
      })
      .then(data => {
        setMetricas(data)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [periodoSeleccionado])

  return (
    <main>
      <h1>Dashboard</h1>

      {/* CA4: Selector de período */}
      <div data-testid="selector-periodo">
        {['dia', 'semana', 'mes', 'año'].map(periodo => (
          <button
            key={periodo}
            data-testid={`periodo-${periodo}`}
            onClick={() => {
              setLoading(true)
              setError(false)
              setPeriodoSeleccionado(periodo)
            }}
            style={{ fontWeight: periodoSeleccionado === periodo ? 'bold' : 'normal' }}
          >
            {periodo}
          </button>
        ))}
      </div>

      {loading && (
        <div data-testid="skeleton-loader">
          {[1, 2, 3, 4].map(i => (
            <div key={i} data-testid="skeleton-item" />
          ))}
        </div>
      )}

      {error && (
        <div data-testid="error-dashboard">
          <p>Error al cargar el dashboard</p>
        </div>
      )}

      {!loading && !error && metricas && (
        <div data-testid="contenido-dashboard">

          {/* CA1: Tarjetas de métricas */}
          <div data-testid="tarjetas-metricas">
            <div data-testid="metrica-ventas">
              <span>Ventas totales</span>
              <span data-testid="valor-ventas">${metricas.ventasTotales.toLocaleString('es-CL')}</span>
            </div>
            <div data-testid="metrica-pedidos">
              <span>Pedidos</span>
              <span data-testid="valor-pedidos">{metricas.totalPedidos}</span>
            </div>
            <div data-testid="metrica-usuarios">
              <span>Usuarios nuevos</span>
              <span data-testid="valor-usuarios">{metricas.usuariosNuevos}</span>
            </div>
            <div data-testid="metrica-ticket">
              <span>Ticket promedio</span>
              <span data-testid="valor-ticket">${metricas.ticketPromedio.toLocaleString('es-CL')}</span>
            </div>
          </div>

          {/* CA2: Productos más vendidos */}
          <div data-testid="productos-mas-vendidos">
            <h2>Productos más vendidos</h2>
            {metricas.productosMasVendidos.map(producto => (
              <div key={producto.id} data-testid="producto-ranking">
                <span data-testid="ranking-nombre">{producto.nombre}</span>
                <span data-testid="ranking-ventas">{producto.ventas} vendidos</span>
              </div>
            ))}
          </div>

          {/* CA3: Pedidos recientes */}
          <div data-testid="pedidos-recientes">
            <h2>Pedidos recientes</h2>
            {metricas.pedidosRecientes.map(pedido => (
              <div key={pedido.id} data-testid="pedido-reciente">
                <span data-testid="pedido-id">#{pedido.id}</span>
                <span data-testid="pedido-cliente">{pedido.cliente}</span>
                <span data-testid="pedido-estado">{pedido.estado}</span>
              </div>
            ))}
          </div>

        </div>
      )}
    </main>
  )
}

export default AdminDashboard