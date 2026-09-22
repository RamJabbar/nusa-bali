/**
 * NUSA BALI HERITAGE — animate.js
 * Dependency-free infinite horizontal marquee module.
 */

(function () {
  'use strict';

  function initMarquees() {
    // Skip animation and cloning if user prefers reduced motion
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

    // Read speed in px/s from data-speed attribute (fallback to 40)
    const speedAttr = parseFloat(track.dataset.speed);
    const speed = isNaN(speedAttr) || speedAttr <= 0 ? 40 : speedAttr;

    let currentX = 0;
    let isPaused = false;
    let lastTimestamp = null;
    let touchResumeTimeout = null;

    // Pause / resume event handlers
    track.addEventListener('mouseenter', () => {
      isPaused = true;
    });

    track.addEventListener('mouseleave', () => {
      isPaused = false;
      lastTimestamp = null;
    });

    track.addEventListener('focusin', () => {
      isPaused = true;
    });

    track.addEventListener('focusout', () => {
      isPaused = false;
      lastTimestamp = null;
    });

    track.addEventListener('touchstart', () => {
      if (touchResumeTimeout) {
        clearTimeout(touchResumeTimeout);
        touchResumeTimeout = null;
      }
      isPaused = true;
    }, { passive: true });

    const handleTouchEnd = () => {
      if (touchResumeTimeout) {
        clearTimeout(touchResumeTimeout);
      }
      touchResumeTimeout = setTimeout(() => {
        isPaused = false;
        lastTimestamp = null;
      }, 1200);
    };

    track.addEventListener('touchend', handleTouchEnd, { passive: true });
    track.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    // Animation loop using requestAnimationFrame
    function loop(timestamp) {
      if (!lastTimestamp) {
        lastTimestamp = timestamp;
      }

      const delta = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      // Avoid large delta jump if browser tab becomes inactive and returns
      if (delta > 0 && delta < 0.2 && !isPaused) {
        currentX += speed * delta;
        const halfWidth = track.scrollWidth / 2;

        // Reset offset back to 0 when reaching half total scrollWidth (start of cloned set)
        if (halfWidth > 0 && currentX >= halfWidth) {
          currentX = 0;
        }

        track.style.transform = `translateX(-${currentX}px)`;
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
