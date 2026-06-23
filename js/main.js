// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 60 });
  if (document.querySelector('.hero-swiper')) initHeroSwiper();
  if (document.querySelector('.review-swiper')) initReviewSwiper();
  initScrollEvents();
  initCounters();
  setMinDate();
});

// ==================== HERO SWIPER ====================
function initHeroSwiper() {
  new Swiper('.hero-swiper', {
    loop: true, speed: 900,
    autoplay: { delay: 5500, disableOnInteraction: false },
    pagination: { el: '.hero-swiper .swiper-pagination', clickable: true },
    navigation: { prevEl: '.hero-swiper .swiper-button-prev', nextEl: '.hero-swiper .swiper-button-next' },
    effect: 'fade', fadeEffect: { crossFade: true }
  });
}

// ==================== REVIEW SWIPER ====================
function initReviewSwiper() {
  new Swiper('.review-swiper', {
    loop: true, speed: 700,
    autoplay: { delay: 4200, disableOnInteraction: false },
    slidesPerView: 1, spaceBetween: 24,
    breakpoints: { 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } },
    pagination: { el: '.review-swiper .swiper-pagination', clickable: true }
  });
}

// ==================== SCROLL EVENTS ====================
function initScrollEvents() {
  const nav = document.getElementById('mainNav');
  const scrollBtn = document.getElementById('scrollTop');
  window.addEventListener('scroll', () => {
    const s = window.scrollY;
    if (nav) nav.classList.toggle('scrolled', s > 80);
    if (scrollBtn) scrollBtn.classList.toggle('show', s > 400);
    updateActiveNav(s);
  });
}

function updateActiveNav(scrollY) {
  const sections = ['home','about','services','gallery','outfits','reviews','faq','appointment'];
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.offsetTop - 120;
    const bot = top + el.offsetHeight;
    const links = document.querySelectorAll(`.nav-link-custom[href="#${id}"]`);
    links.forEach(l => l.classList.toggle('active', scrollY >= top && scrollY < bot));
  });
}

// ==================== NAV TOGGLE ====================
function toggleNav() {
  const mn = document.getElementById('mobileNav');
  const ic = document.getElementById('navIcon');
  const open = mn.style.display === 'block';
  mn.style.display = open ? 'none' : 'block';
  ic.className = open ? 'fas fa-bars' : 'fas fa-times';
  ic.style.color = 'var(--rose)'; ic.style.fontSize = '1.3rem';
}
function closeNav() {
  const mobileNav = document.getElementById('mobileNav');
  const navIcon = document.getElementById('navIcon');
  if (mobileNav) mobileNav.style.display = 'none';
  if (navIcon) navIcon.className = 'fas fa-bars';
}

// ==================== COUNTERS ====================
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current);
    if (current >= target) clearInterval(timer);
  }, 16);
}

// ==================== LIGHTBOX ====================
function openLightbox(src) {
  document.getElementById('lightboxImg').src = src;
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

// ==================== VIDEO ====================
function playVideo(url) {
  document.getElementById('videoFrame').src = url;
  new bootstrap.Modal(document.getElementById('videoModal')).show();
}
function stopVideo() {
  document.getElementById('videoFrame').src = '';
}
const videoModal = document.getElementById('videoModal');
if (videoModal) videoModal.addEventListener('hidden.bs.modal', stopVideo);

// ==================== APPOINTMENT ====================
function setMinDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const min = d.toISOString().split('T')[0];
  const apptDate = document.getElementById('apptDate');
  if (apptDate) apptDate.min = min;
}

function submitAppointment() {
  const name = document.getElementById('apptName').value.trim();
  const phone = document.getElementById('apptPhone').value.trim();
  const service = document.getElementById('apptService').value;
  const date = document.getElementById('apptDate').value;

  if (!name || !phone || !service || !date) {
    alert('Please fill all required fields (Name, Phone, Service, Date).');
    return;
  }

  const time = document.getElementById('apptTime').value;
  const home = document.getElementById('apptHome').value;
  const note = document.getElementById('apptNote').value;

  // Build WhatsApp message
  const msg = `🌸 *Appointment Request – Mahek Beauty Parlour*\n\n👤 Name: ${name}\n📞 Phone: ${phone}\n💄 Service: ${service}\n📅 Date: ${date}\n⏰ Time: ${time}\n🏡 Home Service: ${home === 'yes' ? 'Yes' : 'No'}\n📝 Notes: ${note || 'None'}`;

  const waUrl = `https://wa.me/918200751953?text=${encodeURIComponent(msg)}`;
  window.open(waUrl, '_blank');

  // Show toast
  showToast();

  // Reset form
  ['apptName','apptPhone','apptNote'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('apptService').selectedIndex = 0;
}

function showToast() {
  const t = document.getElementById('customToast');
  if (!t) return;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 4200);
}

// ==================== LANGUAGE SWITCHER ====================
let currentLang = 'en';

function switchLang(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;

  // Update all elements with data-en / data-gu
  document.querySelectorAll('[data-en]').forEach(el => {
    const val = el.getAttribute(`data-${lang}`);
    if (val) {
      // Check if it contains HTML (innerHTML)
      if (val.includes('<') || val.includes('&')) {
        el.innerHTML = val;
      } else {
        el.textContent = val;
      }
    }
  });

  // Update lang buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.toLowerCase().trim() === lang || (lang === 'gu' && btn.textContent.includes('ગુ')));
  });

  // Add Gujarati font if needed
  if (lang === 'gu' && !document.getElementById('guFont')) {
    const link = document.createElement('link');
    link.id = 'guFont';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Gujarati:wght@300;400;500;600;700&display=swap';
    document.head.appendChild(link);
  }
}

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
