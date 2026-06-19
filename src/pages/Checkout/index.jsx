import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDirecciones } from '../../context/DireccionesContext'
import { useHistorial } from '../../context/HistorialContext'
import { useCarrito } from '../../context/CarritoContext'
import { useAuth } from '../../context/AuthContext'
import styles from './Checkout.module.css'
import { usePedidos } from '../../context/PedidosContext'
import { useProductos } from '../../context/ProductosContext'

const METODOS = [
  { id: 'webpay', label: 'Webpay Plus' },
  { id: 'mercadopago', label: 'MercadoPago' },
  { id: 'khipu', label: 'Khipu' },
]


function Checkout() {
  const navigate = useNavigate()
  const { direcciones, agregarDireccion } = useDirecciones()
  const { agregarPedido } = useHistorial()
  const { items, total, vaciarCarrito } = useCarrito()
  const COSTO_ENVIO = total >= 50000 ? 0 : 3990
  const totalConEnvio = total + COSTO_ENVIO
  const { estaAutenticado, usuario } = useAuth()
  const { agregarPedido: agregarPedidoGlobal } = usePedidos()
  const { actualizarStock } = useProductos()

  const [paso, setPaso] = useState(1)
  const [direccionSeleccionada, setDireccionSeleccionada] = useState('')
  const [formEnvio, setFormEnvio] = useState({
    direccion: '',
    numero: '',
    depto: '',
    comuna: '',
    ciudad: '',
    informacionAdicional: '',
  })
  const [formPago, setFormPago] = useState({
    nombre: '',
    apellido: '',
    email: '',
    confirmarEmail: '',
    metodoPago: '',
  })
  const [erroresEnvio, setErroresEnvio] = useState({})
  const [erroresPago, setErroresPago] = useState({})
  const [procesando, setProcesando] = useState(false)
  const [pedidoExitoso, setPedidoExitoso] = useState(false)
  const [errorPago, setErrorPago] = useState(false)
  const [numeroPedido, setNumeroPedido] = useState(null)
  const [guardarDireccion, setGuardarDireccion] = useState(false)

  const handleSeleccionarDireccion = (id) => {
    setDireccionSeleccionada(id)
    if (id === '') {
      setFormEnvio({ direccion: '', numero: '', depto: '', comuna: '', ciudad: '', informacionAdicional: '' })
      return
    }
    const dir = direcciones.find(d => String(d.id) === String(id))
    if (dir) {
      setFormEnvio({
        direccion: dir.calle || '',
        numero: dir.numero || '',
        comuna: dir.region || '',
        ciudad: dir.ciudad || '',
        depto: dir.referencia || '',
        informacionAdicional: '',
      })
    }
  }

  const validarPaso1 = () => {
    const e = {}
    if (!formEnvio.direccion.trim()) e.direccion = 'Este campo es obligatorio'
    if (!formEnvio.numero.trim()) e.numero = 'Este campo es obligatorio'
    if (!formEnvio.comuna.trim()) e.comuna = 'Este campo es obligatorio'
    if (!formEnvio.ciudad.trim()) e.ciudad = 'Este campo es obligatorio'
    return e
  }

  const validarPaso2 = () => {
    const e = {}
    if (!formPago.nombre.trim()) e.nombre = 'Este campo es obligatorio'
    if (!formPago.apellido.trim()) e.apellido = 'Este campo es obligatorio'
    if (!formPago.email.includes('@')) e.email = 'Correo inválido'
    if (formPago.email !== formPago.confirmarEmail) e.confirmarEmail = 'Los correos no coinciden'
    if (!formPago.metodoPago) e.metodoPago = 'Selecciona un método de pago'
    return e
  }

  const handleSiguiente = () => {
    const e = validarPaso1()
    if (Object.keys(e).length > 0) { setErroresEnvio(e); return }
    if (guardarDireccion && estaAutenticado) {
      agregarDireccion({
        calle: formEnvio.direccion,
        numero: formEnvio.numero,
        ciudad: formEnvio.ciudad,
        region: formEnvio.comuna,
        referencia: formEnvio.depto,
      })
    }
    setErroresEnvio({})
    setPaso(2)
  }

  const handleConfirmar = async () => {
    const e = validarPaso2()
    if (Object.keys(e).length > 0) { setErroresPago(e); return }
    setProcesando(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formEnvio, formPago, items }),
      })
      if (!res.ok) throw new Error('Error')

      const idPedidoComun = `SL-${Date.now()}`

      const pedidoRegistrado = agregarPedido({
        id: idPedidoComun,
        total: totalConEnvio,
        items,
        metodoPago: formPago.metodoPago,
      })

      agregarPedidoGlobal({
        id: idPedidoComun,
        cliente: `${formPago.nombre} ${formPago.apellido}`,
        correoCliente: usuario?.correo || formPago.email,
        items,
        total: totalConEnvio,
        metodoPago: formPago.metodoPago,
        direccion: formEnvio,
      })

      items.forEach(item => {
        const nuevoStock = Math.max(0, item.stock - item.cantidad)
        actualizarStock(item.id, nuevoStock)
      })

      setNumeroPedido(pedidoRegistrado.id)
      vaciarCarrito()
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
          <p className={styles.exitosoMsg}>Te enviaremos un correo con los detalles de tu pedido.</p>
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
          <span className={styles.pasoLabel}>Datos de envío</span>
        </div>
        <div className={styles.pasoLinea} />
        <div className={`${styles.paso} ${paso === 2 ? styles.pasoActivo : ''}`}>
          <span className={styles.pasoNumero}>2</span>
          <span className={styles.pasoLabel}>Pago</span>
        </div>
        {paso === 1 && <span data-testid="paso-1-activo" style={{ display: 'none' }} />}
        {paso === 2 && <span data-testid="paso-2-activo" style={{ display: 'none' }} />}
      </div>

      {errorPago && (
        <div data-testid="error-pago" className={styles.errorPago}>
          Error al procesar el pago. Intenta nuevamente.
        </div>
      )}

      <div className={styles.layout}>
        <div className={styles.formulario}>

          {/* PASO 1 — Dirección */}
          {paso === 1 && (
            <div data-testid="paso-envio">
              <h2 className={styles.seccionTitulo}>Datos de envío</h2>

              {/* Selector dirección guardada */}
              {estaAutenticado && direcciones.length > 0 && (
                <div className={styles.direccionesGuardadas}>
                  <label className={styles.label}>Usar dirección guardada</label>
                  <select
                    className={styles.input}
                    value={direccionSeleccionada}
                    onChange={e => handleSeleccionarDireccion(e.target.value)}
                  >
                    <option value="">Ingresar nueva dirección</option>
                    {direcciones.map(dir => (
                      <option key={dir.id} value={dir.id}>
                        {dir.calle} {dir.numero}, {dir.ciudad}{dir.predeterminada ? ' ⭐' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Calle y Número */}
              <div className={styles.grid}>
                <div className={styles.campo}>
                  <label className={styles.label}>Calle*</label>
                  <input
                    data-testid="input-direccion"
                    className={`${styles.input} ${erroresEnvio.direccion ? styles.inputError : ''}`}
                    placeholder="Ej: Manuel Montt"
                    value={formEnvio.direccion}
                    onChange={e => setFormEnvio({ ...formEnvio, direccion: e.target.value })}
                  />
                  {erroresEnvio.direccion && <span data-testid="error-direccion" className={styles.errorMsg}>{erroresEnvio.direccion}</span>}
                </div>
                <div className={styles.campo}>
                  <label className={styles.label}>Número*</label>
                  <input
                    data-testid="input-numero"
                    className={`${styles.input} ${erroresEnvio.numero ? styles.inputError : ''}`}
                    placeholder="Ej: 123"
                    value={formEnvio.numero}
                    onChange={e => setFormEnvio({ ...formEnvio, numero: e.target.value })}
                  />
                  {erroresEnvio.numero && <span data-testid="error-numero" className={styles.errorMsg}>{erroresEnvio.numero}</span>}
                </div>
              </div>

              {/* Comuna y Ciudad */}
              <div className={styles.grid}>
                <div className={styles.campo}>
                  <label className={styles.label}>Comuna*</label>
                  <input
                    data-testid="input-region"
                    className={`${styles.input} ${erroresEnvio.comuna ? styles.inputError : ''}`}
                    placeholder="Ej: Providencia"
                    value={formEnvio.comuna}
                    onChange={e => setFormEnvio({ ...formEnvio, comuna: e.target.value })}
                  />
                  {erroresEnvio.comuna && <span data-testid="error-region" className={styles.errorMsg}>{erroresEnvio.comuna}</span>}
                </div>
                <div className={styles.campo}>
                  <label className={styles.label}>Ciudad*</label>
                  <input
                    data-testid="input-ciudad"
                    className={`${styles.input} ${erroresEnvio.ciudad ? styles.inputError : ''}`}
                    placeholder="Ej: Santiago"
                    value={formEnvio.ciudad}
                    onChange={e => setFormEnvio({ ...formEnvio, ciudad: e.target.value })}
                  />
                  {erroresEnvio.ciudad && <span data-testid="error-ciudad" className={styles.errorMsg}>{erroresEnvio.ciudad}</span>}
                </div>
              </div>

              {/* Depto e Info adicional */}
              <div className={styles.grid}>
                <div className={styles.campo}>
                  <label className={styles.label}>Depto / Oficina / Nº Casa</label>
                  <input
                    className={styles.input}
                    placeholder="Ej: Oficina 456"
                    value={formEnvio.depto}
                    onChange={e => setFormEnvio({ ...formEnvio, depto: e.target.value })}
                  />
                </div>
                <div className={styles.campo}>
                  <label className={styles.label}>Información adicional</label>
                  <input
                    className={styles.input}
                    placeholder="Ej: Dejar en el casillero"
                    value={formEnvio.informacionAdicional}
                    onChange={e => setFormEnvio({ ...formEnvio, informacionAdicional: e.target.value })}
                  />
                </div>
              </div>

              {/* Guardar dirección */}
              {estaAutenticado && (
                <div className={styles.guardarDireccion}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={guardarDireccion}
                      onChange={e => setGuardarDireccion(e.target.checked)}
                      className={styles.checkbox}
                    />
                    Guardar esta dirección para futuras compras
                  </label>
                </div>
              )}

              <div className={styles.acciones}>
                <button data-testid="btn-siguiente" className={styles.btnSiguiente} onClick={handleSiguiente}>
                  Siguiente →
                </button>
              </div>
            </div>
          )}

          {/* PASO 2 — Datos personales + Pago */}
          {paso === 2 && (
            <div data-testid="paso-pago">

              {/* Datos personales */}
              <div className={styles.seccionPago}>
                <h2 className={styles.seccionTitulo}>Datos personales</h2>
                <p className={styles.seccionSubtitulo}>
                  Ingresa tus datos para generar el comprobante de pago y realizar el seguimiento de la compra
                </p>

                <div className={styles.grid}>
                  <div className={styles.campo}>
                    <label className={styles.label}>Nombre*</label>
                    <input
                      data-testid="input-nombre-pago"
                      className={`${styles.input} ${erroresPago.nombre ? styles.inputError : ''}`}
                      placeholder="Ej: Juan"
                      value={formPago.nombre}
                      onChange={e => setFormPago({ ...formPago, nombre: e.target.value })}
                    />
                    {erroresPago.nombre && <span className={styles.errorMsg}>{erroresPago.nombre}</span>}
                  </div>
                  <div className={styles.campo}>
                    <label className={styles.label}>Apellido*</label>
                    <input
                      data-testid="input-apellido-pago"
                      className={`${styles.input} ${erroresPago.apellido ? styles.inputError : ''}`}
                      placeholder="Ej: Pérez"
                      value={formPago.apellido}
                      onChange={e => setFormPago({ ...formPago, apellido: e.target.value })}
                    />
                    {erroresPago.apellido && <span className={styles.errorMsg}>{erroresPago.apellido}</span>}
                  </div>
                </div>

                <div className={styles.grid}>
                  <div className={styles.campo}>
                    <label className={styles.label}>E-mail*</label>
                    <input
                      data-testid="input-email-pago"
                      className={`${styles.input} ${erroresPago.email ? styles.inputError : ''}`}
                      type="email"
                      placeholder="Ej: juan@correo.cl"
                      value={formPago.email}
                      onChange={e => setFormPago({ ...formPago, email: e.target.value })}
                    />
                    {erroresPago.email && <span className={styles.errorMsg}>{erroresPago.email}</span>}
                  </div>
                  <div className={styles.campo}>
                    <label className={styles.label}>Confirmar E-mail*</label>
                    <input
                      data-testid="input-confirmar-email-pago"
                      className={`${styles.input} ${erroresPago.confirmarEmail ? styles.inputError : ''}`}
                      type="email"
                      placeholder="Ej: juan@correo.cl"
                      value={formPago.confirmarEmail}
                      onChange={e => setFormPago({ ...formPago, confirmarEmail: e.target.value })}
                    />
                    {erroresPago.confirmarEmail && <span data-testid="error-confirmar-email" className={styles.errorMsg}>{erroresPago.confirmarEmail}</span>}
                  </div>
                </div>
              </div>

              {/* Métodos de pago */}
              <div className={styles.seccionPago}>
                <h2 className={styles.seccionTitulo}>Selecciona tu medio de pago</h2>
                <p className={styles.seccionSubtitulo}>
                  Al continuar con cualquier medio de pago, serás redirigido a su pasarela de pago.
                </p>

                <div data-testid="metodos-pago" className={styles.metodos}>
                  {METODOS.map(metodo => (
                    <label
                      key={metodo.id}
                      data-testid={`metodo-${metodo.id}`}
                      className={`${styles.metodo} ${formPago.metodoPago === metodo.id ? styles.metodoActivo : ''}`}
                      onClick={() => setFormPago({ ...formPago, metodoPago: metodo.id })}
                    >
                      <div className={styles.metodoRadio}>
                        <div className={`${styles.radioCircle} ${formPago.metodoPago === metodo.id ? styles.radioActivo : ''}`} />
                      </div>
                      <span className={styles.metodoLabel}>{metodo.label}</span>
                    </label>
                  ))}
                </div>
                {erroresPago.metodoPago && (
                  <span data-testid="error-metodo-pago" className={styles.errorMsg}>{erroresPago.metodoPago}</span>
                )}
              </div>

              <div className={styles.acciones}>
                <button data-testid="btn-volver-envio" className={styles.btnVolver} onClick={() => setPaso(1)}>
                  ← Volver
                </button>
                <button
                  data-testid="btn-confirmar"
                  className={styles.btnPagar}
                  onClick={handleConfirmar}
                  disabled={procesando}
                >
                  {procesando ? 'Procesando...' : '🔒 Pagar'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Resumen */}
        <div data-testid="resumen-pedido" className={styles.resumen}>
          <h2 className={styles.resumenTitulo}>
            Tu carro ({items.length} {items.length === 1 ? 'Producto' : 'Productos'})
          </h2>
          {items.map(item => (
            <div key={item.id} data-testid="resumen-item" className={styles.resumenItem}>
              <div className={styles.resumenItemImagen} />
              <div className={styles.resumenItemInfo}>
                <span className={styles.resumenItemNombre}>{item.nombre}</span>
                <span className={styles.resumenItemPrecio}>${item.precio.toLocaleString('es-CL')}</span>
                <span className={styles.resumenItemCantidad}>x{item.cantidad}</span>
              </div>
            </div>
          ))}
          <div className={styles.resumenDivider} />

          {/* Subtotal */}
          <div className={styles.resumenFila}>
            <span className={styles.resumenFilaLabel}>Subtotal</span>
            <span className={styles.resumenFilaValor}>${total.toLocaleString('es-CL')}</span>
          </div>

          {/* Envío */}
          <div className={styles.resumenFila}>
            <span className={styles.resumenFilaLabel}>Costo de envío</span>
            {COSTO_ENVIO === 0
              ? <span className={styles.envioGratis}>¡Gratis!</span>
              : <span className={styles.resumenFilaValor}>${COSTO_ENVIO.toLocaleString('es-CL')}</span>
            }
          </div>

          {total < 50000 && (
            <div className={styles.envioMensaje}>
              Agrega ${(50000 - total).toLocaleString('es-CL')} más para envío gratis
            </div>
          )}

          <div className={styles.resumenDivider} />

          {/* Total */}
          <div className={styles.resumenTotal}>
            <span className={styles.resumenTotalLabel}>Total</span>
            <span data-testid="total-checkout" className={styles.resumenTotalValor}>
              ${totalConEnvio.toLocaleString('es-CL')}
            </span>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Checkout