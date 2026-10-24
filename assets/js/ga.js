// Google Analytics 4 (see privacy/). Loaded by every public page.
// gtag.js only loads on ai2033.taipei, so local copies, test runs and card renders send nothing;
// elsewhere gtag() still exists and just queues, so pages can call it unconditionally.
(function () {
  var ID = 'G-LFTW17K2XK';
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  if (!/(^|\.)ai2033\.taipei$/.test(location.hostname)) return;
  window.gtag('js', new Date());
  window.gtag('config', ID);
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
  document.head.appendChild(s);
})();
