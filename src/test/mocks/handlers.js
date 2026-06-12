import { http, HttpResponse } from 'msw'

export const handlers = [
  // HU-01, 02, 03 — Productos
  http.get('/api/productos', () => {
  return HttpResponse.json([
    { id: 1, nombre: 'Laptop Gamer', precio: 899990, categoria: 'Computación', marca: 'ASUS', stock: 10, destacado: true },
    { id: 2, nombre: 'Mouse Inalámbrico', precio: 24990, categoria: 'Periféricos', marca: 'Logitech', stock: 25, destacado: true },
    { id: 3, nombre: 'Monitor 27"', precio: 349990, categoria: 'Monitores', marca: 'Samsung', stock: 5, destacado: true },
    { id: 4, nombre: 'Teclado Mecánico', precio: 79990, categoria: 'Periféricos', marca: 'Redragon', stock: 15, destacado: false },
    { id: 5, nombre: 'SSD 1TB', precio: 89990, categoria: 'Almacenamiento', marca: 'Kingston', stock: 30, destacado: false },
    { id: 6, nombre: 'Audífonos Gamer', precio: 59990, categoria: 'Audio', marca: 'HyperX', stock: 20, destacado: true },
    { id: 7, nombre: 'Webcam HD', precio: 44990, categoria: 'Periféricos', marca: 'Logitech', stock: 8, destacado: true },
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

  http.get('/api/pedidos', () => {
  return HttpResponse.json([
    { id: 1, cliente: 'Diego Tatin', total: 924980, estado: 'Pendiente' },
    { id: 2, cliente: 'María López', total: 349990, estado: 'En Preparación' },
    { id: 3, cliente: 'Carlos Pérez', total: 89990, estado: 'Entregado' },
  ])
  }),

  http.put('/api/pedidos/:id', () => {
    return HttpResponse.json({ success: true })
  }),
  
  http.get('/api/admin/dashboard', () => {
  return HttpResponse.json({
    ventasTotales: 15234990,
    totalPedidos: 142,
    usuariosNuevos: 38,
    ticketPromedio: 107288,
    productosMasVendidos: [
      { id: 1, nombre: 'Laptop Gamer', ventas: 45 },
      { id: 2, nombre: 'Mouse Inalámbrico', ventas: 38 },
      { id: 3, nombre: 'Monitor 27"', ventas: 27 },
    ],
    pedidosRecientes: [
      { id: 101, cliente: 'Diego Tatin', estado: 'Pendiente' },
      { id: 102, cliente: 'María López', estado: 'En Preparación' },
      { id: 103, cliente: 'Carlos Pérez', estado: 'Entregado' },
    ],
    })
   }),

  http.put('/api/productos/:id/stock', () => {
  return HttpResponse.json({ success: true })
   }),
   
   http.post('/api/auth/recuperar-password', () => {
  return HttpResponse.json({ success: true })
  }),

   http.put('/api/productos/:id/destacado', () => {
  return HttpResponse.json({ success: true })
  }),

http.put('/api/productos/:id/oferta', () => {
  return HttpResponse.json({ success: true })
  }),

  http.post('/api/auth/admin/login', () => {
  return HttpResponse.json({ token: 'fake-admin-token', rol: 'admin' })
  }),
]