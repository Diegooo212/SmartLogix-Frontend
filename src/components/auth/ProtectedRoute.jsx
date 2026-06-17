import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function ProtectedRoute() {
  const { estaAutenticado, cargando } = useAuth()

  if (cargando) return null

  if (!estaAutenticado) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute