import { describe, it, expect } from 'vitest'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '../../test/mocks/server'
import { renderWithProviders } from '../../test/utils/renderWithProviders'
import Producto from './index'

// Helper para renderizar con parámetro de ruta :id
function renderProducto() {
  return renderWithProviders(<Producto />, { route: '/producto/1' })
}

describe('HU-03 · Ver detalle de producto', () => {

  it('CA1: muestra la imagen del producto', async () => {
    renderWithProviders(<Producto />)
    await waitFor(() => {
      expect(screen.getByTestId('producto-imagen')).toBeInTheDocument()
    })
  })

  it('CA2: muestra nombre, marca, categoría y descripción', async () => {
    renderWithProviders(<Producto />)
    await waitFor(() => {
      expect(screen.getByTestId('producto-nombre')).toBeInTheDocument()
      expect(screen.getByTestId('producto-marca')).toBeInTheDocument()
      expect(screen.getByTestId('producto-categoria')).toBeInTheDocument()
      expect(screen.getByTestId('producto-descripcion')).toBeInTheDocument()
    })
  })

  it('CA3: muestra precio con descuento y badge cuando hay descuento', async () => {
    renderWithProviders(<Producto />)
    await waitFor(() => {
      expect(screen.getByTestId('precio-final')).toBeInTheDocument()
      expect(screen.getByTestId('precio-original')).toBeInTheDocument()
      expect(screen.getByTestId('badge-descuento')).toBeInTheDocument()
    })
  })

  it('CA4: muestra stock disponible del producto', async () => {
    renderWithProviders(<Producto />)
    await waitFor(() => {
      expect(screen.getByTestId('stock-disponible')).toBeInTheDocument()
      expect(screen.getByTestId('stock-disponible')).toHaveTextContent('disponibles')
    })
  })

  it('CA5: el selector de cantidad incrementa y decrementa correctamente', async () => {
    renderWithProviders(<Producto />)
    await waitFor(() => screen.getByTestId('selector-cantidad'))

    const btnIncrementar = screen.getByTestId('btn-incrementar')
    const btnDecrementar = screen.getByTestId('btn-decrementar')
    const cantidad = screen.getByTestId('cantidad-seleccionada')

    expect(cantidad).toHaveTextContent('1')
    fireEvent.click(btnIncrementar)
    expect(cantidad).toHaveTextContent('2')
    fireEvent.click(btnDecrementar)
    expect(cantidad).toHaveTextContent('1')
  })

  it('CA5b: la cantidad no baja de 1', async () => {
    renderWithProviders(<Producto />)
    await waitFor(() => screen.getByTestId('btn-decrementar'))

    fireEvent.click(screen.getByTestId('btn-decrementar'))
    expect(screen.getByTestId('cantidad-seleccionada')).toHaveTextContent('1')
  })

  it('CA6: el botón agregar al carrito está presente y habilitado', async () => {
    renderWithProviders(<Producto />)
    await waitFor(() => {
      const btn = screen.getByTestId('btn-agregar-carrito')
      expect(btn).toBeInTheDocument()
      expect(btn).not.toBeDisabled()
    })
  })

  it('CA7: el botón volver al catálogo está presente', async () => {
    renderWithProviders(<Producto />)
    await waitFor(() => {
      expect(screen.getByTestId('btn-volver')).toBeInTheDocument()
    })
  })

  it('CA8 (Loading): muestra skeleton loader mientras carga', () => {
    renderWithProviders(<Producto />)
    expect(screen.getByTestId('skeleton-loader')).toBeInTheDocument()
  })

  it('CA9 (Error): muestra error si la API falla', async () => {
    server.use(
      http.get('/api/productos/:id', () => {
        return new HttpResponse(null, { status: 500 })
      })
    )
    renderWithProviders(<Producto />)
    await waitFor(() => {
      expect(screen.getByTestId('error-producto')).toBeInTheDocument()
    })
  })

  it('CA10: muestra confirmación visual al agregar al carrito', async () => {
    renderWithProviders(<Producto />)
    await waitFor(() => screen.getByTestId('btn-agregar-carrito'))

    fireEvent.click(screen.getByTestId('btn-agregar-carrito'))
    expect(screen.getByTestId('confirmacion-agregado')).toBeInTheDocument()
  })

})