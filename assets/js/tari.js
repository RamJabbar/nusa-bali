

const DAFTAR_KELAS_TARI = [
  "Baris",
  "Barong",
  "Condong",
  "Janger",
  "Kecak",
  "Pendet",
  "Pendet_Penyambutan",
  "Rejang_Sari",
  "Truna_jaya"
];

const AMBANG_KEYAKINAN = 0.70;
const AMBANG_ENTROPI = 1.40;

const RERATA_IMAGENET = [0.485, 0.456, 0.406];
const DEVIASI_IMAGENET = [0.229, 0.224, 0.225];

const DATA_KURATORIAL_TARI = {
  "Baris": {
    nama: "Tari Baris",
    aksara: "ᬢᬭᬶᬩᬭᬶᬲ᭄",
    kategori: "Wali & Bebali",
    deskripsi: "Tari keprajuritan yang biasa ditampilkan saat upacara di pura. Gerakannya tegas dan gagah — tatapan mata tajam, langkah kaki kokoh, bahu terangkat. Penari membawa senjata seperti tombak atau keris.",
    busana: "Gelungan kerucut berhias cermin kecil, badong di dada, keris di punggung.",
    gamelan: "Gong Gede atau Gong Beri, bertempo seperti mars militer.",
    gerakKhas: "Postur tegap, tatapan (seledet) kuat, langkah tegas, pundak diangkat tinggi."
  },
  "Barong": {
    nama: "Tari Barong",
    aksara: "ᬢᬭᬶᬩᬭᭀᬂ",
    kategori: "Wali & Bebali",
    deskripsi: "Barong adalah sosok pelindung kebaikan dalam mitologi Bali — ia bertarung melawan Rangda yang jahat. Dimainkan dua orang: satu di kepala, satu di ekor. Topengnya terbuat dari kayu pule yang diukir.",
    busana: "Topeng kayu besar bermahkota, badan ditutupi bulu ijuk atau serat ketepeng, perhiasan cermin.",
    gamelan: "Batel Barong, tempo cepat dan lincah dengan kendang gupekan.",
    gerakKhas: "Kaki bergemerincing, bulu badan dikibas-kibas, rahang kayu diketukkan dengan ritme tertentu."
  },
  "Condong": {
    nama: "Tari Condong",
    aksara: "ᬢᬭᬶᬘᭀᬦ᭄ᬤᭀᬂ",
    kategori: "Balih-balihan",
    deskripsi: "Penari dayang yang membuka pertunjukan Legong Keraton. Gerakannya halus tapi lincah, memegang sepasang kipas sutra. Dianggap sebagai fondasi teknik tari putri Bali — banyak penari belajar dari sini.",
    busana: "Gelungan bunga sedap malam dan kamboja, kemben dan kain prada, dua kipas sutra.",
    gamelan: "Semar Pegulingan atau Pelegongan, laras pelog lima nada yang melodis.",
    gerakKhas: "Gerakan tangan dan kipas presisi, goyangan pinggul (ngegol) ritmis, lirikan mata mengikuti irama reyong."
  },
  "Janger": {
    nama: "Tari Janger",
    aksara: "ᬢᬭᬶᬚᬗᬃ",
    kategori: "Balih-balihan",
    deskripsi: "Tari pergaulan anak muda dari Bali utara, populer sejak awal 1900-an. Dua kelompok saling berhadapan: perempuan (janger) duduk bersimpuh, laki-laki (kecak) berdiri. Mereka saling bersahutan dengan tembang dan tepukan.",
    busana: "Mahkota bertingkat dengan rumbai warna-warni, selendang prada.",
    gamelan: "Batel Janger dengan koor vokal rakyat bersahut-sahutan.",
    gerakKhas: "Gerakan tangan bergelombang, lirikan mata jenaka, tepuk tangan dan paha berirama."
  },
  "Kecak": {
    nama: "Tari Kecak",
    aksara: "ᬢᬭᬶᬓᭂᬘᬓ᭄",
    kategori: "Balih-balihan & Ritual",
    deskripsi: "Puluhan atau ratusan pria bertelanjang dada duduk melingkar di sekitar api, menyerukan 'cak-cak-cak' bersama-sama sebagai pengganti gamelan. Mereka menceritakan kisah Ramayana dengan gerakan tangan serempak.",
    busana: "Kain poleng hitam-putih, selendang merah, kamboja di telinga.",
    gamelan: "Tidak ada instrumen — seluruh musik adalah koor vokal manusia.",
    gerakKhas: "Tangan diangkat serempak, jemari bergetar, tubuh berayun kiri-kanan mengelilingi api."
  },
  "Pendet": {
    nama: "Tari Pendet",
    aksara: "ᬢᬭᬶᬧᭂᬦ᭄ᬤᭂᬢ᭄",
    kategori: "Wali",
    deskripsi: "Tari persembahan yang dilakukan para ibu dan wanita desa di halaman pura saat piodalan. Mereka membawa bokor perak berisi bunga dan air suci. Gerakannya tenang dan penuh rasa hormat.",
    busana: "Tapih prada kuning-putih, sanggul dengan bunga cempaka, bokor perak sesaji.",
    gamelan: "Gong Gede dengan tabuh lelambatan, tempo lambat dan khidmat.",
    gerakKhas: "Langkah pelan bersahaja, tatapan khusyuk, bunga ditaburkan ke arah pelinggih di akhir tarian."
  },
  "Pendet_Penyambutan": {
    nama: "Pendet Penyambutan",
    aksara: "ᬢᬭᬶᬧᭂᬦ᭄ᬤᭂᬢ᭄",
    kategori: "Balih-balihan",
    deskripsi: "Versi panggung dari Pendet, diciptakan I Wayan Beratha untuk menyambut tamu kehormatan. Gerakannya lebih riang dibanding Pendet sakral — di akhir, penari menaburkan bunga ke arah penonton.",
    busana: "Gelungan emas tegak, kemben prada merah, selendang kuning keemasan, bokor berisi bunga.",
    gamelan: "Gong Kebyar, tempo rancak dan ceria.",
    gerakKhas: "Gerak lincah, senyum terbuka, lirikan mata dinamis, bunga ditaburkan ke penonton."
  },
  "Rejang_Sari": {
    nama: "Tari Rejang Sari",
    aksara: "ᬢᬭᬶᬭᭂᬚᬗ᭄ᬲᬭᬶ",
    kategori: "Wali",
    deskripsi: "Barisan perempuan desa yang berjalan pelan melingkar mengitari pura, berbusana putih dan kuning gading. Atmosfernya sunyi dan meditatif — menggambarkan para bidadari dari Kahyangan yang turun ke bumi.",
    busana: "Dominan putih dan kuning gading, selendang sederhana, bunga kamboja di sanggul.",
    gamelan: "Gong Gede atau Semar Pegulingan, nuansa tenang dan syahdu.",
    gerakKhas: "Langkah beriringan pelan, tangan berayun lembut, pandangan lurus ke depan."
  },
  "Truna_jaya": {
    nama: "Tari Truna Jaya",
    aksara: "ᬢᬭᬶᬢ᭄ᬭᬸᬡᬚᬬ",
    kategori: "Balih-balihan",
    deskripsi: "Tari tunggal dari Buleleng, karya Pan Wandres sekitar 1915. Menggambarkan gejolak jiwa pemuda yang sedang beranjak dewasa — penuh emosi, kadang keras tiba-tiba, kadang lembut. Dianggap salah satu tari Kebyar paling ekspresif.",
    busana: "Destar ungu atau merah, badong prada, kain kampuh kontras, rumbai emas.",
    gamelan: "Gong Kebyar dengan angsel (aksen tiba-tiba) yang sangat dinamis.",
    gerakKhas: "Transisi cepat antara keras dan lembut, siku menyudut tajam, tatapan melotot, tiba-tiba berhenti atau meledak."
  }
};

