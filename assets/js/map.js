// Nusa Bali Heritage — visualisasi peta sakral sembilan kabupaten/kota Bali


const baliRegencyData = {
  gianyar: {
    name: 'Gianyar',
    regency: 'KABUPATEN GIANYAR',
    nickname: 'Pusat Seni & Istana (Puri Budaya)',
    tag: 'PUSAKA GIANYAR',
    desc: 'Jantung peradaban kesenian, seni rupa adiluhung, tari istana, dan konservasi arsitektur bambu serta ukiran kayu Bali.',
    items: [
      {
        title: 'Tari Legong Keraton (Peliatan)',
        category: 'tarian',
        badge: 'TARIAN',
        desc: 'Tarian klasik istana dengan gerak mata seledet dinamis, pakem mudra tangan rumit, dan iringan gamelan semar pegulingan.'
      },
      {
        title: 'Pahat Kayu Mas & Celuk Silver',
        category: 'kerajinan',
        badge: 'KERAJINAN',
        desc: 'Sentra seni ukir kayu tematik Ramayana di Desa Mas serta filigri perak dan emas adiluhung dari Desa Celuk.'
      },
      {
        title: 'Pura Tirta Empul (Tampaksiring)',
        category: 'situs-suci',
        badge: 'SITUS SUCI',
        desc: 'Pancuran mata air suci yang dibangun era Dinasti Warmadewa (962 M) untuk ritual penyucian jiwa (melukat).'
      },
      {
        title: 'Cagar Budaya Gunung Kawi & Goa Gaja',
        category: 'situs-suci',
        badge: 'SITUS SUCI',
        desc: 'Kompleks candi tebing cadas megah abad ke-11 dan pertapaan suci Goa Gajah warisan peradaban kuno Bali.'
      },
      {
        title: 'Upacara Melukat & Odalan Puri',
        category: 'upacara',
        badge: 'UPACARA',
        desc: 'Tradisi pembersihan spiritual air suci dan odalan pelataran puri yang melestarikan kidung wargasari kuno.'
      }
    ]
  },
  badung: {
    name: 'Badung',
    regency: 'KABUPATEN BADUNG',
    nickname: 'Benteng Pesisir & Puri Suci',
    tag: 'PUSAKA BADUNG',
    desc: 'Kawasan maritim selatan penjaga kesucian tebing karang samudra, teater tari kecak tebing, dan tradisi pesisir.',
    items: [
      {
        title: 'Tari Kecak Tebing Uluwatu',
        category: 'tarian',
        badge: 'TARIAN',
        desc: 'Pertunjukan sakral puluhan penari kidung cak melingkar berlatar matahari terbenam di tubir tebing 70 meter.'
      },
      {
        title: 'Pura Luhur Uluwatu',
        category: 'situs-suci',
        badge: 'SITUS SUCI',
        desc: 'Pura Sad Kahyangan penjaga arah barat daya (Dewa Rudra) yang kokoh bertengger di atas jurang Samudra Hindia.'
      },
      {
        title: 'Kriya Perak & Busana Adat Mengwi',
        category: 'kerajinan',
        badge: 'KERAJINAN',
        desc: 'Kerajinan hiasan kepala prada, busana payas agung, serta tempaan ornamen perak upacara kerajaan.'
      },
      {
        title: 'Upacara Melasti Segara Kuta',
        category: 'upacara',
        badge: 'UPACARA',
        desc: 'Prosesi penyucian pratima pusaka pura ke tepi samudra sebelum perayaan Hari Suci Nyepi.'
      }
    ]
  },
  denpasar: {
    name: 'Denpasar',
    regency: 'KOTA DENPASAR',
    nickname: 'Pusat Budaya Karaton & Puri Praja',
    tag: 'PUSAKA DENPASAR',
    desc: 'Ibu kota kultural yang melestarikan kemegahan upacara pelebon puri agung, tenun endek mastuli, dan tari baris keris.',
    items: [
      {
        title: 'Tari Barong Ket & Keris Kesiman',
        category: 'tarian',
        badge: 'TARIAN',
        desc: 'Tarian sakral perwujudan dharma yang diiringi prosesi ngurek tusuk keris tanpa luka oleh para pemedek.'
      },
      {
        title: 'Kain Tenun Ikat Endek Mastuli',
        category: 'kerajinan',
        badge: 'KERAJINAN',
        desc: 'Kain tenun ikat tradisional kebanggaan kraton Bali dengan motif patra dan pewarna rempah khas.'
      },
      {
        title: 'Pura Agung Jagatnatha',
        category: 'situs-suci',
        badge: 'SITUS SUCI',
        desc: 'Pura pemujaan Sang Hyang Widhi Wasa dengan padmasana pualam putih di jantung kota Denpasar.'
      },
      {
        title: 'Pelebon Puri Agung & Bade Tumpang',
        category: 'upacara',
        badge: 'UPACARA',
        desc: 'Upacara pembakaran jenazah ningrat megah dengan menara wadah bertingkat sembilan dan lembu cemeng.'
      }
    ]
  },
  tabanan: {
    name: 'Tabanan',
    regency: 'KABUPATEN TABANAN',
    nickname: 'Lumbung Padi & Tirta Segara Karang',
    tag: 'PUSAKA TABANAN',
    desc: 'Sentra peradaban agraris ekologis Subak Jatiluwih warisan dunia UNESCO dan kesucian pura karang laut Tanah Lot.',
    items: [
      {
        title: 'Pura Luhur Tanah Lot',
        category: 'situs-suci',
        badge: 'SITUS SUCI',
        desc: 'Bongkahan karang tempat bertapa Dang Hyang Nirartha yang dijaga ular suci penepis mara bahaya laut.'
      },
      {
        title: 'Lanskap Subak Jatiluwih (UNESCO)',
        category: 'situs-suci',
        badge: 'SITUS SUCI',
        desc: 'Sistem terasering sawah beririgasi demokratis filosofi Tri Hita Karana terluas dan terindah di Nusantara.'
      },
      {
        title: 'Gerabah Tanah Liat Pejaten',
        category: 'kerajinan',
        badge: 'KERAJINAN',
        desc: 'Kriya tembikar dan genteng tanah lempung tradisional yang dibakar dengan sekam padi turun-temurun.'
      },
      {
        title: 'Tari Leko & Okokan Sakral',
        category: 'tarian',
        badge: 'TARIAN',
        desc: 'Tarian genta kayu okokan pengusir hama dan tarian leko rakyat pemikat kesuburan tanaman padi.'
      },
      {
        title: 'Upacara Tumpek Wariga',
        category: 'upacara',
        badge: 'UPACARA',
        desc: 'Penghormatan sakral kepada pepohonan dan alam nabati 25 hari sebelum Hari Suci Galungan.'
      }
    ]
  },
  buleleng: {
    name: 'Buleleng',
    regency: 'KABUPATEN BULELENG',
    nickname: 'Pesisir Utara & Inovasi Gong Kebyar',
    tag: 'PUSAKA BULELENG',
    desc: 'Pesisir utara gerbang diplomasi maritim kuno, tempat lahirnya dinamika gamelan Gong Kebyar dan tenun sutra Mastuli.',
    items: [
      {
        title: 'Gamelan Gong Kebyar & Tari Trunajaya',
        category: 'tarian',
        badge: 'TARIAN',
        desc: 'Inovasi irama gamelan cepat meledak-ledak yang memicu lahirnya tarian legendaris Trunajaya.'
      },
      {
        title: 'Tenun Songket Sutra Beratan',
        category: 'kerajinan',
        badge: 'KERAJINAN',
        desc: 'Kain tenun songket benang emas rumit yang diwariskan para perajin putri puri di Singaraja.'
      },
      {
        title: 'Pura Meduwe Karang & Ponjok Batu',
        category: 'situs-suci',
        badge: 'SITUS SUCI',
        desc: 'Pura pemujaan kesuburan tanah dengan pahatan relief unik bunga teratai dan ukiran khas Buleleng.'
      },
      {
        title: 'Upacara Nyepi Segara Tejakula',
        category: 'upacara',
        badge: 'UPACARA',
        desc: 'Pemberhentian total aktivitas melaut selama 24 jam sebagai wujud pemuliaan ekosistem pesisir utara.'
      }
    ]
  },
  karangasem: {
    name: 'Karangasem',
    regency: 'KABUPATEN KARANGASEM',
    nickname: 'Stana Giri Agung & Adat Bali Mula',
    tag: 'PUSAKA KARANGASEM',
    desc: 'Pusat spiritual tertinggi Pulau Dewata dengan Pura Agung Besakih di lereng Gunung Agung serta desa kuna Tenganan.',
    items: [
      {
        title: 'Pura Agung Besakih (Mother Temple)',
        category: 'situs-suci',
        badge: 'SITUS SUCI',
        desc: 'Kompleks pura induk terbesar di lereng Gunung Agung dengan 86 pura cabang pelindung jagat dewata.'
      },
      {
        title: 'Kain Tenun Ikat Ganda Gringsing',
        category: 'kerajinan',
        badge: 'KERAJINAN',
        desc: 'Satu-satunya tenun ikat ganda di Indonesia dengan pewarna alami mahoni dan mengkudu penolak bala.'
      },
      {
        title: 'Tari Rejang Dewa Asli',
        category: 'tarian',
        badge: 'TARIAN',
        desc: 'Tarian bidadari suci tanpa hiasan berlebih yang ditarikan gadis perawan saat odalan Pura Besakih.'
      },
      {
        title: 'Ritual Perang Pandan (Mekare-kare)',
        category: 'upacara',
        badge: 'UPACARA',
        desc: 'Tradisi pertarungan persembahan bersenjatakan daun pandan berduri menghormati Dewa Indra di Tenganan.'
      }
    ]
  },
  klungkung: {
    name: 'Klungkung',
    regency: 'KABUPATEN KLUNGKUNG',
    nickname: 'Pusat Hukum Adat & Klasik Kamasan',
    tag: 'PUSAKA KLUNGKUNG',
    desc: 'Pusat kejayaan dinasti Gelgel dan Klungkung, sanggar seni lukis wayang Kamasan kuno, dan pulau sakral Nusa Penida.',
    items: [
      {
        title: 'Lukisan Wayang Klasik Kamasan',
        category: 'kerajinan',
        badge: 'KERAJINAN',
        desc: 'Seni lukis pewayangan tertua dengan pewarna alami jelaga dan batu pere yang menghiasi langit-langit Kertagosa.'
      },
      {
        title: 'Tari Baris Jebug & Topeng Klungkung',
        category: 'tarian',
        badge: 'TARIAN',
        desc: 'Tarian ksatria sakral pelindung balairung istana Gelgel berbusana prada emas megah.'
      },
      {
        title: 'Pura Goa Lawah & Kertagosa',
        category: 'situs-suci',
        badge: 'SITUS SUCI',
        desc: 'Pura penjaga gua kelelawar suci dan balai peradilan tradisional Kertagosa berlukiskan hukum karma phala.'
      },
      {
        title: 'Upacara Ngusaba Nusa Penida',
        category: 'upacara',
        badge: 'UPACARA',
        desc: 'Ritual tahunan di Pura Dalem Ped memohon keselamatan dan benteng gaib bagi segenap kepulauan dewata.'
      }
    ]
  },
  bangli: {
    name: 'Bangli',
    regency: 'KABUPATEN BANGLI',
    nickname: 'Kawasan Adat Gunung & Danau Purba',
    tag: 'PUSAKA BANGLI',
    desc: 'Wilayah pegunungan sejuk tanpa pesisir laut, rumah keharmonisan Desa Adat Penglipuran dan kemegahan Danau Batur.',
    items: [
      {
        title: 'Desa Adat Penglipuran',
        category: 'situs-suci',
        badge: 'SITUS SUCI',
        desc: 'Desa terbersih di dunia dengan tata ruang Tri Mandala seragam, gerbang bambu kuno, dan hutan bambu sakral.'
      },
      {
        title: 'Pura Ulun Danu Batur',
        category: 'situs-suci',
        badge: 'SITUS SUCI',
        desc: 'Pura pemujaan Dewi Danu penguasa mata air dan kesuburan seluruh jaringan subak Bali tengah.'
      },
      {
        title: 'Anyaman Bambu & Kerajinan Akar',
        category: 'kerajinan',
        badge: 'KERAJINAN',
        desc: 'Kriya anyaman wadah persembahan sokasi dan ukiran akar bambu khas masyarakat lereng Kintamani.'
      },
      {
        title: 'Tari Wayang Wong Parwa Sakral',
        category: 'tarian',
        badge: 'TARIAN',
        desc: 'Drama tari topeng sakral berlakon epos Ramayana kuno yang disucikan di pura desa Bangli.'
      }
    ]
  },
  jembrana: {
    name: 'Jembrana',
    regency: 'KABUPATEN JEMBRANA',
    nickname: 'Dentum Jegog Bambu & Gerbang Barat',
    tag: 'PUSAKA JEMBRANA',
    desc: 'Pintu gerbang barat Pulau Dewata yang terkenal dengan resonansi gamelan jegog bambu raksasa dan pacuan Makepung.',
    items: [
      {
        title: 'Gamelan Jegog Bambu Raksasa',
        category: 'tarian',
        badge: 'TARIAN',
        desc: 'Ensembel musik bambu terbesar di dunia dengan dentuman bas menggetarkan dada hingga jarak beberapa kilometer.'
      },
      {
        title: 'Pura Rambut Siwi',
        category: 'situs-suci',
        badge: 'SITUS SUCI',
        desc: 'Pura tebing karang barat tempat pemujaan rambut suci Dang Hyang Dwijendra penjaga selat Bali.'
      },
      {
        title: 'Tenun Endek & Songket Jembrana',
        category: 'kerajinan',
        badge: 'KERAJINAN',
        desc: 'Kerajinan tenun tradisional bermotif flora pesisir barat dengan ketahanan tenun prima.'
      },
      {
        title: 'Tradisi Balap Kerbau Makepung',
        category: 'upacara',
        badge: 'UPACARA',
        desc: 'Pesta perayaan syukur panen raya agraris dengan pacuan sepasang kerbau berhias mahkota emas.'
      }
    ]
  }
};

