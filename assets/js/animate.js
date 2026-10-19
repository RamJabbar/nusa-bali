// Nusa Bali Heritage — Premium Scroll Animation & Motion System
// Storytelling museum-grade reveal system, text line clipping masks,
// nuanced scroll reveal variants, organic easing curves, image scale-settling,
// subtle scroll parallax, interactive card motions, and numeric count-ups.

(function () {
  'use strict';

  /**
   * Check if user prefers reduced motion
   */
  function isReducedMotion() {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (_) {
      return false;
    }
  }

  /* ==========================================================================
     1. MARQUEE SMOOTH SCROLL & INTERACTIVE SWIPE ENGINE
     ========================================================================== */
  function setupMarquees() {
    if (isReducedMotion()) return;

    const marqueeTracks = document.querySelectorAll('.marquee-track');
    marqueeTracks.forEach((track) => bindMarqueeTrack(track));
  }

  function bindMarqueeTrack(track) {
    const seedNodes = Array.from(track.children);
    if (!seedNodes.length) return;

    // Duplicate elements for seamless loop
    seedNodes.forEach((node) => {
      const dup = node.cloneNode(true);
      dup.setAttribute('aria-hidden', 'true');
      dup.querySelectorAll('a, button, input, select, textarea').forEach((interactive) => {
        interactive.setAttribute('tabindex', '-1');
      });
      track.appendChild(dup);
    });

    const containerBox = track.closest('.marquee-viewport') || track.parentElement;
    const parsedSpeed = parseFloat(track.dataset.speed);
    const scrollSpeed = isNaN(parsedSpeed) || parsedSpeed <= 0 ? 40 : parsedSpeed;

    let scrollX = 0;
    let isPaused = false;
    let prevFrameTime = null;
    let resumeDelayTimer = null;

    let isSwiping = false;
    let didSwipe = false;
    let originX = 0;
    let baseScrollX = 0;
    let activePointer = null;

    function normalizeBounds() {
      const halfWidth = track.scrollWidth / 2;
      if (halfWidth > 0) {
        while (scrollX < 0) scrollX += halfWidth;
        while (scrollX >= halfWidth) scrollX -= halfWidth;
      }
    }

    function applyTransform() {
      track.style.transform = `translateX(-${scrollX}px)`;
    }

    function onPointerDown(e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;

      isSwiping = true;
      didSwipe = false;
      originX = e.clientX;
      baseScrollX = scrollX;
      activePointer = e.pointerId;
      isPaused = true;
      prevFrameTime = null;

      if (resumeDelayTimer) {
        clearTimeout(resumeDelayTimer);
        resumeDelayTimer = null;
      }

      track.classList.add('is-dragging');
      if (containerBox) containerBox.classList.add('is-dragging');
    }

    function onPointerMove(e) {
      if (!isSwiping || e.pointerId !== activePointer) return;

      const diffX = e.clientX - originX;

      if (!didSwipe) {
        if (Math.abs(diffX) <= 6) return;
        didSwipe = true;
        window.__justDragged = true;
        track.dataset.justDragged = 'true';
        if (containerBox?.setPointerCapture) {
          try {
            containerBox.setPointerCapture(e.pointerId);
          } catch (_) { }
        }
      }

      if (e.cancelable) e.preventDefault();
      scrollX = baseScrollX - diffX;
      normalizeBounds();
      applyTransform();
    }

    function onPointerUp(e) {
      if (!isSwiping || (activePointer !== null && e.pointerId !== activePointer)) return;

      isSwiping = false;
      activePointer = null;
      track.classList.remove('is-dragging');
      if (containerBox) containerBox.classList.remove('is-dragging');

      if (containerBox?.releasePointerCapture && containerBox.hasPointerCapture?.(e.pointerId)) {
        try {
          containerBox.releasePointerCapture(e.pointerId);
        } catch (_) { }
      }

      if (didSwipe) {
        window.__justDragged = true;
        track.dataset.justDragged = 'true';
        setTimeout(() => {
          window.__justDragged = false;
          track.dataset.justDragged = 'false';
          didSwipe = false;
        }, 250);
      }

      if (resumeDelayTimer) clearTimeout(resumeDelayTimer);
      resumeDelayTimer = setTimeout(() => {
        const isHovered = (containerBox && containerBox.matches(':hover')) || track.matches(':hover');
        const isFocused = track.matches(':focus-within');
        if (!isHovered && !isFocused) {
          isPaused = false;
          prevFrameTime = null;
        }
      }, 1500);
    }

    const interactiveArea = containerBox || track;
    interactiveArea.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    track.addEventListener('click', (e) => {
      if (didSwipe || track.dataset.justDragged === 'true' || window.__justDragged) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);

    track.addEventListener('mouseenter', () => {
      isPaused = true;
    });

    track.addEventListener('mouseleave', () => {
      if (!isSwiping) {
        isPaused = false;
        prevFrameTime = null;
      }
    });

    track.addEventListener('focusin', () => {
      isPaused = true;
    });

    track.addEventListener('focusout', () => {
      if (!isSwiping) {
        isPaused = false;
        prevFrameTime = null;
      }
    });

    function step(timestamp) {
      if (!prevFrameTime) {
        prevFrameTime = timestamp;
      }

      const elapsed = (timestamp - prevFrameTime) / 1000;
      prevFrameTime = timestamp;

      if (elapsed > 0 && elapsed < 0.2 && !isPaused && !isSwiping) {
        scrollX += scrollSpeed * elapsed;
        normalizeBounds();
        applyTransform();
      }

      requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  /* ==========================================================================
     2. NUMERIC COUNT-UP ENGINE
     ========================================================================== */
  function animateCounter(element) {
    if (!element || element.dataset.counted === 'true') return;
    if (isReducedMotion()) return;

    const text = element.textContent.trim();
    // Match numbers like 3.000+, 128, 9, 2, 13, 18, 5, 30+, 3
    const match = text.match(/^([^\d]*)(\d[\d\.]*)(.*)$/);
    if (!match) return;

    const prefix = match[1] || '';
    const rawNumberStr = match[2];
    const suffix = match[3] || '';
    const hasDot = rawNumberStr.includes('.');
    const targetVal = parseFloat(rawNumberStr.replace(/\./g, ''));

    if (isNaN(targetVal) || targetVal <= 0) return;

    element.dataset.counted = 'true';
    const duration = 1350; // ms
    const startTime = performance.now();

    function formatNumber(num) {
      if (hasDot) {
        return Math.round(num).toLocaleString('id-ID');
      }
      return Math.round(num).toString();
    }

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(progress);
      const currentVal = targetVal * eased;

      element.textContent = `${prefix}${formatNumber(currentVal)}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = text; // Ensure exact final display
      }
    }

    requestAnimationFrame(update);
  }

  /* ==========================================================================
     3. HEADING TEXT REVEAL (CLIPPING MASK WRAPPER)
     ========================================================================== */
  function prepareHeadingMasks() {
    if (isReducedMotion()) return;

    const headings = [
      ...document.querySelectorAll('.hero h1'),
      ...document.querySelectorAll('.gamelan-hero__title'),
      ...document.querySelectorAll('.section-heading'),
      ...document.querySelectorAll('.gallery-main-title')
    ];

    headings.forEach((heading) => {
      if (heading.dataset.masked === 'true') return;
      heading.dataset.masked = 'true';

      const childSpans = Array.from(heading.children).filter(
        (child) => child.tagName.toLowerCase() === 'span' && !child.classList.contains('heading-line-mask')
      );

      if (childSpans.length > 0) {
        childSpans.forEach((span, idx) => {
          if (!span.querySelector('.heading-line-inner')) {
            const innerContent = span.innerHTML;
            span.innerHTML = `<span class="heading-line-mask"><span class="heading-line-inner" style="--heading-delay: ${idx * 140}ms">${innerContent}</span></span>`;
          }
        });
      } else {
        const textContent = heading.innerHTML;
        heading.innerHTML = `<span class="heading-line-mask"><span class="heading-line-inner" style="--heading-delay: 0ms">${textContent}</span></span>`;
      }
    });
  }

  /* ==========================================================================
     4. HERO SECTION — CINEMATIC ENTRANCE
     ========================================================================== */
  function prepareHeroInitialState() {
    const heroEl = document.querySelector('.hero') || document.querySelector('.gamelan-hero');
    if (!heroEl) return;

    if (isReducedMotion()) {
      heroEl.classList.add('hero-is-active');
      return;
    }

    heroEl.classList.add('hero-ready');
  }

  function activateHero() {
    const heroEl = document.querySelector('.hero') || document.querySelector('.gamelan-hero');
    if (!heroEl) return;

    if (isReducedMotion()) {
      heroEl.classList.add('hero-is-active');
      return;
    }

    heroEl.classList.add('hero-ready');
    // Ensure paint frame before applying active class for smooth CSS transitions
    requestAnimationFrame(() => {
      heroEl.classList.add('hero-is-active');

      // Trigger text mask reveals on hero heading
      const heroHeadings = heroEl.querySelectorAll('.hero h1, .gamelan-hero__title');
      heroHeadings.forEach((h) => h.classList.add('is-revealed'));

      // Count up numbers in hero stats bar after slight delay
      setTimeout(() => {
        heroEl.querySelectorAll('.stat-card__number, .stat-pill__value').forEach((el) => {
          animateCounter(el);
        });
      }, 450);
    });
  }

  /* ==========================================================================
     5. SCROLL REVEAL SYSTEM (INTERSECTION OBSERVER)
     ========================================================================== */
  function setupScrollReveals() {
    if (isReducedMotion()) return;
    if (!('IntersectionObserver' in window)) return;

    prepareHeadingMasks();

    // 1. Headings
    const headingTargets = [
      ...document.querySelectorAll('.section-head .section-heading'),
      ...document.querySelectorAll('.gallery-main-title'),
      ...document.querySelectorAll('.spatial-section h2')
    ];
    headingTargets.forEach((el) => el.classList.add('reveal-heading'));

    // 2. Eyebrows & Small Labels
    const eyebrowTargets = [
      ...document.querySelectorAll('.eyebrow'),
      ...document.querySelectorAll('.eyebrow-gamelan'),
      ...document.querySelectorAll('.gallery-eyebrow-badge'),
      ...document.querySelectorAll('.peta-eyebrow-pill')
    ];
    eyebrowTargets.forEach((el) => el.classList.add('reveal-eyebrow'));

    // 3. Paragraphs & Story Descriptions
    const descTargets = [
      ...document.querySelectorAll('.section-desc'),
      ...document.querySelectorAll('.gallery-main-desc'),
      ...document.querySelectorAll('.gamelan-hero__desc')
    ];
    descTargets.forEach((el) => el.classList.add('reveal-desc'));

    // 4. Main Media & Story Images
    const mediaTargets = [
      ...document.querySelectorAll('.teaser-section .teaser-media'),
      ...document.querySelectorAll('.spatial-detail-card .media-frame'),
      ...document.querySelectorAll('.aksara-canvas-card')
    ];
    mediaTargets.forEach((el) => el.classList.add('reveal-media'));

    // 5. Staggered Groups of Cultural Cards
    const groupPillars = Array.from(document.querySelectorAll('.pillars-grid .pillar-card'));
    const groupSitus = Array.from(document.querySelectorAll('#situsGrid .situs-card'));
    const groupGalleryTop = Array.from(document.querySelectorAll('.gallery-etno-row--top .gallery-etno-card'));
    const groupGalleryBottom = Array.from(document.querySelectorAll('.gallery-etno-row--bottom .gallery-etno-card'));
    const groupEraCards = Array.from(document.querySelectorAll('.era-cards-grid .era-card'));
    const groupPetaStats = Array.from(document.querySelectorAll('.peta-stats .peta-stat'));
    const groupAksaraSidebar = Array.from(document.querySelectorAll('.aksara-sidebar > *'));
    const groupGlosarium = Array.from(document.querySelectorAll('.glosarium-grid .glosarium-card'));
    const groupTeaserStats = Array.from(document.querySelectorAll('.teaser-stats .teaser-stat'));
    const groupPetaChips = Array.from(document.querySelectorAll('.peta-filters .peta-chip'));
    const groupAksaraTags = Array.from(document.querySelectorAll('.aksara-tags-wrap .aksara-tag'));

    function applyStagger(elements, stepMs, baseClass = 'reveal-card') {
      elements.forEach((el, idx) => {
        el.classList.add(baseClass);
        el.style.setProperty('--reveal-delay', `${idx * stepMs}ms`);
      });
    }

    // Storytelling specific timing:
    // Tri Hita Karana pillars: Pawongan (0ms), Parhyangan (featured, 140ms), Palemahan (280ms)
    applyStagger(groupPillars, 140);
    applyStagger(groupSitus, 90);
    applyStagger(groupGalleryTop, 130);
    applyStagger(groupGalleryBottom, 110);
    applyStagger(groupEraCards, 110);
    applyStagger(groupPetaStats, 90);
    applyStagger(groupAksaraSidebar, 110);
    applyStagger(groupGlosarium, 60);
    applyStagger(groupTeaserStats, 100);
    applyStagger(groupPetaChips, 70, 'reveal-card');
    applyStagger(groupAksaraTags, 80, 'reveal-card');

    // 6. Section Containers & Consoles
    const sectionContainers = [
      ...document.querySelectorAll('.marquee-viewport'),
      ...document.querySelectorAll('.tabuh-console'),
      ...document.querySelectorAll('.kotekan-wrapper'),
      ...document.querySelectorAll('.ombak-grid'),
      ...document.querySelectorAll('.stage-diagram'),
      ...document.querySelectorAll('.spatial-detail-card'),
      ...document.querySelectorAll('.peta-map-frame'),
      ...document.querySelectorAll('.peta-panel'),
      ...document.querySelectorAll('.aksara-workspace'),
      ...document.querySelectorAll('.site-footer .footer-top'),
      ...document.querySelectorAll('.gallery-meta-row')
    ];
    sectionContainers.forEach((el) => el.classList.add('reveal-item'));

    // Consolidate all elements to observe
    const allRevealElements = [
      ...headingTargets,
      ...eyebrowTargets,
      ...descTargets,
      ...mediaTargets,
      ...groupPillars,
      ...groupSitus,
      ...groupGalleryTop,
      ...groupGalleryBottom,
      ...groupEraCards,
      ...groupPetaStats,
      ...groupAksaraSidebar,
      ...groupGlosarium,
      ...groupTeaserStats,
      ...groupPetaChips,
      ...groupAksaraTags,
      ...sectionContainers
    ];

    if (!allRevealElements.length) return;

    // Set high-level trigger class
    document.documentElement.classList.add('has-reveal');

    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            el.classList.add('is-revealed');
            obs.unobserve(el);

            // Animate any numeric stats located inside this card/section
            const statNumbers = el.querySelectorAll(
              '.stat-card__number, .teaser-stat__value, .stat-pill__value, .peta-stat-num'
            );
            statNumbers.forEach((numEl) => animateCounter(numEl));

            // Clear temporary reveal delay after entrance finishes so hover states are immediate
            const cleanUp = () => {
              el.style.removeProperty('--reveal-delay');
              el.removeEventListener('transitionend', onEnd);
            };

            const onEnd = (e) => {
              if (e.target === el && (e.propertyName === 'opacity' || e.propertyName === 'transform')) {
                cleanUp();
              }
            };

            el.addEventListener('transitionend', onEnd);
            setTimeout(cleanUp, 1100);
          }
        });
      },
      {
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.12
      }
    );

    const vh = window.innerHeight || document.documentElement.clientHeight;
    allRevealElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      // If already in visible viewport at load or above scroll position, reveal immediately
      if (rect.top < vh && rect.bottom > 0) {
        el.classList.add('is-revealed');
        const statNumbers = el.querySelectorAll(
          '.stat-card__number, .teaser-stat__value, .stat-pill__value, .peta-stat-num'
        );
        statNumbers.forEach((numEl) => animateCounter(numEl));

        setTimeout(() => {
          el.style.removeProperty('--reveal-delay');
        }, 850);
      } else {
        revealObserver.observe(el);
      }
    });

    // Safety fallback: ensure every element is completely visible even in edge cases
    setTimeout(() => {
      allRevealElements.forEach((el) => {
        if (!el.classList.contains('is-revealed')) {
          el.classList.add('is-revealed');
          el.style.removeProperty('--reveal-delay');
          try {
            revealObserver.unobserve(el);
          } catch (_) { }
        }
      });
    }, 3200);
  }

  /* ==========================================================================
     6. SUBTLE SCROLL PARALLAX ENGINE (NON-INTRUSIVE & HIGH-PERFORMANCE)
     ========================================================================== */
  function setupScrollParallax() {
    if (isReducedMotion()) return;
    if (window.innerWidth <= 768) return; // Keep mobile native and smooth

    const parallaxTargets = [
      ...document.querySelectorAll('.hero__bg img'),
      ...document.querySelectorAll('.gamelan-hero__bg img'),
      ...document.querySelectorAll('.teaser-section .teaser-media img')
    ];

    if (!parallaxTargets.length) return;

    let ticking = false;

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateParallax();
          ticking = false;
        });
        ticking = true;
      }
    }

    function updateParallax() {
      const vh = window.innerHeight || document.documentElement.clientHeight;

      parallaxTargets.forEach((img) => {
        const frame = img.closest('.hero__bg, .gamelan-hero__bg, .teaser-media') || img.parentElement;
        if (!frame) return;

        const rect = frame.getBoundingClientRect();
        // Only compute if within or entering viewport
        if (rect.bottom > 0 && rect.top < vh) {
          const centerOffset = rect.top + rect.height / 2 - vh / 2;
          const speed = frame.classList.contains('hero__bg') || frame.classList.contains('gamelan-hero__bg') ? 0.16 : 0.08;
          const translateY = Math.max(-24, Math.min(24, centerOffset * speed));
          img.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0) scale(1.05)`;
        }
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    updateParallax();
  }

  /* ==========================================================================
     INITIALIZATION ORCHESTRATION (SPLASH SCREEN COORDINATION)
     ========================================================================== */
  function isSplashScreenActive() {
    const splashEl = document.getElementById('splashScreen');
    if (!splashEl) return false;

    // Suppressed or disabled
    if (document.documentElement.classList.contains('splash-screen--disabled')) return false;
    if (splashEl.classList.contains('splash-screen--disabled') || splashEl.classList.contains('splash-screen--hidden')) return false;

    // Inline style suppression
    if (splashEl.style.display === 'none') return false;

    // Computed style check
    try {
      const comp = window.getComputedStyle(splashEl);
      if (comp.display === 'none' || comp.visibility === 'hidden' || parseFloat(comp.opacity) === 0) {
        return false;
      }
    } catch (_) {}

    return true;
  }

  function startSiteMotion() {
    prepareHeadingMasks();
    setupMarquees();
    activateHero();
    setupScrollReveals();
    setupScrollParallax();
  }

  function initMotionSystem() {
    if (isReducedMotion()) {
      startSiteMotion();
      return;
    }

    if (isSplashScreenActive()) {
      // Hold hero and heading masks in their initial unrevealed states
      prepareHeroInitialState();
      prepareHeadingMasks();

      let motionStarted = false;
      const onSplashDismissed = () => {
        if (motionStarted) return;
        motionStarted = true;
        window.removeEventListener('nbh-splash-dismissed', onSplashDismissed);

        // Run animations after splash screen starts fading out
        setTimeout(() => {
          startSiteMotion();
        }, 120);
      };

      window.addEventListener('nbh-splash-dismissed', onSplashDismissed);

      // Robust fallback if splash auto-dismiss event is missed
      setTimeout(() => {
        if (!motionStarted) onSplashDismissed();
      }, 3500);
    } else {
      // Direct start when splash screen is not active
      requestAnimationFrame(() => {
        setTimeout(startSiteMotion, 50);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMotionSystem);
  } else {
    initMotionSystem();
  }
})();