let sesiInferensi = null;
let sedangMemuatModel = false;
let aliranKamera = null;

async function muatSesiModel() {
  if (sesiInferensi || sedangMemuatModel) return sesiInferensi;

  sedangMemuatModel = true;
  try {
    
    if (window.ort) {
      ort.env.wasm.wasmPaths = "https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/";
      ort.env.wasm.numThreads = 1; 
    }

    const jalurModel = [
      'assets/models/bali_dance_efficientnet_v2.onnx',
      'bali_dance_model/bali_dance_efficientnet_v2.onnx'
    ];

    for (const jalur of jalurModel) {
      try {
        sesiInferensi = await ort.InferenceSession.create(jalur, {
          executionProviders: ['wasm']
        });
        if (sesiInferensi) {
          sedangMemuatModel = false;
          return sesiInferensi;
        }
      } catch (errJalur) {
        
      }
    }

    throw new Error("Berkas model ONNX tidak ditemukan di lokasi aset.");
  } catch (galat) {
    sedangMemuatModel = false;
    console.error("Gagal memuat model ONNX:", galat);
    throw galat;
  }
}

function praprosesCitraKeTensor(elemenCitra) {
  const kanvas = document.createElement('canvas');
  kanvas.width = 224;
  kanvas.height = 224;
  const ctx = kanvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) {
    throw new Error("Gagal memperoleh konteks 2D kanvas.");
  }

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, 224, 224);

  ctx.drawImage(elemenCitra, 0, 0, 224, 224);

  const dataPiksel = ctx.getImageData(0, 0, 224, 224).data;
  const panjangPiksel = 224 * 224;
  const tensorData = new Float32Array(3 * panjangPiksel);

  for (let i = 0; i < panjangPiksel; i++) {
    const r = dataPiksel[i * 4] / 255.0;
    const g = dataPiksel[i * 4 + 1] / 255.0;
    const b = dataPiksel[i * 4 + 2] / 255.0;

    tensorData[i] = (r - RERATA_IMAGENET[0]) / DEVIASI_IMAGENET[0];
    tensorData[panjangPiksel + i] = (g - RERATA_IMAGENET[1]) / DEVIASI_IMAGENET[1];
    tensorData[2 * panjangPiksel + i] = (b - RERATA_IMAGENET[2]) / DEVIASI_IMAGENET[2];
  }

  return new ort.Tensor('float32', tensorData, [1, 3, 224, 224]);
}

