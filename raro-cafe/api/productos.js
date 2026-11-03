// GET /api/productos  → catálogo completo
// GET /api/productos?categoria=Cafés  → filtrado
// GET /api/productos?slug=citrico     → un producto
// Esta función se ejecuta en el servidor de Vercel en cada petición: es la parte dinámica de la web.
const catalogo = require('../data/productos.json');

module.exports = (req, res) => {
  const { slug, categoria, q } = req.query || {};
  let lista = catalogo.productos;

  if (slug) {
    const p = lista.find((x) => x.slug === slug);
    if (!p) return res.status(404).json({ error: 'Producto no encontrado' });
    return res.status(200).json({ tienda: catalogo.tienda, producto: p, generado: new Date().toISOString() });
  }
  if (categoria) lista = lista.filter((x) => x.categoria === categoria);
  if (q) {
    const t = String(q).toLowerCase();
    lista = lista.filter((x) => (x.nombre + ' ' + x.notas).toLowerCase().includes(t));
  }

  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ tienda: catalogo.tienda, productos: lista, generado: new Date().toISOString() });
};
