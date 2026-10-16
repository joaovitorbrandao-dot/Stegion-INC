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

  // 3. Hero Showcase: Multi-Image Auto Rotation & Smooth Transitions
  const slides = document.querySelectorAll('.showcase-slide');
  const dots = document.querySelectorAll('.slider-dot');
  const counterEl = document.getElementById('showcase-counter');
  const titleEl = document.getElementById('showcase-title');
  const urlEl = document.getElementById('showcase-url');
  const prevBtn = document.getElementById('slide-prev');
  const nextBtn = document.getElementById('slide-next');
  const showcaseFrame = document.querySelector('.showcase-frame');

  if (slides.length > 0) {
    let currentSlide = 0;
    let slideTimer = null;
    const totalSlides = slides.length;

    const showSlide = (index) => {
      currentSlide = (index + totalSlides) % totalSlides;

      slides.forEach((slide, i) => {
        const isActive = i === currentSlide;
        slide.classList.toggle('is-active', isActive);
      });

      dots.forEach((dot, i) => {
        const isActive = i === currentSlide;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      const activeSlide = slides[currentSlide];
      const name = activeSlide.dataset.name || '';
      const segment = activeSlide.dataset.segment || '';
      const url = activeSlide.dataset.url || '';

      if (counterEl) {
        counterEl.textContent = `${String(currentSlide + 1).padStart(2, '0')} / ${String(totalSlides).padStart(2, '0')}`;
      }
      if (titleEl) {
        titleEl.textContent = `${name} — ${segment}`;
      }
      if (urlEl) {
        urlEl.textContent = url;
      }
    };

    const startTimer = () => {
      stopTimer();
      slideTimer = setInterval(() => {
        showSlide(currentSlide + 1);
      }, 4200);
    };

    const stopTimer = () => {
      if (slideTimer) {
        clearInterval(slideTimer);
        slideTimer = null;
      }
    };

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.dataset.slide, 10);
        showSlide(idx);
        startTimer();
      });
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        showSlide(currentSlide - 1);
        startTimer();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        showSlide(currentSlide + 1);
        startTimer();
      });
    }

    if (showcaseFrame) {
      showcaseFrame.addEventListener('mouseenter', stopTimer);
      showcaseFrame.addEventListener('mouseleave', startTimer);
      showcaseFrame.addEventListener('touchstart', stopTimer, { passive: true });
      showcaseFrame.addEventListener('touchend', startTimer, { passive: true });
    }

    startTimer();
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
