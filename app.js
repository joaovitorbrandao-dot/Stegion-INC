(() => {
  'use strict';

  // 1. Header scroll effect
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

  // 2. Mobile navigation toggle
  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('header-nav');

  if (menuToggle && nav) {
    const toggleMenu = (open) => {
      const isExpanded = open !== undefined ? open : menuToggle.getAttribute('aria-expanded') !== 'true';
      menuToggle.setAttribute('aria-expanded', isExpanded);
      nav.classList.toggle('is-open', isExpanded);
    };

    menuToggle.addEventListener('click', () => toggleMenu());

    // Close when clicking nav links
    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    // Close when clicking outside
    document.addEventListener('click', (event) => {
      if (
        nav.classList.contains('is-open') &&
        !nav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        toggleMenu(false);
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        toggleMenu(false);
        menuToggle.focus();
      }
    });
  }

  // 3. Smooth IntersectionObserver animations
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
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1,
      }
    );

    animatedElements.forEach((el) => observer.observe(el));
  } else {
    // Fallback if IntersectionObserver is not available
    animatedElements.forEach((el) => el.classList.add('is-visible'));
  }
})();
