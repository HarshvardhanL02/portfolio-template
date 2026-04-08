// script.js — Portfolio: Harshvardhan Lokhande
// Features: scroll animations, navbar, form validation + EmailJS, built-by badge, profile image

// ================================================================
// EMAILJS SETUP — SDK loaded dynamically, zero HTML changes
// ================================================================
// HOW TO SET UP (free, 5 mins):
// 1. Go to https://www.emailjs.com — create free account
// 2. Add Email Service → connect Gmail → copy Service ID
// 3. Create Email Template with variables: {{from_name}}, {{from_email}}, {{message}}
//    → copy Template ID
// 4. Account → API Keys → copy Public Key
// 5. Paste all three below ↓

const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';    // <- paste here
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';    // <- paste here
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';   // <- paste here

(function loadEmailJS() {
  const script    = document.createElement('script');
  script.src      = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
  script.onload   = () => emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  document.head.appendChild(script);
})();


// ================================================================
// "BUILT BY" BADGE — fixed bottom-right, pure JS, no CSS file touch
// ================================================================
(function injectBuiltByBadge() {
  const badge = document.createElement('div');
  badge.id          = 'built-by-badge';
  badge.textContent = 'Built by Harshvardhan L.';

  Object.assign(badge.style, {
    position:             'fixed',
    bottom:               '20px',
    right:                '20px',
    background:           'rgba(13,17,23,0.88)',
    color:                '#e6a817',
    border:               '1px solid rgba(230,168,23,0.35)',
    borderRadius:         '6px',
    padding:              '6px 13px',
    fontSize:             '12px',
    fontFamily:           '"Source Code Pro", monospace',
    letterSpacing:        '0.04em',
    backdropFilter:       'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    zIndex:               '9999',
    userSelect:           'none',
    opacity:              '0',
    transform:            'translateY(10px)',
    transition:           'opacity 0.5s ease, transform 0.5s ease',
  });

  document.body.appendChild(badge);

  setTimeout(() => {
    badge.style.opacity   = '1';
    badge.style.transform = 'translateY(0)';
  }, 900);
})();


// ================================================================
// PROFILE IMAGE — inject clickable avatar into hero + about, pure JS
// ================================================================
// - Click the avatar circle to open file picker
// - Image shows in both hero (large) and about (small)
// - Saved to localStorage so it persists across page reloads
// ================================================================
(function injectProfileImage() {

  // Load saved image from previous visit
  let savedImage = null;
  try { savedImage = localStorage.getItem('hl_profile_image'); } catch(e) {}

  // Hidden file input — opened on avatar click
  const fileInput     = document.createElement('input');
  fileInput.type      = 'file';
  fileInput.accept    = 'image/*';
  fileInput.style.display = 'none';
  document.body.appendChild(fileInput);

  // Build a styled avatar container
  function createAvatar(size, isHero) {
    const wrap = document.createElement('div');
    Object.assign(wrap.style, {
      width:          size + 'px',
      height:         size + 'px',
      borderRadius:   '50%',
      border:         '2.5px solid rgba(230,168,23,0.55)',
      boxShadow:      '0 0 0 4px rgba(230,168,23,0.10), 0 8px 32px rgba(0,0,0,0.45)',
      overflow:       'hidden',
      cursor:         'pointer',
      background:     '#161b22',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      flexShrink:     '0',
      position:       'relative',
      transition:     'box-shadow 0.25s ease, border-color 0.25s ease',
    });

    // Placeholder icon before image is set
    const placeholder = document.createElement('div');
    placeholder.id    = 'avatar-placeholder-' + (isHero ? 'hero' : 'about');
    Object.assign(placeholder.style, {
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      gap:            '6px',
      color:          '#e6a817',
      fontSize:       isHero ? '13px' : '11px',
      fontFamily:     '"Source Code Pro", monospace',
      textAlign:      'center',
      padding:        '8px',
      pointerEvents:  'none',
    });
    placeholder.innerHTML =
      '<svg width="' + (isHero?32:24) + '" height="' + (isHero?32:24) + '" viewBox="0 0 24 24" fill="none" stroke="#e6a817" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
        '<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>' +
      '</svg>' +
      '<span style="opacity:0.7">' + (isHero ? 'Add Photo' : 'Photo') + '</span>';

    // Actual image element
    const img = document.createElement('img');
    img.id    = 'avatar-img-' + (isHero ? 'hero' : 'about');
    Object.assign(img.style, {
      width:      '100%',
      height:     '100%',
      objectFit:  'cover',
      display:    'none',
      position:   'absolute',
      top:        '0',
      left:       '0',
    });

    // Hover overlay (camera icon)
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
      position:       'absolute',
      inset:          '0',
      background:     'rgba(0,0,0,0)',
      borderRadius:   '50%',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      opacity:        '0',
      transition:     'opacity 0.2s ease, background 0.2s ease',
      zIndex:         '2',
      pointerEvents:  'none',
    });
    overlay.innerHTML =
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>' +
        '<circle cx="12" cy="13" r="4"/>' +
      '</svg>';

    wrap.addEventListener('mouseenter', () => {
      overlay.style.opacity    = '1';
      overlay.style.background = 'rgba(0,0,0,0.45)';
      wrap.style.borderColor   = 'rgba(230,168,23,0.9)';
    });
    wrap.addEventListener('mouseleave', () => {
      overlay.style.opacity    = '0';
      overlay.style.background = 'rgba(0,0,0,0)';
      wrap.style.borderColor   = 'rgba(230,168,23,0.55)';
    });
    wrap.addEventListener('click', () => fileInput.click());

    wrap.appendChild(placeholder);
    wrap.appendChild(img);
    wrap.appendChild(overlay);
    return wrap;
  }

  // Apply image src to both avatar instances
  function applyImage(src) {
    ['hero', 'about'].forEach(function(id) {
      var img         = document.getElementById('avatar-img-' + id);
      var placeholder = document.getElementById('avatar-placeholder-' + id);
      if (img)         { img.src = src; img.style.display = 'block'; }
      if (placeholder)   placeholder.style.display = 'none';
    });
  }

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
      var src = e.target.result;
      applyImage(src);
      try { localStorage.setItem('hl_profile_image', src); } catch(err) {}
    };
    reader.readAsDataURL(file);
  });

  function injectAvatars() {
    // Hero — large avatar above the name
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      const heroWrap = createAvatar(120, true);
      Object.assign(heroWrap.style, { margin: '0 auto 24px auto' });
      heroContent.insertBefore(heroWrap, heroContent.firstChild);
    }

    // About — small avatar above the bio text
    const aboutBio = document.querySelector('.about-bio');
    if (aboutBio) {
      const aboutWrap = createAvatar(80, false);
      aboutWrap.style.marginBottom = '20px';
      aboutBio.insertBefore(aboutWrap, aboutBio.firstChild);
    }

    // Restore saved image if available
    if (savedImage) applyImage(savedImage);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectAvatars);
  } else {
    injectAvatars();
  }

})();


