import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext'
import { CarritoProvider } from '../../context/CarritoContext'

export function renderWithProviders(ui) {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <CarritoProvider>
          {ui}
        </CarritoProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}