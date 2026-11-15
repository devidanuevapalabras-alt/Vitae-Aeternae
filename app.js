// Vitae Aeternae: blog liviano sin compilación.
// Los posteos viven en posts.json (lista) y posts/<slug>.md (contenido).
// Para publicar un posteo nuevo: agregá el .md y una entrada en posts.json.

const app = document.getElementById('app');

function esc(text) {
  const d = document.createElement('div');
  d.textContent = text ?? '';
  return d.innerHTML;
}

function formatDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
}

let postsCache = null;
async function loadPosts() {
  if (postsCache) return postsCache;
  const res = await fetch('posts.json', { cache: 'no-cache' });
  if (!res.ok) throw new Error('No se pudo cargar posts.json');
  postsCache = await res.json();
  postsCache.sort((a, b) => (a.date < b.date ? 1 : -1));
  return postsCache;
}

// Galería: fotos en assets/galeria/g01.jpg … g18.jpg
const GALLERY_COUNT = 18;
// Citas de la Biblia Straubinger (bibliastraubinger.com) para algunas fotos, según su número.
const GALLERY_CITAS = {
  1: 'Mateo 6, 26: «Mirad las aves del cielo… vuestro Padre celestial las alimenta»',
  2: 'Mateo 13, 47: «una red que se echó en el mar y que recogió peces de toda clase»',
  4: 'Mateo 13, 32: «los pájaros del cielo llegan a anidar en sus ramas»',
  5: 'Génesis 1, 11: «Brote la tierra hierba verde»',
  6: 'Génesis 1, 31: «Vio Dios todo cuanto había hecho; y he aquí que estaba muy bien»',
  8: 'Génesis 2, 9: «toda clase de árboles de hermoso aspecto»',
  9: 'Isaías 55, 12: «los montes y los collados os aclamarán con júbilo»',
  13: 'Salmo 8, 2: «cuán admirable es tu Nombre en toda la tierra»',
  15: 'Salmo 18, 2: «el firmamento predica las obras que Él ha hecho»',
  10: 'Salmo 118, 105: «antorcha para nuestros pies y luz para nuestra senda»',
  11: 'Mateo 6, 28: «Aprended de los lirios del campo: cómo crecen»',
  12: 'Job 38, 41: «¿Quién prepara al cuervo su alimento…?»',
  3: 'Salmo 103, 26: «ese leviatán que creaste para que en él juguetease»',
  7: 'Salmo 4, 9: «Apenas me acuesto, me duermo en paz»',
  14: 'Mateo 4, 21: «en su barca con Zebedeo su padre»',
  16: 'Salmo 106, 23: «Surcaban en naves el mar»',
  17: 'Mateo 4, 19: «os haré pescadores de hombres»',
  18: 'Salmo 1, 3: «como un árbol plantado junto a ríos de agua»',
};
function galleryHTML() {
  const items = Array.from({ length: GALLERY_COUNT }, (_, i) => {
    const n = String(i + 1).padStart(2, '0');
    const cita = GALLERY_CITAS[i + 1];
    const img = `<img src="assets/galeria/g${n}.jpg" alt="" loading="lazy"${cita ? ` data-cita="${esc(cita)}"` : ''}>`;
    return `<figure class="reveal">${img}${cita ? `<figcaption>${esc(cita)}</figcaption>` : ''}</figure>`;
  }).join('');
  return `
    <section id="galeria">
      <div class="wrap">
        <h2 class="reveal">Galería y pasajes de la Biblia</h2>
        <div class="gallery">${items}</div>
        <p class="leer-mas">Para leer más: <a href="https://bibliastraubinger.com/" target="_blank" rel="noopener">Biblia Straubinger</a> · <a href="https://www.dominicos.org/predicacion/evangelio-del-dia/hoy/" target="_blank" rel="noopener">Meditación del Evangelio del día (dominicos)</a></p>
      </div>
    </section>`;
}

function homeHTML(posts) {
  const cards = posts.length
    ? posts.map(p => `
        <a class="card reveal" href="#/post/${esc(p.slug)}">
          <img src="${esc(p.cover)}" alt="" loading="lazy">
          <div class="body">
            <span class="tag">${esc(p.tag || 'Posteo')}</span>
            <h3>${esc(p.title)}</h3>
            <p>${esc(p.excerpt)}</p>
            <div class="date">${formatDate(p.date)}</div>
          </div>
        </a>`).join('')
    : '<p class="empty">Todavía no hay posteos. ¡Pronto!</p>';

  return `
    <section class="hero">
      <div class="specks" aria-hidden="true"></div>
      <img class="logo" src="assets/logo.jpg" alt="Vitae Aeternae, naturaleza y oración" width="260" height="260">
      <h1><a href="#sobre-mi" class="hero-link">Una pausa para contemplar<br>la <span class="ring ring--gold"><em>grandeza</em></span> del Señor</a></h1>
      <p class="lead"><a href="#sobre-mi" class="hero-link">El brillo del agua, el sonido del viento, el silencio del sol. Un lugar para conectar con la paz.</a></p>
      <p class="verse"><a href="#sobre-mi" class="hero-link">«¿A quién iremos? Tú tienes palabras de Vida Eterna».<cite>Jn 6, 68</cite></a></p>
    </section>

    <section id="sobre-mi" class="alt">
      <div class="wrap about">
        <div class="reveal">
          <h2>Hola, soy <span class="ring"><em>Josefina</em></span></h2>
          <p>Soy católica, historiadora del arte y amante de la naturaleza, así que decidí crear esta cuenta y este espacio como un pequeño oasis.</p>
          <p>La idea es rezar inspirándonos en la naturaleza y meditando los pasajes de las <strong>Lecturas Diarias</strong> de la Biblia Apostólica Romana del Calendario Católico: Salmos, Primeras Lecturas y Evangelios.</p>
          <p>Este canal existe para enfocarse en la Creación y en la Palabra de Vida Eterna. Vitae Aeternae, «vida eterna» en latín, viene de las palabras de san Pedro en el Evangelio de Juan.</p>
          <p>En el fondo, lo que busco es cada día rezar un poco más. Es en la rutina pequeña donde se logran grandes maravillas.</p>
        </div>
      </div>
    </section>

    ${galleryHTML()}

    <section id="posteos">
      <div class="wrap">
        <h2 class="reveal">Últimos <span class="ring"><em>posteos</em></span></h2>
        <div class="grid">${cards}</div>
      </div>
    </section>`;
}

