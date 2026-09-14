/* ═══════════════════════════════════════════
   THEME TOGGLE
═══════════════════════════════════════════ */
(function initTheme() {
  const btn  = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  const html = document.documentElement;

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }

  const saved = localStorage.getItem('portfolio-theme') || 'dark';
  applyTheme(saved);

  btn.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('portfolio-theme', next);
  });
})();

/* ═══════════════════════════════════════════
   PARTICLE CANVAS
═══════════════════════════════════════════ */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], mouse = { x: null, y: null };
  const PARTICLE_COUNT = 80;
  const MAX_DIST = 130;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomBetween(a, b) { return a + Math.random() * (b - a); }

  function createParticle() {
    return {
      x: randomBetween(0, W),
      y: randomBetween(0, H),
      vx: randomBetween(-0.4, 0.4),
      vy: randomBetween(-0.4, 0.4),
      r: randomBetween(1.5, 3),
      alpha: randomBetween(0.3, 0.8),
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
  }

  function drawParticle(p) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(56,189,248,${p.alpha})`;
    ctx.fill();
  }

  function drawLine(p1, p2, dist) {
    const alpha = (1 - dist / MAX_DIST) * 0.25;
    ctx.beginPath();
    ctx.strokeStyle = `rgba(56,189,248,${alpha})`;
    ctx.lineWidth = 0.6;
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      drawParticle(p);
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) drawLine(particles[i], particles[j], dist);
      }
      if (mouse.x !== null) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST * 1.5) drawLine(particles[i], { x: mouse.x, y: mouse.y }, dist / 1.5);
      }
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

  init();
  animate();
})();

/* ═══════════════════════════════════════════
   TYPING EFFECT
═══════════════════════════════════════════ */
(function initTyping() {
  const phrases = [
    'autonomous AI agents.',
    'MCP server systems.',
    'cloud data pipelines.',
    'GenAI integrations.',
    'scalable microservices.',
  ];
  const el = document.getElementById('typedText');
  let phraseIdx = 0, charIdx = 0, deleting = false, pauseFrames = 0;

  function type() {
    const current = phrases[phraseIdx];

    if (pauseFrames > 0) { pauseFrames--; setTimeout(type, 80); return; }

    if (!deleting) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) { deleting = true; pauseFrames = 25; }
      setTimeout(type, 75);
    } else {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        pauseFrames = 5;
      }
      setTimeout(type, 40);
    }
  }
  setTimeout(type, 1200);
})();

/* ═══════════════════════════════════════════
   NAVBAR SCROLL EFFECT
═══════════════════════════════════════════ */
(function initNav() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    const isOpen = navLinks.classList.contains('open');
    spans[0].style.transform = isOpen ? 'translateY(7px) rotate(45deg)' : '';
    spans[1].style.opacity   = isOpen ? '0' : '1';
    spans[2].style.transform = isOpen ? 'translateY(-7px) rotate(-45deg)' : '';
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => {
        s.style.transform = '';
        s.style.opacity = '1';
      });
    });
  });

  // Active link highlight on scroll
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a[href^="#"]');

  function updateActive() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    links.forEach(a => {
      a.classList.toggle('nav-active', a.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
})();

/* ═══════════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════════ */
(function initReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('visible'), Number(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  // Stagger siblings
  document.querySelectorAll(
    '.skill-card, .project-card, .edu-card, .cert-card, .timeline-item'
  ).forEach((el, i) => {
    const siblings = el.parentElement.children;
    const idx = Array.from(siblings).indexOf(el);
    el.dataset.delay = idx * 100;
  });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

/* ═══════════════════════════════════════════
   CGPA BAR ANIMATION
═══════════════════════════════════════════ */
(function initBars() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        bar.style.width = bar.dataset.width + '%';
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.bar-fill').forEach(bar => observer.observe(bar));
})();

/* ═══════════════════════════════════════════
   CONTACT FORM
═══════════════════════════════════════════ */
(function initForm() {
  const form    = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name    = form.querySelector('#name').value.trim();
    const email   = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();

    if (!name || !email || !message) {
      formNote.style.color = '#f87171';
      formNote.textContent = 'Please fill in all fields.';
      return;
    }

    // Build mailto link
    const subject  = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body     = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    window.location.href = `mailto:v.l.hrushi@gmail.com?subject=${subject}&body=${body}`;

    formNote.style.color = 'var(--success)';
    formNote.textContent = 'Opening your email client...';
    form.reset();
  });
})();

/* ═══════════════════════════════════════════
   SMOOTH SCROLL OFFSET (for fixed nav)
═══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 70;
    const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
