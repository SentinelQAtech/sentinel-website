/* ============================================================
   SENTINEL TECH - QA | Main JavaScript
   ============================================================ */

/* ============================================================
   1. MOBILE NAVIGATION
   Toggles the .active class on the nav dropdown.
   Closes the menu when any nav link is clicked (single-page UX).
   ============================================================ */
(function initMobileNav() {
  const toggle = document.getElementById("menuToggle");
  const nav    = document.getElementById("navMenu");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("active");
    toggle.setAttribute("aria-expanded", isOpen);
  });

  /* Close menu on nav link click (smooth-scroll sections) */
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("active");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
})();


/* ============================================================
   2. SCROLL REVEAL
   Uses IntersectionObserver (performant, no scroll events).
   Elements with .reveal become visible when 88% of the viewport
   height is cleared — matches the original threshold.
   ============================================================ */
(function initScrollReveal() {
  const elements = document.querySelectorAll(".reveal");

  if (!elements.length) return;

  /* Fallback for browsers without IntersectionObserver support */
  if (!("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          /* Stop observing once revealed — no need to re-trigger */
          observer.unobserve(entry.target);
        }
      });
    },
    {
      /* 12% from bottom = same as window.innerHeight * 0.88 */
      rootMargin: "0px 0px -12% 0px",
      threshold: 0,
    }
  );

  elements.forEach((el) => observer.observe(el));
})();


/* ============================================================
   3. ACTIVE NAV LINK ON SCROLL
   Uses IntersectionObserver to track which section is in view
   and highlights the corresponding nav link with .active.
   ============================================================ */
(function initActiveNav() {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav a[href^='#']");

  if (!sections.length || !navLinks.length) return;
  if (!("IntersectionObserver" in window)) return;

  function setActive(id) {
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === "#" + id);
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
})();


/* ============================================================
   4. CONTACT FORM
   Client-side validation before submission.
   The alert is a placeholder — replace with a real email
   service integration (e.g. EmailJS, Formspree, backend API).
   ============================================================ */
(function initContactForm() {
  const form = document.getElementById("contactForm");

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name    = document.getElementById("name")?.value.trim();
    const email   = document.getElementById("email")?.value.trim();
    const message = document.getElementById("message")?.value.trim();

    if (!name || !email || !message) {
      alert("Please fill in all fields.");
      return;
    }

    /* TODO: Replace this with a real email service call */
    alert("Thanks! Your message form is ready to be connected to a real email service.");
    form.reset();
  });
})();


/* ============================================================
   5. COPYRIGHT — dynamic year
   ============================================================ */
(function initCopyright() {
  const copy = document.querySelector(".footer-copy");
  if (copy) {
    copy.textContent = `© ${new Date().getFullYear()} Sentinel Tech - QA. All rights reserved.`;
  }
})();
