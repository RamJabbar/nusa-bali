// Nusa Bali Heritage: modul latihan menulis aksara wianjana Bali

(function () {
  'use strict';

  // Ambang toleransi jarak piksel dan bobot perhitungan nilai ketepatan
  const TOLERANSI_KENA = 18;
  const SIMPANGAN_MAKS = 32;
  const BOBOT_PRESISI = 0.50;
  const BOBOT_KELENGKAPAN = 0.50;
  const SKOR_LULUS = 75;
  const KUNCI_PENYIMPANAN = 'nusabali_aksara_mastered';

  // Metadata aksara: makna filosofis, urutan hanacaraka, dan karakter Unicode Bali
  const metaAksara = {
    ha: {
      meaningShort: 'Prana, napas awal kehidupan',
      meaningLong: 'Prana, napas awal kehidupan dan ketuhanan',
      order: '01',
      char: 'ᬳ'
    },
    na: {
      meaningShort: 'Teja, pancaran energi dan daya cipta',
      meaningLong: 'Teja, pancaran energi api dan semangat hidup',
      order: '02',
      char: 'ᬦ'
    },
    ca: {
      meaningShort: 'Cahaya dan kejernihan pikiran',
      meaningLong: 'Cahaya kejernihan batin dan ketajaman budi',
      order: '03',
      char: 'ᬘ'
    },
    ra: {
      meaningShort: 'Keteguhan hati dan ketenangan rasa',
      meaningLong: 'Keteguhan sikap dan keberanian membela kebenaran',
      order: '04',
      char: 'ᬭ'
    },
    ka: {
      meaningShort: 'Sabda dan ketulusan niat',
      meaningLong: 'Kekuatan kata, kejujuran sabda, dan ketulusan niat',
      order: '05',
      char: 'ᬓ'
    },
    da: {
      meaningShort: 'Dharma, anugerah dan keikhlasan',
      meaningLong: 'Kebaikan hidup, kepedulian, dan keikhlasan bertindak',
      order: '06',
      char: 'ᬤ'
    },
    ta: {
      meaningShort: 'Konsentrasi dan fokus batin',
      meaningLong: 'Pemusatan pikiran dan ketenangan dalam bertindak',
      order: '07',
      char: 'ᬢ'
    },
    sa: {
      meaningShort: 'Kedamaian rasa dan ketenangan batin',
      meaningLong: 'Ketenangan rasa, keseimbangan batin, dan keheningan',
      order: '08',
      char: 'ᬲ'
    },
    wa: {
      meaningShort: 'Bayu, aliran napas dan dinamika gerak',
      meaningLong: 'Bayu, keselarasan napas, dan gerak yang teratur',
      order: '09',
      char: 'ᬯ'
    },
    la: {
      meaningShort: 'Keselarasan diri dengan alam semesta',
      meaningLong: 'Hubungan timbal balik antara manusia dan alam sekitar',
      order: '10',
      char: 'ᬮ'
    }
  };

  const daftarAksara = ['ha', 'na', 'ca', 'ra', 'ka', 'da', 'ta', 'sa', 'wa', 'la'];

  let kunciAktif = 'ha';
  let jalurGoresan = [];
  let jalurAktif = null;
  let penSedangMenekan = false;
  let tampilkanPanduan = true;
  let sudahDinilai = false;
  let idAnimasiPeragaan = null;
  let peragaanSedangJalan = false;

  let kanvasLatihan = null;
  let konteksGambar = null;
  let pembungkusKanvas = null;
  let penandaMulai = null;
  let papanHasil = null;
  let tombolPeragaan = null;

  // Mengambil daftar aksara yang sudah berhasil dikuasai dari penyimpanan lokal
  function muatAksaraTuntas() {
    try {
      const tersimpan = localStorage.getItem(KUNCI_PENYIMPANAN);
      return tersimpan ? JSON.parse(tersimpan) : [];
    } catch (_) {
      return [];
    }
  }

  // Menyimpan aksara baru yang berhasil lulus ke penyimpanan lokal
  function tandaiAksaraTuntas(kunci) {
    const daftar = muatAksaraTuntas();
    if (!daftar.includes(kunci)) {
      daftar.push(kunci);
      try {
        localStorage.setItem(KUNCI_PENYIMPANAN, JSON.stringify(daftar));
      } catch (_) {}
    }
    segarkanStatistikPenguasaan(daftar, kunci);
  }

  // Memperbarui hitungan, persentase, bilah progres, dan status centang baris
  function segarkanStatistikPenguasaan(daftar, kunciBaruLulus = null) {
    const jumlahTuntas = daftar.length;
    const persentaseProgres = Math.round((jumlahTuntas / 10) * 100);

    const elemenHitungan = document.getElementById('aksaraMasteredCount');
    if (elemenHitungan) elemenHitungan.textContent = jumlahTuntas;

    const elemenPersen = document.getElementById('aksaraProgressPercent');
    if (elemenPersen) elemenPersen.textContent = `${persentaseProgres}%`;

    const elemenBar = document.getElementById('aksaraProgressFill');
    if (elemenBar) elemenBar.style.width = `${persentaseProgres}%`;

    const elemenHeaderProgres = document.getElementById('aksaraHeaderProgress');
    if (elemenHeaderProgres) elemenHeaderProgres.textContent = `${jumlahTuntas} / 10 tuntas`;

    daftarAksara.forEach((kunci) => {
      const elemenStatus = document.getElementById(`status-${kunci}`);
      const elemenBaris = document.getElementById(`aksara-row-${kunci}`);
      if (!elemenStatus || !elemenBaris) return;

      const sudahTuntas = daftar.includes(kunci);
      if (sudahTuntas) {
        elemenBaris.classList.add('is-mastered');
        elemenStatus.innerHTML = `
          <span class="aksara-badge-check" title="Aksara dikuasai">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>`;
      } else {
        elemenBaris.classList.remove('is-mastered');
        const dataMeta = metaAksara[kunci] || { order: '00' };
        elemenStatus.innerHTML = `<span class="aksara-order-num">${dataMeta.order}</span>`;
      }

      // Animasi perayaan singkat saat baru saja lulus
      if (kunciBaruLulus && kunci === kunciBaruLulus) {
        elemenBaris.classList.remove('is-celebrating');
        void elemenBaris.offsetWidth;
        elemenBaris.classList.add('is-celebrating');
        setTimeout(() => elemenBaris.classList.remove('is-celebrating'), 1200);
      }
    });
  }

  // Inisialisasi utama ruang latihan aksara
  function siapkanStudioAksara() {
    const bagian = document.getElementById('bahasa');
    if (!bagian) return;

    if (!ambilKoleksiDataAksara()) {
      console.warn('Dataset aksara belum siap dimuat.');
      return;
    }

    simpanReferensiDOM();
    susunDaftarAksara();
    siapkanBidangGambar();
    pasangAksiStudio();
    segarkanStatistikPenguasaan(muatAksaraTuntas());
    gantiAksara('ha');
  }

  // Pastikan hoisting fungsi declaration tetap berfungsi normal saat DOM siap
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', siapkanStudioAksara);
  } else {
    siapkanStudioAksara();
  }

  // Menyimpan referensi elemen-elemen DOM yang sering diakses
  function simpanReferensiDOM() {
    kanvasLatihan = document.getElementById('aksaraCanvas');
    konteksGambar = kanvasLatihan ? kanvasLatihan.getContext('2d') : null;
    pembungkusKanvas = document.getElementById('aksaraCanvasWrap');
    penandaMulai = document.getElementById('aksaraStartDot');
    papanHasil = document.getElementById('aksaraResultPanel');
    tombolPeragaan = document.getElementById('aksaraDemoBtn');
  }

  // Menyusun baris daftar sepuluh aksara wianjana
  function susunDaftarAksara() {
    const wadahDaftar = document.getElementById('aksaraList');
    if (!wadahDaftar) return;

    const koleksiData = ambilKoleksiDataAksara();
    const daftarTuntas = muatAksaraTuntas();

    let markupBaris = '';
    daftarAksara.forEach((kunci) => {
      const dataKarakter = koleksiData[kunci];
      if (!dataKarakter) return;
      const dataMeta = metaAksara[kunci] || { meaningShort: '', order: '00', char: '' };
      const tuntas = daftarTuntas.includes(kunci);

      markupBaris += `
        <div class="aksara-item" id="aksara-row-${kunci}" data-key="${kunci}" role="tab" tabindex="0" aria-selected="false">
          <div class="aksara-item__preview-box" aria-hidden="true">
            <svg viewBox="0 0 300 300" class="aksara-item__preview-svg" preserveAspectRatio="xMidYMid meet">
              <path d="${dataKarakter.pathD}" fill="currentColor" />
            </svg>
          </div>
          <div class="aksara-item__meta">
            <h4 class="aksara-item__title">Aksara ${dataKarakter.label}</h4>
            <p class="aksara-item__meaning">${dataMeta.meaningShort}</p>
          </div>
          <div class="aksara-item__status" id="status-${kunci}">
            ${tuntas
              ? `<span class="aksara-badge-check" title="Aksara dikuasai"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg></span>`
              : `<span class="aksara-order-num">${dataMeta.order}</span>`
            }
          </div>
        </div>
      `;
    });

    wadahDaftar.innerHTML = markupBaris;

    wadahDaftar.querySelectorAll('.aksara-item').forEach((baris) => {
      const kunciBaris = baris.getAttribute('data-key');
      const pilihBaris = () => {
        if (kunciBaris !== kunciAktif) gantiAksara(kunciBaris);
      };

      baris.addEventListener('click', pilihBaris);
      baris.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          pilihBaris();
        }
      });
    });
  }

  // Menyiapkan interaksi pointer mouse, sentuhan, atau stylus pada permukaan kanvas
  function siapkanBidangGambar() {
    if (!kanvasLatihan || !konteksGambar) return;

    sesuaikanKanvasDenganDPR();
    window.addEventListener('resize', tundaPanggilan(sesuaikanKanvasDenganDPR, 100));

    kanvasLatihan.addEventListener('pointerdown', tanganiPointerTekan);
    kanvasLatihan.addEventListener('pointermove', tanganiPointerGeser);
    kanvasLatihan.addEventListener('pointerup', tanganiPointerLepas);
    kanvasLatihan.addEventListener('pointercancel', tanganiPointerLepas);
  }

  // Menyesuaikan resolusi kanvas dengan rasio piksel layar (HiDPI / Retina)
  function sesuaikanKanvasDenganDPR() {
    if (!kanvasLatihan || !konteksGambar) return;

    const kotakUkur = kanvasLatihan.getBoundingClientRect();
    if (kotakUkur.width === 0 || kotakUkur.height === 0) return;

    const rasioDPR = window.devicePixelRatio || 1;
    kanvasLatihan.width = Math.round(kotakUkur.width * rasioDPR);
    kanvasLatihan.height = Math.round(kotakUkur.height * rasioDPR);

    gambarUlangKanvas();
    posisikanPenandaMulai();
  }

  // Mengubah posisi piksel pointer ke kotak koordinat logis 300x300
  function petakanKoordinatLogis(e) {
    const kotakUkur = kanvasLatihan.getBoundingClientRect();
    const posisiX = ((e.clientX - kotakUkur.left) / kotakUkur.width) * 300;
    const posisiY = ((e.clientY - kotakUkur.top) / kotakUkur.height) * 300;
    return {
      x: Math.max(0, Math.min(300, posisiX)),
      y: Math.max(0, Math.min(300, posisiY))
    };
  }

  function tanganiPointerTekan(e) {
    if (e.button !== undefined && e.button !== 0) return;

    if (peragaanSedangJalan) {
      hentikanPeragaanGoresan();
    }

    if (sudahDinilai) {
      sudahDinilai = false;
      if (papanHasil) papanHasil.hidden = true;
    }

    penSedangMenekan = true;
    try {
      kanvasLatihan.setPointerCapture(e.pointerId);
    } catch (_) {}

    const titikKoordinat = petakanKoordinatLogis(e);
    jalurAktif = [titikKoordinat];
    jalurGoresan.push(jalurAktif);

    gambarUlangKanvas();
  }

  function tanganiPointerGeser(e) {
    if (!penSedangMenekan || !jalurAktif) return;

    const titikKoordinat = petakanKoordinatLogis(e);
    const titikTerakhir = jalurAktif[jalurAktif.length - 1];

    // Hindari mencatat titik yang terlalu berimpitan
    const jarakLangkah = Math.hypot(titikKoordinat.x - titikTerakhir.x, titikKoordinat.y - titikTerakhir.y);
    if (jarakLangkah < 2.5) return;

    jalurAktif.push(titikKoordinat);
    gambarUlangKanvas();
  }

  function tanganiPointerLepas(e) {
    if (!penSedangMenekan) return;
    penSedangMenekan = false;

    if (e?.pointerId) {
      try {
        kanvasLatihan.releasePointerCapture(e.pointerId);
      } catch (_) {}
    }

    jalurAktif = null;
    gambarUlangKanvas();
  }

  // Menggambar ulang seluruh lapisan: kisi, pola panduan, titik mulai, dan tinta pengguna
  function gambarUlangKanvas() {
    if (!kanvasLatihan || !konteksGambar) return;

    const skalaX = kanvasLatihan.width / 300;
    const skalaY = kanvasLatihan.height / 300;

    konteksGambar.setTransform(1, 0, 0, 1, 0, 0);
    konteksGambar.clearRect(0, 0, kanvasLatihan.width, kanvasLatihan.height);

    konteksGambar.setTransform(skalaX, 0, 0, skalaY, 0, 0);

    const aksaraAktif = ambilDataAksaraAktif();

    gambarGarisKisi();

    // Pola panduan garis putus-putus netral di atas permukaan lontar terang
    if (tampilkanPanduan && aksaraAktif?.pathD) {
      konteksGambar.save();
      const bentukJalur = new Path2D(aksaraAktif.pathD);
      konteksGambar.strokeStyle = 'rgba(45, 42, 38, 0.38)';
      konteksGambar.lineWidth = 2.4;
      konteksGambar.setLineDash([6, 5]);
      konteksGambar.stroke(bentukJalur);
      konteksGambar.restore();
    }

    // Titik awal goresan pertama
    if (aksaraAktif?.contours?.length && aksaraAktif.contours[0].length) {
      const titikAwal = aksaraAktif.contours[0][0];
      gambarTitikAwalGlif(titikAwal[0], titikAwal[1]);
    }

    if (jalurGoresan.length > 0) {
      gambarTintaPengguna();
    }
  }

  // Garis kisi dan penanda sudut bidang penulisan lontar
  function gambarGarisKisi() {
    konteksGambar.save();
    konteksGambar.strokeStyle = 'rgba(28, 26, 23, 0.08)';
    konteksGambar.lineWidth = 1;
    konteksGambar.setLineDash([4, 4]);

    konteksGambar.beginPath();
    konteksGambar.moveTo(150, 20);
    konteksGambar.lineTo(150, 280);
    konteksGambar.moveTo(20, 150);
    konteksGambar.lineTo(280, 150);
    konteksGambar.stroke();

    konteksGambar.beginPath();
    konteksGambar.arc(150, 150, 85, 0, Math.PI * 2);
    konteksGambar.stroke();

    konteksGambar.setLineDash([]);
    konteksGambar.strokeStyle = 'rgba(28, 26, 23, 0.16)';
    const penandaSudut = [
      [24, 24, 36, 24, 24, 36],
      [276, 24, 264, 24, 276, 36],
      [24, 276, 36, 276, 24, 264],
      [276, 276, 264, 276, 276, 264]
    ];
    penandaSudut.forEach(([ax, ay, bx, by, cx, cy]) => {
      konteksGambar.beginPath();
      konteksGambar.moveTo(bx, by);
      konteksGambar.lineTo(ax, ay);
      konteksGambar.lineTo(cx, cy);
      konteksGambar.stroke();
    });

    konteksGambar.restore();
  }

  // Lingkaran penanda titik awal tarikan pertama
  function gambarTitikAwalGlif(titikX, titikY) {
    konteksGambar.save();
    konteksGambar.fillStyle = 'rgba(179, 38, 30, 0.20)';
    konteksGambar.beginPath();
    konteksGambar.arc(titikX, titikY, 9, 0, Math.PI * 2);
    konteksGambar.fill();

    konteksGambar.fillStyle = '#B3261E';
    konteksGambar.beginPath();
    konteksGambar.arc(titikX, titikY, 4.5, 0, Math.PI * 2);
    konteksGambar.fill();

    konteksGambar.fillStyle = '#FFFFFF';
    konteksGambar.beginPath();
    konteksGambar.arc(titikX, titikY, 1.8, 0, Math.PI * 2);
    konteksGambar.fill();
    konteksGambar.restore();
  }

  // Menggambar goresan tinta pengguna (tinta gelap saat menggambar, berwarna saat dinilai)
  function gambarTintaPengguna() {
    konteksGambar.save();
    konteksGambar.lineCap = 'round';
    konteksGambar.lineJoin = 'round';

    if (!sudahDinilai) {
      konteksGambar.lineWidth = 7.2;
      konteksGambar.strokeStyle = '#1C1A17'; // Warna arang tradisi di atas lontar terang

      jalurGoresan.forEach((jalur) => {
        if (!jalur || jalur.length === 0) return;

        if (jalur.length === 1) {
          konteksGambar.fillStyle = '#1C1A17';
          konteksGambar.beginPath();
          konteksGambar.arc(jalur[0].x, jalur[0].y, 3.6, 0, Math.PI * 2);
          konteksGambar.fill();
          return;
        }

        konteksGambar.beginPath();
        konteksGambar.moveTo(jalur[0].x, jalur[0].y);

        for (let i = 1; i < jalur.length - 1; i++) {
          const titikTengahX = (jalur[i].x + jalur[i + 1].x) / 2;
          const titikTengahY = (jalur[i].y + jalur[i + 1].y) / 2;
          konteksGambar.quadraticCurveTo(jalur[i].x, jalur[i].y, titikTengahX, titikTengahY);
        }
        konteksGambar.lineTo(jalur[jalur.length - 1].x, jalur[jalur.length - 1].y);
        konteksGambar.stroke();
      });
    } else {
      // Penilaian visual: hijau (dekat), kuning/kuning tua (sedang), merah tua (jauh)
      konteksGambar.lineWidth = 7.2;

      jalurGoresan.forEach((jalur) => {
        if (!jalur || jalur.length === 0) return;

        if (jalur.length === 1) {
          const p = jalur[0];
          const akurat = (p.distToRef !== undefined && p.distToRef <= TOLERANSI_KENA);
          konteksGambar.fillStyle = akurat ? '#15803D' : '#B91C1C';
          konteksGambar.beginPath();
          konteksGambar.arc(p.x, p.y, 3.6, 0, Math.PI * 2);
          konteksGambar.fill();
          return;
        }

        for (let i = 0; i < jalur.length - 1; i++) {
          const p1 = jalur[i];
          const p2 = jalur[i + 1];
          const jarakRataRata = ((p1.distToRef || 0) + (p2.distToRef || 0)) / 2;

          konteksGambar.beginPath();
          konteksGambar.moveTo(p1.x, p1.y);
          konteksGambar.lineTo(p2.x, p2.y);

          if (jarakRataRata <= TOLERANSI_KENA) {
            konteksGambar.strokeStyle = '#15803D';
          } else if (jarakRataRata <= SIMPANGAN_MAKS) {
            konteksGambar.strokeStyle = '#B45309';
          } else {
            konteksGambar.strokeStyle = '#B91C1C';
          }
          konteksGambar.stroke();
        }
      });
    }

    konteksGambar.restore();
  }

  // Menentukan posisi titik mulai DOM agar tepat berimpit dengan titik di kanvas
  function posisikanPenandaMulai() {
    if (!penandaMulai) return;
    const dataAksara = ambilDataAksaraAktif();

    if (dataAksara?.contours?.length && dataAksara.contours[0].length) {
      const titikAwal = dataAksara.contours[0][0];
      const persenKiri = (titikAwal[0] / 300) * 100;
      const persenAtas = (titikAwal[1] / 300) * 100;
      penandaMulai.style.left = `${persenKiri}%`;
      penandaMulai.style.top = `${persenAtas}%`;
      penandaMulai.style.display = 'block';
    } else {
      penandaMulai.style.display = 'none';
    }
  }

  function alihStatusPeragaan() {
    if (peragaanSedangJalan) {
      hentikanPeragaanGoresan();
    } else {
      mulaiPeragaanGoresan();
    }
  }

  // Memutar simulasi tarikan goresan aksara tahap demi tahap
  function mulaiPeragaanGoresan() {
    const dataAksara = ambilDataAksaraAktif();
    if (!dataAksara?.contours?.length) return;

    peragaanSedangJalan = true;

    if (tombolPeragaan) {
      tombolPeragaan.classList.add('is-playing');
      tombolPeragaan.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <rect x="6" y="5" width="4" height="14" rx="1"/>
          <rect x="14" y="5" width="4" height="14" rx="1"/>
        </svg>
        Hentikan peragaan
      `;
    }

    const daftarKontur = dataAksara.contours;
    let indeksKontur = 0;
    let indeksKursor = 0;

    function jalankanFramePeragaan() {
      if (!peragaanSedangJalan) return;

      gambarUlangKanvas();

      konteksGambar.save();
      const faktorSkalaX = kanvasLatihan.width / 300;
      const faktorSkalaY = kanvasLatihan.height / 300;
      konteksGambar.setTransform(faktorSkalaX, 0, 0, faktorSkalaY, 0, 0);

      konteksGambar.lineCap = 'round';
      konteksGambar.lineJoin = 'round';

      // Gambar kontur yang sudah selesai digores sebelumnya
      for (let c = 0; c < indeksKontur; c++) {
        const garisKontur = daftarKontur[c];
        if (garisKontur.length < 2) continue;
        konteksGambar.strokeStyle = '#B3261E';
        konteksGambar.lineWidth = 5;
        konteksGambar.beginPath();
        konteksGambar.moveTo(garisKontur[0][0], garisKontur[0][1]);
        for (let p = 1; p < garisKontur.length; p++) {
          konteksGambar.lineTo(garisKontur[p][0], garisKontur[p][1]);
        }
        konteksGambar.stroke();
      }

      // Gambar kontur aktif yang sedang berjalan
      const konturAktif = daftarKontur[indeksKontur];
      if (konturAktif && konturAktif.length > 1) {
        konteksGambar.strokeStyle = '#B3261E';
        konteksGambar.lineWidth = 6;
        konteksGambar.beginPath();
        konteksGambar.moveTo(konturAktif[0][0], konturAktif[0][1]);
        const batasTitik = Math.min(indeksKursor, konturAktif.length - 1);
        for (let p = 1; p <= batasTitik; p++) {
          konteksGambar.lineTo(konturAktif[p][0], konturAktif[p][1]);
        }
        konteksGambar.stroke();

        // Titik pena aktif
        const ujungPena = konturAktif[batasTitik];
        konteksGambar.fillStyle = '#FFFFFF';
        konteksGambar.beginPath();
        konteksGambar.arc(ujungPena[0], ujungPena[1], 4.5, 0, Math.PI * 2);
        konteksGambar.fill();

        konteksGambar.fillStyle = 'rgba(179, 38, 30, 0.25)';
        konteksGambar.beginPath();
        konteksGambar.arc(ujungPena[0], ujungPena[1], 9, 0, Math.PI * 2);
        konteksGambar.fill();
      }

      konteksGambar.restore();

      indeksKursor += 3;
      if (indeksKursor >= konturAktif.length) {
        indeksKontur++;
        indeksKursor = 0;
        if (indeksKontur >= daftarKontur.length) {
          setTimeout(() => {
            hentikanPeragaanGoresan();
          }, 800);
          return;
        }
      }

      idAnimasiPeragaan = requestAnimationFrame(jalankanFramePeragaan);
    }

    idAnimasiPeragaan = requestAnimationFrame(jalankanFramePeragaan);
  }

  function hentikanPeragaanGoresan() {
    peragaanSedangJalan = false;
    if (idAnimasiPeragaan) {
      cancelAnimationFrame(idAnimasiPeragaan);
      idAnimasiPeragaan = null;
    }
    if (tombolPeragaan) {
      tombolPeragaan.classList.remove('is-playing');
      tombolPeragaan.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <polygon points="6 4 18 12 6 20 6 4" />
        </svg>
        Peragakan goresan
      `;
    }
    gambarUlangKanvas();
  }

  // Menilai presisi dan kelengkapan bentuk goresan terhadap titik kontur acuan
  function nilaiKetepatanGoresan() {
    const dataAksara = ambilDataAksaraAktif();
    if (!dataAksara?.contours?.length) return;

    const koordinatAcuan = [];
    dataAksara.contours.forEach((kontur) => {
      kontur.forEach((pt) => {
        koordinatAcuan.push({ x: pt[0], y: pt[1] });
      });
    });

    const titikTercatat = [];
    jalurGoresan.forEach((jalur) => {
      jalur.forEach((pt) => {
        titikTercatat.push(pt);
      });
    });

    if (titikTercatat.length < 5) {
      beriTahuKanvasKosong();
      return;
    }

    let sumPrecision = 0;
    for (let i = 0; i < titikTercatat.length; i++) {
      const titikGambar = titikTercatat[i];
      let jarakKuadratTerpendek = Infinity;

      for (let j = 0; j < koordinatAcuan.length; j++) {
        const selisihX = titikGambar.x - koordinatAcuan[j].x;
        const selisihY = titikGambar.y - koordinatAcuan[j].y;
        const jarakKuadrat = selisihX * selisihX + selisihY * selisihY;
        if (jarakKuadrat < jarakKuadratTerpendek) {
          jarakKuadratTerpendek = jarakKuadrat;
        }
      }

      const jarak = Math.sqrt(jarakKuadratTerpendek);
      titikGambar.distToRef = jarak;

      const akurasi = Math.max(0, 1 - (jarak / SIMPANGAN_MAKS));
      sumPrecision += akurasi;
    }

    const rasioPresisi = sumPrecision / titikTercatat.length;

    const toleransiKuadrat = TOLERANSI_KENA * TOLERANSI_KENA;
    let titikTerpenuhiHitungan = 0;

    for (let i = 0; i < koordinatAcuan.length; i++) {
      const titikAcuan = koordinatAcuan[i];
      let terkena = false;

      for (let j = 0; j < titikTercatat.length; j++) {
        const drawn = titikTercatat[j];
        const jarakX = titikAcuan.x - drawn.x;
        const jarakY = titikAcuan.y - drawn.y;
        if (jarakX * jarakX + jarakY * jarakY <= toleransiKuadrat) {
          terkena = true;
          break;
        }
      }

      if (terkena) titikTerpenuhiHitungan++;
    }

    const rasioKelengkapan = koordinatAcuan.length > 0 ? (titikTerpenuhiHitungan / koordinatAcuan.length) : 0;
    const skorGabungan = (rasioPresisi * BOBOT_PRESISI) + (rasioKelengkapan * BOBOT_KELENGKAPAN);
    const skorAkhir = Math.max(0, Math.min(100, Math.round(skorGabungan * 100)));

    const persenPresisi = Math.round(rasioPresisi * 100);
    const persenKelengkapan = Math.round(rasioKelengkapan * 100);

    tampilkanMetrikPenilaian(skorAkhir, persenPresisi, persenKelengkapan);

    sudahDinilai = true;
    gambarUlangKanvas();

    if (skorAkhir >= SKOR_LULUS) {
      tandaiAksaraTuntas(kunciAktif);
    }
  }

  function ambilElemenMetrikDOM() {
    return {
      score: document.getElementById('aksaraResultScore'),
      label: document.getElementById('aksaraResultLabel'),
      desc: document.getElementById('aksaraResultDesc'),
      precisionVal: document.getElementById('aksaraPrecisionVal'),
      coverageVal: document.getElementById('aksaraCoverageVal'),
      precisionBar: document.getElementById('aksaraPrecisionBar'),
      coverageBar: document.getElementById('aksaraCoverageBar'),
      status: document.getElementById('aksaraResultStatus')
    };
  }

  function beriTahuKanvasKosong() {
    if (!papanHasil) return;

    papanHasil.hidden = false;
    const elemenMetrik = ambilElemenMetrikDOM();

    if (elemenMetrik.score) elemenMetrik.score.textContent = '0%';
    if (elemenMetrik.label) {
      elemenMetrik.label.textContent = 'Kanvas masih kosong';
      elemenMetrik.label.className = 'aksara-result-label label--low';
    }
    if (elemenMetrik.desc) {
      elemenMetrik.desc.textContent = 'Goreskan jarimu di atas kanvas mengikuti garis putus-putus sebelum memeriksa nilai.';
    }
    if (elemenMetrik.precisionVal) elemenMetrik.precisionVal.textContent = '0%';
    if (elemenMetrik.coverageVal) elemenMetrik.coverageVal.textContent = '0%';
    if (elemenMetrik.precisionBar) elemenMetrik.precisionBar.style.width = '0%';
    if (elemenMetrik.coverageBar) elemenMetrik.coverageBar.style.width = '0%';
    if (elemenMetrik.status) {
      elemenMetrik.status.innerHTML = `
        <div class="aksara-alert aksara-alert--warn">
          <span>Tarik garis di kanvas dengan mouse, sentuhan jari, atau stylus.</span>
        </div>`;
    }
  }

  function tampilkanMetrikPenilaian(score, precPct, covPct) {
    if (!papanHasil) return;

    papanHasil.hidden = false;
    const elemenMetrik = ambilElemenMetrikDOM();

    if (elemenMetrik.score) elemenMetrik.score.textContent = `${score}%`;
    if (elemenMetrik.precisionVal) elemenMetrik.precisionVal.textContent = `${precPct}%`;
    if (elemenMetrik.coverageVal) elemenMetrik.coverageVal.textContent = `${covPct}%`;
    if (elemenMetrik.precisionBar) elemenMetrik.precisionBar.style.width = `${precPct}%`;
    if (elemenMetrik.coverageBar) elemenMetrik.coverageBar.style.width = `${covPct}%`;

    let teksLabel = '';
    let kelasLabel = '';
    let teksDeskripsi = '';

    if (score >= 80) {
      teksLabel = 'Tepat sekali';
      kelasLabel = 'label--high';
      teksDeskripsi = 'Goresanmu sudah selaras dengan pola aksara wianjana.';
    } else if (score >= 60) {
      teksLabel = 'Cukup dekat';
      kelasLabel = 'label--mid';
      teksDeskripsi = 'Bentuk dasar sudah terlihat. Perhatikan lekukan yang berwarna kuning atau merah.';
    } else {
      teksLabel = 'Perlu latihan lagi';
      kelasLabel = 'label--low';
      teksDeskripsi = 'Goresan masih banyak keluar dari jalur panduan. Mulai lagi dari titik merah.';
    }

    if (elemenMetrik.label) {
      elemenMetrik.label.textContent = teksLabel;
      elemenMetrik.label.className = `aksara-result-label ${kelasLabel}`;
    }
    if (elemenMetrik.desc) {
      elemenMetrik.desc.textContent = teksDeskripsi;
    }

    if (elemenMetrik.status) {
      if (score >= SKOR_LULUS) {
        elemenMetrik.status.innerHTML = `
          <div class="aksara-alert aksara-alert--success">
            <span><strong>Aksara dikuasai.</strong> Progres latihanmu sudah tersimpan di peramban ini.</span>
          </div>`;
      } else {
        elemenMetrik.status.innerHTML = `
          <div class="aksara-alert aksara-alert--info">
            <span>Skor kelulusan minimal <strong>75%</strong>. Tekan tombol <em>Hapus dan ulangi</em> untuk mencoba lagi.</span>
          </div>`;
      }
    }
  }

  function pasangAksiStudio() {
    const tombolReset = document.getElementById('aksaraBtnReset');
    if (tombolReset) {
      tombolReset.addEventListener('click', () => {
        jalurGoresan = [];
        sudahDinilai = false;
        if (papanHasil) papanHasil.hidden = true;
        if (peragaanSedangJalan) hentikanPeragaanGoresan();
        gambarUlangKanvas();
      });
    }

    const tombolPanduan = document.getElementById('aksaraBtnGuide');
    if (tombolPanduan) {
      tombolPanduan.addEventListener('click', () => {
        tampilkanPanduan = !tampilkanPanduan;
        tombolPanduan.classList.toggle('is-off', !tampilkanPanduan);
        gambarUlangKanvas();
      });
    }

    const tombolNilai = document.getElementById('aksaraBtnScore');
    if (tombolNilai) {
      tombolNilai.addEventListener('click', () => {
        if (peragaanSedangJalan) hentikanPeragaanGoresan();
        nilaiKetepatanGoresan();
      });
    }

    const tombolBerikutnya = document.getElementById('aksaraBtnNext');
    if (tombolBerikutnya) {
      tombolBerikutnya.addEventListener('click', () => {
        const indeksSekarang = daftarAksara.indexOf(kunciAktif);
        const indeksBerikutnya = (indeksSekarang + 1) % daftarAksara.length;
        gantiAksara(daftarAksara[indeksBerikutnya]);
      });
    }

    if (tombolPeragaan) {
      tombolPeragaan.addEventListener('click', alihStatusPeragaan);
    }

    const tombolTutupHasil = document.getElementById('aksaraResultClose');
    if (tombolTutupHasil) {
      tombolTutupHasil.addEventListener('click', () => {
        if (papanHasil) papanHasil.hidden = true;
      });
    }
  }

  function gantiAksara(kunci) {
    const koleksiData = ambilKoleksiDataAksara();
    if (!koleksiData || !koleksiData[kunci]) return;

    if (peragaanSedangJalan) hentikanPeragaanGoresan();

    kunciAktif = kunci;
    jalurGoresan = [];
    sudahDinilai = false;
    if (papanHasil) papanHasil.hidden = true;

    daftarAksara.forEach((k) => {
      const elemenBaris = document.getElementById(`aksara-row-${k}`);
      if (!elemenBaris) return;
      const sedangAktif = (k === kunci);
      elemenBaris.classList.toggle('is-active', sedangAktif);
      elemenBaris.setAttribute('aria-selected', String(sedangAktif));

      if (sedangAktif && window.innerWidth <= 992) {
        elemenBaris.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });

    const dataKarakter = koleksiData[kunci];
    const dataMeta = metaAksara[kunci] || { meaningLong: '', char: '' };

    const elemenNama = document.getElementById('aksaraActiveName');
    if (elemenNama) elemenNama.textContent = `Aksara ${dataKarakter.label}`;

    const elemenGlif = document.getElementById('aksaraActiveGlyph');
    if (elemenGlif) elemenGlif.textContent = dataMeta.char;

    const elemenUnicode = document.getElementById('aksaraActiveUnicode');
    if (elemenUnicode) elemenUnicode.textContent = dataKarakter.unicode;

    const elemenMakna = document.getElementById('aksaraActiveMeaning');
    if (elemenMakna) elemenMakna.textContent = dataMeta.meaningLong;

    posisikanPenandaMulai();
    gambarUlangKanvas();
  }

  function ambilKoleksiDataAksara() {
    if (typeof dataAksara !== 'undefined') return dataAksara;
    if (typeof aksaraData !== 'undefined') return aksaraData;
    if (typeof window !== 'undefined' && window.dataAksara) return window.dataAksara;
    if (typeof window !== 'undefined' && window.aksaraData) return window.aksaraData;
    return null;
  }

  function ambilDataAksaraAktif() {
    const koleksiData = ambilKoleksiDataAksara();
    return koleksiData ? koleksiData[kunciAktif] : null;
  }

  function tundaPanggilan(fungsiPanggilan, jedaWaktu) {
    let pengaturWaktu;
    return function (...argumen) {
      clearTimeout(pengaturWaktu);
      pengaturWaktu = setTimeout(() => fungsiPanggilan.apply(this, argumen), jedaWaktu);
    };
  }
})();
