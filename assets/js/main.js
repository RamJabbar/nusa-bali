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
  initGalleryModal();
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

/* ---------- 6. Jendela Keabadian Pusaka — Interactive Archival Modal ---------- */
const GALLERY_ARCHIVES = [
  {
    id: 1,
    title: 'Canang Sari & Porosan Suci',
    category: '■ YADNYA SEHARIAN',
    subtitle: 'No. 01 / Hening Fajar',
    image: 'assets/images/galeri/canang-sari.jpg',
    alt: 'Tangan terampil merangkai persembahan syukur setiap fajar mengawali hari',
    desc: 'Tangan terampil merangkai persembahan syukur setiap fajar mengawali hari, mengikat bunga gumitir, daun pisang, dan canang dengan ketulusan yadnya. Porosan—sirih, kapur, dan pinang—menjadi jantung persembahan yang menyimbolkan keteguhan bhakti dan keharmonisan Trimurti.',
    location: 'Banjar Taman, Ubud & Griya se-Bali',
    philosophy: 'Tri Kaya Parisudha & Yadnya Tulus Ikhlas',
    status: 'Tradisi Harian Hidup (Living Heritage)'
  },
  {
    id: 2,
    title: 'Petani & Warisan Subak',
    category: '■ FILOSOFI TRI HITA KARANA • WARISAN UNESCO',
    subtitle: 'No. 02 / Lanskap Kosmologis',
    image: 'assets/images/galeri/petani-subak.jpg',
    alt: 'Petani berjalan memanggul cangkul di terasering sawah subak Jatiluwih',
    desc: 'Harmoni suci antara manusia, alam pertiwi, dan Sang Hyang Widhi di petak terasering Jatiluwih; keteraturan air yang dialirkan lewat kepemimpinan pekaseh subak berdasarkan siklus upacara Pura Ulun Swi yang telah bertahan ribuan tahun.',
    location: 'Terasering Jatiluwih, Tabanan',
    philosophy: 'Tri Hita Karana & Tri Mandala Pertanian Kosmologis',
    status: 'Warisan Budaya Dunia UNESCO (Ditetapkan 2012)'
  },
  {
    id: 3,
    title: 'Pura Ulun Danu Beratan & Tirta Kesuburan',
    category: '■ DEWI DANU KAHYANGAN',
    subtitle: 'No. 03 / Tirta Danu',
    image: 'assets/images/galeri/ulun-danu-beratan.jpg',
    alt: 'Pura Ulun Danu Beratan di atas danau berkabut Bedugul',
    desc: 'Kabut hening dan pantulan candi di atas danau sakral sumber mata air kehidupan bagi belahan utara dan tengah pulau Dewata. Bangunan pelinggih bertingkat ini memuliakan Sang Hyang Dewi Danu sebagai penguasa air, kesuburan, dan kesejahteraan alam.',
    location: 'Danau Beratan, Candikuning, Tabanan',
    philosophy: 'Hulu-Teba & Pemuliaan Tirta Amerta',
    status: 'Kawasan Cagar Budaya Nasional Terlindungi'
  },
  {
    id: 4,
    title: 'Anak-anak Belajar Gamelan di Banjar',
    category: '■ REGENERASI BUDAYA',
    subtitle: 'No. 04 / Genta Suara',
    image: 'assets/images/galeri/anak-gamelan.jpg',
    alt: 'Anak-anak desa belajar gamelan bersama di balai banjar',
    desc: 'Pewarisan laras slendro secara organik selepas sekolah di balai desa, menyatukan ritme generasi penerus dengan detak gamelan warisan leluhur. Lewat tradisi maguru panggul, anak-anak menghayati musikalitas, disiplin, dan ikatan sosial banjar.',
    location: 'Balai Banjar Kawan, Bangli & Gianyar',
    philosophy: 'Maguru Panggul, Gotong Royong & Rasa Musikal Banjar',
    status: 'Pelestarian Berbasis Komunitas Desa Adat'
  },
  {
    id: 5,
    title: 'Pedagang Banten di Pasar Pagi',
    category: '■ DENYUT PASAR TRADISIONAL',
    subtitle: 'No. 05 / Roda Yadnya',
    image: 'assets/images/galeri/pedagang-banten.jpg',
    alt: 'Pedagang banten tersenyum ramah di pasar tradisional Bali',
    desc: 'Geliat perniagaan dupa, janur, dan bunga marigold segar yang berakar kuat pada laku ritual; ruang bertemunya kebutuhan persembahan harian dengan kerukunan sosial dan denyut ekonomi dharma masyarakat agraris.',
    location: 'Pasar Tradisional Kumbasari & Kreneng, Denpasar',
    philosophy: 'Ekonomi Dharma & Mutualisme Ritual Kerakyatan',
    status: 'Ekosistem Budaya & Tradisi Pasar Rakyat'
  }
];

