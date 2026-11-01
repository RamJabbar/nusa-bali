

(function () {
  'use strict';

  var DEFAULT_CONFIG = {
    
    duration: 2850,
    
    fadeDuration: 550,
    
    storageKey: 'nbh_splash_seen'
  };

  var config = Object.assign({}, DEFAULT_CONFIG, window.NusaBaliSplashConfig || {});

  try {
    sessionStorage.removeItem(config.storageKey);
  } catch (_) {
    
  }

  function initSplashScreen() {
    var splash = document.getElementById('splashScreen');

    if (!splash) {
      try {
        sessionStorage.setItem(config.storageKey, 'true');
      } catch (_) { }
      return;
    }

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

    document.body.classList.add('splash-active');

    var isDismissed = false;

    function dismissSplash() {
      if (isDismissed) return;
      isDismissed = true;

      splash.classList.add('splash-screen--hiding');
      document.body.classList.remove('splash-active');
      document.body.classList.add('splash-dismissed');
      try {
        window.dispatchEvent(new CustomEvent('nbh-splash-dismissed'));
      } catch (_) { }

      setTimeout(function () {
        splash.classList.add('splash-screen--hidden');
        splash.setAttribute('aria-hidden', 'true');
        splash.style.display = 'none';
      }, config.fadeDuration);
    }

    var autoTimer = setTimeout(dismissSplash, config.duration);

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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSplashScreen);
  } else {
    initSplashScreen();
  }
})();
