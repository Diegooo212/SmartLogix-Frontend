import { describe, it, expect } from 'vitest'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '../../test/mocks/server'
import { renderWithProviders } from '../../test/utils/renderWithProviders'
import Home from './index'

describe('HU-01 · Ver página principal', () => {

  it('CA1: muestra el hero con título y botones de navegación', () => {
    renderWithProviders(<Home />)
    expect(screen.getByTestId('hero')).toBeInTheDocument()
    expect(screen.getByText('Bienvenido a SmartLogix')).toBeInTheDocument()
    expect(screen.getByText('Ver ofertas')).toBeInTheDocument()
  })

  it('CA2: muestra al menos 5 productos en la sección Más vendidos', async () => {
    renderWithProviders(<Home />)
    await waitFor(() => {
      const cards = screen.getAllByTestId('producto-card')
      expect(cards.length).toBeGreaterThanOrEqual(5)
    })
  })

  it('CA3: cada producto muestra nombre, precio, categoría y botón de carrito', async () => {
    renderWithProviders(<Home />)
    await waitFor(() => {
      expect(screen.getAllByTestId('producto-nombre').length).toBeGreaterThan(0)
      expect(screen.getAllByTestId('producto-precio').length).toBeGreaterThan(0)
      expect(screen.getAllByTestId('producto-categoria').length).toBeGreaterThan(0)
      expect(screen.getAllByTestId('btn-carrito').length).toBeGreaterThan(0)
    })
  })

  it('CA4: el botón "Ver ofertas" redirige a /catalogo', () => {
    renderWithProviders(<Home />)
    const btn = screen.getByText('Ver ofertas')
    fireEvent.click(btn)
    expect(window.location.pathname).toBe('/catalogo')
  })

  it('CA5: los contadores del hero están presentes al cargar', () => {
    renderWithProviders(<Home />)
    expect(screen.getByTestId('hero-contadores')).toBeInTheDocument()
    expect(screen.getByTestId('contador-productos')).toBeInTheDocument()
    expect(screen.getByTestId('contador-clientes')).toBeInTheDocument()
  })

  it('CA6: al hacer clic en un producto redirige a su detalle', async () => {
    renderWithProviders(<Home />)
    await waitFor(() => {
      const cards = screen.getAllByTestId('producto-card')
      fireEvent.click(cards[0])
      expect(window.location.pathname).toContain('/producto/')
    })
  })

  it('CA7 (Loading): muestra Skeleton Loaders mientras se obtiene la información', () => {
    renderWithProviders(<Home />)
    expect(screen.getByTestId('skeleton-loader')).toBeInTheDocument()
    const skeletons = screen.getAllByTestId('skeleton-item')
    expect(skeletons.length).toBe(5)
  })

  it('CA8 (Error): muestra mensaje de error y botón reintentar si la API falla', async () => {
    // Sobreescribir handler para simular error 500
    server.use(
      http.get('/api/productos', () => {
        return new HttpResponse(null, { status: 500 })
      })
    )

    renderWithProviders(<Home />)

    await waitFor(() => {
      expect(screen.getByTestId('error-productos')).toBeInTheDocument()
      expect(screen.getByText('Error al cargar las ofertas')).toBeInTheDocument()
      expect(screen.getByText('Reintentar')).toBeInTheDocument()
    })
  })

})