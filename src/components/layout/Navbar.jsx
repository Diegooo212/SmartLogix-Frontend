import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styles from './Navbar.module.css'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuAbierto, setMenuAbierto] = useState(false)

  const links = [
    { label: 'Inicio', path: '/' },
    { label: 'Catálogo', path: '/catalogo' },
    { label: 'Carrito', path: '/carrito' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>

        {/* Logo */}
        <div className={styles.logo} onClick={() => navigate('/')}>
          <span className={styles.logoText}>Smart</span>
          <span className={styles.logoAccent}>Logix</span>
        </div>

        {/* Links desktop */}
        <ul className={styles.links}>
          {links.map(link => (
            <li key={link.path}>
              <button
                className={`${styles.link} ${isActive(link.path) ? styles.active : ''}`}
                onClick={() => navigate(link.path)}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Acciones */}
        <div className={styles.acciones}>
          <button
            className={styles.btnLogin}
            onClick={() => navigate('/login')}
          >
            Iniciar sesión
          </button>
          <button
            className={styles.btnRegistro}
            onClick={() => navigate('/registro')}
          >
            Registrarse
          </button>
        </div>

        {/* Menú hamburguesa mobile */}
        <button
          className={styles.hamburguesa}
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Menú mobile */}
      {menuAbierto && (
        <div className={styles.menuMobile}>
          {links.map(link => (
            <button
              key={link.path}
              className={`${styles.linkMobile} ${isActive(link.path) ? styles.active : ''}`}
              onClick={() => { navigate(link.path); setMenuAbierto(false) }}
            >
              {link.label}
            </button>
          ))}
          <button className={styles.btnLogin} onClick={() => navigate('/login')}>
            Iniciar sesión
          </button>
          <button className={styles.btnRegistro} onClick={() => navigate('/registro')}>
            Registrarse
          </button>
        </div>
      )}
    </nav>
  )
}

export default Navbar