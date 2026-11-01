/**
 * Nusa Bali Heritage — Animated Cultural Splash Screen
 * 
 * Manages the opening splash animation, session state persistence via sessionStorage,
 * reduced motion accessibility, and smooth transition to the homepage.
 */

(function () {
  'use strict';

  var DEFAULT_CONFIG = {
    // Total display duration before fade out begins (ms) ~2.65 seconds
    duration: 2850,
    // Fade out transition duration (ms)
    fadeDuration: 550,
    // sessionStorage key to track visits in current browser session
    storageKey: 'nbh_splash_seen'
  };

  var config = Object.assign({}, DEFAULT_CONFIG, window.NusaBaliSplashConfig || {});

  // Clear any legacy suppression key to ensure splash screen plays on reload/visit
  try {
    sessionStorage.removeItem(config.storageKey);
  } catch (_) {
    // Graceful fallback if storage is inaccessible (e.g., restricted iframe)
  }

  function initSplashScreen() {
    var splash = document.getElementById('splashScreen');

    // If there is no splash element on this page (e.g. visited gamelan.html, tari.html, etc. directly)
    if (!splash) {
      try {
        sessionStorage.setItem(config.storageKey, 'true');
      } catch (_) { }
      return;
    }

    // Check for prefers-reduced-motion
    var prefersReducedMotion = false;
    try {
      prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (_) { }

    if (prefersReducedMotion) {
      try {
        sessionStorage.setItem(config.storageKey, 'true');
      } catch (_) { }
      splash.style.display = 'none';
      splash.setAttribute('aria-hidden', 'true');
      return;
    }

    // Prevent body scrolling while splash is active
    document.body.classList.add('splash-active');

    var isDismissed = false;

    function dismissSplash() {
      if (isDismissed) return;
      isDismissed = true;

      // Trigger smooth fade out
      splash.classList.add('splash-screen--hiding');
      document.body.classList.remove('splash-active');
      document.body.classList.add('splash-dismissed');
      try {
        window.dispatchEvent(new CustomEvent('nbh-splash-dismissed'));
      } catch (_) { }

      // Final cleanup after CSS transition finishes
      setTimeout(function () {
        splash.classList.add('splash-screen--hidden');
        splash.setAttribute('aria-hidden', 'true');
        splash.style.display = 'none';
      }, config.fadeDuration);
    }

    // Auto-dismiss after the prescribed cultural animation sequence
    var autoTimer = setTimeout(dismissSplash, config.duration);

    // Optional user interaction: tap or keypress to immediately proceed
    splash.addEventListener('click', function () {
      clearTimeout(autoTimer);
      dismissSplash();
    });

    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        clearTimeout(autoTimer);
        dismissSplash();
      }
    }, { once: true });
  }

  // Initialize as soon as DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSplashScreen);
  } else {
    initSplashScreen();
  }
})();
