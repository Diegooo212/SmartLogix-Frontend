import { http, HttpResponse } from 'msw'

export const handlers = [
  // HU-01, 02, 03 — Productos
  http.get('/api/productos', () => {
    return HttpResponse.json([
      { id: 1, nombre: 'Laptop Gamer', precio: 899990, categoria: 'Computación', marca: 'ASUS', stock: 10 },
      { id: 2, nombre: 'Mouse Inalámbrico', precio: 24990, categoria: 'Periféricos', marca: 'Logitech', stock: 25 },
      { id: 3, nombre: 'Monitor 27"', precio: 349990, categoria: 'Monitores', marca: 'Samsung', stock: 5 },
      { id: 4, nombre: 'Teclado Mecánico', precio: 79990, categoria: 'Periféricos', marca: 'Redragon', stock: 15 },
      { id: 5, nombre: 'SSD 1TB', precio: 89990, categoria: 'Almacenamiento', marca: 'Kingston', stock: 30 },
    ])
  }),

  http.get('/api/productos/:id', ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      nombre: 'Laptop Gamer',
      precio: 899990,
      categoria: 'Computación',
      marca: 'ASUS',
      stock: 10,
      descripcion: 'Laptop de alto rendimiento',
      descuento: 10,
    })
  }),

  // HU-04, 05 — Auth
  http.post('/api/auth/register', () => {
    return HttpResponse.json({ token: 'fake-token', usuario: { nombre: 'Diego', correo: 'diego@test.cl' } })
  }),

  http.post('/api/auth/login', () => {
    return HttpResponse.json({ token: 'fake-token', usuario: { nombre: 'Diego', correo: 'diego@test.cl' } })
  }),

  // HU-06 — Perfil
  http.get('/api/perfil', () => {
    return HttpResponse.json({ nombre: 'Diego', apellido: 'Tatin', correo: 'diego@test.cl', telefono: '+56912345678' })
  }),

  http.put('/api/perfil', () => {
    return HttpResponse.json({ success: true })
  }),
  
  http.post('/api/checkout', () => {
  return HttpResponse.json({ numeroPedido: '12345' })
  }),
  http.post('/api/productos', () => {
  return HttpResponse.json({ id: 6, nombre: 'Nuevo Producto', precio: 99990, categoria: 'Test', marca: 'Test', stock: 10 })
  }),

  http.put('/api/productos/:id', () => {
    return HttpResponse.json({ id: 1, nombre: 'Laptop Gamer Editado', precio: 899990, categoria: 'Computación', marca: 'ASUS', stock: 10 })
  }),

  http.delete('/api/productos/:id', () => {
    return HttpResponse.json({ success: true })
  }),
]