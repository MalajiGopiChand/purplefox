const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#nav');

function closeMenu() {
  if (!navigation || !menuButton) return;
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  menuButton.textContent = '☰';
}

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const open = !navigation.classList.contains('open');
    navigation.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    menuButton.textContent = open ? '✕' : '☰';
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.header')) closeMenu();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navigation.classList.contains('open')) {
      closeMenu();
      menuButton.focus();
    }
  });

  window.matchMedia('(min-width: 901px)').addEventListener('change', e => {
    if (e.matches) closeMenu();
  });
}

// Hero Slide Controller
const slides = [...document.querySelectorAll('.hero-slide')];
let slideIndex = 0;
let slideInterval = null;

function setSlide(index) {
  if (!slides.length) return;
  slideIndex = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => slide.classList.toggle('active', i === slideIndex));
  const numEl = document.querySelector('#slide-number');
  if (numEl) numEl.textContent = `0${slideIndex + 1} / 0${slides.length}`;
}

if (slides.length > 1) {
  document.querySelectorAll('[data-slide]').forEach(button => {
    button.addEventListener('click', () => {
      setSlide(slideIndex + (button.dataset.slide === 'next' ? 1 : -1));
      resetAutoSlide();
    });
  });

  function startAutoSlide() {
    slideInterval = setInterval(() => {
      setSlide(slideIndex + 1);
    }, 5000);
  }

  function resetAutoSlide() {
    if (slideInterval) clearInterval(slideInterval);
    startAutoSlide();
  }

  const heroSec = document.querySelector('.hero');
  if (heroSec) {
    heroSec.addEventListener('mouseenter', () => clearInterval(slideInterval));
    heroSec.addEventListener('mouseleave', startAutoSlide);

    let heroTouchX = 0;
    heroSec.addEventListener('touchstart', e => {
      heroTouchX = e.changedTouches[0].clientX;
    }, { passive: true });

    heroSec.addEventListener('touchend', e => {
      const diffX = e.changedTouches[0].clientX - heroTouchX;
      if (Math.abs(diffX) > 45) {
        setSlide(slideIndex + (diffX < 0 ? 1 : -1));
        resetAutoSlide();
      }
    }, { passive: true });
  }

  startAutoSlide();
}

// Gallery Filtering & Lightbox
const galleryItems = [...document.querySelectorAll('.gallery-item')];

document.querySelectorAll('.filter').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(b => {
      const selected = b === button;
      b.classList.toggle('selected', selected);
      b.setAttribute('aria-pressed', String(selected));
    });
    const filterVal = button.dataset.filter;
    galleryItems.forEach(item => {
      item.hidden = filterVal !== 'All' && item.dataset.category !== filterVal;
    });
    const count = galleryItems.filter(i => !i.hidden).length;
    const statusEl = document.querySelector('.gallery-status');
    if (statusEl) {
      statusEl.textContent = `${count} inspiration image${count === 1 ? '' : 's'}`;
    }
  });
});

const lightbox = document.querySelector('#lightbox');
let currentImage = 0;
let visibleItems = [];
let opener = null;

function showImage(index) {
  if (!visibleItems.length) return;
  currentImage = (index + visibleItems.length) % visibleItems.length;
  const item = visibleItems[currentImage];
  const img = document.querySelector('#lightbox-image');
  const titleEl = document.querySelector('#lightbox-title');
  const countEl = document.querySelector('#image-count');

  if (img) {
    img.src = item.dataset.image;
    img.alt = item.dataset.alt || '';
  }
  if (titleEl) titleEl.textContent = item.dataset.title || '';
  if (countEl) countEl.textContent = `${currentImage + 1} / ${visibleItems.length}`;
}

if (lightbox) {
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      opener = item;
      visibleItems = galleryItems.filter(i => !i.hidden);
      showImage(visibleItems.indexOf(item));
      lightbox.showModal();
      document.body.style.overflow = 'hidden';
    });
  });

  const closeBtn = document.querySelector('.lightbox-close');
  if (closeBtn) closeBtn.addEventListener('click', () => lightbox.close());

  lightbox.addEventListener('close', () => {
    document.body.style.overflow = '';
    opener?.focus();
  });

  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');
  if (prevBtn) prevBtn.addEventListener('click', () => showImage(currentImage - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => showImage(currentImage + 1));

  lightbox.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      showImage(currentImage - 1);
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      showImage(currentImage + 1);
    }
  });

  let startX = 0;
  let startY = 0;
  lightbox.addEventListener('touchstart', e => {
    startX = e.changedTouches[0].clientX;
    startY = e.changedTouches[0].clientY;
  }, { passive: true });

  lightbox.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
      showImage(currentImage + (dx < 0 ? 1 : -1));
    }
  }, { passive: true });
}

// Enquiry Form Handling
const form = document.querySelector('#enquiry-form');
if (form) {
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  if (form.elements.date) {
    form.elements.date.min = today.toISOString().slice(0, 10);
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.reportValidity()) return;

    const d = new FormData(form);
    const phone = String(d.get('phone')).replace(/\D/g, '');
    if (phone.length < 10 || phone.length > 15) {
      form.elements.phone.setCustomValidity('Please enter a phone number with 10 to 15 digits.');
      form.elements.phone.reportValidity();
      return;
    }

    const lines = [
      'Hello Purple Fox Event Planners! I would like to plan an event.',
      '',
      `Name: ${d.get('name')}`,
      `Mobile: ${d.get('phone')}`,
      `Event: ${d.get('event')}`,
      `Preferred date: ${d.get('date')}`,
      `City / venue: ${d.get('location')}`
    ];
    if (d.get('guests')) lines.push(`Expected guests: ${d.get('guests')}`);
    if (d.get('budget')) lines.push(`Approximate budget: ${d.get('budget')}`);
    if (String(d.get('details')).trim()) lines.push(`Special requirements: ${d.get('details')}`);

    const waBtn = document.querySelector('.floating-wa');
    const base = waBtn ? waBtn.href.split('?')[0] : `https://wa.me/917075505617`;
    const link = base + '?text=' + encodeURIComponent(lines.join('\n'));

    const status = document.querySelector('#form-status');
    if (status) {
      status.replaceChildren();
      const fallback = document.createElement('a');
      fallback.href = link;
      fallback.target = '_blank';
      fallback.rel = 'noopener noreferrer';
      fallback.textContent = 'Your message is ready. Open WhatsApp to review and send it ↗';
      fallback.className = 'text-link';
      status.append(fallback);
    }
    window.open(link, '_blank', 'noopener,noreferrer');
  });

  if (form.elements.phone) {
    form.elements.phone.addEventListener('input', () => form.elements.phone.setCustomValidity(''));
  }
}
