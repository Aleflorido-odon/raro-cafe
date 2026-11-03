/* Raro Café · reglas de la tienda.
   Lo usan a la vez el servidor (api/pedido.js) y el navegador.
   El servidor SIEMPRE recalcula: nunca se fía del precio que manda el navegador. */
(function (root) {
  function redondear(n) { return Math.round(n * 100) / 100; }

  function calcularPedido(catalogo, lineas, entrega, codigo) {
    var errores = [];
    var detalle = [];
    var subtotal = 0;
    if (!Array.isArray(lineas) || lineas.length === 0) {
      errores.push('La cesta está vacía.');
    } else {
      lineas.forEach(function (l) {
        var p = catalogo.productos.find(function (x) { return x.slug === l.slug; });
        var cantidad = parseInt(l.cantidad, 10);
        if (!p) { errores.push('Hay un producto que ya no existe.'); return; }
        if (!(cantidad >= 1 && cantidad <= 10)) { errores.push('Cantidad no válida en ' + p.nombre + '.'); return; }
        if (cantidad > p.stock) { errores.push('Solo quedan ' + p.stock + ' de ' + p.nombre + '.'); return; }
        var total = redondear(p.precio * cantidad);
        subtotal = redondear(subtotal + total);
        detalle.push({ slug: p.slug, nombre: p.nombre, precio: p.precio, cantidad: cantidad, total: total });
      });
    }
    var t = catalogo.tienda;
    var envio = 0;
    if (entrega === 'envio') envio = subtotal >= t.envioGratisDesde ? 0 : t.envio;
    var cod = String(codigo || '').trim().toUpperCase();
    var codigoValido = !!cod && cod === String(t.codigoBienvenida || '').toUpperCase();
    if (cod && !codigoValido) errores.push('El código ' + cod + ' no existe. Prueba con ' + t.codigoBienvenida + '.');
    var descuento = codigoValido ? redondear(subtotal * (t.descuentoBienvenida || 0)) : 0;
    return {
      ok: errores.length === 0,
      errores: errores,
      lineas: detalle,
      subtotal: subtotal,
      envio: envio,
      codigo: codigoValido ? cod : '',
      descuento: descuento,
      total: redondear(subtotal - descuento + envio),
      faltaParaEnvioGratis: entrega === 'envio' && subtotal < t.envioGratisDesde ? redondear(t.envioGratisDesde - subtotal) : 0
    };
  }

  function numeroPedido(fecha) {
    var d = fecha || new Date();
    var f = String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
    var aleatorio = Math.random().toString(36).slice(2, 6).toUpperCase();
    return 'RC-' + f + '-' + aleatorio;
  }

  var api = { calcularPedido: calcularPedido, numeroPedido: numeroPedido, redondear: redondear };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.RaroCalc = api;
})(this);
