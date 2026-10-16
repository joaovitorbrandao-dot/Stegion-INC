(() => {
  'use strict';

  // 1. Transparent Header with Scroll Blur
  const header = document.getElementById('site-header');
  const handleScroll = () => {
    if (!header) return;
    if (window.scrollY > 24) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. Mobile Navigation Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('header-nav');

  if (menuToggle && nav) {
    const toggleMenu = (open) => {
      const isExpanded = open !== undefined ? open : menuToggle.getAttribute('aria-expanded') !== 'true';
      menuToggle.setAttribute('aria-expanded', isExpanded);
      nav.classList.toggle('is-open', isExpanded);
    };

    menuToggle.addEventListener('click', () => toggleMenu());

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    document.addEventListener('click', (event) => {
      if (
        nav.classList.contains('is-open') &&
        !nav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        toggleMenu(false);
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        toggleMenu(false);
        menuToggle.focus();
      }
    });
  }

  // Full-bleed hero photography with automatic transitions.
  const hero = document.getElementById('hero');
  const heroImages = Array.from(document.querySelectorAll('.hero-backdrop'));
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  if (hero && heroImages.length) {
    let current = 0, timer = null, request = 0;
    let paused = reducedMotion.matches;
    const stop = () => { clearTimeout(timer); timer = null; };
    const load = async (index) => {
      const image = heroImages[index];
      if (image.dataset.src) { image.src = image.dataset.src; delete image.dataset.src; }
      try { await image.decode(); return image.naturalWidth > 0; } catch { return false; }
    };
    const schedule = () => {
      stop();
      if (!paused && !document.hidden) timer = setTimeout(() => show(current + 1), 5500);
    };
    const show = async (index) => {
      stop();
      const next = (index + heroImages.length) % heroImages.length;
      const token = ++request;
      const ready = await load(next);
      if (token !== request) return;
      if (ready) {
        current = next;
        heroImages.forEach((image, i) => image.classList.toggle('is-active', i === current));
        void load((current + 1) % heroImages.length);
      }
      schedule();
    };
    document.addEventListener('visibilitychange', schedule);
    reducedMotion.addEventListener('change', () => {
      paused = reducedMotion.matches; schedule();
    });
    hero.addEventListener('focusin', stop);
    hero.addEventListener('focusout', schedule);
    let touchStart = null;
    hero.addEventListener('touchstart', event => {
      if (event.touches.length === 1 && !event.target.closest('a,button,input,textarea,select')) {
        touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
      } else touchStart = null;
    }, { passive: true });
    hero.addEventListener('touchend', event => {
      if (!touchStart) return;
      const dx = event.changedTouches[0].clientX - touchStart.x;
      const dy = event.changedTouches[0].clientY - touchStart.y;
      touchStart = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) void show(current + (dx < 0 ? 1 : -1));
    }, { passive: true });
    hero.addEventListener('touchcancel', () => { touchStart = null; }, { passive: true });
    void load(1);
    schedule();
  }

  // 4. Testimonials Marquee: Infinite Horizontal Scroll
  const track = document.getElementById('testimonials-track');
  const marqueeWrapper = document.getElementById('testimonials-marquee');

  if (track && marqueeWrapper) {
    // Clone cards to ensure seamless continuous scroll
    const originalCards = Array.from(track.children);
    originalCards.forEach((card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });

    // Touch & Mouse Drag scroll support
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    marqueeWrapper.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - marqueeWrapper.offsetLeft;
      scrollLeft = marqueeWrapper.scrollLeft;
      track.style.animationPlayState = 'paused';
    });

    marqueeWrapper.addEventListener('mouseleave', () => {
      isDown = false;
      track.style.animationPlayState = 'running';
    });

    marqueeWrapper.addEventListener('mouseup', () => {
      isDown = false;
      track.style.animationPlayState = 'running';
    });

    marqueeWrapper.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - marqueeWrapper.offsetLeft;
      const walk = (x - startX) * 1.5;
      marqueeWrapper.scrollLeft = scrollLeft - walk;
    });
  }

  // 5. Smooth Scroll Animations
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.1,
      }
    );

    animatedElements.forEach((el) => observer.observe(el));
  } else {
    animatedElements.forEach((el) => el.classList.add('is-visible'));
  }
})();
