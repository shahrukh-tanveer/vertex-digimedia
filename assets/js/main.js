// Vertex DG Media - main interactions

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('show');
  navToggle.classList.toggle('active');
});

// Close nav on link click (mobile)
navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  if (window.innerWidth < 880) navLinks.classList.remove('show');
}));

// Year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear().toString();

// Scroll reveal
const revealEls = document.querySelectorAll('.card, .work-item, .stat, .steps li, .hero h1, .hero .subtitle, .hero .hero-cta, .metrics div, section .section-head');
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => { el.classList.add('reveal'); io.observe(el); });

// Contact form (front-end validation & mock submit)
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

function setError(name, msg) {
  const span = document.querySelector(`[data-error-for="${name}"]`);
  if (span) span.textContent = msg || '';
}

function validateEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

form?.addEventListener('submit', async e => {
  e.preventDefault();
  status.textContent = '';
  const fd = new FormData(form);
  let valid = true;

  ['name','email','service','message'].forEach(field => setError(field,''));

  // Name
  if (!fd.get('name')?.toString().trim()) { setError('name','Required'); valid = false; }
  // Email
  const email = fd.get('email')?.toString().trim();
  if (!email) { setError('email','Required'); valid=false; }
  else if(!validateEmail(email)) { setError('email','Invalid email'); valid=false; }
  // Service
  if (!fd.get('service')) { setError('service','Select a service'); valid = false; }
  // Message
  if (!fd.get('message')?.toString().trim()) { setError('message','Required'); valid = false; }

  if (!valid) { status.textContent = 'Please fix highlighted fields.'; return; }

  const btn = document.getElementById('submitBtn');
  btn.disabled = true; btn.textContent = 'Sending...';

  // Simulate async send (replace with real endpoint or email service)
  try {
    await new Promise(r => setTimeout(r, 800));
    form.reset();
    status.textContent = 'Thanks! We will reply within 24 hours.';
  } catch(err) {
    status.textContent = 'Something went wrong. Please try again.';
  } finally {
    btn.disabled = false; btn.textContent = 'Send Inquiry';
  }
});

// Optional: Smooth scroll for in-page links
const internalLinks = document.querySelectorAll('a[href^="#"]');
internalLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    if (id && id.startsWith('#') && id.length > 1) {
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 60, behavior: 'smooth' });
        history.replaceState(null,'',id);
      }
    }
  });
});
