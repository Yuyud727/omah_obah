import { openModal } from './ui.js';

/* =============================================================================
   DATA KARYA
   -----------------------------------------------------------------------------
   GANTI seluruh isi array ini dengan proyek asli Anda.
   Untuk pakai gambar/video asli, tambahkan properti `image` (dan `video`),
   lalu lihat catatan di fungsi buildCard() di bawah.

   category : 'motion' | 'animasi' | 'ilustrasi' | 'branding' | 'grafis'
   gradient : warna placeholder — hapus saja kalau sudah pakai gambar asli
   ========================================================================== */
export const works = [
  {
    title: 'Kampanye Kopi Nusantara',
    category: 'motion',
    categoryLabel: 'Motion Graphic',
    client: 'Kopi Nusantara',
    year: '2025',
    scope: 'Motion, Storyboard',
    desc: 'Seri enam video pendek untuk peluncuran varian single origin. Setiap video menceritakan asal biji lewat transisi kemasan yang mengalir jadi peta.',
    gradient: 'linear-gradient(145deg, #FF4D17, #7A2409)',
    hasVideo: true,
  },
  {
    title: 'Si Gundul & Kawan',
    category: 'animasi',
    categoryLabel: 'Animasi 2D',
    client: 'Sinema Merdeka',
    year: '2025',
    scope: 'Karakter, Animasi 2D',
    desc: 'Pilot episode animasi anak berdurasi 7 menit. Desain karakter, rigging, sampai compositing akhir dikerjakan penuh di studio.',
    gradient: 'linear-gradient(145deg, #FFC53D, #8A5E05)',
    hasVideo: true,
  },
  {
    title: 'Ilustrasi Kemasan Rempah',
    category: 'ilustrasi',
    categoryLabel: 'Ilustrasi',
    client: 'Rasa Rempah',
    year: '2024',
    scope: 'Ilustrasi, Kemasan',
    desc: 'Dua belas ilustrasi tangan untuk lini rempah pilihan. Gaya goresan hangat yang membuat produk dikenali dari ujung lorong toko.',
    gradient: 'linear-gradient(145deg, #4ECB8F, #10402A)',
    hasVideo: false,
  },
  {
    title: 'Identitas Batik Larasati',
    category: 'branding',
    categoryLabel: 'Branding',
    client: 'Batik Larasati',
    year: '2024',
    scope: 'Logo, Guideline',
    desc: 'Identitas visual lengkap untuk rumah batik generasi ketiga: logo, palet, tipografi, sampai penerapan di label kain dan toko.',
    gradient: 'linear-gradient(145deg, #6C7BFF, #1B2166)',
    hasVideo: false,
  },
  {
    title: 'Bumper Sinema Merdeka',
    category: 'motion',
    categoryLabel: 'Motion Graphic',
    client: 'Sinema Merdeka',
    year: '2025',
    scope: 'Motion, Sound Design',
    desc: 'Bumper pembuka 8 detik yang tayang sebelum setiap film. Logo terurai jadi partikel seluloid lalu menyatu kembali.',
    gradient: 'linear-gradient(145deg, #FF6B9D, #6B1638)',
    hasVideo: true,
  },
  {
    title: 'Company Profile Bank Amanah',
    category: 'grafis',
    categoryLabel: 'Desain Grafis',
    client: 'Bank Amanah',
    year: '2024',
    scope: 'Layout, Infografis',
    desc: 'Company profile 48 halaman beserta sistem infografis yang bisa dipakai ulang tim internal untuk laporan tahunan berikutnya.',
    gradient: 'linear-gradient(145deg, #38BDF8, #0C3F5C)',
    hasVideo: false,
  },
  {
    title: 'Maskot Gerai Sehat',
    category: 'ilustrasi',
    categoryLabel: 'Ilustrasi',
    client: 'Gerai Sehat',
    year: '2023',
    scope: 'Karakter, Sticker Pack',
    desc: 'Maskot apotek yang ramah tanpa terkesan kekanakan, lengkap dengan 24 pose turunan untuk konten harian dan sticker chat.',
    gradient: 'linear-gradient(145deg, #F97316, #5C2708)',
    hasVideo: false,
  },
  {
    title: 'Explainer Telkom Digital',
    category: 'animasi',
    categoryLabel: 'Animasi 3D',
    client: 'Telkom Digital',
    year: '2025',
    scope: 'Animasi 3D, Render',
    desc: 'Video penjelas 90 detik soal infrastruktur serat optik, disederhanakan jadi perjalanan satu paket data yang mudah dimengerti.',
    gradient: 'linear-gradient(145deg, #A78BFA, #3B1E75)',
    hasVideo: true,
  },
  {
    title: 'Poster Festival Ramadan',
    category: 'grafis',
    categoryLabel: 'Desain Grafis',
    client: 'Pemkot Yogyakarta',
    year: '2024',
    scope: 'Poster, Materi Pameran',
    desc: 'Rangkaian poster dan materi pameran untuk festival kota, dengan sistem grid yang tetap konsisten di 14 ukuran cetak berbeda.',
    gradient: 'linear-gradient(145deg, #FBBF24, #7C4A03)',
    hasVideo: false,
  },
];

