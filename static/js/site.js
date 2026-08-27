/* ==================================================================
   kagucho.net — 画面の動き
   1. 左の柱の再生ヘッド（スクロール位置）
   2. いま見ているセクションの強調
   3. スクロールに合わせた要素の出現
   4. ヒーローの波形
   ================================================================== */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var narrow = window.matchMedia('(max-width:900px)');

  /* ---- 1. 再生ヘッド ---- */
  var ph = document.getElementById('playhead');

  function updatePlayhead() {
    if (!ph) return;
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var p = max > 0 ? h.scrollTop / max : 0;
    if (narrow.matches) {
      ph.style.width = (p * 100) + '%';
      ph.style.height = '2px';
    } else {
      ph.style.height = (p * 100) + '%';
      ph.style.width = '2px';
    }
  }

  /* ---- 2. 現在地の強調 ---- */
  var links = Array.prototype.slice.call(document.querySelectorAll('#railnav a'));
  var targets = links.map(function (a) {
    return document.querySelector(a.getAttribute('href'));
  });

  function updateNav() {
    var y = window.scrollY + window.innerHeight * 0.35;
    var current = -1;
    for (var i = 0; i < targets.length; i++) {
      if (targets[i] && targets[i].offsetTop <= y) current = i;
    }
    links.forEach(function (a, i) { a.classList.toggle('is-current', i === current); });
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      updatePlayhead();
      updateNav();
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---- 3. 出現 ---- */
  var revealables = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(revealables, function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    Array.prototype.forEach.call(revealables, function (el) { io.observe(el); });
  }

  /* ---- 4. 波形 ---- */
  var cv = document.getElementById('wave');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  var bars = [];
  var BAR_W = 3, GAP = 4;

  function sizeCanvas() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var r = cv.getBoundingClientRect();
    cv.width = Math.max(1, Math.floor(r.width * dpr));
    cv.height = Math.max(1, Math.floor(r.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.ceil(r.width / (BAR_W + GAP));
    bars = [];
    for (var i = 0; i < n; i++) {
      bars.push({
        base: 0.10 + Math.random() * 0.34,
        amp: 0.06 + Math.random() * 0.30,
        spd: 0.4 + Math.random() * 1.1,
        off: Math.random() * Math.PI * 2
      });
    }
  }

  function draw(t) {
    var r = cv.getBoundingClientRect();
    var w = r.width, h = r.height;
    ctx.clearRect(0, 0, w, h);
    var g = ctx.createLinearGradient(0, 0, w, 0);
    g.addColorStop(0, '#1E9C6F');
    g.addColorStop(1, '#42DCA3');
    ctx.fillStyle = g;
    for (var i = 0; i < bars.length; i++) {
      var b = bars[i];
      var v = b.base + (reduce
        ? b.amp * 0.5
        : b.amp * (0.5 + 0.5 * Math.sin(t * 0.0011 * b.spd + b.off)));
      var bh = Math.max(2, v * h);
      ctx.globalAlpha = 0.30 + v * 0.5;
      ctx.fillRect(i * (BAR_W + GAP), h - bh, BAR_W, bh);
    }
    ctx.globalAlpha = 1;
  }

  function loop(t) { draw(t); requestAnimationFrame(loop); }

  sizeCanvas();
  window.addEventListener('resize', sizeCanvas);
  if (reduce) { draw(0); } else { requestAnimationFrame(loop); }
})();
