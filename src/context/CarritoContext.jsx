import { createContext, useContext, useState } from 'react'

const CarritoContext = createContext(null)

export function CarritoProvider({ children }) {
  const [items, setItems] = useState([])

  const agregarProducto = (producto, cantidad = 1) => {
    setItems(prev => {
      const existente = prev.find(item => item.id === producto.id)
      if (existente) {
        return prev.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: Math.min(item.cantidad + cantidad, item.stock) }
            : item
        )
      }
      return [...prev, { ...producto, cantidad }]
    })
  }

  const incrementarCantidad = (id) => {
    setItems(prev => prev.map(item =>
      item.id === id && item.cantidad < item.stock
        ? { ...item, cantidad: item.cantidad + 1 }
        : item
    ))
  }

  const decrementarCantidad = (id) => {
    setItems(prev => prev.map(item =>
      item.id === id && item.cantidad > 1
        ? { ...item, cantidad: item.cantidad - 1 }
        : item
    ))
  }

  const eliminarProducto = (id) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const vaciarCarrito = () => setItems([])

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
      total,
      cantidadTotal,
    }}>
      {children}
    </CarritoContext.Provider>
  )
}

export const useCarrito = () => useContext(CarritoContext)