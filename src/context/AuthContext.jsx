import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const guardado = localStorage.getItem('usuario')
    if (guardado) {
      setUsuario(JSON.parse(guardado))
    }
    setCargando(false)
  }, [])

  const login = (datosUsuario) => {
    setUsuario(datosUsuario)
    localStorage.setItem('usuario', JSON.stringify(datosUsuario))
  }

  const logout = () => {
    setUsuario(null)
    localStorage.removeItem('usuario')
    localStorage.removeItem('admin_token')
  }

  const esAdmin = usuario?.rol === 'admin'

  return (
    <AuthContext.Provider value={{ usuario, login, logout, estaAutenticado: !!usuario, esAdmin, cargando }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)