function hitungEntropiShannon(larikProb) {
  let entropi = 0;
  for (let i = 0; i < larikProb.length; i++) {
    const p = larikProb[i];
    if (p > 1e-7) {
      entropi -= p * Math.log(p);
    }
  }
  return entropi;
}

async function jalankanKlasifikasi(elemenCitra) {
  tampilkanStatusMemuat(true);

  try {
    const sesi = await muatSesiModel();
    const tensorMasukan = praprosesCitraKeTensor(elemenCitra);

    const waktuMulai = performance.now();
    const luaran = await sesi.run({ input: tensorMasukan });
    const durasiMs = Math.round(performance.now() - waktuMulai);

    const probabilitas = luaran.probabilities.data;

    let indeksTertinggi = 0;
    let probTertinggi = probabilitas[0];

    for (let i = 1; i < probabilitas.length; i++) {
      if (probabilitas[i] > probTertinggi) {
        probTertinggi = probabilitas[i];
        indeksTertinggi = i;
      }
    }

    const entropi = hitungEntropiShannon(probabilitas);
    const kelasTerpilih = DAFTAR_KELAS_TARI[indeksTertinggi];

    const apakahHalusinasi = (probTertinggi < AMBANG_KEYAKINAN) || (entropi > AMBANG_ENTROPI);

    tampilkanHasilKlasifikasi({
      kelas: kelasTerpilih,
      keyakinan: probTertinggi,
      entropi: entropi,
      durasiMs: durasiMs,
      apakahHalusinasi: apakahHalusinasi,
      distribusi: probabilitas
    });
  } catch (galat) {
    console.error("Gagal melakukan klasifikasi:", galat);
    tampilkanGalat(galat.message || "Terjadi kendala saat memproses citra.");
  } finally {
    tampilkanStatusMemuat(false);
  }
}

