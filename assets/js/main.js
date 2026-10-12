/* ============================================================
   MAISON ELITE — Main JavaScript
   ============================================================ */

// ─── Navbar Scroll Behavior ───────────────────────────────
const navbar = document.querySelector('.navbar');
const scrollToTop = document.querySelector('.scroll-to-top');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) { navbar && navbar.classList.add('scrolled'); scrollToTop && scrollToTop.classList.add('visible'); }
  else { navbar && navbar.classList.remove('scrolled'); scrollToTop && scrollToTop.classList.remove('visible'); }
});

// ─── Mobile Nav ────────────────────────────────────────────
// Single open/close control: the navbar hamburger (turns into X).
// Body gets .menu-open so the navbar stays legible over the panel.
const toggle = document.querySelector('.navbar-toggle');
const mobileNav = document.querySelector('.mobile-nav');
function setMenu(open) {
  toggle && toggle.classList.toggle('active', open);
  mobileNav && mobileNav.classList.toggle('active', open);
  document.body.classList.toggle('menu-open', open);
  document.body.style.overflow = open ? 'hidden' : '';
  toggle && toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  mobileNav && mobileNav.setAttribute('aria-hidden', open ? 'false' : 'true');
}
toggle && toggle.addEventListener('click', () => setMenu(!(mobileNav && mobileNav.classList.contains('active'))));
document.querySelectorAll('.mobile-nav-link').forEach(l => l.addEventListener('click', () => setMenu(false)));

// ─── Dark Mode Toggle ──────────────────────────────────────
const ICON_MOON = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
const ICON_SUN = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
const themeToggle = document.querySelectorAll('.theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
if (themeIcon) themeIcon.innerHTML = savedTheme === 'dark' ? ICON_SUN : ICON_MOON;
themeToggle.forEach(btn => btn.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  document.querySelectorAll('#theme-icon').forEach(el => { el.innerHTML = next === 'dark' ? ICON_SUN : ICON_MOON; });
}));

// ─── RTL / LTR Direction Toggle ────────────────────────────
// Text-only toggle: button shows "RTL" in LTR mode, "LTR" in RTL mode.
function applyDirection(dir, persist = true) {
  const next = dir === 'rtl' ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('dir', next);
  if (persist) { try { localStorage.setItem('direction', next); } catch (e) { /* private mode */ } }
  document.querySelectorAll('.rtl-toggle').forEach(btn => {
    const textWrap = btn.querySelector('.rtl-text');
    if (textWrap) textWrap.textContent = next === 'rtl' ? 'LTR' : 'RTL';
    btn.setAttribute('aria-label', next === 'rtl' ? 'Switch to LTR (left-to-right)' : 'Switch to RTL (right-to-left)');
    btn.setAttribute('data-label', next === 'rtl' ? 'LTR' : 'RTL');
    btn.setAttribute('aria-pressed', next === 'rtl' ? 'true' : 'false');
  });
}
let savedDir = 'ltr';
try { savedDir = localStorage.getItem('direction') || document.documentElement.getAttribute('dir') || 'ltr'; } catch (e) { /* keep ltr */ }
applyDirection(savedDir, false);
document.querySelectorAll('.rtl-toggle').forEach(btn => btn.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr';
  applyDirection(current === 'rtl' ? 'ltr' : 'rtl');
}));

// ─── Scroll Reveal ─────────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); revealObs.unobserve(e.target); } });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObs.observe(el));

// ─── Accordion ─────────────────────────────────────────────
document.querySelectorAll('.accordion-header').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.accordion-item');
    const isActive = item.classList.contains('active');
    document.querySelectorAll('.accordion-item.active').forEach(a => a.classList.remove('active'));
    if (!isActive) item.classList.add('active');
  });
});

