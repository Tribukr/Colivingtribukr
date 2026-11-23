# TribuKR Coliving — página web

Página estática (HTML + CSS + JS), sin instalaciones. Se sube tal cual a GitHub y a Hostinger.

## Estructura
```
index.html                 → página de la marca (todas las sedes)
capitolio/index.html       → página del Coliving Capitolio
assets/css/styles.css      → estilos y colores
assets/js/config.js        → WhatsApp, hoja de Google, enlaces de Airbnb  ← lo más común de cambiar
assets/js/data-capitolio.js→ habitaciones (precio, baño, fotos)
assets/js/site.js          → animaciones compartidas
assets/js/capitolio.js     → habitaciones, filtros, galería, disponibilidad
img/capitolio/full|thumb   → fotos optimizadas (WebP)
```

## Cambiar disponibilidad (sin tocar código)
Se hace en la hoja **"TribuKR - Disponibilidad habitaciones"** de Google Drive, pestaña **Capitolio**:
- Columna **Estado**: escoger *Disponible* u *Ocupada*.
- Columna **Precio**: cambiar el valor si sube o baja.
- Columna **Enlace Airbnb**: pegar el enlace si la habitación está publicada.

La página lee la hoja cada vez que alguien la abre. La hoja debe estar compartida como
*"Cualquier persona con el enlace — Lector"*; si no, la página usa los datos de `data-capitolio.js`.

## Legal (completar antes de publicar)
En `assets/js/config.js` → `legal` llenar: **razón social, NIT o cédula y correo**. (RNT no aplica: las estadías son de un mes o más.)
Se reflejan solos en el pie de página y en las páginas de `legal/`:
- `legal/privacidad.html` — Política de tratamiento de datos (Ley 1581 de 2012)
- `legal/terminos.html` — Términos y condiciones (Ley 1480 de 2011, aviso ESCNNA Ley 679/2001 y 1336/2009)
- `legal/cookies.html` — Política de cookies (el mapa de Google solo carga con consentimiento)

Mientras no estén llenos, se ven marcados en rojo como `[razón social]`. Recomendado: que un abogado revise los textos.

## Agregar una sede nueva
1. Copiar la carpeta `capitolio/` con el nombre de la sede y sus fotos en `img/<sede>/`.
2. Crear `assets/js/data-<sede>.js` con sus habitaciones y una pestaña nueva en la hoja.
3. En `index.html`, cambiar una tarjeta "Próximamente" por la tarjeta de la sede.

## Ver la página en el computador
Abrir `index.html` en el navegador, o usar el servidor de `.claude/serve.ps1`.
