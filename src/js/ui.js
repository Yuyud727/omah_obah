/* =============================================================================
   INTERAKSI UI — navbar, menu mobile, accordion, modal, form, tombol WA
   ========================================================================== */

/* --- Modal (dipakai showreel & detail karya) ------------------------------ */
let lastFocused = null;

export function openModal(modal) {
  lastFocused = document.activeElement;
  modal.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => modal.classList.add('is-open'));
  modal.querySelector('.modal-close')?.focus();
}

export function closeModal(modal) {
  modal.classList.remove('is-open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => {
    modal.hidden = true;
    // Hentikan video kalau nanti Anda pasang tag <video>
    modal.querySelectorAll('video').forEach((v) => v.pause());
    lastFocused?.focus();
  }, 350);
}

function initModals() {
  document.querySelectorAll('.modal').forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.closest('.modal-close') || e.target.closest('[data-close-modal]')) {
        closeModal(modal);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.modal.is-open').forEach((m) => closeModal(m));
  });

  document.getElementById('play-reel')?.addEventListener('click', () => {
    const reel = document.getElementById('reel-modal');
    if (reel) openModal(reel);
  });
}

/* --- Navbar --------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');

  const onScroll = () => {
    navbar?.classList.toggle('is-stuck', window.scrollY > 24);
    document.getElementById('wa-float')?.classList.toggle('is-visible', window.scrollY > 400);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Menu mobile */
  const closeMenu = () => {
    toggle?.classList.remove('is-open');
    menu?.classList.remove('is-open');
    menu?.setAttribute('aria-hidden', 'true');
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', 'Buka menu');
    document.body.classList.remove('no-scroll');
  };

  toggle?.addEventListener('click', () => {
    const isOpen = menu?.classList.toggle('is-open');
    toggle.classList.toggle('is-open', isOpen);
    menu?.setAttribute('aria-hidden', String(!isOpen));
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Tutup menu' : 'Buka menu');
    document.body.classList.toggle('no-scroll', isOpen);
  });

  menu?.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));

  /* Sorot menu sesuai section yang sedang dilihat */
  const links = [...document.querySelectorAll('.nav-link')];
  const sections = links
    .map((l) => document.querySelector(l.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((l) =>
            l.classList.toggle('is-active', l.getAttribute('href') === `#${entry.target.id}`)
          );
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((s) => spy.observe(s));
  }
}

/* --- Accordion FAQ -------------------------------------------------------- */
function initAccordion() {
  document.querySelectorAll('.acc-trigger').forEach((trigger) => {
    const panel = trigger.nextElementSibling;
    if (!panel) return;

    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      // Tutup yang lain (perilaku accordion tunggal)
      document.querySelectorAll('.acc-trigger').forEach((other) => {
        if (other === trigger) return;
        other.setAttribute('aria-expanded', 'false');
        other.nextElementSibling.style.height = '0px';
      });

      trigger.setAttribute('aria-expanded', String(!isOpen));
      panel.style.height = isOpen ? '0px' : `${panel.scrollHeight}px`;
      window.dispatchEvent(new Event('layout-changed'));
    });
  });

  // Jaga tinggi panel tetap benar saat layar diubah ukurannya
  window.addEventListener('resize', () => {
    document.querySelectorAll('.acc-trigger[aria-expanded="true"]').forEach((t) => {
      t.nextElementSibling.style.height = `${t.nextElementSibling.scrollHeight}px`;
    });
  });
}

/* --- Form kontak ----------------------------------------------------------
   MODE PENGIRIMAN — pilih salah satu:

   'demo'     : hanya menampilkan pesan sukses (tidak mengirim ke mana pun).
                Ini mode saat ini, supaya tidak ada data terkirim ke nomor palsu.
   'whatsapp' : membuka WhatsApp dengan isi form sudah terformat rapi.
                Paling praktis, tanpa backend. Ganti WA_NUMBER di bawah.
   'endpoint' : POST JSON ke URL Anda (Formspree, Web3Forms, API Laravel, dll).
                Isi ENDPOINT_URL di bawah.
   ------------------------------------------------------------------------- */
const FORM_MODE = 'demo';
const WA_NUMBER = '6281200000000';           // GANTI: nomor WhatsApp studio (tanpa +)
const ENDPOINT_URL = '';                      // GANTI kalau pakai mode 'endpoint'

function initForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const status = document.getElementById('form-status');

  const setError = (name, message) => {
    const el = form.querySelector(`[data-error-for="${name}"]`);
    if (el) el.textContent = message;
    el?.closest('.field')?.classList.toggle('has-error', Boolean(message));
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = '';
    status.className = 'form-status';

    const data = Object.fromEntries(new FormData(form).entries());

    // Honeypot: kalau terisi, hampir pasti bot. Diamkan saja.
    if (data.website) return;

    /* Validasi */
    let valid = true;
    ['nama', 'email', 'layanan', 'pesan'].forEach((f) => setError(f, ''));

    if (!data.nama?.trim()) { setError('nama', 'Nama wajib diisi.'); valid = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email || '')) {
      setError('email', 'Format email belum benar.'); valid = false;
    }
    if (!data.layanan) { setError('layanan', 'Pilih salah satu layanan.'); valid = false; }
    if (!data.pesan?.trim() || data.pesan.trim().length < 10) {
      setError('pesan', 'Ceritakan sedikit lebih detail (min. 10 karakter).'); valid = false;
    }
    if (!valid) {
      status.textContent = 'Ada isian yang perlu diperbaiki dulu.';
      status.classList.add('is-err');
      form.querySelector('.has-error input, .has-error select, .has-error textarea')?.focus();
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.classList.add('is-sending');
    btn.disabled = true;

    try {
      if (FORM_MODE === 'whatsapp') {
        const text = [
          `Halo Omah Obah, saya *${data.nama}*.`,
          data.perusahaan ? `Dari: ${data.perusahaan}` : '',
          `Email: ${data.email}`,
          data.whatsapp ? `WA: ${data.whatsapp}` : '',
          `Layanan: ${data.layanan}`,
          data.budget ? `Anggaran: ${data.budget}` : '',
          '',
          `Detail proyek:`,
          data.pesan,
        ].filter(Boolean).join('\n');
        window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
      } else if (FORM_MODE === 'endpoint') {
        const res = await fetch(ENDPOINT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Gagal mengirim');
      } else {
        // mode demo
        await new Promise((r) => setTimeout(r, 700));
        console.info('[Omah Obah] Isi form (mode demo, tidak dikirim):', data);
      }

      form.reset();
      status.textContent = 'Terima kasih! Brief Anda sudah kami terima. Kami balas maksimal 1x24 jam di hari kerja.';
      status.classList.add('is-ok');
    } catch (err) {
      status.textContent = 'Maaf, pengiriman gagal. Coba lagi atau hubungi kami lewat WhatsApp.';
      status.classList.add('is-err');
    } finally {
      btn.classList.remove('is-sending');
      btn.disabled = false;
    }
  });
}

/* --- Serba-serbi ---------------------------------------------------------- */
function initMisc() {
  // Warna avatar/foto dari data-hue
  document.querySelectorAll('[data-hue]').forEach((el) => {
    el.style.setProperty('--h', el.dataset.hue);
  });

  // Tahun otomatis di footer
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
}

export function initUI() {
  initNavbar();
  initModals();
  initAccordion();
  initForm();
  initMisc();
}
