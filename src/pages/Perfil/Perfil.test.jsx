import { describe, it, expect } from 'vitest'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '../../test/mocks/server'
import { renderWithProviders } from '../../test/utils/renderWithProviders'
import Perfil from './index'

describe('HU-06 · Gestión de perfil', () => {

  it('CA1: muestra los datos del perfil al cargar', async () => {
    renderWithProviders(<Perfil />)
    await waitFor(() => {
      expect(screen.getByTestId('perfil-nombre')).toBeInTheDocument()
      expect(screen.getByTestId('perfil-correo')).toBeInTheDocument()
    })
  })

  it('CA2: muestra botón editar perfil', async () => {
    renderWithProviders(<Perfil />)
    await waitFor(() => {
      expect(screen.getByTestId('btn-editar')).toBeInTheDocument()
    })
  })

  it('CA3: al hacer clic en editar muestra el formulario de edición', async () => {
    renderWithProviders(<Perfil />)
    await waitFor(() => screen.getByTestId('btn-editar'))
    fireEvent.click(screen.getByTestId('btn-editar'))
    expect(screen.getByTestId('form-edicion')).toBeInTheDocument()
    expect(screen.getByTestId('input-nombre')).toBeInTheDocument()
    expect(screen.getByTestId('input-correo')).toBeInTheDocument()
  })

  it('CA4: muestra botones guardar y cancelar en modo edición', async () => {
    renderWithProviders(<Perfil />)
    await waitFor(() => screen.getByTestId('btn-editar'))
    fireEvent.click(screen.getByTestId('btn-editar'))
    expect(screen.getByTestId('btn-guardar')).toBeInTheDocument()
    expect(screen.getByTestId('btn-cancelar')).toBeInTheDocument()
  })

  it('CA5: cancelar edición vuelve a la vista de perfil', async () => {
    renderWithProviders(<Perfil />)
    await waitFor(() => screen.getByTestId('btn-editar'))
    fireEvent.click(screen.getByTestId('btn-editar'))
    fireEvent.click(screen.getByTestId('btn-cancelar'))
    expect(screen.getByTestId('vista-perfil')).toBeInTheDocument()
  })

  it('CA5b: muestra error si nombre está vacío al guardar', async () => {
    renderWithProviders(<Perfil />)
    await waitFor(() => screen.getByTestId('btn-editar'))
    fireEvent.click(screen.getByTestId('btn-editar'))
    fireEvent.change(screen.getByTestId('input-nombre'), { target: { value: '' } })
    fireEvent.click(screen.getByTestId('btn-guardar'))
    expect(screen.getByTestId('error-nombre')).toBeInTheDocument()
  })

  it('CA6: guarda los cambios correctamente y muestra confirmación', async () => {
    renderWithProviders(<Perfil />)
    await waitFor(() => screen.getByTestId('btn-editar'))
    fireEvent.click(screen.getByTestId('btn-editar'))
    fireEvent.change(screen.getByTestId('input-nombre'), { target: { value: 'Diego Editado' } })
    fireEvent.click(screen.getByTestId('btn-guardar'))
    await waitFor(() => {
      expect(screen.getByTestId('guardado-exitoso')).toBeInTheDocument()
    })
  })

  it('CA7 (Loading): muestra skeleton loader mientras carga', () => {
    renderWithProviders(<Perfil />)
    expect(screen.getByTestId('skeleton-loader')).toBeInTheDocument()
  })

  it('CA8 (Error): muestra error si la API falla al cargar', async () => {
    server.use(
      http.get('/api/perfil', () => {
        return new HttpResponse(null, { status: 500 })
      })
    )
    renderWithProviders(<Perfil />)
    await waitFor(() => {
      expect(screen.getByTestId('error-perfil')).toBeInTheDocument()
    })
  })

})