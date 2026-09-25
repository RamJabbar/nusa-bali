/* =========================================================
   NUSA BALI HERITAGE — map.js
   Interactive Sacred Geography Map & Cultural Panel Logic
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initBaliMap();
});

function initBaliMap() {
  const mapSvg = document.getElementById('baliMap');
  const regions = document.querySelectorAll('#baliMap .region');
  const filterChips = document.querySelectorAll('#petaFilters .peta-chip');
  const panel = document.getElementById('petaPanel');
  const panelList = document.getElementById('petaPanelList');
  const emptyState = document.getElementById('petaPanelEmpty');
  const resetBtn = document.getElementById('petaResetBtn');

  // Dynamic header elements in panel
  const panelTag = document.getElementById('petaPanelTag');
  const panelCount = document.getElementById('petaPanelCount');
  const panelRegencyBadge = document.getElementById('petaRegencyBadge');
  const panelNickname = document.getElementById('petaPanelNickname');
  const panelTitle = document.getElementById('petaPanelTitle');
  const panelDesc = document.getElementById('petaPanelDesc');

  if (!mapSvg || !regions.length) return;

  // Complete cultural dataset for 9 regencies
  const regencyData = {
    gianyar: {
      id: 'gianyar',
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
          icon: '🎭',
          desc: 'Tarian klasik istana dengan gerak mata seledet dinamis, pakem mudra tangan rumit, dan iringan gamelan semar pegulingan.'
        },
        {
          title: 'Pahat Kayu Mas & Celuk Silver',
          category: 'kerajinan',
          badge: 'KERAJINAN',
          icon: '⚒️',
          desc: 'Sentra seni ukir kayu tematik Ramayana di Desa Mas serta filigri perak dan emas adiluhung dari Desa Celuk.'
        },
        {
          title: 'Pura Tirta Empul (Tampaksiring)',
          category: 'situs-suci',
          badge: 'SITUS SUCI',
          icon: '⛩️',
          desc: 'Pancuran mata air suci yang dibangun era Dinasti Warmadewa (962 M) untuk ritual penyucian jiwa (melukat).'
        },
        {
          title: 'Cagar Budaya Gunung Kawi & Goa Gaja',
          category: 'situs-suci',
          badge: 'SITUS SUCI',
          icon: '⛩️',
          desc: 'Kompleks candi tebing cadas megah abad ke-11 dan pertapaan suci Goa Gajah warisan peradaban kuno Bali.'
        },
        {
          title: 'Upacara Melukat & Odalan Puri',
          category: 'upacara',
          badge: 'UPACARA',
          icon: '🧉',
          desc: 'Tradisi pembersihan spiritual air suci dan odalan pelataran puri yang melestarikan kidung wargasari kuno.'
        }
      ]
    },
    badung: {
      id: 'badung',
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
          icon: '🎭',
          desc: 'Pertunjukan sakral puluhan penari kidung cak melingkar berlatar matahari terbenam di tubir tebing 70 meter.'
        },
        {
          title: 'Pura Luhur Uluwatu',
          category: 'situs-suci',
          badge: 'SITUS SUCI',
          icon: '⛩️',
          desc: 'Pura Sad Kahyangan penjaga arah barat daya (Dewa Rudra) yang kokoh bertengger di atas jurang Samudra Hindia.'
        },
        {
          title: 'Kriya Perak & Busana Adat Mengwi',
          category: 'kerajinan',
          badge: 'KERAJINAN',
          icon: '⚒️',
          desc: 'Kerajinan hiasan kepala prada, busana payas agung, serta tempaan ornamen perak upacara kerajaan.'
        },
        {
          title: 'Upacara Melasti Segara Kuta',
          category: 'upacara',
          badge: 'UPACARA',
          icon: '🧉',
          desc: 'Prosesi penyucian pratima pusaka pura ke tepi samudra sebelum perayaan Hari Suci Nyepi.'
        }
      ]
    },
    denpasar: {
      id: 'denpasar',
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
          icon: '🎭',
          desc: 'Tarian sakral perwujudan dharma yang diiringi prosesi ngurek tusuk keris tanpa luka oleh para pemedek.'
        },
        {
          title: 'Kain Tenun Ikat Endek Mastuli',
          category: 'kerajinan',
          badge: 'KERAJINAN',
          icon: '⚒️',
          desc: 'Kain tenun ikat tradisional kebanggaan kraton Bali dengan motif patra dan pewarna rempah khas.'
        },
        {
          title: 'Pura Agung Jagatnatha',
          category: 'situs-suci',
          badge: 'SITUS SUCI',
          icon: '⛩️',
          desc: 'Pura pemujaan Sang Hyang Widhi Wasa dengan padmasana pualam putih di jantung kota Denpasar.'
        },
        {
          title: 'Pelebon Puri Agung & Bade Tumpang',
          category: 'upacara',
          badge: 'UPACARA',
          icon: '🧉',
          desc: 'Upacara pembakaran jenazah ningrat megah dengan menara wadah bertingkat sembilan dan lembu cemeng.'
        }
      ]
    },
    tabanan: {
      id: 'tabanan',
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
          icon: '⛩️',
          desc: 'Bongkahan karang tempat bertapa Dang Hyang Nirartha yang dijaga ular suci penepis mara bahaya laut.'
        },
        {
          title: 'Lanskap Subak Jatiluwih (UNESCO)',
          category: 'situs-suci',
          badge: 'SITUS SUCI',
          icon: '⛩️',
          desc: 'Sistem terasering sawah beririgasi demokratis filosofi Tri Hita Karana terluas dan terindah di Nusantara.'
        },
        {
          title: 'Gerabah Tanah Liat Pejaten',
          category: 'kerajinan',
          badge: 'KERAJINAN',
          icon: '⚒️',
          desc: 'Kriya tembikar dan genteng tanah lempung tradisional yang dibakar dengan sekam padi turun-temurun.'
        },
        {
          title: 'Tari Leko & Okokan Sakral',
          category: 'tarian',
          badge: 'TARIAN',
          icon: '🎭',
          desc: 'Tarian genta kayu okokan pengusir hama dan tarian leko rakyat pemikat kesuburan tanaman padi.'
        },
        {
          title: 'Upacara Tumpek Wariga',
          category: 'upacara',
          badge: 'UPACARA',
          icon: '🧉',
          desc: 'Penghormatan sakral kepada pepohonan dan alam nabati 25 hari sebelum Hari Suci Galungan.'
        }
      ]
    },
    buleleng: {
      id: 'buleleng',
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
          icon: '🎭',
          desc: 'Inovasi irama gamelan cepat meledak-ledak yang memicu lahirnya tarian legendaris Trunajaya.'
        },
        {
          title: 'Tenun Songket Sutra Beratan',
          category: 'kerajinan',
          badge: 'KERAJINAN',
          icon: '⚒️',
          desc: 'Kain tenun songket benang emas rumit yang diwariskan para perajin putri puri di Singaraja.'
        },
        {
          title: 'Pura Meduwe Karang & Ponjok Batu',
          category: 'situs-suci',
          badge: 'SITUS SUCI',
          icon: '⛩️',
          desc: 'Pura pemujaan kesuburan tanah dengan pahatan relief unik bunga teratai dan ukiran khas Buleleng.'
        },
        {
          title: 'Upacara Nyepi Segara Tejakula',
          category: 'upacara',
          badge: 'UPACARA',
          icon: '🧉',
          desc: 'Pemberhentian total aktivitas melaut selama 24 jam sebagai wujud pemuliaan ekosistem pesisir utara.'
        }
      ]
    },
    karangasem: {
      id: 'karangasem',
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
          icon: '⛩️',
          desc: 'Kompleks pura induk terbesar di lereng Gunung Agung dengan 86 pura cabang pelindung jagat dewata.'
        },
        {
          title: 'Kain Tenun Ikat Ganda Gringsing',
          category: 'kerajinan',
          badge: 'KERAJINAN',
          icon: '⚒️',
          desc: 'Satu-satunya tenun ikat ganda di Indonesia dengan pewarna alami mahoni dan mengkudu penolak bala.'
        },
        {
          title: 'Tari Rejang Dewa Asli',
          category: 'tarian',
          badge: 'TARIAN',
          icon: '🎭',
          desc: 'Tarian bidadari suci tanpa hiasan berlebih yang ditarikan gadis perawan saat odalan Pura Besakih.'
        },
        {
          title: 'Ritual Perang Pandan (Mekare-kare)',
          category: 'upacara',
          badge: 'UPACARA',
          icon: '🧉',
          desc: 'Tradisi pertarungan persembahan bersenjatakan daun pandan berduri menghormati Dewa Indra di Tenganan.'
        }
      ]
    },
    klungkung: {
      id: 'klungkung',
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
          icon: '⚒️',
          desc: 'Seni lukis pewayangan tertua dengan pewarna alami jelaga dan batu pere yang menghiasi langit-langit Kertagosa.'
        },
        {
          title: 'Tari Baris Jebug & Topeng Klungkung',
          category: 'tarian',
          badge: 'TARIAN',
          icon: '🎭',
          desc: 'Tarian ksatria sakral pelindung balairung istana Gelgel berbusana prada emas megah.'
        },
        {
          title: 'Pura Goa Lawah & Kertagosa',
          category: 'situs-suci',
          badge: 'SITUS SUCI',
          icon: '⛩️',
          desc: 'Pura penjaga gua kelelawar suci dan balai peradilan tradisional Kertagosa berlukiskan hukum karma phala.'
        },
        {
          title: 'Upacara Ngusaba Nusa Penida',
          category: 'upacara',
          badge: 'UPACARA',
          icon: '🧉',
          desc: 'Ritual tahunan di Pura Dalem Ped memohon keselamatan dan benteng gaib bagi segenap kepulauan dewata.'
        }
      ]
    },
    bangli: {
      id: 'bangli',
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
          icon: '⛩️',
          desc: 'Desa terbersih di dunia dengan tata ruang Tri Mandala seragam, gerbang bambu kuno, dan hutan bambu sakral.'
        },
        {
          title: 'Pura Ulun Danu Batur',
          category: 'situs-suci',
          badge: 'SITUS SUCI',
          icon: '⛩️',
          desc: 'Pura pemujaan Dewi Danu penguasa mata air dan kesuburan seluruh jaringan subak Bali tengah.'
        },
        {
          title: 'Anyaman Bambu & Kerajinan Akar',
          category: 'kerajinan',
          badge: 'KERAJINAN',
          icon: '⚒️',
          desc: 'Kriya anyaman wadah persembahan sokasi dan ukiran akar bambu khas masyarakat lereng Kintamani.'
        },
        {
          title: 'Tari Wayang Wong Parwa Sakral',
          category: 'tarian',
          badge: 'TARIAN',
          icon: '🎭',
          desc: 'Drama tari topeng sakral berlakon epos Ramayana kuno yang disucikan di pura desa Bangli.'
        }
      ]
    },
    jembrana: {
      id: 'jembrana',
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
          icon: '🎭',
          desc: 'Ensembel musik bambu terbesar di dunia dengan dentuman bas menggetarkan dada hingga jarak beberapa kilometer.'
        },
        {
          title: 'Pura Rambut Siwi',
          category: 'situs-suci',
          badge: 'SITUS SUCI',
          icon: '⛩️',
          desc: 'Pura tebing karang barat tempat pemujaan rambut suci Dang Hyang Dwijendra penjaga selat Bali.'
        },
        {
          title: 'Tenun Endek & Songket Jembrana',
          category: 'kerajinan',
          badge: 'KERAJINAN',
          icon: '⚒️',
          desc: 'Kerajinan tenun tradisional bermotif flora pesisir barat dengan ketahanan tenun prima.'
        },
        {
          title: 'Tradisi Balap Kerbau Makepung',
          category: 'upacara',
          badge: 'UPACARA',
          icon: '🧉',
          desc: 'Pesta perayaan syukur panen raya agraris dengan pacuan sepasang kerbau berhias mahkota emas.'
        }
      ]
    }
  };

  let currentRegion = 'gianyar';
  let currentFilter = 'semua';

  // 1. Region selection
  function selectRegion(regionId) {
    if (!regencyData[regionId]) return;
    currentRegion = regionId;

    // Update active SVG path
    regions.forEach((r) => {
      const isSelected = r.dataset.region === regionId;
      r.classList.toggle('is-active', isSelected);
      r.setAttribute('aria-selected', String(isSelected));
    });

    renderPanel();
  }

  // 2. Render side panel
  function renderPanel() {
    const data = regencyData[currentRegion];
    if (!data) return;

    if (panelTag) panelTag.textContent = data.tag;
    if (panelRegencyBadge) panelRegencyBadge.textContent = data.regency;
    if (panelNickname) panelNickname.textContent = data.nickname;
    if (panelTitle) panelTitle.textContent = data.name;
    if (panelDesc) panelDesc.textContent = data.desc;

    // Filter items
    const filteredItems = data.items.filter((item) => {
      return currentFilter === 'semua' || item.category === currentFilter;
    });

    if (panelCount) {
      panelCount.textContent = `${filteredItems.length} Warisan Terpilih`;
    }

    // Render list cards
    if (panelList) {
      panelList.innerHTML = '';
      if (filteredItems.length === 0) {
        if (emptyState) emptyState.hidden = false;
      } else {
        if (emptyState) emptyState.hidden = true;
        filteredItems.forEach((item) => {
          const card = document.createElement('article');
          card.className = 'peta-item-card';
          card.innerHTML = `
            <div class="peta-item-card__head">
              <div class="peta-item-card__title-group">
                <span class="peta-item-card__icon">${item.icon}</span>
                <h4 class="peta-item-card__title">${item.title}</h4>
              </div>
              <span class="peta-category-badge">${item.badge}</span>
            </div>
            <p class="peta-item-card__desc">${item.desc}</p>
          `;
          panelList.appendChild(card);
        });
      }
    }

    // Dim or highlight map dots based on category
    updateMapPoints();
  }

  // 3. Map points highlight/dim
  function updateMapPoints() {
    const points = document.querySelectorAll('#baliMap .map-point');
    points.forEach((pt) => {
      const ptCat = pt.dataset.category;
      if (currentFilter === 'semua' || !ptCat || ptCat === currentFilter) {
        pt.style.opacity = '1';
        pt.style.transform = '';
      } else {
        pt.style.opacity = '0.25';
      }
    });
  }

  // 4. Attach SVG region listeners
  regions.forEach((region) => {
    region.addEventListener('click', () => {
      selectRegion(region.dataset.region);
    });

    region.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectRegion(region.dataset.region);
      }
    });
  });

  // 5. Attach Filter Chip listeners
  filterChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      filterChips.forEach((c) => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      currentFilter = chip.dataset.filter || 'semua';
      renderPanel();
    });
  });

  // 6. Reset button
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      currentFilter = 'semua';
      filterChips.forEach((c) => {
        c.classList.toggle('is-active', c.dataset.filter === 'semua');
      });
      selectRegion('gianyar');
    });
  }

  // Initialize with Gianyar selected (matches screenshot default)
  selectRegion('gianyar');
}
