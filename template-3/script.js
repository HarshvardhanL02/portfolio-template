// script.js — Portfolio: Harshvardhan Lokhande
// Three main features: scroll animations, navbar behavior, form validation

// Wait for the HTML to fully load before running any JS
document.addEventListener('DOMContentLoaded', () => {


  // ===========================================================
  // 1. NAVBAR — scroll effect + mobile toggle
  // ===========================================================

  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  // Add a "scrolled" class to the navbar once user scrolls past 60px.
  // CSS uses this class to add a frosted background effect.
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Toggle the mobile menu open/close when hamburger is clicked
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');  // animates the icon to X
    navLinks.classList.toggle('open');   // shows/hides the side panel
  });

  // Close the mobile menu automatically when a nav link is clicked
  // (so the user doesn't have to close it manually)
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });


  // ===========================================================
  // 2. SMOOTH SCROLL — handle anchor link clicks
  // ===========================================================
  // The browser handles smooth scrolling via CSS scroll-behavior: smooth
  // but we add a small offset so the navbar doesn't cover the section title

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      const target   = document.querySelector(targetId);

      if (target) {
        e.preventDefault();  // stop the default jump

        const navHeight = navbar.offsetHeight; // how tall the navbar is
        const targetTop = target.getBoundingClientRect().top + window.scrollY;

        window.scrollTo({
          top: targetTop - navHeight - 16,  // 16px breathing room below navbar
          behavior: 'smooth'
        });
      }
    });
  });


  // ===========================================================
  // 3. FADE-IN ON SCROLL — using Intersection Observer
  // ===========================================================
  // IntersectionObserver is the modern way to detect when elements
  // enter the viewport. Much better than checking scroll position manually.

  const fadeElements = document.querySelectorAll('.fade-up');

  const observerOptions = {
    root: null,       // observe relative to the browser viewport
    rootMargin: '0px',
    threshold: 0.12  // trigger when 12% of the element is visible
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Element came into view — add the class that makes it visible
        entry.target.classList.add('visible');

        // Stop watching this element once it's appeared (saves memory)
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Attach observer to every element that has the .fade-up class
  fadeElements.forEach(el => observer.observe(el));

  // Hero elements should be visible immediately without waiting for scroll
  // so we manually trigger them on page load with a short delay
  document.querySelectorAll('.hero .fade-up').forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, 120 + index * 120);  // stagger each hero element by 120ms
  });


  // ===========================================================
  // 4. CONTACT FORM — basic validation
  // ===========================================================
  // No backend here — just checks that fields aren't empty
  // and that the email format looks right before showing success.

  const form          = document.getElementById('contact-form');
  const nameInput     = document.getElementById('name');
  const emailInput    = document.getElementById('email');
  const messageInput  = document.getElementById('message');
  const nameError     = document.getElementById('name-error');
  const emailError    = document.getElementById('email-error');
  const messageError  = document.getElementById('message-error');
  const formSuccess   = document.getElementById('form-success');

  // Simple email format check using a regex pattern
  // This doesn't verify if the email actually exists — just checks the format
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Clear error messages when user starts typing in a field
  // Makes the form feel more responsive
  nameInput.addEventListener('input',    () => nameError.textContent    = '');
  emailInput.addEventListener('input',   () => emailError.textContent   = '');
  messageInput.addEventListener('input', () => messageError.textContent = '');

  form.addEventListener('submit', (e) => {
    e.preventDefault();  // stop the page from refreshing on submit

    // Reset all errors before re-validating
    nameError.textContent    = '';
    emailError.textContent   = '';
    messageError.textContent = '';
    formSuccess.classList.remove('show');

    const name    = nameInput.value.trim();
    const email   = emailInput.value.trim();
    const message = messageInput.value.trim();

    let hasError = false;

    // Check each field and show error message if invalid
    if (name.length < 2) {
      nameError.textContent = '⚠ Please enter your name.';
      hasError = true;
    }

    if (!isValidEmail(email)) {
      emailError.textContent = '⚠ Enter a valid email address.';
      hasError = true;
    }

    if (message.length < 10) {
      messageError.textContent = '⚠ Message is too short (min 10 characters).';
      hasError = true;
    }

    // If any validation failed, stop here
    if (hasError) return;

    // All good — show success message and reset the form
    formSuccess.classList.add('show');
    form.reset();

    // Auto-hide the success message after 5 seconds
    setTimeout(() => {
      formSuccess.classList.remove('show');
    }, 5000);
  });


  // ===========================================================
  // 5. ACTIVE NAV LINK — highlight current section while scrolling
  // ===========================================================
  // As the user scrolls through the page, the matching nav link gets
  // highlighted. This is a small touch that makes it feel polished.

  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    const scrollPos = window.scrollY + navbar.offsetHeight + 40;

    sections.forEach(section => {
      const top    = section.offsetTop;
      const bottom = top + section.offsetHeight;

      if (scrollPos >= top && scrollPos < bottom) {
        // Remove active from all links
        links.forEach(l => l.style.color = '');

        // Apply accent color to the matching link
        const active = document.querySelector(`.nav-link[href="#${section.id}"]`);
        if (active) active.style.color = 'var(--accent)';
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink(); // run once on load to set initial state

});
