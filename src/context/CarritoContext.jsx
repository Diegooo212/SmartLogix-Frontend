import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const CarritoContext = createContext(null)

export function CarritoProvider({ children }) {
  const { usuario } = useAuth()
  const [items, setItems] = useState([])

  const getKey = () => `carrito_${usuario?.correo || 'guest'}`

  useEffect(() => {
    const guardado = localStorage.getItem(getKey())
    setItems(guardado ? JSON.parse(guardado) : [])
  }, [usuario])

  const guardarEnStorage = (nuevosItems) => {
    localStorage.setItem(getKey(), JSON.stringify(nuevosItems))
    setItems(nuevosItems)
  }

  const agregarProducto = (producto, cantidad = 1) => {
    const prev = items
    const existente = prev.find(item => item.id === producto.id)
    let nuevos
    if (existente) {
      nuevos = prev.map(item =>
        item.id === producto.id
          ? { ...item, cantidad: Math.min(item.cantidad + cantidad, producto.stock), stock: producto.stock }
          : item
      )
    } else {
      nuevos = [...prev, { ...producto, cantidad }]
    }
    guardarEnStorage(nuevos)
  }

  // Sincronizar stock de items con el stock actual del contexto de productos
  const sincronizarStock = (productosActualizados) => {
    const nuevos = items.map(item => {
      const productoActual = productosActualizados.find(p => p.id === item.id)
      if (productoActual) {
        return {
          ...item,
          stock: productoActual.stock,
          cantidad: Math.min(item.cantidad, productoActual.stock),
        }
      }
      return item
    })
    guardarEnStorage(nuevos)
  }

  const incrementarCantidad = (id) => {
    const nuevos = items.map(item =>
      item.id === id && item.cantidad < item.stock
        ? { ...item, cantidad: item.cantidad + 1 }
        : item
    )
    guardarEnStorage(nuevos)
  }

  const decrementarCantidad = (id) => {
    const nuevos = items.map(item =>
      item.id === id && item.cantidad > 1
        ? { ...item, cantidad: item.cantidad - 1 }
        : item
    )
    guardarEnStorage(nuevos)
  }

  const eliminarProducto = (id) => {
    const nuevos = items.filter(item => item.id !== id)
    guardarEnStorage(nuevos)
  }

  const vaciarCarrito = () => guardarEnStorage([])

  const total = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0)
  const cantidadTotal = items.reduce((acc, item) => acc + item.cantidad, 0)

  return (
    <CarritoContext.Provider value={{
      items,
      agregarProducto,
      incrementarCantidad,
      decrementarCantidad,
      eliminarProducto,
      vaciarCarrito,
      sincronizarStock,
      total,
      cantidadTotal,
    }}>
      {children}
    </CarritoContext.Provider>
  )
}

export const useCarrito = () => useContext(CarritoContext)