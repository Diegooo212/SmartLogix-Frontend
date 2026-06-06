import { describe, it, expect } from 'vitest'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '../../../test/mocks/server'
import { renderWithProviders } from '../../../test/utils/renderWithProviders'
import AdminPedidos from './index'

describe('HU-ADMIN-02 · Gestión de Pedidos', () => {

  it('CA1: muestra tabla con pedidos al cargar', async () => {
    renderWithProviders(<AdminPedidos />)
    await waitFor(() => {
      expect(screen.getByTestId('tabla-pedidos')).toBeInTheDocument()
      const filas = screen.getAllByTestId('pedido-fila')
      expect(filas.length).toBeGreaterThanOrEqual(3)
    })
  })

  it('CA2: muestra filtro por estado', () => {
    renderWithProviders(<AdminPedidos />)
    expect(screen.getByTestId('filtro-estado')).toBeInTheDocument()
  })

  it('CA2b: filtra pedidos por estado', async () => {
    renderWithProviders(<AdminPedidos />)
    await waitFor(() => screen.getAllByTestId('pedido-fila'))
    fireEvent.change(screen.getByTestId('filtro-estado'), {
      target: { value: 'Pendiente' }
    })
    await waitFor(() => {
      const filas = screen.getAllByTestId('pedido-fila')
      expect(filas.length).toBeGreaterThanOrEqual(1)
    })
  })

  it('CA3: buscador filtra por cliente', async () => {
    renderWithProviders(<AdminPedidos />)
    await waitFor(() => screen.getAllByTestId('pedido-fila'))
    fireEvent.change(screen.getByTestId('buscador-pedidos'), {
      target: { value: 'Diego' }
    })
    await waitFor(() => {
      const filas = screen.getAllByTestId('pedido-fila')
      expect(filas.length).toBeGreaterThanOrEqual(1)
    })
  })

  it('CA4: muestra selector de estado por pedido', async () => {
    renderWithProviders(<AdminPedidos />)
    await waitFor(() => {
      expect(screen.getByTestId('select-estado-1')).toBeInTheDocument()
    })
  })

  it('CA4b: cambia el estado de un pedido correctamente', async () => {
    renderWithProviders(<AdminPedidos />)
    await waitFor(() => screen.getByTestId('select-estado-1'))
    fireEvent.change(screen.getByTestId('select-estado-1'), {
      target: { value: 'En Preparación' }
    })
    await waitFor(() => {
      expect(screen.getByTestId('exitoso')).toBeInTheDocument()
    })
  })

  it('CA5 (Loading): muestra skeleton loader mientras carga', () => {
    renderWithProviders(<AdminPedidos />)
    expect(screen.getByTestId('skeleton-loader')).toBeInTheDocument()
  })

  it('CA6 (Error): muestra error si la API falla al cargar', async () => {
    server.use(
      http.get('/api/pedidos', () => {
        return new HttpResponse(null, { status: 500 })
      })
    )
    renderWithProviders(<AdminPedidos />)
    await waitFor(() => {
      expect(screen.getByTestId('error-pedidos')).toBeInTheDocument()
    })
  })

  it('CA7 (Error): muestra error si falla al actualizar estado', async () => {
    server.use(
      http.put('/api/pedidos/:id', () => {
        return new HttpResponse(null, { status: 500 })
      })
    )
    renderWithProviders(<AdminPedidos />)
    await waitFor(() => screen.getByTestId('select-estado-1'))
    fireEvent.change(screen.getByTestId('select-estado-1'), {
      target: { value: 'Entregado' }
    })
    await waitFor(() => {
      expect(screen.getByTestId('error-actualizar')).toBeInTheDocument()
    })
  })

})