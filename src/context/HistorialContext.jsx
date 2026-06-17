import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const HistorialContext = createContext(null)

export function HistorialProvider({ children }) {
  const { usuario } = useAuth()
  const [historial, setHistorial] = useState([])

  const getKey = () => `historial_${usuario?.correo || 'guest'}`

  useEffect(() => {
    if (usuario) {
      const guardado = localStorage.getItem(getKey())
      setHistorial(guardado ? JSON.parse(guardado) : [])
    } else {
      setHistorial([])
    }
  }, [usuario])

  const agregarPedido = (pedido) => {
    const nuevo = {
      ...pedido,
      id: `SL-${Date.now()}`,
      fecha: new Date().toLocaleDateString('es-CL'),
      estado: 'Pendiente',
    }
    const nuevos = [nuevo, ...historial]
    localStorage.setItem(getKey(), JSON.stringify(nuevos))
    setHistorial(nuevos)
    return nuevo
  }

  return (
    <HistorialContext.Provider value={{ historial, agregarPedido }}>
      {children}
    </HistorialContext.Provider>
  )
}

export const useHistorial = () => useContext(HistorialContext)