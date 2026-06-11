import { useState, useEffect } from 'react'
import styles from './Dashboard.module.css'

function AdminDashboard() {
  const [metricas, setMetricas] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('mes')

  useEffect(() => {
    setLoading(true)
    setError(false)
    fetch(`/api/admin/dashboard?periodo=${periodoSeleccionado}`)
      .then(res => { if (!res.ok) throw new Error('Error'); return res.json() })
      .then(data => { setMetricas(data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [periodoSeleccionado])

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.titulo}>
          <span className={styles.accent}>Dashboard</span> Admin
        </h1>
        <div data-testid="selector-periodo" className={styles.periodos}>
          {['dia', 'semana', 'mes', 'año'].map(periodo => (
            <button
              key={periodo}
              data-testid={`periodo-${periodo}`}
              className={`${styles.btnPeriodo} ${periodoSeleccionado === periodo ? styles.btnPeriodoActivo : ''}`}
              onClick={() => setPeriodoSeleccionado(periodo)}
            >
              {periodo}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div data-testid="skeleton-loader">
          <div className={styles.skeletonTarjetas}>
            {[1,2,3,4].map(i => <div key={i} data-testid="skeleton-item" className={styles.skeletonTarjeta} />)}
          </div>
        </div>
      )}

      {error && <div data-testid="error-dashboard" className={styles.error}><p>Error al cargar el dashboard</p></div>}

      {!loading && !error && metricas && (
        <div data-testid="contenido-dashboard">
          <div data-testid="tarjetas-metricas" className={styles.tarjetas}>
            <div data-testid="metrica-ventas" className={styles.tarjeta}>
              <span className={styles.tarjetaLabel}>Ventas totales</span>
              <span data-testid="valor-ventas" className={styles.tarjetaValor}>${metricas.ventasTotales.toLocaleString('es-CL')}</span>
            </div>
            <div data-testid="metrica-pedidos" className={styles.tarjeta}>
              <span className={styles.tarjetaLabel}>Pedidos</span>
              <span data-testid="valor-pedidos" className={styles.tarjetaValor}>{metricas.totalPedidos}</span>
            </div>
            <div data-testid="metrica-usuarios" className={styles.tarjeta}>
              <span className={styles.tarjetaLabel}>Usuarios nuevos</span>
              <span data-testid="valor-usuarios" className={styles.tarjetaValor}>{metricas.usuariosNuevos}</span>
            </div>
            <div data-testid="metrica-ticket" className={styles.tarjeta}>
              <span className={styles.tarjetaLabel}>Ticket promedio</span>
              <span data-testid="valor-ticket" className={styles.tarjetaValor}>${metricas.ticketPromedio.toLocaleString('es-CL')}</span>
            </div>
          </div>

          <div className={styles.grid}>
            <div data-testid="productos-mas-vendidos" className={styles.seccion}>
              <h2 className={styles.seccionTitulo}>Productos más vendidos</h2>
              {metricas.productosMasVendidos.map(producto => (
                <div key={producto.id} data-testid="producto-ranking" className={styles.rankingItem}>
                  <span data-testid="ranking-nombre" className={styles.rankingNombre}>{producto.nombre}</span>
                  <span data-testid="ranking-ventas" className={styles.rankingVentas}>{producto.ventas} vendidos</span>
                </div>
              ))}
            </div>

            <div data-testid="pedidos-recientes" className={styles.seccion}>
              <h2 className={styles.seccionTitulo}>Pedidos recientes</h2>
              {metricas.pedidosRecientes.map(pedido => (
                <div key={pedido.id} data-testid="pedido-reciente" className={styles.pedidoItem}>
                  <span data-testid="pedido-id" className={styles.pedidoId}>#{pedido.id}</span>
                  <span data-testid="pedido-cliente" className={styles.pedidoCliente}>{pedido.cliente}</span>
                  <span data-testid="pedido-estado" className={styles.pedidoEstado}>{pedido.estado}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default AdminDashboard