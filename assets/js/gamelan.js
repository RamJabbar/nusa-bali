// Nusa Bali Heritage — Mesin Akustik & Studio Interaktif Gamelan Bali
// Mengimplementasikan sintesis fisik perunggu krawang (Web Audio API),
// fenomena ombak (paired-tuning pengumbang-pengisep), simulasi kotekan, dan autoplayer gending.

(function () {
  'use strict';

  // =========================================================================
  // 1. DATA KONFIGURASI LARAS & INSTRUMEN GAMELAN BALI
  // =========================================================================

  // Laras Pelog Selisir (5-Nada Pentatonik Sakral) 2 Oktaf untuk Gangsa Pemade
  // Disesuaikan dengan skala frekuensi ansambel Gong Kebyar klasik (pusat A440)
  const PELOG_SELISIR_NOTES = [
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

  // Reyong Bali — 12 Pot Pencon Berderet Horizontal (Dimainkan 4 Penabuh)
  const REYONG_NOTES = [
    { id: 'reyong_1', name: 'Dang (Rendah)', aksara: 'ᬤᬂ', freq: 187, key: 'Z', potIndex: 1 },
    { id: 'reyong_2', name: 'Ding', aksara: 'ᬤᬶᬂ', freq: 224, key: 'X', potIndex: 2 },
    { id: 'reyong_3', name: 'Dong', aksara: 'ᬤᭀᬂ', freq: 248, key: 'C', potIndex: 3 },
    { id: 'reyong_4', name: 'Deng', aksara: 'ᬤᬾᬂ', freq: 278, key: 'V', potIndex: 4 },
    { id: 'reyong_5', name: 'Dung', aksara: 'ᬤᬸᬂ', freq: 334, key: 'B', potIndex: 5 },
    { id: 'reyong_6', name: 'Dang', aksara: 'ᬤᬂ', freq: 374, key: 'N', potIndex: 6 },
    { id: 'reyong_7', name: 'Ding (Madya)', aksara: 'ᬤᬶᬂ', freq: 448, key: 'M', potIndex: 7 },
    { id: 'reyong_8', name: 'Dong', aksara: 'ᬤᭀᬂ', freq: 496, key: ',', potIndex: 8 },
    { id: 'reyong_9', name: 'Deng', aksara: 'ᬤᬾᬂ', freq: 556, key: '.', potIndex: 9 },
    { id: 'reyong_10', name: 'Dung', aksara: 'ᬤᬸᬂ', freq: 668, key: '/', potIndex: 10 },
    { id: 'reyong_11', name: 'Dang (Tinggi)', aksara: 'ᬤᬂ', freq: 748, key: 'K', potIndex: 11 },
    { id: 'reyong_12', name: 'Ding (Puncak)', aksara: 'ᬤᬶᬂ', freq: 896, key: 'L', potIndex: 12 }
  ];

  // =========================================================================
  // 2. WEB AUDIO API SYNTHESIZER: AKUSTIK PERUNGGU & TABUH BALI
  // =========================================================================

  class BalineseGamelanAudioEngine {
    constructor() {
      this.ctx = null;
      this.masterGain = null;
      this.compressor = null;
      this.reverbNode = null;
      this.isInitialized = false;

      // Konfigurasi Akustik
      this.ombakEnabled = true;
      this.ombakDelta = 6.8; // Selisih frekuensi Pengumbang & Pengisep (~6-7 Hz)
      this.matedetEnabled = false; // Mode redam bilah
      this.masterVolume = 0.85;
      this.pitchTranspose = 0; // dalam semitone (-2 s.d +2)

      // Pelacak suara aktif untuk teknik Matedet (damping)
      this.activeVoices = new Map();
      this.recentNoteTimestamp = 0;
      this.activeGongVoice = null;
    }

    init() {
      if (this.isInitialized && this.ctx) {
        if (this.ctx.state === 'suspended' || this.ctx.state === 'interrupted') {
          this.ctx.resume();
        }
        return;
      }

      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtxClass) {
        console.warn('Web Audio API tidak didukung pada peramban ini.');
        return;
      }

      this.ctx = new AudioCtxClass();

      // Master Compressor untuk mencegah distorsi saat banyak instrumen berdentang bersamaan
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-14, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(8, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(6, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.2, this.ctx.currentTime);

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);

      // Efek Ambiens Suci (Courtyard Reverb / Ambience Hall) menggunakan Convolver sintetis
      this.reverbNode = this.createSyntheticReverb(1.8, 2.2);

      // Routing audio: Voices -> Reverb & Dry -> Compressor -> Master -> Destination
      const dryGain = this.ctx.createGain();
      dryGain.gain.setValueAtTime(0.85, this.ctx.currentTime);

      const wetGain = this.ctx.createGain();
      wetGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

      this.busGain = this.ctx.createGain();
      this.busGain.connect(dryGain);
      this.busGain.connect(this.reverbNode);

      dryGain.connect(this.compressor);
      this.reverbNode.connect(wetGain);
      wetGain.connect(this.compressor);

      this.compressor.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      this.isInitialized = true;
    }

    createSyntheticReverb(duration, decay) {
      const sampleRate = this.ctx.sampleRate;
      const length = Math.floor(sampleRate * duration);
      const impulse = this.ctx.createBuffer(2, length, sampleRate);
      const left = impulse.getChannelData(0);
      const right = impulse.getChannelData(1);

      let energy = 0;
      for (let i = 0; i < length; i++) {
        const factor = Math.exp(-i / (sampleRate * decay * 0.25));
        const l = (Math.random() * 2 - 1) * factor;
        const r = (Math.random() * 2 - 1) * factor;
        left[i] = l;
        right[i] = r;
        energy += (l * l + r * r) * 0.5;
      }

      // Normalisasi energi impulse response agar sinyal convolver tidak melonjak ~66x lipat
      const norm = Math.sqrt(energy) || 1;
      for (let i = 0; i < length; i++) {
        left[i] /= norm;
        right[i] /= norm;
      }

      const convolver = this.ctx.createConvolver();
      convolver.buffer = impulse;
      return convolver;
    }

    ensureContext() {
      if (!this.isInitialized) {
        this.init();
      }
      if (this.ctx && (this.ctx.state === 'suspended' || this.ctx.state === 'interrupted')) {
        this.ctx.resume();
      }
    }

    setVolume(val) {
      this.masterVolume = Math.max(0, Math.min(1, val));
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setTargetAtTime(this.masterVolume, this.ctx.currentTime, 0.03);
      }
    }

    setOmbakEnabled(enabled) {
      this.ombakEnabled = Boolean(enabled);
    }

    setOmbakDelta(delta) {
      this.ombakDelta = Math.max(0, Math.min(14, delta));
    }

    setMatedetEnabled(enabled) {
      this.matedetEnabled = Boolean(enabled);
    }

    // Peredaman bilah (Matedet) dengan fade out cepat 35ms
    dampenKey(noteId) {
      const voiceList = this.activeVoices.get(noteId);
      if (voiceList && voiceList.length && this.ctx) {
        const now = this.ctx.currentTime;
        voiceList.forEach(({ gainNode, startTime }) => {
          if (now - (startTime || 0) < 3.0) {
            try {
              gainNode.gain.cancelScheduledValues(now);
              gainNode.gain.setValueAtTime(gainNode.gain.value, now);
              gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
            } catch (e) {
              // Abaikan jika node sudah terdisposisi
            }
          }
        });
        this.activeVoices.delete(noteId);
      }
    }

    dampenAll() {
      if (!this.ctx) return;
      this.activeVoices.forEach((voiceList, noteId) => {
        this.dampenKey(noteId);
      });
      this.activeVoices.clear();
    }

    // -----------------------------------------------------------------------
    // SINTESIS GANGSA PEMADE (Metalfon Perunggu Krawang + Resonator Bumbung)
    // -----------------------------------------------------------------------
    playGangsaNote(noteData, velocity = 0.9) {
      this.ensureContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Jika Matedet aktif, redam nada sebelumnya pada bilah yang sama
      if (this.matedetEnabled) {
        this.dampenKey(noteData.id);
      }

      // Hitung frekuensi dasar dengan faktor transposisi
      const baseFreq = noteData.freq * Math.pow(2, this.pitchTranspose / 12);

      // Struktur parsial inharmonis logam perunggu gamelan Bali
      // Mode getaran bilah bebas: fundamental, f1 * 2.76, f1 * 5.4, f1 * 8.93
      const partials = [
        { mult: 1.0, gain: 0.75, decay: 2.8 },
        { mult: 2.76, gain: 0.38, decay: 0.9 },
        { mult: 5.4, gain: 0.22, decay: 0.4 },
        { mult: 8.93, gain: 0.12, decay: 0.18 }
      ];

      const voicePair = [];

      // Konfigurasi nada tunggal atau sepasang Pengumbang & Pengisep
      const voicesConfig = this.ombakEnabled
        ? [
            { pan: -0.25, freqOffset: -this.ombakDelta / 2, label: 'Pengumbang (Wadon)' },
            { pan: 0.25, freqOffset: +this.ombakDelta / 2, label: 'Pengisep (Lanang)' }
          ]
        : [{ pan: 0.0, freqOffset: 0, label: 'Tunggal' }];

      voicesConfig.forEach((cfg) => {
        const vGain = this.ctx.createGain();
        const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;

        if (panner) {
          panner.pan.setValueAtTime(cfg.pan, now);
          vGain.connect(panner);
          panner.connect(this.busGain);
        } else {
          vGain.connect(this.busGain);
        }

        // Resonator bumbung bambu (Acoustic cavity bandpass)
        const bumbungFilter = this.ctx.createBiquadFilter();
        bumbungFilter.type = 'peaking';
        bumbungFilter.frequency.setValueAtTime(baseFreq, now);
        bumbungFilter.Q.setValueAtTime(4.5, now);
        bumbungFilter.gain.setValueAtTime(7.0, now);

        // Parsial osilator perunggu
        partials.forEach((part) => {
          const osc = this.ctx.createOscillator();
          const pGain = this.ctx.createGain();

          osc.type = 'sine';
          const targetFreq = (baseFreq + cfg.freqOffset) * part.mult;
          osc.frequency.setValueAtTime(targetFreq, now);

          const peakGain = part.gain * velocity * (this.ombakEnabled ? 0.65 : 0.9);
          pGain.gain.setValueAtTime(0.0001, now);
          // Serangan pukulan instan (2ms)
          pGain.gain.exponentialRampToValueAtTime(peakGain, now + 0.002);
          // Peluruhan alami resonansi bilah perunggu
          pGain.gain.exponentialRampToValueAtTime(0.0001, now + part.decay);

          osc.connect(pGain);
          pGain.connect(bumbungFilter);

          osc.start(now);
          osc.stop(now + part.decay + 0.1);
        });

        // Transien pukulan panggul kayu/tanduk (Mallet Impact Click)
        const clickOsc = this.ctx.createOscillator();
        const clickGain = this.ctx.createGain();
        clickOsc.type = 'triangle';
        clickOsc.frequency.setValueAtTime(baseFreq * 6.2, now);
        clickOsc.frequency.exponentialRampToValueAtTime(baseFreq * 0.8, now + 0.02);

        clickGain.gain.setValueAtTime(0.3 * velocity, now);
        clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

        clickOsc.connect(clickGain);
        clickGain.connect(bumbungFilter);

        clickOsc.start(now);
        clickOsc.stop(now + 0.03);

        bumbungFilter.connect(vGain);
        voicePair.push({ gainNode: vGain, startTime: now });
      });

      // Catat suara untuk pemicu matedet
      if (!this.activeVoices.has(noteData.id)) {
        this.activeVoices.set(noteData.id, []);
      }
      this.activeVoices.get(noteData.id).push(...voicePair);

      // Pembersihan memori otomatis (Garbage Collection) setelah suara reda alami (~3.1 detik)
      setTimeout(() => {
        const list = this.activeVoices.get(noteData.id);
        if (list) {
          const remaining = list.filter((v) => v.startTime !== now);
          if (remaining.length === 0) {
            this.activeVoices.delete(noteData.id);
          } else {
            this.activeVoices.set(noteData.id, remaining);
          }
        }
      }, 3100);
    }

    // -----------------------------------------------------------------------
    // SINTESIS REYONG BALI (Pencon / Gong-Chime dengan Nada Punchy Berpencu)
    // -----------------------------------------------------------------------
    playReyongNote(noteData, velocity = 0.85) {
      this.ensureContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const baseFreq = noteData.freq * Math.pow(2, this.pitchTranspose / 12);

      // Karakter pencon: overtone bulat, ada 'tong' logam yang tegas
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const osc3 = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(baseFreq, now);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(baseFreq * 2.08, now); // Overtone pencon

      osc3.type = 'triangle';
      osc3.frequency.setValueAtTime(baseFreq * 3.42, now); // Overtone dentang pencu

      const g1 = this.ctx.createGain();
      const g2 = this.ctx.createGain();
      const g3 = this.ctx.createGain();

      g1.gain.setValueAtTime(0.8 * velocity, now);
      g1.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

      g2.gain.setValueAtTime(0.35 * velocity, now);
      g2.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

      g3.gain.setValueAtTime(0.18 * velocity, now);
      g3.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

      osc1.connect(g1);
      osc2.connect(g2);
      osc3.connect(g3);

      g1.connect(gainNode);
      g2.connect(gainNode);
      g3.connect(gainNode);

      // Serangan panggul panjang reyong
      gainNode.connect(this.busGain);

      osc1.start(now);
      osc2.start(now);
      osc3.start(now);

      osc1.stop(now + 1.8);
      osc2.stop(now + 1.8);
      osc3.stop(now + 1.8);
    }

    // -----------------------------------------------------------------------
    // SINTESIS KENDANG BALI (Kendang Lanang & Wadon — Suara Pung, Dug, Tak, Plak)
    // -----------------------------------------------------------------------
    playKendang(type = 'dug') {
      this.ensureContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      if (type === 'dug' || type === 'pung') {
        // Suara rendah membran kulit sapi (Dug / Pung)
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startPitch = type === 'dug' ? 140 : 175;
        const endPitch = type === 'dug' ? 58 : 72;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(startPitch, now);
        osc.frequency.exponentialRampToValueAtTime(endPitch, now + 0.08);

        gain.gain.setValueAtTime(0.95, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

        osc.connect(gain);
        gain.connect(this.busGain);

        osc.start(now);
        osc.stop(now + 0.45);
      } else {
        // Tepukan tebas / plak / tak kering di tepi kendang (Rim slap)
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(420, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.04);

        gain.gain.setValueAtTime(0.8, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

        // Sentakan noise berfrekuensi tinggi
        const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.05, this.ctx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.2));
        }
        const noiseNode = this.ctx.createBufferSource();
        noiseNode.buffer = noiseBuffer;

        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(1400, now);
        noiseFilter.Q.setValueAtTime(2.0, now);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.4, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

        noiseNode.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.busGain);

        osc.connect(gain);
        gain.connect(this.busGain);

        osc.start(now);
        noiseNode.start(now);

        osc.stop(now + 0.15);
        noiseNode.stop(now + 0.06);
      }
    }

    // -----------------------------------------------------------------------
    // SINTESIS CENG-CENG KOPYAK (Simbal Logam Perunggu Khas Aksen Kebyar)
    // -----------------------------------------------------------------------
    playCengCeng(type = 'crash') {
      this.ensureContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const pitches = [820, 1150, 1420, 1920, 2650, 3800];
      const decay = type === 'choke' ? 0.08 : 0.45;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(3200, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      const perOscGain = 0.75 / pitches.length;
      pitches.forEach((freq) => {
        const osc = this.ctx.createOscillator();
        const pGain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now);
        pGain.gain.setValueAtTime(perOscGain, now);
        osc.connect(pGain);
        pGain.connect(filter);
        osc.start(now);
        osc.stop(now + decay + 0.02);
      });

      filter.connect(gain);
      gain.connect(this.busGain);
    }

    // -----------------------------------------------------------------------
    // SINTESIS GONG AGENG & KEMPUR (Getaran Sub-Bass Pembawa Taksu Kosmis)
    // -----------------------------------------------------------------------
    playGong(type = 'ageng') {
      this.ensureContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const isAgeng = type === 'ageng';
      const baseFreq = isAgeng ? 54 : 118;
      const decay = isAgeng ? 5.2 : 3.4;

      // Polyphony limiter / choker: Redam suara gong sebelumnya dengan fade-out 80ms
      // Mencegah akumulasi puluhan osilator sub-bass saat tombol ditekan cepat berulang
      if (this.activeGongVoice && this.activeGongVoice.type === type) {
        try {
          const prevGain = this.activeGongVoice.gainNode;
          prevGain.gain.cancelScheduledValues(now);
          prevGain.gain.setValueAtTime(prevGain.gain.value, now);
          prevGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
        } catch (e) {
          // Abaikan jika node sudah terdisposisi
        }
      }

      // Pasangan getaran pengumbang-pengisep gong besar (menghasilkan dengung lambat megah 3 Hz)
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const oscSub = this.ctx.createOscillator();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(baseFreq, now);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(baseFreq + (isAgeng ? 3.2 : 4.8), now);

      oscSub.type = 'triangle';
      oscSub.frequency.setValueAtTime(baseFreq * 2.05, now);

      const gMaster = this.ctx.createGain();
      gMaster.gain.setValueAtTime(0.0001, now);
      gMaster.gain.exponentialRampToValueAtTime(0.95, now + 0.015);
      gMaster.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc1.connect(gMaster);
      osc2.connect(gMaster);
      oscSub.connect(gMaster);

      // Transien empuk panggul gong berbulu
      const malletOsc = this.ctx.createOscillator();
      const malletGain = this.ctx.createGain();
      malletOsc.type = 'sine';
      malletOsc.frequency.setValueAtTime(baseFreq * 1.5, now);
      malletOsc.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, now + 0.06);

      malletGain.gain.setValueAtTime(0.6, now);
      malletGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      malletOsc.connect(malletGain);
      malletGain.connect(this.busGain);

      gMaster.connect(this.busGain);

      // Catat voice gong aktif
      this.activeGongVoice = { type, gainNode: gMaster, startTime: now };
      setTimeout(() => {
        if (this.activeGongVoice && this.activeGongVoice.startTime === now) {
          this.activeGongVoice = null;
        }
      }, (decay + 0.1) * 1000);

      osc1.start(now);
      osc2.start(now);
      oscSub.start(now);
      malletOsc.start(now);

      osc1.stop(now + decay + 0.1);
      osc2.stop(now + decay + 0.1);
      oscSub.stop(now + decay + 0.1);
      malletOsc.stop(now + 0.1);
    }
  }

  // Inisialisasi Instance Audio Engine Global
  const audioEngine = new BalineseGamelanAudioEngine();

  // =========================================================================
  // 3. KOMPONEN INTERAKTIF BALE TABUH (PLAYABLE INSTRUMENTS)
  // =========================================================================

  function setupBaleTabuh() {
    const keysContainer = document.getElementById('gangsaKeysContainer');
    const reyongContainer = document.getElementById('reyongKeysContainer');
    const currentNoteDisplay = document.getElementById('currentNoteDisplay');
    const matedetToggle = document.getElementById('matedetToggle');
    const ombakToggle = document.getElementById('ombakToggle');
    const volumeSlider = document.getElementById('gamelanVolume');
    const instrumentTabs = document.querySelectorAll('.inst-tab-btn');
    const instrumentPanels = document.querySelectorAll('.inst-panel');

    if (!keysContainer) return;

    // Render 10 Bilah Perunggu Gangsa Pemade (2 Oktaf)
    keysContainer.innerHTML = '';
    PELOG_SELISIR_NOTES.forEach((note, index) => {
      const keyElem = document.createElement('button');
      keyElem.type = 'button';
      keyElem.className = `gangsa-key gangsa-key--octave-${note.octave}`;
      keyElem.dataset.noteId = note.id;
      keyElem.setAttribute('aria-label', `Bilah Gangsa ${note.name} (${note.aksara}), Nada ${note.solfege}, Tombol ${note.keyChar}`);
      keyElem.tabIndex = 0;

      // Variasi panjang bilah perunggu (nada rendah lebih panjang, nada tinggi lebih pendek)
      const heightPercent = 100 - index * 4.2;

      keyElem.innerHTML = `
        <div class="gangsa-key__inner" style="height: ${heightPercent}%;">
          <span class="gangsa-key__rivet gangsa-key__rivet--top" aria-hidden="true"></span>
          <div class="gangsa-key__content">
            <span class="gangsa-key__aksara">${note.aksara}</span>
            <span class="gangsa-key__name">${note.name}</span>
            <span class="gangsa-key__solfege">${note.solfege}</span>
          </div>
          <span class="gangsa-key__badge">${note.keyChar}</span>
          <span class="gangsa-key__rivet gangsa-key__rivet--bot" aria-hidden="true"></span>
        </div>
        <div class="gangsa-key__tube" aria-hidden="true" title="Bumbung Bambu Resonator"></div>
      `;

      // Event Click & Touch
      const triggerNote = (e) => {
        if (e) e.preventDefault();
        audioEngine.playGangsaNote(note);
        animateKeyStrike(keyElem, note);
      };

      keyElem.addEventListener('pointerdown', triggerNote);

      if (matedetToggle) {
        keyElem.addEventListener('pointerup', () => {
          if (audioEngine.matedetEnabled) {
            audioEngine.dampenKey(note.id);
          }
        });
      }

      keysContainer.appendChild(keyElem);
    });

    // Render 12 Pot Pencon Reyong Bali
    if (reyongContainer) {
      reyongContainer.innerHTML = '';
      REYONG_NOTES.forEach((note) => {
        const potElem = document.createElement('button');
        potElem.type = 'button';
        potElem.className = 'reyong-pot';
        potElem.dataset.noteId = note.id;
        potElem.setAttribute('aria-label', `Pot Reyong ${note.name}, Nada ${note.aksara}, Tombol ${note.key}`);
        potElem.tabIndex = 0;

        potElem.innerHTML = `
          <div class="reyong-pot__boss">
            <span class="reyong-pot__pencu" aria-hidden="true"></span>
          </div>
          <div class="reyong-pot__meta">
            <span class="reyong-pot__aksara">${note.aksara}</span>
            <span class="reyong-pot__key">${note.key}</span>
          </div>
        `;

        potElem.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          audioEngine.playReyongNote(note);
          animatePotStrike(potElem, note);
        });

        reyongContainer.appendChild(potElem);
      });
    }

    // Trigger Animasi Bilah Dipukul
    function animateKeyStrike(elem, note) {
      elem.classList.add('is-struck');
      setTimeout(() => elem.classList.remove('is-struck'), 160);

      if (currentNoteDisplay) {
        currentNoteDisplay.innerHTML = `
          <span class="note-pill__aksara">${note.aksara}</span>
          <span class="note-pill__name">${note.name} (${note.solfege})</span>
          <span class="note-pill__cosmic">• Dewa ${note.dewa} [${note.arah}]</span>
        `;
        currentNoteDisplay.classList.add('is-active');
        clearTimeout(currentNoteDisplay._timeout);
        currentNoteDisplay._timeout = setTimeout(() => {
          currentNoteDisplay.classList.remove('is-active');
        }, 1800);
      }
    }

    function animatePotStrike(elem, note) {
      elem.classList.add('is-struck');
      setTimeout(() => elem.classList.remove('is-struck'), 180);

      if (currentNoteDisplay) {
        currentNoteDisplay.innerHTML = `
          <span class="note-pill__aksara">${note.aksara}</span>
          <span class="note-pill__name">Reyong ${note.name}</span>
          <span class="note-pill__cosmic">• ${note.freq} Hz</span>
        `;
      }
    }

    // Setup Ritme Section (Kendang & Ceng-ceng Pad)
    const kendangDugBtn = document.getElementById('padKendangDug');
    const kendangPlakBtn = document.getElementById('padKendangPlak');
    const cengCrashBtn = document.getElementById('padCengCrash');
    const cengChokeBtn = document.getElementById('padCengChoke');
    const gongAgengBtn = document.getElementById('padGongAgeng');
    const gongKempurBtn = document.getElementById('padGongKempur');

    if (kendangDugBtn) {
      kendangDugBtn.addEventListener('pointerdown', () => {
        audioEngine.playKendang('dug');
        kendangDugBtn.classList.add('is-struck');
        setTimeout(() => kendangDugBtn.classList.remove('is-struck'), 160);
      });
    }
    if (kendangPlakBtn) {
      kendangPlakBtn.addEventListener('pointerdown', () => {
        audioEngine.playKendang('plak');
        kendangPlakBtn.classList.add('is-struck');
        setTimeout(() => kendangPlakBtn.classList.remove('is-struck'), 160);
      });
    }
    if (cengCrashBtn) {
      cengCrashBtn.addEventListener('pointerdown', () => {
        audioEngine.playCengCeng('crash');
        cengCrashBtn.classList.add('is-struck');
        setTimeout(() => cengCrashBtn.classList.remove('is-struck'), 160);
      });
    }
    if (cengChokeBtn) {
      cengChokeBtn.addEventListener('pointerdown', () => {
        audioEngine.playCengCeng('choke');
        cengChokeBtn.classList.add('is-struck');
        setTimeout(() => cengChokeBtn.classList.remove('is-struck'), 160);
      });
    }
    if (gongAgengBtn) {
      gongAgengBtn.addEventListener('pointerdown', () => {
        audioEngine.playGong('ageng');
        gongAgengBtn.classList.add('is-struck');
        setTimeout(() => gongAgengBtn.classList.remove('is-struck'), 300);
      });
    }
    if (gongKempurBtn) {
      gongKempurBtn.addEventListener('pointerdown', () => {
        audioEngine.playGong('kempur');
        gongKempurBtn.classList.add('is-struck');
        setTimeout(() => gongKempurBtn.classList.remove('is-struck'), 240);
      });
    }

    // Dukungan Multi-Touch Glissando (sapuan jari pada bilah Gangsa)
    let activeTouchedGangsaId = null;
    keysContainer.addEventListener('touchmove', (e) => {
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        const el = document.elementFromPoint(touch.clientX, touch.clientY);
        const keyBtn = el ? el.closest('.gangsa-key') : null;
        if (keyBtn && keyBtn.dataset.noteId && keyBtn.dataset.noteId !== activeTouchedGangsaId) {
          activeTouchedGangsaId = keyBtn.dataset.noteId;
          const note = PELOG_SELISIR_NOTES.find((n) => n.id === keyBtn.dataset.noteId);
          if (note) {
            audioEngine.playGangsaNote(note);
            animateKeyStrike(keyBtn, note);
          }
        }
      }
    }, { passive: true });

    const resetTouchGangsa = () => { activeTouchedGangsaId = null; };
    keysContainer.addEventListener('touchend', resetTouchGangsa, { passive: true });
    keysContainer.addEventListener('touchcancel', resetTouchGangsa, { passive: true });

    if (reyongContainer) {
      let activeTouchedReyongId = null;
      reyongContainer.addEventListener('touchmove', (e) => {
        for (let i = 0; i < e.touches.length; i++) {
          const touch = e.touches[i];
          const el = document.elementFromPoint(touch.clientX, touch.clientY);
          const potBtn = el ? el.closest('.reyong-pot') : null;
          if (potBtn && potBtn.dataset.noteId && potBtn.dataset.noteId !== activeTouchedReyongId) {
            activeTouchedReyongId = potBtn.dataset.noteId;
            const note = REYONG_NOTES.find((n) => n.id === potBtn.dataset.noteId);
            if (note) {
              audioEngine.playReyongNote(note);
              animatePotStrike(potBtn, note);
            }
          }
        }
      }, { passive: true });

      const resetTouchReyong = () => { activeTouchedReyongId = null; };
      reyongContainer.addEventListener('touchend', resetTouchReyong, { passive: true });
      reyongContainer.addEventListener('touchcancel', resetTouchReyong, { passive: true });
    }

    // Tab Switcher Instrumen (Gangsa, Reyong, Kendang, Gong)
    instrumentTabs.forEach((btn) => {
      btn.addEventListener('click', () => {
        instrumentTabs.forEach((b) => {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');

        const targetId = btn.dataset.targetPanel;
        instrumentPanels.forEach((panel) => {
          panel.hidden = panel.id !== targetId;
        });
      });
    });

    // Toggle Mode Ombak
    if (ombakToggle) {
      ombakToggle.addEventListener('click', () => {
        const active = !audioEngine.ombakEnabled;
        audioEngine.setOmbakEnabled(active);
        ombakToggle.classList.toggle('is-active', active);
        ombakToggle.setAttribute('aria-pressed', String(active));
        const badge = ombakToggle.querySelector('.status-dot');
        if (badge) badge.textContent = active ? 'ON' : 'OFF';
      });
    }

    // Toggle Teknik Matedet (Redam Bilah)
    if (matedetToggle) {
      matedetToggle.addEventListener('click', () => {
        const active = !audioEngine.matedetEnabled;
        audioEngine.setMatedetEnabled(active);
        matedetToggle.classList.toggle('is-active', active);
        matedetToggle.setAttribute('aria-pressed', String(active));
        const badge = matedetToggle.querySelector('.status-dot');
        if (badge) badge.textContent = active ? 'ON' : 'OFF';
      });
    }

    // Volume Slider
    if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        audioEngine.setVolume(val);
      });
    }

    // Keyboard Shortcuts (1-0 untuk Gangsa, Z-M untuk Reyong, Spasi untuk Gong)
    window.addEventListener('keydown', (e) => {
      // 1. Jangan ganggu shortcut sistem / browser (Ctrl+C, Cmd+C, Ctrl+Z, Ctrl+V, Alt+Tab, dll)
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      // 2. Jangan ganggu input teks formulir atau elemen yang sedang diedit
      const activeEl = document.activeElement;
      if (activeEl && (['INPUT', 'TEXTAREA', 'SELECT'].includes(activeEl.tagName) || activeEl.isContentEditable)) {
        return;
      }

      // 3. Spasi: Hanya trigger Gong jika fokus BUKAN pada tombol/link/interaktif
      if (e.code === 'Space') {
        const isInteractive = activeEl && (['BUTTON', 'A', 'INPUT', 'TEXTAREA', 'SELECT', 'SUMMARY'].includes(activeEl.tagName));
        if (!isInteractive) {
          e.preventDefault();
          audioEngine.playGong('ageng');
          if (gongAgengBtn) {
            gongAgengBtn.classList.add('is-struck');
            setTimeout(() => gongAgengBtn.classList.remove('is-struck'), 300);
          }
        }
        return;
      }

      const keyChar = e.key.toUpperCase();

      // Gangsa Pemade Keys (1, 2, 3, 4, 5, 6, 7, 8, 9, 0)
      const gangsaMatch = PELOG_SELISIR_NOTES.find((n) => n.keyChar === e.key);
      if (gangsaMatch) {
        e.preventDefault();
        const elem = keysContainer.querySelector(`[data-note-id="${gangsaMatch.id}"]`);
        audioEngine.playGangsaNote(gangsaMatch);
        if (elem) animateKeyStrike(elem, gangsaMatch);
        return;
      }

      // Reyong Keys (Z, X, C, V, B, N, M, dll)
      const reyongMatch = REYONG_NOTES.find((n) => n.key === keyChar || n.key === e.key);
      if (reyongMatch && reyongContainer) {
        e.preventDefault();
        const elem = reyongContainer.querySelector(`[data-note-id="${reyongMatch.id}"]`);
        audioEngine.playReyongNote(reyongMatch);
        if (elem) animatePotStrike(elem, reyongMatch);
        return;
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (audioEngine.matedetEnabled) {
        const match = PELOG_SELISIR_NOTES.find((n) => n.keyChar === e.key);
        if (match) {
          audioEngine.dampenKey(match.id);
        }
      }
    });
  }

  // =========================================================================
  // KOORDINATOR PEMUTARAN AUDIO GLOBAL (Mencegah Tabrakan Suara Bersamaan)
  // =========================================================================
  let stopKotekanFn = null;
  let stopGendingFn = null;
  let stopOmbakLabFn = null;

  function stopAllAudioPlayback(except = null) {
    if (except !== 'kotekan' && typeof stopKotekanFn === 'function') stopKotekanFn();
    if (except !== 'gending' && typeof stopGendingFn === 'function') stopGendingFn();
    if (except !== 'ombak' && typeof stopOmbakLabFn === 'function') stopOmbakLabFn();
  }

  // =========================================================================
  // 4. STUDIO KOTEKAN INTERAKTIF (DUET POLOS & SANGSIH)
  // =========================================================================

  function setupKotekanStudio() {
    const playDuetBtn = document.getElementById('playKotekanBtn');
    const roleSelect = document.getElementById('kotekanRoleSelect');
    const patternSelect = document.getElementById('kotekanPatternSelect');
    const tempoSlider = document.getElementById('kotekanTempo');
    const tempoValue = document.getElementById('kotekanTempoVal');
    const matrixGrid = document.getElementById('kotekanMatrixGrid');
    const kotekanStatus = document.getElementById('kotekanStatusFeedback');

    if (!matrixGrid || !playDuetBtn) return;

    // Pola Kotekan Tradisional Bali (Siklus 16 Langkah)
    // Angka merujuk pada indeks not di PELOG_SELISIR_NOTES:
    // 0: Ding1, 1: Dong1, 2: Deng1, 3: Dung1, 4: Dang1, 5: Ding2, 6: Dong2, dst. (-1 = senyap/istirahat)
    const PATTERNS = {
      norot: {
        name: 'Kotekan Norot (Saling Mengikuti)',
        desc: 'Pola paling ikonik Gong Kebyar: Sangsih melangkah satu langkah mendahului atau mengisi sela Polos.',
        polos:   [0, -1, 1, -1, 2, -1, 3, -1, 4, -1, 3, -1, 2, -1, 1, -1],
        sangsih: [-1, 1, -1, 2, -1, 3, -1, 4, -1, 5, -1, 4, -1, 3, -1, 2]
      },
      telu: {
        name: 'Kotekan Telu (Tiga Nada Mengisi)',
        desc: 'Tiga nada dasar yang dianyam secara zig-zag cepat menciptakan ilusi arpeggio air terjun.',
        polos:   [1, -1, 2, -1, -1, 1, -1, 2, 3, -1, 2, -1, -1, 3, -1, 1],
        sangsih: [-1, 2, -1, 3, 2, -1, 3, -1, -1, 2, -1, 1, 2, -1, 2, -1]
      },
      empat: {
        name: 'Kotekan Empat (Sinkopasi Meledak)',
        desc: 'Aksen sinkopasi padat 4 nada, sering memicu aksen angsel kendang.',
        polos:   [0, 1, -1, 2, 0, 1, -1, 3, 2, 1, -1, 0, 1, 2, 3, -1],
        sangsih: [-1, 2, 3, -1, -1, 2, 4, -1, -1, 3, 2, -1, -1, 3, 4, 5]
      }
    };

    let isPlaying = false;
    let timerId = null;
    let currentStep = 0;
    let bpm = 140;

    // Render Matrix Grid (16 Steps Polos & Sangsih)
    function renderGrid(patternKey) {
      const pat = PATTERNS[patternKey] || PATTERNS.norot;
      matrixGrid.innerHTML = '';

      // Baris Polos
      const rowPolos = document.createElement('div');
      rowPolos.className = 'kotekan-row kotekan-row--polos';
      rowPolos.innerHTML = `<div class="kotekan-row__label"><span>POLOS</span><small>(On-beat)</small></div>`;

      // Baris Sangsih
      const rowSangsih = document.createElement('div');
      rowSangsih.className = 'kotekan-row kotekan-row--sangsih';
      rowSangsih.innerHTML = `<div class="kotekan-row__label"><span>SANGSIH</span><small>(Off-beat)</small></div>`;

      const stepsContainerPolos = document.createElement('div');
      stepsContainerPolos.className = 'kotekan-steps';

      const stepsContainerSangsih = document.createElement('div');
      stepsContainerSangsih.className = 'kotekan-steps';

      for (let i = 0; i < 16; i++) {
        const pNoteIdx = pat.polos[i];
        const sNoteIdx = pat.sangsih[i];

        const stepP = document.createElement('div');
        stepP.className = `kotekan-cell ${pNoteIdx !== -1 ? 'has-note' : 'is-rest'}`;
        stepP.dataset.step = i;
        if (pNoteIdx !== -1) {
          stepP.innerHTML = `<span class="kotekan-cell__note">${PELOG_SELISIR_NOTES[pNoteIdx]?.aksara || ''}</span>`;
        }
        stepsContainerPolos.appendChild(stepP);

        const stepS = document.createElement('div');
        stepS.className = `kotekan-cell ${sNoteIdx !== -1 ? 'has-note' : 'is-rest'}`;
        stepS.dataset.step = i;
        if (sNoteIdx !== -1) {
          stepS.innerHTML = `<span class="kotekan-cell__note">${PELOG_SELISIR_NOTES[sNoteIdx]?.aksara || ''}</span>`;
        }
        stepsContainerSangsih.appendChild(stepS);
      }

      rowPolos.appendChild(stepsContainerPolos);
      rowSangsih.appendChild(stepsContainerSangsih);

      matrixGrid.appendChild(rowPolos);
      matrixGrid.appendChild(rowSangsih);
    }

    renderGrid('norot');

    if (patternSelect) {
      patternSelect.addEventListener('change', (e) => {
        stopSequencer();
        renderGrid(e.target.value);
      });
    }

    if (tempoSlider && tempoValue) {
      tempoSlider.addEventListener('input', (e) => {
        bpm = parseInt(e.target.value, 10);
        tempoValue.textContent = `${bpm} BPM`;
        // Tempo diterapkan pada langkah berikutnya tanpa membatalkan/membekukan timer yang sedang berjalan!
      });
    }

    function scheduleStep() {
      if (!isPlaying) return;
      onStepTick();
      const stepDurationMs = (60000 / bpm) / 4; // 16th notes
      timerId = setTimeout(scheduleStep, stepDurationMs);
    }

    function onStepTick() {
      const selectedPatternKey = patternSelect ? patternSelect.value : 'norot';
      const pat = PATTERNS[selectedPatternKey] || PATTERNS.norot;
      const role = roleSelect ? roleSelect.value : 'duet'; // 'duet', 'user_polos', 'user_sangsih'

      // Visual active cell
      const allCells = matrixGrid.querySelectorAll('.kotekan-cell');
      allCells.forEach((c) => {
        if (parseInt(c.dataset.step, 10) === currentStep) {
          c.classList.add('is-current-step');
        } else {
          c.classList.remove('is-current-step');
        }
      });

      const pNoteIdx = pat.polos[currentStep];
      const sNoteIdx = pat.sangsih[currentStep];

      // Audio Trigger sesuai peran yang dipilih
      if (role === 'duet') {
        if (pNoteIdx !== -1 && PELOG_SELISIR_NOTES[pNoteIdx]) {
          audioEngine.playGangsaNote(PELOG_SELISIR_NOTES[pNoteIdx], 0.85);
        }
        if (sNoteIdx !== -1 && PELOG_SELISIR_NOTES[sNoteIdx]) {
          audioEngine.playGangsaNote(PELOG_SELISIR_NOTES[sNoteIdx], 0.85);
        }
      } else if (role === 'user_polos') {
        // User memainkan Polos, sistem otomatis memainkan Sangsih
        if (sNoteIdx !== -1 && PELOG_SELISIR_NOTES[sNoteIdx]) {
          audioEngine.playGangsaNote(PELOG_SELISIR_NOTES[sNoteIdx], 0.85);
        }
      } else if (role === 'user_sangsih') {
        // User memainkan Sangsih, sistem otomatis memainkan Polos
        if (pNoteIdx !== -1 && PELOG_SELISIR_NOTES[pNoteIdx]) {
          audioEngine.playGangsaNote(PELOG_SELISIR_NOTES[pNoteIdx], 0.85);
        }
      }

      // Setiap ketukan ke-16, bunyikan gong kempur halus
      if (currentStep === 15) {
        audioEngine.playGong('kempur');
      }

      currentStep = (currentStep + 1) % 16;
    }

    function startSequencer() {
      stopAllAudioPlayback('kotekan');
      audioEngine.ensureContext();
      isPlaying = true;
      currentStep = 0;
      playDuetBtn.classList.add('is-playing');
      playDuetBtn.setAttribute('aria-pressed', 'true');
      playDuetBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor" class="btn-icon" aria-hidden="true">
          <rect x="6" y="5" width="4" height="14" rx="1"/>
          <rect x="14" y="5" width="4" height="14" rx="1"/>
        </svg>
        <span>Jeda Latihan Kotekan</span>
      `;
      if (kotekanStatus) {
        kotekanStatus.textContent = 'Kotekan sedang berjalan. Rasakan jalinan interlocking antar ketukan!';
      }
      if (timerId) clearTimeout(timerId);
      // Mainkan ketukan pertama langsung tanpa delay!
      scheduleStep();
    }

    function stopSequencer() {
      isPlaying = false;
      if (timerId) clearTimeout(timerId);
      timerId = null;
      playDuetBtn.classList.remove('is-playing');
      playDuetBtn.setAttribute('aria-pressed', 'false');
      playDuetBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor" class="btn-icon" aria-hidden="true">
          <polygon points="6 4 20 12 6 20 6 4"/>
        </svg>
        <span>Mulai Jalinan Kotekan</span>
      `;
      const allCells = matrixGrid.querySelectorAll('.kotekan-cell');
      allCells.forEach((c) => c.classList.remove('is-current-step'));
      if (kotekanStatus) {
        kotekanStatus.textContent = 'Kotekan dijeda. Tekan tombol untuk melanjutkan interaksi.';
      }
    }

    stopKotekanFn = stopSequencer;

    playDuetBtn.addEventListener('click', () => {
      if (isPlaying) {
        stopSequencer();
      } else {
        startSequencer();
      }
    });
  }

  // =========================================================================
  // 5. LABORATORIUM AKUSTIK: FENOMENA OMBAK & PENGUMBANG-PENGISEP
  // =========================================================================

  function setupOmbakLab() {
    const canvas = document.getElementById('ombakWaveCanvas');
    const freqBaseSlider = document.getElementById('ombakBaseFreq');
    const deltaSlider = document.getElementById('ombakDeltaFreq');
    const baseFreqDisplay = document.getElementById('ombakBaseFreqVal');
    const deltaFreqDisplay = document.getElementById('ombakDeltaFreqVal');
    const pengumbangValDisplay = document.getElementById('pengumbangHzVal');
    const pengisepValDisplay = document.getElementById('pengisepHzVal');
    const beatRateDisplay = document.getElementById('ombakBeatRateDisplay');

    const btnPlayPengumbang = document.getElementById('btnPlayPengumbang');
    const btnPlayPengisep = document.getElementById('btnPlayPengisep');
    const btnPlayDuetOmbak = document.getElementById('btnPlayDuetOmbak');

    if (!canvas) return;

    const ctx2d = canvas.getContext('2d');
    let baseFreq = 260; // Hz
    let delta = 6.8; // Hz
    let isWaveActive = true;
    let animFrame = null;
    let phase = 0;

    // Node audio persisten untuk lab ombak
    let labOsc1 = null;
    let labOsc2 = null;
    let labGain1 = null;
    let labGain2 = null;
    let labMasterGain = null;
    let activeLabSound = null; // 'pengumbang', 'pengisep', 'both', null

    function updateCalculations() {
      const fPengumbang = +(baseFreq - delta / 2).toFixed(1);
      const fPengisep = +(baseFreq + delta / 2).toFixed(1);

      if (baseFreqDisplay) baseFreqDisplay.textContent = `${baseFreq} Hz`;
      if (deltaFreqDisplay) deltaFreqDisplay.textContent = `Δ ${delta} Hz`;
      if (pengumbangValDisplay) pengumbangValDisplay.textContent = `${fPengumbang} Hz (Wadon / Rendah)`;
      if (pengisepValDisplay) pengisepValDisplay.textContent = `${fPengisep} Hz (Lanang / Tinggi)`;
      if (beatRateDisplay) {
        const rateDesc = delta < 4.5 ? 'Tenang (Semar Pagulingan)' : delta < 7.5 ? 'Dinamis (Gong Kebyar)' : 'Sangat Cepat (Beleganjur)';
        beatRateDisplay.textContent = `${delta} Getaran / Detik • Karakter: ${rateDesc}`;
      }

      // Perbarui frekuensi osilator jika sedang berbunyi
      if (labOsc1 && audioEngine.ctx) {
        labOsc1.frequency.setTargetAtTime(fPengumbang, audioEngine.ctx.currentTime, 0.05);
      }
      if (labOsc2 && audioEngine.ctx) {
        labOsc2.frequency.setTargetAtTime(fPengisep, audioEngine.ctx.currentTime, 0.05);
      }
    }

    if (freqBaseSlider) {
      freqBaseSlider.addEventListener('input', (e) => {
        baseFreq = parseFloat(e.target.value);
        updateCalculations();
      });
    }

    if (deltaSlider) {
      deltaSlider.addEventListener('input', (e) => {
        delta = parseFloat(e.target.value);
        audioEngine.setOmbakDelta(delta);
        updateCalculations();
      });
    }

    // Generator Nada Sintetis Khusus Lab Ombak
    function ensureLabAudioNodes() {
      audioEngine.ensureContext();
      if (!audioEngine.ctx) return;

      if (!labMasterGain) {
        labMasterGain = audioEngine.ctx.createGain();
        labMasterGain.gain.setValueAtTime(0.55, audioEngine.ctx.currentTime);
        labMasterGain.connect(audioEngine.busGain);
      }

      if (!labOsc1) {
        labOsc1 = audioEngine.ctx.createOscillator();
        labGain1 = audioEngine.ctx.createGain();
        labOsc1.type = 'sine';
        labGain1.gain.setValueAtTime(0, audioEngine.ctx.currentTime);
        labOsc1.connect(labGain1);
        labGain1.connect(labMasterGain);
        labOsc1.start();
      }

      if (!labOsc2) {
        labOsc2 = audioEngine.ctx.createOscillator();
        labGain2 = audioEngine.ctx.createGain();
        labOsc2.type = 'sine';
        labGain2.gain.setValueAtTime(0, audioEngine.ctx.currentTime);
        labOsc2.connect(labGain2);
        labGain2.connect(labMasterGain);
        labOsc2.start();
      }
    }

    function stopLabSound() {
      if (!audioEngine.ctx || !labGain1 || !labGain2) return;
      const now = audioEngine.ctx.currentTime;
      labGain1.gain.setTargetAtTime(0, now, 0.06);
      labGain2.gain.setTargetAtTime(0, now, 0.06);
      activeLabSound = null;

      [btnPlayPengumbang, btnPlayPengisep, btnPlayDuetOmbak].forEach((b) => {
        if (b) b.classList.remove('is-active');
      });
    }

    function playLabSound(mode) {
      ensureLabAudioNodes();
      if (!audioEngine.ctx) return;

      if (activeLabSound === mode) {
        stopLabSound();
        return;
      }

      stopLabSound();
      stopAllAudioPlayback('ombak');
      activeLabSound = mode;
      const now = audioEngine.ctx.currentTime;
      const fPengumbang = baseFreq - delta / 2;
      const fPengisep = baseFreq + delta / 2;

      labOsc1.frequency.setValueAtTime(fPengumbang, now);
      labOsc2.frequency.setValueAtTime(fPengisep, now);

      if (mode === 'pengumbang') {
        labGain1.gain.setTargetAtTime(0.7, now, 0.04);
        labGain2.gain.setTargetAtTime(0, now, 0.04);
        if (btnPlayPengumbang) btnPlayPengumbang.classList.add('is-active');
      } else if (mode === 'pengisep') {
        labGain1.gain.setTargetAtTime(0, now, 0.04);
        labGain2.gain.setTargetAtTime(0.7, now, 0.04);
        if (btnPlayPengisep) btnPlayPengisep.classList.add('is-active');
      } else if (mode === 'both') {
        labGain1.gain.setTargetAtTime(0.5, now, 0.04);
        labGain2.gain.setTargetAtTime(0.5, now, 0.04);
        if (btnPlayDuetOmbak) btnPlayDuetOmbak.classList.add('is-active');
      }
    }

    stopOmbakLabFn = stopLabSound;

    if (btnPlayPengumbang) {
      btnPlayPengumbang.addEventListener('click', () => playLabSound('pengumbang'));
    }
    if (btnPlayPengisep) {
      btnPlayPengisep.addEventListener('click', () => playLabSound('pengisep'));
    }
    if (btnPlayDuetOmbak) {
      btnPlayDuetOmbak.addEventListener('click', () => playLabSound('both'));
    }

    // Penyesuaian Resolusi Retina/HiDPI Layar
    function resizeCanvas() {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const displayWidth = Math.round(rect.width || 600);
      const displayHeight = 220;

      if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
      }
    }

    window.addEventListener('resize', resizeCanvas, { passive: true });
    resizeCanvas();

    // Gambar Gelombang Real-Time pada Canvas
    function drawWaveforms() {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx2d.save();
      ctx2d.scale(dpr, dpr);
      ctx2d.clearRect(0, 0, width, height);

      // Garis grid tengah
      ctx2d.strokeStyle = 'rgba(236, 194, 70, 0.12)';
      ctx2d.lineWidth = 1;
      ctx2d.beginPath();
      ctx2d.moveTo(0, height / 2);
      ctx2d.lineTo(width, height / 2);
      ctx2d.stroke();

      const beatFreq = delta;

      // Gambar Gelombang Amplop Ombak (Envelope Beating) di Gold
      ctx2d.strokeStyle = '#ECC246';
      ctx2d.lineWidth = 2.4;
      ctx2d.beginPath();

      for (let x = 0; x < width; x++) {
        const t = (x / width) * 0.75 + phase;
        // Rumus superposisi akustik dua frekuensi berdekatan:
        // y = 2 * cos(pi * delta * t) * sin(2 * pi * f_avg * t)
        const envelope = Math.cos(Math.PI * beatFreq * t);
        const carrier = Math.sin(2 * Math.PI * (baseFreq * 0.08) * t);
        const y = (height / 2) + envelope * carrier * (height * 0.38);

        if (x === 0) ctx2d.moveTo(x, y);
        else ctx2d.lineTo(x, y);
      }
      ctx2d.stroke();

      // Gambar Garis Batas Amplop Atas & Bawah
      ctx2d.strokeStyle = 'rgba(236, 194, 70, 0.35)';
      ctx2d.setLineDash([4, 4]);
      ctx2d.lineWidth = 1.2;

      ctx2d.beginPath();
      for (let x = 0; x < width; x++) {
        const t = (x / width) * 0.75 + phase;
        const env = Math.abs(Math.cos(Math.PI * beatFreq * t));
        const yTop = (height / 2) - env * (height * 0.38);
        if (x === 0) ctx2d.moveTo(x, yTop);
        else ctx2d.lineTo(x, yTop);
      }
      ctx2d.stroke();

      ctx2d.beginPath();
      for (let x = 0; x < width; x++) {
        const t = (x / width) * 0.75 + phase;
        const env = Math.abs(Math.cos(Math.PI * beatFreq * t));
        const yBot = (height / 2) + env * (height * 0.38);
        if (x === 0) ctx2d.moveTo(x, yBot);
        else ctx2d.lineTo(x, yBot);
      }
      ctx2d.stroke();
      ctx2d.setLineDash([]);
      ctx2d.restore();

      phase += 0.0035;
      const raf = typeof window !== 'undefined' && window.requestAnimationFrame ? window.requestAnimationFrame : ((cb) => setTimeout(cb, 1000 / 60));
      animFrame = raf(drawWaveforms);
    }

    updateCalculations();
    drawWaveforms();
  }

  // =========================================================================
  // 6. AUTOPLAYER GENDING KLASIK BALI (TABUH GILAK & KEBYAR)
  // =========================================================================

  function setupGendingAutoplayer() {
    const playGendingBtn = document.getElementById('playGendingBtn');
    const gendingSelector = document.getElementById('gendingSelect');
    const gendingTitle = document.getElementById('gendingCurrentTitle');
    const gendingDesc = document.getElementById('gendingCurrentDesc');
    const progressBar = document.getElementById('gendingProgressFill');
    const gendingTimerText = document.getElementById('gendingTimerText');

    if (!playGendingBtn) return;

    // Komposisi Notasi Ansambel Gamelan Terprogram
    // Struktur: tempo BPM, array event { time (dalam beat), type ('gangsa', 'kendang', 'ceng', 'gong'), noteIdx / noteType }
    const REPERTOIRE = {
      gilak: {
        title: 'Tabuh Gilak Sakral (8-Ketukan Matriks)',
        desc: 'Gending agung dengan tempo tegas berwibawa yang mengiringi tarian Barong, Baris Gede, dan prosesi suci Ida Bhatara.',
        bpm: 110,
        totalBeats: 32,
        events: [
          // Gong Ageng pada ketukan 0 dan 16
          { beat: 0, type: 'gong', val: 'ageng' },
          { beat: 16, type: 'gong', val: 'ageng' },
          { beat: 8, type: 'gong', val: 'kempur' },
          { beat: 24, type: 'gong', val: 'kempur' },

          // Kendang berirama khas Gilak
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

          // Ceng-ceng kopyak aksen
          { beat: 2, type: 'ceng', val: 'choke' },
          { beat: 4, type: 'ceng', val: 'crash' },
          { beat: 6, type: 'ceng', val: 'choke' },
          { beat: 8, type: 'ceng', val: 'crash' },
          { beat: 10, type: 'ceng', val: 'choke' },
          { beat: 12, type: 'ceng', val: 'crash' },
          { beat: 14, type: 'ceng', val: 'choke' },

          // Pokok melodi Gangsa (Ding, Dong, Deng, Dung, Dang)
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

          // Pengulangan siklus kedua (variasi oktaf)
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
        title: 'Kebyar Kilat & Angsel Meledak',
        desc: 'Eksplorasi virtuositas Gong Kebyar: tempo cepat, kotekan rapat, dan aksen serentak yang memompa adrenalin.',
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
          // Angsel serentak
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
        title: 'Sekar Gadung (Lelambatan Suci)',
        desc: 'Melodi pelog selisir kuno yang mengalun teduh, membawa pendengarnya ke ketenangan batin pura di kaki Gunung Agung.',
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

    let isPlayingGending = false;
    let gendingTimer = null;
    let currentBeat = 0;
    let selectedKey = 'gilak';

    function updateGendingMeta() {
      const g = REPERTOIRE[selectedKey];
      if (!g) return;
      if (gendingTitle) gendingTitle.textContent = g.title;
      if (gendingDesc) gendingDesc.textContent = g.desc;
    }

    if (gendingSelector) {
      gendingSelector.addEventListener('change', (e) => {
        stopGending();
        selectedKey = e.target.value;
        updateGendingMeta();
      });
    }

    function onGendingTick() {
      const g = REPERTOIRE[selectedKey];
      if (!g) return;

      // Filter event yang jatuh pada ketukan saat ini (dengan toleransi 0.25 beat)
      const matchingEvents = g.events.filter((ev) => Math.abs(ev.beat - currentBeat) < 0.25);

      matchingEvents.forEach((ev) => {
        if (ev.type === 'gangsa' && PELOG_SELISIR_NOTES[ev.idx]) {
          audioEngine.playGangsaNote(PELOG_SELISIR_NOTES[ev.idx], 0.85);
          // Highlight bilah jika terlihat
          const keyElem = document.querySelector(`[data-note-id="${PELOG_SELISIR_NOTES[ev.idx].id}"]`);
          if (keyElem) {
            keyElem.classList.add('is-struck');
            setTimeout(() => keyElem.classList.remove('is-struck'), 160);
          }
        } else if (ev.type === 'kendang') {
          audioEngine.playKendang(ev.val);
        } else if (ev.type === 'ceng') {
          audioEngine.playCengCeng(ev.val);
        } else if (ev.type === 'gong') {
          audioEngine.playGong(ev.val);
        }
      });

      // Update progress bar
      if (progressBar) {
        const pct = (currentBeat / g.totalBeats) * 100;
        progressBar.style.width = `${pct}%`;
      }
      if (gendingTimerText) {
        gendingTimerText.textContent = `Ketukan ${Math.floor(currentBeat) + 1} / ${g.totalBeats}`;
      }

      currentBeat = Math.round((currentBeat + 0.5) * 10) / 10;
      if (currentBeat >= g.totalBeats) {
        currentBeat = 0; // Looping siklus gongan
      }
    }

    function scheduleGendingTick() {
      if (!isPlayingGending) return;
      onGendingTick();
      const g = REPERTOIRE[selectedKey];
      const intervalMs = (60000 / g.bpm) / 2; // Tick per setengah ketukan
      gendingTimer = setTimeout(scheduleGendingTick, intervalMs);
    }

    function startGending() {
      stopAllAudioPlayback('gending');
      audioEngine.ensureContext();
      isPlayingGending = true;
      currentBeat = 0;
      playGendingBtn.classList.add('is-playing');
      playGendingBtn.setAttribute('aria-pressed', 'true');
      playGendingBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor" class="btn-icon" aria-hidden="true">
          <rect x="6" y="5" width="4" height="14" rx="1"/>
          <rect x="14" y="5" width="4" height="14" rx="1"/>
        </svg>
        <span>Jeda Gending</span>
      `;

      if (gendingTimer) clearTimeout(gendingTimer);
      // Mainkan ketukan pertama langsung tanpa delay!
      scheduleGendingTick();
    }

    function stopGending() {
      isPlayingGending = false;
      if (gendingTimer) clearTimeout(gendingTimer);
      gendingTimer = null;
      playGendingBtn.classList.remove('is-playing');
      playGendingBtn.setAttribute('aria-pressed', 'false');
      playGendingBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor" class="btn-icon" aria-hidden="true">
          <polygon points="6 4 20 12 6 20 6 4"/>
        </svg>
        <span>Dengarkan Sekaha Penuh</span>
      `;
      if (progressBar) progressBar.style.width = '0%';
    }

    stopGendingFn = stopGending;

    playGendingBtn.addEventListener('click', () => {
      if (isPlayingGending) {
        stopGending();
      } else {
        startGending();
      }
    });

    updateGendingMeta();
  }

  // =========================================================================
  // 7. DENAH & ARSITEKTUR SEKAHA (SPATIAL SEKAHA EXPLORER)
  // =========================================================================

  function setupSpatialExplorer() {
    const spots = document.querySelectorAll('.stage-spot');
    const infoCard = document.getElementById('spatialDetailCard');
    const auditionBtn = document.getElementById('spatialAuditionBtn');

    if (!spots.length || !infoCard) return;

    const ROLES_DATA = {
      kendang: {
        title: 'Kendang Bali (Lanang & Wadon)',
        kicker: 'Konduktor Ritmis & Pengendali Dinamika Gending',
        desc: 'Kendang adalah "jantung" gamelan Bali. Dua penabuh kendang (Kendang Cedugan atau Gupekan) memimpin seluruh pergantian tempo, aksen angsel, dan dinamika sekaha tanpa bantuan partitur.',
        aksara: 'ᬓᭂᬦ᭄ᬤᬂ',
        audioAction: () => audioEngine.playKendang('plak')
      },
      ugal: {
        title: 'Ugal (Pemimpin Melodi Gangsa)',
        kicker: 'Pemberi Komando Gending & Penjembatan Irama',
        desc: 'Ugal memiliki bilah perunggu yang lebih tebal dan rendah dari Pemade. Penabuh ugal memberi tanda melodi awal (lelambatan), mengatur tempo pokok, dan memberi aba-aba peralihan nada kepada penabuh gangsa lainnya.',
        aksara: 'ᬳᬸᬕᬮ᭄',
        audioAction: () => audioEngine.playGangsaNote(PELOG_SELISIR_NOTES[0])
      },
      pemade: {
        title: 'Gangsa Pemade & Kantil',
        kicker: 'Perajut Kotekan Berkelap-Kelip Kilat',
        desc: 'Pemade dan Kantil dimainkan berpasangan (Polos & Sangsih) oleh 4–8 penabuh. Menggunakan teknik matedet (redam jari kiri) dengan kecepatan tinggi untuk merajut jalinan melodi yang memukau.',
        aksara: 'ᬧᭂᬫᬤᬾ',
        audioAction: () => audioEngine.playGangsaNote(PELOG_SELISIR_NOTES[7])
      },
      reyong: {
        title: 'Reyong Bali (12 Pot Pencon)',
        kicker: 'Akrobatik Musikal 4 Penabuh Berderet',
        desc: 'Instrumen horizontal sepanjang 3 meter dengan 12 pot perunggu berpencu. Dimainkan oleh 4 orang penabuh sekaligus yang saling silang tangan menggunakan pola norot yang rapat dan lincah.',
        aksara: 'ᬭᬾᬬᭀᬂ',
        audioAction: () => audioEngine.playReyongNote(REYONG_NOTES[4])
      },
      trompong: {
        title: 'Trompong (Solois Klasik Istana)',
        kicker: 'Raja Melodi Gending Lelambatan & Tari Legong',
        desc: 'Deretan 10 pot pencon yang dimainkan oleh satu orang solois dengan dua panggul panjang meliuk. Memberikan hiasan bunga melodi (bunga gending) yang anggun dan melankolis.',
        aksara: 'ᬢ᭄ᬭᭀᬫ᭄ᬧᭀᬂ',
        audioAction: () => audioEngine.playReyongNote(REYONG_NOTES[2])
      },
      calung: {
        title: 'Calung (Jublag) & Jegogan',
        kicker: 'Pondasi Melodi Bass Rendah & Selehan Nada',
        desc: 'Metalfon berbilah besar dengan resonator bumbung bambu dalam. Memainkan melodi balungan/pokok dengan nada-nada seleh yang teratur dan khidmat sebagai fondasi kotekan.',
        aksara: 'ᬚᭂᬕᭀᬕᬦ᭄',
        audioAction: () => audioEngine.playGangsaNote(PELOG_SELISIR_NOTES[0], 0.95)
      },
      gong: {
        title: 'Gong Ageng, Kempur & Bende',
        kicker: 'Penguasa Waktu & Siklus Kosmis Gongan',
        desc: 'Gong Ageng menggantung di belakang sebagai instrumen paling sakral. Bunyinya menandai akhir dan awal siklus gongan (colotomic cycle), dipercaya sebagai simbol napas semesta Dewa Siwa.',
        aksara: 'ᬕᭀᬂ',
        audioAction: () => audioEngine.playGong('ageng')
      },
      cengceng: {
        title: 'Ceng-ceng Kopyak',
        kicker: 'Pemicu Aksen Sinkopasi Ledakan Kebyar',
        desc: 'Beberapa pasang simbal perunggu kecil bertumpuk di atas ukiran punggung kura-kura Bedawang Nala. Dimainkan dengan hentakan keras dan tajam untuk mengiringi aksen angsel kendang.',
        aksara: 'ᬘᬾᬂᬘᬾᬂ',
        audioAction: () => audioEngine.playCengCeng('crash')
      }
    };

    let activeRoleKey = 'kendang';

    function setSpot(roleKey) {
      const data = ROLES_DATA[roleKey];
      if (!data) return;

      activeRoleKey = roleKey;
      spots.forEach((s) => {
        const isMatch = s.dataset.role === roleKey;
        s.classList.toggle('is-selected', isMatch);
        s.setAttribute('aria-pressed', String(isMatch));
      });

      const titleEl = infoCard.querySelector('.spatial-title');
      const kickerEl = infoCard.querySelector('.spatial-kicker');
      const descEl = infoCard.querySelector('.spatial-desc');
      const aksaraEl = infoCard.querySelector('.spatial-aksara');

      if (titleEl) titleEl.textContent = data.title;
      if (kickerEl) kickerEl.textContent = data.kicker;
      if (descEl) descEl.textContent = data.desc;
      if (aksaraEl) aksaraEl.textContent = data.aksara;
    }

    spots.forEach((spot) => {
      spot.addEventListener('click', () => {
        setSpot(spot.dataset.role);
        // Bunyikan langsung suara sampel instrumen
        const data = ROLES_DATA[spot.dataset.role];
        if (data && typeof data.audioAction === 'function') {
          data.audioAction();
        }
      });
    });

    if (auditionBtn) {
      auditionBtn.addEventListener('click', () => {
        const data = ROLES_DATA[activeRoleKey];
        if (data && typeof data.audioAction === 'function') {
          data.audioAction();
        }
      });
    }

    setSpot('kendang');
  }

  // =========================================================================
  // 8. FILTER MORFOLOGI TIGA ERA GAMELAN BALI (TUA, MADYA, BARU)
  // =========================================================================

  function setupEraFilter() {
    const filterBtns = document.querySelectorAll('.era-chip');
    const eraCards = document.querySelectorAll('.era-card');

    if (!filterBtns.length || !eraCards.length) return;

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => {
          const isAct = b === btn;
          b.classList.toggle('is-active', isAct);
          b.setAttribute('aria-pressed', String(isAct));
        });

        const eraKey = btn.dataset.era;
        eraCards.forEach((card) => {
          const match = eraKey === 'semua' || card.dataset.era === eraKey;
          card.style.display = match ? '' : 'none';
          card.hidden = !match;
        });
      });
    });
  }

  // =========================================================================
  // 9. PENCARIAN GLOSARIUM KARAWITAN BALI
  // =========================================================================

  function setupGlosarium() {
    const searchInput = document.getElementById('glosariumSearch');
    const items = document.querySelectorAll('.glosarium-item');
    const emptyState = document.getElementById('glosariumEmpty');

    if (!searchInput || !items.length) return;

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      let found = 0;

      items.forEach((item) => {
        const term = (item.dataset.term || '').toLowerCase();
        const text = item.textContent.toLowerCase();
        const matches = !query || term.includes(query) || text.includes(query);

        item.style.display = matches ? '' : 'none';
        if (matches) found++;
      });

      if (emptyState) emptyState.hidden = found > 0;
    });
  }

  // =========================================================================
  // 10. ENTRY POINT DOM READY
  // =========================================================================

  document.addEventListener('DOMContentLoaded', () => {
    setupBaleTabuh();
    setupKotekanStudio();
    setupOmbakLab();
    setupGendingAutoplayer();
    setupSpatialExplorer();
    setupEraFilter();
    setupGlosarium();

    // Hentikan pemutaran audio jika tab disembunyikan/berpindah
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAllAudioPlayback();
      }
    });

    // Auto-unlock Web Audio pada klik pertama di seluruh halaman
    const unlockAudio = () => {
      audioEngine.ensureContext();
      document.removeEventListener('pointerdown', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
    };
    document.addEventListener('pointerdown', unlockAudio, { once: true });
    document.addEventListener('keydown', unlockAudio, { once: true });
  });

  // Ekspor API Global untuk integrasi pengujian
  window.GamelanAudioEngine = audioEngine;
})();
