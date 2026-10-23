/**
 * ALL ONE WORLD - Main Interactive & Animation Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. STICKY HEADER & SCROLL TO TOP
  // --------------------------------------------------------------------------
  const header = document.querySelector('.site-header');
  const scrollTopBtn = document.querySelector('.scroll-top-btn');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (scrollY > 400) {
      scrollTopBtn?.classList.add('visible');
    } else {
      scrollTopBtn?.classList.remove('visible');
    }
  });

  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // --------------------------------------------------------------------------
  // 2. MOBILE MENU TOGGLE
  // --------------------------------------------------------------------------
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const navMenu = document.querySelector('.nav-menu');

  // Create backdrop if not already there
  let backdrop = document.querySelector('.menu-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'menu-backdrop';
    Object.assign(backdrop.style, {
      position: 'fixed',
      inset: '0',
      backgroundColor: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(3px)',
      zIndex: '1040',
      opacity: '0',
      visibility: 'hidden',
      transition: 'all 0.3s ease'
    });
    document.body.appendChild(backdrop);
  }

  function toggleMenu() {
    const isOpen = navMenu.classList.toggle('open');
    hamburgerBtn.classList.toggle('open');
    if (isOpen) {
      backdrop.style.opacity = '1';
      backdrop.style.visibility = 'visible';
      document.body.style.overflow = 'hidden';
    } else {
      backdrop.style.opacity = '0';
      backdrop.style.visibility = 'hidden';
      document.body.style.overflow = '';
    }
  }

  hamburgerBtn?.addEventListener('click', toggleMenu);
  backdrop?.addEventListener('click', toggleMenu);

  // Close menu when clicking nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        toggleMenu();
      }
    });
  });

  // --------------------------------------------------------------------------
  // 3. HERO WORD ROTATOR / CAROUSEL ("all one", "all alone", "alloneworld")
  // --------------------------------------------------------------------------
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  let currentSlide = 0;
  let slideInterval = null;
  const slideDuration = 4000;

  function showSlide(index) {
    slides.forEach((slide, idx) => {
      slide.classList.remove('active', 'prev');
      if (idx === index) {
        slide.classList.add('active');
      } else if (idx === currentSlide) {
        slide.classList.add('prev');
      }
    });

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === index);
    });

    currentSlide = index;
  }

  function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }

  function startSlider() {
    stopSlider();
    slideInterval = setInterval(nextSlide, slideDuration);
  }

  function stopSlider() {
    if (slideInterval) clearInterval(slideInterval);
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      showSlide(idx);
      startSlider();
    });
  });

  const heroWrap = document.querySelector('.hero-slider-wrap');
  if (heroWrap) {
    heroWrap.addEventListener('mouseenter', stopSlider);
    heroWrap.addEventListener('mouseleave', startSlider);
  }

  if (slides.length > 0) {
    startSlider();
  }

  // --------------------------------------------------------------------------
  // 4. INTERSECTION OBSERVER REVEAL ANIMATIONS
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal-fade');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('active'));
  }

  // --------------------------------------------------------------------------
  // 5. NEWSLETTER FORM HANDLER
  // --------------------------------------------------------------------------
  const newsletterForm = document.querySelector('.newsletter-form');
  const feedback = document.querySelector('.form-feedback');

  newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = newsletterForm.querySelector('.newsletter-input');
    const email = input?.value.trim();

    if (email && email.includes('@')) {
      feedback.textContent = 'Thank you! You have successfully subscribed to the All One World mailing list.';
      feedback.className = 'form-feedback success';
      input.value = '';
    }
  });
});