function initGalleryModal() {
  const modal = document.getElementById('galleryModal');
  const backdrop = document.getElementById('galleryModalBackdrop');
  const closeBtn = document.getElementById('galleryModalClose');
  const prevBtn = document.getElementById('galleryModalPrev');
  const nextBtn = document.getElementById('galleryModalNext');

  const imgEl = document.getElementById('galleryModalImg');
  const catEl = document.getElementById('galleryModalCat');
  const counterEl = document.getElementById('galleryModalCounter');
  const titleEl = document.getElementById('galleryModalTitle');
  const descEl = document.getElementById('galleryModalDesc');
  const locEl = document.getElementById('galleryModalLoc');
  const philEl = document.getElementById('galleryModalPhil');
  const statusEl = document.getElementById('galleryModalStatus');

  const cards = document.querySelectorAll('.gallery-etno-card');

  if (!modal || !cards.length) return;

  let currentIndex = 0;
  let lastActiveElement = null;

  const renderArchive = (index) => {
    const data = GALLERY_ARCHIVES[index];
    if (!data) return;

    if (imgEl) {
      imgEl.src = data.image;
      imgEl.alt = data.alt;
    }
    if (catEl) catEl.textContent = data.category;
    if (counterEl) counterEl.textContent = `0${data.id} / 0${GALLERY_ARCHIVES.length}`;
    if (titleEl) titleEl.textContent = data.title;
    if (descEl) descEl.textContent = data.desc;
    if (locEl) locEl.textContent = data.location;
    if (philEl) philEl.textContent = data.philosophy;
    if (statusEl) statusEl.textContent = data.status;
  };

  const openModal = (id) => {
    const foundIndex = GALLERY_ARCHIVES.findIndex((item) => item.id === Number(id));
    currentIndex = foundIndex >= 0 ? foundIndex : 0;
    renderArchive(currentIndex);

    lastActiveElement = document.activeElement;
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus close button for accessibility
    if (closeBtn) closeBtn.focus();
  };

  const closeModal = () => {
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
  };

  const showNext = () => {
    currentIndex = (currentIndex + 1) % GALLERY_ARCHIVES.length;
    renderArchive(currentIndex);
  };

  const showPrev = () => {
    currentIndex = (currentIndex - 1 + GALLERY_ARCHIVES.length) % GALLERY_ARCHIVES.length;
    renderArchive(currentIndex);
  };

  // Wire up cards
  cards.forEach((card) => {
    const cardId = card.dataset.galleryId;
    card.addEventListener('click', () => openModal(cardId));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(cardId);
      }
    });
  });

  // Modal controls
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);
  if (nextBtn) nextBtn.addEventListener('click', showNext);
  if (prevBtn) prevBtn.addEventListener('click', showPrev);

  // Keyboard navigation inside modal
  window.addEventListener('keydown', (e) => {
    if (modal.hidden) return;

    if (e.key === 'Escape') {
      closeModal();
    } else if (e.key === 'ArrowRight') {
      showNext();
    } else if (e.key === 'ArrowLeft') {
      showPrev();
    }
  });
}
