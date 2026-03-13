/* =============================================
   MODERN MOVING SYSTEMS — Main JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navigation ── */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navMobile = document.getElementById('navMobile');
  const navMobileClose = document.getElementById('navMobileClose');

  // Scroll state
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav?.classList.add('scrolled');
    } else {
      nav?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile toggle
  navToggle?.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navMobile?.classList.toggle('open');
    document.body.style.overflow = navMobile?.classList.contains('open') ? 'hidden' : '';
  });

  navMobileClose?.addEventListener('click', closeMobileNav);

  navMobile?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  function closeMobileNav() {
    navToggle?.classList.remove('open');
    navMobile?.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Scroll Animations (IntersectionObserver) ── */
  const animateObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        animateObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    animateObserver.observe(el);
  });

  /* ── Counter Animation ── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  /* ── Apartment Filter ── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const aptCards = document.querySelectorAll('.apt-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      aptCards.forEach(card => {
        const city = card.getAttribute('data-city');
        if (filter === 'all' || city === filter) {
          card.style.display = '';
          card.style.animation = 'fadeInCard 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Add card fade animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInCard {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);

  /* ── FAQ Accordion ── */
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const item = question.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));

      // Open clicked if it was closed
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── Booking / Contact Form ── */
  document.querySelectorAll('form[data-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = form.querySelector('[type="submit"]');
      const originalText = btn.innerHTML;

      // Validate required fields
      let valid = true;
      form.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = '#E05252';
          setTimeout(() => field.style.borderColor = '', 2000);
        }
      });

      if (!valid) return;

      // Loading state
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;

      // Simulate submission (replace with real API call)
      setTimeout(() => {
        const successEl = form.closest('.form-wrap')?.querySelector('.form-success');
        if (successEl) {
          form.style.display = 'none';
          successEl.style.display = 'block';
        } else {
          btn.innerHTML = '<i class="fa-solid fa-check"></i> Request Sent!';
          btn.style.background = 'linear-gradient(135deg, #27AE60, #219150)';
          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            btn.style.background = '';
            form.reset();
          }, 3000);
        }
      }, 1400);
    });
  });

  /* ── Smooth Scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── Phone number formatting ── */
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  phoneInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length >= 3 && val.length <= 6) {
        val = `(${val.slice(0,3)}) ${val.slice(3)}`;
      } else if (val.length > 6) {
        val = `(${val.slice(0,3)}) ${val.slice(3,6)}-${val.slice(6,10)}`;
      }
      e.target.value = val;
    });
  });

  /* ── Moving Cost Calculator ── */
  (function initCalc() {
    if (!document.getElementById('calc-result')) return;

    // ── Data tables ──
    const WEIGHTS = { studio: 2000, '1bed': 3500, '2bed': 5500, '3bed': 8500, '4bed': 12000 };
    const WEIGHT_LABELS = { studio: '2,000', '1bed': '3,500', '2bed': '5,500', '3bed': '8,500', '4bed': '12,000' };
    const CREW = {
      '2': { lbsPerHr: 1000, rate: 120, label: '1,000 lbs/hr', rateLabel: '$120/hr' },
      '3': { lbsPerHr: 1500, rate: 165, label: '1,500 lbs/hr', rateLabel: '$165/hr' },
      '4': { lbsPerHr: 2000, rate: 210, label: '2,000 lbs/hr', rateLabel: '$210/hr' },
    };
    const FLOOR_MULT = { '0': 1.0, '1': 1.15, '2': 1.28, '3': 1.42 };
    const TRAVEL_HRS = { local: 0.5, near: 1.0, mid: 1.5, far: 2.5 };
    const MINIMUM_HRS = 3;

    // ── State ──
    let state = { size: 'studio', crew: '2', floor: '0', distance: 'local' };

    // ── Wire up toggle button groups ──
    ['calc-size', 'calc-crew', 'calc-floor', 'calc-distance'].forEach(groupId => {
      const group = document.getElementById(groupId);
      if (!group) return;
      const key = groupId.replace('calc-', '');
      group.querySelectorAll('.calc-opt').forEach(btn => {
        btn.addEventListener('click', () => {
          group.querySelectorAll('.calc-opt').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          state[key] = btn.dataset.val;
          recalc();
        });
      });
    });

    // ── Wire up add-on checkboxes ──
    ['addon-piano', 'addon-pooltable', 'addon-safe', 'addon-packing'].forEach(id => {
      document.getElementById(id)?.addEventListener('change', recalc);
    });

    // ── Core calculation ──
    function recalc() {
      const crewData  = CREW[state.crew];
      const baseWeight = WEIGHTS[state.size]
        + (document.getElementById('addon-piano')?.checked    ? 500 : 0)
        + (document.getElementById('addon-pooltable')?.checked ? 800 : 0)
        + (document.getElementById('addon-safe')?.checked     ? 300 : 0);

      const baseHrs   = baseWeight / crewData.lbsPerHr;
      const floorHrs  = baseHrs * FLOOR_MULT[state.floor];
      const travelHrs = TRAVEL_HRS[state.distance];
      const packingHrs = document.getElementById('addon-packing')?.checked ? 2 : 0;
      const rawHrs    = floorHrs + travelHrs + packingHrs;
      const totalHrs  = Math.max(rawHrs, MINIMUM_HRS);

      const pianoSurcharge    = document.getElementById('addon-piano')?.checked    ? 75  : 0;
      const poolSurcharge     = document.getElementById('addon-pooltable')?.checked ? 100 : 0;
      const baseCost          = totalHrs * crewData.rate + pianoSurcharge + poolSurcharge;
      const low  = Math.round(baseCost * 0.9  / 5) * 5;
      const high = Math.round(baseCost * 1.15 / 5) * 5;

      // ── Update DOM ──
      document.getElementById('calc-hours').textContent = totalHrs.toFixed(1);
      document.getElementById('calc-low').textContent   = '$' + low.toLocaleString();
      document.getElementById('calc-high').textContent  = '$' + high.toLocaleString();

      // breakdown
      document.getElementById('bd-weight').textContent = baseWeight.toLocaleString() + ' lbs';
      document.getElementById('bd-speed').textContent  = crewData.label;
      document.getElementById('bd-hours').textContent  = totalHrs.toFixed(1) + ' hrs';
      document.getElementById('bd-rate').textContent   = crewData.rateLabel;

      // sub-labels
      const weightNote = document.getElementById('calc-weight-note');
      if (weightNote) weightNote.innerHTML =
        'Approx. <strong>' + WEIGHT_LABELS[state.size] + ' lbs</strong> of furniture &amp; belongings';

      const crewNote = document.getElementById('calc-crew-note');
      if (crewNote) crewNote.innerHTML =
        'Moves <strong>' + crewData.label + '</strong> · Rate: <strong>' + crewData.rateLabel + '</strong>';
    }

    recalc(); // run on page load
  })();

  /* ── Parallax hero (subtle) ── */
  const heroBg = document.querySelector('.hero-grid');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrolled * 0.15}px)`;
      }
    }, { passive: true });
  }

});
