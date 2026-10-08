// Nusa Bali Heritage — modul penelusuran kaligrafi sakral Aksara Bali

(function () {
  'use strict';

  // Pengaturan toleransi dan bobot penilaian presisi
  const hitTolerance = 18;
  const maxDeviation = 32;
  const precisionWeight = 0.50;
  const coverageWeight = 0.50;
  const passingScore = 75;
  const storageKey = 'nusabali_aksara_mastered';

  const aksaraMeta = {
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

  const aksaraList = ['ha', 'na', 'ca', 'ra', 'ka', 'da', 'ta', 'sa', 'wa', 'la'];

  let activeKey = 'ha';
  let strokePaths = [];
  let currentPath = null;
  let isPenActive = false;
  let displayGuide = true;
  let isEvaluated = false;
  let demoRafId = null;
  let isDemoActive = false;

  let padCanvas = null;
  let drawCtx = null;
  let canvasWrap = null;
  let startIndicator = null;
  let resultScoreboard = null;
  let btnDemo = null;

  function loadMasteredAksara() {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (_) {
      return [];
    }
  }

  function markAksaraMastered(key) {
    const list = loadMasteredAksara();
    if (!list.includes(key)) {
      list.push(key);
      try {
        localStorage.setItem(storageKey, JSON.stringify(list));
      } catch (_) {}
    }
    refreshMasteryStats(list, key);
  }

  function refreshMasteryStats(list, justMasteredKey = null) {
    const totalMastered = list.length;
    const progressPercent = Math.round((totalMastered / 10) * 100);

    const countEl = document.getElementById('aksaraMasteredCount');
    if (countEl) countEl.textContent = totalMastered;

    const percentEl = document.getElementById('aksaraProgressPercent');
    if (percentEl) percentEl.textContent = `${progressPercent}%`;

    const barEl = document.getElementById('aksaraProgressFill');
    if (barEl) barEl.style.width = `${progressPercent}%`;

    const headerProgEl = document.getElementById('aksaraHeaderProgress');
    if (headerProgEl) headerProgEl.textContent = `${totalMastered} / 10 Pratama`;

    aksaraList.forEach((key) => {
      const statusEl = document.getElementById(`status-${key}`);
      const rowEl = document.getElementById(`aksara-row-${key}`);
      if (!statusEl || !rowEl) return;

      const isCompleted = list.includes(key);
      if (isCompleted) {
        rowEl.classList.add('is-mastered');
        statusEl.innerHTML = `
          <span class="aksara-badge-check" title="Aksara Dikuasai">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>`;
      } else {
        rowEl.classList.remove('is-mastered');
        const meta = aksaraMeta[key] || { order: '00' };
        statusEl.innerHTML = `<span class="aksara-order-num">${meta.order}</span>`;
      }

      if (justMasteredKey && key === justMasteredKey) {
        rowEl.classList.remove('is-celebrating');
        void rowEl.offsetWidth;
        rowEl.classList.add('is-celebrating');
        setTimeout(() => rowEl.classList.remove('is-celebrating'), 1200);
      }
    });
  }

  function setupAksaraStudio() {
    const section = document.getElementById('bahasa');
    if (!section) return;

    if (!fetchAksaraDataset()) {
      console.warn('Dataset aksara belum siap dimuat.');
      return;
    }

    cacheDOMElements();
    buildCharacterTabs();
    setupDrawingSurface();
    bindStudioEvents();
    refreshMasteryStats(loadMasteredAksara());
    switchAksara('ha');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupAksaraStudio);
  } else {
    setupAksaraStudio();
  }

  function cacheDOMElements() {
    padCanvas = document.getElementById('aksaraCanvas');
    drawCtx = padCanvas ? padCanvas.getContext('2d') : null;
    canvasWrap = document.getElementById('aksaraCanvasWrap');
    startIndicator = document.getElementById('aksaraStartDot');
    resultScoreboard = document.getElementById('aksaraResultPanel');
    btnDemo = document.getElementById('aksaraDemoBtn');
  }

  function buildCharacterTabs() {
    const listContainer = document.getElementById('aksaraList');
    if (!listContainer) return;

    const dataset = fetchAksaraDataset();
    const completedList = loadMasteredAksara();

    let tabMarkup = '';
    aksaraList.forEach((key) => {
      const item = dataset[key];
      if (!item) return;
      const meta = aksaraMeta[key] || { meaningShort: '', order: '00', char: '' };
      const isDone = completedList.includes(key);

      tabMarkup += `
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
            ${isDone
              ? `<span class="aksara-badge-check" title="Aksara Dikuasai"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><polyline points="20 6 9 17 4 12" /></svg></span>`
              : `<span class="aksara-order-num">${meta.order}</span>`
            }
          </div>
        </div>
      `;
    });

    listContainer.innerHTML = tabMarkup;

    listContainer.querySelectorAll('.aksara-item').forEach((row) => {
      const rowKey = row.getAttribute('data-key');
      const pickRow = () => {
        if (rowKey !== activeKey) switchAksara(rowKey);
      };

      row.addEventListener('click', pickRow);
      row.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          pickRow();
        }
      });
    });
  }

  function setupDrawingSurface() {
    if (!padCanvas || !drawCtx) return;

    fitCanvasToDPR();
    window.addEventListener('resize', debounce(fitCanvasToDPR, 100));

    padCanvas.addEventListener('pointerdown', onPointerDown);
    padCanvas.addEventListener('pointermove', onPointerMove);
    padCanvas.addEventListener('pointerup', onPointerUp);
    padCanvas.addEventListener('pointercancel', onPointerUp);
  }

  function fitCanvasToDPR() {
    if (!padCanvas || !drawCtx) return;

    const bounds = padCanvas.getBoundingClientRect();
    if (bounds.width === 0 || bounds.height === 0) return;

    const ratio = window.devicePixelRatio || 1;
    padCanvas.width = Math.round(bounds.width * ratio);
    padCanvas.height = Math.round(bounds.height * ratio);

    renderCanvasFrame();
    positionStartIndicator();
  }

  function mapPointerToLogicalCoords(e) {
    const bounds = padCanvas.getBoundingClientRect();
    const posX = ((e.clientX - bounds.left) / bounds.width) * 300;
    const posY = ((e.clientY - bounds.top) / bounds.height) * 300;
    return {
      x: Math.max(0, Math.min(300, posX)),
      y: Math.max(0, Math.min(300, posY))
    };
  }

  function onPointerDown(e) {
    if (e.button !== undefined && e.button !== 0) return;

    if (isDemoActive) {
      stopStrokeDemo();
    }

    if (isEvaluated) {
      isEvaluated = false;
      if (resultScoreboard) resultScoreboard.hidden = true;
    }

    isPenActive = true;
    try {
      padCanvas.setPointerCapture(e.pointerId);
    } catch (_) {}

    const coord = mapPointerToLogicalCoords(e);
    currentPath = [coord];
    strokePaths.push(currentPath);
    renderCanvasFrame();
  }

  function onPointerMove(e) {
    if (!isPenActive || !currentPath) return;

    const coord = mapPointerToLogicalCoords(e);
    const lastPoint = currentPath[currentPath.length - 1];

    const stepDist = Math.hypot(coord.x - lastPoint.x, coord.y - lastPoint.y);
    if (stepDist < 2.5) return;

    currentPath.push(coord);
    renderCanvasFrame();
  }

  function onPointerUp(e) {
    if (!isPenActive) return;
    isPenActive = false;

    if (e?.pointerId) {
      try {
        padCanvas.releasePointerCapture(e.pointerId);
      } catch (_) {}
    }

    currentPath = null;
    renderCanvasFrame();
  }

  function renderCanvasFrame() {
    if (!padCanvas || !drawCtx) return;

    const scaleX = padCanvas.width / 300;
    const scaleY = padCanvas.height / 300;

    drawCtx.setTransform(1, 0, 0, 1, 0, 0);
    drawCtx.clearRect(0, 0, padCanvas.width, padCanvas.height);

    drawCtx.setTransform(scaleX, 0, 0, scaleY, 0, 0);

    const activeChar = getActiveCharData();

    drawGridLines();

    if (displayGuide && activeChar?.pathD) {
      drawCtx.save();
      const pathShape = new Path2D(activeChar.pathD);
      drawCtx.strokeStyle = 'rgba(236, 194, 70, 0.45)';
      drawCtx.lineWidth = 2.4;
      drawCtx.setLineDash([6, 5]);
      drawCtx.stroke(pathShape);
      drawCtx.restore();
    }

    if (activeChar?.contours?.length && activeChar.contours[0].length) {
      const originPoint = activeChar.contours[0][0];
      renderStartGlyphDot(originPoint[0], originPoint[1]);
    }

    if (strokePaths.length > 0) {
      drawUserInk();
    }
  }

  function drawGridLines() {
    drawCtx.save();
    drawCtx.strokeStyle = 'rgba(236, 194, 70, 0.07)';
    drawCtx.lineWidth = 1;
    drawCtx.setLineDash([4, 4]);

    drawCtx.beginPath();
    drawCtx.moveTo(150, 20);
    drawCtx.lineTo(150, 280);
    drawCtx.moveTo(20, 150);
    drawCtx.lineTo(280, 150);
    drawCtx.stroke();

    drawCtx.beginPath();
    drawCtx.arc(150, 150, 85, 0, Math.PI * 2);
    drawCtx.stroke();

    drawCtx.setLineDash([]);
    drawCtx.strokeStyle = 'rgba(236, 194, 70, 0.14)';
    const cornerMarkers = [
      [24, 24, 36, 24, 24, 36],
      [276, 24, 264, 24, 276, 36],
      [24, 276, 36, 276, 24, 264],
      [276, 276, 264, 276, 276, 264]
    ];
    cornerMarkers.forEach(([ax, ay, bx, by, cx, cy]) => {
      drawCtx.beginPath();
      drawCtx.moveTo(bx, by);
      drawCtx.lineTo(ax, ay);
      drawCtx.lineTo(cx, cy);
      drawCtx.stroke();
    });

    drawCtx.restore();
  }

  function renderStartGlyphDot(px, py) {
    drawCtx.save();
    drawCtx.fillStyle = 'rgba(189, 45, 36, 0.22)';
    drawCtx.beginPath();
    drawCtx.arc(px, py, 9, 0, Math.PI * 2);
    drawCtx.fill();

    drawCtx.fillStyle = '#BD2D24';
    drawCtx.beginPath();
    drawCtx.arc(px, py, 4.5, 0, Math.PI * 2);
    drawCtx.fill();

    drawCtx.fillStyle = '#FFFFFF';
    drawCtx.beginPath();
    drawCtx.arc(px, py, 1.8, 0, Math.PI * 2);
    drawCtx.fill();
    drawCtx.restore();
  }

  function drawUserInk() {
    drawCtx.save();
    drawCtx.lineCap = 'round';
    drawCtx.lineJoin = 'round';

    if (!isEvaluated) {
      drawCtx.lineWidth = 7.2;
      drawCtx.strokeStyle = '#FAF8F5'; // warna krem var(--c-cream)

      strokePaths.forEach((path) => {
        if (!path || path.length === 0) return;

        if (path.length === 1) {
          drawCtx.fillStyle = '#FAF8F5';
          drawCtx.beginPath();
          drawCtx.arc(path[0].x, path[0].y, 3.6, 0, Math.PI * 2);
          drawCtx.fill();
          return;
        }

        drawCtx.beginPath();
        drawCtx.moveTo(path[0].x, path[0].y);

        for (let i = 1; i < path.length - 1; i++) {
          const midPointX = (path[i].x + path[i + 1].x) / 2;
          const midPointY = (path[i].y + path[i + 1].y) / 2;
          drawCtx.quadraticCurveTo(path[i].x, path[i].y, midPointX, midPointY);
        }
        drawCtx.lineTo(path[path.length - 1].x, path[path.length - 1].y);
        drawCtx.stroke();
      });
    } else {
      drawCtx.lineWidth = 7.2;

      strokePaths.forEach((path) => {
        if (!path || path.length === 0) return;

        if (path.length === 1) {
          const p = path[0];
          const isAccurate = (p.distToRef !== undefined && p.distToRef <= hitTolerance);
          drawCtx.fillStyle = isAccurate ? '#4ADE80' : '#EF4444';
          drawCtx.beginPath();
          drawCtx.arc(p.x, p.y, 3.6, 0, Math.PI * 2);
          drawCtx.fill();
          return;
        }

        for (let i = 0; i < path.length - 1; i++) {
          const p1 = path[i];
          const p2 = path[i + 1];
          const meanDist = ((p1.distToRef || 0) + (p2.distToRef || 0)) / 2;

          drawCtx.beginPath();
          drawCtx.moveTo(p1.x, p1.y);
          drawCtx.lineTo(p2.x, p2.y);

          if (meanDist <= hitTolerance) {
            drawCtx.strokeStyle = 'rgba(74, 222, 128, 0.95)';
          } else if (meanDist <= maxDeviation) {
            drawCtx.strokeStyle = 'rgba(251, 191, 36, 0.92)';
          } else {
            drawCtx.strokeStyle = 'rgba(239, 68, 68, 0.92)';
          }
          drawCtx.stroke();
        }
      });
    }

    drawCtx.restore();
  }

  function positionStartIndicator() {
    if (!startIndicator) return;
    const charData = getActiveCharData();

    if (charData?.contours?.length && charData.contours[0].length) {
      const pt = charData.contours[0][0];
      const leftPercent = (pt[0] / 300) * 100;
      const topPercent = (pt[1] / 300) * 100;
      startIndicator.style.left = `${leftPercent}%`;
      startIndicator.style.top = `${topPercent}%`;
      startIndicator.style.display = 'block';
    } else {
      startIndicator.style.display = 'none';
    }
  }

  function toggleStrokeDemo() {
    if (isDemoActive) {
      stopStrokeDemo();
    } else {
      startStrokeDemo();
    }
  }

  function startStrokeDemo() {
    const charData = getActiveCharData();
    if (!charData?.contours?.length) return;

    isDemoActive = true;

    if (btnDemo) {
      btnDemo.classList.add('is-playing');
      btnDemo.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="5" width="4" height="14" rx="1"/>
          <rect x="14" y="5" width="4" height="14" rx="1"/>
        </svg>
        HENTIKAN PERAGAAN
      `;
    }

    const contoursList = charData.contours;
    let contourIdx = 0;
    let cursorIdx = 0;

    function renderDemoTick() {
      if (!isDemoActive) return;

      renderCanvasFrame();

      drawCtx.save();
      const scaleFactorX = padCanvas.width / 300;
      const scaleFactorY = padCanvas.height / 300;
      drawCtx.setTransform(scaleFactorX, 0, 0, scaleFactorY, 0, 0);

      drawCtx.lineCap = 'round';
      drawCtx.lineJoin = 'round';

      for (let c = 0; c < contourIdx; c++) {
        const polyline = contoursList[c];
        if (polyline.length < 2) continue;
        drawCtx.strokeStyle = 'rgba(236, 194, 70, 0.85)';
        drawCtx.lineWidth = 5;
        drawCtx.beginPath();
        drawCtx.moveTo(polyline[0][0], polyline[0][1]);
        for (let p = 1; p < polyline.length; p++) {
          drawCtx.lineTo(polyline[p][0], polyline[p][1]);
        }
        drawCtx.stroke();
      }

      const activeContour = contoursList[contourIdx];
      if (activeContour && activeContour.length > 1) {
        drawCtx.strokeStyle = '#ECC246';
        drawCtx.lineWidth = 6;
        drawCtx.beginPath();
        drawCtx.moveTo(activeContour[0][0], activeContour[0][1]);
        const boundP = Math.min(cursorIdx, activeContour.length - 1);
        for (let p = 1; p <= boundP; p++) {
          drawCtx.lineTo(activeContour[p][0], activeContour[p][1]);
        }
        drawCtx.stroke();

        const penTip = activeContour[boundP];
        drawCtx.fillStyle = '#FFFFFF';
        drawCtx.beginPath();
        drawCtx.arc(penTip[0], penTip[1], 4.5, 0, Math.PI * 2);
        drawCtx.fill();

        drawCtx.fillStyle = 'rgba(236, 194, 70, 0.45)';
        drawCtx.beginPath();
        drawCtx.arc(penTip[0], penTip[1], 9, 0, Math.PI * 2);
        drawCtx.fill();
      }

      drawCtx.restore();

      cursorIdx += 3;
      if (cursorIdx >= activeContour.length) {
        contourIdx++;
        cursorIdx = 0;
        if (contourIdx >= contoursList.length) {
          setTimeout(() => {
            stopStrokeDemo();
          }, 800);
          return;
        }
      }

      demoRafId = requestAnimationFrame(renderDemoTick);
    }

    demoRafId = requestAnimationFrame(renderDemoTick);
  }

  function stopStrokeDemo() {
    isDemoActive = false;
    if (demoRafId) {
      cancelAnimationFrame(demoRafId);
      demoRafId = null;
    }
    if (btnDemo) {
      btnDemo.classList.remove('is-playing');
      btnDemo.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor">
          <polygon points="6 4 18 12 6 20 6 4" />
        </svg>
        PERAGAKAN GORESAN
      `;
    }
    renderCanvasFrame();
  }

  function evaluateTracePrecision() {
    const charData = getActiveCharData();
    if (!charData?.contours?.length) return;

    const referenceCoords = [];
    charData.contours.forEach((contour) => {
      contour.forEach((pt) => {
        referenceCoords.push({ x: pt[0], y: pt[1] });
      });
    });

    const collectedPoints = [];
    strokePaths.forEach((path) => {
      path.forEach((pt) => {
        collectedPoints.push(pt);
      });
    });

    if (collectedPoints.length < 5) {
      notifyEmptyCanvas();
      return;
    }

    let sumPrecision = 0;
    for (let i = 0; i < collectedPoints.length; i++) {
      const drawnPt = collectedPoints[i];
      let shortestDistSq = Infinity;

      for (let j = 0; j < referenceCoords.length; j++) {
        const deltaX = drawnPt.x - referenceCoords[j].x;
        const deltaY = drawnPt.y - referenceCoords[j].y;
        const distSq = deltaX * deltaX + deltaY * deltaY;
        if (distSq < shortestDistSq) {
          shortestDistSq = distSq;
        }
      }

      const dist = Math.sqrt(shortestDistSq);
      drawnPt.distToRef = dist;

      const accuracy = Math.max(0, 1 - (dist / maxDeviation));
      sumPrecision += accuracy;
    }

    const precisionRatio = sumPrecision / collectedPoints.length;

    const toleranceSq = hitTolerance * hitTolerance;
    let coveredPointsCount = 0;

    for (let i = 0; i < referenceCoords.length; i++) {
      const refPt = referenceCoords[i];
      let isHit = false;

      for (let j = 0; j < collectedPoints.length; j++) {
        const drawn = collectedPoints[j];
        const dx = refPt.x - drawn.x;
        const dy = refPt.y - drawn.y;
        if (dx * dx + dy * dy <= toleranceSq) {
          isHit = true;
          break;
        }
      }

      if (isHit) coveredPointsCount++;
    }

    const coverageRatio = referenceCoords.length > 0 ? (coveredPointsCount / referenceCoords.length) : 0;
    const compositeScore = (precisionRatio * precisionWeight) + (coverageRatio * coverageWeight);
    const finalScore = Math.max(0, Math.min(100, Math.round(compositeScore * 100)));

    const precPct = Math.round(precisionRatio * 100);
    const covPct = Math.round(coverageRatio * 100);

    renderEvaluationMetrics(finalScore, precPct, covPct);

    isEvaluated = true;
    renderCanvasFrame();

    if (finalScore >= passingScore) {
      markAksaraMastered(activeKey);
    }
  }

  function getMetricDOMNodes() {
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

  function notifyEmptyCanvas() {
    if (!resultScoreboard) return;

    resultScoreboard.hidden = false;
    const nodes = getMetricDOMNodes();

    if (nodes.score) nodes.score.textContent = '0%';
    if (nodes.label) {
      nodes.label.textContent = 'Kanvas Masih Kosong';
      nodes.label.className = 'aksara-result-label label--low';
    }
    if (nodes.desc) {
      nodes.desc.textContent = 'Silakan goreskan aksara di atas kanvas mengikuti pola panduan emas sebelum memeriksa presisi.';
    }
    if (nodes.precisionVal) nodes.precisionVal.textContent = '0%';
    if (nodes.coverageVal) nodes.coverageVal.textContent = '0%';
    if (nodes.precisionBar) nodes.precisionBar.style.width = '0%';
    if (nodes.coverageBar) nodes.coverageBar.style.width = '0%';
    if (nodes.status) {
      nodes.status.innerHTML = `
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

  function renderEvaluationMetrics(score, precPct, covPct) {
    if (!resultScoreboard) return;

    resultScoreboard.hidden = false;
    const nodes = getMetricDOMNodes();

    if (nodes.score) nodes.score.textContent = `${score}%`;
    if (nodes.precisionVal) nodes.precisionVal.textContent = `${precPct}%`;
    if (nodes.coverageVal) nodes.coverageVal.textContent = `${covPct}%`;
    if (nodes.precisionBar) nodes.precisionBar.style.width = `${precPct}%`;
    if (nodes.coverageBar) nodes.coverageBar.style.width = `${covPct}%`;

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

    if (nodes.label) {
      nodes.label.textContent = labelText;
      nodes.label.className = `aksara-result-label ${labelClass}`;
    }
    if (nodes.desc) {
      nodes.desc.textContent = descText;
    }

    if (nodes.status) {
      if (score >= passingScore) {
        nodes.status.innerHTML = `
          <div class="aksara-alert aksara-alert--success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <span><strong>Aksara Berhasil Dikuasai!</strong> Tanda kelulusan telah dicatat pada jurnal pusaka Anda.</span>
          </div>`;
      } else {
        nodes.status.innerHTML = `
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

  function bindStudioEvents() {
    const btnReset = document.getElementById('aksaraBtnReset');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        strokePaths = [];
        isEvaluated = false;
        if (resultScoreboard) resultScoreboard.hidden = true;
        if (isDemoActive) stopStrokeDemo();
        renderCanvasFrame();
      });
    }

    const btnGuide = document.getElementById('aksaraBtnGuide');
    if (btnGuide) {
      btnGuide.addEventListener('click', () => {
        displayGuide = !displayGuide;
        btnGuide.classList.toggle('is-off', !displayGuide);
        renderCanvasFrame();
      });
    }

    const btnScore = document.getElementById('aksaraBtnScore');
    if (btnScore) {
      btnScore.addEventListener('click', () => {
        if (isDemoActive) stopStrokeDemo();
        evaluateTracePrecision();
      });
    }

    const btnNext = document.getElementById('aksaraBtnNext');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        const curIdx = aksaraList.indexOf(activeKey);
        const nextIdx = (curIdx + 1) % aksaraList.length;
        switchAksara(aksaraList[nextIdx]);
      });
    }

    if (btnDemo) {
      btnDemo.addEventListener('click', toggleStrokeDemo);
    }

    const btnDismissResult = document.getElementById('aksaraResultClose');
    if (btnDismissResult) {
      btnDismissResult.addEventListener('click', () => {
        if (resultScoreboard) resultScoreboard.hidden = true;
      });
    }
  }

  function switchAksara(key) {
    const dataset = fetchAksaraDataset();
    if (!dataset || !dataset[key]) return;

    if (isDemoActive) stopStrokeDemo();

    activeKey = key;
    strokePaths = [];
    isEvaluated = false;
    if (resultScoreboard) resultScoreboard.hidden = true;

    aksaraList.forEach((k) => {
      const row = document.getElementById(`aksara-row-${k}`);
      if (!row) return;
      const isCurrent = (k === key);
      row.classList.toggle('is-active', isCurrent);
      row.setAttribute('aria-selected', String(isCurrent));

      if (isCurrent && window.innerWidth <= 992) {
        row.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });

    const item = dataset[key];
    const meta = aksaraMeta[key] || { meaningLong: '', char: '' };

    const nameEl = document.getElementById('aksaraActiveName');
    if (nameEl) nameEl.textContent = `Aksara ${item.label}`;

    const glyphEl = document.getElementById('aksaraActiveGlyph');
    if (glyphEl) glyphEl.textContent = meta.char;

    const unicodeEl = document.getElementById('aksaraActiveUnicode');
    if (unicodeEl) unicodeEl.textContent = item.unicode;

    const meaningEl = document.getElementById('aksaraActiveMeaning');
    if (meaningEl) meaningEl.textContent = meta.meaningLong;

    positionStartIndicator();
    renderCanvasFrame();
  }

  function fetchAksaraDataset() {
    return (typeof aksaraData !== 'undefined') ? aksaraData : (window.aksaraData || null);
  }

  function getActiveCharData() {
    const dataset = fetchAksaraDataset();
    return dataset ? dataset[activeKey] : null;
  }

  function debounce(callback, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => callback.apply(this, args), delay);
    };
  }
})();
