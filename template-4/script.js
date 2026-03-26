/* ================================================================
   script.js — Portfolio of Harshvardhan Lokhande

   This file handles ALL interactive behaviour on the page.
   No libraries or frameworks — pure Vanilla JavaScript.

   FEATURES COVERED:
   ┌─────────────────────────────────────────────────────────┐
   │  1. Hero Canvas Background (animated dot-grid)          │
   │  2. Navbar — Scroll shadow + shrink effect              │
   │  3. Hamburger — Mobile menu toggle                      │
   │  4. Smooth Scrolling — Nav link clicks                  │
   │  5. Fade-In Animation — IntersectionObserver            │
   │  6. Contact Form Validation                             │
   └─────────────────────────────────────────────────────────┘

   HOW TO READ THIS FILE:
   Each feature is a self-contained block with clear comments.
   Read top-to-bottom. Understand each block before the next.
================================================================ */


/* ================================================================
   FEATURE 1: HERO CANVAS — Animated Dot Grid
   
   CONCEPT: We draw a grid of dots on an HTML <canvas> element.
   The dots gently "breathe" (change size) over time, creating
   a living engineering-schematic background.

   KEY CONCEPTS:
   - canvas.getContext('2d') → gives us drawing tools
   - requestAnimationFrame   → browser-optimised animation loop
   - Math.sin()              → creates smooth wave oscillation
================================================================ */

// Grab the canvas element from the HTML by its ID
const canvas = document.getElementById('heroCanvas');

// Make sure it exists before we try to use it
if (canvas) {
  // getContext('2d') returns a 2D drawing API object
  const ctx = canvas.getContext('2d');

  // Configuration: how our dot grid looks and behaves
  const config = {
    dotSpacing: 36,          // Pixels between each dot
    dotRadius: 1.2,          // Base radius of each dot
    dotColor: 'rgba(245, 158, 11, 0.5)', // Amber colour (matches our accent)
    pulseSpeed: 0.0008,      // How fast dots "breathe"
    pulseAmount: 0.6,        // How much the radius changes during breathing
  };

  // This variable tracks elapsed time for the animation
  let animTime = 0;

  // ---- Resize Handler ----
  // The canvas must exactly match the window size.
  // This function updates it whenever the window is resized.
  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // ---- Draw a Single Frame ----
  function drawFrame(timestamp) {
    // Update our time variable (timestamp = milliseconds since page load)
    animTime = timestamp * config.pulseSpeed;

    // Clear the entire canvas before drawing the new frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ---- Draw dot grid ----
    // These nested loops generate every (x, y) position in the grid
    for (let x = 0; x < canvas.width; x += config.dotSpacing) {
      for (let y = 0; y < canvas.height; y += config.dotSpacing) {

        // Math.sin() returns a value between -1 and +1, creating a smooth wave.
        // We offset each dot's phase by its x position so they don't all
        // pulse together — this creates a "ripple" effect.
        const phase  = x * 0.01 + y * 0.01; // Unique phase per dot position
        const radius = config.dotRadius + Math.sin(animTime + phase) * config.pulseAmount;

        // Draw a circle (arc) at this position
        ctx.beginPath();
        ctx.arc(x, y, Math.max(0, radius), 0, Math.PI * 2);
        ctx.fillStyle = config.dotColor;
        ctx.fill();
      }
    }

    // ---- Add radial fade ----
    // A gradient from transparent (centre) to our background colour (edges)
    // This softens the edges and creates depth.
    const gradient = ctx.createRadialGradient(
      canvas.width * 0.5, canvas.height * 0.5, 0,   // Inner circle (centre)
      canvas.width * 0.5, canvas.height * 0.5, canvas.width * 0.7 // Outer circle
    );
    gradient.addColorStop(0,   'rgba(13, 17, 23, 0)');   // Transparent in centre
    gradient.addColorStop(0.7, 'rgba(13, 17, 23, 0)');   // Still transparent
    gradient.addColorStop(1,   'rgba(13, 17, 23, 0.8)'); // Dark at edges

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Schedule the NEXT frame — this creates a continuous loop
    requestAnimationFrame(drawFrame);
  }

  // Set up canvas size now, and again whenever window resizes
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Start the animation loop
  requestAnimationFrame(drawFrame);
}


/* ================================================================
   FEATURE 2: NAVBAR — Scroll Effect
   
   CONCEPT: The navbar starts transparent. When the user scrolls
   more than 50 pixels, we add a CSS class "scrolled" which
   triggers the frosted-glass styles defined in style.css.
   
   KEY CONCEPTS:
   - window.addEventListener('scroll', ...) → runs on every scroll
   - window.scrollY → current vertical scroll position in pixels
   - classList.add() / classList.remove() → toggle CSS classes
================================================================ */

const navbar = document.getElementById('navbar');