function tampilkanHasilKlasifikasi(hasil) {
  const wadahKosong = document.getElementById('tariPlaceholder');
  const wadahHasil = document.getElementById('tariResultContent');
  if (wadahKosong) wadahKosong.hidden = true;
  if (wadahHasil) wadahHasil.hidden = false;

  const elemenBadge = document.getElementById('tariStatusBadge');
  const elemenNama = document.getElementById('tariResultName');
  const elemenAksara = document.getElementById('tariResultAksara');
  const elemenKategori = document.getElementById('tariResultCategory');
  const elemenAlert = document.getElementById('tariAlertBox');
  const elemenLatency = document.getElementById('tariLatencyVal');
  const elemenEntropy = document.getElementById('tariEntropyVal');
  const elemenConfidence = document.getElementById('tariConfidenceVal');
  const elemenBars = document.getElementById('tariBarsList');
  const elemenCuration = document.getElementById('tariCurationCard');

  if (elemenLatency) elemenLatency.innerHTML = `${hasil.durasiMs} <small>ms</small>`;
  if (elemenEntropy) elemenEntropy.innerHTML = `${hasil.entropi.toFixed(2)} <small>/ 1.40</small>`;
  if (elemenConfidence) elemenConfidence.innerHTML = `${(hasil.keyakinan * 100).toFixed(1)}<small>%</small>`;

  const infoTari = DATA_KURATORIAL_TARI[hasil.kelas] || {
    nama: hasil.kelas.replace('_', ' '),
    aksara: '',
    kategori: 'Tari Tradisional Bali',
    deskripsi: 'Dokumentasi ragam tari tradisional pulau Bali.',
    busana: 'Busana adat tari Bali.',
    gamelan: 'Iringan gamelan Bali.',
    gerakKhas: 'Gerak dasar tari Bali.'
  };

  if (hasil.apakahHalusinasi) {
    
    if (elemenBadge) {
      elemenBadge.className = 'tari-badge tari-badge--warning';
      elemenBadge.textContent = 'Tidak Dikenali';
    }
    if (elemenNama) elemenNama.textContent = 'Bukan Ragam Tari Bali';
    if (elemenAksara) {
      elemenAksara.textContent = '';
      elemenAksara.hidden = true;
    }
    if (elemenKategori) {
      elemenKategori.textContent = 'Foto ini belum cocok dengan 9 tari Bali dalam sistem.';
    }

    if (elemenAlert) {
      elemenAlert.hidden = false;
      elemenAlert.innerHTML = `
        <p class="tari-alert-text">
          Sistem tidak mendeteksi ciri khas dari 9 tari Bali (seperti busana adat, gelungan, atau pose tarian) pada foto ini. Model sengaja tidak menebak sembarangan agar hasil tetap akurat.
        </p>
        <p class="tari-alert-tip">
          <strong>Tips:</strong> Coba gunakan foto penari dengan pakaian tari atau pose yang tampak jelas.
        </p>
      `;
    }

    if (elemenCuration) elemenCuration.hidden = true;
  } else {
    
    if (elemenBadge) {
      elemenBadge.className = 'tari-badge tari-badge--success';
      elemenBadge.textContent = `Teridentifikasi (${(hasil.keyakinan * 100).toFixed(0)}%)`;
    }
    if (elemenNama) elemenNama.textContent = infoTari.nama;
    if (elemenAksara) {
      elemenAksara.textContent = infoTari.aksara;
      elemenAksara.hidden = false;
    }
    if (elemenKategori) elemenKategori.textContent = infoTari.kategori;

    if (elemenAlert) elemenAlert.hidden = true;

    if (elemenCuration) {
      elemenCuration.hidden = false;
      const descEl = document.getElementById('tariCurationDesc');
      const busanaEl = document.getElementById('tariCurationBusana');
      const gamelanEl = document.getElementById('tariCurationGamelan');
      const gerakEl = document.getElementById('tariCurationGerak');

      if (descEl) descEl.textContent = infoTari.deskripsi;
      if (busanaEl) busanaEl.textContent = infoTari.busana;
      if (gamelanEl) gamelanEl.textContent = infoTari.gamelan;
      if (gerakEl) gerakEl.textContent = infoTari.gerakKhas;
    }
  }

  if (elemenBars) {
    elemenBars.innerHTML = '';
    DAFTAR_KELAS_TARI.forEach((kelas, i) => {
      const prob = hasil.distribusi[i];
      const persen = (prob * 100).toFixed(1);
      const adalahPemenang = (i === DAFTAR_KELAS_TARI.indexOf(hasil.kelas)) && !hasil.apakahHalusinasi;

      const baris = document.createElement('div');
      baris.className = `tari-bar-row ${adalahPemenang ? 'is-winner' : ''}`;
      baris.innerHTML = `
        <div class="tari-bar-meta">
          <span>${kelas.replace('_', ' ')}</span>
          <span>${persen}%</span>
        </div>
        <div class="tari-bar-track">
          <div class="tari-bar-fill" style="width: ${persen}%"></div>
        </div>
      `;
      elemenBars.appendChild(baris);
    });
  }
}

