/* Raro Café · lógica de la tienda (navegador) */
(function () {
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var eur = function (n) { return n.toFixed(2).replace('.', ',') + ' €'; };
  var esc = function (t) { return String(t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var marca = document.querySelector('[data-pagina]');
  var pagina = marca ? marca.dataset.pagina : '';

  /* ---------- Menú móvil ---------- */
  var boton = $('.abrir-menu'), menu = $('.menu');
  if (boton) boton.addEventListener('click', function () {
    var abierto = menu.classList.toggle('abierto');
    boton.setAttribute('aria-expanded', abierto);
    boton.textContent = abierto ? 'Cerrar' : 'Menú';
  });

  /* ---------- Cesta (se guarda en este navegador) ---------- */
  var CLAVE = 'raro_cesta';
  function leerCesta() { try { return JSON.parse(localStorage.getItem(CLAVE)) || []; } catch (e) { return memoria; } }
  var memoria = [];
  function guardarCesta(c) { memoria = c; try { localStorage.setItem(CLAVE, JSON.stringify(c)); } catch (e) {} pintarContador(); }
  function pintarContador() {
    var n = leerCesta().reduce(function (a, l) { return a + l.cantidad; }, 0);
    $$('[data-contador]').forEach(function (e) { e.textContent = n; });
  }
  function anadir(slug, cantidad) {
    var c = leerCesta(), l = c.find(function (x) { return x.slug === slug; });
    if (l) l.cantidad = Math.min(10, l.cantidad + cantidad); else c.push({ slug: slug, cantidad: cantidad });
    guardarCesta(c);
  }
  pintarContador();

  function aviso(texto) {
    var t = $('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = texto; t.classList.add('ver');
    clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove('ver'); }, 2400);
  }

  /* ---------- Catálogo: primero el servidor, si no, el fichero ---------- */
  var catalogo = null;
  function cargarCatalogo() {
    if (catalogo) return Promise.resolve(catalogo);
    return fetch('api/productos').then(function (r) {
      if (!r.ok || !(r.headers.get('content-type') || '').includes('json')) throw new Error('sin api');
      return r.json();
    }).catch(function () {
      return fetch('data/productos.json').then(function (r) { return r.json(); });
    }).then(function (d) { catalogo = d; return d; });
  }

  /* ---------- Dibujos (bolsas y accesorios, estilo ceras) ---------- */
  var idSvg = 0;
  function bolsa(p) {
    var id = 'b' + (idSvg++);
    var serie = /^Raramente /.test(p.nombre);
    var palabra = serie ? p.nombre.replace(/^Raramente /, '') : p.nombre;
    var tam = palabra.length > 9 ? 20 : 25;
    return '<svg viewBox="0 0 200 260" role="img" aria-label="Bolsa de ' + esc(p.nombre) + '"><defs><linearGradient id="' + id + '" x1="0" x2="1"><stop offset="0" stop-color="#9a9692"/><stop offset=".25" stop-color="#ecebe8"/><stop offset=".5" stop-color="#b9b6b2"/><stop offset=".75" stop-color="#f1f0ed"/><stop offset="1" stop-color="#8e8a86"/></linearGradient></defs>' +
      '<path d="M28 22 L172 22 L176 246 Q100 254 24 246 Z" fill="url(#' + id + ')" stroke="#1a1714" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<path d="M28 22 L172 22 L172 34 L28 34 Z" fill="#c9c6c2" stroke="#1a1714" stroke-width="2"/>' +
      '<path d="M34 40 L42 240 M166 40 L160 240" stroke="#fff" stroke-opacity=".5" stroke-width="3"/>' +
      '<rect x="44" y="48" width="112" height="180" fill="#fbf6ec" stroke="#1a1714" stroke-width="1.5"/>' +
      '<text x="54" y="80" font-family="Covered By Your Grace,cursive" font-size="27" fill="#1a1714">RARO</text>' +
      '<text x="54" y="104" font-family="Covered By Your Grace,cursive" font-size="27" fill="#1a1714">CAFE</text>' +
      '<text x="140" y="74" text-anchor="middle" font-family="Covered By Your Grace,cursive" font-size="20" fill="#1a1714">✱</text>' +
      (serie ? '<text x="54" y="126" font-family="Covered By Your Grace,cursive" font-size="15" fill="#1a1714">RARAMENTE</text>' : '<text x="54" y="126" font-family="Covered By Your Grace,cursive" font-size="15" fill="#1a1714">EDICIÓN LIMITADA</text>') +
      '<text x="54" y="146" font-family="Covered By Your Grace,cursive" font-size="' + (tam - 2) + '" fill="#1a1714">' + esc(palabra.toUpperCase()) + '</text>' +
      '<path d="M54 152 q30 -4 56 0" stroke="#1a1714" stroke-width="2" fill="none" stroke-linecap="round"/>' +
      '<g filter="url(#cera)"><ellipse cx="100" cy="190" rx="38" ry="22" fill="' + p.sello + '" transform="rotate(-14 100 190)"/></g>' +
      (p.sello === '#17120f' ? '<text x="100" y="196" text-anchor="middle" font-family="Covered By Your Grace,cursive" font-size="18" fill="#fbf6ec">?!</text>' : '') +
      '<path d="M86 218 q5 -5 10 0 t10 0 t10 0" stroke="#1a1714" stroke-width="1.6" fill="none"/></svg>';
  }
  function accesorio(p) {
    var s = '<svg viewBox="0 0 200 200" role="img" aria-label="' + esc(p.nombre) + '">';
    var k = 'stroke="#1a1714" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"';
    if (p.slug.indexOf('taza') === 0) {
      s += '<g filter="url(#cera)"><ellipse cx="96" cy="112" rx="44" ry="40" fill="#f2d14b"/></g>' +
        '<path d="M50 62 C52 100 50 140 70 158 C86 168 110 168 124 158 C142 140 140 100 142 62 Z" fill="#fbf6ec" ' + k + '/>' +
        '<path d="M142 80 C170 76 172 124 140 120" fill="none" ' + k + ' stroke-width="7"/>' +
        '<ellipse cx="80" cy="98" rx="9" ry="7" fill="#1a1714"/><ellipse cx="110" cy="128" rx="11" ry="9" fill="#1a1714"/><circle cx="118" cy="84" r="5" fill="#1a1714"/><circle cx="72" cy="138" r="4" fill="#1a1714"/>' +
        '<path d="M84 46 q-8 -12 2 -22 M104 46 q-8 -12 2 -22" fill="none" ' + k + ' stroke-width="3"/>';
    } else if (p.slug.indexOf('tote') === 0) {
      s += '<g filter="url(#cera)"><rect x="56" y="104" width="90" height="54" fill="#f09ab9" transform="rotate(-6 100 130)"/></g>' +
        '<path d="M72 66 C72 26 128 26 128 66" fill="none" ' + k + ' stroke-width="6"/>' +
        '<path d="M40 64 L160 64 L154 182 L46 182 Z" fill="none" ' + k + '/>' +
        '<text x="100" y="118" text-anchor="middle" font-family="Covered By Your Grace,cursive" font-size="26" fill="#1a1714">BE</text>' +
        '<text x="100" y="146" text-anchor="middle" font-family="Covered By Your Grace,cursive" font-size="24" fill="#1a1714">CREARTIVE</text>' +
        '<text x="140" y="90" font-family="Covered By Your Grace,cursive" font-size="18" fill="#1a1714">✱</text>';
    } else {
      s += '<g filter="url(#cera)"><ellipse cx="100" cy="140" rx="42" ry="32" fill="#c8341f"/></g>' +
        '<path d="M70 100 L130 100 L144 182 L56 182 Z" fill="none" ' + k + '/>' +
        '<path d="M76 40 L124 40 L132 100 L68 100 Z" fill="#fbf6ec" ' + k + '/>' +
        '<path d="M124 52 L156 62 L146 74" fill="none" ' + k + ' stroke-width="5"/>' +
        '<path d="M70 114 L46 114 L46 152 L62 152" fill="none" ' + k + ' stroke-width="7"/>' +
        '<rect x="92" y="28" width="16" height="12" rx="3" fill="#1a1714"/>' +
        '<text x="92" y="80" font-family="Covered By Your Grace,cursive" font-size="20" fill="#1a1714">✱</text>';
    }
    return s + '</svg>';
  }
  function dibujo(p) {
    if (p.imagen) return '<img src="' + esc(p.imagen) + '" alt="' + esc(p.nombre) + '" loading="lazy">';
    return p.categoria === 'Cafés' ? bolsa(p) : accesorio(p);
  }

  function tarjeta(p) {
    var etiqueta = p.stock <= 0 ? '<span class="etiqueta roja">Agotado</span>' :
      p.stock <= 12 ? '<span class="etiqueta roja">Últimas unidades</span>' :
      p.destacado ? '<span class="etiqueta">Favorito</span>' : '';
    return '<a class="tarjeta" href="producto.html?p=' + encodeURIComponent(p.slug) + '">' +
      '<div class="foto" style="--tono:' + p.sello + '">' + etiqueta + dibujo(p) + '</div>' +
      '<div class="texto"><h3>' + esc(p.nombre) + '</h3><span class="notas">' + esc(p.notas) + '</span>' +
      '<div class="pie"><span class="precio">' + eur(p.precio) + '</span>' +
      (p.stock > 0 ? '<button class="mas" type="button" data-anadir="' + esc(p.slug) + '" aria-label="Añadir ' + esc(p.nombre) + ' a la cesta">Añadir</button>' : '') +
      '</div></div></a>';
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-anadir]');
    if (!b) return;
    e.preventDefault();
    anadir(b.dataset.anadir, 1);
    aviso('Añadido a tu cesta');
  });

  /* ---------- Inicio ---------- */
  if (pagina === 'inicio') {
    cargarCatalogo().then(function (d) {
      $('#destacados').innerHTML = d.productos.filter(function (p) { return p.destacado; }).slice(0, 4).map(tarjeta).join('');
      $$('[data-dibujo]').forEach(function (el) {
        var p = d.productos.find(function (x) { return x.slug === el.dataset.dibujo; });
        if (p) el.innerHTML = dibujo(p);
      });
    });
  }

  /* ---------- Tienda ---------- */
  if (pagina === 'tienda') {
    var estado = { cat: new URLSearchParams(location.search).get('cat') || 'Todos', q: '', orden: 'destacados' };
    var pintar = function () {
      var lista = catalogo.productos.filter(function (p) {
        return (estado.cat === 'Todos' || p.categoria === estado.cat) &&
          (p.nombre + ' ' + p.notas).toLowerCase().indexOf(estado.q.toLowerCase()) !== -1;
      });
      if (estado.orden === 'barato') lista.sort(function (a, b) { return a.precio - b.precio; });
      if (estado.orden === 'caro') lista.sort(function (a, b) { return b.precio - a.precio; });
      if (estado.orden === 'destacados') lista.sort(function (a, b) { return (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0); });
      $('#productos').innerHTML = lista.length ? lista.map(tarjeta).join('') : '';
      $('#sin-resultados').hidden = lista.length > 0;
      $('#cuantos').textContent = lista.length + (lista.length === 1 ? ' producto' : ' productos');
      $$('[data-cat]').forEach(function (c) { c.setAttribute('aria-pressed', c.dataset.cat === estado.cat); });
    };
    cargarCatalogo().then(function () {
      var cats = ['Todos'].concat(catalogo.productos.map(function (p) { return p.categoria; }).filter(function (v, i, a) { return a.indexOf(v) === i; }));
      $('#categorias').innerHTML = cats.map(function (c) { return '<button class="chip" type="button" data-cat="' + esc(c) + '">' + esc(c) + '</button>'; }).join('');
      $('#categorias').addEventListener('click', function (e) { var c = e.target.closest('[data-cat]'); if (c) { estado.cat = c.dataset.cat; pintar(); } });
      $('#buscar').addEventListener('input', function (e) { estado.q = e.target.value; pintar(); });
      $('#orden').addEventListener('change', function (e) { estado.orden = e.target.value; pintar(); });
      pintar();
    });
  }

  /* ---------- Ficha de producto ---------- */
  if (pagina === 'producto') {
    var slug = new URLSearchParams(location.search).get('p');
    cargarCatalogo().then(function (d) {
      var p = d.productos.find(function (x) { return x.slug === slug; });
      if (!p) { $('#ficha').innerHTML = '<div class="vacio"><h2>Este producto no existe</h2><a class="btn" href="tienda.html">Volver a la tienda</a></div>'; return; }
      document.title = p.nombre + ' · Raro Café';
      var meta = $('meta[name="description"]'); if (meta) meta.content = p.nombre + ': ' + p.notas + '. ' + p.descripcion;
      var filas = [['Notas de cata', p.notas], ['Origen', p.origen], ['Altitud', p.altitud], ['Variedad', p.variedad], ['Proceso', p.proceso], ['Tueste', p.tueste], ['Grado', p.grado], ['Formato', p.formato]].filter(function (f) { return f[1]; });
      $('#ficha').innerHTML =
        '<div class="foto" style="--tono:' + p.sello + '">' + dibujo(p) + '</div>' +
        '<div><p class="antetitulo">' + esc(p.categoria) + '</p><h1>' + esc(p.nombre) + '</h1>' +
        '<p class="precio">' + eur(p.precio) + '</p><p class="desc">' + esc(p.descripcion) + '</p>' +
        (p.ideal ? '<span class="ideal">Ideal para: ' + esc(p.ideal) + '</span>' : '') +
        '<dl class="datos">' + filas.map(function (f) { return '<dt>' + f[0] + '</dt><dd>' + esc(f[1]) + '</dd>'; }).join('') + '</dl>' +
        (p.stock > 0 ?
          '<div class="comprar"><div class="cantidad"><button type="button" data-paso="-1" aria-label="Quitar uno">−</button><input id="cant" type="number" min="1" max="10" value="1" aria-label="Cantidad"><button type="button" data-paso="1" aria-label="Añadir uno">+</button></div>' +
          '<button class="btn" type="button" id="al-carro">Añadir a la cesta</button></div>' +
          (p.stock <= 12 ? '<p class="aviso">¡Solo quedan ' + p.stock + '!</p>' : '')
          : '<p class="error">Agotado por ahora.</p>') +
        '</div>';
      $('#miga-nombre').textContent = p.nombre;
      var cant = $('#cant');
      $$('[data-paso]').forEach(function (b) { b.addEventListener('click', function () { cant.value = Math.max(1, Math.min(10, (+cant.value || 1) + (+b.dataset.paso))); }); });
      var al = $('#al-carro');
      if (al) al.addEventListener('click', function () { anadir(p.slug, Math.max(1, Math.min(10, +cant.value || 1))); aviso('Añadido a tu cesta'); });
      $('#relacionados').innerHTML = d.productos.filter(function (x) { return x.slug !== p.slug && x.categoria === p.categoria; }).slice(0, 4).map(tarjeta).join('');
    });
  }

  /* ---------- Cesta y pedido ---------- */
  if (pagina === 'cesta') {
    var form = $('#pedido');
    var entrega = function () { var r = $('input[name="entrega"]:checked'); return r ? r.value : 'recogida'; };
    var pintarCesta = function () {
      var c = leerCesta();
      var r = RaroCalc.calcularPedido(catalogo, c, entrega());
      $('#vacia').hidden = c.length > 0;
      $('#llena').hidden = c.length === 0;
      $('#lineas').innerHTML = r.lineas.map(function (l) {
        var p = catalogo.productos.find(function (x) { return x.slug === l.slug; });
        return '<div class="linea"><div class="mini" style="--tono:' + p.sello + '">' + dibujo(p) + '</div>' +
          '<div><h3>' + esc(p.nombre) + '</h3><div class="cantidad"><button type="button" data-cambia="' + esc(p.slug) + '" data-paso="-1" aria-label="Quitar uno">−</button><input value="' + l.cantidad + '" readonly aria-label="Cantidad"><button type="button" data-cambia="' + esc(p.slug) + '" data-paso="1" aria-label="Añadir uno">+</button></div>' +
          '<button class="quitar" type="button" data-quita="' + esc(p.slug) + '">Quitar</button></div>' +
          '<b>' + eur(l.total) + '</b></div>';
      }).join('');
      $('#subtotal').textContent = eur(r.subtotal);
      $('#envio').textContent = entrega() === 'recogida' ? 'Gratis (recoges en tienda)' : r.envio === 0 ? 'Gratis' : eur(r.envio);
      $('#total').textContent = eur(r.total);
      $('#falta').hidden = !r.faltaParaEnvioGratis;
      $('#falta').textContent = 'Te faltan ' + eur(r.faltaParaEnvioGratis) + ' para el envío gratis.';
      $('#errores-cesta').innerHTML = r.errores.length && c.length ? '<p class="error">' + r.errores.map(esc).join('<br>') + '</p>' : '';
    };
    cargarCatalogo().then(function () {
      pintarCesta();
      $('#lineas').addEventListener('click', function (e) {
        var c = leerCesta(), b;
        if ((b = e.target.closest('[data-cambia]'))) {
          var l = c.find(function (x) { return x.slug === b.dataset.cambia; });
          l.cantidad = Math.max(1, Math.min(10, l.cantidad + (+b.dataset.paso)));
        } else if ((b = e.target.closest('[data-quita]'))) {
          c = c.filter(function (x) { return x.slug !== b.dataset.quita; });
        } else return;
        guardarCesta(c); pintarCesta();
      });
      $$('input[name="entrega"]').forEach(function (r) { r.addEventListener('change', pintarCesta); });
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var boton = $('#hacer-pedido');
        boton.disabled = true; boton.textContent = 'Enviando…';
        var datos = { lineas: leerCesta(), entrega: entrega(), cliente: { nombre: form.nombre.value, email: form.email.value } };
        fetch('api/pedido', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datos) })
          .then(function (r) {
            if (!(r.headers.get('content-type') || '').includes('json')) throw new Error('sin api');
            return r.json();
          })
          .catch(function () {
            // Vista previa sin servidor: se calcula aquí mismo.
            var r = RaroCalc.calcularPedido(catalogo, datos.lineas, datos.entrega);
            return r.ok ? Object.assign({ pedido: RaroCalc.numeroPedido(), nombre: datos.cliente.nombre.split(' ')[0], calculadoEn: 'navegador' }, r) : r;
          })
          .then(function (r) {
            boton.disabled = false; boton.textContent = 'Hacer pedido';
            if (!r.ok) { $('#errores-form').innerHTML = '<p class="error">' + r.errores.map(esc).join('<br>') + '</p>'; return; }
            guardarCesta([]);
            $('#llena').hidden = true;
            $('#hecho').hidden = false;
            $('#num-pedido').textContent = r.pedido;
            $('#hecho-nombre').textContent = r.nombre;
            $('#hecho-total').textContent = eur(r.total);
            $('#hecho-entrega').textContent = r.entrega === 'envio' || datos.entrega === 'envio' ? 'Te lo mandamos a casa.' : 'Te esperamos en la tienda para recogerlo.';
            $('#hecho-donde').textContent = r.calculadoEn === 'servidor' ? 'Total calculado en el servidor de Vercel.' : 'Vista previa: total calculado en tu navegador.';
            scrollTo(0, 0);
          });
      });
    });
  }
})();
