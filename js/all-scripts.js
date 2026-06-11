'use strict';

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

/* ─────────────────────────────
   LOADING SCREEN
───────────────────────────── */
function initLoadingScreen() {
  const screen = $('.loading-screen');
  if (!screen) return;
  window.addEventListener('load', () => {
    setTimeout(() => {
      screen.classList.add('hidden');
      setTimeout(() => { screen.style.display = 'none'; }, 600);
    }, 1800);
  });
}

/* ─────────────────────────────
   SCROLL PROGRESS
───────────────────────────── */
function initScrollProgress() {
  const bar = $('.scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = total > 0 ? (scrolled / total * 100) + '%' : '0%';
  }, { passive: true });
}

/* ─────────────────────────────
   SCROLL TO TOP
───────────────────────────── */
function initScrollToTop() {
  const btn = $('.scrollToTop-btn');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ─────────────────────────────
   CUSTOM CURSOR
───────────────────────────── */
function initCustomCursor() {
  const cursor = $('.cursor');
  const follower = $('.cursor-follower');
  if (!cursor) return;
  if (window.matchMedia('(hover: none)').matches) {
    cursor.style.display = 'none';
    if (follower) follower.style.display = 'none';
    return;
  }
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  }, { passive: true });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    if (follower) {
      follower.style.left = followerX + 'px';
      follower.style.top  = followerY + 'px';
    }
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  document.querySelectorAll('a, button, .cta-btn, .service-card, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(2)';
      cursor.style.opacity = '0.5';
      if (follower) follower.style.transform = 'translate(-50%,-50%) scale(1.5)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      cursor.style.opacity = '1';
      if (follower) follower.style.transform = 'translate(-50%,-50%) scale(1)';
    });
  });
}

/* ─────────────────────────────
   PARTICLES
───────────────────────────── */
function initParticles() {
  if (typeof particlesJS === 'undefined') return;

  // Respect light theme — use darker particles in light mode
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const color   = isLight ? '#1971c2' : '#4dabf7';

  try {
    particlesJS('particles-js', {
      particles: {
        number: { value: 45, density: { enable: true, value_area: 900 } },
        color: { value: color },
        shape: { type: 'circle' },
        opacity: { value: isLight ? 0.18 : 0.25, random: true, anim: { enable: true, speed: 0.5, opacity_min: 0.05 } },
        size: { value: 2, random: true },
        line_linked: { enable: true, distance: 140, color: color, opacity: isLight ? 0.06 : 0.06, width: 1 },
        move: { enable: true, speed: 1, random: true, out_mode: 'out', bounce: false }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: { enable: true, mode: 'grab' },
          onclick: { enable: false },
          resize: true
        },
        modes: { grab: { distance: 140, line_linked: { opacity: 0.2 } } }
      },
      retina_detect: true
    });
  } catch(e) {}
}

/* ─────────────────────────────
   SCROLL TO SECTION
───────────────────────────── */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const offset = id === 'main' ? 0 : el.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top: Math.max(offset, 0), behavior: 'smooth' });
}

/* ─────────────────────────────
   ACTIVE MENU
───────────────────────────── */
function setActiveMenu(id) {
  $$('.menu-item').forEach(item => {
    item.classList.toggle('active', item.getAttribute('data-section') === id);
  });
}

/* ─────────────────────────────
   SIDEBAR
───────────────────────────── */
function initSidebar() {
  const toggle  = document.getElementById('mobileNavToggle');
  const overlay = document.getElementById('mobileOverlay');
  const sidebar = document.getElementById('sidebarNav');
  if (!toggle || !sidebar) return;

  const open = () => {
    sidebar.classList.add('active');
    overlay?.classList.add('active');
    toggle.classList.add('active');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    sidebar.classList.remove('active');
    overlay?.classList.remove('active');
    toggle.classList.remove('active');
    document.body.style.overflow = '';
  };

  toggle.addEventListener('click', () => sidebar.classList.contains('active') ? close() : open());
  overlay?.addEventListener('click', close);

  $$('.menu-item').forEach(item => {
    item.querySelector('.menu-link')?.addEventListener('click', e => {
      e.preventDefault();
      const section = item.getAttribute('data-section');
      scrollToSection(section);
      setActiveMenu(section);
      if (window.innerWidth <= 768) close();
    });
  });

  window.addEventListener('resize', () => { if (window.innerWidth > 768) close(); });
}

