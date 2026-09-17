/* =========================================================
   SHRI SHOBHA DENTAL & ENT CLINIC — SCRIPT
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Sticky header shrink ---------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 12);
    toggleScrollTop();
    highlightActiveNav();
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile hamburger menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('drawerBackdrop');

  function openDrawer() {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  hamburger.addEventListener('click', () => {
    drawer.classList.contains('open') ? closeDrawer() : openDrawer();
  });
  backdrop.addEventListener('click', closeDrawer);
  document.querySelectorAll('.mobile-link, .mobile-cta').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  /* ---------- Smooth scroll for in-page links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  /* ---------- Active nav highlighting ---------- */
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = Array.from(navLinks).map(link => document.querySelector(link.getAttribute('href')));

  function highlightActiveNav() {
    let currentIndex = 0;
    const scrollPos = window.scrollY + 130;
    sections.forEach((sec, i) => {
      if (sec && sec.offsetTop <= scrollPos) currentIndex = i;
    });
    navLinks.forEach((link, i) => link.classList.toggle('active-link', i === currentIndex));
  }

  /* ---------- Fade-up on scroll ---------- */
  const faders = document.querySelectorAll('.fade-up');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  faders.forEach(el => io.observe(el));

  /* ---------- Scroll to top button ---------- */
  const scrollTopBtn = document.getElementById('scrollTop');
  function toggleScrollTop() {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
  }
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Gallery filtering ---------- */
  const galleryTabs = document.querySelectorAll('.gallery-tab');
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      galleryTabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.dataset.filter;
      galleryItems.forEach(item => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.hidden = !show;
      });
    });
  });

  /* ---------- Gallery lightbox ---------- */
  const visibleItems = () => Array.from(galleryItems).filter(item => !item.hidden);
  const lightbox = document.getElementById('lightbox');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxPlaceholder = document.getElementById('lightboxPlaceholder');
  let currentImageIndex = 0;

  function openLightbox(index) {
    const items = visibleItems();
    if (!items.length) return;
    currentImageIndex = index;
    updateLightbox();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function updateLightbox() {
    const items = visibleItems();
    const item = items[currentImageIndex];
    const caption = item.dataset.caption || 'Clinic photo';
    const iconEl = item.querySelector('.gallery-placeholder i');
    lightboxCaption.textContent = caption;
    lightboxCounter.textContent = `${currentImageIndex + 1} / ${items.length}`;
    lightboxPlaceholder.innerHTML = iconEl ? iconEl.outerHTML : '<i class="fa-solid fa-image"></i>';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const items = visibleItems();
      const idx = items.indexOf(item);
      openLightbox(idx);
    });
  });

  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  document.getElementById('lightboxPrev').addEventListener('click', () => {
    const items = visibleItems();
    currentImageIndex = (currentImageIndex - 1 + items.length) % items.length;
    updateLightbox();
  });
  document.getElementById('lightboxNext').addEventListener('click', () => {
    const items = visibleItems();
    currentImageIndex = (currentImageIndex + 1) % items.length;
    updateLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') document.getElementById('lightboxPrev').click();
    if (e.key === 'ArrowRight') document.getElementById('lightboxNext').click();
  });

  /* ---------- Testimonial carousel ---------- */
  const reviewCards = document.querySelectorAll('.review-card');
  const dotsWrap = document.getElementById('reviewDots');
  let reviewIndex = 0;
  let carouselTimer;

  reviewCards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'review-dot';
    dot.setAttribute('aria-label', `Show review ${i + 1}`);
    dot.addEventListener('click', () => showReview(i));
    dotsWrap.appendChild(dot);
  });
  const dots = document.querySelectorAll('.review-dot');

  function showReview(index) {
    reviewIndex = (index + reviewCards.length) % reviewCards.length;
    reviewCards.forEach((card, i) => card.classList.toggle('active', i === reviewIndex));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === reviewIndex));
  }

  function nextReview() { showReview(reviewIndex + 1); }
  function prevReview() { showReview(reviewIndex - 1); }

  document.getElementById('reviewNext').addEventListener('click', () => { nextReview(); resetAutoplay(); });
  document.getElementById('reviewPrev').addEventListener('click', () => { prevReview(); resetAutoplay(); });

  function resetAutoplay() {
    clearInterval(carouselTimer);
    carouselTimer = setInterval(nextReview, 6000);
  }

  showReview(0);
  resetAutoplay();

  /* ---------- Appointment form validation ---------- */
  const form = document.getElementById('appointmentForm');
  const successMsg = document.getElementById('formSuccess');

  function setError(fieldId, message) {
    const errEl = document.getElementById(`err-${fieldId}`);
    const inputEl = document.getElementById(fieldId);
    if (errEl) errEl.textContent = message;
    if (inputEl) inputEl.classList.toggle('invalid', Boolean(message));
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const fullName = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const service = document.getElementById('service').value;
    const prefDate = document.getElementById('prefDate').value;
    const prefTime = document.getElementById('prefTime').value;

    if (fullName.length < 2) {
      setError('fullName', 'Please enter your full name.');
      valid = false;
    } else setError('fullName', '');

    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      setError('phone', 'Please enter a valid 10-digit phone number.');
      valid = false;
    } else setError('phone', '');

    if (!service) {
      setError('service', 'Please select a service.');
      valid = false;
    } else setError('service', '');

    if (!prefDate) {
      setError('prefDate', 'Please choose a date.');
      valid = false;
    } else setError('prefDate', '');

    if (!prefTime) {
      setError('prefTime', 'Please choose a time.');
      valid = false;
    } else setError('prefTime', '');

    if (!valid) {
      successMsg.hidden = true;
      return;
    }

    successMsg.hidden = false;
    successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    form.reset();
  });

  /* Initial call to set states on load */
  onScroll();
});
