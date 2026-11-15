# Vitae Aeternae · Blog

Sitio estático sin compilación: solo HTML, CSS y JavaScript. Netlify lo publica tal cual.

## Estructura

```
index.html        Estructura de la página
style.css         Colores, tipografía y diseño
app.js            Lógica del blog (carga la lista y los posteos)
posts.json        Lista de posteos (título, fecha, extracto, portada)
posts/*.md        Contenido de cada posteo, en Markdown
assets/           Logo e imágenes
```

## Publicar por primera vez (sin GitHub)

1. Entrá a app.netlify.com y creá una cuenta gratuita.
2. Descomprimí esta carpeta en tu computadora.
3. Arrastrá la carpeta `vitae-aeternae` a la zona de "Deploy manually" o "Drag and drop" de Netlify.
4. Netlify te da un link público. Podés cambiarle el nombre en *Site configuration*.

## Crear un posteo con el script (recomendado)

Necesitás tener [Node.js](https://nodejs.org) instalado (una sola vez). Después, desde la carpeta del proyecto:

```
node nuevo-posteo.js
```

El script te pide título, extracto, etiqueta, fecha y portada. Crea el archivo `posts/<titulo>.md` con un texto de ejemplo y agrega la entrada a `posts.json`. Después solo tenés que reemplazar el texto de ejemplo por el tuyo, en Markdown (ver más abajo).

Si la portada es una imagen nueva, copiala primero a `assets/` y escribí esa ruta cuando el script la pida.

## Subir los cambios a GitHub (y a Netlify)

Una vez conectado el repositorio a Netlify, cada vez que subas cambios a GitHub, Netlify publica el sitio solo.

1. Creá un repositorio nuevo en github.com (vacío, sin README).
2. En la carpeta del proyecto, ejecutá:

```
git init
git add .
git commit -m "Primera versión del blog"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
git push -u origin main
```

3. Para publicar un posteo nuevo: creá el posteo (con el script), y después:

```
git add .
git commit -m "Nuevo posteo: título"
git push
```

4. En Netlify: *Add new site* → *Import an existing project* → GitHub → elegí el repositorio. No hace falta configurar nada de compilación; dejá el campo vacío.

## Agregar un posteo nuevo a mano

1. Creá un archivo en `posts/`, por ejemplo `posts/mi-nuevo-posteo.md`. Escribí el texto en Markdown:
   - Párrafos: texto separado por una línea en blanco.
   - Cita: empezá la línea con `>`.
   - Cursiva: `*así*`. Negrita: `**así**`.
2. Agregá una entrada al inicio de `posts.json`. El `slug` tiene que coincidir con el nombre del archivo sin `.md`:

```json
{
  "slug": "mi-nuevo-posteo",
  "title": "Título del posteo",
  "date": "2026-11-20",
  "excerpt": "Una frase que aparece en la tarjeta de la portada.",
  "cover": "assets/alguna-imagen.jpg",
  "tag": "Lecturas"
}
```

3. Si la portada es una imagen nueva, copiala a `assets/`.
4. Volvé a arrastrar la carpeta completa a Netlify (en el panel del sitio, pestaña *Deploys*).

Los posteos aparecen ordenados por fecha, del más nuevo al más viejo.

## Notas

- Para probarlo en tu computadora, no alcanza con abrir `index.html` con doble clic: la página necesita cargar `posts.json`. Usá Netlify o un servidor local.
- Los posteos de ejemplo tienen texto de muestra. Reemplazalo por tus reflexiones.
- El logo (`assets/logo.jpg`) es la imagen original de la cuenta, recortada al cuadrado. Si cambiás el logo, reemplazá ese archivo con el mismo nombre.
