/* =============================================
   JAVASCRIPT – PORTFOLIO INTERACTIONS
   app.js
   ============================================= */

// ============================
// 1. CANVAS PARTICLE BACKGROUND
// ============================
(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrame;
  let mouse = { x: -999, y: -999 };

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  const PARTICLE_COUNT = 80;
  const MAX_DIST = 130;
  const COLORS = ['rgba(108,99,255,', 'rgba(0,212,255,', 'rgba(255,107,157,'];

  function createParticle() {
    const colorBase = COLORS[Math.floor(Math.random() * COLORS.length)];
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.15,
      colorBase,
    };
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(createParticle());
  }

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Wrap
      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;
      if (p.y < -10) p.y = canvas.height + 10;
      if (p.y > canvas.height + 10) p.y = -10;

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.colorBase + p.alpha + ')';
      ctx.fill();

      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const opacity = (1 - dist / MAX_DIST) * 0.25;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = p.colorBase + opacity + ')';
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }

      // React to mouse
      const mdx = p.x - mouse.x;
      const mdy = p.y - mouse.y;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mdist < 100) {
        const angle = Math.atan2(mdy, mdx);
        const force = (100 - mdist) / 100 * 0.5;
        p.vx += Math.cos(angle) * force;
        p.vy += Math.sin(angle) * force;
        // Dampen speed
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 2) { p.vx /= 1.05; p.vy /= 1.05; }
      }
    }

    animFrame = requestAnimationFrame(draw);
  }

  draw();
})();

// ============================
// 2. NAVBAR SCROLL EFFECT
// ============================
(function () {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    const scrolled = window.scrollY > 60;
    navbar.classList.toggle('scrolled', scrolled);

    // Active link highlight
    let current = '';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.id;
    });

    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Hamburger
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.querySelector('.nav-links');

  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => navMenu.classList.remove('open'));
  });
})();

// ============================
// 3. TYPED TEXT EFFECT
// ============================
(function () {
  const el = document.getElementById('typed-text');
  const words = [
    'Scalable APIs',
    'Cloud Solutions',
    'Backend Systems',
    'Real-time Apps',
    'AI Integrations',
  ];
  let wi = 0, ci = 0, deleting = false;
  const SPEED = 90, DEL_SPEED = 50, PAUSE = 1800;

  function type() {
    const word = words[wi];
    if (!deleting) {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) { deleting = true; return setTimeout(type, PAUSE); }
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
    }
    setTimeout(type, deleting ? DEL_SPEED : SPEED);
  }

  type();
})();

// ============================
// 4. COUNTER ANIMATION
// ============================
(function () {
  const counters = document.querySelectorAll('.stat-num');
  let started = false;

  function animateCounters() {
    if (started) return;
    started = true;
    counters.forEach((el) => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      let count = 0;
      const step = Math.ceil(target / 40);
      const timer = setInterval(() => {
        count = Math.min(count + step, target);
        el.textContent = count;
        if (count >= target) clearInterval(timer);
      }, 40);
    });
  }

  const hero = document.getElementById('hero');
  const obs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) animateCounters();
  }, { threshold: 0.4 });

  obs.observe(hero);
})();

// ============================
// 5. SCROLL REVEAL ANIMATIONS
// ============================
(function () {
  const revealEls = document.querySelectorAll('.timeline-item, .project-card, .skill-category, .edu-card, .contact-card');

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Stagger siblings
          const siblings = Array.from(entry.target.parentElement.children);
          const idx = siblings.indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, idx * 100);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  revealEls.forEach((el) => obs.observe(el));
})();

// ============================
// 6. SKILL BAR ANIMATION
// ============================
(function () {
  const bars = document.querySelectorAll('.bar-fill');
  let animated = false;

  const obs = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !animated) {
        animated = true;
        bars.forEach((bar) => {
          const w = bar.getAttribute('data-width');
          setTimeout(() => { bar.style.width = w + '%'; }, 100);
        });
      }
    },
    { threshold: 0.2 }
  );

  const skillsSection = document.getElementById('skills');
  if (skillsSection) obs.observe(skillsSection);
})();

// ============================
// 7. SMOOTH HOVER TILT ON PROJECT CARDS
// ============================
(function () {
  const cards = document.querySelectorAll('.project-card, .timeline-card');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotX = (-y / rect.height) * 6;
      const rotY = (x / rect.width) * 6;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

// ============================
// 8. ACTIVE SECTION GLOWING NAV DOT
// ============================
(function () {
  // Add click ripple to buttons
  document.querySelectorAll('.btn-primary, .btn-ghost').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      ripple.style.cssText = `
        position:absolute;left:${e.clientX - rect.left}px;top:${e.clientY - rect.top}px;
        width:4px;height:4px;background:rgba(255,255,255,0.5);border-radius:50%;
        transform:scale(0);animation:rippleAnim 0.6s linear;pointer-events:none;
      `;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Inject ripple keyframe
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rippleAnim {
      to { transform: scale(60); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
})();

// ============================
// 9. PAGE LOAD PROGRESS BAR
// ============================
(function () {
  const bar = document.createElement('div');
  bar.id = 'progress-bar';
  bar.style.cssText = `
    position:fixed;top:0;left:0;height:3px;width:0%;
    background:linear-gradient(90deg,#6c63ff,#00d4ff);
    z-index:9999;transition:width 0.1s;
  `;
  document.body.prepend(bar);

  window.addEventListener('scroll', () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

console.log('%c👋 Hey there! Built with ❤️ by Dilip Suthar', 'color:#6c63ff;font-size:16px;font-weight:bold;');
