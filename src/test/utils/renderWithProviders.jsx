import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext'
import { CarritoProvider } from '../../context/CarritoContext'
import { DireccionesProvider } from '../../context/DireccionesContext'
import { HistorialProvider } from '../../context/HistorialContext'

export function renderWithProviders(ui) {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <CarritoProvider>
          <DireccionesProvider>
            <HistorialProvider>
              {ui}
            </HistorialProvider>
          </DireccionesProvider>
        </CarritoProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}