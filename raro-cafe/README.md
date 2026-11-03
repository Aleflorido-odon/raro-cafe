# Raro Café · tienda online

*Sé raro, toma buen café.*

Tienda de Raro Café para la asignatura de Digital Marketing. Web hecha con IA (asistente de código, diapositiva 34 del taller), subida a GitHub y publicada en Vercel con HTTPS.

## Qué hay en cada carpeta

| Carpeta / archivo | Qué es |
|---|---|
| `index.html`, `tienda.html`, `producto.html`, `cesta.html`, `nosotros.html`, `contacto.html`, `legal.html` | Las páginas de la web |
| `data/productos.json` | **Los productos.** Nombre, precio, notas, origen, stock, foto… Cambia aquí y cambia toda la tienda |
| `api/productos.js` | Función del servidor: devuelve el catálogo en cada visita |
| `api/pedido.js` | Función del servidor: recibe la cesta, comprueba stock y calcula el total y el envío |
| `assets/css/style.css` | Colores, letras y estilos (los colores están arriba del todo) |
| `assets/img/` | Fotos, el garabato del logo y el icono |
| `assets/fonts/` | Las letras, alojadas en la propia web (sin Google Fonts, mejor para el RGPD) |

## Por qué es una web dinámica

Cada vez que alguien abre la tienda, el navegador pide los productos a `/api/productos` y Vercel ejecuta un programa para responder. Al hacer un pedido, `/api/pedido` vuelve a calcular precios, stock y envío en el servidor (nunca se fía del precio que manda el navegador) y devuelve un número de pedido. La cesta cambia según cada visitante y se guarda en su navegador.

No hay base de datos ni pagos reales: es un proyecto de clase. Para cobrar de verdad haría falta Stripe o Snipcart y un plan comercial (Vercel Hobby es solo para uso personal y no comercial).

## Cambiar productos y fotos

1. Abre `data/productos.json` con cualquier editor de texto (o en GitHub, botón del lápiz).
2. Cambia lo que quieras: `nombre`, `precio` (con punto: `12.5`), `notas`, `descripcion`, `stock`…
3. Para poner una foto: súbela a `assets/img/` (mejor cuadrada, JPG de menos de 300 KB) y escribe su ruta en `"imagen"`, por ejemplo `"assets/img/raramente-dulce.jpg"`. Si `imagen` está vacío, se dibuja la bolsa automáticamente con el color de `sello`.
4. Guarda, haz commit y push. Vercel publica solo en unos segundos.

## Vídeo de la portada

Guarda tu vídeo como `assets/video/cafe.mp4` (5-10 segundos, sin sonido, horizontal, menos de 6 MB). Se reproduce solo, en bucle y de fondo. Mientras no esté, se ve la foto de la portada.

## Publicar en Vercel (gratis, con HTTPS)

1. **GitHub Desktop** → File → Add local repository → elige esta carpeta → «create a repository» → Publish repository (puede ser privado).
2. **vercel.com** → entra con GitHub → Add New → Project → importa `raro-cafe`.
3. Framework Preset: **Other**. No toques nada más. Pulsa **Deploy**.
4. Te da una URL tipo `raro-cafe-xxxx.vercel.app` con candado HTTPS. Para cambiar el nombre: Settings → Domains → edita el `.vercel.app`.
5. Prueba: abre la web, añade algo a la cesta y haz un pedido. Debe decir «Total calculado en el servidor de Vercel».

## Ficha de entrega (borrador)

| Apartado | Respuesta |
|---|---|
| Dominio | `[tu-proyecto].vercel.app`, subdominio gratuito; el titular de `vercel.app` es Vercel |
| Hosting | Vercel, plan Hobby: sirve los HTML desde su red global (CDN) y ejecuta las funciones de `/api` en su servidor |
| SSL | Certificado automático de Vercel (Let's Encrypt); comprobado con el candado del navegador |
| Cómo lo hice | Asistente de código con IA para el código, GitHub Desktop para subirlo y Vercel para publicarlo |
| Qué falló | *[un error real que te pase y cómo lo resolviste]* |
| Qué aprendí | *[qué harías distinto]* |

## Antes de entregar

- [ ] La URL abre sin errores y tiene candado HTTPS
- [ ] Se ve bien en el móvil
- [ ] Todos los enlaces y fotos funcionan
- [ ] El pedido de prueba dice «calculado en el servidor de Vercel»
- [ ] Has cambiado lo marcado en amarillo: dirección (contacto) y titular (aviso legal)
- [ ] Capturas del candado y del panel de Vercel
