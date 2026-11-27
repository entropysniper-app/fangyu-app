/* Fangyu GitHub Pages Multi-Language Engine
   Default language: English (en)
   Supported: en, zh, de, pt, es, ja, ko */
(function () {
  var SUPPORTED = ['en', 'zh', 'de', 'pt', 'es', 'ja', 'ko'];
  var HTML_LANG = {
    en: 'en',
    zh: 'zh-Hans',
    de: 'de',
    pt: 'pt',
    es: 'es',
    ja: 'ja',
    ko: 'ko'
  };
  var STORAGE_KEY = 'fangyu_site_lang';

  var COMMON = {
    zh: {
      'brand.name': '方舆',
      'nav.home': '产品主页',
      'nav.features': '核心特性',
      'nav.platforms': 'Apple 全生态',
      'nav.exports': '导出生态',
      'nav.pricing': '方舆 Pro',
      'nav.support': '技术支持',
      'nav.privacy': '隐私政策',
      'nav.terms': '使用条款与署名',
      'footer.brand': '方舆 · Fangyu',
      'footer.tagline': '独立开发的地理体素世界创作应用（Bundle ID: <code>com.entropysniper.fangyu</code>），支持 macOS、iOS、iPadOS 与 visionOS。',
      'footer.col.product': '产品',
      'footer.col.legal': '支持与合规',
      'footer.col.contact': '联系我们',
      'footer.exports': '8 种导出格式',
      'footer.manage_sub': '管理 App Store 订阅',
      'footer.back_home': '← 返回方舆主页',
      'footer.disclaimer': '<strong>免责声明：</strong>方舆为独立开发的地理体素创作应用，非 Minecraft 官方产品，未获 Mojang 或 Microsoft 认可或关联。',
      'footer.credits': '世界生成引擎采用开源的 <a href="https://github.com/louis-e/arnis" target="_blank" rel="noopener">Arnis</a>（Apache-2.0）。地理数据来自 OpenStreetMap 贡献者（ODbL）、Overture Maps Foundation、OpenFreeMap、Mapterhorn、EOX Sentinel-2 cloudless 及 NASA PDS / USGS。© 2026 Fangyu (entropysniper).'
    },
    de: {
      'brand.name': 'Fangyu',
      'nav.home': 'Startseite',
      'nav.features': 'Funktionen',
      'nav.platforms': 'Plattformen',
      'nav.exports': 'Exporte',
      'nav.pricing': 'Preise',
      'nav.support': 'Support',
      'nav.privacy': 'Datenschutz',
      'nav.terms': 'Nutzungsbedingungen',
      'footer.brand': 'Fangyu · 方舆',
      'footer.tagline': 'Unabhängiges geografisches Voxel-Studio (Bundle ID: <code>com.entropysniper.fangyu</code>) für macOS, iOS, iPadOS und visionOS.',
      'footer.col.product': 'Produkt',
      'footer.col.legal': 'Rechtliches & Support',
      'footer.col.contact': 'Kontakt',
      'footer.exports': '8 Exportformate',
      'footer.manage_sub': 'Abos im App Store verwalten',
      'footer.back_home': '← Zur Fangyu-Startseite',
      'footer.disclaimer': '<strong>Haftungsausschluss:</strong> Fangyu ist eine unabhängige geografische Voxel-App. KEIN OFFIZIELLES MINECRAFT-PRODUKT. NICHT VON MOJANG ODER MICROSOFT GENEHMIGT ODER MIT IHNEN VERBUNDEN.',
      'footer.credits': 'Basiert auf der Open-Source-Engine <a href="https://github.com/louis-e/arnis" target="_blank" rel="noopener">Arnis</a> (Apache-2.0). Geodaten von OpenStreetMap-Mitwirkenden (ODbL), Overture Maps Foundation, OpenFreeMap, Mapterhorn, EOX Sentinel-2 cloudless sowie NASA PDS / USGS. © 2026 Fangyu (entropysniper).'
    },
    pt: {
      'brand.name': 'Fangyu',
      'nav.home': 'Início',
      'nav.features': 'Recursos',
      'nav.platforms': 'Plataformas',
      'nav.exports': 'Exportação',
      'nav.pricing': 'Preços',
      'nav.support': 'Suporte',
      'nav.privacy': 'Privacidade',
      'nav.terms': 'Termos e Créditos',
      'footer.brand': 'Fangyu · 方舆',
      'footer.tagline': 'Estúdio independente de mundos voxel geográficos (Bundle ID: <code>com.entropysniper.fangyu</code>) para macOS, iOS, iPadOS e visionOS.',
      'footer.col.product': 'Produto',
      'footer.col.legal': 'Legal e Suporte',
      'footer.col.contact': 'Contato',
      'footer.exports': '8 Formatos de Exportação',
      'footer.manage_sub': 'Gerenciar Assinaturas',
      'footer.back_home': '← Voltar para a página inicial',
      'footer.disclaimer': '<strong>Aviso Legal:</strong> Fangyu é um estúdio independente de mundos voxel geográficos. NÃO É UM PRODUTO OFICIAL DO MINECRAFT. NÃO É APROVADO NEM ASSOCIADO À MOJANG OU À MICROSOFT.',
      'footer.credits': 'Impulsionado pelo motor de código aberto <a href="https://github.com/louis-e/arnis" target="_blank" rel="noopener">Arnis</a> (Apache-2.0). Dados geográficos de contribuidores do OpenStreetMap (ODbL), Overture Maps Foundation, OpenFreeMap, Mapterhorn, EOX Sentinel-2 cloudless e NASA PDS / USGS. © 2026 Fangyu (entropysniper).'
    },
    es: {
      'brand.name': 'Fangyu',
      'nav.home': 'Inicio',
      'nav.features': 'Funciones',
      'nav.platforms': 'Plataformas',
      'nav.exports': 'Exportar',
      'nav.pricing': 'Precios',
      'nav.support': 'Soporte',
      'nav.privacy': 'Privacidad',
      'nav.terms': 'Términos y Créditos',
      'footer.brand': 'Fangyu · 方舆',
      'footer.tagline': 'Estudio independiente de mundos vóxel geográficos (Bundle ID: <code>com.entropysniper.fangyu</code>) para macOS, iOS, iPadOS y visionOS.',
      'footer.col.product': 'Producto',
      'footer.col.legal': 'Legal y Soporte',
      'footer.col.contact': 'Contacto',
      'footer.exports': '8 Formatos de Exportación',
      'footer.manage_sub': 'Gestionar Suscripciones',
      'footer.back_home': '← Volver al inicio de Fangyu',
      'footer.disclaimer': '<strong>Aviso Legal:</strong> Fangyu es un estudio independiente de mundos vóxel geográficos. NO ES UN PRODUCTO OFICIAL DE MINECRAFT. NO ESTÁ APROBADO NI ASOCIADO CON MOJANG NI MICROSOFT.',
      'footer.credits': 'Impulsado por el motor de código abierto <a href="https://github.com/louis-e/arnis" target="_blank" rel="noopener">Arnis</a> (Apache-2.0). Datos geográficos de colaboradores de OpenStreetMap (ODbL), Overture Maps Foundation, OpenFreeMap, Mapterhorn, EOX Sentinel-2 cloudless y NASA PDS / USGS. © 2026 Fangyu (entropysniper).'
    },
    ja: {
      'brand.name': '方輿',
      'nav.home': 'ホーム',
      'nav.features': '主な機能',
      'nav.platforms': '対応環境',
      'nav.exports': '書き出し',
      'nav.pricing': '料金',
      'nav.support': 'サポート',
      'nav.privacy': 'プライバシー',
      'nav.terms': '利用規約・クレジット',
      'footer.brand': '方輿 · Fangyu',
      'footer.tagline': 'macOS・iOS・iPadOS・visionOS 対応の独立開発地理ボクセル制作アプリ（Bundle ID: <code>com.entropysniper.fangyu</code>）。',
      'footer.col.product': '製品',
      'footer.col.legal': 'サポート・法務',
      'footer.col.contact': 'お問い合わせ',
      'footer.exports': '8 種類の書き出し形式',
      'footer.manage_sub': 'App Store サブスクリプション管理',
      'footer.back_home': '← 方輿ホームへ戻る',
      'footer.disclaimer': '<strong>免責事項：</strong>方輿は独立開発の地理ボクセル制作アプリです。Minecraft 公式製品ではなく、Mojang または Microsoft の承認・提携を受けていません。',
      'footer.credits': 'ワールド生成エンジンにはオープンソースの <a href="https://github.com/louis-e/arnis" target="_blank" rel="noopener">Arnis</a>（Apache-2.0）を採用しています。地理データは OpenStreetMap 貢献者（ODbL）、Overture Maps Foundation、OpenFreeMap、Mapterhorn、EOX Sentinel-2 cloudless、NASA PDS / USGS を使用。© 2026 Fangyu (entropysniper).'
    },
    ko: {
      'brand.name': 'Fangyu',
      'nav.home': '홈',
      'nav.features': '주요 기능',
      'nav.platforms': '플랫폼',
      'nav.exports': '내보내기',
      'nav.pricing': '요금제',
      'nav.support': '지원',
      'nav.privacy': '개인정보',
      'nav.terms': '이용약관 및 출처',
      'footer.brand': 'Fangyu · 方舆',
      'footer.tagline': 'macOS, iOS, iPadOS 및 visionOS용 독립 개발 지리 복셀 월드 제작 앱 (Bundle ID: <code>com.entropysniper.fangyu</code>).',
      'footer.col.product': '제품',
      'footer.col.legal': '지원 및 정책',
      'footer.col.contact': '문의',
      'footer.exports': '8가지 내보내기 형식',
      'footer.manage_sub': 'App Store 구독 관리',
      'footer.back_home': '← Fangyu 홈으로 돌아가기',
      'footer.disclaimer': '<strong>면책 조항:</strong> Fangyu는 독립 개발된 지리 복셀 제작 앱입니다. Minecraft 공식 제품이 아니며 Mojang 또는 Microsoft의 승인이나 제휴를 받지 않았습니다.',
      'footer.credits': '오픈소스 <a href="https://github.com/louis-e/arnis" target="_blank" rel="noopener">Arnis</a>(Apache-2.0) 엔진을 사용합니다. 지리 데이터 출처: OpenStreetMap 기여자(ODbL), Overture Maps Foundation, OpenFreeMap, Mapterhorn, EOX Sentinel-2 cloudless, NASA PDS / USGS. © 2026 Fangyu (entropysniper).'
    }
  };

  var enText = {};
  var enHtml = {};
  var enMeta = { title: '', desc: '' };
  var snapshotted = false;
  var currentLang = 'en';

  function normalize(code) {
    if (!code) return null;
    var c = String(code).toLowerCase().split('-')[0];
    return SUPPORTED.indexOf(c) !== -1 ? c : null;
  }

  function detectLang() {
    try {
      var params = new URLSearchParams(window.location.search);
      var q = normalize(params.get('lang'));
      if (q) return q;
      var saved = normalize(window.localStorage.getItem(STORAGE_KEY));
      if (saved) return saved;
    } catch (_) {}
    return 'en'; // Always default to English
  }

  function snapshotEnglish() {
    if (snapshotted) return;
    snapshotted = true;
    enMeta.title = document.title;
    var metaDesc = document.querySelector('meta[name="description"]');
    enMeta.desc = metaDesc ? metaDesc.getAttribute('content') || '' : '';

    var tNodes = document.querySelectorAll('[data-t]');
    for (var i = 0; i < tNodes.length; i++) {
      var k = tNodes[i].getAttribute('data-t');
      if (!(k in enText)) enText[k] = tNodes[i].textContent;
    }
    var hNodes = document.querySelectorAll('[data-t-html]');
    for (var j = 0; j < hNodes.length; j++) {
      var hk = hNodes[j].getAttribute('data-t-html');
      if (!(hk in enHtml)) enHtml[hk] = hNodes[j].innerHTML;
    }
  }

  function lookup(lang, key, isHtml) {
    if (lang === 'en') return isHtml ? enHtml[key] : enText[key];
    var pagePacks = window.FANGYU_I18N_PACKS || {};
    var pageDict = pagePacks[lang];
    if (pageDict && Object.prototype.hasOwnProperty.call(pageDict, key)) {
      return pageDict[key];
    }
    var commonDict = COMMON[lang];
    if (commonDict && Object.prototype.hasOwnProperty.call(commonDict, key)) {
      return commonDict[key];
    }
    return isHtml ? enHtml[key] : enText[key];
  }

  function applyLang(lang, persist) {
    var target = normalize(lang) || 'en';
    currentLang = target;
    document.documentElement.setAttribute('data-lang', target);
    document.documentElement.setAttribute('lang', HTML_LANG[target] || 'en');

    if (snapshotted) {
      var tNodes = document.querySelectorAll('[data-t]');
      for (var i = 0; i < tNodes.length; i++) {
        var el = tNodes[i];
        var val = lookup(target, el.getAttribute('data-t'), false);
        if (val !== undefined) el.textContent = val;
      }
      var hNodes = document.querySelectorAll('[data-t-html]');
      for (var j = 0; j < hNodes.length; j++) {
        var hel = hNodes[j];
        var hval = lookup(target, hel.getAttribute('data-t-html'), true);
        if (hval !== undefined) hel.innerHTML = hval;
      }
      // Update title & meta description
      var pageId = document.body && document.body.getAttribute('data-page');
      var metaMap = (pageId && window.FANGYU_I18N_META_MAP && window.FANGYU_I18N_META_MAP[pageId]) || window.FANGYU_I18N_META || {};
      var pageMeta = metaMap[target];
      document.title = (pageMeta && pageMeta.title) ? pageMeta.title : enMeta.title;
      var metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', (pageMeta && pageMeta.desc) ? pageMeta.desc : enMeta.desc);
      }
      // Sync language select controls
      var selects = document.querySelectorAll('[data-lang-select]');
      for (var s = 0; s < selects.length; s++) {
        selects[s].value = target;
      }
    }

    if (persist) {
      try { window.localStorage.setItem(STORAGE_KEY, target); } catch (_) {}
    }

    window.dispatchEvent(new CustomEvent('fangyu:lang', { detail: { lang: target } }));
  }

  window.FANGYU_I18N = {
    SUPPORTED: SUPPORTED,
    getLang: function () { return currentLang; },
    setLang: function (lang) { applyLang(lang, true); }
  };

  var initial = detectLang();
  currentLang = initial;
  document.documentElement.setAttribute('data-lang', initial);
  document.documentElement.setAttribute('lang', HTML_LANG[initial] || 'en');

  document.addEventListener('DOMContentLoaded', function () {
    snapshotEnglish();
    applyLang(initial, false);
    var selects = document.querySelectorAll('[data-lang-select]');
    for (var s = 0; s < selects.length; s++) {
      selects[s].addEventListener('change', function () {
        applyLang(this.value, true);
      });
    }

    // Pixel Lightbox for all real in-app screenshots
    var zoomImgs = document.querySelectorAll('[data-zoom]');
    if (zoomImgs.length) {
      var lb = document.createElement('div');
      lb.className = 'fy-lightbox';
      lb.setAttribute('role', 'dialog');
      lb.setAttribute('aria-modal', 'true');
      lb.innerHTML =
        '<div class="fy-lightbox-box">' +
          '<img class="fy-lightbox-img" alt="" />' +
          '<div class="fy-lightbox-bar">' +
            '<span class="fy-lightbox-cap"></span>' +
            '<button type="button" class="fy-lightbox-close" aria-label="Close">✕ ESC</button>' +
          '</div>' +
        '</div>';
      document.body.appendChild(lb);
      var lbImg = lb.querySelector('.fy-lightbox-img');
      var lbCap = lb.querySelector('.fy-lightbox-cap');
      var lbClose = lb.querySelector('.fy-lightbox-close');

      function closeLb() { lb.classList.remove('is-open'); }
      lbClose.addEventListener('click', closeLb);
      lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLb(); });

      for (var zi = 0; zi < zoomImgs.length; zi++) {
        (function (img) {
          img.addEventListener('click', function () {
            lbImg.src = img.currentSrc || img.src;
            lbImg.alt = img.alt || '';
            var card = img.closest('article, li, .feat-card, .plat-card, .export-hero-shot');
            var h = card ? card.querySelector('h3') : null;
            lbCap.textContent = (h && h.textContent) ? h.textContent : (img.alt || '');
            lb.classList.add('is-open');
          });
        })(zoomImgs[zi]);
      }
    }
  });
})();
