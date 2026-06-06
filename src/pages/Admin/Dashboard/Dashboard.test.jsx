import { describe, it, expect } from 'vitest'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '../../../test/mocks/server'
import { renderWithProviders } from '../../../test/utils/renderWithProviders'
import AdminDashboard from './index'

describe('HU-ADMIN-03 · Dashboard', () => {

  it('CA1: muestra las tarjetas de métricas al cargar', async () => {
    renderWithProviders(<AdminDashboard />)
    await waitFor(() => {
      expect(screen.getByTestId('tarjetas-metricas')).toBeInTheDocument()
      expect(screen.getByTestId('metrica-ventas')).toBeInTheDocument()
      expect(screen.getByTestId('metrica-pedidos')).toBeInTheDocument()
      expect(screen.getByTestId('metrica-usuarios')).toBeInTheDocument()
      expect(screen.getByTestId('metrica-ticket')).toBeInTheDocument()
    })
  })

  it('CA2: muestra lista de productos más vendidos', async () => {
    renderWithProviders(<AdminDashboard />)
    await waitFor(() => {
      expect(screen.getByTestId('productos-mas-vendidos')).toBeInTheDocument()
      const productos = screen.getAllByTestId('producto-ranking')
      expect(productos.length).toBeGreaterThanOrEqual(3)
    })
  })

  it('CA3: muestra pedidos recientes', async () => {
    renderWithProviders(<AdminDashboard />)
    await waitFor(() => {
      expect(screen.getByTestId('pedidos-recientes')).toBeInTheDocument()
      const pedidos = screen.getAllByTestId('pedido-reciente')
      expect(pedidos.length).toBeGreaterThanOrEqual(3)
    })
  })

  it('CA4: muestra selector de período', () => {
    renderWithProviders(<AdminDashboard />)
    expect(screen.getByTestId('selector-periodo')).toBeInTheDocument()
    expect(screen.getByTestId('periodo-dia')).toBeInTheDocument()
    expect(screen.getByTestId('periodo-semana')).toBeInTheDocument()
    expect(screen.getByTestId('periodo-mes')).toBeInTheDocument()
    expect(screen.getByTestId('periodo-año')).toBeInTheDocument()
  })

  it('CA4b: al cambiar período recarga las métricas', async () => {
    renderWithProviders(<AdminDashboard />)
    await waitFor(() => screen.getByTestId('contenido-dashboard'))
    fireEvent.click(screen.getByTestId('periodo-semana'))
    expect(screen.getByTestId('skeleton-loader')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByTestId('contenido-dashboard')).toBeInTheDocument()
    })
  })

  it('CA5 (Loading): muestra skeleton loaders mientras carga', () => {
    renderWithProviders(<AdminDashboard />)
    expect(screen.getByTestId('skeleton-loader')).toBeInTheDocument()
    const skeletons = screen.getAllByTestId('skeleton-item')
    expect(skeletons.length).toBe(4)
  })

  it('CA6 (Error): muestra error si la API falla', async () => {
    server.use(
      http.get('/api/admin/dashboard', () => {
        return new HttpResponse(null, { status: 500 })
      })
    )
    renderWithProviders(<AdminDashboard />)
    await waitFor(() => {
      expect(screen.getByTestId('error-dashboard')).toBeInTheDocument()
    })
  })

})