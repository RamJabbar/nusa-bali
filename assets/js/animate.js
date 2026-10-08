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
          } catch (_) {}
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
        } catch (_) {}
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupMarquees);
  } else {
    setupMarquees();
  }
})();
