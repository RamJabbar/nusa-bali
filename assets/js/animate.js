/**
 * NUSA BALI HERITAGE — animate.js
 * Dependency-free infinite horizontal marquee module with manual drag/swipe support.
 */

(function () {
  'use strict';

  function initMarquees() {
    // Skip animation if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion && prefersReducedMotion.matches) {
      return;
    }

    const tracks = document.querySelectorAll('.marquee-track');
    tracks.forEach((track) => setupMarqueeTrack(track));
  }

  function setupMarqueeTrack(track) {
    const originalChildren = Array.from(track.children);
    if (!originalChildren.length) return;

    // Clone children once and append to double content for seamless looping
    originalChildren.forEach((child) => {
      const clone = child.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      // Prevent tabbing to duplicated links/buttons inside cloned set
      clone.querySelectorAll('a, button, input, select, textarea').forEach((el) => {
        el.setAttribute('tabindex', '-1');
      });
      track.appendChild(clone);
    });

    const viewport = track.closest('.marquee-viewport') || track.parentElement;

    // Read speed in px/s from data-speed attribute (fallback to 40)
    const speedAttr = parseFloat(track.dataset.speed);
    const speed = isNaN(speedAttr) || speedAttr <= 0 ? 40 : speedAttr;

    let currentX = 0;
    let isPaused = false;
    let lastTimestamp = null;
    let resumeTimeout = null;

    // Drag state
    let isDragging = false;
    let hasDragged = false;
    let startX = 0;
    let startY = 0;
    let dragStartCurrentX = 0;
    let activePointerId = null;

    function wrapCurrentX() {
      const halfWidth = track.scrollWidth / 2;
      if (halfWidth > 0) {
        while (currentX < 0) currentX += halfWidth;
        while (currentX >= halfWidth) currentX -= halfWidth;
      }
    }

    function renderTransform() {
      track.style.transform = `translateX(-${currentX}px)`;
    }

    // Pointer events for manual dragging (mouse + touch)
    function onPointerDown(e) {
      // Only main button for mouse, or any touch
      if (e.pointerType === 'mouse' && e.button !== 0) return;

      isDragging = true;
      hasDragged = false;
      startX = e.clientX;
      startY = e.clientY;
      dragStartCurrentX = currentX;
      activePointerId = e.pointerId;
      isPaused = true;
      lastTimestamp = null;

      if (resumeTimeout) {
        clearTimeout(resumeTimeout);
        resumeTimeout = null;
      }

      track.classList.add('is-dragging');
      if (viewport) viewport.classList.add('is-dragging');
    }

    function onPointerMove(e) {
      if (!isDragging || e.pointerId !== activePointerId) return;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      if (!hasDragged) {
        // Horizontal drag threshold
        if (Math.abs(deltaX) > 6) {
          hasDragged = true;
          window.__justDragged = true;
          track.dataset.justDragged = 'true';
          if (viewport && viewport.setPointerCapture) {
            try {
              viewport.setPointerCapture(e.pointerId);
            } catch (err) {}
          }
        } else {
          return;
        }
      }

      if (hasDragged) {
        if (e.cancelable) {
          e.preventDefault();
        }
        currentX = dragStartCurrentX - deltaX;
        wrapCurrentX();
        renderTransform();
      }
    }

    function onPointerUp(e) {
      if (!isDragging || (activePointerId !== null && e.pointerId !== activePointerId)) return;

      isDragging = false;
      activePointerId = null;
      track.classList.remove('is-dragging');
      if (viewport) viewport.classList.remove('is-dragging');

      if (viewport && viewport.releasePointerCapture && viewport.hasPointerCapture && viewport.hasPointerCapture(e.pointerId)) {
        try {
          viewport.releasePointerCapture(e.pointerId);
        } catch (err) {}
      }

      if (hasDragged) {
        window.__justDragged = true;
        track.dataset.justDragged = 'true';
        setTimeout(() => {
          window.__justDragged = false;
          track.dataset.justDragged = 'false';
          hasDragged = false;
        }, 250);
      }

      // Smoothly resume auto-scroll after manual swipe if cursor is not hovering
      if (resumeTimeout) clearTimeout(resumeTimeout);
      resumeTimeout = setTimeout(() => {
        const isHovered = (viewport && viewport.matches(':hover')) || track.matches(':hover');
        const isFocused = track.matches(':focus-within');
        if (!isHovered && !isFocused) {
          isPaused = false;
          lastTimestamp = null;
        }
      }, 1500);
    }

    const targetEl = viewport || track;
    targetEl.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    // Prevent click opening modals right after a drag
    track.addEventListener('click', (e) => {
      if (hasDragged || track.dataset.justDragged === 'true' || window.__justDragged) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);

    // Pause on hover & focus
    track.addEventListener('mouseenter', () => {
      isPaused = true;
    });

    track.addEventListener('mouseleave', () => {
      if (!isDragging) {
        isPaused = false;
        lastTimestamp = null;
      }
    });

    track.addEventListener('focusin', () => {
      isPaused = true;
    });

    track.addEventListener('focusout', () => {
      if (!isDragging) {
        isPaused = false;
        lastTimestamp = null;
      }
    });

    // Animation loop using requestAnimationFrame
    function loop(timestamp) {
      if (!lastTimestamp) {
        lastTimestamp = timestamp;
      }

      const delta = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      // Only advance if delta is sane and marquee is not paused/dragging
      if (delta > 0 && delta < 0.2 && !isPaused && !isDragging) {
        currentX += speed * delta;
        wrapCurrentX();
        renderTransform();
      }

      requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMarquees);
  } else {
    initMarquees();
  }
})();
