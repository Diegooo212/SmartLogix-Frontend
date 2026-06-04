import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const itemsCarrito = [
  { id: 1, nombre: 'Laptop Gamer', precio: 899990, cantidad: 1 },
  { id: 2, nombre: 'Mouse Inalámbrico', precio: 24990, cantidad: 2 },
]

function Checkout() {
  const navigate = useNavigate()
  const [paso, setPaso] = useState(1)
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    direccion: '',
    ciudad: '',
    region: '',
    telefono: '',
    metodoPago: '',
  })
  const [errores, setErrores] = useState({})
  const [procesando, setProcesando] = useState(false)
  const [pedidoExitoso, setPedidoExitoso] = useState(false)
  const [errorPago, setErrorPago] = useState(false)
  const [numeroPedido, setNumeroPedido] = useState(null)

  const total = itemsCarrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0)

  const validarPaso1 = () => {
    const nuevosErrores = {}
    if (!form.nombre.trim()) nuevosErrores.nombre = 'El nombre es requerido'
    if (!form.apellido.trim()) nuevosErrores.apellido = 'El apellido es requerido'
    if (!form.direccion.trim()) nuevosErrores.direccion = 'La dirección es requerida'
    if (!form.ciudad.trim()) nuevosErrores.ciudad = 'La ciudad es requerida'
    if (!form.region.trim()) nuevosErrores.region = 'La región es requerida'
    return nuevosErrores
  }

  const validarPaso2 = () => {
    const nuevosErrores = {}
    if (!form.metodoPago) nuevosErrores.metodoPago = 'Selecciona un método de pago'
    return nuevosErrores
  }

  const handleSiguiente = () => {
    const nuevosErrores = validarPaso1()
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores)
      return
    }
    setErrores({})
    setPaso(2)
  }

  const handleConfirmar = async () => {
    const nuevosErrores = validarPaso2()
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores)
      return
    }

    setProcesando(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form, items: itemsCarrito }),
      })
      if (!res.ok) throw new Error('Error al procesar pago')
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
      <div data-testid="pedido-exitoso">
        <h2>¡Pedido confirmado!</h2>
        <span data-testid="numero-pedido">#{numeroPedido}</span>
        <button data-testid="btn-ir-inicio" onClick={() => navigate('/')}>
          Ir al inicio
        </button>
      </div>
    )
  }

  return (
    <main>
      <h1>Checkout</h1>

      {/* CA1: Indicador de pasos */}
      <div data-testid="indicador-pasos">
        <span data-testid={`paso-${paso}-activo`}>Paso {paso} de 2</span>
      </div>

      {errorPago && (
        <div data-testid="error-pago">
          Error al procesar el pago. Intenta nuevamente.
        </div>
      )}

      {/* PASO 1: Datos de envío */}
      {paso === 1 && (
        <div data-testid="paso-envio">
          <input
            data-testid="input-nombre"
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={e => setForm({ ...form, nombre: e.target.value })}
          />
          {errores.nombre && <span data-testid="error-nombre">{errores.nombre}</span>}

          <input
            data-testid="input-apellido"
            name="apellido"
            placeholder="Apellido"
            value={form.apellido}
            onChange={e => setForm({ ...form, apellido: e.target.value })}
          />
          {errores.apellido && <span data-testid="error-apellido">{errores.apellido}</span>}

          <input
            data-testid="input-direccion"
            name="direccion"
            placeholder="Dirección"
            value={form.direccion}
            onChange={e => setForm({ ...form, direccion: e.target.value })}
          />
          {errores.direccion && <span data-testid="error-direccion">{errores.direccion}</span>}

          <input
            data-testid="input-ciudad"
            name="ciudad"
            placeholder="Ciudad"
            value={form.ciudad}
            onChange={e => setForm({ ...form, ciudad: e.target.value })}
          />
          {errores.ciudad && <span data-testid="error-ciudad">{errores.ciudad}</span>}

          <input
            data-testid="input-region"
            name="region"
            placeholder="Región"
            value={form.region}
            onChange={e => setForm({ ...form, region: e.target.value })}
          />
          {errores.region && <span data-testid="error-region">{errores.region}</span>}

          <input
            data-testid="input-telefono"
            name="telefono"
            placeholder="Teléfono"
            value={form.telefono}
            onChange={e => setForm({ ...form, telefono: e.target.value })}
          />

          <button data-testid="btn-siguiente" onClick={handleSiguiente}>
            Siguiente
          </button>
        </div>
      )}

      {/* PASO 2: Método de pago y resumen */}
      {paso === 2 && (
        <div data-testid="paso-pago">

          {/* CA4: Resumen del pedido */}
          <div data-testid="resumen-pedido">
            {itemsCarrito.map(item => (
              <div key={item.id} data-testid="resumen-item">
                <span>{item.nombre}</span>
                <span>${(item.precio * item.cantidad).toLocaleString('es-CL')}</span>
              </div>
            ))}
            <span data-testid="total-checkout">${total.toLocaleString('es-CL')}</span>
          </div>

          {/* CA3: Métodos de pago */}
          <div data-testid="metodos-pago">
            {['webpay', 'transferencia', 'efectivo'].map(metodo => (
              <button
                key={metodo}
                data-testid={`metodo-${metodo}`}
                onClick={() => setForm({ ...form, metodoPago: metodo })}
                style={{ fontWeight: form.metodoPago === metodo ? 'bold' : 'normal' }}
              >
                {metodo}
              </button>
            ))}
          </div>
          {errores.metodoPago && (
            <span data-testid="error-metodo-pago">{errores.metodoPago}</span>
          )}

          <button data-testid="btn-volver-envio" onClick={() => setPaso(1)}>
            Volver
          </button>

          <button
            data-testid="btn-confirmar"
            onClick={handleConfirmar}
            disabled={procesando}
          >
            {procesando ? 'Procesando...' : 'Confirmar pedido'}
          </button>
        </div>
      )}
    </main>
  )
}

export default Checkout