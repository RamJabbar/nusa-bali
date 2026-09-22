/**
 * NUSA BALI HERITAGE — card-detail.js
 * Interactive modal showing deep philosophical, historical, and cultural details with images for Tarian & Kerajinan.
 */

(function () {
  'use strict';

  const CARD_DETAILS = {
    // =================== TARIAN ===================
    "tari-kecak": {
      category: "tarian",
      image: "assets/images/tarian/tari-kecak.jpg",
      badge: "Kategori: Bebali",
      meta: "Asal: Desa Bona & Bedulu, Gianyar",
      body: "Kecak berakar dari ritual Sanghyang penolak roh jahat, lalu dibentuk ulang menjadi seni pertunjukan pada era 1930-an. Lakon yang dibawakan mengambil penggalan Ramayana — penculikan Dewi Sita oleh Rahwana hingga pertempuran pasukan kera Hanoman membebaskannya. Puluhan penari duduk melingkar membentuk 'gamelan mulut' tanpa satupun instrumen logam."
    },
    "tari-legong-keraton": {
      category: "tarian",
      image: "assets/images/tarian/tari-legong.jpg",
      badge: "Kategori: Balih-balihan",
      meta: "Asal: Lingkungan puri (istana), Puri Saba & Puri Peliatan",
      body: "Awalnya tarian persembahan eksklusif di lingkungan puri, dibawakan penari cilik pra-remaja. Legong mengisahkan Raja Lasem yang menculik Putri Rangkesari, dengan bahasa gerak yang sangat halus — terutama 'seledet', lirikan mata tajam yang menjadi ekspresi emosional utama tarian ini."
    },
    "barong-rangda": {
      category: "tarian",
      image: "assets/images/tarian/barong-rangda.jpg",
      badge: "Kategori: Tari Wali Sakral",
      meta: "Asal: Tersebar di seluruh Bali, versi paling sakral di Pura Dalem",
      body: "Dipentaskan saat odalan sebagai tarian Wali, bukan sekadar hiburan. Dalam klimaks tertentu, penari yang kerauhan (trance) menusukkan keris ke tubuh sendiri (ngurek) sebagai bukti perlindungan spiritual Barong — praktik yang hanya berlaku dalam konteks upacara, tidak pernah dipentaskan sebagai tontonan biasa."
    },
    "tari-baris-gede": {
      category: "tarian",
      image: "assets/images/tarian/tari-baris-gede.jpg",
      badge: "Kategori: Tari Wali",
      meta: "Asal: Desa-desa Bali Aga & pura kuno",
      body: "Dibawakan berkelompok dalam jumlah ganjil (5, 7, atau 9 penari) membawa senjata pusaka seperti tombak dan keris. Gerakannya tegas dan berulang, menggambarkan kesiagaan prajurit penjaga saat roh leluhur (Bhatara) berstana turun ke pura selama upacara berlangsung."
    },
    "tari-sanghyang-dedari": {
      category: "tarian",
      image: "assets/images/tarian/tari-sanghyang-dedari.jpg",
      badge: "Kategori: Tari Wali Sakral",
      meta: "Asal: Tradisi pra-Hindu Bali, tersebar di berbagai desa",
      body: "Salah satu tarian tertua di Bali, mendahului masuknya pengaruh Hindu. Dibawakan dua gadis yang belum akil balig dan tidak pernah belajar menari — dalam kondisi trance dengan mata tertutup, mereka dipercaya dirasuki bidadari kahyangan untuk menolak wabah penyakit dari desa."
    },
    "tari-topeng-sidakarya": {
      category: "tarian",
      image: "assets/images/tarian/tari-topeng-sidakarya.jpg",
      badge: "Kategori: Tari Wali",
      meta: "Asal: Pura Mutering Jagat Dalem Sidakarya & seluruh Bali",
      body: "Berdasarkan legenda seorang pendeta pengembara yang ditolak masuk upacara kerajaan, lalu mengutuk upacara tersebut agar tidak pernah sempurna sampai ia diundang kembali. Kini, topeng ini wajib dipentaskan di penutup upacara besar (piodalan, ngaben) sebagai permohonan restu kesempurnaan yadnya."
    },

    // =================== KERAJINAN ===================
    "ukir-kayu": {
      category: "kerajinan",
      image: "assets/images/kerajinan/ukir-kayu.jpg",
      badge: "Gianyar & Mas",
      meta: "Bahan utama: Kayu cendana, kayu cempaka, kayu jati",
      body: "Motif Patra Punggel (sulur daun bergulung) dan relief adegan Ramayana dipahat dengan pahat tradisional tanpa cetakan. Arca kayu cendana yang dihasilkan sering ditakhtakan sebagai pratima (simbol suci) di pura, bukan sekadar hiasan dekoratif."
    },
    "lukisan-kamasan": {
      category: "kerajinan",
      image: "assets/images/kerajinan/lukisan-kamasan.jpg",
      badge: "Kamasan, Klungkung",
      meta: "Gaya: Wayang klasik, tradisi keraton Klungkung",
      body: "Gaya lukisan tertua di Bali yang bertahan tak berubah sejak era kerajaan. Pewarna diracik dari bahan alami — batu pere untuk putih, jelaga untuk hitam — direkatkan dengan lem tulang ikan. Ceritanya diambil dari lontar Adiparwa, Bharatayuddha, hingga cerita Panji."
    },
    "tenun-gringsing": {
      category: "kerajinan",
      image: "assets/images/kerajinan/tenun-gringsing.jpg",
      badge: "Tenganan, Karangasem",
      meta: "Teknik: Ikat ganda (double ikat) langka",
      body: "Satu-satunya kain tenun ikat ganda di Asia Tenggara, hanya diproduksi di Desa Tenganan Pegringsingan. Proses pewarnaan dan penenunan satu lembar kain bisa memakan waktu 2–5 tahun. Dipercaya memiliki kekuatan penolak bala, dipakai dalam upacara potong gigi dan ngaben."
    },
    "perak-celuk": {
      category: "kerajinan",
      image: "assets/images/kerajinan/perak-celuk.jpg",
      badge: "Celuk, Sukawati",
      meta: "Teknik: Filigri perak & emas suci",
      body: "Desa pengrajin perak turun-temurun yang memproduksi bokor persembahan, sangku (wadah tirta suci), dan gelungan (hiasan kepala penari/pendeta). Teknik filigrinya membentuk pola sulur sangat halus dari kawat perak yang dipilin dan disolder satu per satu dengan tangan."
    },
    "ukiran-batu": {
      category: "kerajinan",
      image: "assets/images/kerajinan/ukiran-batu.jpg",
      badge: "Batubulan, Gianyar",
      meta: "Bahan: Batu paras padas & batu andesit",
      body: "Sentra pahat batu terbesar di Bali, memproduksi arca penjaga pura (Dwarapala), relief itihasa untuk dinding candi, hingga gapura candi bentar. Batu paras yang lunak saat digali mengeras seiring waktu terpapar udara, memudahkan detail ukiran presisi tinggi."
    },
    "anyaman-bambu": {
      category: "kerajinan",
      image: "assets/images/kerajinan/anyaman-bambu.jpg",
      badge: "Bona, Gianyar",
      meta: "Bahan: Bambu pilihan & rotan ata alami",
      body: "Desa yang juga jadi pusat lahirnya Tari Kecak modern ini dikenal dengan anyaman bambu dan rotan ata untuk bakul persembahan (sok), wadah canang, hingga furnitur. Setiap motif anyaman punya nama dan fungsi upacara yang berbeda-beda."
    },
    "topeng-ritual": {
      category: "kerajinan",
      image: "assets/images/kerajinan/topeng-ritual.jpg",
      badge: "Singapadu, Gianyar",
      meta: "Bahan: Kayu pule sakral, sepuhan prada emas",
      body: "Kayu pule dipilih karena dipercaya punya kekuatan spiritual dan ringan dipakai menari. Sebelum dipahat, biasanya diawali ritual permohonan izin. Topeng yang selesai diwarnai prada emas ini digunakan khusus untuk pementasan tari sakral seperti Topeng Sidakarya dan Barong."
    },
    "gerabah-pejaten": {
      category: "kerajinan",
      image: "assets/images/kerajinan/gerabah-pejaten.jpg",
      badge: "Pejaten, Tabanan",
      meta: "Bahan: Tanah liat lokal & pembakaran tradisional",
      body: "Desa gerabah tertua di Bali, memproduksi genteng, kendi, dan perlengkapan upacara dari tanah liat yang dibakar dengan teknik pembakaran terbuka turun-temurun. Kini berkembang juga jadi kerajinan hias, tapi fungsi utamanya tetap perlengkapan ritual harian."
    }
  };

  let modalEl = null;
  let modalMediaEl = null;
  let modalImageEl = null;
  let modalBadgeEl = null;
  let modalTitleEl = null;
  let modalMetaEl = null;
  let modalBodyEl = null;
  let lastFocusedEl = null;

  function initCardDetails() {
    modalEl = document.getElementById('detailModal');
    if (!modalEl) return;

    modalMediaEl = document.getElementById('detailModalMedia');
    modalImageEl = document.getElementById('detailModalImage');
    modalBadgeEl = document.getElementById('detailModalBadge');
    modalTitleEl = document.getElementById('detailModalTitle');
    modalMetaEl = document.getElementById('detailModalMeta');
    modalBodyEl = document.getElementById('detailModalBody');

    // Delegated click on cards or their internal links
    document.addEventListener('click', (e) => {
      // If user was just dragging / swiping the marquee, ignore click
      if (window.__justDragged || e.target.closest('[data-just-dragged="true"]')) {
        return;
      }

      // If modal close button or backdrop was clicked
      if (e.target.closest('[data-close]')) {
        closeModal();
        return;
      }

      // Check if click was inside a culture-card with data-id
      const card = e.target.closest('.culture-card[data-id]');
      if (!card) return;

      // If user clicked the "Pelajari Makna Filosofis →" link or anywhere on card
      const link = e.target.closest('.culture-card__link');
      if (link) {
        e.preventDefault();
      }

      openModalForCard(card);
    });

    // Keyboard support: Enter or Space on focused card
    document.addEventListener('keydown', (e) => {
      if (!modalEl.hasAttribute('hidden')) {
        if (e.key === 'Escape') {
          closeModal();
        }
        return;
      }

      const activeEl = document.activeElement;
      if (activeEl && activeEl.matches && activeEl.matches('.culture-card[data-id]')) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModalForCard(activeEl);
        }
      }
    });
  }

  function openModalForCard(card) {
    const id = card.getAttribute('data-id');
    const data = CARD_DETAILS[id];
    if (!data) return;

    lastFocusedEl = card;

    const titleEl = card.querySelector('h3');
    const titleText = titleEl ? titleEl.textContent.trim() : id;

    // Resolve matching image
    const cardImg = card.querySelector('.media-frame img') || card.querySelector('img');
    const imgSrc = data.image || (cardImg ? cardImg.getAttribute('src') : '');
    const imgAlt = cardImg ? (cardImg.getAttribute('alt') || titleText) : titleText;

    if (modalImageEl) {
      modalImageEl.src = imgSrc;
      modalImageEl.alt = imgAlt;
    }

    if (modalMediaEl) {
      modalMediaEl.classList.toggle('detail-modal__media--kerajinan', data.category === 'kerajinan');
      modalMediaEl.classList.toggle('detail-modal__media--tarian', data.category === 'tarian');
    }

    if (modalBadgeEl) modalBadgeEl.textContent = data.badge;
    if (modalTitleEl) modalTitleEl.textContent = titleText;
    if (modalMetaEl) modalMetaEl.textContent = data.meta;
    if (modalBodyEl) modalBodyEl.textContent = data.body;

    modalEl.removeAttribute('hidden');

    // Pause all marquee tracks behind the modal using their built-in mouseenter handler
    document.querySelectorAll('.marquee-track').forEach((track) => {
      track.dispatchEvent(new Event('mouseenter'));
    });

    // Focus close button inside modal
    const closeBtn = modalEl.querySelector('.detail-modal__close');
    if (closeBtn) {
      closeBtn.focus();
    }
  }

  function closeModal() {
    if (!modalEl || modalEl.hasAttribute('hidden')) return;

    modalEl.setAttribute('hidden', '');

    // Resume marquee tracks if mouse is not currently hovering over them
    document.querySelectorAll('.marquee-track').forEach((track) => {
      if (!track.matches(':hover')) {
        track.dispatchEvent(new Event('mouseleave'));
      }
    });

    // Return focus to the card that triggered the modal
    if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') {
      lastFocusedEl.focus();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCardDetails);
  } else {
    initCardDetails();
  }
})();
