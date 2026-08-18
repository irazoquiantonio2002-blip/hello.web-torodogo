// ============ TORODOGO — interacciones ============

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Loader ---- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('done'), 500);
  });
  // fallback por si "load" tarda (ej. imágenes pesadas)
  setTimeout(() => loader.classList.add('done'), 2600);

  /* ---- Nav scroll state ---- */
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll);
  onScroll();

  /* ---- Mobile menu ---- */
  const ham = document.getElementById('ham');
  const mob = document.getElementById('mob');
  ham.addEventListener('click', () => {
    const open = mob.classList.toggle('open');
    ham.classList.toggle('active', open);
    ham.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  mob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mob.classList.remove('open');
    ham.classList.remove('active');
    document.body.style.overflow = '';
  }));

  /* ---- Scroll reveal ---- */
  const revEls = document.querySelectorAll('.rev');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  revEls.forEach(el => io.observe(el));

  /* ---- Contadores (hero + about) ---- */
  const counters = document.querySelectorAll('[data-count], [data-hero-count]');
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count || el.dataset.heroCount, 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    let cur = 0;
    const step = Math.max(1, Math.ceil(target / 60));
    const tick = () => {
      cur = Math.min(target, cur + step);
      el.textContent = prefix + cur + suffix;
      if (cur < target) requestAnimationFrame(tick);
    };
    tick();
  };
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.done) {
        e.target.dataset.done = '1';
        animateCount(e.target);
        cio.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(el => cio.observe(el));

  /* ---- Hero accent word cycle ---- */
  const cycle = document.getElementById('accentCycle');
  if (cycle) {
    const words = ['Tu Evento', 'Tu Boda', 'Tu Fiesta', 'Tu Antojo'];
    let i = 0;
    setInterval(() => {
      i = (i + 1) % words.length;
      cycle.style.opacity = 0;
      setTimeout(() => { cycle.textContent = words[i]; cycle.style.opacity = 1; }, 350);
    }, 2800);
    cycle.style.transition = 'opacity .35s ease';
  }

  /* ---- Partículas doradas en el hero (estilo "chispas de estadio") ---- */
  const canvas = document.getElementById('pcanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const hero = document.getElementById('hero');

    const resize = () => {
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const spawn = () => {
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        r: Math.random() * 2 + 0.6,
        vy: Math.random() * 0.6 + 0.25,
        vx: (Math.random() - 0.5) * 0.3,
        life: 1,
        gold: Math.random() > 0.35
      });
    };

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (particles.length < 70 && Math.random() > 0.5) spawn();

      particles.forEach(p => {
        p.y -= p.vy;
        p.x += p.vx;
        p.life -= 0.0035;
        ctx.globalAlpha = Math.max(p.life, 0);
        ctx.fillStyle = p.gold ? '#f5b942' : '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      particles = particles.filter(p => p.life > 0);
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* ---- Formulario de contacto -> Instagram DM ----
     No hay número de WhatsApp activo todavía, así que el formulario
     arma un resumen, lo copia al portapapeles y abre el Instagram
     de Torodogo para que el cliente lo pegue en el DM. */
  const form = document.getElementById('cForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const resumen =
`Hola Torodogo! Quiero cotizar un evento:
Nombre: ${data.nombre || '-'}
Teléfono: ${data.telefono || '-'}
Tipo de evento: ${data.tipo || '-'}
Fecha: ${data.fecha || '-'}
Número de personas: ${data.personas || '-'}
Comentarios: ${data.mensaje || '-'}`;

      const finish = () => window.open('https://instagram.com/torodogo_', '_blank', 'noopener');

      if (navigator.clipboard) {
        navigator.clipboard.writeText(resumen).then(finish).catch(finish);
      } else {
        finish();
      }

      const btn = form.querySelector('.btn-submit');
      const original = btn.innerHTML;
      btn.innerHTML = '¡Listo! Copiamos tu cotización — pégala en el DM ✓';
      setTimeout(() => { btn.innerHTML = original; form.reset(); }, 3200);
    });
  }
});
