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

// Injected: Google Apps Script endpoint URL (replace after deploying the script)
const APPS_SCRIPT_URL = 'REPLACE_WITH_YOUR_APPS_SCRIPT_WEB_APP_URL';
// Injected: Recipient email (non-secret). Server will use or override this.
const CONTACT_TO = 'vertexdigimediacom@gmail.com';

function validateEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function setErrByKey(key, msg) { const el = document.querySelector(`[data-error-for="${key}"]`); if (el) el.textContent = msg || ''; }

function wireContactForm(cfg) {
  const form = document.getElementById(cfg.formId);
  if (!form) return;
  // If an external action is set and not our flow, allow native submit
  if (form.action && form.action.includes('formsubmit.co')) return;
  const statusEl = document.getElementById(cfg.statusId);
  const btn = document.getElementById(cfg.buttonId);
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (statusEl) statusEl.textContent = '';
    // Clear errors
    Object.values(cfg.errorKeys).forEach(k => setErrByKey(k, ''));

    const fd = new FormData(form);
    // Honeypot
    const honey = (fd.get('hp') || fd.get('_honey') || '').toString();
    if (honey) { if (statusEl) statusEl.textContent = 'Thanks!'; form.reset(); return; }

    // Validation (by names)
    let ok = true;
    function req(name, key, label) {
      const v = (fd.get(name) || '').toString().trim();
      if (!v) { setErrByKey(key, 'Required'); ok = false; }
      return v;
    }
    const name = req('name', cfg.errorKeys.name, 'Name');
    const email = req('email', cfg.errorKeys.email, 'Email');
    if (email && !validateEmail(email)) { setErrByKey(cfg.errorKeys.email, 'Invalid'); ok = false; }
    const service = req('service', cfg.errorKeys.service, 'Service');
    const message = req('message', cfg.errorKeys.message, 'Message');
    // Optional extras
    const company = fd.get('company')?.toString().trim();
    const website = fd.get('website')?.toString().trim();
    if (cfg.errorKeys.company && !company) { setErrByKey(cfg.errorKeys.company,'Required'); ok=false; }
    const budget = fd.get('budget')?.toString().trim();
    if (cfg.errorKeys.budget && !budget) { setErrByKey(cfg.errorKeys.budget,'Required'); ok=false; }

    if (!ok) { if (statusEl) statusEl.textContent = 'Please fix highlighted fields.'; return; }

    if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }

    // Build payload
    const payload = {
      source: cfg.source,
      page: location.pathname + location.search + location.hash,
      to: CONTACT_TO,
      data: Object.fromEntries(fd.entries())
    };

    try {
      if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.startsWith('REPLACE_')) {
        // Not configured yet: simulate success
        await new Promise(r => setTimeout(r, 600));
      } else {
        // Attempt JSON (if CORS allowed)
        let ok = false;
        try {
          const res = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (res.ok) {
            ok = true;
            try {
              const json = await res.json();
              if (json && json.status && json.status !== 'ok') ok = false;
            } catch(_) { /* ignore parse errors */ }
          }
        } catch(_) { /* ignore CORS error, fallback below */ }

        if (!ok) {
          // Fallback: no-cors URL-encoded (opaque response but Apps Script receives it)
          const enc = new URLSearchParams();
          enc.set('source', payload.source);
          enc.set('page', payload.page);
          enc.set('data', JSON.stringify(payload.data));
          await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
            body: enc.toString()
          });
        }
      }
      form.reset();
      if (statusEl) statusEl.textContent = 'Thanks! We will reply within 24 hours.';
    } catch (err) {
      if (statusEl) statusEl.textContent = 'Something went wrong. Please try again.';
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = cfg.buttonIdleText; }
    }
  });
}

// Wire both forms
wireContactForm({
  formId: 'contactForm',
  statusId: 'formStatus',
  buttonId: 'submitBtn',
  buttonIdleText: 'Send Inquiry',
  source: 'home',
  errorKeys: { name: 'name', email: 'email', service: 'service', message: 'message' }
});
wireContactForm({
  formId: 'contactPageForm',
  statusId: 'cp-status',
  buttonId: 'cp-submit',
  buttonIdleText: 'Send Message',
  source: 'contact',
  errorKeys: { name: 'cp-name', email: 'cp-email', company: 'cp-company', service: 'cp-service', budget: 'cp-budget', message: 'cp-message' }
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
