/* Interactive Isometric Voxel Diorama for Fangyu Homepage
   Zero dependencies · Canvas 2D · Real-time lighting, scenes, rotation & scale simulation */
(function () {
  var canvas = document.getElementById('fy-diorama');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var state = {
    scene: 'earth',   // earth | cyber | winter | moon | mars
    light: 'dusk',    // day | dusk | night
    scale: 1.0,       // 0.5 | 1 | 1.5 | 2
    rot: 0,           // 0, 1, 2, 3 (90-degree isometric rotations)
    t: 0,
    dragStartX: null
  };

  var GRID = 14;
  var hudPlace = document.getElementById('diorama-place');
  var hudStats = document.getElementById('diorama-stats');
  var hudAngle = document.getElementById('diorama-angle');

  var SCENE_META = {
    earth: {
      baseW: 1340, baseH: 1520,
      en: 'The Bund & Lujiazui · 31.2385°N 121.4925°E',
      zh: '上海外滩 — 陆家嘴 · 31.2385°N 121.4925°E',
      de: 'The Bund & Lujiazui · 31.2385°N 121.4925°E',
      pt: 'The Bund e Lujiazui · 31.2385°N 121.4925°E',
      es: 'The Bund y Lujiazui · 31.2385°N 121.4925°E',
      ja: '上海・外灘 — 陸家嘴 · 31.2385°N 121.4925°E',
      ko: '상하이 와이탄 — 루자쭈이 · 31.2385°N 121.4925°E'
    },
    cyber: {
      baseW: 1340, baseH: 1520,
      en: 'Cyber Neon Filter · Lujiazui Skyline (Pro)',
      zh: '赛博霓虹滤镜 · 陆家嘴天际线 (Pro)',
      de: 'Cyber-Neon-Filter · Skyline Lujiazui (Pro)',
      pt: 'Filtro Cyber Neon · Skyline Lujiazui (Pro)',
      es: 'Filtro Ciberneón · Skyline Lujiazui (Pro)',
      ja: 'サイバーネオン · 陸家嘴スカイライン (Pro)',
      ko: '사이버 네온 필터 · 루자쭈이 스카이라인 (Pro)'
    },
    winter: {
      baseW: 1340, baseH: 1520,
      en: 'Winter Snow Recipe · Frozen Waterfront',
      zh: '深冬雪景配方 · 冰封黄浦江',
      de: 'Winterschnee-Rezept · Vereiste Uferpromenade',
      pt: 'Receita Neve de Inverno · Orla Congelada',
      es: 'Receta Nieve Invernal · Ribera Helada',
      ja: '冬の瑞雪レシピ · 凍結した黄浦江',
      ko: '한겨울 설경 프리셋 · 얼어붙은 황푸강'
    },
    moon: {
      baseW: 512, baseH: 512,
      en: 'Moon Copernicus Crater · NASA LOLA (Pro)',
      zh: '月球哥白尼环形山 · NASA LOLA (Pro)',
      de: 'Mondkrater Kopernikus · NASA LOLA (Pro)',
      pt: 'Cratera Copérnico (Lua) · NASA LOLA (Pro)',
      es: 'Cráter Copérnico (Luna) · NASA LOLA (Pro)',
      ja: '月面コペルニクス・クレーター · NASA LOLA (Pro)',
      ko: '달 코페르니쿠스 크레이터 · NASA LOLA (Pro)'
    },
    mars: {
      baseW: 512, baseH: 512,
      en: 'Mars Valles Marineris · NASA MOLA (Pro)',
      zh: '火星水手峡谷 · NASA MOLA (Pro)',
      de: 'Mars Valles Marineris · NASA MOLA (Pro)',
      pt: 'Marte Valles Marineris · NASA MOLA (Pro)',
      es: 'Marte Valles Marineris · NASA MOLA (Pro)',
      ja: '火星マリネリス峡谷 · NASA MOLA (Pro)',
      ko: '화성 마리네리스 협곡 · NASA MOLA (Pro)'
    }
  };

  var HUD_TEXT = {
    en: { blk: ' blk · ', chunks: ' chunks', moon: '512 × 512 blocks · 200 m/blk · Low-G', mars: '512 × 512 blocks · 500 m/blk · 4× Relief', drag: ' · Drag to turn' },
    zh: { blk: ' 格 · ',   chunks: ' 区块',   moon: '512 × 512 格 · 200 m/格 · 低重力',    mars: '512 × 512 格 · 500 m/格 · 4× 起伏',    drag: ' · 拖拽旋转' },
    de: { blk: ' Blk · ', chunks: ' Chunks', moon: '512 × 512 Blöcke · 200 m/Blk · Low-G', mars: '512 × 512 Blöcke · 500 m/Blk · 4× Relief', drag: ' · Ziehen zum Drehen' },
    pt: { blk: ' blc · ', chunks: ' chunks', moon: '512 × 512 blocos · 200 m/blc · Baixa-G', mars: '512 × 512 blocos · 500 m/blc · 4× Relevo', drag: ' · Arraste para girar' },
    es: { blk: ' blq · ', chunks: ' chunks', moon: '512 × 512 bloques · 200 m/blq · Baja-G', mars: '512 × 512 bloques · 500 m/blq · 4× Relieve', drag: ' · Arrastra para girar' },
    ja: { blk: ' ブロック · ', chunks: ' チャンク', moon: '512 × 512 ブロック · 200 m/格 · 低重力', mars: '512 × 512 ブロック · 500 m/格 · 高低差 4×', drag: ' · ドラッグで回転' },
    ko: { blk: ' 블록 · ', chunks: ' 청크',   moon: '512 × 512 블록 · 200 m/블록 · 저중력', mars: '512 × 512 블록 · 500 m/블록 · 4× 기복', drag: ' · 드래그하여 회전' }
  };

  var COMPASS = ['N ↑', 'E →', 'S ↓', 'W ←'];

  function getLang() {
    var l = document.documentElement.getAttribute('data-lang') || 'en';
    return HUD_TEXT[l] ? l : 'en';
  }

  function updateHud() {
    var lang = getLang();
    var m = SCENE_META[state.scene];
    var htxt = HUD_TEXT[lang];
    if (hudPlace) hudPlace.textContent = m[lang] || m.en;
    if (hudStats) {
      var w = Math.round(m.baseW * (state.scene === 'moon' || state.scene === 'mars' ? 1 : state.scale));
      var h = Math.round(m.baseH * (state.scene === 'moon' || state.scene === 'mars' ? 1 : state.scale));
      var chunks = Math.ceil(w / 16) * Math.ceil(h / 16);
      if (state.scene === 'moon') {
        hudStats.textContent = htxt.moon;
      } else if (state.scene === 'mars') {
        hudStats.textContent = htxt.mars;
      } else {
        hudStats.textContent = w.toLocaleString() + ' × ' + h.toLocaleString() + htxt.blk + chunks.toLocaleString() + htxt.chunks;
      }
    }
    if (hudAngle) hudAngle.textContent = COMPASS[state.rot] + htxt.drag;
  }

  function shadeHex(hex, factor) {
    var n = parseInt(hex.slice(1), 16);
    var r = Math.max(0, Math.min(255, Math.round(((n >> 16) & 255) * factor)));
    var g = Math.max(0, Math.min(255, Math.round(((n >> 8) & 255) * factor)));
    var b = Math.max(0, Math.min(255, Math.round((n & 255) * factor)));
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }

  function tintRgb(hex, rMul, gMul, bMul) {
    var n = parseInt(hex.slice(1), 16);
    var r = Math.max(0, Math.min(255, Math.round(((n >> 16) & 255) * rMul)));
    var g = Math.max(0, Math.min(255, Math.round(((n >> 8) & 255) * gMul)));
    var b = Math.max(0, Math.min(255, Math.round((n & 255) * bMul)));
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }

  function getSkyBands() {
    if (state.scene === 'moon') {
      return ['#070A10', '#0A0F18', '#0E1522', '#121B2B', '#162033'];
    }
    if (state.scene === 'mars') {
      if (state.light === 'night') return ['#140C0F', '#1D1115', '#27171B', '#352024', '#432A2C'];
      if (state.light === 'day')   return ['#4E2D24', '#6E3E2E', '#90543C', '#B26E4E', '#C88966'];
      return ['#28171D', '#432528', '#643734', '#864C3F', '#A3654B'];
    }
    if (state.scene === 'cyber') {
      return ['#0A0E1B', '#10182E', '#162140', '#1E294D', '#28254A'];
    }
    if (state.light === 'day') {
      return ['#2D639E', '#3D76B4', '#508BC8', '#67A2DA', '#84BCEB'];
    }
    if (state.light === 'night') {
      return ['#0B101B', '#101829', '#162137', '#1D2B46', '#253554'];
    }
    // Dusk (PixelTheme.landscapeSky)
    return ['#1B2435', '#223049', '#2C3D5A', '#445370', '#6E6678', '#9C786B'];
  }

  function lightTint() {
    if (state.scene === 'cyber') return [0.76, 0.86, 1.08];
    if (state.light === 'day')   return [1.04, 1.03, 1.0];
    if (state.light === 'night') return [0.56, 0.64, 0.82];
    return [1.02, 0.91, 0.86]; // warm golden dusk
  }

  function buildWorld(scene) {
    var cells = [];
    for (var x = 0; x < GRID; x++) {
      cells[x] = [];
      for (var y = 0; y < GRID; y++) {
        cells[x][y] = { base: '#5E9E46', h: 1, type: 'ground', top: null, accent: null };
      }
    }

    if (scene === 'moon') {
      var cx = 6.5, cy = 6.5;
      for (var mx = 0; mx < GRID; mx++) {
        for (var my = 0; my < GRID; my++) {
          var d = Math.hypot(mx - cx, my - cy);
          var h = 2.0;
          if (d < 1.3) h = 2.6; // central peak
          else if (d < 3.6) h = 0.7 + (d / 3.6) * 0.6;
          else if (d < 5.3) h = 3.2 - Math.abs(d - 4.4) * 1.1; // crater rim
          else h = 1.6 + ((mx * 7 + my * 13) % 3) * 0.25;
          var shade = d < 3.6 ? '#6E7480' : (d < 5.2 ? '#9DA4B2' : '#858C9A');
          cells[mx][my] = { base: shade, h: Math.max(0.6, h), type: 'rock' };
        }
      }
      return cells;
    }

    if (scene === 'mars') {
      for (var rx = 0; rx < GRID; rx++) {
        for (var ry = 0; ry < GRID; ry++) {
          var canyon = Math.abs((rx + ry * 0.55) - 9.8);
          var mh;
          var col;
          if (canyon < 1.3) {
            mh = 0.6; col = '#6D3525';
          } else if (canyon < 2.6) {
            mh = 1.8; col = '#9A4B32';
          } else if (canyon < 4.0) {
            mh = 3.1; col = '#BC623D';
          } else {
            mh = 3.6 + ((rx * 5 + ry * 11) % 3) * 0.35;
            col = '#CC774B';
          }
          cells[rx][ry] = { base: col, h: mh, type: 'mars' };
        }
      }
      return cells;
    }

    // Earth / Cyber / Winter: Bund + Huangpu River + Lujiazui
    var isWinter = scene === 'winter';
    var isCyber = scene === 'cyber';

    for (var x2 = 0; x2 < GRID; x2++) {
      for (var y2 = 0; y2 < GRID; y2++) {
        var riverCenter = 5.4 + Math.sin(y2 * 0.34) * 1.25;
        var distRiver = Math.abs(x2 - riverCenter);

        if (distRiver < 1.55) {
          cells[x2][y2] = {
            base: isWinter ? '#89B8D8' : (isCyber ? '#142A48' : '#3278C4'),
            h: 0.45,
            type: 'water'
          };
        } else if (distRiver < 2.4) {
          // Waterfront promenade / road
          cells[x2][y2] = {
            base: isWinter ? '#D6E2EC' : (isCyber ? '#252B3B' : '#8D95A1'),
            h: 0.9,
            type: 'road'
          };
        } else {
          // Ground grass / plaza
          cells[x2][y2] = {
            base: isWinter ? '#DFE9F2' : (isCyber ? '#1C222F' : ((x2 + y2) % 2 === 0 ? '#5EA142' : '#529338')),
            h: 0.95,
            type: 'ground'
          };
        }
      }
    }

    // West bank: Bund heritage buildings & riverside park trees
    var westBuildings = [
      { x: 1, y: 2, h: 2.5, col: '#C4B397', roof: '#4F635B' },
      { x: 2, y: 2, h: 3.3, col: '#CDBCA0', roof: '#445850', clock: true }, // Customs House
      { x: 1, y: 4, h: 2.2, col: '#BFA98E', roof: '#5A4A42' },
      { x: 2, y: 5, h: 2.4, col: '#C7B49A', roof: '#54645B' },
      { x: 1, y: 7, h: 2.0, col: '#B7A287', roof: '#6A564B' },
      { x: 2, y: 8, h: 2.6, col: '#C9B89D', roof: '#4D5D55' },
      { x: 1, y: 10, h: 2.2, col: '#BDA88D', roof: '#594D46' }
    ];
    for (var i = 0; i < westBuildings.length; i++) {
      var wb = westBuildings[i];
      cells[wb.x][wb.y] = {
        base: isCyber ? '#2A3347' : wb.col,
        top: isWinter ? '#EAF2FA' : (isCyber ? '#1D2940' : wb.roof),
        h: wb.h,
        type: 'bldg',
        win: isCyber ? '#2CE6F5' : '#F6CC6B',
        crown: wb.clock ? '#D9A93A' : null
      };
    }

    // Park trees
    var trees = [[3, 1], [3, 3], [3, 7], [3, 10], [2, 11], [8, 11], [9, 12], [11, 2]];
    for (var ti = 0; ti < trees.length; ti++) {
      var tx = trees[ti][0], ty = trees[ti][1];
      if (cells[tx][ty].type === 'ground') {
        cells[tx][ty] = {
          base: isWinter ? '#DCE9F4' : (isCyber ? '#1D4D54' : '#3C7F2E'),
          h: 1.85,
          type: 'tree'
        };
      }
    }

    // East bank: Lujiazui supertalls + Oriental Pearl
    var eastTowers = [
      { x: 9,  y: 4,  h: 6.4, col: '#B7C9DC', top: '#E8F0F8', crown: '#D9A93A', win: '#FFE08A' }, // Jin Mao / gold crown
      { x: 11, y: 5,  h: 8.2, col: '#9CBAD6', top: '#DCEAF8', win: '#BCE2FF' },                   // Shanghai Tower
      { x: 11, y: 8,  h: 6.9, col: '#8BA8C4', top: '#CFDCE8', win: '#FFE08A' },                   // SWFC
      { x: 8,  y: 7,  h: 7.4, col: '#D2DCE6', top: '#E76F8B', type: 'pearl', win: '#FF7FA8' },    // Oriental Pearl
      { x: 10, y: 10, h: 4.5, col: '#A8B7C7', top: '#D4DEE8', win: '#F6CC6B' },
      { x: 12, y: 3,  h: 4.1, col: '#95A8BC', top: '#C7D3DF', win: '#F6CC6B' },
      { x: 12, y: 10, h: 3.6, col: '#8C9EB0', top: '#C0CCD8', win: '#F6CC6B' },
      { x: 9,  y: 2,  h: 3.4, col: '#9FB1C4', top: '#CFDCE8', win: '#F6CC6B' }
    ];
    for (var j = 0; j < eastTowers.length; j++) {
      var et = eastTowers[j];
      cells[et.x][et.y] = {
        base: isCyber ? '#1D293E' : et.col,
        top: isWinter ? '#EEF5FC' : (isCyber ? (et.type === 'pearl' ? '#FF4FD8' : '#25D8E8') : et.top),
        h: et.h,
        type: et.type || 'tower',
        win: isCyber ? (j % 2 === 0 ? '#30F2FF' : '#FF56D2') : et.win,
        crown: isCyber ? '#30F2FF' : (et.crown || null)
      };
    }

    return cells;
  }

  var cachedScene = null;
  var cachedCells = null;
  function getCells() {
    if (cachedScene !== state.scene) {
      cachedScene = state.scene;
      cachedCells = buildWorld(state.scene);
    }
    return cachedCells;
  }

  function rotCoord(x, y, rot) {
    var m = GRID - 1;
    if (rot === 1) return [y, m - x];
    if (rot === 2) return [m - x, m - y];
    if (rot === 3) return [m - y, x];
    return [x, y];
  }

  function drawIsoBlock(cx, cy, tileW, tileH, heightPx, topCol, leftCol, rightCol, outline) {
    var hw = tileW / 2;
    var hh = tileH / 2;
    var topY = cy - heightPx;

    // Top diamond
    ctx.beginPath();
    ctx.moveTo(cx, topY - hh);
    ctx.lineTo(cx + hw, topY);
    ctx.lineTo(cx, topY + hh);
    ctx.lineTo(cx - hw, topY);
    ctx.closePath();
    ctx.fillStyle = topCol;
    ctx.fill();

    // Left face
    ctx.beginPath();
    ctx.moveTo(cx - hw, topY);
    ctx.lineTo(cx, topY + hh);
    ctx.lineTo(cx, cy + hh);
    ctx.lineTo(cx - hw, cy);
    ctx.closePath();
    ctx.fillStyle = leftCol;
    ctx.fill();

    // Right face
    ctx.beginPath();
    ctx.moveTo(cx + hw, topY);
    ctx.lineTo(cx, topY + hh);
    ctx.lineTo(cx, cy + hh);
    ctx.lineTo(cx + hw, cy);
    ctx.closePath();
    ctx.fillStyle = rightCol;
    ctx.fill();

    if (outline) {
      ctx.strokeStyle = 'rgba(11,12,15,0.28)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, topY - hh);
      ctx.lineTo(cx + hw, topY);
      ctx.lineTo(cx + hw, cy);
      ctx.lineTo(cx, cy + hh);
      ctx.lineTo(cx - hw, cy);
      ctx.lineTo(cx - hw, topY);
      ctx.closePath();
      ctx.stroke();
    }
  }

  function drawWindows(cx, cy, tileW, tileH, heightPx, winCol) {
    var hw = tileW / 2;
    var hh = tileH / 2;
    var rows = Math.max(1, Math.floor(heightPx / 9));
    ctx.fillStyle = winCol;
    for (var r = 0; r < rows; r++) {
      var wy = cy - heightPx + 5 + r * 8.5;
      if (wy > cy - 3) break;
      // Left face dots
      for (var c = 0; c < 2; c++) {
        if ((r * 3 + c + Math.round(cx)) % 5 === 0) continue;
        var lx = cx - hw * 0.72 + c * (hw * 0.38);
        var ly = wy + (c * hh * 0.34);
        ctx.fillRect(Math.round(lx), Math.round(ly), 3, 4);
      }
      // Right face dots
      for (var c2 = 0; c2 < 2; c2++) {
        if ((r * 5 + c2 + Math.round(cy)) % 4 === 0) continue;
        var rx = cx + hw * 0.22 + c2 * (hw * 0.38);
        var ry = wy + hh * 0.42 - (c2 * hh * 0.34);
        ctx.fillRect(Math.round(rx), Math.round(ry), 3, 4);
      }
    }
  }

  function render() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    if (canvas.width !== Math.round(rect.width * dpr) || canvas.height !== Math.round(rect.height * dpr)) {
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var W = rect.width;
    var H = rect.height;

    // 1. Pixel sky bands
    var bands = getSkyBands();
    var bandH = Math.ceil(H / bands.length);
    for (var b = 0; b < bands.length; b++) {
      ctx.fillStyle = bands[b];
      ctx.fillRect(0, b * bandH, W, bandH + 1);
    }

    // Stars at night / dusk / moon / cyber
    if (state.light !== 'day' || state.scene === 'moon' || state.scene === 'cyber') {
      var starAlpha = (state.light === 'night' || state.scene === 'moon') ? 0.85 : 0.45;
      ctx.fillStyle = 'rgba(244, 239, 226,' + starAlpha + ')';
      var stars = [[0.11, 0.14], [0.22, 0.08], [0.34, 0.18], [0.58, 0.1], [0.76, 0.13], [0.87, 0.2], [0.16, 0.26], [0.82, 0.07], [0.46, 0.12]];
      for (var si = 0; si < stars.length; si++) {
        var twinkle = reducedMotion ? 1 : (0.7 + 0.3 * Math.sin(state.t * 2 + si * 1.9));
        ctx.globalAlpha = starAlpha * twinkle;
        ctx.fillRect(Math.round(stars[si][0] * W), Math.round(stars[si][1] * H), 3, 3);
      }
      ctx.globalAlpha = 1;
    }

    // Earth hanging in Moon sky, or pixel Sun/Moon + drifting pixel clouds
    if (state.scene === 'moon') {
      var ex = Math.round(W * 0.82), ey = Math.round(H * 0.2);
      ctx.fillStyle = '#3A76B5';
      ctx.fillRect(ex - 14, ey - 14, 28, 28);
      ctx.fillStyle = '#5CA84A';
      ctx.fillRect(ex - 8, ey - 8, 12, 8);
      ctx.fillRect(ex + 2, ey + 2, 8, 8);
      ctx.fillStyle = '#F4EFE2';
      ctx.fillRect(ex - 10, ey - 12, 16, 4);
    } else if (state.scene !== 'mars') {
      // Pixel clouds
      var drift = reducedMotion ? 0 : ((state.t * 9) % (W + 120)) - 60;
      ctx.fillStyle = state.light === 'night' || state.scene === 'cyber'
        ? 'rgba(130, 155, 195, 0.22)'
        : (state.light === 'dusk' ? 'rgba(244, 194, 154, 0.55)' : 'rgba(255, 255, 255, 0.82)');
      var c1x = ((W * 0.16 + drift) % (W + 90)) - 45;
      ctx.fillRect(Math.round(c1x), Math.round(H * 0.17), 56, 8);
      ctx.fillRect(Math.round(c1x + 12), Math.round(H * 0.17 - 6), 30, 6);

      var c2x = ((W * 0.72 + drift * 0.65) % (W + 100)) - 50;
      ctx.fillRect(Math.round(c2x), Math.round(H * 0.25), 48, 7);
      ctx.fillRect(Math.round(c2x + 8), Math.round(H * 0.25 - 5), 24, 5);
    }

    // 2. Isometric Diorama Geometry
    var tileW = Math.min(W / (GRID + 2.4), H / (GRID * 0.72));
    var tileH = tileW * 0.52;
    var unitH = tileW * 0.44;
    var bob = reducedMotion ? 0 : Math.sin(state.t * 1.4) * 2.5;
    var originX = W * 0.5;
    var originY = H * 0.55 + bob;

    var cells = getCells();
    var tint = lightTint();

    // Draw floating bedrock / dirt cross-section pedestal underneath the front edges
    var stoneCol = state.scene === 'mars' ? '#5E2B1E' : (state.scene === 'moon' ? '#494E59' : '#6A717E');
    var dirtCol  = state.scene === 'mars' ? '#8A422B' : (state.scene === 'moon' ? '#636976' : '#855A38');

    for (var gx = 0; gx < GRID; gx++) {
      for (var gy = 0; gy < GRID; gy++) {
        var rc = rotCoord(gx, gy, state.rot);
        var cell = cells[rc[0]][rc[1]];
        var sx = originX + (gx - gy) * (tileW / 2);
        var sy = originY + (gx + gy - GRID) * (tileH / 2);

        // Bedrock + soil skirt on visible front faces
        if (gx === GRID - 1 || gy === GRID - 1) {
          var skirtStone = unitH * 1.15;
          var skirtDirt = unitH * 0.85;
          drawIsoBlock(sx, sy + skirtStone + skirtDirt, tileW, tileH, skirtStone,
            tintRgb(stoneCol, tint[0], tint[1], tint[2]),
            tintRgb(stoneCol, tint[0] * 0.78, tint[1] * 0.78, tint[2] * 0.78),
            tintRgb(stoneCol, tint[0] * 0.62, tint[1] * 0.62, tint[2] * 0.62), false);
          drawIsoBlock(sx, sy + skirtDirt, tileW, tileH, skirtDirt,
            tintRgb(dirtCol, tint[0], tint[1], tint[2]),
            tintRgb(dirtCol, tint[0] * 0.82, tint[1] * 0.82, tint[2] * 0.82),
            tintRgb(dirtCol, tint[0] * 0.66, tint[1] * 0.66, tint[2] * 0.66), false);
        }

        // Main voxel column
        var hPx = cell.h * unitH;
        var topBase = cell.top || cell.base;
        var shimmer = 1;
        if (cell.type === 'water' && !reducedMotion) {
          shimmer = 0.94 + 0.1 * Math.sin(state.t * 3 + gx * 0.8 + gy * 0.6);
        }

        var topC   = tintRgb(topBase,   tint[0] * 1.08 * shimmer, tint[1] * 1.08 * shimmer, tint[2] * 1.08 * shimmer);
        var leftC  = tintRgb(cell.base, tint[0] * 0.84, tint[1] * 0.84, tint[2] * 0.84);
        var rightC = tintRgb(cell.base, tint[0] * 0.66, tint[1] * 0.66, tint[2] * 0.66);

        drawIsoBlock(sx, sy, tileW, tileH, hPx, topC, leftC, rightC, cell.type !== 'water');

        // Special crown or Oriental Pearl spheres
        if (cell.crown) {
          var crownH = unitH * 0.65;
          drawIsoBlock(sx, sy - hPx, tileW * 0.92, tileH * 0.92, crownH,
            tintRgb(cell.crown, 1.12, 1.1, 1.0),
            tintRgb(cell.crown, 0.88, 0.85, 0.78),
            tintRgb(cell.crown, 0.70, 0.66, 0.60), true);
        }

        if (cell.type === 'pearl') {
          var sphereCol = state.scene === 'cyber' ? '#FF4FD8' : '#E2698A';
          drawIsoBlock(sx, sy - hPx * 0.45, tileW * 1.15, tileH * 1.15, unitH * 0.95,
            tintRgb(sphereCol, 1.15, 1.05, 1.05),
            tintRgb(sphereCol, 0.85, 0.8, 0.85),
            tintRgb(sphereCol, 0.68, 0.62, 0.68), true);
          drawIsoBlock(sx, sy - hPx * 0.88, tileW * 0.82, tileH * 0.82, unitH * 0.7,
            tintRgb(sphereCol, 1.15, 1.05, 1.05),
            tintRgb(sphereCol, 0.85, 0.8, 0.85),
            tintRgb(sphereCol, 0.68, 0.62, 0.68), true);
          // Spire
          ctx.fillStyle = state.scene === 'cyber' ? '#30F2FF' : '#F4EFE2';
          ctx.fillRect(Math.round(sx - 1.5), Math.round(sy - hPx - unitH * 1.6), 3, Math.round(unitH * 1.4));
        }

        // Lit building windows at dusk / night / cyber
        if ((cell.type === 'tower' || cell.type === 'bldg') && (state.light !== 'day' || state.scene === 'cyber')) {
          drawWindows(sx, sy, tileW, tileH, hPx, cell.win || '#F6CC6B');
        }
      }
    }

    // Gentle snow particles in Winter mode
    if (state.scene === 'winter') {
      ctx.fillStyle = 'rgba(244, 249, 255, 0.8)';
      for (var f = 0; f < 22; f++) {
        var fx = ((f * 73 + state.t * (14 + (f % 3) * 6)) % W);
        var fy = ((f * 47 + state.t * (28 + (f % 4) * 8)) % H);
        ctx.fillRect(Math.round(fx), Math.round(fy), 3, 3);
      }
    }
  }

  function bindGroup(attr, key, activeClass) {
    var btns = document.querySelectorAll('[' + attr + ']');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function () {
        var val = this.getAttribute(attr);
        state[key] = key === 'scale' ? parseFloat(val) : val;
        for (var j = 0; j < btns.length; j++) {
          btns[j].classList.remove(activeClass);
        }
        this.classList.add(activeClass);
        updateHud();
        render();
      });
    }
  }

  bindGroup('data-scene', 'scene', 'is-on');
  bindGroup('data-light', 'light', 'is-on-gold');
  bindGroup('data-scale', 'scale', 'is-on-water');

  // Drag or click to rotate 90 deg
  var wrap = canvas.parentElement;
  if (wrap) {
    wrap.addEventListener('pointerdown', function (e) {
      state.dragStartX = e.clientX;
    });
    wrap.addEventListener('pointerup', function (e) {
      if (state.dragStartX === null) return;
      var dx = e.clientX - state.dragStartX;
      state.dragStartX = null;
      if (Math.abs(dx) < 12) {
        state.rot = (state.rot + 1) % 4;
      } else {
        state.rot = (state.rot + (dx > 0 ? 1 : 3)) % 4;
      }
      updateHud();
      render();
    });
  }

  window.addEventListener('fangyu:lang', updateHud);
  window.addEventListener('resize', render);

  updateHud();
  render();

  if (!reducedMotion) {
    var last = performance.now();
    function tick(now) {
      var dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      state.t += dt;
      render();
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
})();
