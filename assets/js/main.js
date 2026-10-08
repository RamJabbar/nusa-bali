// Nusa Bali Heritage — interaksi global & modal arsip pusaka

function initSharedFeatures() {
  setupHeaderScroll();
  setupMobileDrawer();
  setupScrollSpy();
  setupHeaderButtons();
  setupFilterSitus();
  setupNewsletter();
  setupCopyrightYear();
  setupGalleryModal();
}

function setupHeaderScroll() {
  const siteHeader = document.getElementById('siteHeader');
  if (!siteHeader) return;

  const handleScroll = () => {
    siteHeader.classList.toggle('is-scrolled', window.scrollY > 24);
  };

  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
}

function setupScrollSpy() {
  const menuLinks = document.querySelectorAll('.nav-links a');
  if (!menuLinks.length) return;

  menuLinks.forEach((link) => {
    link.addEventListener('click', () => {
      menuLinks.forEach((item) => item.removeAttribute('aria-current'));
      link.setAttribute('aria-current', 'page');
    });
  });

  const trackedSections = Array.from(menuLinks)
    .map((link) => {
      const targetHash = link.getAttribute('href');
      return targetHash && targetHash.startsWith('#') ? document.querySelector(targetHash) : null;
    })
    .filter(Boolean);

  if ('IntersectionObserver' in window && trackedSections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const activeId = entry.target.getAttribute('id');
            menuLinks.forEach((link) => {
              if (link.getAttribute('href') === `#${activeId}`) {
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

    trackedSections.forEach((sec) => spy.observe(sec));
  }
}

function setupHeaderButtons() {
  const audioTriggers = [
    document.getElementById('gamelanBtn'),
    document.getElementById('heroAudioBtn')
  ].filter(Boolean);

  let isSoundActive = false;
  const toggleSound = () => {
    isSoundActive = !isSoundActive;
    audioTriggers.forEach((btn) => {
      btn.classList.toggle('is-playing', isSoundActive);
      btn.setAttribute('aria-pressed', String(isSoundActive));
    });
  };

  audioTriggers.forEach((btn) => btn.addEventListener('click', toggleSound));

  const btnTheme = document.getElementById('themeToggle');
  if (btnTheme) {
    btnTheme.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
    });
  }
}

function setupMobileDrawer() {
  const toggleBtn = document.getElementById('navToggle');
  const drawerPanel = document.getElementById('mobileNav');
  if (!toggleBtn || !drawerPanel) return;

  toggleBtn.addEventListener('click', () => {
    const isClosed = drawerPanel.hidden;
    drawerPanel.hidden = !isClosed;
    toggleBtn.setAttribute('aria-expanded', String(isClosed));
  });

  drawerPanel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      drawerPanel.hidden = true;
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

function setupFilterSitus() {
  const filterPills = document.querySelectorAll('.filter-chips .chip');
  const situsCards = document.querySelectorAll('#situsGrid .situs-card');
  const emptyFeedback = document.getElementById('situsEmptyState');
  if (!filterPills.length || !situsCards.length) return;

  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      filterPills.forEach((p) => p.classList.remove('is-active'));
      pill.classList.add('is-active');

      const selectedCategory = pill.dataset.filter;
      let matchedCount = 0;

      situsCards.forEach((card) => {
        const matches = selectedCategory === 'semua' || card.dataset.category === selectedCategory;
        card.style.display = matches ? '' : 'none';
        if (matches) matchedCount += 1;
      });

      if (emptyFeedback) emptyFeedback.hidden = matchedCount > 0;
    });
  });
}

function setupNewsletter() {
  const newsletterForm = document.getElementById('newsletterForm');
  const feedbackNote = document.getElementById('newsletterNote');
  if (!newsletterForm) return;

  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailVal = newsletterForm.querySelector('#newsletterEmail')?.value.trim();
    if (!emailVal) return;

    if (feedbackNote) feedbackNote.textContent = `Terima kasih, ${emailVal} telah tercatat dalam daftar.`;
    newsletterForm.reset();
  });
}

function setupCopyrightYear() {
  const yearHolder = document.getElementById('footerYear');
  if (yearHolder) yearHolder.textContent = new Date().getFullYear();
}

const galleryArchives = [
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

function setupGalleryModal() {
  const modalBox = document.getElementById('galleryModal');
  const overlayBackdrop = document.getElementById('galleryModalBackdrop');
  const btnClose = document.getElementById('galleryModalClose');
  const btnPrev = document.getElementById('galleryModalPrev');
  const btnNext = document.getElementById('galleryModalNext');

  const previewImg = document.getElementById('galleryModalImg');
  const previewCat = document.getElementById('galleryModalCat');
  const previewCounter = document.getElementById('galleryModalCounter');
  const previewTitle = document.getElementById('galleryModalTitle');
  const previewDesc = document.getElementById('galleryModalDesc');
  const previewLoc = document.getElementById('galleryModalLoc');
  const previewPhil = document.getElementById('galleryModalPhil');
  const previewStatus = document.getElementById('galleryModalStatus');

  const galleryCards = document.querySelectorAll('.gallery-etno-card');
  if (!modalBox || !galleryCards.length) return;

  let activeIndex = 0;
  let lastTriggerEl = null;

  const renderSlide = (idx) => {
    const item = galleryArchives[idx];
    if (!item) return;

    if (previewImg) {
      previewImg.src = item.image;
      previewImg.alt = item.alt;
    }
    if (previewCat) previewCat.textContent = item.category;
    if (previewCounter) previewCounter.textContent = `0${item.id} / 0${galleryArchives.length}`;
    if (previewTitle) previewTitle.textContent = item.title;
    if (previewDesc) previewDesc.textContent = item.desc;
    if (previewLoc) previewLoc.textContent = item.location;
    if (previewPhil) previewPhil.textContent = item.philosophy;
    if (previewStatus) previewStatus.textContent = item.status;
  };

  const openSlide = (id) => {
    const matchIdx = galleryArchives.findIndex((item) => item.id === Number(id));
    activeIndex = matchIdx >= 0 ? matchIdx : 0;
    renderSlide(activeIndex);

    lastTriggerEl = document.activeElement;
    modalBox.hidden = false;
    modalBox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (btnClose) btnClose.focus();
  };

  const dismissModal = () => {
    modalBox.hidden = true;
    modalBox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (lastTriggerEl && typeof lastTriggerEl.focus === 'function') {
      lastTriggerEl.focus();
    }
  };

  const nextSlide = () => {
    activeIndex = (activeIndex + 1) % galleryArchives.length;
    renderSlide(activeIndex);
  };

  const prevSlide = () => {
    activeIndex = (activeIndex - 1 + galleryArchives.length) % galleryArchives.length;
    renderSlide(activeIndex);
  };

  galleryCards.forEach((card) => {
    const cardId = card.dataset.galleryId;
    card.addEventListener('click', () => openSlide(cardId));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openSlide(cardId);
      }
    });
  });

  if (btnClose) btnClose.addEventListener('click', dismissModal);
  if (overlayBackdrop) overlayBackdrop.addEventListener('click', dismissModal);
  if (btnNext) btnNext.addEventListener('click', nextSlide);
  if (btnPrev) btnPrev.addEventListener('click', prevSlide);

  window.addEventListener('keydown', (e) => {
    if (modalBox.hidden) return;

    if (e.key === 'Escape') {
      dismissModal();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSharedFeatures);
} else {
  initSharedFeatures();
}
