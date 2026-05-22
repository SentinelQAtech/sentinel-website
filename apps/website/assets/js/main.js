(function initMobileNav() {
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("navMenu");

  if (!toggle || !nav) return;

  function openMenu() {
    nav.classList.add("active");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
    var firstLink = nav.querySelector("a");
    if (firstLink) firstLink.focus();
  }

  function closeMenu() {
    nav.classList.remove("active");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    toggle.focus();
  }

  toggle.addEventListener("click", function () {
    var isOpen = toggle.getAttribute("aria-expanded") === "true";
    isOpen ? closeMenu() : openMenu();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      closeMenu();
    }
  });

  document.addEventListener("click", function (e) {
    if (
      toggle.getAttribute("aria-expanded") === "true" &&
      !nav.contains(e.target) &&
      !toggle.contains(e.target)
    ) {
      closeMenu();
    }
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });
})();

(function initScrollReveal() {
  const elements = document.querySelectorAll(".reveal");

  if (!elements.length) return;

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0 }
  );

  elements.forEach((element) => observer.observe(element));
})();

(function initActiveNav() {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav a[href^='#']");

  if (!sections.length || !navLinks.length || !("IntersectionObserver" in window)) return;

  function setActive(id) {
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
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

(function initContactForm() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

  if (!form || !status || !submitBtn) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = form.querySelector("#name").value.trim();
    const email = form.querySelector("#email").value.trim();
    const message = form.querySelector("#message").value.trim();

    clearFieldErrors(form);
    status.textContent = "";
    status.className = "form-status";

    let hasError = false;
    if (!name) {
      showFieldError(form, "name", "Please enter your name.");
      hasError = true;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFieldError(form, "email", "Please enter a valid work email.");
      hasError = true;
    }
    if (!message) {
      showFieldError(form, "message", "Please describe your project context.");
      hasError = true;
    }
    if (hasError) return;

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    try {
      const response = await fetch("https://formspree.io/f/mvzyajaa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ name: name, email: email, message: message }),
      });

      if (response.ok) {
        form.reset();
        status.textContent = "Message sent! We’ll be in touch within 1 business day.";
        status.className = "form-status form-status--success";
      } else {
        status.textContent = "Something went wrong. Email us at contato@sentinelqa.tech";
        status.className = "form-status form-status--error";
      }
    } catch (_) {
      status.textContent = "Network error. Check your connection and try again.";
      status.className = "form-status form-status--error";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send message";
    }
  });

  function showFieldError(form, fieldId, message) {
    const field = form.querySelector("#" + fieldId);
    if (!field) return;
    field.setAttribute("aria-invalid", "true");
    field.setAttribute("aria-describedby", fieldId + "-error");
    const errorEl = document.createElement("span");
    errorEl.id = fieldId + "-error";
    errorEl.className = "field-error";
    errorEl.setAttribute("role", "alert");
    errorEl.textContent = message;
    field.parentNode.appendChild(errorEl);
    field.focus();
  }

  function clearFieldErrors(form) {
    form.querySelectorAll(".field-error").forEach(function (el) { el.remove(); });
    form.querySelectorAll("[aria-invalid]").forEach(function (el) {
      el.removeAttribute("aria-invalid");
      el.removeAttribute("aria-describedby");
    });
  }
})();

(function initCopyright() {
  const copy = document.querySelector(".footer-copy");
  if (copy) {
    copy.textContent = `\u00A9 ${new Date().getFullYear()} Sentinel Tech - QA. All rights reserved.`;
  }
})();
