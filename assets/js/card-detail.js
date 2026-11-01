

(function () {
  'use strict';

  const koleksiPusaka = {
    "tari-kecak": {
      category: "tarian",
      image: "assets/images/tarian/tari-kecak.jpg",
      badge: "Kategori: Bebali (tari pengiring)",
      meta: "Asal: Desa Bona dan Bedulu, Gianyar",
      body: "Tari Kecak dikembangkan dari ritual Sanghyang penolak bala pada dekade 1930-an. Lakon yang dibawakan menceritakan kisah Ramayana, saat Dewi Sita diculik Rahwana dan diselamatkan oleh pasukan kera Hanoman. Puluhan pria duduk melingkar dan melantunkan paduan suara cak-cak-cak tanpa alat musik gamelan."
    },
    "tari-legong-keraton": {
      category: "tarian",
      image: "assets/images/tarian/tari-legong.jpg",
      badge: "Kategori: Balih-balihan (tari pertunjukan)",
      meta: "Asal: Lingkungan puri di Saba dan Peliatan, Gianyar",
      body: "Tari klasik istana yang dibawakan oleh penari muda. Gerakannya menuntut kelenturan jari tangan dan seledet, yaitu lirikan mata tajam yang menjadi ciri khas tari Bali. Tarian ini diiringi alunan gamelan Semar Pagulingan."
    },
    "barong-rangda": {
      category: "tarian",
      image: "assets/images/tarian/barong-rangda.jpg",
      badge: "Kategori: Tari Wali (tari upacara)",
      meta: "Asal: Dipentaskan di pura seluruh Bali",
      body: "Tarian sakral yang menampilkan pertemuan Barong (simbol kebajikan) dan Rangda (simbol hawa nafsu). Keduanya dipentaskan saat odalan (upacara peringatan pura) untuk menjaga ketenteraman desa. Dalam kondisi kerauhan (trance), para penari menusukkan keris ke tubuh tanpa terluka."
    },
    "tari-baris-gede": {
      category: "tarian",
      image: "assets/images/tarian/tari-baris-gede.jpg",
      badge: "Kategori: Tari Wali (tari upacara)",
      meta: "Asal: Desa-desa kuno dan pura kahyangan",
      body: "Dibawakan oleh kelompok penari pria dalam jumlah ganjil (5, 7, atau 9 penari) yang membawa tombak dan keris. Gerakannya tegap dan serempak, menggambarkan barisan prajurit yang mengawal kehadiran para dewa dan leluhur di pura."
    },
    "tari-sanghyang-dedari": {
      category: "tarian",
      image: "assets/images/tarian/tari-sanghyang-dedari.jpg",
      badge: "Kategori: Tari Wali (tari upacara)",
      meta: "Asal: Tradisi desa di Gianyar dan Karangasem",
      body: "Tari sakral penolak wabah penyakit yang dibawakan oleh dua anak perempuan yang belum akil balig. Keduanya menari dalam kondisi trance dengan mata terpejam, mengikuti kidung koor yang dilantunkan warga desa."
    },
    "tari-topeng-sidakarya": {
      category: "tarian",
      image: "assets/images/tarian/tari-topeng-sidakarya.jpg",
      badge: "Kategori: Tari Wali (tari upacara)",
      meta: "Asal: Pura Mutering Jagat Dalem Sidakarya, Denpasar",
      body: "Tarian topeng wajib pada penutup upacara besar seperti piodalan dan ngaben. Tokoh Brahmana Sidakarya dihadirkan untuk memberikan restu suci, agar seluruh rangkaian yadnya dinyatakan tuntas dan sah."
    },

    "ukir-kayu": {
      category: "kerajinan",
      image: "assets/images/kerajinan/ukir-kayu.jpg",
      badge: "Gianyar dan Mas",
      meta: "Bahan: Kayu cendana, cempaka, dan jati",
      body: "Perajin kayu di Desa Mas memahat motif patra punggel (sulur daun bergulung) dan relief cerita Ramayana. Pahatan dilakukan memakai pahat baja tradisional tanpa cetakan, menghasilkan arca dan ornamen tiang pura."
    },
    "lukisan-kamasan": {
      category: "kerajinan",
      image: "assets/images/kerajinan/lukisan-kamasan.jpg",
      badge: "Kamasan, Klungkung",
      meta: "Gaya: Wayang klasik Klungkung",
      body: "Gaya lukisan wayang tertua di Bali yang bertahan sejak zaman Kerajaan Gelgel. Pewarna dibuat dari bahan alami, seperti batu pere untuk warna oker dan jelaga lampu untuk warna hitam, dengan perekat sari tulang ikan."
    },
    "tenun-gringsing": {
      category: "kerajinan",
      image: "assets/images/kerajinan/tenun-gringsing.jpg",
      badge: "Tenganan, Karangasem",
      meta: "Teknik: Ikat ganda (double ikat)",
      body: "Satu-satunya kain tenun ikat ganda di Indonesia, ditenun oleh masyarakat Desa Tenganan Pegringsingan. Proses pewarnaan benang kapas memakai akar mengkudu dan minyak kemiri, memerlukan waktu dua hingga lima tahun untuk sehelai kain."
    },
    "perak-celuk": {
      category: "kerajinan",
      image: "assets/images/kerajinan/perak-celuk.jpg",
      badge: "Celuk, Sukawati",
      meta: "Bahan: Perak dan kuningan sepuh emas",
      body: "Desa perajin perak yang membuat bokor sesaji, sangku (wadah air suci), dan gelungan (mahkota penari). Perajin memilin kawat perak halus menjadi motif sulur dengan teknik filigri."
    },
    "ukiran-batu": {
      category: "kerajinan",
      image: "assets/images/kerajinan/ukiran-batu.jpg",
      badge: "Batubulan, Gianyar",
      meta: "Bahan: Batu paras padas dan batu andesit",
      body: "Sentra seni pahat batu untuk membuat arca penjaga pura Dwarapala, relief dinding candi, dan gapura candi bentar. Batu paras yang lunak saat dipahat akan mengeras alami saat terkena udara terbuka."
    },
    "anyaman-bambu": {
      category: "kerajinan",
      image: "assets/images/kerajinan/anyaman-bambu.jpg",
      badge: "Bona, Gianyar",
      meta: "Bahan: Bambu tali dan rotan ata",
      body: "Warga Desa Bona menganyam bambu dan rotan ata menjadi wadah canang, bakul sesaji sokasi, dan perabot rumah tangga. Setiap bentuk anyaman disesuaikan dengan kebutuhan upacara."
    },
    "topeng-ritual": {
      category: "kerajinan",
      image: "assets/images/kerajinan/topeng-ritual.jpg",
      badge: "Singapadu, Gianyar",
      meta: "Bahan: Kayu pule dan lapisan prada emas",
      body: "Dipahat dari kayu pule yang ringan dan mudah dibentuk. Sebelum memahat kayu, sangging (perajin) memohon izin secara adat. Topeng yang selesai dilapisi prada emas khusus untuk pementasan tari Topeng Sidakarya dan Barong."
    },
    "gerabah-pejaten": {
      category: "kerajinan",
      image: "assets/images/kerajinan/gerabah-pejaten.jpg",
      badge: "Pejaten, Tabanan",
      meta: "Bahan: Tanah liat lokal",
      body: "Desa pembuat gerabah tertua di Tabanan. Memproduksi perlengkapan upacara dari tanah liat bakar seperti periuk, kendi air suci, caratan, dan genteng pres tradisional."
    }
  };

  let modalPopup = null;
  let mediaContainer = null;
  let mediaImg = null;
  let badgeTag = null;
  let headingTitle = null;
  let metaOrigin = null;
  let descBody = null;
  let lastActiveCard = null;

  function bindCardModalEvents() {
    modalPopup = document.getElementById('detailModal');
    if (!modalPopup) return;

    mediaContainer = document.getElementById('detailModalMedia');
    mediaImg = document.getElementById('detailModalImage');
    badgeTag = document.getElementById('detailModalBadge');
    headingTitle = document.getElementById('detailModalTitle');
    metaOrigin = document.getElementById('detailModalMeta');
    descBody = document.getElementById('detailModalBody');

    document.addEventListener('click', (e) => {
      if (window.__justDragged || e.target.closest('[data-just-dragged="true"]')) {
        return;
      }

      if (e.target.closest('[data-close]')) {
        closeCardDetails();
        return;
      }

      const cardTarget = e.target.closest('.culture-card[data-id]');
      if (!cardTarget) return;

      const linkEl = e.target.closest('.culture-card__link');
      if (linkEl) e.preventDefault();

      openCardDetails(cardTarget);
    });

    document.addEventListener('keydown', (e) => {
      if (!modalPopup.hasAttribute('hidden')) {
        if (e.key === 'Escape') closeCardDetails();
        return;
      }

      const currentFocused = document.activeElement;
      if (currentFocused?.matches('.culture-card[data-id]')) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openCardDetails(currentFocused);
        }
      }
    });
  }

  function openCardDetails(cardTarget) {
    const cardKey = cardTarget.getAttribute('data-id');
    const itemData = koleksiPusaka[cardKey];
    if (!itemData) return;

    lastActiveCard = cardTarget;

    const headingNode = cardTarget.querySelector('h3');
    const titleText = headingNode ? headingNode.textContent.trim() : cardKey;

    const cardImageNode = cardTarget.querySelector('.media-frame img') || cardTarget.querySelector('img');
    const imageSource = itemData.image || cardImageNode?.getAttribute('src') || '';
    const imageAltText = cardImageNode?.getAttribute('alt') || titleText;

    if (mediaImg) {
      mediaImg.src = imageSource;
      mediaImg.alt = imageAltText;
    }

    if (mediaContainer) {
      mediaContainer.classList.toggle('detail-modal__media--kerajinan', itemData.category === 'kerajinan');
      mediaContainer.classList.toggle('detail-modal__media--tarian', itemData.category === 'tarian');
    }

    if (badgeTag) badgeTag.textContent = itemData.badge;
    if (headingTitle) headingTitle.textContent = titleText;
    if (metaOrigin) metaOrigin.textContent = itemData.meta;
    if (descBody) descBody.textContent = itemData.body;

    modalPopup.removeAttribute('hidden');

    document.querySelectorAll('.marquee-track').forEach((track) => {
      track.dispatchEvent(new Event('mouseenter'));
    });

    const btnDismiss = modalPopup.querySelector('.detail-modal__close');
    if (btnDismiss) btnDismiss.focus();
  }

  function closeCardDetails() {
    if (!modalPopup || modalPopup.hasAttribute('hidden')) return;

    modalPopup.setAttribute('hidden', '');

    document.querySelectorAll('.marquee-track').forEach((track) => {
      if (!track.matches(':hover')) {
        track.dispatchEvent(new Event('mouseleave'));
      }
    });

    if (lastActiveCard && typeof lastActiveCard.focus === 'function') {
      lastActiveCard.focus();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindCardModalEvents);
  } else {
    bindCardModalEvents();
  }
})();
