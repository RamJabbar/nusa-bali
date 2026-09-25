

(function () {
  'use strict';

  // ─── TUNABLE SCORING CONSTANTS ─────────────────────────────
  const TOLERANCE_RADIUS = 18;    // Distance in 300x300 space considered a hit
  const PRECISION_MAX_DIST = 32;  // Maximum distance after which point precision is 0
  const WEIGHT_PRECISION = 0.50;  // 50% weight for line precision
  const WEIGHT_COVERAGE = 0.50;   // 50% weight for path coverage
  const MASTERED_THRESHOLD = 75;  // Score >= 75 marks character as mastered
  const STORAGE_KEY = 'nusabali_aksara_mastered';

  // ─── PHILOSOPHICAL METADATA ────────────────────────────────
  const AKSARA_METADATA = {
    ha: {
      meaningShort: 'Simbol Prana • Nafas Mula Kehidupan',
      meaningLong: 'Simbol Prana • Nafas Mula Kehidupan & Hyang Widhi',
      order: '01',
      char: 'ᬳ'
    },
    na: {
      meaningShort: 'Api Penciptaan • Energi Teja & Vitalitas',
      meaningLong: 'Api Teja • Dinamika Energi & Semangat Jiwa',
      order: '02',
      char: 'ᬦ'
    },
    ca: {
      meaningShort: 'Cahaya Suci • Kejernihan Akal Budi',
      meaningLong: 'Cahaya Suci • Kejernihan Pikiran & Budi Pekerti',
      order: '03',
      char: 'ᬘ'
    },
    ra: {
      meaningShort: 'Aliran Darah • Keteguhan Jiwa',
      meaningLong: 'Darah & Keberanian • Penegak Nilai Kebenaran',
      order: '04',
      char: 'ᬭ'
    },
    ka: {
      meaningShort: 'Kekuatan Sabda • Kehendak Murni',
      meaningLong: 'Sabda Suci • Daya Cipta & Ketulusan Niat',
      order: '05',
      char: 'ᬓ'
    },
    da: {
      meaningShort: 'Pemberian Agung • Keikhlasan Dharma',
      meaningLong: 'Dharma Utama • Anugerah Luhur & Keikhlasan',
      order: '06',
      char: 'ᬤ'
    },
    ta: {
      meaningShort: 'Ketetapan Pikiran • Konsentrasi Batin',
      meaningLong: 'Ketetapan Batin • Konsentrasi & Keteguhan Hati',
      order: '07',
      char: 'ᬢ'
    },
    sa: {
      meaningShort: 'Ketenangan Suci • Kesadaran Siwa',
      meaningLong: 'Kesadaran Siwa • Kedamaian & Ketenangan Jiwa',
      order: '08',
      char: 'ᬲ'
    },
    wa: {
      meaningShort: 'Wahana Rohani • Kebijaksanaan Bayu',
      meaningLong: 'Kebijaksanaan Bayu • Arus Harmoni & Kesadaran',
      order: '09',
      char: 'ᬯ'
    },
    la: {
      meaningShort: 'Keluhuran Budhi • Keselarasan Semesta',
      meaningLong: 'Keluhuran Budhi • Manunggal Bersama Alam Semesta',
      order: '10',
      char: 'ᬮ'
    }
  };

  const AKSARA_KEYS = ['ha', 'na', 'ca', 'ra', 'ka', 'da', 'ta', 'sa', 'wa', 'la'];

  // ─── STATE MANAGEMENT ──────────────────────────────────────
  let currentKey = 'ha';
  let userStrokes = [];        // Array of strokes; stroke is Array of {x, y, distToRef}
  let currentStroke = null;
  let isDrawing = false;
  let showGuide = true;
  let isScored = false;
  let demoAnimId = null;
  let isDemoPlaying = false;
  let demoProgress = 0;

  // Cached DOM elements
  let canvas = null;
  let ctx = null;
  let canvasWrap = null;
  let startDotEl = null;
  let resultPanel = null;
  let demoBtn = null;

  // ─── LOCAL STORAGE HELPERS ─────────────────────────────────
  function getMasteredList() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  function setCharacterMastered(key) {
    const list = getMasteredList();
    if (!list.includes(key)) {
      list.push(key);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      } catch (e) { }
    }
    updateMasteryUI(list, key);
  }

  function updateMasteryUI(list, justMasteredKey = null) {
    const masteredCount = list.length;
    const percent = Math.round((masteredCount / 10) * 100);

    // Update progress numbers
    const countEl = document.getElementById('aksaraMasteredCount');
    if (countEl) countEl.textContent = masteredCount;

    const percentEl = document.getElementById('aksaraProgressPercent');
    if (percentEl) percentEl.textContent = `${percent}%`;

    const barEl = document.getElementById('aksaraProgressFill');
    if (barEl) barEl.style.width = `${percent}%`;

    const headerProgEl = document.getElementById('aksaraHeaderProgress');
    if (headerProgEl) headerProgEl.textContent = `${masteredCount} / 10 Pratama`;

    // Update list item status badges
    AKSARA_KEYS.forEach((key) => {
      const statusEl = document.getElementById(`status-${key}`);
      const rowEl = document.getElementById(`aksara-row-${key}`);
      if (!statusEl || !rowEl) return;

      const isMastered = list.includes(key);
      if (isMastered) {
        rowEl.classList.add('is-mastered');
        statusEl.innerHTML = `
          <span class="aksara-badge-check" title="Aksara Dikuasai">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>`;
      } else {
        rowEl.classList.remove('is-mastered');
        const meta = AKSARA_METADATA[key] || { order: '00' };
        statusEl.innerHTML = `<span class="aksara-order-num">${meta.order}</span>`;
      }

      // Celebratory animation if just mastered
      if (justMasteredKey && key === justMasteredKey) {
        rowEl.classList.remove('is-celebrating');
        // Force reflow
        void rowEl.offsetWidth;
        rowEl.classList.add('is-celebrating');
        setTimeout(() => rowEl.classList.remove('is-celebrating'), 1200);
      }
    });
  }

  function initAksara() {
    // Check if #bahasa section exists on the page
    const section = document.getElementById('bahasa');
    if (!section) return;

    // Check if aksaraData is loaded
    const dataRef = (typeof aksaraData !== 'undefined') ? aksaraData : (window.aksaraData || null);
    if (!dataRef) {
      console.warn('aksaraData is not available. Ensure assets/js/aksara-data.js is loaded first.');
      return;
    }

    initDOMRefs();
    renderCharacterSelector();
    initCanvas();
    initEventListeners();
    updateMasteryUI(getMasteredList());
    selectAksara('ha');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAksara);
  } else {
    initAksara();
  }

  function initDOMRefs() {
    canvas = document.getElementById('aksaraCanvas');
    ctx = canvas ? canvas.getContext('2d') : null;
    canvasWrap = document.getElementById('aksaraCanvasWrap');
    startDotEl = document.getElementById('aksaraStartDot');
    resultPanel = document.getElementById('aksaraResultPanel');
    demoBtn = document.getElementById('aksaraDemoBtn');
  }

  // ─── PART 1: RENDER CHARACTER SELECTOR ─────────────────────
  function renderCharacterSelector() {
    const listContainer = document.getElementById('aksaraList');
    if (!listContainer) return;

    const data = (typeof aksaraData !== 'undefined') ? aksaraData : window.aksaraData;
    const mastered = getMasteredList();

    let html = '';
    AKSARA_KEYS.forEach((key) => {
      const item = data[key];
      if (!item) return;
      const meta = AKSARA_METADATA[key] || { meaningShort: '', order: '00', char: '' };
      const isMastered = mastered.includes(key);

      html += `
        <div class="aksara-item" id="aksara-row-${key}" data-key="${key}" role="tab" tabindex="0" aria-selected="false">
          <div class="aksara-item__preview-box" aria-hidden="true">
            <svg viewBox="0 0 300 300" class="aksara-item__preview-svg" preserveAspectRatio="xMidYMid meet">
              <path d="${item.pathD}" fill="currentColor" />
            </svg>
          </div>
          <div class="aksara-item__meta">
            <h4 class="aksara-item__title">Aksara ${item.label}</h4>
            <p class="aksara-item__meaning">${meta.meaningShort}</p>
          </div>
          <div class="aksara-item__status" id="status-${key}">
            ${isMastered
          ? `<span class="aksara-badge-check" title="Aksara Dikuasai"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><polyline points="20 6 9 17 4 12" /></svg></span>`
          : `<span class="aksara-order-num">${meta.order}</span>`
        }
          </div>
        </div>
      `;
    });

    listContainer.innerHTML = html;

    // Attach click listeners to rows
    listContainer.querySelectorAll('.aksara-item').forEach((row) => {
      row.addEventListener('click', () => {
        const key = row.getAttribute('data-key');
        if (key && key !== currentKey) {
          selectAksara(key);
        }
      });
      row.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const key = row.getAttribute('data-key');
          if (key && key !== currentKey) {
            selectAksara(key);
          }
        }
      });
    });
  }

  // ─── PART 2: CANVAS SETUP & DRAWING INPUT ───────────────────
  function initCanvas() {
    if (!canvas || !ctx) return;

    // Setup coordinates & sharpness
    resizeCanvas();
    window.addEventListener('resize', debounce(resizeCanvas, 100));

    // Pointer Events for touch, mouse, and stylus
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);
  }

  function resizeCanvas() {
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    redrawCanvas();
    updateStartDotPosition();
  }

  function getCanvasCoord(e) {
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 300;
    const y = ((e.clientY - rect.top) / rect.height) * 300;
    return {
      x: Math.max(0, Math.min(300, x)),
      y: Math.max(0, Math.min(300, y))
    };
  }

  function onPointerDown(e) {
    // Only primary button / touch
    if (e.button !== undefined && e.button !== 0) return;

    // Stop stroke demo if running
    if (isDemoPlaying) {
      stopStrokeDemo();
    }

    // Reset scored visual feedback when starting a new stroke
    if (isScored) {
      isScored = false;
      if (resultPanel) resultPanel.hidden = true;
    }

    isDrawing = true;
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch (err) { }

    const pt = getCanvasCoord(e);
    currentStroke = [pt];
    userStrokes.push(currentStroke);
    redrawCanvas();
  }

  function onPointerMove(e) {
    if (!isDrawing || !currentStroke) return;

    const pt = getCanvasCoord(e);
    const last = currentStroke[currentStroke.length - 1];

    // Light distance throttle to avoid point clustering
    const dist = Math.hypot(pt.x - last.x, pt.y - last.y);
    if (dist < 2.5) return;

    currentStroke.push(pt);
    redrawCanvas();
  }

  function onPointerUp(e) {
    if (!isDrawing) return;
    isDrawing = false;

    if (e && e.pointerId) {
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch (err) { }
    }

    currentStroke = null;
    redrawCanvas();
  }

  // ─── PART 3: GHOST GUIDE & CANVAS REDRAW ────────────────────
  function redrawCanvas() {
    if (!canvas || !ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / 300;
    const sy = canvas.height / 300;

    // Reset transform & clear
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply 300x300 logical coordinate scaling
    ctx.setTransform(sx, 0, 0, sy, 0, 0);

    const data = (typeof aksaraData !== 'undefined') ? aksaraData : window.aksaraData;
    const charData = data ? data[currentKey] : null;

    // 1. Draw decorative background crosshair grid (purely decorative, subtle)
    drawDecorativeGrid();

    // 2. Draw Ghost Guide if enabled
    if (showGuide && charData && charData.pathD) {
      ctx.save();
      const guidePath = new Path2D(charData.pathD);
      ctx.strokeStyle = 'rgba(236, 194, 70, 0.45)'; // Site's gold
      ctx.lineWidth = 2.4;
      ctx.setLineDash([6, 5]);
      ctx.stroke(guidePath);
      ctx.restore();
    }

    // 3. Draw Starting Point Dot (from first point of contours[0])
    if (charData && charData.contours && charData.contours.length && charData.contours[0].length) {
      const startPt = charData.contours[0][0];
      drawStartDotCanvas(startPt[0], startPt[1]);
    }

    // 4. Render User's Drawn Strokes
    if (userStrokes.length > 0) {
      renderUserStrokes();
    }
  }

  function drawDecorativeGrid() {
    ctx.save();
    ctx.strokeStyle = 'rgba(236, 194, 70, 0.07)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    // Center crosshairs
    ctx.beginPath();
    ctx.moveTo(150, 20);
    ctx.lineTo(150, 280);
    ctx.moveTo(20, 150);
    ctx.lineTo(280, 150);
    ctx.stroke();

    // Subtle center concentric circle
    ctx.beginPath();
    ctx.arc(150, 150, 85, 0, Math.PI * 2);
    ctx.stroke();

    // Corner decorative tick marks
    ctx.setLineDash([]);
    ctx.strokeStyle = 'rgba(236, 194, 70, 0.14)';
    const corners = [
      [24, 24, 36, 24, 24, 36],
      [276, 24, 264, 24, 276, 36],
      [24, 276, 36, 276, 24, 264],
      [276, 276, 264, 276, 276, 264]
    ];
    corners.forEach(([x1, y1, x2, y2, x3, y3]) => {
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x1, y1);
      ctx.lineTo(x3, y3);
      ctx.stroke();
    });

    ctx.restore();
  }

  function drawStartDotCanvas(x, y) {
    ctx.save();
    // Soft outer glow
    ctx.fillStyle = 'rgba(189, 45, 36, 0.22)';
    ctx.beginPath();
    ctx.arc(x, y, 9, 0, Math.PI * 2);
    ctx.fill();

    // Red core dot
    ctx.fillStyle = '#BD2D24';
    ctx.beginPath();
    ctx.arc(x, y, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Crisp white center pip
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(x, y, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function renderUserStrokes() {
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (!isScored) {
      // Normal drawing mode: natural cream/white brush strokes
      ctx.lineWidth = 7.2;
      ctx.strokeStyle = '#FAF8F5'; // var(--color-cream)

      userStrokes.forEach((stroke) => {
        if (!stroke || stroke.length === 0) return;

        if (stroke.length === 1) {
          ctx.fillStyle = '#FAF8F5';
          ctx.beginPath();
          ctx.arc(stroke[0].x, stroke[0].y, 3.6, 0, Math.PI * 2);
          ctx.fill();
          return;
        }

        ctx.beginPath();
        ctx.moveTo(stroke[0].x, stroke[0].y);

        // Smoothed with quadraticCurveTo
        for (let i = 1; i < stroke.length - 1; i++) {
          const midX = (stroke[i].x + stroke[i + 1].x) / 2;
          const midY = (stroke[i].y + stroke[i + 1].y) / 2;
          ctx.quadraticCurveTo(stroke[i].x, stroke[i].y, midX, midY);
        }
        ctx.lineTo(stroke[stroke.length - 1].x, stroke[stroke.length - 1].y);
        ctx.stroke();
      });
    } else {
      // Scored mode: tinted feedback
      // Soft green for accurate segments near reference, soft red/coral for inaccurate
      ctx.lineWidth = 7.2;

      userStrokes.forEach((stroke) => {
        if (!stroke || stroke.length === 0) return;

        if (stroke.length === 1) {
          const p = stroke[0];
          const isAccurate = (p.distToRef !== undefined && p.distToRef <= TOLERANCE_RADIUS);
          ctx.fillStyle = isAccurate ? '#4ADE80' : '#EF4444';
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3.6, 0, Math.PI * 2);
          ctx.fill();
          return;
        }

        for (let i = 0; i < stroke.length - 1; i++) {
          const p1 = stroke[i];
          const p2 = stroke[i + 1];
          const avgDist = ((p1.distToRef || 0) + (p2.distToRef || 0)) / 2;

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);

          if (avgDist <= TOLERANCE_RADIUS) {
            ctx.strokeStyle = 'rgba(74, 222, 128, 0.95)'; // Soft emerald green
          } else if (avgDist <= PRECISION_MAX_DIST) {
            ctx.strokeStyle = 'rgba(251, 191, 36, 0.92)'; // Soft amber
          } else {
            ctx.strokeStyle = 'rgba(239, 68, 68, 0.92)';   // Soft crimson red
          }
          ctx.stroke();
        }
      });
    }

    ctx.restore();
  }

  function updateStartDotPosition() {
    if (!startDotEl) return;
    const data = (typeof aksaraData !== 'undefined') ? aksaraData : window.aksaraData;
    const charData = data ? data[currentKey] : null;

    if (charData && charData.contours && charData.contours.length && charData.contours[0].length) {
      const pt = charData.contours[0][0];
      const leftPercent = (pt[0] / 300) * 100;
      const topPercent = (pt[1] / 300) * 100;
      startDotEl.style.left = `${leftPercent}%`;
      startDotEl.style.top = `${topPercent}%`;
      startDotEl.style.display = 'block';
    } else {
      startDotEl.style.display = 'none';
    }
  }

  // ─── STROKE ORDER DEMONSTRATION ────────────────────────────
  function toggleStrokeDemo() {
    if (isDemoPlaying) {
      stopStrokeDemo();
    } else {
      startStrokeDemo();
    }
  }

  function startStrokeDemo() {
    const data = (typeof aksaraData !== 'undefined') ? aksaraData : window.aksaraData;
    const charData = data ? data[currentKey] : null;
    if (!charData || !charData.contours || !charData.contours.length) return;

    isDemoPlaying = true;
    demoProgress = 0;

    if (demoBtn) {
      demoBtn.classList.add('is-playing');
      demoBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="5" width="4" height="14" rx="1"/>
          <rect x="14" y="5" width="4" height="14" rx="1"/>
        </svg>
        HENTIKAN PERAGAAN
      `;
    }

    // Flatten contours into ordered animated segments
    const allContours = charData.contours;
    let contourIdx = 0;
    let pointIdx = 0;

    function step() {
      if (!isDemoPlaying) return;

      redrawCanvas();

      // Draw demo progress up to current contour and point
      ctx.save();
      const sx = canvas.width / 300;
      const sy = canvas.height / 300;
      ctx.setTransform(sx, 0, 0, sy, 0, 0);

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Draw all previous contours completed
      for (let c = 0; c < contourIdx; c++) {
        const pts = allContours[c];
        if (pts.length < 2) continue;
        ctx.strokeStyle = 'rgba(236, 194, 70, 0.85)';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        for (let p = 1; p < pts.length; p++) {
          ctx.lineTo(pts[p][0], pts[p][1]);
        }
        ctx.stroke();
      }

      // Draw active contour up to pointIdx
      const currentPts = allContours[contourIdx];
      if (currentPts && currentPts.length > 1) {
        ctx.strokeStyle = '#ECC246';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(currentPts[0][0], currentPts[0][1]);
        const maxP = Math.min(pointIdx, currentPts.length - 1);
        for (let p = 1; p <= maxP; p++) {
          ctx.lineTo(currentPts[p][0], currentPts[p][1]);
        }
        ctx.stroke();

        // Draw animated golden brush head
        const headPt = currentPts[maxP];
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(headPt[0], headPt[1], 4.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(236, 194, 70, 0.45)';
        ctx.beginPath();
        ctx.arc(headPt[0], headPt[1], 9, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // Advance point index
      pointIdx += 3; // speed factor
      if (pointIdx >= currentPts.length) {
        contourIdx++;
        pointIdx = 0;
        if (contourIdx >= allContours.length) {
          // Finished full demo
          setTimeout(() => {
            stopStrokeDemo();
          }, 800);
          return;
        }
      }

      demoAnimId = requestAnimationFrame(step);
    }

    demoAnimId = requestAnimationFrame(step);
  }

  function stopStrokeDemo() {
    isDemoPlaying = false;
    if (demoAnimId) {
      cancelAnimationFrame(demoAnimId);
      demoAnimId = null;
    }
    if (demoBtn) {
      demoBtn.classList.remove('is-playing');
      demoBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor">
          <polygon points="6 4 18 12 6 20 6 4" />
        </svg>
        PERAGAKAN GORESAN
      `;
    }
    redrawCanvas();
  }

  // ─── PART 4: SCORING ENGINE ────────────────────────────────
  function calculateScore() {
    const data = (typeof aksaraData !== 'undefined') ? aksaraData : window.aksaraData;
    const charData = data ? data[currentKey] : null;

    if (!charData || !charData.contours || !charData.contours.length) return;

    // 1. Flatten aksaraData[key].contours into single reference point array
    const refPoints = [];
    charData.contours.forEach((contour) => {
      contour.forEach((pt) => {
        refPoints.push({ x: pt[0], y: pt[1] });
      });
    });

    // 2. Flatten user's completed strokes into one array of drawn points
    const drawnPoints = [];
    userStrokes.forEach((stroke) => {
      stroke.forEach((pt) => {
        drawnPoints.push(pt);
      });
    });

    if (drawnPoints.length < 5) {
      showEmptyDrawingAlert();
      return;
    }

    // 3. Precision: for each drawn point, compute distance to nearest reference point
    let totalPrecisionAccuracy = 0;
    for (let i = 0; i < drawnPoints.length; i++) {
      const p = drawnPoints[i];
      let minDistance = Infinity;

      for (let j = 0; j < refPoints.length; j++) {
        const dx = p.x - refPoints[j].x;
        const dy = p.y - refPoints[j].y;
        const dSq = dx * dx + dy * dy;
        if (dSq < minDistance) {
          minDistance = dSq;
        }
      }

      const dist = Math.sqrt(minDistance);
      p.distToRef = dist; // saved for per-segment visual feedback tinting

      const pointAccuracy = Math.max(0, 1 - (dist / PRECISION_MAX_DIST));
      totalPrecisionAccuracy += pointAccuracy;
    }

    const precisionRatio = drawnPoints.length > 0 ? (totalPrecisionAccuracy / drawnPoints.length) : 0;

    // 4. Coverage: for each reference point, check if any drawn point lies within tolerance radius
    const tolSq = TOLERANCE_RADIUS * TOLERANCE_RADIUS;
    let coveredCount = 0;

    for (let i = 0; i < refPoints.length; i++) {
      const r = refPoints[i];
      let isHit = false;

      for (let j = 0; j < drawnPoints.length; j++) {
        const d = drawnPoints[j];
        const dx = r.x - d.x;
        const dy = r.y - d.y;
        if (dx * dx + dy * dy <= tolSq) {
          isHit = true;
          break;
        }
      }

      if (isHit) coveredCount++;
    }

    const coverageRatio = refPoints.length > 0 ? (coveredCount / refPoints.length) : 0;

    // 5. Combine precision and coverage into 0–100 score
    const weightedScore = (precisionRatio * WEIGHT_PRECISION) + (coverageRatio * WEIGHT_COVERAGE);
    const finalScore = Math.max(0, Math.min(100, Math.round(weightedScore * 100)));

    const precPct = Math.round(precisionRatio * 100);
    const covPct = Math.round(coverageRatio * 100);

    // 6. Display score & qualitative label
    displayResultPanel(finalScore, precPct, covPct);

    // 7. Visual feedback on canvas: re-render with green/red tinting
    isScored = true;
    redrawCanvas();

    // 8. If >= mastered threshold, save to localStorage & update UI
    if (finalScore >= MASTERED_THRESHOLD) {
      setCharacterMastered(currentKey);
    }
  }

  function showEmptyDrawingAlert() {
    if (!resultPanel) return;

    resultPanel.hidden = false;
    const scoreEl = document.getElementById('aksaraResultScore');
    const labelEl = document.getElementById('aksaraResultLabel');
    const descEl = document.getElementById('aksaraResultDesc');
    const precVal = document.getElementById('aksaraPrecisionVal');
    const covVal = document.getElementById('aksaraCoverageVal');
    const precBar = document.getElementById('aksaraPrecisionBar');
    const covBar = document.getElementById('aksaraCoverageBar');
    const statusMsg = document.getElementById('aksaraResultStatus');

    if (scoreEl) scoreEl.textContent = '0%';
    if (labelEl) {
      labelEl.textContent = 'Kanvas Masih Kosong';
      labelEl.className = 'aksara-result-label label--low';
    }
    if (descEl) {
      descEl.textContent = 'Silakan goreskan aksara di atas kanvas mengikuti pola panduan emas sebelum memeriksa presisi.';
    }
    if (precVal) precVal.textContent = '0%';
    if (covVal) covVal.textContent = '0%';
    if (precBar) precBar.style.width = '0%';
    if (covBar) covBar.style.width = '0%';
    if (statusMsg) {
      statusMsg.innerHTML = `
        <div class="aksara-alert aksara-alert--warn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          Tarik garis dengan mouse, sentuhan jari, atau stylus pada kanvas.
        </div>`;
    }
  }

  function displayResultPanel(score, precPct, covPct) {
    if (!resultPanel) return;

    resultPanel.hidden = false;
    const scoreEl = document.getElementById('aksaraResultScore');
    const labelEl = document.getElementById('aksaraResultLabel');
    const descEl = document.getElementById('aksaraResultDesc');
    const precVal = document.getElementById('aksaraPrecisionVal');
    const covVal = document.getElementById('aksaraCoverageVal');
    const precBar = document.getElementById('aksaraPrecisionBar');
    const covBar = document.getElementById('aksaraCoverageBar');
    const statusMsg = document.getElementById('aksaraResultStatus');

    if (scoreEl) scoreEl.textContent = `${score}%`;
    if (precVal) precVal.textContent = `${precPct}%`;
    if (covVal) covVal.textContent = `${covPct}%`;
    if (precBar) precBar.style.width = `${precPct}%`;
    if (covBar) covBar.style.width = `${covPct}%`;

    let labelText = '';
    let labelClass = '';
    let descText = '';

    if (score >= 80) {
      labelText = 'Sangat Presisi!';
      labelClass = 'label--high';
      descText = 'Luar biasa! Tarikan garis Anda selaras dan anggun mengikuti kelokan sakral pengrupak lontar.';
    } else if (score >= 60) {
      labelText = 'Cukup Rapi, Coba Lagi';
      labelClass = 'label--mid';
      descText = 'Bagus! Perhatikan bagian lengkungan yang berwarna merah untuk mencapai ambang kelulusan 75%.';
    } else {
      labelText = 'Perlu Latihan Lagi';
      labelClass = 'label--low';
      descText = 'Goresan masih banyak keluar dari jalur pola emas. Tetap tenang dan ulangi tarikan dari simpul awal.';
    }

    if (labelEl) {
      labelEl.textContent = labelText;
      labelEl.className = `aksara-result-label ${labelClass}`;
    }
    if (descEl) {
      descEl.textContent = descText;
    }

    if (statusMsg) {
      if (score >= MASTERED_THRESHOLD) {
        statusMsg.innerHTML = `
          <div class="aksara-alert aksara-alert--success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <span><strong>Aksara Berhasil Dikuasai!</strong> Tanda kelulusan telah dicatat pada jurnal pusaka Anda.</span>
          </div>`;
      } else {
        statusMsg.innerHTML = `
          <div class="aksara-alert aksara-alert--info">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            <span>Ambang kelulusan: <strong>75%</strong>. Tekan <em>"Hapus & Ulangi"</em> untuk mengasah kembali kelenturan jemari.</span>
          </div>`;
      }
    }
  }

  // ─── ACTION BUTTONS & NAVIGATION ───────────────────────────
  function initEventListeners() {
    // 1. "Hapus & Ulangi"
    const resetBtn = document.getElementById('aksaraBtnReset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        userStrokes = [];
        isScored = false;
        if (resultPanel) resultPanel.hidden = true;
        if (isDemoPlaying) stopStrokeDemo();
        redrawCanvas();
      });
    }

    // 2. "Pola Panduan"
    const guideBtn = document.getElementById('aksaraBtnGuide');
    if (guideBtn) {
      guideBtn.addEventListener('click', () => {
        showGuide = !showGuide;
        guideBtn.classList.toggle('is-off', !showGuide);
        redrawCanvas();
      });
    }

    // 3. "Lihat Penilaian Presisi"
    const scoreBtn = document.getElementById('aksaraBtnScore');
    if (scoreBtn) {
      scoreBtn.addEventListener('click', () => {
        if (isDemoPlaying) stopStrokeDemo();
        calculateScore();
      });
    }

    // 4. "Aksara Berikutnya"
    const nextBtn = document.getElementById('aksaraBtnNext');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const curIdx = AKSARA_KEYS.indexOf(currentKey);
        const nextIdx = (curIdx + 1) % AKSARA_KEYS.length;
        selectAksara(AKSARA_KEYS[nextIdx]);
      });
    }

    // Stroke demo button
    if (demoBtn) {
      demoBtn.addEventListener('click', toggleStrokeDemo);
    }

    // Result panel close
    const resultClose = document.getElementById('aksaraResultClose');
    if (resultClose) {
      resultClose.addEventListener('click', () => {
        if (resultPanel) resultPanel.hidden = true;
      });
    }
  }

  // ─── SELECT CHARACTER ──────────────────────────────────────
  function selectAksara(key) {
    const data = (typeof aksaraData !== 'undefined') ? aksaraData : window.aksaraData;
    if (!data || !data[key]) return;

    if (isDemoPlaying) stopStrokeDemo();

    currentKey = key;
    userStrokes = [];
    isScored = false;
    if (resultPanel) resultPanel.hidden = true;

    // Update active highlight in selector list
    AKSARA_KEYS.forEach((k) => {
      const row = document.getElementById(`aksara-row-${k}`);
      if (!row) return;
      const isActive = (k === key);
      row.classList.toggle('is-active', isActive);
      row.setAttribute('aria-selected', isActive ? 'true' : 'false');

      // Scroll into view on horizontal mobile selector
      if (isActive && window.innerWidth <= 992) {
        row.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });

    // Update Workspace Header
    const item = data[key];
    const meta = AKSARA_METADATA[key] || { meaningLong: '', char: '' };

    const nameEl = document.getElementById('aksaraActiveName');
    if (nameEl) nameEl.textContent = `Aksara ${item.label}`;

    const glyphEl = document.getElementById('aksaraActiveGlyph');
    if (glyphEl) glyphEl.textContent = meta.char;

    const unicodeEl = document.getElementById('aksaraActiveUnicode');
    if (unicodeEl) unicodeEl.textContent = item.unicode;

    const meaningEl = document.getElementById('aksaraActiveMeaning');
    if (meaningEl) meaningEl.textContent = meta.meaningLong;

    // Update Starting Point Dot
    updateStartDotPosition();

    // Redraw workspace canvas
    redrawCanvas();
  }

  // ─── UTILITY HELPERS ───────────────────────────────────────
  function debounce(fn, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  // Expose for debugging if needed
  window.AksaraTracingEngine = {
    selectAksara,
    calculateScore,
    getMasteredList,
    TOLERANCE_RADIUS,
    PRECISION_MAX_DIST
  };
})();