function tampilkanStatusMemuat(apakahMemuat) {
  const loadingEl = document.getElementById('tariLoading');
  const resultEl = document.getElementById('tariResultContent');
  const placeholderEl = document.getElementById('tariPlaceholder');

  if (loadingEl) loadingEl.hidden = !apakahMemuat;
  if (apakahMemuat) {
    if (resultEl) resultEl.hidden = true;
    if (placeholderEl) placeholderEl.hidden = true;
  }
}

function tampilkanGalat(pesan) {
  const alertEl = document.getElementById('tariAlertBox');
  const resultEl = document.getElementById('tariResultContent');
  const placeholderEl = document.getElementById('tariPlaceholder');

  if (placeholderEl) placeholderEl.hidden = true;
  if (resultEl) resultEl.hidden = false;
  if (alertEl) {
    alertEl.hidden = false;
    alertEl.innerHTML = `<strong>Kendala Pemrosesan:</strong> ${pesan}`;
  }
}

function muatDanKlasifikasikanCitra(sumberUrl) {
  const previewImg = document.getElementById('tariPreviewImg');
  const previewBox = document.getElementById('tariPreviewBox');

  if (!previewImg) return;

  if (previewBox) previewBox.hidden = false;

  previewImg.onload = () => {
    jalankanKlasifikasi(previewImg);
  };
  previewImg.src = sumberUrl;
}

function inisialisasiTabMasukan() {
  const tabButtons = document.querySelectorAll('.tari-tab-btn');
  const viewPresets = document.getElementById('tariPresetsView');
  const viewUpload = document.getElementById('tariUploadView');
  const viewCamera = document.getElementById('tariCameraView');

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabButtons.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const mode = btn.dataset.tab;

      if (mode !== 'kamera' && aliranKamera) {
        hentikanKamera();
      }

      if (viewPresets) viewPresets.hidden = (mode !== 'contoh');
      if (viewUpload) viewUpload.hidden = (mode !== 'unggah');
      if (viewCamera) {
        viewCamera.hidden = (mode !== 'kamera');
        if (mode === 'kamera') {
          mulaiKamera();
        }
      }
    });
  });
}

function inisialisasiPresetContoh() {
  const presetCards = document.querySelectorAll('.tari-preset-card');

  presetCards.forEach((card) => {
    card.addEventListener('click', () => {
      presetCards.forEach((c) => c.classList.remove('is-selected'));
      card.classList.add('is-selected');

      const imgPath = card.dataset.src;
      if (imgPath) {
        muatDanKlasifikasikanCitra(imgPath);
      }
    });
  });
}