function setupInteractiveMap() {
  const mapSvg = document.getElementById('baliMap');
  const regionPaths = document.querySelectorAll('#baliMap .region');
  const filterChips = document.querySelectorAll('#petaFilters .peta-chip');
  const panelList = document.getElementById('petaPanelList');
  const emptyFeedback = document.getElementById('petaPanelEmpty');
  const resetBtn = document.getElementById('petaResetBtn');

  const panelTag = document.getElementById('petaPanelTag');
  const panelCount = document.getElementById('petaPanelCount');
  const panelRegencyBadge = document.getElementById('petaRegencyBadge');
  const panelNickname = document.getElementById('petaPanelNickname');
  const panelTitle = document.getElementById('petaPanelTitle');
  const panelDesc = document.getElementById('petaPanelDesc');

  if (!mapSvg || !regionPaths.length) return;

  let activeRegionKey = 'gianyar';
  let activeFilterCategory = 'semua';

  function selectRegion(regionId) {
    if (!baliRegencyData[regionId]) return;
    activeRegionKey = regionId;

    regionPaths.forEach((path) => {
      const isSelected = path.dataset.region === regionId;
      path.classList.toggle('is-active', isSelected);
      path.setAttribute('aria-selected', String(isSelected));
    });

    renderPanelContent();
  }

  function renderPanelContent() {
    const regencyInfo = baliRegencyData[activeRegionKey];
    if (!regencyInfo) return;

    if (panelTag) panelTag.textContent = regencyInfo.tag;
    if (panelRegencyBadge) panelRegencyBadge.textContent = regencyInfo.regency;
    if (panelNickname) panelNickname.textContent = regencyInfo.nickname;
    if (panelTitle) panelTitle.textContent = regencyInfo.name;
    if (panelDesc) panelDesc.textContent = regencyInfo.desc;

    const matchedItems = regencyInfo.items.filter((item) => {
      return activeFilterCategory === 'semua' || item.category === activeFilterCategory;
    });

    if (panelCount) {
      panelCount.textContent = `${matchedItems.length} Warisan Terpilih`;
    }

    if (panelList) {
      panelList.innerHTML = '';
      if (emptyFeedback) emptyFeedback.hidden = matchedItems.length > 0;

      matchedItems.forEach((item) => {
        const itemCard = document.createElement('article');
        itemCard.className = 'peta-item-card';
        itemCard.innerHTML = `
          <div class="peta-item-card__head">
            <div class="peta-item-card__title-group">
              <h4 class="peta-item-card__title">${item.title}</h4>
            </div>
            <span class="peta-category-badge">${item.badge}</span>
          </div>
          <p class="peta-item-card__desc">${item.desc}</p>
        `;
        panelList.appendChild(itemCard);
      });
    }

    syncMapPoints();
  }

  function syncMapPoints() {
    const mapPoints = document.querySelectorAll('#baliMap .map-point');
    mapPoints.forEach((point) => {
      const cat = point.dataset.category;
      if (activeFilterCategory === 'semua' || !cat || cat === activeFilterCategory) {
        point.style.opacity = '1';
        point.style.transform = '';
      } else {
        point.style.opacity = '0.25';
      }
    });
  }

  regionPaths.forEach((path) => {
    path.addEventListener('click', () => {
      selectRegion(path.dataset.region);
    });

    path.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectRegion(path.dataset.region);
      }
    });
  });

  filterChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      filterChips.forEach((c) => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      activeFilterCategory = chip.dataset.filter || 'semua';
      renderPanelContent();
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      activeFilterCategory = 'semua';
      filterChips.forEach((c) => {
        c.classList.toggle('is-active', c.dataset.filter === 'semua');
      });
      selectRegion('gianyar');
    });
  }

  selectRegion('gianyar');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupInteractiveMap);
} else {
  setupInteractiveMap();
}
