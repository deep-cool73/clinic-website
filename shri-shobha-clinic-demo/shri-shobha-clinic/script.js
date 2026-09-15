document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("siteHeader");
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const scrollTop = document.getElementById("scrollTop");
  const navLinks = [...document.querySelectorAll(".desktop-nav a, .mobile-menu a")];
  const sections = [...document.querySelectorAll("main section[id]")];

  // Sticky header + scroll-to-top
  const onScroll = () => {
    header.classList.toggle("compact", window.scrollY > 20);
    scrollTop.classList.toggle("visible", window.scrollY > 550);

    const y = window.scrollY + 130;
    let current = "home";
    sections.forEach(section => {
      if (y >= section.offsetTop) current = section.id;
    });
    navLinks.forEach(link => {
      const href = link.getAttribute("href");
      link.classList.toggle("active", href === `#${current}`);
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  scrollTop.addEventListener("click", () => window.scrollTo({top: 0, behavior: "smooth"}));

  // Mobile navigation
  const closeMenu = () => {
    mobileMenu.classList.remove("open");
    mobileMenu.setAttribute("aria-hidden", "true");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  };

  menuToggle.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("open");
    mobileMenu.setAttribute("aria-hidden", String(!open));
    menuToggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("menu-open", open);
  });

  mobileMenu.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));

  // Smooth scrolling for internal links (works even when browser CSS smooth scrolling is unavailable)
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Reveal-on-scroll
  const revealEls = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObserver.observe(el));

  // Appointment form
  const form = document.getElementById("appointmentForm");
  const status = document.getElementById("formStatus");
  const dateInput = form.querySelector('input[name="date"]');
  const today = new Date();
  const isoToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split("T")[0];
  dateInput.min = isoToday;

  form.addEventListener("submit", event => {
    event.preventDefault();
    status.className = "form-status";
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").replace(/\D/g, "");
    const service = String(data.get("service") || "");
    const date = String(data.get("date") || "");
    const time = String(data.get("time") || "");

    if (name.length < 2) {
      showError("Please enter your full name.");
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      showError("Please enter a valid 10-digit phone number.");
      return;
    }
    if (!service || !date || !time) {
      showError("Please select a service, preferred date, and preferred time.");
      return;
    }

    status.className = "form-status success";
    status.textContent = "Thank you! Your appointment request has been prepared. Please contact the clinic on WhatsApp or phone to confirm your appointment.";
    form.reset();
    dateInput.min = isoToday;
  });

  function showError(message) {
    status.className = "form-status error";
    status.textContent = message;
  }

  // Testimonials
  const testimonials = [...document.querySelectorAll(".testimonial")];
  const dots = document.getElementById("reviewDots");
  let reviewIndex = 0;
  testimonials.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Show review ${i + 1}`);
    dot.addEventListener("click", () => setReview(i));
    dots.appendChild(dot);
  });

  function setReview(index) {
    reviewIndex = (index + testimonials.length) % testimonials.length;
    testimonials.forEach((card, i) => card.classList.toggle("active", i === reviewIndex));
    [...dots.children].forEach((dot, i) => dot.classList.toggle("active", i === reviewIndex));
  }
  document.getElementById("reviewPrev").addEventListener("click", () => setReview(reviewIndex - 1));
  document.getElementById("reviewNext").addEventListener("click", () => setReview(reviewIndex + 1));
  setReview(0);

  // Gallery filters + lightbox
  const galleryItems = [...document.querySelectorAll(".gallery-item")];
  const filterButtons = [...document.querySelectorAll(".filter-btn")];
  let visibleItems = galleryItems;
  let galleryIndex = 0;

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      filterButtons.forEach(b => b.classList.toggle("active", b === button));
      galleryItems.forEach(item => {
        const visible = filter === "all" || item.dataset.category === filter;
        item.hidden = !visible;
      });
      visibleItems = galleryItems.filter(item => !item.hidden);
      if (galleryIndex >= visibleItems.length) galleryIndex = 0;
    });
  });

  const lightbox = document.getElementById("lightbox");
  const lightboxArt = document.getElementById("lightboxArt");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxDescription = document.getElementById("lightboxDescription");
  const lightboxCounter = document.getElementById("lightboxCounter");

  function openLightbox(index) {
    if (!visibleItems.length) return;
    galleryIndex = (index + visibleItems.length) % visibleItems.length;
    const item = visibleItems[galleryIndex];
    const art = item.querySelector(".gallery-art");
    lightboxArt.className = `lightbox-art ${[...art.classList].filter(c => c !== "gallery-art").join(" ")}`;
    lightboxTitle.textContent = item.dataset.title;
    lightboxDescription.textContent = item.dataset.description;
    lightboxCounter.textContent = `${galleryIndex + 1} / ${visibleItems.length}`;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("menu-open");
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("menu-open");
  }

  galleryItems.forEach(item => item.addEventListener("click", () => {
    visibleItems = galleryItems.filter(i => !i.hidden);
    openLightbox(visibleItems.indexOf(item));
  }));

  document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
  document.getElementById("lightboxPrev").addEventListener("click", () => openLightbox(galleryIndex - 1));
  document.getElementById("lightboxNext").addEventListener("click", () => openLightbox(galleryIndex + 1));
  lightbox.addEventListener("click", event => { if (event.target === lightbox) closeLightbox(); });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeLightbox();
      closeMenu();
    }
    if (lightbox.classList.contains("open")) {
      if (event.key === "ArrowLeft") openLightbox(galleryIndex - 1);
      if (event.key === "ArrowRight") openLightbox(galleryIndex + 1);
    }
  });
});