window.addEventListener('scroll', function () {
  // scrollY = how many pixels user has scrolled from the top
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});


/* ================================================================
   FEATURE 3: HAMBURGER — Mobile Menu Toggle
   
   CONCEPT: On mobile, the nav links are hidden. When the hamburger
   icon is clicked, we show the mobile navigation menu by toggling
   the "open" class. Clicking any link inside closes it again.

   KEY CONCEPTS:
   - classList.toggle() → adds class if missing, removes if present
   - forEach()          → loops over a collection of elements
================================================================ */

const hamburger  = document.getElementById('hamburger');
const mobileNav  = document.getElementById('mobileNav');

// Toggle the mobile menu on hamburger click
hamburger.addEventListener('click', function () {
  mobileNav.classList.toggle('open');
});

// Select all mobile nav links
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

// When any mobile link is clicked, close the menu
mobileNavLinks.forEach(function (link) {
  link.addEventListener('click', function () {
    mobileNav.classList.remove('open');
  });
});


/* ================================================================
   FEATURE 4: SMOOTH SCROLLING — Nav Link Clicks
   
   CONCEPT: When any link with href="#something" is clicked,
   instead of jumping instantly, we smoothly scroll to that section.
   
   HOW IT WORKS:
   1. Intercept the click with event.preventDefault()
   2. Read the href to find which section to scroll to
   3. Use scrollIntoView({ behavior: 'smooth' }) to animate the scroll

   KEY CONCEPTS:
   - event.preventDefault()  → stops default browser action (instant jump)
   - getAttribute('href')     → reads the href attribute value
   - document.getElementById() → finds the target section
   - scrollIntoView()         → scrolls to that element
================================================================ */

// Select ALL internal links (those starting with "#")
const internalLinks = document.querySelectorAll('a[href^="#"]');

internalLinks.forEach(function (link) {
  link.addEventListener('click', function (event) {
    // Stop default behaviour (instant jump to anchor)
    event.preventDefault();

    // Get the target section's ID from the href
    // e.g. href="#about" → remove "#" → "about"
    const targetId = this.getAttribute('href').replace('#', '');

    // Find the section element with that ID
    const targetSection = document.getElementById(targetId);

    if (targetSection) {
      // Scroll smoothly to that section
      targetSection.scrollIntoView({
        behavior: 'smooth', // Animated scroll (vs 'instant')
        block: 'start'      // Align to top of section
      });
    }
  });
});


/* ================================================================
   FEATURE 5: FADE-IN ON SCROLL — Intersection Observer
   
   CONCEPT: Elements with class "fade-in" start invisible (opacity:0)
   and slightly shifted down (defined in CSS). When they enter the
   visible area of the screen (viewport), we add class "visible"
   which CSS transitions to full opacity and position.

   WHY USE INTERSECTION OBSERVER (not scroll events)?
   - More efficient: doesn't fire on every single scroll pixel
   - Browser-optimised: uses native APIs
   - Clean: automatically detects when elements enter/leave viewport

   HOW IT WORKS:
   1. Create an IntersectionObserver with a callback function
   2. Tell it to watch all .fade-in elements
   3. When an element is 12% visible → add "visible" class
   4. Stop watching it (unobserve) after it animates — efficiency!
================================================================ */

// Create the observer
// The callback receives an array of "entries" (observed elements)
const fadeObserver = new IntersectionObserver(

  function (entries) {
    entries.forEach(function (entry) {
      // isIntersecting → true when element is in viewport
      if (entry.isIntersecting) {
        // Add the visible class to trigger CSS animation
        entry.target.classList.add('visible');

        // Stop watching — we only animate once
        // (Remove this line if you want it to animate every time it enters view)
        fadeObserver.unobserve(entry.target);
      }
    });
  },

  {
    // threshold: 0.12 → fire when 12% of the element is visible
    threshold: 0.12,
    // rootMargin: slight offset so animation triggers a bit before element is fully in view
    rootMargin: '0px 0px -40px 0px'
  }
);

// Find every element with class "fade-in" and tell the observer to watch it
const fadeElements = document.querySelectorAll('.fade-in');

fadeElements.forEach(function (el) {
  fadeObserver.observe(el);
});


/* ================================================================
   FEATURE 6: CONTACT FORM VALIDATION
   
   CONCEPT: When the form is submitted, we check three things:
   1. Name is not empty
   2. Email matches a valid email pattern (using regex)
   3. Message is at least 10 characters long

   If ANY check fails:
   - Add red border to that input (.input-error class)
   - Show the error message below it (.error-visible class)
   - Stop form submission

   If ALL checks pass:
   - Show green success message
   - Clear the form

   KEY CONCEPTS:
   - event.preventDefault()  → stops form from actually sending/reloading
   - .trim()                 → removes whitespace from start/end of value
   - regex.test(string)      → tests if string matches a pattern
   - element.classList       → add/remove CSS classes

   WHAT IS REGEX?
   /^[^\s@]+@[^\s@]+\.[^\s@]+$/
   This is a Regular Expression — a pattern that matches email format.
   Read as: "starts with (^) one or more non-space non-@ chars,
             then @, then more non-@ chars, then a dot, then more chars, end ($)"
================================================================ */

