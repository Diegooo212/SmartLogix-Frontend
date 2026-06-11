import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Catalogo from './pages/Catalogo'
import Producto from './pages/Producto'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import RecuperarPassword from './pages/Auth/RecuperarPassword'
import Perfil from './pages/Perfil'
import Carrito from './pages/Carrito'
import Checkout from './pages/Checkout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
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
      </Routes>
    </BrowserRouter>
  )
}

export default App