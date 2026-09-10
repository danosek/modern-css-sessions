/* font-weight vs. "wght" — dvě měření, žádný dojem.
 *
 * 1) Má font vůbec osu? Skript stáhne .woff2 a přečte z něj seznam tabulek.
 *    Adresář tabulek leží ve woff2 nezkomprimovaný, takže na jeho projití
 *    stačí hlavička. Chybí-li v seznamu `fvar`, font neobsahuje žádnou osu
 *    a všechno nad jeho jediným řezem musí dopočítat prohlížeč.
 *
 * 2) Liší se dvě deklarované váhy na obrazovce? Skript vykreslí tentýž text
 *    tímtéž řezem a velikostí na canvas a sečte tmavost pixelů. Šířka by
 *    neposloužila: oba fonty mají pevné rozestupy, takže se s vahou nemění
 *    ani o pixel. Naopak u osy SPCG je šířka přesně to, co se měnit má —
 *    a tam se měří ona. */
(function () {
  'use strict';

  var FONTS = 'https://cdn.jsdelivr.net/gh/danosek/modern-css-sessions@main/shared/fonts/';
  var SWEEP_STEP = 25;

  /* Tagy tabulek podle specifikace WOFF2. Index 63 znamená, že tag
     následuje v adresáři jako čtyři bajty. */
  var TAGS = ('cmap,head,hhea,hmtx,maxp,name,OS/2,post,cvt ,fpgm,glyf,loca,prep,CFF ,VORG,EBDT,'
    + 'EBLC,gasp,hdmx,kern,LTSH,PCLT,VDMX,vhea,vmtx,BASE,GDEF,GPOS,GSUB,EBSC,JSTF,MATH,CBDT,CBLC,'
    + 'COLR,CPAL,SVG ,sbix,acnt,avar,bdat,bloc,bsln,cvar,fdsc,feat,fmtx,fvar,gvar,hsty,just,lcar,'
    + 'mort,morx,opbd,prop,trak,Zapf,Silf,Glat,Gloc,Feat,Sill').split(',');

  function tableTags(buffer) {
    var b = new Uint8Array(buffer);
    var count = (b[12] << 8) | b[13];
    var p = 48;
    var tags = [];

    function base128() {
      var v = 0;
      for (var i = 0; i < 5; i++) {
        var c = b[p++];
        v = (v * 128) + (c & 0x7f);
        if (!(c & 0x80)) break;
      }
      return v;
    }

    for (var i = 0; i < count; i++) {
      var flags = b[p++];
      var index = flags & 0x3f;
      var version = (flags >> 6) & 0x03;
      var tag;
      if (index === 63) {
        tag = String.fromCharCode(b[p], b[p + 1], b[p + 2], b[p + 3]);
        p += 4;
      } else {
        tag = TAGS[index];
      }
      base128();
      var glyfLoca = tag === 'glyf' || tag === 'loca';
      if (glyfLoca ? version === 0 : version !== 0) base128();
      tags.push(tag.trim());
    }
    return tags;
  }

  /* Spectro pojmenovává rodiny "soubor:role"; klíčem je část před dvojtečkou. */
  function familyOf(el) {
    return getComputedStyle(el).fontFamily.split(',')[0].replace(/["']/g, '').trim();
  }

  function fileOf(family) {
    return family.split(':')[0] + '.woff2';
  }

  var canvas = document.createElement('canvas');

  function inkOf(weight, size, family, text) {
    var font = weight + ' ' + size + 'px "' + family + '"';
    var pad = Math.ceil(size * 0.6);
    var ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.font = font;
    var w = Math.ceil(ctx.measureText(text).width) + pad * 2;
    var h = Math.ceil(size * 2.4);
    canvas.width = w;
    canvas.height = h;
    ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#000';
    ctx.font = font;
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(text, pad, Math.round(size * 1.7));
    var data = ctx.getImageData(0, 0, w, h).data;
    var ink = 0;
    for (var i = 0; i < data.length; i += 4) ink += (255 - data[i]) / 255;
    return ink;
  }

  function same(a, b) {
    return Math.abs(a - b) < Math.max(a, b) * 0.002;
  }

  /* Projede celý povolený rozsah font-weight a spočítá, kolik různých
     vykreslení z fontu vlastně vypadne — a mezi kterými vahami se mění. */
  function sweep(size, family, text) {
    var inks = [];
    var distinct = [];
    for (var w = 100; w <= 1000; w += SWEEP_STEP) {
      var ink = inkOf(w, size, family, text);
      inks.push({ weight: w, ink: ink });
      if (!distinct.some(function (d) { return same(d, ink); })) distinct.push(ink);
    }
    var min = Math.min.apply(null, distinct);
    var max = Math.max.apply(null, distinct);
    var lo = 100;
    var hi = 1000;
    inks.forEach(function (s) { if (same(s.ink, min)) lo = s.weight; });
    for (var i = 0; i < inks.length; i++) {
      if (same(inks[i].ink, max)) { hi = inks[i].weight; break; }
    }
    return { distinct: distinct.length, min: min, max: max, lo: lo, hi: hi };
  }

  function num(value, digits) {
    return value.toFixed(digits).replace('.', ',');
  }

  function renderings(n) {
    if (n === 1) return '1 různé vykreslení';
    if (n < 5) return n + ' různá vykreslení';
    return n + ' různých vykreslení';
  }

  function note(el, headline, detail) {
    el.textContent = '';
    var strong = document.createElement('strong');
    strong.textContent = headline;
    el.appendChild(strong);
    el.appendChild(document.createTextNode(detail));
  }

  var files = {};

  function fileLine(file) {
    var found = files[file];
    if (!found) return 'soubor ' + file + ' se nepodařilo přečíst';
    return file + ' · tabulky: ' + found.tags.join(' ') + ' · '
      + (found.fvar ? 'fvar je → font má osy' : 'fvar chybí → font nemá žádnou osu');
  }

  function hasAxis(file, fallback) {
    return files[file] ? files[file].fvar : fallback;
  }

  /* ── Dědičnost: computed hodnota a změřená šířka vykresleného boxu ── */
  function measureInherit() {
    var samples = document.querySelectorAll('.wa-inherit__sample');
    for (var i = 0; i < samples.length; i++) {
      var sample = samples[i];
      var out = sample.parentNode.querySelector('.wa-inherit__val');
      var cs = getComputedStyle(sample);
      out.textContent = 'fvs: ' + cs.fontVariationSettings
        + ' · font-weight: ' + cs.fontWeight
        + ' · šířka ' + num(sample.getBoundingClientRect().width, 1) + ' px';
    }
  }

  /* ── Dosah obou vlastností: computed hodnota proti obsahu souboru ── */
  function reportReach() {
    var files_ = document.querySelectorAll('[data-wa-file]');
    for (var i = 0; i < files_.length; i++) {
      files_[i].textContent = fileLine(files_[i].dataset.waFile);
    }

    var cells = document.querySelectorAll('[data-wa-computed]');
    for (var j = 0; j < cells.length; j++) {
      var out = cells[j];
      var sample = out.parentNode.querySelector('.wa-cell__sample');
      var file = fileOf(familyOf(sample));
      var axis = hasAxis(file, true);
      note(out, axis ? 'instance osy wght' : 'beze změny',
        'computed: ' + getComputedStyle(sample).fontVariationSettings + ' — '
        + (axis
          ? 'osa v souboru je, deklarace ji nastaví.'
          : 'soubor osu wght nemá, deklarace nemá co nastavit — a syntetické tučné nevyvolá nikdy.'));
    }
  }

  /* ── Žebřík vah: pokrytí inkoustem proti nejsvětlejšímu kroku řádku ── */
  function measureLadder() {
    var rows = document.querySelectorAll('.wa-ladder__row');
    for (var i = 0; i < rows.length; i++) {
      var steps = rows[i].querySelectorAll('.wa-ladder__step');
      var first = steps[0].querySelector('.wa-ladder__sample');
      var family = familyOf(first);
      var size = parseFloat(getComputedStyle(first).fontSize);
      var text = first.textContent;
      var data = sweep(size, family, text);
      var axis = hasAxis(fileOf(family), data.distinct > 2);

      rows[i].querySelector('[data-wa-sweep]').textContent =
        fileLine(fileOf(family)) + ' · sweep font-weight 100–1000 po ' + SWEEP_STEP + ': '
        + renderings(data.distinct) + ', '
        + (axis
          ? 'kresba se mění mezi ' + data.lo + ' a ' + data.hi
          : 'jediný zlom v ' + data.hi);

      for (var j = 0; j < steps.length; j++) {
        var sample = steps[j].querySelector('.wa-ladder__sample');
        var weight = parseInt(getComputedStyle(sample).fontWeight, 10);
        var ink = inkOf(weight, size, family, text);
        var verdict;
        if (!axis) {
          verdict = same(ink, data.min) ? 'jediný řez fontu' : 'syntetické tučné';
        } else if (weight < data.lo) {
          verdict = 'mimo osu → clamp na ' + data.lo;
        } else if (weight > data.hi) {
          verdict = 'mimo osu → clamp na ' + data.hi;
        } else {
          verdict = 'instance osy ' + weight;
        }
        steps[j].querySelector('.wa-ladder__num').textContent = weight;
        steps[j].querySelector('.wa-ladder__ink').textContent =
          'inkoust ' + num(ink / data.min, 3) + '×';
        steps[j].querySelector('.wa-ladder__read span:last-child').textContent = verdict;
      }
    }
  }

  function readFiles() {
    var wanted = ['departure-mono.woff2', 'ia-writer-quattro.woff2'];
    return Promise.all(wanted.map(function (file) {
      return fetch(FONTS + file)
        .then(function (r) { return r.arrayBuffer(); })
        .then(function (buffer) {
          var tags = tableTags(buffer);
          files[file] = { tags: tags, fvar: tags.indexOf('fvar') >= 0 };
        })
        .catch(function () { /* offline: osu odvodí sweep */ });
    }));
  }

  function loadFaces() {
    var families = {};
    var samples = document.querySelectorAll('.wa-cell__sample, .wa-ladder__sample, .wa-inherit__sample');
    for (var i = 0; i < samples.length; i++) families[familyOf(samples[i])] = true;
    return Promise.all(Object.keys(families).map(function (family) {
      return document.fonts.load('400 26px "' + family + '"');
    }));
  }

  document.fonts.ready
    .then(loadFaces)
    .then(readFiles)
    .then(function () {
      measureInherit();
      reportReach();
      measureLadder();
    });
})();