/* ─────────────────────────────
   SCROLL SPY
───────────────────────────── */
function initScrollSpy() {
  const sections = $$('section[id]');
  if (!sections.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) setActiveMenu(e.target.id); });
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
  sections.forEach(s => observer.observe(s));
}

/* ─────────────────────────────
   TYPING ANIMATION
───────────────────────────── */
function initTypingAnimation() {
  const el = document.getElementById('rotatingTitle');
  if (!el) return;
  const titles = [
    'Full Stack Developer',
    'MERN Stack Developer',
    'Frontend Developer',
    'Backend Developer',
    'Web Developer',
    'Software Engineer'
  ];
  let idx = 0;

  const type = (text, done) => {
    el.textContent = '';
    let i = 0;
    const t = setInterval(() => {
      el.textContent += text[i++];
      if (i >= text.length) { clearInterval(t); if (done) setTimeout(done, 2000); }
    }, 75);
  };

  const del = done => {
    const t = setInterval(() => {
      const s = el.textContent;
      if (!s.length) { clearInterval(t); done?.(); return; }
      el.textContent = s.slice(0, -1);
    }, 40);
  };

  const cycle = () => {
    idx = (idx + 1) % titles.length;
    type(titles[idx], () => del(cycle));
  };
  type(titles[0], () => del(cycle));
}

/* ─────────────────────────────
   STAT COUNTERS
───────────────────────────── */
function initStatCounters() {
  const nums = $$('.stat-number');
  if (!nums.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || entry.target.dataset.counted) return;
      entry.target.dataset.counted = '1';
      const el = entry.target;
      const original = el.textContent.trim();
      const match = original.match(/(\d+)/);
      if (!match) return;
      const end = parseInt(match[1]);
      const suffix = original.replace(/\d+/, '');
      const start = performance.now();
      const step = now => {
        const p = Math.min((now - start) / 1400, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(end * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  nums.forEach(n => observer.observe(n));
}

/* ─────────────────────────────
   SKILL BARS
───────────────────────────── */
function initSkillBars() {
  const bars = $$('.line');
  if (!bars.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('animate');
    });
  }, { threshold: 0.3 });
  bars.forEach(b => observer.observe(b));
}

