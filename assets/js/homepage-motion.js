(function () {
  'use strict';
  if (!document.body.classList.contains('aow-home-polished') ||
      !('IntersectionObserver' in window) || !Element.prototype.animate) return;

  var preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches) return;

  // Animate only on entry: content stays visible if JavaScript is unavailable.
  // Keep the hero, navigation and horizontal carousel's own motion independent.
  var targets = document.querySelectorAll([
    '.aow-bohm-frame',
    '.elementor-element-9a6707f',
    '.aow-section-header',
    '.aow-explore-card',
    '.aow-she-layout > :first-child',
    '.aow-pillar-item',
    '.aow-founder-card',
    '.aow-resource-card',
    '#aow-blog-track',
    '.aow-section-footer-cta',
    '.elementor-element-1d9d88d'
  ].join(','));
  var active = new Map();
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var element = entry.target;
      observer.unobserve(element);
      element.dataset.aowMotion = 'revealed';
      if (preference.matches || element.contains(document.activeElement)) return;
      var siblings = Array.from(element.parentElement.children);
      var stagger = Math.min(siblings.indexOf(element), 2) * 55;
      var animation = element.animate([
        { opacity: 0, transform: 'translateY(18px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], {
        duration: 520,
        delay: stagger,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        fill: 'backwards'
      });
      active.set(element, animation);
      animation.onfinish = function () { active.delete(element); };
    });
  }, { rootMargin: '0px 0px -32px 0px', threshold: 0 });

  targets.forEach(function (element) {
    // Initial viewport and restored scroll positions should appear immediately.
    if (element.getBoundingClientRect().top < window.innerHeight) {
      element.dataset.aowMotion = 'revealed';
    } else {
      element.dataset.aowMotion = 'pending';
      observer.observe(element);
    }
  });

  document.addEventListener('focusin', function (event) {
    targets.forEach(function (element) {
      if (!element.contains(event.target)) return;
      observer.unobserve(element);
      element.dataset.aowMotion = 'revealed';
      if (active.has(element)) {
        active.get(element).cancel();
        active.delete(element);
      }
    });
  });

  preference.addEventListener('change', function (event) {
    if (!event.matches) return;
    observer.disconnect();
    active.forEach(function (animation) { animation.cancel(); });
    active.clear();
    targets.forEach(function (element) { element.dataset.aowMotion = 'revealed'; });
  });
})();
