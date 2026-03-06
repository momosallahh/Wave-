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