async function renderHome() {
  app.innerHTML = '<p class="empty" style="padding:64px 24px">Cargando…</p>';
  try {
    const posts = await loadPosts();
    app.innerHTML = homeHTML(posts);
  } catch (err) {
    app.innerHTML = `<p class="empty" style="padding:64px 24px">${esc(err.message)}. Si abriste el archivo directamente desde la computadora, publicá la carpeta en Netlify o usá un servidor local.</p>`;
  }
  initMotion();
  const hash = location.hash;
  if (hash === '#posteos' || hash === '#sobre-mi') {
    document.getElementById(hash.slice(1))?.scrollIntoView();
  } else {
    window.scrollTo(0, 0);
  }
}

// ---------- Movimiento ----------
// Destellos sobre el mar, aparición al hacer scroll y encabezado que cambia al bajar.
function initMotion() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const specks = document.querySelector('.specks');
  if (specks && !reduce && !specks.childElementCount) {
    for (let i = 0; i < 18; i++) {
      const s = document.createElement('span');
      s.className = 'speck';
      s.style.left = `${Math.random() * 100}%`;
      s.style.top = `${40 + Math.random() * 60}%`;
      s.style.animationDuration = `${9 + Math.random() * 9}s`;
      s.style.animationDelay = `${-Math.random() * 12}s`;
      s.style.width = s.style.height = `${2 + Math.random() * 3}px`;
      specks.appendChild(s);
    }
  }

  const items = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach(el => io.observe(el));
  }
}

// Galería: al tocar una foto se abre en grande; se cierra con un clic o con Esc.
function openLightbox(src, alt, cita) {
  const box = document.createElement('div');
  box.className = 'lightbox';
  box.innerHTML = `<figure><img src="${esc(src)}" alt="${esc(alt)}">${cita ? `<figcaption class="cita">${esc(cita)}</figcaption>` : ''}</figure>`;
  box.addEventListener('click', () => box.remove());
  document.body.appendChild(box);
}
document.addEventListener('click', e => {
  const img = e.target.closest('.gallery img');
  if (img) openLightbox(img.getAttribute('src'), img.alt, img.dataset.cita);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') document.querySelector('.lightbox')?.remove();
});

const topBar = document.querySelector('.top');
window.addEventListener('scroll', () => {
  topBar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

async function renderPost(slug) {
  app.innerHTML = '<p class="empty" style="padding:64px 24px">Cargando…</p>';
  try {
    const posts = await loadPosts();
    const idx = posts.findIndex(p => p.slug === slug);
    if (idx === -1) throw new Error('Posteo no encontrado');
    const post = posts[idx];
    const next = posts[idx + 1];

    const res = await fetch(`posts/${encodeURIComponent(slug)}.md`, { cache: 'no-cache' });
    if (!res.ok) throw new Error('No se pudo cargar el posteo');
    const md = await res.text();
    const html = (window.marked ? marked.parse(md) : `<p>${esc(md)}</p>`);

    app.innerHTML = `
      <article class="post">
        <a class="back" href="#/">← Volver a los posteos</a>
        <img class="cover" src="${esc(post.cover)}" alt="">
        <span class="tag">${esc(post.tag || 'Posteo')}</span>
        <h1>${esc(post.title)}</h1>
        <div class="meta date">${formatDate(post.date)}</div>
        <div class="content">${html}</div>
        ${next ? `<div class="next"><span class="tag">Anterior</span><br><a href="#/post/${esc(next.slug)}"><em>${esc(next.title)}</em></a></div>` : ''}
      </article>`;
    document.title = `${post.title} · Vitae Aeternae`;
    // Cada párrafo y bloque del posteo aparece al bajar la página.
    document.querySelectorAll('.post .content > *').forEach(el => el.classList.add('reveal'));
    initMotion();
  } catch (err) {
    app.innerHTML = `<p class="empty" style="padding:64px 24px">${esc(err.message)}. <a href="#/">Volver al inicio</a></p>`;
  }
  window.scrollTo(0, 0);
}

function route() {
  const hash = location.hash || '#/';
  const m = hash.match(/^#\/post\/([a-z0-9-]+)$/i);
  if (m) {
    renderPost(m[1]);
  } else {
    document.title = 'Vitae Aeternae · Naturaleza & Oración';
    renderHome();
  }
}

window.addEventListener('hashchange', route);
route();
