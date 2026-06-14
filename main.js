/* ============================================================
   TTS FM — shared site JavaScript
   Loaded on every page. Defensive: every hook is guarded so the
   same file works whether or not a given element exists.
   Requires (optional, CDN): Lenis, gsap, ScrollTrigger.
   ============================================================ */
(function () {
  'use strict';

  var reduce  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGSAP = typeof window.gsap !== 'undefined';
  var hasST   = hasGSAP && typeof window.ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  /* ── Lenis smooth scroll (driven once) ───────────────── */
  if (typeof window.Lenis !== 'undefined' && !reduce) {
    var lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    if (hasST) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })();
    }
  }

  /* ── Nav: solid/glass on scroll (CSS handles the rest) ── */
  var siteNav = document.getElementById('siteNav');
  if (siteNav) {
    var onScroll = function () { siteNav.classList.toggle('scrolled', window.scrollY > 40); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Nav: hamburger / drawer ─────────────────────────── */
  var hamburger   = document.getElementById('navHamburger');
  var drawerClose = document.getElementById('drawerClose');
  var overlay     = document.getElementById('drawerOverlay');
  function openNav()  { document.body.classList.add('nav-open');    if (hamburger) hamburger.setAttribute('aria-expanded', 'true'); }
  function closeNav() { document.body.classList.remove('nav-open'); if (hamburger) hamburger.setAttribute('aria-expanded', 'false'); }
  if (hamburger)   hamburger.addEventListener('click', openNav);
  if (drawerClose) drawerClose.addEventListener('click', closeNav);
  if (overlay)     overlay.addEventListener('click', closeNav);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });

  document.querySelectorAll('.drawer-nav-link').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.drawer-nav-item');
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.drawer-nav-item').forEach(function (i) {
        i.classList.remove('open');
        var link = i.querySelector('.drawer-nav-link');
        if (link) link.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) { item.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
    });
  });

  /* ── Kinetic headline (build word by word) ───────────── */
  var kin = document.querySelector('[data-kinetic]');
  if (kin) {
    var words = kin.textContent.trim().split(/\s+/);
    kin.innerHTML = words.map(function (w) { return '<span class="kw"><span>' + w + '</span></span>'; }).join(' ');
    if (hasGSAP && !reduce) {
      gsap.from(kin.querySelectorAll('.kw > span'), {
        yPercent: 120, opacity: 0, duration: 0.85, ease: 'power3.out', stagger: 0.08, delay: 0.15
      });
    }
  }

  /* ── Animated stat counters ──────────────────────────── */
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var target = parseFloat(el.dataset.count);
    if (reduce) { el.textContent = target; return; }
    var dur = 1500, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target).toString();
      if (p < 1) requestAnimationFrame(step); else el.textContent = target.toString();
    }
    requestAnimationFrame(step);
  });

  /* ── Reveal on scroll ────────────────────────────────── */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if (hasST && !reduce) {
      revealEls.forEach(function (el) {
        el.style.transition = 'none';
        gsap.fromTo(el, { opacity: 0, y: 34 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 86%', once: true } });
      });
    } else if ('IntersectionObserver' in window && !reduce) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); } });
      }, { threshold: 0.12 });
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('revealed'); });
    }
  }

  /* ── Magnetic buttons (desktop, fine pointer only) ───── */
  if (!reduce && window.matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('.btn-magnetic').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        btn.style.transform = 'translate(' + (x * 0.25) + 'px,' + (y * 0.35) + 'px)';
      });
      btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
    });
  }

  /* ── Testimonial carousel (manual; supports both markup conventions) ── */
  var tTrack = document.getElementById('testimonialTrack') || document.getElementById('testTrack');
  var tDots  = document.querySelectorAll('.testimonial-dot, .test-dot');
  var tPrev  = document.getElementById('testPrev');
  var tNext  = document.getElementById('testNext');
  if (tTrack && tDots.length) {
    var tIdx = 0;
    var show = function (n) {
      tDots[tIdx].classList.remove('active');
      tIdx = (n + tDots.length) % tDots.length;
      tTrack.style.transform = 'translateX(-' + (tIdx * 100) + '%)';
      tDots[tIdx].classList.add('active');
    };
    if (tPrev) tPrev.addEventListener('click', function () { show(tIdx - 1); });
    if (tNext) tNext.addEventListener('click', function () { show(tIdx + 1); });
    tDots.forEach(function (dot, i) { dot.addEventListener('click', function () { show(i); }); });
  }

  /* ── Scroll to top ───────────────────────────────────── */
  var scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    window.addEventListener('scroll', function () {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    scrollTopBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  /* ── Dark mode: init, inject toggle, persist ─────────── */
  (function theme() {
    var root = document.documentElement;
    var stored = null;
    try { stored = localStorage.getItem('tts-theme'); } catch (e) {}
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', stored || (prefersDark ? 'dark' : 'light'));

    var navInner = document.querySelector('.nav-inner');
    if (!navInner) return;
    var btn = document.createElement('button');
    btn.className = 'theme-toggle';
    btn.type = 'button';
    function sync() {
      var dark = root.getAttribute('data-theme') === 'dark';
      btn.innerHTML = '<i class="fa-solid fa-' + (dark ? 'sun' : 'moon') + '" aria-hidden="true"></i>';
      btn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
      btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
    }
    sync();
    var ham = document.getElementById('navHamburger');
    if (ham) navInner.insertBefore(btn, ham); else navInner.appendChild(btn);
    btn.addEventListener('click', function () {
      root.classList.add('theme-anim');
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('tts-theme', next); } catch (e) {}
      sync();
      window.setTimeout(function () { root.classList.remove('theme-anim'); }, 450);
    });
  })();

  /* ── Sticky mobile quote bar (every page except contact) ── */
  (function quoteBar() {
    var page = location.pathname.split('/').pop() || 'index.html';
    if (page === 'contact.html') return;
    if (document.querySelector('.mobile-quote-bar')) return;
    var bar = document.createElement('div');
    bar.className = 'mobile-quote-bar';
    bar.innerHTML =
      '<span class="mqb-text">Free site assessment<small>No obligation · 1 working day</small></span>' +
      '<a class="btn btn-lime" href="contact.html">Get a quote</a>';
    document.body.appendChild(bar);
    document.body.classList.add('has-quote-bar');
  })();

})();
