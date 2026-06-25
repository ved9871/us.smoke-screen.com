/* ============================================================
   SMOKE SCREEN USA & CANADA — Main JavaScript
   ============================================================ */

'use strict';

/* ---------- Sticky Nav ---------- */
(function () {
  const nav = document.getElementById('main-nav');
  if (!nav) return;
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ---------- Hamburger / Mobile Drawer ---------- */
(function () {
  const hamburger = document.getElementById('hamburger');
  const drawer    = document.getElementById('nav-drawer');
  if (!hamburger || !drawer) return;
  hamburger.addEventListener('click', () => {
    const open = drawer.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  // Close on link click
  drawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      drawer.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* ---------- Active Nav Link ---------- */
(function () {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-drawer a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

/* ---------- Hero Canvas Fog Animation ---------- */
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const PARTICLE_COUNT = 80;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function Particle() {
    this.reset = function () {
      this.x    = Math.random() * W;
      this.y    = H + Math.random() * 200;
      this.r    = Math.random() * 120 + 60;
      this.vx   = (Math.random() - 0.5) * 0.4;
      this.vy   = -(Math.random() * 0.5 + 0.2);
      this.alpha = 0;
      this.targetAlpha = Math.random() * 0.08 + 0.02;
      this.fade = 'in';
    };
    this.reset();
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = new Particle();
      p.y = Math.random() * H; // scatter initial positions
      p.alpha = Math.random() * p.targetAlpha;
      particles.push(p);
    }
  }

  function drawParticle(p) {
    const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
    grd.addColorStop(0, `rgba(200,200,220,${p.alpha})`);
    grd.addColorStop(1, 'rgba(200,200,220,0)');
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();
  }

  function update() {
    ctx.clearRect(0, 0, W, H);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.fade === 'in') {
        p.alpha += 0.0008;
        if (p.alpha >= p.targetAlpha) p.fade = 'hold';
      } else {
        p.alpha -= 0.0003;
        if (p.alpha <= 0) p.reset();
      }
      if (p.y < -p.r * 2) p.reset();
      drawParticle(p);
    }
    requestAnimationFrame(update);
  }

  window.addEventListener('resize', () => { resize(); initParticles(); }, { passive: true });
  resize();
  initParticles();
  update();
})();

/* ---------- Contact Form (homepage & contact page) ---------- */
(function () {
  const forms = document.querySelectorAll('.enquiry-form');
  forms.forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm(form)) return;
      const successDiv = form.querySelector('successDiv');
      if (successDiv) {
        form.querySelector('.form-fields').style.display = 'none';
        successDiv.style.display = 'block';
      } else {
        // contact.html — redirect to thank-you
        window.location.href = 'thank-you.html';
      }
      // Route leads to Sophie
      // TODO: integrate with backend / Formspree / Netlify Forms
    });
  });

  function validateForm(form) {
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = 'var(--red)';
        valid = false;
      }
    });
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\[^\s@]+$/.test(emailField.value)) {
      emailField.style.borderColor = 'var(--red)';
      valid = false;
    }
    return valid;
  }
})();

/* ---------- Smooth Scroll for Anchor Links ---------- */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

/* ---------- Lazy Load Images ---------- */
(function () {
  if (!('IntersectionObserver' in window)) return;
  const imgs = document.querySelectorAll('img[data-src]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });
  imgs.forEach(img => observer.observe(img));
})();

/* ---------- Video Modal (videos page) ---------- */
(function () {
  const modal = document.getElementById('video-modal');
  if (!modal) return;
  const iframe = modal.querySelector('iframe');
  const close  = modal.querySelector('.modal-close');

  document.querySelectorAll('[data-video-id]').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.videoId;
      iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    iframe.src = '';
    document.body.style.overflow = '';
  }

  if (close)  close.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
})();

/* ---------- Scroll Reveal (simple fade-up) ---------- */
(function () {
  if (!('IntersectionObserver' in window)) return;
  const els = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => observer.observe(el));
})();
