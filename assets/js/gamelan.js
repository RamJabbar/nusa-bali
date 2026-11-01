// Nusa Bali Heritage: Suara dan studio interaktif Gamelan Bali
// Mengolah nada perunggu krawang langsung di peramban, efek ombak berpasangan,
// pola kotekan, dan putaran melodi gending.

(function () {
  'use strict';

  // Laras pelog selisir (5 nada) 2 oktaf untuk gangsa pemade
  const NADA_PELOG_SELISIR = [
    {
      id: 'ding1',
      name: 'Ding',
      aksara: 'ᬤᬶᬂ',
      solfege: '1',
      freq: 224,
      dewa: 'Iswara',
      arah: 'Timur',
      warna: 'Putih',
      key: '1',
      keyChar: '1',
      octave: 1
    },
    {
      id: 'dong1',
      name: 'Dong',
      aksara: 'ᬤᭀᬂ',
      solfege: '2',
      freq: 248,
      dewa: 'Maheswara',
      arah: 'Tenggara',
      warna: 'Dadu',
      key: '2',
      keyChar: '2',
      octave: 1
    },
    {
      id: 'deng1',
      name: 'Deng',
      aksara: 'ᬤᬾᬂ',
      solfege: '3',
      freq: 278,
      dewa: 'Brahma',
      arah: 'Selatan',
      warna: 'Merah',
      key: '3',
      keyChar: '3',
      octave: 1
    },
    {
      id: 'dung1',
      name: 'Dung',
      aksara: 'ᬤᬸᬂ',
      solfege: '5',
      freq: 334,
      dewa: 'Wisnu',
      arah: 'Utara',
      warna: 'Hitam',
      key: '4',
      keyChar: '4',
      octave: 1
    },
    {
      id: 'dang1',
      name: 'Dang',
      aksara: 'ᬤᬂ',
      solfege: '6',
      freq: 374,
      dewa: 'Siwa',
      arah: 'Pusat',
      warna: 'Panca Warna',
      key: '5',
      keyChar: '5',
      octave: 1
    },
    {
      id: 'ding2',
      name: 'Ding',
      aksara: 'ᬤᬶᬂ',
      solfege: '1̇',
      freq: 448,
      dewa: 'Iswara',
      arah: 'Timur',
      warna: 'Putih',
      key: '6',
      keyChar: '6',
      octave: 2
    },
    {
      id: 'dong2',
      name: 'Dong',
      aksara: 'ᬤᭀᬂ',
      solfege: '2̇',
      freq: 496,
      dewa: 'Maheswara',
      arah: 'Tenggara',
      warna: 'Dadu',
      key: '7',
      keyChar: '7',
      octave: 2
    },
    {
      id: 'deng2',
      name: 'Deng',
      aksara: 'ᬤᬾᬂ',
      solfege: '3̇',
      freq: 556,
      dewa: 'Brahma',
      arah: 'Selatan',
      warna: 'Merah',
      key: '8',
      keyChar: '8',
      octave: 2
    },
    {
      id: 'dung2',
      name: 'Dung',
      aksara: 'ᬤᬸᬂ',
      solfege: '5̇',
      freq: 668,
      dewa: 'Wisnu',
      arah: 'Utara',
      warna: 'Hitam',
      key: '9',
      keyChar: '9',
      octave: 2
    },
    {
      id: 'dang2',
      name: 'Dang',
      aksara: 'ᬤᬂ',
      solfege: '6̇',
      freq: 748,
      dewa: 'Siwa',
      arah: 'Pusat',
      warna: 'Panca Warna',
      key: '0',
      keyChar: '0',
      octave: 2
    }
  ];

  // Reyong Bali: 12 pencon berderet mendatar untuk 4 penabuh
  const NADA_REYONG = [
    { id: 'reyong_1', name: 'Dang (rendah)', aksara: 'ᬤᬂ', freq: 187, key: 'Z', potIndex: 1 },
    { id: 'reyong_2', name: 'Ding', aksara: 'ᬤᬶᬂ', freq: 224, key: 'X', potIndex: 2 },
    { id: 'reyong_3', name: 'Dong', aksara: 'ᬤᭀᬂ', freq: 248, key: 'C', potIndex: 3 },
    { id: 'reyong_4', name: 'Deng', aksara: 'ᬤᬾᬂ', freq: 278, key: 'V', potIndex: 4 },
    { id: 'reyong_5', name: 'Dung', aksara: 'ᬤᬸᬂ', freq: 334, key: 'B', potIndex: 5 },
    { id: 'reyong_6', name: 'Dang', aksara: 'ᬤᬂ', freq: 374, key: 'N', potIndex: 6 },
    { id: 'reyong_7', name: 'Ding (sedang)', aksara: 'ᬤᬶᬂ', freq: 448, key: 'M', potIndex: 7 },
    { id: 'reyong_8', name: 'Dong', aksara: 'ᬤᭀᬂ', freq: 496, key: ',', potIndex: 8 },
    { id: 'reyong_9', name: 'Deng', aksara: 'ᬤᬾᬂ', freq: 556, key: '.', potIndex: 9 },
    { id: 'reyong_10', name: 'Dung', aksara: 'ᬤᬸᬂ', freq: 668, key: '/', potIndex: 10 },
    { id: 'reyong_11', name: 'Dang (tinggi)', aksara: 'ᬤᬂ', freq: 748, key: 'K', potIndex: 11 },
    { id: 'reyong_12', name: 'Ding (puncak)', aksara: 'ᬤᬶᬂ', freq: 896, key: 'L', potIndex: 12 }
  ];

  // Mesin penghasil suara gamelan di browser
  class MesinAudioGamelan {
    constructor() {
      this.konteks = null;
      this.penguatUtama = null;
      this.kompresor = null;
      this.nodeGema = null;
      this.sudahSiap = false;

      // Setelan getaran
      this.ombakAktif = true;
      this.selisihOmbak = 6.8;
      this.matedetAktif = false;
      this.volumeUtama = 0.85;
      this.transposisiNada = 0;

      // Pelacak suara yang sedang berbunyi untuk teknik matedet
      this.suaraAktif = new Map();
      this.waktuNadaTerakhir = 0;
      this.suaraGongAktif = null;
    }

    inisialisasi() {
      if (this.sudahSiap && this.konteks) {
        if (this.konteks.state === 'suspended' || this.konteks.state === 'interrupted') {
          this.konteks.resume();
        }
        return;
      }

      const KelasKonteksAudio = window.AudioContext || window.webkitAudioContext;
      if (!KelasKonteksAudio) {
        console.warn('Web Audio API tidak didukung pada peramban ini.');
        return;
      }

      this.konteks = new KelasKonteksAudio();

      // Kompresor agar suara tidak pecah saat banyak bilah berdentang bersamaan
      this.kompresor = this.konteks.createDynamicsCompressor();
      this.kompresor.threshold.setValueAtTime(-14, this.konteks.currentTime);
      this.kompresor.knee.setValueAtTime(8, this.konteks.currentTime);
      this.kompresor.ratio.setValueAtTime(6, this.konteks.currentTime);
      this.kompresor.attack.setValueAtTime(0.003, this.konteks.currentTime);
      this.kompresor.release.setValueAtTime(0.2, this.konteks.currentTime);

      // Pengatur volume keseluruhan
      this.penguatUtama = this.konteks.createGain();
      this.penguatUtama.gain.setValueAtTime(this.volumeUtama, this.konteks.currentTime);

      // Ruang gema sederhana menyerupai bale wantilan
      this.nodeGema = this.buatGemaSintetis(1.8, 2.2);

      // Rute audio: Sumber -> Suara langsung & Gema -> Kompresor -> Volume utama -> Pengeras suara
      const penguatKering = this.konteks.createGain();
      penguatKering.gain.setValueAtTime(0.85, this.konteks.currentTime);

      const penguatBasah = this.konteks.createGain();
      penguatBasah.gain.setValueAtTime(0.35, this.konteks.currentTime);

      this.jalurPenguat = this.konteks.createGain();
      this.jalurPenguat.connect(penguatKering);
      this.jalurPenguat.connect(this.nodeGema);

      penguatKering.connect(this.kompresor);
      this.nodeGema.connect(penguatBasah);
      penguatBasah.connect(this.kompresor);

      this.kompresor.connect(this.penguatUtama);
      this.penguatUtama.connect(this.konteks.destination);

      this.sudahSiap = true;
    }

    buatGemaSintetis(durasi, peluruhan) {
      const sampleRate = this.konteks.sampleRate;
      const length = Math.floor(sampleRate * durasi);
      const impuls = this.konteks.createBuffer(2, length, sampleRate);
      const left = impuls.getChannelData(0);
      const right = impuls.getChannelData(1);

      let energy = 0;
      for (let i = 0; i < length; i++) {
        const faktor = Math.exp(-i / (sampleRate * peluruhan * 0.25));
        const l = (Math.random() * 2 - 1) * faktor;
        const r = (Math.random() * 2 - 1) * faktor;
        left[i] = l;
        right[i] = r;
        energy += (l * l + r * r) * 0.5;
      }

      // Normalisasi agar volume gema seimbang
      const faktorNormal = Math.sqrt(energy) || 1;
      for (let i = 0; i < length; i++) {
        left[i] /= faktorNormal;
        right[i] /= faktorNormal;
      }

      const konvolver = this.konteks.createConvolver();
      konvolver.buffer = impuls;
      return konvolver;
    }

    pastikanKonteks() {
      if (!this.sudahSiap) {
        this.inisialisasi();
      }
      if (this.konteks && (this.konteks.state === 'suspended' || this.konteks.state === 'interrupted')) {
        this.konteks.resume();
      }
    }

    aturVolume(nilai) {
      this.volumeUtama = Math.max(0, Math.min(1, nilai));
      if (this.penguatUtama && this.konteks) {
        this.penguatUtama.gain.setTargetAtTime(this.volumeUtama, this.konteks.currentTime, 0.03);
      }
    }

    aturOmbakAktif(diaktifkan) {
      this.ombakAktif = Boolean(diaktifkan);
    }

    aturSelisihOmbak(selisih) {
      this.selisihOmbak = Math.max(0, Math.min(14, selisih));
    }

    aturMatedetAktif(diaktifkan) {
      this.matedetAktif = Boolean(diaktifkan);
    }

    // Redam getaran bilah dalam 40 milidetik saat tangan menutup bilah
    redamBilah(idNada) {
      const daftarSuara = this.suaraAktif.get(idNada);
      if (daftarSuara && daftarSuara.length && this.konteks) {
        const waktuSekarang = this.konteks.currentTime;
        daftarSuara.forEach(({ gainNode, startTime }) => {
          if (waktuSekarang - (startTime || 0) < 3.0) {
            try {
              gainNode.gain.cancelScheduledValues(waktuSekarang);
              gainNode.gain.setValueAtTime(gainNode.gain.value, waktuSekarang);
              gainNode.gain.exponentialRampToValueAtTime(0.0001, waktuSekarang + 0.04);
            } catch (e) {
              // Node mungkin sudah selesai diputar
            }
          }
        });
        this.suaraAktif.delete(idNada);
      }
    }

    redamSemua() {
      if (!this.konteks) return;
      this.suaraAktif.forEach((daftarSuara, idNada) => {
        this.redamBilah(idNada);
      });
      this.suaraAktif.clear();
    }

    // Nada bilah gangsa pemade
    mainkanNadaGangsa(dataNada, kecepatanPukul = 0.9) {
      this.pastikanKonteks();
      if (!this.konteks) return;

      const waktuSekarang = this.konteks.currentTime;

      // Jika matedet aktif, redam nada sebelumnya pada bilah yang sama
      if (this.matedetAktif) {
        this.redamBilah(dataNada.id);
      }

      const frekuensiDasar = dataNada.freq * Math.pow(2, this.transposisiNada / 12);

      // Nada tambahan khas getaran perunggu
      const parsialPerunggu = [
        { mult: 1.0, gain: 0.75, decay: 2.8 },
        { mult: 2.76, gain: 0.38, decay: 0.9 },
        { mult: 5.4, gain: 0.22, decay: 0.4 },
        { mult: 8.93, gain: 0.12, decay: 0.18 }
      ];

      const pasanganSuara = [];

      // Bunyi tunggal atau sepasang pengumbang dan pengisep
      const konfigurasiSuara = this.ombakAktif
        ? [
            { pan: -0.25, freqOffset: -this.selisihOmbak / 2, label: 'Pengumbang' },
            { pan: 0.25, freqOffset: +this.selisihOmbak / 2, label: 'Pengisep' }
          ]
        : [{ pan: 0.0, freqOffset: 0, label: 'Tunggal' }];

      konfigurasiSuara.forEach((setelan) => {
        const penguatSuara = this.konteks.createGain();
        const penataStereo = this.konteks.createStereoPanner ? this.konteks.createStereoPanner() : null;

        if (penataStereo) {
          penataStereo.pan.setValueAtTime(setelan.pan, waktuSekarang);
          penguatSuara.connect(penataStereo);
          penataStereo.connect(this.jalurPenguat);
        } else {
          penguatSuara.connect(this.jalurPenguat);
        }

        // Bumbung bambu resonator di bawah bilah
        const penyaringBumbung = this.konteks.createBiquadFilter();
        penyaringBumbung.type = 'peaking';
        penyaringBumbung.frequency.setValueAtTime(frekuensiDasar, waktuSekarang);
        penyaringBumbung.Q.setValueAtTime(4.5, waktuSekarang);
        penyaringBumbung.gain.setValueAtTime(7.0, waktuSekarang);

        // Osilator untuk setiap tingkatan getar perunggu
        parsialPerunggu.forEach((bagianParsial) => {
          const osilator = this.konteks.createOscillator();
          const penguatParsial = this.konteks.createGain();

          osilator.type = 'sine';
          const frekuensiTujuan = (frekuensiDasar + setelan.freqOffset) * bagianParsial.mult;
          osilator.frequency.setValueAtTime(frekuensiTujuan, waktuSekarang);

          const penguatPuncak = bagianParsial.gain * kecepatanPukul * (this.ombakAktif ? 0.65 : 0.9);
          penguatParsial.gain.setValueAtTime(0.0001, waktuSekarang);
          penguatParsial.gain.exponentialRampToValueAtTime(penguatPuncak, waktuSekarang + 0.002);
          penguatParsial.gain.exponentialRampToValueAtTime(0.0001, waktuSekarang + bagianParsial.decay);

          osilator.connect(penguatParsial);
          penguatParsial.connect(penyaringBumbung);

          osilator.start(waktuSekarang);
          osilator.stop(waktuSekarang + bagianParsial.decay + 0.1);
        });

        // Bunyi ketukan awal dari panggul kayu
        const osilatorKetukan = this.konteks.createOscillator();
        const penguatKetukan = this.konteks.createGain();
        osilatorKetukan.type = 'triangle';
        osilatorKetukan.frequency.setValueAtTime(frekuensiDasar * 6.2, waktuSekarang);
        osilatorKetukan.frequency.exponentialRampToValueAtTime(frekuensiDasar * 0.8, waktuSekarang + 0.02);

        penguatKetukan.gain.setValueAtTime(0.3 * kecepatanPukul, waktuSekarang);
        penguatKetukan.gain.exponentialRampToValueAtTime(0.0001, waktuSekarang + 0.025);

        osilatorKetukan.connect(penguatKetukan);
        penguatKetukan.connect(penyaringBumbung);

        osilatorKetukan.start(waktuSekarang);
        osilatorKetukan.stop(waktuSekarang + 0.03);

        penyaringBumbung.connect(penguatSuara);
        pasanganSuara.push({ gainNode: penguatSuara, startTime: waktuSekarang });
      });

      if (!this.suaraAktif.has(dataNada.id)) {
        this.suaraAktif.set(dataNada.id, []);
      }
      this.suaraAktif.get(dataNada.id).push(...pasanganSuara);

      setTimeout(() => {
        const daftar = this.suaraAktif.get(dataNada.id);
        if (daftar) {
          const suaraTersisa = daftar.filter((v) => v.startTime !== waktuSekarang);
          if (suaraTersisa.length === 0) {
            this.suaraAktif.delete(dataNada.id);
          } else {
            this.suaraAktif.set(dataNada.id, suaraTersisa);
          }
        }
      }, 3100);
    }

    // Bunyi pot reyong
    mainkanNadaReyong(dataNada, kecepatanPukul = 0.85) {
      this.pastikanKonteks();
      if (!this.konteks) return;

      const waktuSekarang = this.konteks.currentTime;
      const frekuensiDasar = dataNada.freq * Math.pow(2, this.transposisiNada / 12);

      const osilator1 = this.konteks.createOscillator();
      const osilator2 = this.konteks.createOscillator();
      const osilator3 = this.konteks.createOscillator();
      const nodePenguat = this.konteks.createGain();

      osilator1.type = 'sine';
      osilator1.frequency.setValueAtTime(frekuensiDasar, waktuSekarang);

      osilator2.type = 'sine';
      osilator2.frequency.setValueAtTime(frekuensiDasar * 2.08, waktuSekarang);

      osilator3.type = 'triangle';
      osilator3.frequency.setValueAtTime(frekuensiDasar * 3.42, waktuSekarang);

      const penguat1 = this.konteks.createGain();
      const penguat2 = this.konteks.createGain();
      const penguat3 = this.konteks.createGain();

      penguat1.gain.setValueAtTime(0.8 * kecepatanPukul, waktuSekarang);
      penguat1.gain.exponentialRampToValueAtTime(0.0001, waktuSekarang + 1.6);

      penguat2.gain.setValueAtTime(0.35 * kecepatanPukul, waktuSekarang);
      penguat2.gain.exponentialRampToValueAtTime(0.0001, waktuSekarang + 0.6);

      penguat3.gain.setValueAtTime(0.18 * kecepatanPukul, waktuSekarang);
      penguat3.gain.exponentialRampToValueAtTime(0.0001, waktuSekarang + 0.2);

      osilator1.connect(penguat1);
      osilator2.connect(penguat2);
      osilator3.connect(penguat3);

      penguat1.connect(nodePenguat);
      penguat2.connect(nodePenguat);
      penguat3.connect(nodePenguat);

      nodePenguat.connect(this.jalurPenguat);

      osilator1.start(waktuSekarang);
      osilator2.start(waktuSekarang);
      osilator3.start(waktuSekarang);

      osilator1.stop(waktuSekarang + 1.8);
      osilator2.stop(waktuSekarang + 1.8);
      osilator3.stop(waktuSekarang + 1.8);
    }

    // Pukulan kendang
    mainkanKendang(tipe = 'dug') {
      this.pastikanKonteks();
      if (!this.konteks) return;

      const waktuSekarang = this.konteks.currentTime;

      if (tipe === 'dug' || tipe === 'pung') {
        const osilator = this.konteks.createOscillator();
        const penguat = this.konteks.createGain();
        const titinadaAwal = tipe === 'dug' ? 140 : 175;
        const titinadaAkhir = tipe === 'dug' ? 58 : 72;

        osilator.type = 'sine';
        osilator.frequency.setValueAtTime(titinadaAwal, waktuSekarang);
        osilator.frequency.exponentialRampToValueAtTime(titinadaAkhir, waktuSekarang + 0.08);

        penguat.gain.setValueAtTime(0.95, waktuSekarang);
        penguat.gain.exponentialRampToValueAtTime(0.0001, waktuSekarang + 0.42);

        osilator.connect(penguat);
        penguat.connect(this.jalurPenguat);

        osilator.start(waktuSekarang);
        osilator.stop(waktuSekarang + 0.45);
      } else {
        const osilator = this.konteks.createOscillator();
        const penguat = this.konteks.createGain();
        osilator.type = 'triangle';
        osilator.frequency.setValueAtTime(420, waktuSekarang);
        osilator.frequency.exponentialRampToValueAtTime(180, waktuSekarang + 0.04);

        penguat.gain.setValueAtTime(0.8, waktuSekarang);
        penguat.gain.exponentialRampToValueAtTime(0.0001, waktuSekarang + 0.12);

        const penyanggaDesis = this.konteks.createBuffer(1, this.konteks.sampleRate * 0.05, this.konteks.sampleRate);
        const dataSaluran = penyanggaDesis.getChannelData(0);
        for (let i = 0; i < dataSaluran.length; i++) {
          dataSaluran[i] = (Math.random() * 2 - 1) * Math.exp(-i / (dataSaluran.length * 0.2));
        }
        const nodeDesis = this.konteks.createBufferSource();
        nodeDesis.buffer = penyanggaDesis;

        const penyaringDesis = this.konteks.createBiquadFilter();
        penyaringDesis.type = 'bandpass';
        penyaringDesis.frequency.setValueAtTime(1400, waktuSekarang);
        penyaringDesis.Q.setValueAtTime(2.0, waktuSekarang);

        const penguatDesis = this.konteks.createGain();
        penguatDesis.gain.setValueAtTime(0.4, waktuSekarang);
        penguatDesis.gain.exponentialRampToValueAtTime(0.0001, waktuSekarang + 0.05);

        nodeDesis.connect(penyaringDesis);
        penyaringDesis.connect(penguatDesis);
        penguatDesis.connect(this.jalurPenguat);

        osilator.connect(penguat);
        penguat.connect(this.jalurPenguat);

        osilator.start(waktuSekarang);
        nodeDesis.start(waktuSekarang);

        osilator.stop(waktuSekarang + 0.15);
        nodeDesis.stop(waktuSekarang + 0.06);
      }
    }

    // Dentang ceng-ceng kopyak
    mainkanCengCeng(tipe = 'crash') {
      this.pastikanKonteks();
      if (!this.konteks) return;

      const waktuSekarang = this.konteks.currentTime;
      const daftarTitinada = [820, 1150, 1420, 1920, 2650, 3800];
      const peluruhan = tipe === 'choke' ? 0.08 : 0.45;

      const penyaring = this.konteks.createBiquadFilter();
      penyaring.type = 'highpass';
      penyaring.frequency.setValueAtTime(3200, waktuSekarang);

      const penguat = this.konteks.createGain();
      penguat.gain.setValueAtTime(0.5, waktuSekarang);
      penguat.gain.exponentialRampToValueAtTime(0.0001, waktuSekarang + peluruhan);

      const penguatPerOsilator = 0.75 / daftarTitinada.length;
      daftarTitinada.forEach((frekuensi) => {
        const osilator = this.konteks.createOscillator();
        const penguatParsial = this.konteks.createGain();
        osilator.type = 'square';
        osilator.frequency.setValueAtTime(frekuensi, waktuSekarang);
        penguatParsial.gain.setValueAtTime(penguatPerOsilator, waktuSekarang);
        osilator.connect(penguatParsial);
        penguatParsial.connect(penyaring);
        osilator.start(waktuSekarang);
        osilator.stop(waktuSekarang + peluruhan + 0.02);
      });

      penyaring.connect(penguat);
      penguat.connect(this.jalurPenguat);
    }

    // Dentang gong ageng dan kempur
    mainkanGong(tipe = 'ageng') {
      this.pastikanKonteks();
      if (!this.konteks) return;

      const waktuSekarang = this.konteks.currentTime;
      const adalahAgeng = tipe === 'ageng';
      const frekuensiDasar = adalahAgeng ? 54 : 118;
      const peluruhan = adalahAgeng ? 5.2 : 3.4;

      if (this.suaraGongAktif && this.suaraGongAktif.type === tipe) {
        try {
          const penguatSebelumnya = this.suaraGongAktif.gainNode;
          penguatSebelumnya.gain.cancelScheduledValues(waktuSekarang);
          penguatSebelumnya.gain.setValueAtTime(penguatSebelumnya.gain.value, waktuSekarang);
          penguatSebelumnya.gain.exponentialRampToValueAtTime(0.0001, waktuSekarang + 0.08);
        } catch (e) {
          // Node mungkin sudah selesai
        }
      }

      const osilator1 = this.konteks.createOscillator();
      const osilator2 = this.konteks.createOscillator();
      const osilatorSub = this.konteks.createOscillator();

      osilator1.type = 'sine';
      osilator1.frequency.setValueAtTime(frekuensiDasar, waktuSekarang);

      osilator2.type = 'sine';
      osilator2.frequency.setValueAtTime(frekuensiDasar + (adalahAgeng ? 3.2 : 4.8), waktuSekarang);

      osilatorSub.type = 'triangle';
      osilatorSub.frequency.setValueAtTime(frekuensiDasar * 2.05, waktuSekarang);

      const penguatUtamaGong = this.konteks.createGain();
      penguatUtamaGong.gain.setValueAtTime(0.0001, waktuSekarang);
      penguatUtamaGong.gain.exponentialRampToValueAtTime(0.95, waktuSekarang + 0.015);
      penguatUtamaGong.gain.exponentialRampToValueAtTime(0.0001, waktuSekarang + peluruhan);

      osilator1.connect(penguatUtamaGong);
      osilator2.connect(penguatUtamaGong);
      osilatorSub.connect(penguatUtamaGong);

      const osilatorPanggul = this.konteks.createOscillator();
      const penguatPanggul = this.konteks.createGain();
      osilatorPanggul.type = 'sine';
      osilatorPanggul.frequency.setValueAtTime(frekuensiDasar * 1.5, waktuSekarang);
      osilatorPanggul.frequency.exponentialRampToValueAtTime(frekuensiDasar * 0.7, waktuSekarang + 0.06);

      penguatPanggul.gain.setValueAtTime(0.6, waktuSekarang);
      penguatPanggul.gain.exponentialRampToValueAtTime(0.0001, waktuSekarang + 0.08);

      osilatorPanggul.connect(penguatPanggul);
      penguatPanggul.connect(this.jalurPenguat);

      penguatUtamaGong.connect(this.jalurPenguat);

      this.suaraGongAktif = { type: tipe, gainNode: penguatUtamaGong, startTime: waktuSekarang };
      setTimeout(() => {
        if (this.suaraGongAktif && this.suaraGongAktif.startTime === waktuSekarang) {
          this.suaraGongAktif = null;
        }
      }, (peluruhan + 0.1) * 1000);

      osilator1.start(waktuSekarang);
      osilator2.start(waktuSekarang);
      osilatorSub.start(waktuSekarang);
      osilatorPanggul.start(waktuSekarang);

      osilator1.stop(waktuSekarang + peluruhan + 0.1);
      osilator2.stop(waktuSekarang + peluruhan + 0.1);
      osilatorSub.stop(waktuSekarang + peluruhan + 0.1);
      osilatorPanggul.stop(waktuSekarang + 0.1);
    }

    // Alias metode untuk kompatibilitas panggilan
    init() { return this.inisialisasi(); }
    ensureContext() { return this.pastikanKonteks(); }
    setVolume(val) { return this.aturVolume(val); }
    setOmbakEnabled(val) { return this.aturOmbakAktif(val); }
    setOmbakDelta(val) { return this.aturSelisihOmbak(val); }
    setMatedetEnabled(val) { return this.aturMatedetAktif(val); }
    dampenKey(id) { return this.redamBilah(id); }
    dampenAll() { return this.redamSemua(); }
    playGangsaNote(note, vel) { return this.mainkanNadaGangsa(note, vel); }
    playReyongNote(note, vel) { return this.mainkanNadaReyong(note, vel); }
    playKendang(type) { return this.mainkanKendang(type); }
    playCengCeng(type) { return this.mainkanCengCeng(type); }
    playGong(type) { return this.mainkanGong(type); }
  }

  // Buat contoh mesin audio global
  const mesinAudio = new MesinAudioGamelan();

  // Bagian 1: Bale tabuh interaktif
  function siapkanBaleTabuh() {
    const wadahBilah = document.getElementById('gangsaKeysContainer');
    const wadahReyong = document.getElementById('reyongKeysContainer');
    const tampilanNada = document.getElementById('currentNoteDisplay');
    const saklarMatedet = document.getElementById('matedetToggle');
    const saklarOmbak = document.getElementById('ombakToggle');
    const penggeserVolume = document.getElementById('gamelanVolume');
    const tabInstrumen = document.querySelectorAll('.inst-tab-btn');
    const panelInstrumen = document.querySelectorAll('.inst-panel');

    if (!wadahBilah) return;

    // Tampilkan 10 bilah gangsa pemade
    wadahBilah.innerHTML = '';
    NADA_PELOG_SELISIR.forEach((dataNada, index) => {
      const elemenBilah = document.createElement('button');
      elemenBilah.type = 'button';
      elemenBilah.className = `gangsa-key gangsa-key--octave-${dataNada.octave}`;
      elemenBilah.dataset.noteId = dataNada.id;
      elemenBilah.setAttribute('aria-label', `Bilah Gangsa ${dataNada.name} (${dataNada.aksara}), Nada ${dataNada.solfege}, Tombol ${dataNada.keyChar}`);
      elemenBilah.tabIndex = 0;

      const persenTinggi = 100 - index * 4.2;

      elemenBilah.innerHTML = `
        <div class="gangsa-key__inner" style="height: ${persenTinggi}%;">
          <span class="gangsa-key__rivet gangsa-key__rivet--top" aria-hidden="true"></span>
          <div class="gangsa-key__content">
            <span class="gangsa-key__aksara">${dataNada.aksara}</span>
            <span class="gangsa-key__name">${dataNada.name}</span>
            <span class="gangsa-key__solfege">${dataNada.solfege}</span>
          </div>
          <span class="gangsa-key__badge">${dataNada.keyChar}</span>
          <span class="gangsa-key__rivet gangsa-key__rivet--bot" aria-hidden="true"></span>
        </div>
        <div class="gangsa-key__tube" aria-hidden="true" title="Bumbung bambu resonator"></div>
      `;

      const picuNada = (e) => {
        if (e) e.preventDefault();
        mesinAudio.mainkanNadaGangsa(dataNada);
        animasikanPukulanBilah(elemenBilah, dataNada);
      };

      elemenBilah.addEventListener('pointerdown', picuNada);

      if (saklarMatedet) {
        elemenBilah.addEventListener('pointerup', () => {
          if (mesinAudio.matedetAktif) {
            mesinAudio.redamBilah(dataNada.id);
          }
        });
      }

      wadahBilah.appendChild(elemenBilah);
    });

    // Tampilkan 12 pot reyong
    if (wadahReyong) {
      wadahReyong.innerHTML = '';
      NADA_REYONG.forEach((dataNada) => {
        const elemenPot = document.createElement('button');
        elemenPot.type = 'button';
        elemenPot.className = 'reyong-pot';
        elemenPot.dataset.noteId = dataNada.id;
        elemenPot.setAttribute('aria-label', `Pot Reyong ${dataNada.name}, Nada ${dataNada.aksara}, Tombol ${dataNada.key}`);
        elemenPot.tabIndex = 0;

        elemenPot.innerHTML = `
          <div class="reyong-pot__boss">
            <span class="reyong-pot__pencu" aria-hidden="true"></span>
          </div>
          <div class="reyong-pot__meta">
            <span class="reyong-pot__aksara">${dataNada.aksara}</span>
            <span class="reyong-pot__key">${dataNada.key}</span>
          </div>
        `;

        elemenPot.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          mesinAudio.mainkanNadaReyong(dataNada);
          animasikanPukulanPot(elemenPot, dataNada);
        });

        wadahReyong.appendChild(elemenPot);
      });
    }

    // Respon visual saat bilah dipukul
    function animasikanPukulanBilah(elemen, dataNada) {
      elemen.classList.add('is-struck');
      setTimeout(() => elemen.classList.remove('is-struck'), 160);

      if (tampilanNada) {
        tampilanNada.innerHTML = `
          <span class="note-pill__aksara">${dataNada.aksara}</span>
          <span class="note-pill__name">${dataNada.name} (${dataNada.solfege})</span>
          <span class="note-pill__cosmic">Dewa ${dataNada.dewa}, arah ${dataNada.arah}</span>
        `;
        tampilanNada.classList.add('is-active');
        clearTimeout(tampilanNada._timeout);
        tampilanNada._timeout = setTimeout(() => {
          tampilanNada.classList.remove('is-active');
        }, 1800);
      }
    }

    function animasikanPukulanPot(elemen, dataNada) {
      elemen.classList.add('is-struck');
      setTimeout(() => elemen.classList.remove('is-struck'), 180);

      if (tampilanNada) {
        tampilanNada.innerHTML = `
          <span class="note-pill__aksara">${dataNada.aksara}</span>
          <span class="note-pill__name">Reyong ${dataNada.name}</span>
          <span class="note-pill__cosmic">${dataNada.freq} Hz</span>
        `;
      }
    }

    // Tombol ritme kendang, ceng-ceng, dan gong
    const tombolKendangDug = document.getElementById('padKendangDug');
    const tombolKendangPlak = document.getElementById('padKendangPlak');
    const tombolCengCrash = document.getElementById('padCengCrash');
    const tombolCengChoke = document.getElementById('padCengChoke');
    const tombolGongAgeng = document.getElementById('padGongAgeng');
    const tombolGongKempur = document.getElementById('padGongKempur');

    const pasangPukulanBantalan = (tombol, aksi, durasi = 160) => {
      if (!tombol) return;
      tombol.addEventListener('pointerdown', () => {
        aksi();
        tombol.classList.add('is-struck');
        setTimeout(() => tombol.classList.remove('is-struck'), durasi);
      });
    };

    pasangPukulanBantalan(tombolKendangDug, () => mesinAudio.mainkanKendang('dug'));
    pasangPukulanBantalan(tombolKendangPlak, () => mesinAudio.mainkanKendang('plak'));
    pasangPukulanBantalan(tombolCengCrash, () => mesinAudio.mainkanCengCeng('crash'));
    pasangPukulanBantalan(tombolCengChoke, () => mesinAudio.mainkanCengCeng('choke'));
    pasangPukulanBantalan(tombolGongAgeng, () => mesinAudio.mainkanGong('ageng'), 300);
    pasangPukulanBantalan(tombolGongKempur, () => mesinAudio.mainkanGong('kempur'), 240);

    // Sapuan jari pada bilah gangsa di layar sentuh
    let idGangsaSentuhAktif = null;
    wadahBilah.addEventListener('touchmove', (e) => {
      for (let i = 0; i < e.touches.length; i++) {
        const sentuh = e.touches[i];
        const elemen = document.elementFromPoint(sentuh.clientX, sentuh.clientY);
        const tombolBilah = elemen ? elemen.closest('.gangsa-key') : null;
        if (tombolBilah && tombolBilah.dataset.noteId && tombolBilah.dataset.noteId !== idGangsaSentuhAktif) {
          idGangsaSentuhAktif = tombolBilah.dataset.noteId;
          const nada = NADA_PELOG_SELISIR.find((n) => n.id === tombolBilah.dataset.noteId);
          if (nada) {
            mesinAudio.mainkanNadaGangsa(nada);
            animasikanPukulanBilah(tombolBilah, nada);
          }
        }
      }
    }, { passive: true });

    const aturUlangSentuhGangsa = () => { idGangsaSentuhAktif = null; };
    wadahBilah.addEventListener('touchend', aturUlangSentuhGangsa, { passive: true });
    wadahBilah.addEventListener('touchcancel', aturUlangSentuhGangsa, { passive: true });

    if (wadahReyong) {
      let idReyongSentuhAktif = null;
      wadahReyong.addEventListener('touchmove', (e) => {
        for (let i = 0; i < e.touches.length; i++) {
          const sentuh = e.touches[i];
          const elemen = document.elementFromPoint(sentuh.clientX, sentuh.clientY);
          const tombolPot = elemen ? elemen.closest('.reyong-pot') : null;
          if (tombolPot && tombolPot.dataset.noteId && tombolPot.dataset.noteId !== idReyongSentuhAktif) {
            idReyongSentuhAktif = tombolPot.dataset.noteId;
            const nada = NADA_REYONG.find((n) => n.id === tombolPot.dataset.noteId);
            if (nada) {
              mesinAudio.mainkanNadaReyong(nada);
              animasikanPukulanPot(tombolPot, nada);
            }
          }
        }
      }, { passive: true });

      const aturUlangSentuhReyong = () => { idReyongSentuhAktif = null; };
      wadahReyong.addEventListener('touchend', aturUlangSentuhReyong, { passive: true });
      wadahReyong.addEventListener('touchcancel', aturUlangSentuhReyong, { passive: true });
    }

    // Perpindahan tab instrumen
    tabInstrumen.forEach((tombol) => {
      tombol.addEventListener('click', () => {
        tabInstrumen.forEach((t) => {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        tombol.classList.add('is-active');
        tombol.setAttribute('aria-selected', 'true');

        const targetId = tombol.dataset.targetPanel;
        panelInstrumen.forEach((panel) => {
          panel.hidden = panel.id !== targetId;
        });
      });
    });

    // Saklar ombak
    if (saklarOmbak) {
      saklarOmbak.addEventListener('click', () => {
        const aktif = !mesinAudio.ombakAktif;
        mesinAudio.aturOmbakAktif(aktif);
        saklarOmbak.classList.toggle('is-active', aktif);
        saklarOmbak.setAttribute('aria-pressed', String(aktif));
        const tanda = saklarOmbak.querySelector('.status-dot');
        if (tanda) tanda.textContent = aktif ? 'Nyala' : 'Mati';
      });
    }

    // Saklar matedet (redam bilah)
    if (saklarMatedet) {
      saklarMatedet.addEventListener('click', () => {
        const aktif = !mesinAudio.matedetAktif;
        mesinAudio.aturMatedetAktif(aktif);
        saklarMatedet.classList.toggle('is-active', aktif);
        saklarMatedet.setAttribute('aria-pressed', String(aktif));
        const tanda = saklarMatedet.querySelector('.status-dot');
        if (tanda) tanda.textContent = aktif ? 'Nyala' : 'Mati';
      });
    }

    // Penggeser volume
    if (penggeserVolume) {
      penggeserVolume.addEventListener('input', (e) => {
        const nilai = parseFloat(e.target.value);
        mesinAudio.aturVolume(nilai);
      });
    }

    // Tombol keyboard (1-0 untuk gangsa, Z-M untuk reyong, Spasi untuk gong)
    window.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const elemenAktif = document.activeElement;
      if (elemenAktif && (['INPUT', 'TEXTAREA', 'SELECT'].includes(elemenAktif.tagName) || elemenAktif.isContentEditable)) {
        return;
      }

      if (e.code === 'Space') {
        const adalahInteraktif = elemenAktif && (['BUTTON', 'A', 'INPUT', 'TEXTAREA', 'SELECT', 'SUMMARY'].includes(elemenAktif.tagName));
        if (!adalahInteraktif) {
          e.preventDefault();
          mesinAudio.mainkanGong('ageng');
          if (tombolGongAgeng) {
            tombolGongAgeng.classList.add('is-struck');
            setTimeout(() => tombolGongAgeng.classList.remove('is-struck'), 300);
          }
        }
        return;
      }

      const karakterKunci = e.key.toUpperCase();

      const kecocokanGangsa = NADA_PELOG_SELISIR.find((n) => n.keyChar === e.key);
      if (kecocokanGangsa) {
        e.preventDefault();
        const elemen = wadahBilah.querySelector(`[data-note-id="${kecocokanGangsa.id}"]`);
        mesinAudio.mainkanNadaGangsa(kecocokanGangsa);
        if (elemen) animasikanPukulanBilah(elemen, kecocokanGangsa);
        return;
      }

      const kecocokanReyong = NADA_REYONG.find((n) => n.key === karakterKunci || n.key === e.key);
      if (kecocokanReyong && wadahReyong) {
        e.preventDefault();
        const elemen = wadahReyong.querySelector(`[data-note-id="${kecocokanReyong.id}"]`);
        mesinAudio.mainkanNadaReyong(kecocokanReyong);
        if (elemen) animasikanPukulanPot(elemen, kecocokanReyong);
        return;
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (mesinAudio.matedetAktif) {
        const cocok = NADA_PELOG_SELISIR.find((n) => n.keyChar === e.key);
        if (cocok) {
          mesinAudio.redamBilah(cocok.id);
        }
      }
    });
  }

  // Pengendali pemutaran audio global agar tidak bertumpukan
  let fungsiHentikanKotekan = null;
  let fungsiHentikanGending = null;
  let fungsiHentikanLabOmbak = null;

  function hentikanSemuaAudio(kecuali = null) {
    if (kecuali !== 'kotekan' && typeof fungsiHentikanKotekan === 'function') fungsiHentikanKotekan();
    if (kecuali !== 'gending' && typeof fungsiHentikanGending === 'function') fungsiHentikanGending();
    if (kecuali !== 'ombak' && typeof fungsiHentikanLabOmbak === 'function') fungsiHentikanLabOmbak();
  }

  // Bagian 2: Studio kotekan
  function siapkanStudioKotekan() {
    const tombolMainKotekan = document.getElementById('playKotekanBtn');
    const pilihanPeran = document.getElementById('kotekanRoleSelect');
    const pilihanPola = document.getElementById('kotekanPatternSelect');
    const penggeserTempo = document.getElementById('kotekanTempo');
    const nilaiTempo = document.getElementById('kotekanTempoVal');
    const kisiMatriks = document.getElementById('kotekanMatrixGrid');
    const statusKotekan = document.getElementById('kotekanStatusFeedback');

    if (!kisiMatriks || !tombolMainKotekan) return;

    // Pola 16 ketukan: angka adalah indeks di NADA_PELOG_SELISIR, -1 berarti istirahat
    const POLA_KOTEKAN = {
      norot: {
        name: 'Kotekan norot',
        desc: 'Pola dasar gong kebyar. Sangsih mengisi sela di antara ketukan polos.',
        polos:   [0, -1, 1, -1, 2, -1, 3, -1, 4, -1, 3, -1, 2, -1, 1, -1],
        sangsih: [-1, 1, -1, 2, -1, 3, -1, 4, -1, 5, -1, 4, -1, 3, -1, 2]
      },
      telu: {
        name: 'Kotekan telu',
        desc: 'Tiga nada yang dimainkan bergantian antara dua penabuh.',
        polos:   [1, -1, 2, -1, -1, 1, -1, 2, 3, -1, 2, -1, -1, 3, -1, 1],
        sangsih: [-1, 2, -1, 3, 2, -1, 3, -1, -1, 2, -1, 1, 2, -1, 2, -1]
      },
      empat: {
        name: 'Kotekan empat',
        desc: 'Empat nada cepat berpindah dengan aksen kuat.',
        polos:   [0, 1, -1, 2, 0, 1, -1, 3, 2, 1, -1, 0, 1, 2, 3, -1],
        sangsih: [-1, 2, 3, -1, -1, 2, 4, -1, -1, 3, 2, -1, -1, 3, 4, 5]
      }
    };

    let sedangMain = false;
    let idPewaktu = null;
    let langkahSaatIni = 0;
    let ketukanPerMenit = 140;

    function tampilkanKisi(kunciPola) {
      const polaTerpilih = POLA_KOTEKAN[kunciPola] || POLA_KOTEKAN.norot;
      kisiMatriks.innerHTML = '';

      const barisPolos = document.createElement('div');
      barisPolos.className = 'kotekan-row kotekan-row--polos';
      barisPolos.innerHTML = `<div class="kotekan-row__label"><span>Polos</span><small>(ketukan utama)</small></div>`;

      const barisSangsih = document.createElement('div');
      barisSangsih.className = 'kotekan-row kotekan-row--sangsih';
      barisSangsih.innerHTML = `<div class="kotekan-row__label"><span>Sangsih</span><small>(ketukan sela)</small></div>`;

      const wadahLangkahPolos = document.createElement('div');
      wadahLangkahPolos.className = 'kotekan-steps';

      const wadahLangkahSangsih = document.createElement('div');
      wadahLangkahSangsih.className = 'kotekan-steps';

      for (let i = 0; i < 16; i++) {
        const indeksNadaPolos = polaTerpilih.polos[i];
        const indeksNadaSangsih = polaTerpilih.sangsih[i];

        const selLangkahPolos = document.createElement('div');
        selLangkahPolos.className = `kotekan-cell ${indeksNadaPolos !== -1 ? 'has-note' : 'is-rest'}`;
        selLangkahPolos.dataset.step = i;
        if (indeksNadaPolos !== -1) {
          selLangkahPolos.innerHTML = `<span class="kotekan-cell__note">${NADA_PELOG_SELISIR[indeksNadaPolos]?.aksara || ''}</span>`;
        }
        wadahLangkahPolos.appendChild(selLangkahPolos);

        const selLangkahSangsih = document.createElement('div');
        selLangkahSangsih.className = `kotekan-cell ${indeksNadaSangsih !== -1 ? 'has-note' : 'is-rest'}`;
        selLangkahSangsih.dataset.step = i;
        if (indeksNadaSangsih !== -1) {
          selLangkahSangsih.innerHTML = `<span class="kotekan-cell__note">${NADA_PELOG_SELISIR[indeksNadaSangsih]?.aksara || ''}</span>`;
        }
        wadahLangkahSangsih.appendChild(selLangkahSangsih);
      }

      barisPolos.appendChild(wadahLangkahPolos);
      barisSangsih.appendChild(wadahLangkahSangsih);

      kisiMatriks.appendChild(barisPolos);
      kisiMatriks.appendChild(barisSangsih);
    }

    tampilkanKisi('norot');

    if (pilihanPola) {
      pilihanPola.addEventListener('change', (e) => {
        hentikanPengurut();
        tampilkanKisi(e.target.value);
      });
    }

    if (penggeserTempo && nilaiTempo) {
      penggeserTempo.addEventListener('input', (e) => {
        ketukanPerMenit = parseInt(e.target.value, 10);
        nilaiTempo.textContent = `${ketukanPerMenit} BPM`;
      });
    }

    function jadwalkanLangkah() {
      if (!sedangMain) return;
      saatKetukanLangkah();
      const durasiLangkahMs = (60000 / ketukanPerMenit) / 4;
      idPewaktu = setTimeout(jadwalkanLangkah, durasiLangkahMs);
    }

    function saatKetukanLangkah() {
      const kunciPolaTerpilih = pilihanPola ? pilihanPola.value : 'norot';
      const polaTerpilih = POLA_KOTEKAN[kunciPolaTerpilih] || POLA_KOTEKAN.norot;
      const peran = pilihanPeran ? pilihanPeran.value : 'duet';

      const semuaSel = kisiMatriks.querySelectorAll('.kotekan-cell');
      semuaSel.forEach((c) => {
        if (parseInt(c.dataset.step, 10) === langkahSaatIni) {
          c.classList.add('is-current-step');
        } else {
          c.classList.remove('is-current-step');
        }
      });

      const indeksNadaPolos = polaTerpilih.polos[langkahSaatIni];
      const indeksNadaSangsih = polaTerpilih.sangsih[langkahSaatIni];

      if (peran === 'duet') {
        if (indeksNadaPolos !== -1 && NADA_PELOG_SELISIR[indeksNadaPolos]) {
          mesinAudio.mainkanNadaGangsa(NADA_PELOG_SELISIR[indeksNadaPolos], 0.85);
        }
        if (indeksNadaSangsih !== -1 && NADA_PELOG_SELISIR[indeksNadaSangsih]) {
          mesinAudio.mainkanNadaGangsa(NADA_PELOG_SELISIR[indeksNadaSangsih], 0.85);
        }
      } else if (peran === 'user_polos') {
        if (indeksNadaSangsih !== -1 && NADA_PELOG_SELISIR[indeksNadaSangsih]) {
          mesinAudio.mainkanNadaGangsa(NADA_PELOG_SELISIR[indeksNadaSangsih], 0.85);
        }
      } else if (peran === 'user_sangsih') {
        if (indeksNadaPolos !== -1 && NADA_PELOG_SELISIR[indeksNadaPolos]) {
          mesinAudio.mainkanNadaGangsa(NADA_PELOG_SELISIR[indeksNadaPolos], 0.85);
        }
      }

      if (langkahSaatIni === 15) {
        mesinAudio.mainkanGong('kempur');
      }

      langkahSaatIni = (langkahSaatIni + 1) % 16;
    }

    function mulaiPengurut() {
      hentikanSemuaAudio('kotekan');
      mesinAudio.pastikanKonteks();
      sedangMain = true;
      langkahSaatIni = 0;
      tombolMainKotekan.classList.add('is-playing');
      tombolMainKotekan.setAttribute('aria-pressed', 'true');
      tombolMainKotekan.innerHTML = `<span>Jeda kotekan</span>`;
      if (statusKotekan) {
        statusKotekan.textContent = 'Kotekan sedang berjalan. Dengarkan jalinan nada kedua penabuh.';
      }
      if (idPewaktu) clearTimeout(idPewaktu);
      jadwalkanLangkah();
    }

    function hentikanPengurut() {
      sedangMain = false;
      if (idPewaktu) clearTimeout(idPewaktu);
      idPewaktu = null;
      tombolMainKotekan.classList.remove('is-playing');
      tombolMainKotekan.setAttribute('aria-pressed', 'false');
      tombolMainKotekan.innerHTML = `<span>Mulai kotekan</span>`;
      const semuaSel = kisiMatriks.querySelectorAll('.kotekan-cell');
      semuaSel.forEach((c) => c.classList.remove('is-current-step'));
      if (statusKotekan) {
        statusKotekan.textContent = 'Kotekan dijeda. Tekan tombol untuk melanjutkan.';
      }
    }

    fungsiHentikanKotekan = hentikanPengurut;

    tombolMainKotekan.addEventListener('click', () => {
      if (sedangMain) {
        hentikanPengurut();
      } else {
        mulaiPengurut();
      }
    });
  }

  // Bagian 3: Laboratorium akustik ombak
  function siapkanLabOmbak() {
    const kanvas = document.getElementById('ombakWaveCanvas');
    const penggeserFrekuensiDasar = document.getElementById('ombakBaseFreq');
    const penggeserSelisih = document.getElementById('ombakDeltaFreq');
    const tampilanFrekuensiDasar = document.getElementById('ombakBaseFreqVal');
    const tampilanSelisihFrekuensi = document.getElementById('ombakDeltaFreqVal');
    const tampilanHzPengumbang = document.getElementById('pengumbangHzVal');
    const tampilanHzPengisep = document.getElementById('pengisepHzVal');
    const tampilanKecepatanGetar = document.getElementById('ombakBeatRateDisplay');

    const tombolPlayPengumbang = document.getElementById('btnPlayPengumbang');
    const tombolPlayPengisep = document.getElementById('btnPlayPengisep');
    const tombolPlayDuetOmbak = document.getElementById('btnPlayDuetOmbak');

    if (!kanvas) return;

    const konteks2d = kanvas.getContext('2d');
    let frekuensiDasar = 260;
    let selisih = 6.8;
    let gelombangAktif = true;
    let bingkaiAnimasi = null;
    let fase = 0;

    let osilatorLab1 = null;
    let osilatorLab2 = null;
    let penguatLab1 = null;
    let penguatLab2 = null;
    let penguatUtamaLab = null;
    let bunyiLabAktif = null;

    function perbaruiHitungan() {
      const frekuensiPengumbang = +(frekuensiDasar - selisih / 2).toFixed(1);
      const frekuensiPengisep = +(frekuensiDasar + selisih / 2).toFixed(1);

      if (tampilanFrekuensiDasar) tampilanFrekuensiDasar.textContent = `${frekuensiDasar} Hz`;
      if (tampilanSelisihFrekuensi) tampilanSelisihFrekuensi.textContent = `Δ ${selisih} Hz`;
      if (tampilanHzPengumbang) tampilanHzPengumbang.textContent = `${frekuensiPengumbang} Hz (rendah)`;
      if (tampilanHzPengisep) tampilanHzPengisep.textContent = `${frekuensiPengisep} Hz (tinggi)`;
      if (tampilanKecepatanGetar) {
        const deskripsiKecepatan = selisih < 4.5 ? 'tenang' : selisih < 7.5 ? 'sedang' : 'cepat';
        tampilanKecepatanGetar.textContent = `${selisih} getaran per detik (${deskripsiKecepatan})`;
      }

      if (osilatorLab1 && mesinAudio.konteks) {
        osilatorLab1.frequency.setTargetAtTime(frekuensiPengumbang, mesinAudio.konteks.currentTime, 0.05);
      }
      if (osilatorLab2 && mesinAudio.konteks) {
        osilatorLab2.frequency.setTargetAtTime(frekuensiPengisep, mesinAudio.konteks.currentTime, 0.05);
      }
    }

    if (penggeserFrekuensiDasar) {
      penggeserFrekuensiDasar.addEventListener('input', (e) => {
        frekuensiDasar = parseFloat(e.target.value);
        perbaruiHitungan();
      });
    }

    if (penggeserSelisih) {
      penggeserSelisih.addEventListener('input', (e) => {
        selisih = parseFloat(e.target.value);
        mesinAudio.aturSelisihOmbak(selisih);
        perbaruiHitungan();
      });
    }

    function pastikanNodeAudioLab() {
      mesinAudio.pastikanKonteks();
      if (!mesinAudio.konteks) return;

      if (!penguatUtamaLab) {
        penguatUtamaLab = mesinAudio.konteks.createGain();
        penguatUtamaLab.gain.setValueAtTime(0.55, mesinAudio.konteks.currentTime);
        penguatUtamaLab.connect(mesinAudio.jalurPenguat);
      }

      if (!osilatorLab1) {
        osilatorLab1 = mesinAudio.konteks.createOscillator();
        penguatLab1 = mesinAudio.konteks.createGain();
        osilatorLab1.type = 'sine';
        penguatLab1.gain.setValueAtTime(0, mesinAudio.konteks.currentTime);
        osilatorLab1.connect(penguatLab1);
        penguatLab1.connect(penguatUtamaLab);
        osilatorLab1.start();
      }

      if (!osilatorLab2) {
        osilatorLab2 = mesinAudio.konteks.createOscillator();
        penguatLab2 = mesinAudio.konteks.createGain();
        osilatorLab2.type = 'sine';
        penguatLab2.gain.setValueAtTime(0, mesinAudio.konteks.currentTime);
        osilatorLab2.connect(penguatLab2);
        penguatLab2.connect(penguatUtamaLab);
        osilatorLab2.start();
      }
    }

    function hentikanBunyiLab() {
      if (!mesinAudio.konteks || !penguatLab1 || !penguatLab2) return;
      const waktuSekarang = mesinAudio.konteks.currentTime;
      penguatLab1.gain.setTargetAtTime(0, waktuSekarang, 0.06);
      penguatLab2.gain.setTargetAtTime(0, waktuSekarang, 0.06);
      bunyiLabAktif = null;

      [tombolPlayPengumbang, tombolPlayPengisep, tombolPlayDuetOmbak].forEach((b) => {
        if (b) b.classList.remove('is-active');
      });
    }

    function mainkanBunyiLab(mode) {
      pastikanNodeAudioLab();
      if (!mesinAudio.konteks) return;

      if (bunyiLabAktif === mode) {
        hentikanBunyiLab();
        return;
      }

      hentikanBunyiLab();
      hentikanSemuaAudio('ombak');
      bunyiLabAktif = mode;
      const waktuSekarang = mesinAudio.konteks.currentTime;
      const frekuensiPengumbang = frekuensiDasar - selisih / 2;
      const frekuensiPengisep = frekuensiDasar + selisih / 2;

      osilatorLab1.frequency.setValueAtTime(frekuensiPengumbang, waktuSekarang);
      osilatorLab2.frequency.setValueAtTime(frekuensiPengisep, waktuSekarang);

      if (mode === 'pengumbang') {
        penguatLab1.gain.setTargetAtTime(0.7, waktuSekarang, 0.04);
        penguatLab2.gain.setTargetAtTime(0, waktuSekarang, 0.04);
        if (tombolPlayPengumbang) tombolPlayPengumbang.classList.add('is-active');
      } else if (mode === 'pengisep') {
        penguatLab1.gain.setTargetAtTime(0, waktuSekarang, 0.04);
        penguatLab2.gain.setTargetAtTime(0.7, waktuSekarang, 0.04);
        if (tombolPlayPengisep) tombolPlayPengisep.classList.add('is-active');
      } else if (mode === 'both') {
        penguatLab1.gain.setTargetAtTime(0.5, waktuSekarang, 0.04);
        penguatLab2.gain.setTargetAtTime(0.5, waktuSekarang, 0.04);
        if (tombolPlayDuetOmbak) tombolPlayDuetOmbak.classList.add('is-active');
      }
    }

    fungsiHentikanLabOmbak = hentikanBunyiLab;

    if (tombolPlayPengumbang) {
      tombolPlayPengumbang.addEventListener('click', () => mainkanBunyiLab('pengumbang'));
    }
    if (tombolPlayPengisep) {
      tombolPlayPengisep.addEventListener('click', () => mainkanBunyiLab('pengisep'));
    }
    if (tombolPlayDuetOmbak) {
      tombolPlayDuetOmbak.addEventListener('click', () => mainkanBunyiLab('both'));
    }

    function sesuaikanUkuranKanvas() {
      const rasioPikselPerangkat = window.devicePixelRatio || 1;
      const kotakBatas = kanvas.getBoundingClientRect();
      const lebarTampilan = Math.round(kotakBatas.width || 600);
      const tinggiTampilan = 220;

      if (kanvas.width !== lebarTampilan * rasioPikselPerangkat || kanvas.height !== tinggiTampilan * rasioPikselPerangkat) {
        kanvas.width = lebarTampilan * rasioPikselPerangkat;
        kanvas.height = tinggiTampilan * rasioPikselPerangkat;
      }
    }

    window.addEventListener('resize', sesuaikanUkuranKanvas, { passive: true });
    sesuaikanUkuranKanvas();

    // Gambar getaran ombak pada kanvas
    function gambarBentukGelombang() {
      const rasioPikselPerangkat = window.devicePixelRatio || 1;
      const lebar = kanvas.width / rasioPikselPerangkat;
      const tinggi = kanvas.height / rasioPikselPerangkat;

      konteks2d.save();
      konteks2d.scale(rasioPikselPerangkat, rasioPikselPerangkat);
      konteks2d.clearRect(0, 0, lebar, tinggi);

      // Garis tengah
      konteks2d.strokeStyle = 'rgba(201, 162, 39, 0.15)';
      konteks2d.lineWidth = 1;
      konteks2d.beginPath();
      konteks2d.moveTo(0, tinggi / 2);
      konteks2d.lineTo(lebar, tinggi / 2);
      konteks2d.stroke();

      const frekuensiLayangan = selisih;

      // Gelombang hasil superposisi (warna emas kuratorial #C9A227)
      konteks2d.strokeStyle = '#C9A227';
      konteks2d.lineWidth = 2;
      konteks2d.beginPath();

      for (let x = 0; x < lebar; x++) {
        const t = (x / lebar) * 0.75 + fase;
        const amplopGelombang = Math.cos(Math.PI * frekuensiLayangan * t);
        const gelombangPembawa = Math.sin(2 * Math.PI * (frekuensiDasar * 0.08) * t);
        const y = (tinggi / 2) + amplopGelombang * gelombangPembawa * (tinggi * 0.38);

        if (x === 0) konteks2d.moveTo(x, y);
        else konteks2d.lineTo(x, y);
      }
      konteks2d.stroke();

      // Garis batas luar gelombang
      konteks2d.strokeStyle = 'rgba(201, 162, 39, 0.3)';
      konteks2d.setLineDash([4, 4]);
      konteks2d.lineWidth = 1;

      konteks2d.beginPath();
      for (let x = 0; x < lebar; x++) {
        const t = (x / lebar) * 0.75 + fase;
        const amplop = Math.abs(Math.cos(Math.PI * frekuensiLayangan * t));
        const posisiYAtas = (tinggi / 2) - amplop * (tinggi * 0.38);
        if (x === 0) konteks2d.moveTo(x, posisiYAtas);
        else konteks2d.lineTo(x, posisiYAtas);
      }
      konteks2d.stroke();

      konteks2d.beginPath();
      for (let x = 0; x < lebar; x++) {
        const t = (x / lebar) * 0.75 + fase;
        const amplop = Math.abs(Math.cos(Math.PI * frekuensiLayangan * t));
        const posisiYBawah = (tinggi / 2) + amplop * (tinggi * 0.38);
        if (x === 0) konteks2d.moveTo(x, posisiYBawah);
        else konteks2d.lineTo(x, posisiYBawah);
      }
      konteks2d.stroke();
      konteks2d.setLineDash([]);
      konteks2d.restore();

      fase += 0.0035;
      const fungsiAnimasiFrame = typeof window !== 'undefined' && window.requestAnimationFrame ? window.requestAnimationFrame : ((cb) => setTimeout(cb, 1000 / 60));
      bingkaiAnimasi = fungsiAnimasiFrame(gambarBentukGelombang);
    }

    perbaruiHitungan();
    gambarBentukGelombang();
  }

  // Bagian 4: Pemutar gending otomatis
  function siapkanPemutarGending() {
    const tombolMainGending = document.getElementById('playGendingBtn');
    const pemilihGending = document.getElementById('gendingSelect');
    const judulGending = document.getElementById('gendingCurrentTitle');
    const deskripsiGending = document.getElementById('gendingCurrentDesc');
    const batangKemajuan = document.getElementById('gendingProgressFill');
    const teksPewaktuGending = document.getElementById('gendingTimerText');

    if (!tombolMainGending) return;

    // Tiga contoh komposisi tabuh
    const REPERTOAR = {
      gilak: {
        title: 'Tabuh gilak (8 ketukan)',
        desc: 'Gending bertempo tegas yang biasa mengiringi tari barong dan baris gede.',
        bpm: 110,
        totalBeats: 32,
        events: [
          { beat: 0, type: 'gong', val: 'ageng' },
          { beat: 16, type: 'gong', val: 'ageng' },
          { beat: 8, type: 'gong', val: 'kempur' },
          { beat: 24, type: 'gong', val: 'kempur' },

          { beat: 0, type: 'kendang', val: 'dug' },
          { beat: 1, type: 'kendang', val: 'plak' },
          { beat: 2, type: 'kendang', val: 'dug' },
          { beat: 3.5, type: 'kendang', val: 'plak' },
          { beat: 4, type: 'kendang', val: 'dug' },
          { beat: 6, type: 'kendang', val: 'plak' },
          { beat: 8, type: 'kendang', val: 'dug' },
          { beat: 9, type: 'kendang', val: 'plak' },
          { beat: 10, type: 'kendang', val: 'dug' },
          { beat: 12, type: 'kendang', val: 'plak' },
          { beat: 14, type: 'kendang', val: 'dug' },
          { beat: 15.5, type: 'kendang', val: 'plak' },

          { beat: 2, type: 'ceng', val: 'choke' },
          { beat: 4, type: 'ceng', val: 'crash' },
          { beat: 6, type: 'ceng', val: 'choke' },
          { beat: 8, type: 'ceng', val: 'crash' },
          { beat: 10, type: 'ceng', val: 'choke' },
          { beat: 12, type: 'ceng', val: 'crash' },
          { beat: 14, type: 'ceng', val: 'choke' },

          { beat: 0, type: 'gangsa', idx: 0 },
          { beat: 1, type: 'gangsa', idx: 1 },
          { beat: 2, type: 'gangsa', idx: 2 },
          { beat: 3, type: 'gangsa', idx: 3 },
          { beat: 4, type: 'gangsa', idx: 4 },
          { beat: 5, type: 'gangsa', idx: 3 },
          { beat: 6, type: 'gangsa', idx: 2 },
          { beat: 7, type: 'gangsa', idx: 1 },
          { beat: 8, type: 'gangsa', idx: 0 },
          { beat: 9, type: 'gangsa', idx: 2 },
          { beat: 10, type: 'gangsa', idx: 4 },
          { beat: 11, type: 'gangsa', idx: 5 },
          { beat: 12, type: 'gangsa', idx: 4 },
          { beat: 13, type: 'gangsa', idx: 3 },
          { beat: 14, type: 'gangsa', idx: 2 },
          { beat: 15, type: 'gangsa', idx: 0 },

          { beat: 16, type: 'gangsa', idx: 5 },
          { beat: 17, type: 'gangsa', idx: 6 },
          { beat: 18, type: 'gangsa', idx: 7 },
          { beat: 19, type: 'gangsa', idx: 8 },
          { beat: 20, type: 'gangsa', idx: 9 },
          { beat: 21, type: 'gangsa', idx: 8 },
          { beat: 22, type: 'gangsa', idx: 7 },
          { beat: 23, type: 'gangsa', idx: 6 },
          { beat: 24, type: 'gangsa', idx: 5 },
          { beat: 25, type: 'gangsa', idx: 7 },
          { beat: 26, type: 'gangsa', idx: 9 },
          { beat: 27, type: 'gangsa', idx: 7 },
          { beat: 28, type: 'gangsa', idx: 8 },
          { beat: 29, type: 'gangsa', idx: 6 },
          { beat: 30, type: 'gangsa', idx: 5 },
          { beat: 31, type: 'gangsa', idx: 0 }
        ]
      },

      kebyar: {
        title: 'Gong kebyar',
        desc: 'Komposisi bertempo cepat dengan perubahan ritme dan aksen serentak.',
        bpm: 175,
        totalBeats: 32,
        events: [
          { beat: 0, type: 'gong', val: 'ageng' },
          { beat: 0, type: 'ceng', val: 'crash' },
          { beat: 0.5, type: 'gangsa', idx: 5 },
          { beat: 1.0, type: 'gangsa', idx: 6 },
          { beat: 1.5, type: 'gangsa', idx: 7 },
          { beat: 2.0, type: 'gangsa', idx: 8 },
          { beat: 2.5, type: 'gangsa', idx: 9 },
          { beat: 3.0, type: 'ceng', val: 'choke' },
          { beat: 4.0, type: 'ceng', val: 'crash' },
          { beat: 4.5, type: 'kendang', val: 'plak' },
          { beat: 5.0, type: 'gangsa', idx: 8 },
          { beat: 5.5, type: 'gangsa', idx: 7 },
          { beat: 6.0, type: 'gangsa', idx: 6 },
          { beat: 6.5, type: 'gangsa', idx: 5 },
          { beat: 8.0, type: 'gong', val: 'kempur' },
          { beat: 8.5, type: 'gangsa', idx: 2 },
          { beat: 9.0, type: 'gangsa', idx: 3 },
          { beat: 9.5, type: 'gangsa', idx: 4 },
          { beat: 10.0, type: 'gangsa', idx: 5 },
          { beat: 10.5, type: 'ceng', val: 'crash' },
          { beat: 12.0, type: 'kendang', val: 'dug' },
          { beat: 14.0, type: 'kendang', val: 'plak' },
          { beat: 16.0, type: 'gong', val: 'ageng' },
          { beat: 18.0, type: 'gangsa', idx: 7 },
          { beat: 20.0, type: 'gangsa', idx: 9 },
          { beat: 22.0, type: 'gangsa', idx: 8 },
          { beat: 24.0, type: 'gong', val: 'kempur' },
          { beat: 26.0, type: 'gangsa', idx: 6 },
          { beat: 28.0, type: 'gangsa', idx: 5 },
          { beat: 30.0, type: 'gangsa', idx: 2 },
          { beat: 31.5, type: 'gangsa', idx: 0 }
        ]
      },

      sekar: {
        title: 'Sekar gadung',
        desc: 'Gending bertempo lambat dengan nada-nada panjang yang tenang.',
        bpm: 78,
        totalBeats: 24,
        events: [
          { beat: 0, type: 'gong', val: 'ageng' },
          { beat: 1, type: 'gangsa', idx: 0 },
          { beat: 3, type: 'gangsa', idx: 1 },
          { beat: 5, type: 'gangsa', idx: 2 },
          { beat: 7, type: 'gangsa', idx: 3 },
          { beat: 9, type: 'gangsa', idx: 4 },
          { beat: 11, type: 'gangsa', idx: 3 },
          { beat: 12, type: 'gong', val: 'kempur' },
          { beat: 13, type: 'gangsa', idx: 2 },
          { beat: 15, type: 'gangsa', idx: 1 },
          { beat: 17, type: 'gangsa', idx: 0 },
          { beat: 19, type: 'gangsa', idx: 2 },
          { beat: 21, type: 'gangsa', idx: 4 },
          { beat: 23, type: 'gangsa', idx: 5 }
        ]
      }
    };

    let sedangMainGending = false;
    let pewaktuGending = null;
    let ketukanSaatIni = 0;
    let kunciTerpilih = 'gilak';

    function perbaruiKeteranganGending() {
      const dataGending = REPERTOAR[kunciTerpilih];
      if (!dataGending) return;
      if (judulGending) judulGending.textContent = dataGending.title;
      if (deskripsiGending) deskripsiGending.textContent = dataGending.desc;
    }

    if (pemilihGending) {
      pemilihGending.addEventListener('change', (e) => {
        hentikanGending();
        kunciTerpilih = e.target.value;
        perbaruiKeteranganGending();
      });
    }

    function saatKetukanGending() {
      const dataGending = REPERTOAR[kunciTerpilih];
      if (!dataGending) return;

      const kejadianCocok = dataGending.events.filter((ev) => Math.abs(ev.beat - ketukanSaatIni) < 0.25);

      kejadianCocok.forEach((ev) => {
        if (ev.type === 'gangsa' && NADA_PELOG_SELISIR[ev.idx]) {
          mesinAudio.mainkanNadaGangsa(NADA_PELOG_SELISIR[ev.idx], 0.85);
          const elemenBilah = document.querySelector(`[data-note-id="${NADA_PELOG_SELISIR[ev.idx].id}"]`);
          if (elemenBilah) {
            elemenBilah.classList.add('is-struck');
            setTimeout(() => elemenBilah.classList.remove('is-struck'), 160);
          }
        } else if (ev.type === 'kendang') {
          mesinAudio.mainkanKendang(ev.val);
        } else if (ev.type === 'ceng') {
          mesinAudio.mainkanCengCeng(ev.val);
        } else if (ev.type === 'gong') {
          mesinAudio.mainkanGong(ev.val);
        }
      });

      if (batangKemajuan) {
        const persentase = (ketukanSaatIni / dataGending.totalBeats) * 100;
        batangKemajuan.style.width = `${persentase}%`;
      }
      if (teksPewaktuGending) {
        teksPewaktuGending.textContent = `Ketukan ${Math.floor(ketukanSaatIni) + 1} dari ${dataGending.totalBeats}`;
      }

      ketukanSaatIni = Math.round((ketukanSaatIni + 0.5) * 10) / 10;
      if (ketukanSaatIni >= dataGending.totalBeats) {
        ketukanSaatIni = 0;
      }
    }

    function jadwalkanKetukanGending() {
      if (!sedangMainGending) return;
      saatKetukanGending();
      const dataGending = REPERTOAR[kunciTerpilih];
      const intervalMs = (60000 / dataGending.bpm) / 2;
      pewaktuGending = setTimeout(jadwalkanKetukanGending, intervalMs);
    }

    function mulaiGending() {
      hentikanSemuaAudio('gending');
      mesinAudio.pastikanKonteks();
      sedangMainGending = true;
      ketukanSaatIni = 0;
      tombolMainGending.classList.add('is-playing');
      tombolMainGending.setAttribute('aria-pressed', 'true');
      tombolMainGending.innerHTML = `<span>Jeda gending</span>`;

      if (pewaktuGending) clearTimeout(pewaktuGending);
      jadwalkanKetukanGending();
    }

    function hentikanGending() {
      sedangMainGending = false;
      if (pewaktuGending) clearTimeout(pewaktuGending);
      pewaktuGending = null;
      tombolMainGending.classList.remove('is-playing');
      tombolMainGending.setAttribute('aria-pressed', 'false');
      tombolMainGending.innerHTML = `<span>Putar gending</span>`;
      if (batangKemajuan) batangKemajuan.style.width = '0%';
    }

    fungsiHentikanGending = hentikanGending;

    tombolMainGending.addEventListener('click', () => {
      if (sedangMainGending) {
        hentikanGending();
      } else {
        mulaiGending();
      }
    });

    perbaruiKeteranganGending();
  }

  // Bagian 5: Denah sekaha di panggung
  function siapkanPenjelajahDenah() {
    const titikPanggung = document.querySelectorAll('.stage-spot');
    const kartuInformasi = document.getElementById('spatialDetailCard');
    const tombolDengarUji = document.getElementById('spatialAuditionBtn');

    if (!titikPanggung.length || !kartuInformasi) return;

    const DATA_PERAN = {
      kendang: {
        title: 'Kendang',
        kicker: 'Pemimpin tempo dan dinamika tabuh',
        desc: 'Sepasang kendang (lanang dan wadon) memimpin pergantian tempo dan aksen pukulan seluruh kelompok tanpa partitur.',
        aksara: 'ᬓᭂᬦ᭄ᬤᬂ',
        audioAction: () => mesinAudio.mainkanKendang('plak')
      },
      ugal: {
        title: 'Ugal',
        kicker: 'Pemandu melodi pokok gangsa',
        desc: 'Bilah ugal lebih besar dari pemade. Penabuh ugal memulai melodi awal dan memberi aba-aba peralihan nada.',
        aksara: 'ᬳᬸᬕᬮ᭄',
        audioAction: () => mesinAudio.mainkanNadaGangsa(NADA_PELOG_SELISIR[0])
      },
      pemade: {
        title: 'Gangsa pemade dan kantil',
        kicker: 'Pemain jalinan kotekan',
        desc: 'Dimainkan berpasangan untuk merajut melodi cepat dengan teknik meredam bilah secara bergantian.',
        aksara: 'ᬧᭂᬫᬤᬾ',
        audioAction: () => mesinAudio.mainkanNadaGangsa(NADA_PELOG_SELISIR[7])
      },
      reyong: {
        title: 'Reyong',
        kicker: 'Dua belas pencon untuk empat penabuh',
        desc: 'Deretan pencon mendatar yang dimainkan empat orang sekaligus secara bersilangan mengikuti pola tertentu.',
        aksara: 'ᬭᬾᬬᭀᬂ',
        audioAction: () => mesinAudio.mainkanNadaReyong(NADA_REYONG[4])
      },
      trompong: {
        title: 'Trompong',
        kicker: 'Pembawa ornamen melodi',
        desc: 'Deretan sepuluh pencon yang dimainkan satu penabuh dengan dua pemukul panjang untuk memperkaya alunan lagu.',
        aksara: 'ᬢ᭄ᬭᭀᬫ᭄ᬧᭀᬂ',
        audioAction: () => mesinAudio.mainkanNadaReyong(NADA_REYONG[2])
      },
      calung: {
        title: 'Calung dan jegogan',
        kicker: 'Fondasi nada rendah',
        desc: 'Bilah-bilah besar dengan bumbung bambu panjang yang menyuarakan melodi pokok pada ketukan tertentu.',
        aksara: 'ᬚᭂᬕᭀᬕᬦ᭄',
        audioAction: () => mesinAudio.mainkanNadaGangsa(NADA_PELOG_SELISIR[0], 0.95)
      },
      gong: {
        title: 'Gong ageng dan kempur',
        kicker: 'Penanda awal dan akhir putaran lagu',
        desc: 'Gong ageng digantung di baris belakang. Suaranya menandai akhir satu siklus melodi panjang.',
        aksara: 'ᬕᭀᬂ',
        audioAction: () => mesinAudio.mainkanGong('ageng')
      },
      cengceng: {
        title: 'Ceng-ceng kopyak',
        kicker: 'Aksen ritmis cepat',
        desc: 'Beberapa simbal kecil bertangkai yang beradu cepat mengikuti aba-aba dari kendang.',
        aksara: 'ᬘᬾᬂᬘᬾᬂ',
        audioAction: () => mesinAudio.mainkanCengCeng('crash')
      }
    };

    let kunciPeranAktif = 'kendang';

    function aturTitik(kunciPeran) {
      const dataPeran = DATA_PERAN[kunciPeran];
      if (!dataPeran) return;

      kunciPeranAktif = kunciPeran;
      titikPanggung.forEach((titik) => {
        const cocok = titik.dataset.role === kunciPeran;
        titik.classList.toggle('is-selected', cocok);
        titik.setAttribute('aria-pressed', String(cocok));
      });

      const elemenJudul = kartuInformasi.querySelector('.spatial-title');
      const elemenKicker = kartuInformasi.querySelector('.spatial-kicker');
      const elemenDesc = kartuInformasi.querySelector('.spatial-desc');
      const elemenAksara = kartuInformasi.querySelector('.spatial-aksara');

      if (elemenJudul) elemenJudul.textContent = dataPeran.title;
      if (elemenKicker) elemenKicker.textContent = dataPeran.kicker;
      if (elemenDesc) elemenDesc.textContent = dataPeran.desc;
      if (elemenAksara) elemenAksara.textContent = dataPeran.aksara;
    }

    titikPanggung.forEach((titik) => {
      titik.addEventListener('click', () => {
        aturTitik(titik.dataset.role);
        const dataPeran = DATA_PERAN[titik.dataset.role];
        if (dataPeran && typeof dataPeran.audioAction === 'function') {
          dataPeran.audioAction();
        }
      });
    });

    if (tombolDengarUji) {
      tombolDengarUji.addEventListener('click', () => {
        const dataPeran = DATA_PERAN[kunciPeranAktif];
        if (dataPeran && typeof dataPeran.audioAction === 'function') {
          dataPeran.audioAction();
        }
      });
    }

    aturTitik('kendang');
  }

  // Bagian 6: Penyaring tiga zaman gamelan
  function siapkanPenyaringEra() {
    const tombolPenyaring = document.querySelectorAll('.era-chip');
    const kartuEra = document.querySelectorAll('.era-card');

    if (!tombolPenyaring.length || !kartuEra.length) return;

    tombolPenyaring.forEach((tombol) => {
      tombol.addEventListener('click', () => {
        tombolPenyaring.forEach((b) => {
          const apakahAktif = b === tombol;
          b.classList.toggle('is-active', apakahAktif);
          b.setAttribute('aria-pressed', String(apakahAktif));
        });

        const kunciEra = tombol.dataset.era;
        kartuEra.forEach((kartu) => {
          const cocok = kunciEra === 'semua' || kartu.dataset.era === kunciEra;
          kartu.style.display = cocok ? '' : 'none';
          kartu.hidden = !cocok;
        });
      });
    });
  }

  // Bagian 7: Pencarian glosarium karawitan
  function siapkanGlosarium() {
    const masukanPencarian = document.getElementById('glosariumSearch');
    const daftarIstilah = document.querySelectorAll('.glosarium-item');
    const pesanKosong = document.getElementById('glosariumEmpty');

    if (!masukanPencarian || !daftarIstilah.length) return;

    masukanPencarian.addEventListener('input', (e) => {
      const kataKunci = e.target.value.toLowerCase().trim();
      let jumlahDitemukan = 0;

      daftarIstilah.forEach((butirIstilah) => {
        const istilah = (butirIstilah.dataset.term || '').toLowerCase();
        const teks = butirIstilah.textContent.toLowerCase();
        const sesuai = !kataKunci || istilah.includes(kataKunci) || teks.includes(kataKunci);

        butirIstilah.style.display = sesuai ? '' : 'none';
        if (sesuai) jumlahDitemukan++;
      });

      if (pesanKosong) pesanKosong.hidden = jumlahDitemukan > 0;
    });
  }

  // Inisialisasi utama saat halaman dimuat
  function inisialisasiGamelan() {
    siapkanBaleTabuh();
    siapkanStudioKotekan();
    siapkanLabOmbak();
    siapkanPemutarGending();
    siapkanPenjelajahDenah();
    siapkanPenyaringEra();
    siapkanGlosarium();

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        hentikanSemuaAudio();
      }
    });

    const bukaKunciAudio = () => {
      mesinAudio.pastikanKonteks();
      document.removeEventListener('pointerdown', bukaKunciAudio);
      document.removeEventListener('keydown', bukaKunciAudio);
    };
    document.addEventListener('pointerdown', bukaKunciAudio, { once: true });
    document.addEventListener('keydown', bukaKunciAudio, { once: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inisialisasiGamelan);
  } else {
    inisialisasiGamelan();
  }

  window.GamelanAudioEngine = mesinAudio;
})();
