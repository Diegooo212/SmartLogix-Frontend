import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import AdminLayout from './components/layout/AdminLayout'
import Home from './pages/Home'
import Catalogo from './pages/Catalogo'
import Producto from './pages/Producto'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import RecuperarPassword from './pages/Auth/RecuperarPassword'
import Perfil from './pages/Perfil'
import Carrito from './pages/Carrito'
import Checkout from './pages/Checkout'
import AdminLogin from './pages/Admin/Login'
import AdminDashboard from './pages/Admin/Dashboard'
import AdminProductos from './pages/Admin/Productos'
import AdminPedidos from './pages/Admin/Pedidos'
import AdminInventario from './pages/Admin/Inventario'
import AdminPromociones from './pages/Admin/Promociones'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="catalogo" element={<Catalogo />} />
          <Route path="producto/:id" element={<Producto />} />
          <Route path="login" element={<Login />} />
          <Route path="registro" element={<Register />} />
          <Route path="recuperar-password" element={<RecuperarPassword />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="carrito" element={<Carrito />} />
          <Route path="checkout" element={<Checkout />} />
        </Route>

        {/* Login admin */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Rutas admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="productos" element={<AdminProductos />} />
          <Route path="pedidos" element={<AdminPedidos />} />
          <Route path="inventario" element={<AdminInventario />} />
          <Route path="promociones" element={<AdminPromociones />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App