// ─── Scroll to Top ─────────────────────────────────────────
scrollToTop && scrollToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ─── Hero Slider ───────────────────────────────────────────
function initSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dot');
  if (!slides.length) return;
  let current = 0;
  let timer;
  function goTo(i) {
    slides[current].classList.remove('active'); dots[current] && dots[current].classList.remove('active');
    current = i; slides[current].classList.add('active'); dots[current] && dots[current].classList.add('active');
  }
  dots.forEach((d, i) => d.addEventListener('click', () => { clearInterval(timer); goTo(i); timer = setInterval(() => goTo((current + 1) % slides.length), 5000); }));
  slides[0].classList.add('active'); dots[0] && dots[0].classList.add('active');
  timer = setInterval(() => goTo((current + 1) % slides.length), 5000);
}
initSlider();

// ─── Gallery / Blog Filter ─────────────────────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const bar = btn.closest('.filter-bar, .service-tab-bar') || document;
    bar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.filter-btn').forEach(b => { if (!bar.contains(b)) b.classList.remove('active'); });
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    const section = btn.closest('section') || document;
    // Targets: gallery items on home, post cards on blog, any [data-category] in same section
    let items = section.querySelectorAll('.gallery-item, .post-card');
    if (!items.length) items = document.querySelectorAll('.gallery-item, .post-card');
    let visible = 0;
    items.forEach(item => {
      const show = filter === 'all' || item.dataset.category === filter;
      if (show) { item.style.display = ''; item.style.animation = 'fadeInUp .4s forwards'; visible++; }
      else item.style.display = 'none';
    });
    // Empty-state (blog + gallery)
    let empty = section.querySelector('.filter-empty');
    if (!empty) empty = document.querySelector('.filter-empty');
    if (empty) empty.classList.toggle('show', visible === 0);
    const countNote = section.querySelector('[data-filter-count]');
    if (countNote) countNote.textContent = visible + (visible === 1 ? ' article' : ' articles');
  });
});

// ─── Lightbox ──────────────────────────────────────────────
const lightbox = document.querySelector('.lightbox');
const lightboxImg = document.querySelector('.lightbox-img');
const lightboxClose = document.querySelector('.lightbox-close');
document.querySelectorAll('[data-lightbox]').forEach(el => {
  el.addEventListener('click', () => {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = el.dataset.lightbox || el.src || el.querySelector('img')?.src;
    lightbox.classList.add('active'); document.body.style.overflow = 'hidden';
  });
});
lightboxClose && lightboxClose.addEventListener('click', () => { lightbox.classList.remove('active'); document.body.style.overflow = ''; });
lightbox && lightbox.addEventListener('click', e => { if (e.target === lightbox) { lightbox.classList.remove('active'); document.body.style.overflow = ''; } });

// ─── Skill Bars ────────────────────────────────────────────
const skillBars = document.querySelectorAll('.skill-bar-fill');
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.style.width = e.target.dataset.width || '80%'; skillObs.unobserve(e.target); } });
}, { threshold: 0.5 });
skillBars.forEach(b => skillObs.observe(b));

// ─── Booking Tabs ──────────────────────────────────────────
document.querySelectorAll('.booking-step-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    document.querySelectorAll('.booking-step-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.booking-step-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(target) && document.getElementById(target).classList.add('active');
  });
});

// ─── Form Validation ──────────────────────────────────────
function validateForm(form) {
  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    const err = field.parentElement.querySelector('.form-error');
    if (!field.value.trim()) { field.classList.add('is-invalid'); err && err.classList.add('visible'); valid = false; }
    else { field.classList.remove('is-invalid'); field.classList.add('is-valid'); err && err.classList.remove('visible'); }
    if (field.type === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) { field.classList.add('is-invalid'); valid = false; }
  });
  return valid;
}
document.querySelectorAll('form[data-validate]').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (validateForm(form)) { showToast('Message sent successfully! We\'ll contact you shortly.', 'success'); form.reset(); form.querySelectorAll('.is-valid').forEach(f => f.classList.remove('is-valid')); }
  });
});