// Grab the form and its fields
const contactForm   = document.getElementById('contactForm');
const nameInput     = document.getElementById('name');
const emailInput    = document.getElementById('email');
const messageInput  = document.getElementById('message');
const formSuccess   = document.getElementById('formSuccess');

// Grab the error message elements
const nameError    = document.getElementById('nameError');
const emailError   = document.getElementById('emailError');
const messageError = document.getElementById('messageError');

// ---- Helper function: clear all error states ----
// Called at the start of each validation run
function clearErrors() {
  // Inputs: remove red border class
  [nameInput, emailInput, messageInput].forEach(function (input) {
    input.classList.remove('input-error');
  });
  // Error messages: hide them
  [nameError, emailError, messageError].forEach(function (error) {
    error.classList.remove('error-visible');
  });
  // Hide success message too
  formSuccess.classList.remove('success-visible');
}

// ---- Helper function: mark a field as invalid ----
// input → the <input> or <textarea> element
// error → the corresponding error <span> element
function showError(input, error) {
  input.classList.add('input-error');  // Red border
  error.classList.add('error-visible'); // Show error text
}

// ---- Listen for form submission ----
contactForm.addEventListener('submit', function (event) {
  // ALWAYS call this first to prevent page reload
  event.preventDefault();

  // Remove any existing error states
  clearErrors();

  // Read values and remove surrounding whitespace
  const nameVal    = nameInput.value.trim();
  const emailVal   = emailInput.value.trim();
  const messageVal = messageInput.value.trim();

  // Track if all fields are valid
  let formIsValid = true;

  // ---- Validation Check 1: Name ----
  // Must not be empty
  if (nameVal === '') {
    showError(nameInput, nameError);
    formIsValid = false;
  }

  // ---- Validation Check 2: Email ----
  // Must match the email pattern (regex)
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(emailVal)) {
    showError(emailInput, emailError);
    formIsValid = false;
  }

  // ---- Validation Check 3: Message ----
  // Must be at least 10 characters
  if (messageVal.length < 10) {
    showError(messageInput, messageError);
    formIsValid = false;
  }

  // ---- If all valid: show success ----
  if (formIsValid) {
    // Show success banner
    formSuccess.classList.add('success-visible');

    // Reset the form (clear all fields)
    contactForm.reset();

    // Log to console (demonstrates it worked — useful in viva!)
    console.log('✅ Form submitted!');
    console.log('   Name:',    nameVal);
    console.log('   Email:',   emailVal);
    console.log('   Message:', messageVal);

    // In a real project, here you would:
    // - Send data to a backend server (fetch API)
    // - Or save to Firebase Firestore
    // - Or use an email service like EmailJS
  }
});

// ---- Live validation: clear error as user starts typing ----
// This gives instant feedback that the error is fixed
[nameInput, emailInput, messageInput].forEach(function (input) {
  input.addEventListener('input', function () {
    // Remove error styling as soon as user types something
    this.classList.remove('input-error');
  });
});


/* ================================================================
   UTILITY: Active Nav Link Highlight on Scroll
   
   CONCEPT: As the user scrolls through sections, the corresponding
   nav link gets highlighted with the accent colour.
   
   HOW:
   - Track which section is currently in view
   - Add class "active-link" to the matching nav link
================================================================ */

// All sections that have an ID matching nav links
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', function () {
  let currentSection = '';

  sections.forEach(function (section) {
    // getBoundingClientRect() returns position relative to viewport
    const rect = section.getBoundingClientRect();

    // If the top of the section is above the middle of screen,
    // it's the "current" section
    if (rect.top <= window.innerHeight * 0.4) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(function (link) {
    link.classList.remove('active-link');
    // Check if this link's href matches the current section
    if (link.getAttribute('href') === '#' + currentSection) {
      link.classList.add('active-link');
    }
  });
});

// Add a small CSS style for the active link state
// (We do this in JS so we don't need to edit style.css)
const activeStyle = document.createElement('style');
activeStyle.textContent = `
  .nav-link.active-link {
    color: var(--col-accent) !important;
  }
  .nav-link.active-link::after {
    width: 100% !important;
  }
`;
document.head.appendChild(activeStyle);


// ---- Console greeting (fun easter egg for developers!) ----
console.log('%c👋 Hello, Developer!', 'color: #f59e0b; font-size: 1.2rem; font-weight: bold;');
console.log('%cPortfolio of Harshvardhan Lokhande — Built with HTML, CSS & Vanilla JS', 'color: #718096;');
