const body = document.body;
const navbar = document.querySelector('.navbar');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelectorAll('.nav-links a');
const preloader = document.querySelector('.preloader');

window.addEventListener('load', () => {
  setTimeout(() => preloader?.classList.add('hidden'), 450);
});

window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 18);
});

menuToggle?.addEventListener('click', () => {
  body.classList.toggle('menu-open');
});

navLinks.forEach(link => {
  link.addEventListener('click', () => body.classList.remove('menu-open'));
});

const currentPage = location.pathname.split('/').pop() || 'index.html';
navLinks.forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });

document.querySelectorAll('.reveal, .image-reveal').forEach(el => revealObserver.observe(el));

const counters = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1300;
    const start = performance.now();
    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.45 });

counters.forEach(counter => counterObserver.observe(counter));

const heroBg = document.querySelector('.hero-bg');
window.addEventListener('scroll', () => {
  if (!heroBg) return;
  const move = Math.min(window.scrollY * 0.08, 44);
  heroBg.style.transform = `translateY(${move}px) scale(1.04)`;
});

const filterButtons = document.querySelectorAll('.filter-btn');
const galleryCards = document.querySelectorAll('.gallery-card');
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    galleryCards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hide', !show);
    });
  });
});

const lightbox = document.querySelector('.lightbox');
const lightboxImg = document.querySelector('.lightbox-img');
const lightboxTitle = document.querySelector('.lightbox-title');
const lightboxCategory = document.querySelector('.lightbox-category');
const lightboxClose = document.querySelector('.lightbox-close');

document.querySelectorAll('[data-lightbox]').forEach(card => {
  card.addEventListener('click', () => {
    const image = card.dataset.image || getComputedStyle(card.querySelector('.project-img')).getPropertyValue('--img').replace(/^url\(["']?|["']?\)$/g, '');
    const title = card.dataset.title || card.querySelector('h3')?.textContent || 'Projekt';
    const category = card.dataset.label || card.querySelector('.project-meta')?.textContent || 'Interijeri po mjeri';
    lightboxImg.style.backgroundImage = `url('${image}')`;
    lightboxTitle.textContent = title;
    lightboxCategory.textContent = category;
    lightbox?.classList.add('open');
    body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox?.classList.remove('open');
  body.style.overflow = '';
}
lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

const inquiryForms = document.querySelectorAll('.inquiry-form');
inquiryForms.forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get('name') || '';
    const email = data.get('email') || '';
    const phone = data.get('phone') || '';
    const service = data.get('service') || '';
    const message = data.get('message') || '';
    const subject = encodeURIComponent(`Upit s web stranice - ${service || 'Interijeri po mjeri'}`);
    const bodyText = encodeURIComponent(
      `Ime i prezime: ${name}\nEmail: ${email}\nTelefon: ${phone}\nVrsta usluge: ${service}\n\nPoruka:\n${message}`
    );
    const mailto = `mailto:joko.curkovic@gmail.com?subject=${subject}&body=${bodyText}`;
    const msg = form.querySelector('.form-message');
    if (msg) msg.style.display = 'block';
    window.location.href = mailto;
  });
});