// ─── Toast Notification ────────────────────────────────────
function showToast(msg, type = 'default') {
  const t = document.querySelector('.toast');
  if (!t) return;
  t.textContent = msg; t.className = `toast toast-${type} show`;
  setTimeout(() => t.classList.remove('show'), 4000);
}

// ─── Countdown Timer ──────────────────────────────────────
function initCountdown() {
  const target = document.getElementById('countdown-target');
  if (!target) return;
  const end = new Date(target.dataset.date || '2026-12-31').getTime();
  function update() {
    const now = Date.now(), diff = end - now;
    if (diff <= 0) return;
    const d = Math.floor(diff / 86400000), h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000), s = Math.floor((diff % 60000) / 1000);
    const set = (id, val) => { const el = document.getElementById(id); if(el) el.textContent = String(val).padStart(2,'0'); };
    set('cd-days',d); set('cd-hours',h); set('cd-mins',m); set('cd-secs',s);
  }
  update(); setInterval(update, 1000);
}
initCountdown();

// ─── Stat Counter Animation ───────────────────────────────
document.querySelectorAll('.stat-number[data-count]').forEach(el => {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const target = parseInt(el.dataset.count), suffix = el.dataset.suffix || '';
        let count = 0, step = Math.ceil(target / 60);
        const t = setInterval(() => { count = Math.min(count + step, target); el.textContent = count + suffix; if (count >= target) clearInterval(t); }, 30);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  obs.observe(el);
});

// ─── Active Nav Link ──────────────────────────────────────
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
  const href = link.getAttribute('href');
  if (href && (href === currentPage || (currentPage === '' && href === 'index.html'))) link.classList.add('active');
});

// ─── Parallax (subtle) ────────────────────────────────────
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero-bg img');
  if (hero) hero.style.transform = `translateY(${window.scrollY * 0.3}px)`;
}, { passive: true });

