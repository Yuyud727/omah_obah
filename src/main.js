/* =============================================================================
   OMAH OBAH — entry point
   ========================================================================== */
import { initUI } from './js/ui.js';
import { initPortfolio } from './js/portfolio.js';
import { initAnimations, finishIntro } from './js/animations.js';

/* Pilihan terakhir: matikan semua animasi dan tampilkan halaman apa adanya. */
const showEverything = () => {
  document.documentElement.classList.remove('js-anim');
  const loader = document.getElementById('loader');
  if (loader) loader.style.display = 'none';
};

const loaderVisible = () => {
  const loader = document.getElementById('loader');
  return Boolean(loader) && loader.style.display !== 'none';
};

/* Jaring pengaman 1: kalau boot gagal total, halaman tetap tampil dalam 4 detik. */
const bootFailsafe = setTimeout(showEverything, 4000);

/* Jaring pengaman 2: loader tidak boleh menutupi halaman lebih dari 6 detik.
   Coba selesaikan intro dulu supaya animasi scroll tetap hidup; matikan
   semuanya hanya kalau itu pun gagal. Tidak dihitung selama tab tersembunyi,
   karena di tab latar belakang animasi memang sengaja ditunda. */
const armLoaderFailsafe = () => setTimeout(() => {
  if (document.hidden) { armLoaderFailsafe(); return; }
  if (!loaderVisible()) return;
  finishIntro();
  if (loaderVisible()) showEverything();
}, 6000);
armLoaderFailsafe();


function boot() {
  try {
    initUI();
    initPortfolio();
    initAnimations();
  } catch (err) {
    console.error('[Omah Obah] Gagal inisialisasi:', err);
    document.documentElement.classList.remove('js-anim');
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'none';
  } finally {
    clearTimeout(bootFailsafe);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
