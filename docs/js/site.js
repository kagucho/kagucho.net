/* ==================================================================
   kagucho.net — 画面の動き
   1. 左の柱の再生ヘッド（スクロール位置）
   2. いま見ているセクションの強調
   3. スクロールに合わせた要素の出現
   4. ヒーローの波形を画面外で止める（波形の動き自体は CSS）
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

  /* ---- 4. 波形の一時停止 ----
     波形は CSS アニメーション（layouts/partials/wave.html と site.css）。
     ヒーローが画面外にある間だけ、まとめて止める。 */
  var wave = document.getElementById('wave');
  if (wave && !reduce && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      var e = entries[entries.length - 1];   /* 同じ要素の通知がまとめて来たら最新を使う */
      wave.classList.toggle('is-paused', !e.isIntersecting);
    }).observe(wave);
  }
})();
