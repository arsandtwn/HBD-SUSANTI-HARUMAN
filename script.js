document.addEventListener('DOMContentLoaded', function () {
  const openBtn = document.getElementById('openInvitation');
  const lockscreen = document.getElementById('lockscreen');
  const bgMusic = document.getElementById('bgMusic');
  const countdown = document.getElementById('countdown');
  const musicControl = document.getElementById('musicControl');

  // SEMBUNYIKAN ikon musik pas awal
  musicControl.style.display = 'none';

  // Lock scroll body
  document.body.classList.add('locked');

  // Hitung mundur
  const targetDate = new Date('2025-09-15T00:00:00').getTime();

  const interval = setInterval(function () {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countdown.innerHTML = `UCAPAN AKAN TERBUKA DALAM   ${pad(days)}-HARI|${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

    if (distance < 0) {
      clearInterval(interval);
      countdown.innerHTML = 'UCAPAN SIAP DI BUKA';
      openBtn.style.display = 'inline-block';
    }
  }, 1000);

  function pad(n) {
    return n < 10 ? '0' + n : n;
  }

  openBtn.addEventListener('click', function () {
    lockscreen.style.display = 'none';
    document.body.classList.remove('locked');

    // HENTIKAN efek salju
    clearInterval(snowInterval);
    document.querySelectorAll('.snowflake').forEach((el) => el.remove());

    if (typeof initHeroSlider === 'function') {
      initHeroSlider();
    }

    // TAMPILKAN kontrol musik
    musicControl.style.display = 'block';

    if (bgMusic) {
      bgMusic.play();
      musicControl.classList.add('playing');
    }

    document.getElementById('main').scrollIntoView({ behavior: 'smooth' });
  });

  musicControl.addEventListener('click', function () {
    if (bgMusic.paused) {
      bgMusic.play();
      musicControl.classList.add('playing');
    } else {
      bgMusic.pause();
      musicControl.classList.remove('playing');
    }
  });

  // === RESET FORM WISHES + TAMBAH KE LIST ===
  const wishesForm = document.querySelector('.wishes-form');
  const wishesButton = wishesForm?.querySelector('button');
  const wishesList = document.getElementById('wishes-list');

  // --- LOAD dari localStorage saat page load ---
  function loadWishes() {
    const saved = JSON.parse(localStorage.getItem('wishes')) || [];
    saved.forEach((item) => {
      const newWish = document.createElement('div');
      newWish.classList.add('wish-item');
      newWish.innerHTML = `
        <p class="wish-message">"${item.message}"</p>
        <p class="wish-author">${item.name} - ${item.address}</p>
      `;
      wishesList.appendChild(newWish);
    });
  }

  loadWishes();

  // --- Simpan wishes baru ke localStorage ---
  if (wishesForm && wishesButton && wishesList) {
    wishesButton.addEventListener('click', function () {
      const inputs = wishesForm.querySelectorAll('input');
      const textarea = wishesForm.querySelector('textarea');

      const name = inputs[0].value.trim();
      const address = inputs[1].value.trim();
      const message = textarea.value.trim();

      if (name && address && message) {
        const newWish = {
          name: name,
          address: address,
          message: message,
        };

        // Buat elemen wish baru
        const wishElement = document.createElement('div');
        wishElement.classList.add('wish-item');
        wishElement.innerHTML = `
          <p class="wish-message">"${message}"</p>
          <p class="wish-author">${name} - ${address}</p>
        `;

        wishesList.prepend(wishElement);

        // Simpan ke LocalStorage
        const saved = JSON.parse(localStorage.getItem('wishes')) || [];
        saved.unshift(newWish);
        localStorage.setItem('wishes', JSON.stringify(saved));

        wishesForm.reset();
      } else {
        alert('Mohon isi semua kolom dulu ya!');
      }
    });
  }
});

// ===== SALJU =====
let snowInterval;

function createSnowflake() {
  const snowflake = document.createElement('div');
  snowflake.classList.add('snowflake');

  const size = Math.random() * 5 + 3;
  snowflake.style.width = `${size}px`;
  snowflake.style.height = `${size}px`;

  const duration = Math.random() * 3 + 4;
  snowflake.style.animationDuration = `${duration}s`;

  // Posisi awal di pojok kanan atas
  snowflake.style.top = `0px`;
  snowflake.style.right = `0px`;

  // Arah jatuh melengkung random
  const curve = Math.random() * -300 - 100;
  snowflake.style.setProperty('--x', `${curve}px`);

  document.querySelector('.snow-container')?.appendChild(snowflake);

  setTimeout(() => {
    snowflake.remove();
  }, duration * 1000);
}

// Mulai salju
snowInterval = setInterval(createSnowflake, 250);
