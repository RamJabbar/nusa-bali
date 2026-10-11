// Nusa Bali Heritage — efek marquee bergulir halus & swipe interaktif

(function () {
  'use strict';

  function setupMarquees() {
    const motionPref = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionPref?.matches) return;

    const marqueeTracks = document.querySelectorAll('.marquee-track');
    marqueeTracks.forEach((track) => bindMarqueeTrack(track));
  }

  function bindMarqueeTrack(track) {
    const seedNodes = Array.from(track.children);
    if (!seedNodes.length) return;

    // Gandakan elemen agar looping tidak terputus
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

  function setupScrollReveals() {
    const motionPref = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionPref?.matches) return;

    if (!('IntersectionObserver' in window)) return;

    // Single elements to reveal on approach across all pages
    const singleTargets = [
      ...document.querySelectorAll('.section-head'),
      ...document.querySelectorAll('.gallery-header-wrap'),
      ...document.querySelectorAll('.teaser-section .teaser-media'),
      ...document.querySelectorAll('.teaser-section .teaser-content'),
      ...document.querySelectorAll('.marquee-viewport'),
      ...document.querySelectorAll('.tabuh-console'),
      ...document.querySelectorAll('.kotekan-wrapper'),
      ...document.querySelectorAll('.ombak-grid'),
      ...document.querySelectorAll('.stage-diagram'),
      ...document.querySelectorAll('.spatial-detail-card'),
      ...document.querySelectorAll('.peta-map-frame'),
      ...document.querySelectorAll('.peta-panel'),
      ...document.querySelectorAll('.aksara-workspace'),
      ...document.querySelectorAll('.glosarium-search-wrap'),
      ...document.querySelectorAll('.glosarium-grid'),
      ...document.querySelectorAll('.site-footer .footer-top')
    ];

    // Repeated card groups with staggered timing across all pages
    const groupPillars = Array.from(document.querySelectorAll('.pillars-grid .pillar-card'));
    const groupSitus = Array.from(document.querySelectorAll('#situsGrid .situs-card'));
    const groupGalleryTop = Array.from(document.querySelectorAll('.gallery-etno-row--top .gallery-etno-card'));
    const groupGalleryBottom = Array.from(document.querySelectorAll('.gallery-etno-row--bottom .gallery-etno-card'));
    const groupEraCards = Array.from(document.querySelectorAll('.era-cards-grid .era-card'));
    const groupPetaStats = Array.from(document.querySelectorAll('.peta-stats .peta-stat'));
    const groupAksaraSidebar = Array.from(document.querySelectorAll('.aksara-sidebar > *'));

    groupPillars.forEach((card, idx) => {
      card.style.setProperty('--reveal-delay', `${idx * 90}ms`);
    });

    groupSitus.forEach((card, idx) => {
      card.style.setProperty('--reveal-delay', `${idx * 80}ms`);
    });

    groupGalleryTop.forEach((card, idx) => {
      card.style.setProperty('--reveal-delay', `${idx * 110}ms`);
    });

    groupGalleryBottom.forEach((card, idx) => {
      card.style.setProperty('--reveal-delay', `${idx * 110}ms`);
    });

    groupEraCards.forEach((card, idx) => {
      card.style.setProperty('--reveal-delay', `${idx * 80}ms`);
    });

    groupPetaStats.forEach((card, idx) => {
      card.style.setProperty('--reveal-delay', `${idx * 90}ms`);
    });

    groupAksaraSidebar.forEach((card, idx) => {
      card.style.setProperty('--reveal-delay', `${idx * 110}ms`);
    });

    const allRevealElements = [
      ...singleTargets,
      ...groupPillars,
      ...groupSitus,
      ...groupGalleryTop,
      ...groupGalleryBottom,
      ...groupEraCards,
      ...groupPetaStats,
      ...groupAksaraSidebar
    ];

    if (!allRevealElements.length) return;

    // Progressive enhancement: only flag after elements exist and observer is active
    document.documentElement.classList.add('has-reveal');

    allRevealElements.forEach((el) => {
      el.classList.add('reveal-item');
    });

    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            el.classList.add('is-revealed');
            obs.unobserve(el);

            const cleanUp = () => {
              el.classList.remove('reveal-item');
              el.style.removeProperty('--reveal-delay');
              el.removeEventListener('transitionend', onEnd);
            };

            const onEnd = (e) => {
              if (e.target === el && (e.propertyName === 'opacity' || e.propertyName === 'transform')) {
                cleanUp();
              }
            };

            el.addEventListener('transitionend', onEnd);
            setTimeout(cleanUp, 1000);
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
        setTimeout(() => {
          el.classList.remove('reveal-item');
          el.style.removeProperty('--reveal-delay');
        }, 700);
      } else {
        revealObserver.observe(el);
      }
    });

    // Safety fallback: ensure every element is visible even in edge cases
    setTimeout(() => {
      allRevealElements.forEach((el) => {
        if (el.classList.contains('reveal-item')) {
          el.classList.add('is-revealed');
          el.classList.remove('reveal-item');
          el.style.removeProperty('--reveal-delay');
          revealObserver.unobserve(el);
        }
      });
    }, 3500);
  }

  function initAnimations() {
    setupMarquees();
    setupScrollReveals();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
  } else {
    initAnimations();
  }
})();
