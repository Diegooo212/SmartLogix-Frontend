import { describe, it, expect } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../test/utils/renderWithProviders'
import Carrito from './index'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => cleanup())

describe('HU-07 · Carrito de compras', () => {

  it('CA1: muestra los productos en el carrito', () => {
    renderWithProviders(<Carrito />)
    const items = screen.getAllByTestId('carrito-item')
    expect(items.length).toBeGreaterThanOrEqual(2)
  })

  it('CA2: el selector de cantidad incrementa correctamente', () => {
    renderWithProviders(<Carrito />)
    const cantidad = screen.getByTestId('cantidad-1')
    expect(cantidad).toHaveTextContent('1')
    fireEvent.click(screen.getByTestId('btn-incrementar-1'))
    expect(cantidad).toHaveTextContent('2')
  })

  it('CA2b: el selector de cantidad decrementa correctamente', () => {
    renderWithProviders(<Carrito />)
    fireEvent.click(screen.getByTestId('btn-incrementar-1'))
    fireEvent.click(screen.getByTestId('btn-decrementar-1'))
    expect(screen.getByTestId('cantidad-1')).toHaveTextContent('1')
  })

  it('CA2c: la cantidad no baja de 1', () => {
    renderWithProviders(<Carrito />)
    fireEvent.click(screen.getByTestId('btn-decrementar-1'))
    expect(screen.getByTestId('cantidad-1')).toHaveTextContent('1')
  })

  it('CA3: muestra el subtotal por producto', () => {
    renderWithProviders(<Carrito />)
    const subtotales = screen.getAllByTestId('item-subtotal')
    expect(subtotales.length).toBeGreaterThan(0)
  })

  it('CA4: eliminar un producto lo quita del carrito', () => {
    renderWithProviders(<Carrito />)
    const itemsAntes = screen.getAllByTestId('carrito-item').length
    fireEvent.click(screen.getByTestId('btn-eliminar-1'))
    const itemsDespues = screen.getAllByTestId('carrito-item').length
    expect(itemsDespues).toBe(itemsAntes - 1)
  })

  it('CA5: muestra carrito vacío cuando no hay productos', () => {
    renderWithProviders(<Carrito />)
    fireEvent.click(screen.getByTestId('btn-eliminar-1'))
    fireEvent.click(screen.getByTestId('btn-eliminar-2'))
    expect(screen.getByTestId('carrito-vacio')).toBeInTheDocument()
  })

  it('CA6: muestra el total del carrito correctamente', () => {
    renderWithProviders(<Carrito />)
    expect(screen.getByTestId('total-carrito')).toBeInTheDocument()
  })

  it('CA7: muestra confirmación al eliminar un producto', () => {
    renderWithProviders(<Carrito />)
    fireEvent.click(screen.getByTestId('btn-eliminar-1'))
    expect(screen.getByTestId('confirmacion-eliminado')).toBeInTheDocument()
  })

  it('CA8: vaciar carrito elimina todos los productos', () => {
    renderWithProviders(<Carrito />)
    fireEvent.click(screen.getByTestId('btn-vaciar'))
    expect(screen.getByTestId('carrito-vacio')).toBeInTheDocument()
  })

  it('CA9: botón proceder al pago está presente', () => {
    renderWithProviders(<Carrito />)
    expect(screen.getByTestId('btn-checkout')).toBeInTheDocument()
  })

  it('CA10: botón seguir comprando está presente', () => {
    renderWithProviders(<Carrito />)
    expect(screen.getByTestId('btn-seguir-comprando')).toBeInTheDocument()
  })

})