/* ========================================================================== */

function buildCard(work, index) {
  const btn = document.createElement('button');
  btn.className = 'work';
  btn.type = 'button';
  btn.dataset.category = work.category;
  btn.dataset.index = String(index);
  btn.setAttribute('aria-label', `Lihat detail karya ${work.title}`);

  // Untuk pakai gambar asli, ganti blok .work-thumb di bawah dengan:
  // <div class="work-thumb"><img src="${work.image}" alt="${work.title}" loading="lazy" /></div>
  btn.innerHTML = `
    <div class="work-thumb" style="background:${work.gradient}">
      <span class="work-index">${String(index + 1).padStart(2, '0')}</span>
      ${work.hasVideo ? '<span class="work-play" aria-hidden="true">▶</span>' : ''}
      <span class="work-shape"></span>
    </div>
    <div class="work-body">
      <p class="work-cat">${work.categoryLabel}</p>
      <h3 class="work-title">${work.title}</h3>
      <p class="work-meta">${work.client} · ${work.year}</p>
    </div>
  `;
  return btn;
}

export function initPortfolio() {
  const grid = document.getElementById('portfolio-grid');
  if (!grid) return;

  works.forEach((work, i) => grid.appendChild(buildCard(work, i)));

  /* --- Filter kategori --- */
  const filters = document.querySelectorAll('.filter');
  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      filters.forEach((f) => {
        f.classList.remove('is-active');
        f.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');

      const want = btn.dataset.filter;
      grid.querySelectorAll('.work').forEach((card) => {
        const match = want === 'all' || card.dataset.category === want;
        card.classList.toggle('is-hidden', !match);
      });

      // Beri tahu ScrollTrigger kalau tinggi halaman berubah
      window.dispatchEvent(new Event('layout-changed'));
    });
  });

  /* --- Modal detail karya --- */
  const modal = document.getElementById('work-modal');
  if (!modal) return;

  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.work');
    if (!card) return;
    const work = works[Number(card.dataset.index)];
    if (!work) return;

    document.getElementById('wm-visual').style.background = work.gradient;
    document.getElementById('wm-visual').innerHTML =
      `<span>${String(Number(card.dataset.index) + 1).padStart(2, '0')}</span>`;
    document.getElementById('wm-cat').textContent = work.categoryLabel;
    document.getElementById('wm-title').textContent = work.title;
    document.getElementById('wm-desc').textContent = work.desc;
    document.getElementById('wm-client').textContent = work.client;
    document.getElementById('wm-year').textContent = work.year;
    document.getElementById('wm-scope').textContent = work.scope;

    openModal(modal);
  });
}
