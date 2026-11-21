# Portfolio de Administración de Sistemas

Sitio estático multipágina sin frameworks. La portada está en `index.html`, el catálogo en `proyectos.html` y las fichas en `en-proceso.html` y `terminados.html`. Las cuatro páginas de la raíz comparten `styles.css` y `app.js`. La terminal simula comandos en el navegador. El inspector SVG muestra la documentación de cada nodo. La actividad de GitHub consulta eventos públicos y usa una caché de sesión.

## Seguridad y validación

La terminal, el inspector y la actividad insertan texto mediante `textContent`. Los enlaces externos que abren otra pestaña incluyen `noopener noreferrer`. Cloudflare Pages aplica las cabeceras de `_headers`, incluida la CSP que limita scripts al sitio, fuentes a Google Fonts y conexiones externas a la API pública de GitHub.

GitHub Actions ejecuta Nu Html Checker en cada push con permisos de lectura. También comprueba archivos, anclas y recursos internos, y rechaza scripts, estilos y manejadores de eventos en línea. Para validar la plantilla, el workflow reconoce los marcadores de URL previstos y los sustituye únicamente en copias temporales. Para probar en local, ejecuta `python3 -m http.server 8000` en la raíz y abre `http://localhost:8000`. Ese servidor básico no aplica `_headers`.

## Cloudflare Pages

1. Completa los marcadores del sitio, incluidos el usuario público de GitHub, las URLs, el favicon y el contacto de seguridad. Usa URLs HTTPS en los enlaces externos y un correo válido en `.well-known/security.txt`.
2. Conecta el repositorio a Cloudflare Pages. Selecciona la rama de producción, el preset **None**, deja vacío el comando de compilación y usa `.` como directorio de salida.
3. Comprueba las cabeceras HTTP del despliegue y que `/.well-known/security.txt` sea accesible por HTTPS y se sirva como texto plano UTF-8. Renueva su fecha de expiración antes del vencimiento conforme al RFC 9116.