/* ─────────────────────────────
   CARD HOVER TILT
───────────────────────────── */
function initCardTilt() {
  $$('.project-card, .service-card, .certification-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = (-y / rect.height) * 6;
      const rotateY = (x / rect.width) * 6;
      card.style.transform = `translateY(-5px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  });
}

/* ─────────────────────────────
   PROFILE IMAGE EFFECT
───────────────────────────── */
function initProfileEffects() {
  const img = $('.profile-image');
  if (!img) return;
  img.addEventListener('mouseenter', () => img.style.filter = 'brightness(1.08) saturate(1.15)');
  img.addEventListener('mouseleave', () => img.style.filter = '');
}

/* ─────────────────────────────
   GLITCH EFFECT (name)
───────────────────────────── */
function initGlitchEffect() {
  const name = $('.name-highlight');
  if (!name) return;
  setInterval(() => {
    name.style.textShadow = `2px 0 rgba(77,171,247,0.5), -2px 0 rgba(132,94,247,0.5)`;
    setTimeout(() => { name.style.textShadow = ''; }, 80);
  }, 4000);
}

/* ─────────────────────────────
   CONTACT FORM (Formspree)
───────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const endpoint = form.getAttribute('action') || 'https://formspree.io/f/xlgkwlgr';

  form.addEventListener('submit', async event => {
    event.preventDefault();

    const btn = document.getElementById('sendBtn');
    const status = document.getElementById('formStatus');

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;
    status.className = 'form-status';
    status.textContent = '';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: {
          Accept: 'application/json'
        }
      });

      if (response.ok) {
        status.className = 'form-status success';
        status.textContent = '✓ Message sent! I will reply within 24 hours.';
        form.reset();
      } else {
        throw new Error('Formspree request failed');
      }
    } catch (error) {
      status.className = 'form-status error';
      status.textContent = '✗ Something went wrong. Please email directly.';
    } finally {
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Project Inquiry';
      btn.disabled = false;
    }
  });
}

/* ─────────────────────────────
   NOTIFICATION
───────────────────────────── */
window.showNotification = (message, type = 'success') => {
  const n = document.createElement('div');
  n.style.cssText = `
    position:fixed; top:1.25rem; right:5rem;
    background:${type === 'error' ? '#ef4444' : '#4dabf7'};
    color:#000; padding:.875rem 1.4rem;
    border-radius:8px;
    box-shadow:0 8px 28px rgba(0,0,0,.4);
    z-index:10000; font-weight:600; font-size:.88rem;
    opacity:0; transform:translateX(120%);
    transition:all .35s ease;
    font-family:Inter,sans-serif;
  `;
  n.textContent = (type === 'success' ? '✓ ' : '✗ ') + message;
  document.body.appendChild(n);
  requestAnimationFrame(() => { n.style.opacity = '1'; n.style.transform = 'translateX(0)'; });
  setTimeout(() => {
    n.style.opacity = '0'; n.style.transform = 'translateX(120%)';
    setTimeout(() => n.remove(), 350);
  }, 3200);
};

/* ─────────────────────────────
   AOS INIT
───────────────────────────── */
function initAOS() {
  if (typeof AOS === 'undefined') return;
  AOS.init({ duration: 800, once: true, mirror: false, offset: 80, easing: 'ease-out-cubic' });
}

/* ─────────────────────────────
   SECTION TRANSITIONS
───────────────────────────── */
function initSectionObserver() {
  const sections = $$('section');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.05 });
  sections.forEach(s => {
    s.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(s);
  });
}

/* ─────────────────────────────
   PROJECT SCREENSHOT FALLBACK
   (if image fails → show icon)
───────────────────────────── */
function initProjectScreenshots() {
  $$('.proj-screenshot').forEach(img => {
    img.addEventListener('error', function() {
      this.classList.add('img-error');
      const iconWrap = this.parentElement.querySelector('.proj-icon-wrap');
      if (iconWrap) {
        iconWrap.style.display = 'flex';
        // restore themed background when icon is shown
        const parent = this.parentElement;
        if (parent.classList.contains('proj-lab')) {
          parent.style.background = 'linear-gradient(135deg,rgba(77,171,247,0.06),rgba(132,94,247,0.06))';
        } else if (parent.classList.contains('proj-srm')) {
          parent.style.background = 'linear-gradient(135deg,rgba(0,212,255,0.06),rgba(0,255,136,0.05))';
        } else if (parent.classList.contains('proj-cgpa')) {
          parent.style.background = 'linear-gradient(135deg,rgba(240,165,0,0.06),rgba(255,80,80,0.05))';
        }
      }
    });
  });
}

/* ─────────────────────────────
   CMD HINT FADE OUT
───────────────────────────── */
function initCmdHint() {
  const hint = document.getElementById('cmdHint');
  if (!hint) return;
  // Fade out hint after 6 seconds on desktop
  if (!window.matchMedia('(hover: none)').matches) {
    setTimeout(() => {
      hint.style.transition = 'opacity 1s ease';
      hint.style.opacity = '0';
      setTimeout(() => hint.style.display = 'none', 1000);
    }, 6000);
  } else {
    // Hide entirely on touch devices
    hint.style.display = 'none';
  }
}

/* ─────────────────────────────
   THEME CHANGE → REINIT PARTICLES
───────────────────────────── */
function observeThemeChange() {
  const html = document.documentElement;
  const observer = new MutationObserver(mutations => {
    mutations.forEach(m => {
      if (m.attributeName === 'data-theme') {
        // Destroy and reinit particles with correct color
        const canvas = document.querySelector('#particles-js canvas');
        if (canvas) canvas.remove();
        initParticles();
      }
    });
  });
  observer.observe(html, { attributes: true });
}

/* ─────────────────────────────
   EXPOSE GLOBALS
───────────────────────────── */
window.scrollToSection = scrollToSection;

/* ─────────────────────────────
   INIT ALL
───────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initAOS();
  initLoadingScreen();
  initScrollProgress();
  initScrollToTop();
  initCustomCursor();
  initParticles();
  initSidebar();
  initScrollSpy();
  initTypingAnimation();
  initStatCounters();
  initSkillBars();
  initCardTilt();
  initProfileEffects();
  initGlitchEffect();
  initContactForm();
  initSectionObserver();
  initProjectScreenshots();
  initCmdHint();
  observeThemeChange();
});