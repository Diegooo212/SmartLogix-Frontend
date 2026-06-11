import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Checkout.module.css'

const itemsCarrito = [
  { id: 1, nombre: 'Laptop Gamer', precio: 899990, cantidad: 1 },
  { id: 2, nombre: 'Mouse Inalámbrico', precio: 24990, cantidad: 2 },
]

const METODOS = [
  { id: 'webpay', label: '💳 Webpay Plus' },
  { id: 'transferencia', label: '🏦 Transferencia bancaria' },
  { id: 'efectivo', label: '💵 Efectivo' },
]

function Checkout() {
  const navigate = useNavigate()
  const [paso, setPaso] = useState(1)
  const [form, setForm] = useState({ nombre: '', apellido: '', direccion: '', ciudad: '', region: '', telefono: '', metodoPago: '' })
  const [errores, setErrores] = useState({})
  const [procesando, setProcesando] = useState(false)
  const [pedidoExitoso, setPedidoExitoso] = useState(false)
  const [errorPago, setErrorPago] = useState(false)
  const [numeroPedido, setNumeroPedido] = useState(null)

  const total = itemsCarrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0)

  const validarPaso1 = () => {
    const e = {}
    if (!form.nombre.trim()) e.nombre = 'Requerido'
    if (!form.apellido.trim()) e.apellido = 'Requerido'
    if (!form.direccion.trim()) e.direccion = 'Requerido'
    if (!form.ciudad.trim()) e.ciudad = 'Requerido'
    if (!form.region.trim()) e.region = 'Requerido'
    return e
  }

  const handleSiguiente = () => {
    const e = validarPaso1()
    if (Object.keys(e).length > 0) { setErrores(e); return }
    setErrores({})
    setPaso(2)
  }

  const handleConfirmar = async () => {
    if (!form.metodoPago) { setErrores({ metodoPago: 'Selecciona un método de pago' }); return }
    setProcesando(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form, items: itemsCarrito }),
      })
      if (!res.ok) throw new Error('Error')
      const data = await res.json()
      setNumeroPedido(data.numeroPedido)
      setPedidoExitoso(true)
    } catch {
      setErrorPago(true)
    } finally {
      setProcesando(false)
    }
  }

  if (pedidoExitoso) {
    return (
      <main className={styles.main}>
        <div data-testid="pedido-exitoso" className={styles.exitoso}>
          <span className={styles.exitosoIcono}>🎉</span>
          <h2 className={styles.exitosoTitulo}>¡Pedido confirmado!</h2>
          <span data-testid="numero-pedido" className={styles.exitosoNumeroPedido}>#{numeroPedido}</span>
          <button data-testid="btn-ir-inicio" className={styles.btnInicio} onClick={() => navigate('/')}>
            Ir al inicio
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.titulo}>Checkout</h1>

      {/* Indicador pasos */}
      <div data-testid="indicador-pasos" className={styles.pasos}>
        <div className={`${styles.paso} ${paso === 1 ? styles.pasoActivo : ''}`}>
          <span className={styles.pasoNumero}>1</span>
          <span className={styles.pasoLabel}>Envío</span>
        </div>
        <div className={styles.pasoLinea} />
        <div className={`${styles.paso} ${paso === 2 ? styles.pasoActivo : ''}`}>
          <span className={styles.pasoNumero}>2</span>
          <span className={styles.pasoLabel}>Pago</span>
        </div>
        {paso === 1 && <span data-testid="paso-1-activo" style={{ display: 'none' }} />}
        {paso === 2 && <span data-testid="paso-2-activo" style={{ display: 'none' }} />}
      </div>

      {errorPago && <div data-testid="error-pago" className={styles.errorPago}>Error al procesar el pago. Intenta nuevamente.</div>}

      <div className={styles.layout}>
        <div className={styles.formulario}>
          {paso === 1 && (
            <div data-testid="paso-envio">
              <h2 className={styles.seccionTitulo}>Datos de envío</h2>
              <div className={styles.grid}>
                <div className={styles.campo}>
                  <label className={styles.label}>Nombre</label>
                  <input data-testid="input-nombre" className={`${styles.input} ${errores.nombre ? styles.inputError : ''}`} value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
                  {errores.nombre && <span data-testid="error-nombre" className={styles.errorMsg}>{errores.nombre}</span>}
                </div>
                <div className={styles.campo}>
                  <label className={styles.label}>Apellido</label>
                  <input data-testid="input-apellido" className={`${styles.input} ${errores.apellido ? styles.inputError : ''}`} value={form.apellido} onChange={e => setForm({ ...form, apellido: e.target.value })} />
                  {errores.apellido && <span data-testid="error-apellido" className={styles.errorMsg}>{errores.apellido}</span>}
                </div>
                <div className={`${styles.campo} ${styles.campoFull}`}>
                  <label className={styles.label}>Dirección</label>
                  <input data-testid="input-direccion" className={`${styles.input} ${errores.direccion ? styles.inputError : ''}`} value={form.direccion} onChange={e => setForm({ ...form, direccion: e.target.value })} />
                  {errores.direccion && <span data-testid="error-direccion" className={styles.errorMsg}>{errores.direccion}</span>}
                </div>
                <div className={styles.campo}>
                  <label className={styles.label}>Ciudad</label>
                  <input data-testid="input-ciudad" className={`${styles.input} ${errores.ciudad ? styles.inputError : ''}`} value={form.ciudad} onChange={e => setForm({ ...form, ciudad: e.target.value })} />
                  {errores.ciudad && <span data-testid="error-ciudad" className={styles.errorMsg}>{errores.ciudad}</span>}
                </div>
                <div className={styles.campo}>
                  <label className={styles.label}>Región</label>
                  <input data-testid="input-region" className={`${styles.input} ${errores.region ? styles.inputError : ''}`} value={form.region} onChange={e => setForm({ ...form, region: e.target.value })} />
                  {errores.region && <span data-testid="error-region" className={styles.errorMsg}>{errores.region}</span>}
                </div>
                <div className={`${styles.campo} ${styles.campoFull}`}>
                  <label className={styles.label}>Teléfono</label>
                  <input data-testid="input-telefono" className={styles.input} value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} />
                </div>
              </div>
              <div className={styles.acciones}>
                <button data-testid="btn-siguiente" className={styles.btnSiguiente} onClick={handleSiguiente}>
                  Siguiente →
                </button>
              </div>
            </div>
          )}

          {paso === 2 && (
            <div data-testid="paso-pago">
              <h2 className={styles.seccionTitulo}>Método de pago</h2>
              <div data-testid="metodos-pago" className={styles.metodos}>
                {METODOS.map(metodo => (
                  <button
                    key={metodo.id}
                    data-testid={`metodo-${metodo.id}`}
                    className={`${styles.metodo} ${form.metodoPago === metodo.id ? styles.metodoActivo : ''}`}
                    onClick={() => setForm({ ...form, metodoPago: metodo.id })}
                  >
                    {metodo.label}
                  </button>
                ))}
              </div>
              {errores.metodoPago && <span data-testid="error-metodo-pago" className={styles.errorMsg}>{errores.metodoPago}</span>}

              <div className={styles.acciones}>
                <button data-testid="btn-volver-envio" className={styles.btnVolver} onClick={() => setPaso(1)}>
                  ← Volver
                </button>
                <button data-testid="btn-confirmar" className={styles.btnSiguiente} onClick={handleConfirmar} disabled={procesando}>
                  {procesando ? 'Procesando...' : 'Confirmar pedido'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div data-testid="resumen-pedido" className={styles.resumen}>
          <h2 className={styles.resumenTitulo}>Resumen del pedido</h2>
          {itemsCarrito.map(item => (
            <div key={item.id} data-testid="resumen-item" className={styles.resumenItem}>
              <span>{item.nombre} x{item.cantidad}</span>
              <span>${(item.precio * item.cantidad).toLocaleString('es-CL')}</span>
            </div>
          ))}
          <div className={styles.resumenTotal}>
            <span className={styles.resumenTotalLabel}>Total</span>
            <span data-testid="total-checkout" className={styles.resumenTotalValor}>${total.toLocaleString('es-CL')}</span>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Checkout