// ================================================================
// MAIN PAGE LOGIC
// ================================================================
document.addEventListener('DOMContentLoaded', () => {

  // ===========================================================
  // 1. NAVBAR — scroll effect + mobile toggle
  // ===========================================================

  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  // Add "scrolled" class after 60px scroll for frosted effect
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  // Mobile hamburger open/close
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close mobile menu on link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });


  // ===========================================================
  // 2. SMOOTH SCROLL — offset for fixed navbar
  // ===========================================================

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight - 16,
          behavior: 'smooth'
        });
      }
    });
  });


  // ===========================================================
  // 3. FADE-IN ON SCROLL — Intersection Observer
  // ===========================================================

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { root: null, rootMargin: '0px', threshold: 0.12 });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  // Hero elements appear immediately on load, staggered
  document.querySelectorAll('.hero .fade-up').forEach((el, index) => {
    setTimeout(() => el.classList.add('visible'), 120 + index * 120);
  });


  // ===========================================================
  // 4. CONTACT FORM — validation + EmailJS
  // ===========================================================

  const form         = document.getElementById('contact-form');
  const nameInput    = document.getElementById('name');
  const emailInput   = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const nameError    = document.getElementById('name-error');
  const emailError   = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');
  const formSuccess  = document.getElementById('form-success');

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Clear errors while typing
  nameInput.addEventListener('input',    () => nameError.textContent    = '');
  emailInput.addEventListener('input',   () => emailError.textContent   = '');
  messageInput.addEventListener('input', () => messageError.textContent = '');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    nameError.textContent    = '';
    emailError.textContent   = '';
    messageError.textContent = '';
    formSuccess.classList.remove('show');

    const name    = nameInput.value.trim();
    const email   = emailInput.value.trim();
    const message = messageInput.value.trim();
    let hasError  = false;

    if (name.length < 2)      { nameError.textContent    = '⚠ Please enter your name.';                   hasError = true; }
    if (!isValidEmail(email)) { emailError.textContent   = '⚠ Enter a valid email address.';              hasError = true; }
    if (message.length < 10)  { messageError.textContent = '⚠ Message is too short (min 10 characters).'; hasError = true; }
    if (hasError) return;

    // Send to harshvardhanlokhande762@gmail.com via EmailJS
    const submitBtn       = form.querySelector('.btn-submit');
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled    = true;

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      from_name:  name,
      from_email: email,
      message:    message,
      to_email:   'harshvardhanlokhande762@gmail.com'
    })
    .then(() => {
      formSuccess.textContent = "✔ Message sent! I'll get back to you soon.";
      formSuccess.classList.add('show');
      form.reset();
      submitBtn.textContent = 'Send Message';
      submitBtn.disabled    = false;
      setTimeout(() => formSuccess.classList.remove('show'), 5000);
    })
    .catch((err) => {
      console.error('EmailJS error:', err);
      messageError.textContent = '⚠ Could not send. Please try again or email directly.';
      submitBtn.textContent    = 'Send Message';
      submitBtn.disabled       = false;
    });
  });


  // ===========================================================
  // 5. ACTIVE NAV LINK — highlight as user scrolls
  // ===========================================================

  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    const scrollPos = window.scrollY + navbar.offsetHeight + 40;
    sections.forEach(section => {
      if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
        links.forEach(l => l.style.color = '');
        const active = document.querySelector('.nav-link[href="#' + section.id + '"]');
        if (active) active.style.color = 'var(--accent)';
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink();

});
