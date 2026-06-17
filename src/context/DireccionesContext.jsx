import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const DireccionesContext = createContext(null)

export function DireccionesProvider({ children }) {
  const { usuario } = useAuth()
  const [direcciones, setDirecciones] = useState([])

  const getKey = () => `direcciones_${usuario?.correo || 'guest'}`

  useEffect(() => {
    if (usuario) {
      const guardadas = localStorage.getItem(getKey())
      setDirecciones(guardadas ? JSON.parse(guardadas) : [])
    } else {
      setDirecciones([])
    }
  }, [usuario])

  const guardarEnStorage = (nuevasDirecciones) => {
    localStorage.setItem(getKey(), JSON.stringify(nuevasDirecciones))
    setDirecciones(nuevasDirecciones)
  }

  const agregarDireccion = (direccion) => {
    const nueva = {
      ...direccion,
      id: Date.now(),
      predeterminada: direcciones.length === 0,
    }
    guardarEnStorage([...direcciones, nueva])
  }

  const eliminarDireccion = (id) => {
    const nuevas = direcciones.filter(d => d.id !== id)
    if (nuevas.length > 0 && !nuevas.some(d => d.predeterminada)) {
      nuevas[0].predeterminada = true
    }
    guardarEnStorage(nuevas)
  }

  const marcarPredeterminada = (id) => {
    const nuevas = direcciones.map(d => ({ ...d, predeterminada: d.id === id }))
    guardarEnStorage(nuevas)
  }

  const direccionPredeterminada = direcciones.find(d => d.predeterminada) || null

  return (
    <DireccionesContext.Provider value={{
      direcciones,
      agregarDireccion,
      eliminarDireccion,
      marcarPredeterminada,
      direccionPredeterminada,
    }}>
      {children}
    </DireccionesContext.Provider>
  )
}

export const useDirecciones = () => useContext(DireccionesContext)