function inisialisasiUnggahBerkas() {
  const dropzone = document.getElementById('tariDropzone');
  const fileInput = document.getElementById('tariFileInput');
  const uploadBtn = document.getElementById('tariUploadBtn');

  if (!dropzone || !fileInput) return;

  if (uploadBtn) {
    uploadBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      fileInput.click();
    });
  }

  dropzone.addEventListener('click', () => {
    fileInput.click();
  });

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('is-dragover');
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('is-dragover');
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('is-dragover');
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
      tanganiBerkasCitra(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length) {
      tanganiBerkasCitra(e.target.files[0]);
    }
  });
}

function tanganiBerkasCitra(berkas) {
  if (!berkas || !berkas.type.startsWith('image/')) {
    alert("Silakan pilih berkas citra dalam format JPG, PNG, atau WebP.");
    return;
  }

  const pembaca = new FileReader();
  pembaca.onload = (e) => {
    if (e.target && e.target.result) {
      muatDanKlasifikasikanCitra(e.target.result);
    }
  };
  pembaca.readAsDataURL(berkas);
}

async function mulaiKamera() {
  const videoEl = document.getElementById('tariCameraVideo');
  const msgEl = document.getElementById('tariCameraMsg');

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    if (msgEl) msgEl.textContent = "Browser ini belum mendukung akses kamera langsung.";
    return;
  }

  try {
    aliranKamera = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
      audio: false
    });

    if (videoEl) {
      videoEl.srcObject = aliranKamera;
      videoEl.play();
    }
    if (msgEl) msgEl.textContent = "Arahkan kamera ke pose penari, lalu klik 'Ambil Foto'.";
  } catch (err) {
    console.warn("Gagal membuka kamera:", err);
    if (msgEl) {
      msgEl.textContent = "Izin kamera tidak diberikan atau perangkat kamera tidak ditemukan.";
    }
  }
}

function hentikanKamera() {
  if (aliranKamera) {
    aliranKamera.getTracks().forEach((track) => track.stop());
    aliranKamera = null;
  }
  const videoEl = document.getElementById('tariCameraVideo');
  if (videoEl) {
    videoEl.srcObject = null;
  }
}

function inisialisasiKontrolKamera() {
  const captureBtn = document.getElementById('tariCaptureBtn');
  const closeBtn = document.getElementById('tariCloseCameraBtn');

  if (captureBtn) {
    captureBtn.addEventListener('click', () => {
      const videoEl = document.getElementById('tariCameraVideo');
      if (!videoEl || !videoEl.videoWidth) {
        alert("Kamera belum siap mengambil citra.");
        return;
      }

      const kanvasTangkapan = document.createElement('canvas');
      kanvasTangkapan.width = videoEl.videoWidth;
      kanvasTangkapan.height = videoEl.videoHeight;
      const ctx = kanvasTangkapan.getContext('2d');
      ctx.drawImage(videoEl, 0, 0, kanvasTangkapan.width, kanvasTangkapan.height);

      const dataUrl = kanvasTangkapan.toDataURL('image/jpeg', 0.92);
      muatDanKlasifikasikanCitra(dataUrl);
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      hentikanKamera();
      
      const tabContoh = document.querySelector('.tari-tab-btn[data-tab="contoh"]');
      if (tabContoh) tabContoh.click();
    });
  }
}

function inisialisasiFilterKatalog() {
  const chips = document.querySelectorAll('.tari-filter-chip');
  const cards = document.querySelectorAll('.tari-ency-card');

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.remove('is-active'));
      chip.classList.add('is-active');

      const filterVal = chip.dataset.filter;

      cards.forEach((card) => {
        const cat = card.dataset.category || '';
        if (filterVal === 'semua' || cat.toLowerCase().includes(filterVal.toLowerCase())) {
          card.hidden = false;
        } else {
          card.hidden = true;
        }
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  inisialisasiTabMasukan();
  inisialisasiPresetContoh();
  inisialisasiUnggahBerkas();
  inisialisasiKontrolKamera();
  inisialisasiFilterKatalog();

  muatSesiModel().catch(() => {
    
  });
});
