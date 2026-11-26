/* Language detection & toggle (zh / en) with URL ?lang= and localStorage support */
(function () {
  var root = document.documentElement;
  var STORAGE_KEY = 'fangyu_site_lang';

  function detectLang() {
    try {
      var params = new URLSearchParams(window.location.search);
      var q = params.get('lang');
      if (q === 'en' || q === 'zh') return q;
      var saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'zh') return saved;
    } catch (_) {}
    var navLang = (navigator.language || 'zh-Hans').toLowerCase();
    return navLang.indexOf('zh') === 0 ? 'zh' : 'en';
  }

  function applyLang(lang, persist) {
    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', lang === 'zh' ? 'zh-Hans' : 'en');
    var buttons = document.querySelectorAll('[data-set-lang]');
    for (var i = 0; i < buttons.length; i++) {
      var b = buttons[i];
      var on = b.getAttribute('data-set-lang') === lang;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    }
    if (persist) {
      try { window.localStorage.setItem(STORAGE_KEY, lang); } catch (_) {}
    }
    window.dispatchEvent(new CustomEvent('fangyu:lang', { detail: { lang: lang } }));
  }

  var initial = detectLang();
  applyLang(initial, false);

  document.addEventListener('DOMContentLoaded', function () {
    applyLang(root.getAttribute('data-lang') || initial, false);
    var buttons = document.querySelectorAll('[data-set-lang]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', function () {
        applyLang(this.getAttribute('data-set-lang'), true);
      });
    }
  });
})();
