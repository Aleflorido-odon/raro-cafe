// POST /api/pedido
// Recibe la cesta, comprueba stock y vuelve a calcular precios y envío en el servidor.
// Es un proyecto de clase: no cobra ni guarda datos. Para pagos reales haría falta
// Stripe, Snipcart o similar, y un plan comercial (Vercel Hobby es solo uso personal).
const catalogo = require('../data/productos.json');
const { calcularPedido, numeroPedido } = require('../assets/js/calculo.js');

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, errores: ['Usa POST'] });
  }
  let body = req.body || {};
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  const { lineas, entrega, cliente } = body;
  const errores = [];
  if (!cliente || !String(cliente.nombre || '').trim()) errores.push('Falta tu nombre.');
  if (!cliente || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(cliente.email || ''))) errores.push('El email no es válido.');
  if (!['recogida', 'envio'].includes(entrega)) errores.push('Elige recogida o envío.');

  const r = calcularPedido(catalogo, lineas, entrega);
  const todos = errores.concat(r.errores);
  if (todos.length) return res.status(400).json({ ok: false, errores: todos });

  res.status(200).json({
    ok: true,
    pedido: numeroPedido(),
    nombre: String(cliente.nombre).trim().split(' ')[0],
    entrega,
    lineas: r.lineas,
    subtotal: r.subtotal,
    envio: r.envio,
    total: r.total,
    calculadoEn: 'servidor',
    fecha: new Date().toISOString()
  });
};