// ─── Blog Card → Detail (dynamic post handoff) ────────────
const BLOG_IMG_RE = /^assets\/images\/[a-z0-9_\-]+\.(jpg|jpeg|png|webp)$/i;
function blogCardData(root) {
  const d = { img: '', alt: '', title: '', cat: '', author: '', date: '', read: '' };
  try {
    const img = root.querySelector('img');
    if (img) { d.img = img.getAttribute('src') || ''; d.alt = img.getAttribute('alt') || ''; }
    if (root.classList.contains('post-card')) {
      const t = root.querySelector('.post-title');
      if (t) d.title = t.textContent.trim();
      const c = root.querySelector('.post-cat');
      if (c) d.cat = c.textContent.trim();
      const meta = root.querySelector('.post-meta');
      if (meta) {
        const spans = [...meta.querySelectorAll('span')]
          .map(s => s.textContent.trim()).filter(s => s && s !== '·');
        const parts = spans.length >= 3 ? spans
          : meta.textContent.split('·').map(s => s.trim()).filter(Boolean);
        if (parts[0]) d.author = parts[0].replace(/^[A-Za-z]\s*(?=[A-Z])/, '').trim();
        if (parts[1]) d.date = parts[1];
        if (parts[2]) d.read = parts[2].replace(/read/i, '').trim();
      }
    } else if (root.classList.contains('blog-hero-card')) {
      const h = root.querySelector('h2');
      if (h) d.title = h.textContent.trim();
      const divs = [...root.querySelectorAll('.blog-hero-content div')].map(x => x.textContent.trim());
      const metaLine = divs.find(x => x.includes('·') && !/min read/i.test(x));
      if (metaLine) {
        const p = metaLine.split('·').map(s => s.trim());
        if (p[0]) d.cat = p[0];
        if (p[1]) d.date = p[1];
      }
      const byList = divs.filter(x => /min read/i.test(x));
      const by = byList.length ? byList[byList.length - 1] : null;
      if (by) {
        const m = by.match(/(.+?)\s*·\s*(\d+\s*min)/i);
        if (m) { d.author = m[1].replace(/^[A-Za-z]\s*(?=[A-Z])/, '').trim(); d.read = m[2].trim(); }
      }
    } else if (root.classList.contains('related-card')) {
      const cells = root.querySelectorAll(':scope > div > div');
      if (cells[0]) d.cat = cells[0].textContent.trim();
      if (cells[1]) d.title = cells[1].textContent.trim();
    } else {
      const c = root.querySelector('div[style*="font-size:.625rem"]');
      if (c) d.cat = c.textContent.trim();
      const t = root.querySelector('div[style*="font-size:1rem"]');
      if (t) d.title = t.textContent.trim();
      const a = root.querySelector('div[style*="font-size:.75rem"]');
      if (a) {
        const m = a.textContent.match(/(.+?)\s*·\s*(\d+\s*min)/i);
        if (m) { d.author = m[1].trim(); d.read = m[2].trim(); }
      }
    }
  } catch (e) { /* keep defaults */ }
  return d;
}
function blogPostURL(d) {
  const q = new URLSearchParams();
  if (d.img && BLOG_IMG_RE.test(d.img)) q.set('img', d.img);
  ['title', 'cat', 'author', 'date', 'read', 'alt'].forEach(k => { if (d[k]) q.set(k, d[k]); });
  const s = q.toString();
  return 'blog-detail.html' + (s ? '?' + s : '');
}
function rememberPost(d) {
  try { sessionStorage.setItem('elite-post', JSON.stringify(d)); } catch (e) { /* private mode */ }
}
function initBlogPostLinks() {
  const wire = (root, link) => {
    if (!root || !link) return;
    link.href = blogPostURL(blogCardData(root));
    link.addEventListener('click', () => rememberPost(blogCardData(root)));
  };
  document.querySelectorAll('.post-card').forEach(card => {
    const a = card.querySelector('.post-title a');
    wire(card, a);
    card.style.cursor = 'pointer';
    card.addEventListener('click', e => {
      if (e.target.closest('a')) return;
      const d = blogCardData(card);
      rememberPost(d);
      window.location.href = blogPostURL(d);
    });
  });
  document.querySelectorAll('.blog-hero-card').forEach(a => wire(a, a));
  document.querySelectorAll('a.hover-lift').forEach(a => wire(a, a));
  document.querySelectorAll('.related-card').forEach(a => wire(a, a));
}
initBlogPostLinks();

// ─── Blog Detail: render dynamic post ─────────────────────
function renderBlogDetail() {
  const hero = document.getElementById('postHeroImg');
  if (!hero) return;
  let d = {};
  try {
    const q = new URLSearchParams(window.location.search);
    ['img', 'alt', 'title', 'cat', 'author', 'date', 'read'].forEach(k => {
      const v = q.get(k);
      if (v) d[k] = v;
    });
    if (!Object.keys(d).length) {
      const s = sessionStorage.getItem('elite-post');
      if (s) d = JSON.parse(s) || {};
    }
  } catch (e) { /* keep defaults */ }
  if (!Object.keys(d).length) return;
  if (d.img && BLOG_IMG_RE.test(d.img)) {
    hero.setAttribute('src', d.img);
    if (d.alt) hero.setAttribute('alt', d.alt);
  }
  const set = (id, v) => { const el = document.getElementById(id); if (el && v) el.textContent = v; };
  set('postTitle', d.title);
  set('postBadge', d.cat);
  set('postCrumb', d.cat);
  set('postAuthor', d.author);
  const readPart = d.read ? (/read/i.test(d.read) ? d.read : d.read + ' read') : '';
  const datePart = [d.date, readPart].filter(Boolean).join(' · ');
  set('postDate', datePart);
  if (d.author) {
    const av = document.getElementById('postAvatar');
    if (av) av.textContent = d.author.trim().charAt(0).toUpperCase();
  }
  if (d.title) document.title = d.title + ' | Maison Élite – Journal';
}
renderBlogDetail();
