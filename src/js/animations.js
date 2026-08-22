/* =============================================================================
   ANIMASI — GSAP + ScrollTrigger + Lenis
   Semua animasi otomatis dimatikan kalau pengunjung mengaktifkan
   "kurangi gerakan" di sistem operasinya.
   ========================================================================== */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* --- Smooth scroll -------------------------------------------------------- */
function initSmoothScroll() {
  if (reduceMotion) {
    initAnchors(null);
    return null;
  }

  const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  initAnchors(lenis);
  return lenis;
}

function initAnchors(lenis) {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(target, { offset: -70, duration: 1.15 });
      } else {
        target.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
    });
  });
}

/* --- Pecah heading jadi baris untuk animasi ------------------------------- */
function splitLines() {
  document.querySelectorAll('[data-reveal-lines]').forEach((el) => {
    const parts = el.innerHTML.split(/<br\s*\/?>/i);
    el.innerHTML = parts
      .map((part) => `<span class="reveal-line"><span>${part.trim()}</span></span>`)
      .join('');
  });
}

/* --- Loader + intro hero -------------------------------------------------- */
let introTl = null;

/** Memaksa animasi pembuka langsung ke frame terakhir.
 *  Dipakai jaring pengaman di main.js kalau intro tersendat. */
export function finishIntro() {
  if (introTl) { introTl.progress(1); return true; }
  return false;
}

function playIntro() {
  const loader = document.getElementById('loader');
  const bar = document.getElementById('loader-bar');

  if (reduceMotion) {
    if (loader) loader.style.display = 'none';
    document.documentElement.classList.remove('js-anim');
    return;
  }

  const tl = gsap.timeline();
  introTl = tl;

  /* Browser menahan requestAnimationFrame di tab yang tidak terlihat, jadi
     intro akan tersendat kalau situs dibuka di tab latar belakang.
     Tunda saja sampai pengunjung benar-benar melihat halamannya. */
  if (document.hidden) {
    tl.pause();
    document.addEventListener('visibilitychange', function onVisible() {
      if (document.hidden) return;
      document.removeEventListener('visibilitychange', onVisible);
      tl.play();
    });
  }

  tl.to(bar, { width: '100%', duration: 1.0, ease: 'power2.inOut' })
    .to('.loader-word', { y: -30, opacity: 0, duration: .45, stagger: .06, ease: 'power3.in' }, '-=0.15')
    .to(loader, {
      yPercent: -100,
      duration: .85,
      ease: 'expo.inOut',
      onComplete: () => { loader.style.display = 'none'; },
    }, '-=0.2')
    // Catatan: class `js-anim` sengaja TIDAK dihapus di sini.
    // Class itulah yang menahan elemen [data-reveal] tetap tersembunyi
    // sampai giliran scroll-nya tiba. Yang menghapusnya hanya jaring
    // pengaman di main.js, kalau terjadi error.
    .from('#navbar', { y: -60, opacity: 0, duration: .7, ease: 'power3.out' }, '-=0.5')
    .to('.hero-line-inner', { y: 0, duration: 1.05, stagger: .09, ease: 'expo.out' }, '-=0.65')
    .to('.hero-fade', { opacity: 1, y: 0, duration: .8, stagger: .1, ease: 'power3.out' }, '-=0.6')
    .from('.hero-kicker', { opacity: 0, y: 14, duration: .6, ease: 'power2.out' }, '-=0.9');
}

/* --- Reveal saat di-scroll ------------------------------------------------ */
function initReveals() {
  if (reduceMotion) return;

  // Elemen biasa
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: .85,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  // Heading per baris
  gsap.utils.toArray('[data-reveal-lines]').forEach((el) => {
    gsap.to(el.querySelectorAll('.reveal-line > span'), {
      y: 0,
      duration: 1,
      stagger: .1,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 86%', once: true },
    });
  });
}

/* --- Penghitung angka statistik ------------------------------------------- */
function initCounters() {
  gsap.utils.toArray('.stat-num').forEach((el) => {
    const target = Number(el.dataset.count || 0);
    const suffix = el.dataset.suffix || '';

    if (reduceMotion) {
      el.textContent = `${target}${suffix}`;
      return;
    }

    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 1.8,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => { el.textContent = `${Math.round(obj.val)}${suffix}`; },
    });
  });
}

/* --- Garis progres di section Proses -------------------------------------- */
function initProcessLine() {
  const track = document.getElementById('process-track');
  const progress = document.getElementById('process-progress');
  if (!track || !progress || reduceMotion) return;

  gsap.to(progress, {
    width: '100%',
    ease: 'none',
    scrollTrigger: {
      trigger: track,
      start: 'top 65%',
      end: 'bottom 75%',
      scrub: .6,
    },
  });
}

/* --- Parallax halus pada latar hero --------------------------------------- */
function initParallax() {
  if (reduceMotion) return;

  gsap.to('.hero-content', {
    y: 90,
    opacity: .35,
    ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: .5 },
  });

  gsap.to('#hero .bg-grid', {
    y: 120,
    ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 },
  });
}

/* --- Kartu karya masuk bergiliran ----------------------------------------- */
function initWorkCards() {
  if (reduceMotion) return;

  gsap.from('.work', {
    opacity: 0,
    y: 40,
    duration: .8,
    stagger: .08,
    ease: 'power3.out',
    scrollTrigger: { trigger: '#portfolio-grid', start: 'top 85%', once: true },
  });
}

/* ========================================================================== */
export function initAnimations() {
  splitLines();
  initSmoothScroll();
  playIntro();
  initReveals();
  initCounters();
  initProcessLine();
  initParallax();
  initWorkCards();

  // Hitung ulang posisi trigger kalau tinggi halaman berubah
  // (filter portofolio dibuka/tutup, accordion, font selesai dimuat)
  window.addEventListener('layout-changed', () => ScrollTrigger.refresh());
  if (document.fonts?.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
}
