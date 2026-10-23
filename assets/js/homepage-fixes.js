/* Homepage interactions and the user-requested homepage-only client demo. */
(function () {
  'use strict';
  if (!document.body.classList.contains('aow-home-polished')) return;
  var root = document.getElementById('aow-lang-selector-root');
  document.body.appendChild(root);
  var trigger = document.getElementById('aow-lang-trigger');
  var dropdown = document.getElementById('aow-lang-dropdown');
  var items = Array.from(root.querySelectorAll('[role="option"]'));
  var toast = document.getElementById('aow-demo-toast');
  var toastTimer;
  function announce(message) {
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('is-visible'); }, 6500);
  }
  document.addEventListener('click', function (event) {
    var link = event.target.closest('a[href]');
    if (!link || link.closest('#aow-lang-selector-root') || link.classList.contains('aow-whatsapp-contact')) return;
    var href = link.getAttribute('href');
    if (!href || href.charAt(0) === '#') return;
    event.preventDefault();
    event.stopImmediatePropagation();
    announce('Demo Presentation: Navigation locked to Homepage.');
  }, true);
  function close(restoreFocus) {
    root.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    dropdown.inert = true;
    if (restoreFocus) trigger.focus();
  }
  function open() {
    root.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    dropdown.inert = false;
    setTimeout(function () {
      if (root.classList.contains('is-open')) {
        (items.find(function (item) { return item.getAttribute('aria-selected') === 'true'; }) || items[0]).focus();
      }
    }, 200);
  }
  close(false);
  trigger.addEventListener('click', function () { root.classList.contains('is-open') ? close(false) : open(); });
  document.getElementById('aow-lang-backdrop').addEventListener('click', function () { close(false); });
  document.addEventListener('click', function (event) { if (!root.contains(event.target)) close(false); });
  root.addEventListener('focusout', function () { setTimeout(function () { if (!root.contains(document.activeElement)) close(false); }, 0); });
  root.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && root.classList.contains('is-open')) { event.preventDefault(); close(true); }
    var index = items.indexOf(document.activeElement);
    if (index < 0) return;
    var next;
    if (event.key === 'ArrowDown') next = (index + 1) % items.length;
    if (event.key === 'ArrowUp') next = (index + items.length - 1) % items.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = items.length - 1;
    if (next !== undefined) { event.preventDefault(); items[next].focus(); }
  });
  function translationReady() {
    return new Promise(function (resolve, reject) {
      var combo = document.querySelector('select.goog-te-combo');
      if (combo && combo.options.length > 1) { resolve(combo); return; }
      // Use the Google Translate integration already supplied by GTranslate.
      if (!window.gt_translate_script) {
        if (typeof window.googleTranslateElementInit2 !== 'function') { reject(new Error('Translation unavailable')); return; }
        var script = document.createElement('script');
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit2';
        window.gt_translate_script = script;
        document.body.appendChild(script);
      }
      var started = Date.now();
      var timer = setInterval(function () {
        var control = document.querySelector('select.goog-te-combo');
        if (control && control.options.length > 1) { clearInterval(timer); resolve(control); }
        else if (Date.now() - started > 10000) { clearInterval(timer); reject(new Error('Translation unavailable')); }
      }, 150);
    });
  }
  var changingLanguage = false;
  items.forEach(function (item) {
    item.addEventListener('click', async function () {
      if (changingLanguage) return;
      var lang = item.dataset.lang;
      if (item.getAttribute('aria-selected') === 'true') { close(true); return; }
      changingLanguage = true;
      trigger.setAttribute('aria-busy', 'true');
      close(true);
      announce('Loading translation…');
      try {
        var combo = await translationReady();
        combo.value = lang;
        if (combo.value !== lang) throw new Error('Language unavailable');
        combo.dispatchEvent(new Event('change', { bubbles: true }));
        items.forEach(function (option) {
          var selected = option === item;
          option.classList.toggle('is-active', selected);
          option.setAttribute('aria-selected', String(selected));
        });
        document.getElementById('aow-lang-current-flag').src = item.dataset.flag;
        var label = document.getElementById('aow-lang-current-label');
        label.textContent = item.dataset.native;
        label.dir = ['ar', 'ur'].includes(lang) ? 'rtl' : 'ltr';
        announce('Translation requested: ' + item.dataset.name + '.');
      } catch (error) {
        announce('Translation could not load. Please check your connection and try again.');
      } finally {
        changingLanguage = false;
        trigger.removeAttribute('aria-busy');
      }
    });
  });
  // Restore the provider's saved selection when returning to the page.
  var saved = document.cookie.match(/(?:^|;\s*)googtrans=\/en\/([^;]+)/);
  var savedItem = saved && items.find(function (item) { return item.dataset.lang === saved[1]; });
  if (savedItem) {
    items.forEach(function (item) { item.classList.toggle('is-active', item === savedItem); item.setAttribute('aria-selected', String(item === savedItem)); });
    document.getElementById('aow-lang-current-label').textContent = savedItem.dataset.native;
    document.getElementById('aow-lang-current-flag').src = savedItem.dataset.flag;
  }
  var slider = document.getElementById('aow-blog-track');
  if (slider) {
    var previous = document.getElementById('aow-blog-prev');
    var next = document.getElementById('aow-blog-next');
    function sliderState() {
      previous.disabled = slider.scrollLeft < 3;
      next.disabled = slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 3;
    }
    function moveSlide(direction) {
      var card = slider.querySelector('article');
      var step = card.getBoundingClientRect().width + 24;
      slider.scrollBy({left: direction * step, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
    }
    previous.addEventListener('click', function () { moveSlide(-1); });
    next.addEventListener('click', function () { moveSlide(1); });
    slider.addEventListener('scroll', sliderState, {passive: true});
    slider.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault(); moveSlide(event.key === 'ArrowRight' ? 1 : -1);
      }
    });
    window.addEventListener('resize', sliderState);
    sliderState();
    var carousel = slider.closest('section');
    var playback = document.getElementById('aow-blog-pause');
    var reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    var autoEnabled = !reducedMotion.matches;
    var isVisible = false;
    var autoTimer;
    function updatePlayback() {
      if (!playback) return;
      playback.textContent = autoEnabled ? 'Ⅱ' : '▶';
      playback.setAttribute('aria-label', autoEnabled ? 'Pause article slideshow' : 'Play article slideshow');
      playback.setAttribute('aria-pressed', String(!autoEnabled));
    }
    function scheduleSlide() {
      clearTimeout(autoTimer);
      if (!autoEnabled || !isVisible || document.hidden || carousel.matches(':hover') || carousel.contains(document.activeElement)) return;
      autoTimer = setTimeout(function () {
        if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 3) {
          slider.scrollTo({left: 0, behavior: 'smooth'});
        } else moveSlide(1);
        scheduleSlide();
      }, 5000);
    }
    if (playback) playback.addEventListener('click', function () { autoEnabled = !autoEnabled; updatePlayback(); scheduleSlide(); });
    carousel.addEventListener('mouseenter', function () { clearTimeout(autoTimer); });
    carousel.addEventListener('mouseleave', scheduleSlide);
    carousel.addEventListener('focusin', function () { clearTimeout(autoTimer); });
    carousel.addEventListener('focusout', function () { setTimeout(scheduleSlide, 0); });
    slider.addEventListener('pointerdown', function () { clearTimeout(autoTimer); });
    slider.addEventListener('pointerup', scheduleSlide);
    document.addEventListener('visibilitychange', scheduleSlide);
    reducedMotion.addEventListener('change', function () { if (reducedMotion.matches) { autoEnabled = false; updatePlayback(); scheduleSlide(); } });
    new IntersectionObserver(function (entries) { isVisible = entries[0].isIntersecting; scheduleSlide(); }, {threshold: .25}).observe(slider);
    updatePlayback();
  }
  var form = document.querySelector('.elementor-element-d67f47a form');
  if (!form) return;
  var status = document.createElement('p');
  status.className = 'aow-form-status';
  status.id = 'aow-newsletter-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  form.appendChild(status);
  form.querySelector('input[type="email"]').setAttribute('aria-describedby', status.id);
  var submitting = false;
  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    if (submitting || !form.reportValidity()) return;
    var endpoint = window.ElementorProFrontendConfig && window.ElementorProFrontendConfig.ajaxurl;
    // The static preview has no WordPress server; never submit personal data across origins.
    if (!endpoint || new URL(endpoint, location.href).origin !== location.origin) {
      status.textContent = 'Newsletter submission is unavailable in this homepage demo.';
      return;
    }
    submitting = true;
    var button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    form.setAttribute('aria-busy', 'true');
    status.textContent = 'Sending your subscription…';
    var timeout = new AbortController();
    var timer = setTimeout(function () { timeout.abort(); }, 15000);
    try {
      var data = new FormData(form);
      data.set('action', 'elementor_pro_forms_send_form');
      data.set('referrer', location.href);
      var response = await fetch(endpoint, { method: 'POST', body: data, credentials: 'same-origin', signal: timeout.signal });
      var result = await response.json();
      if (!response.ok || result.success !== true) throw new Error('Subscription failed');
      status.textContent = 'Thank you. Your subscription has been received.';
      form.reset();
    } catch (error) {
      status.textContent = 'Your subscription could not be confirmed. Please try again or contact hello@alloneworld.org.';
    } finally {
      clearTimeout(timer);
      submitting = false;
      button.disabled = false;
      form.removeAttribute('aria-busy');
    }
  }, true);
})();
