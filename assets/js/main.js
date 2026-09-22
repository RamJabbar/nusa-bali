/* =========================================================
   NUSA BALI HERITAGE — main.js
   Vanilla JS only — no dependencies.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initNavActiveState();
  initHeaderActions();
  initSitusFilter();
  initNewsletterForm();
  initFooterYear();
});

/* ---------- 1. Sticky header background on scroll ---------- */
function initStickyHeader() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  const toggle = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  };

  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
}

/* ---------- 1b. Active nav link highlight ---------- */
function initNavActiveState() {
  const navLinks = document.querySelectorAll('.nav-links a');
  if (!navLinks.length) return;

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.forEach((l) => l.removeAttribute('aria-current'));
      link.setAttribute('aria-current', 'page');
    });
  });

  const sections = Array.from(navLinks)
    .map((link) => {
      const href = link.getAttribute('href');
      return href && href.startsWith('#') ? document.querySelector(href) : null;
    })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              if (link.getAttribute('href') === `#${id}`) {
                link.setAttribute('aria-current', 'page');
              } else {
                link.removeAttribute('aria-current');
              }
            });
          }
        });
      },
      { rootMargin: '-25% 0px -65% 0px' }
    );

    sections.forEach((s) => observer.observe(s));
  }
}

/* ---------- 1c. Header action buttons (Gamelan & Theme) ---------- */
function initHeaderActions() {
  const gamelanBtn = document.getElementById('gamelanBtn');
  const heroAudioBtn = document.getElementById('heroAudioBtn');

  let isPlaying = false;
  const toggleGamelan = () => {
    isPlaying = !isPlaying;
    if (gamelanBtn) {
      gamelanBtn.classList.toggle('is-playing', isPlaying);
      gamelanBtn.setAttribute('aria-pressed', String(isPlaying));
    }
    if (heroAudioBtn) {
      heroAudioBtn.classList.toggle('is-playing', isPlaying);
      heroAudioBtn.setAttribute('aria-pressed', String(isPlaying));
    }
  };

  if (gamelanBtn) {
    gamelanBtn.addEventListener('click', toggleGamelan);
  }
  if (heroAudioBtn) {
    heroAudioBtn.addEventListener('click', toggleGamelan);
  }

  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
    });
  }
}

/* ---------- 2. Mobile nav toggle ---------- */
function initMobileNav() {
  const btn = document.getElementById('navToggle');
  const panel = document.getElementById('mobileNav');
  if (!btn || !panel) return;

  btn.addEventListener('click', () => {
    const isOpen = !panel.hidden;
    panel.hidden = isOpen;
    btn.setAttribute('aria-expanded', String(!isOpen));
  });

  // close the panel after tapping a link
  panel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      panel.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------- 3. Situs Budaya category filter chips ---------- */
function initSitusFilter() {
  const chips = document.querySelectorAll('.filter-chips .chip');
  const cards = document.querySelectorAll('#situsGrid .situs-card');
  const emptyState = document.getElementById('situsEmptyState');
  if (!chips.length || !cards.length) return;

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.remove('is-active'));
      chip.classList.add('is-active');

      const filter = chip.dataset.filter;
      let visibleCount = 0;

      cards.forEach((card) => {
        const matches = filter === 'semua' || card.dataset.category === filter;
        card.style.display = matches ? '' : 'none';
        if (matches) visibleCount += 1;
      });

      if (emptyState) emptyState.hidden = visibleCount > 0;
    });
  });
}

/* ---------- 4. Newsletter form (front-end only — no backend yet) ---------- */
function initNewsletterForm() {
  const form = document.getElementById('newsletterForm');
  const note = document.getElementById('newsletterNote');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = form.querySelector('#newsletterEmail')?.value.trim();

    if (!email) return;

    // TODO: hubungkan ke layanan email/backend sungguhan saat sudah siap.
    if (note) note.textContent = `Terima kasih, ${email} telah tercatat dalam daftar.`;
    form.reset();
  });
}

/* ---------- 5. Footer year ---------- */
function initFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}
