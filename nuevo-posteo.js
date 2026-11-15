#!/usr/bin/env node
// Crea un posteo nuevo: un archivo en posts/ y una entrada al inicio de posts.json.
// Uso (desde la carpeta del proyecto):  node nuevo-posteo.js
// No necesita instalar nada: solo Node.js (https://nodejs.org).

const fs = require('fs');
const path = require('path');
const readline = require('readline/promises');
const { stdin, stdout } = require('process');

const ROOT = __dirname;
const POSTS_JSON = path.join(ROOT, 'posts.json');
const POSTS_DIR = path.join(ROOT, 'posts');
const TAGS = ['Lecturas', 'Etimología', 'Naturaleza', 'Salmos', 'Oración'];

function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function today() {
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

async function main() {
  const rl = readline.createInterface({ input: stdin, output: stdout });
  const ask = async (question, fallback = '') => {
    const hint = fallback ? ` (Enter = ${fallback})` : '';
    const answer = (await rl.question(`${question}${hint}: `)).trim();
    return answer || fallback;
  };

  console.log('\nNuevo posteo para Vitae Aeternae\n');

  const title = await ask('Título');
  if (!title) {
    console.log('Falta el título. No se creó nada.');
    rl.close();
    return;
  }

  const slug = slugify(title);
  const postFile = path.join(POSTS_DIR, `${slug}.md`);
  const posts = JSON.parse(fs.readFileSync(POSTS_JSON, 'utf8'));

  if (fs.existsSync(postFile) || posts.some(p => p.slug === slug)) {
    console.log(`Ya existe un posteo con el nombre "${slug}". Elegí otro título.`);
    rl.close();
    return;
  }

  const excerpt = await ask('Extracto (una frase para la portada)');
  console.log(`Etiquetas sugeridas: ${TAGS.join(' / ')}`);
  const tag = await ask('Etiqueta', TAGS[0]);
  const date = await ask('Fecha (AAAA-MM-DD)', today());
  const cover = await ask('Portada (ruta dentro del proyecto, por ejemplo assets/mi-foto.jpg)', 'assets/logo.jpg');

  if (!fs.existsSync(path.join(ROOT, cover))) {
    console.log(`Aviso: no encuentro el archivo ${cover}. Copialo a la carpeta assets/ antes de publicar.`);
  }

  const body = `*Subtítulo o cita breve*

Escribí acá el texto del posteo. Separá los párrafos con una línea en blanco.

> Si querés una cita de la Biblia, empezá la línea con el signo de mayor (>).

## Primera parte

Más texto.
`;

  fs.writeFileSync(postFile, body, 'utf8');
  posts.unshift({ slug, title, date, excerpt, cover, tag });
  fs.writeFileSync(POSTS_JSON, JSON.stringify(posts, null, 2) + '\n', 'utf8');

  console.log(`\nListo:
  - Creado: posts/${slug}.md (reemplazá el texto de ejemplo)
  - Agregado al inicio de posts.json
Cuando termines de escribir, publicá los cambios (ver README, sección "Publicar").`);
  rl.close();
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
