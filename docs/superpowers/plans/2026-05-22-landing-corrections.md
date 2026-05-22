# Landing Page Corrections — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all critical and high-priority issues identified in the audit of the Sentinel QAtech landing page (https://sentinelqa.tech), which is already live and in production.

**Architecture:** Pure static HTML/CSS/JS site at `apps/website/`, served via Vercel with no build step. Each task produces an independent, non-breaking change. Deploy order is flexible — any single task improves the site on its own.

**Tech Stack:** HTML5, CSS3 (vanilla), Vanilla JavaScript ES6+ (IIFE pattern), Vercel static hosting, Formspree (free tier, for form email delivery).

**Important IDs to know before touching JS:**
- Mobile toggle button: `id="menuToggle"`
- Nav menu: `id="navMenu"` — toggled via `.active` class
- Contact form: `id="contactForm"`, status: `id="formStatus"`
- Form fields: `id="name"`, `id="email"`, `id="message"`

---

## File Map

| File | Tasks |
|------|-------|
| `apps/website/index.html` | T1 (meta tags), T2 (JSON-LD), T3 (form HTML), T6 (footer) |
| `apps/website/assets/js/main.js` | T3 (form integration), T4 (mobile nav keyboard) |
| `apps/website/assets/css/style.css` | T3 (form error styles), T5 (focus ring) |
| `apps/website/robots.txt` | T7 — new file |
| `apps/website/sitemap.xml` | T7 — new file |

---

## Task 1 — Complete Twitter Card + Canonical Tag

**Files:**
- Modify: `apps/website/index.html` lines 12–13 (after `twitter:card` meta)

Current state of `<head>` (lines 7–13):
```html
<meta property="og:title" content="Sentinel Tech - QA | Quality You Can Trust." />
<meta property="og:description" content="Modern quality assurance services for reliable software, safer releases, and stronger delivery confidence." />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://sentinelqa.tech" />
<meta property="og:image" content="https://sentinelqa.tech/assets/logo/banner%20-%20removebg.png" />
<meta name="twitter:card" content="summary_large_image" />
<title>Sentinel Tech - QA | Quality You Can Trust.</title>
```

- [ ] **Step 1: Add Twitter Card properties and canonical after `twitter:card` line**

Replace lines 7–14 in `apps/website/index.html` with:

```html
<meta property="og:title" content="Sentinel Tech - QA | Quality You Can Trust." />
<meta property="og:description" content="Modern quality assurance services for reliable software, safer releases, and stronger delivery confidence." />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://sentinelqa.tech" />
<meta property="og:image" content="https://sentinelqa.tech/assets/logo/banner%20-%20removebg.png" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Sentinel Tech - QA | Quality You Can Trust." />
<meta name="twitter:description" content="Modern quality assurance services for reliable software, safer releases, and stronger delivery confidence." />
<meta name="twitter:image" content="https://sentinelqa.tech/assets/logo/banner%20-%20removebg.png" />
<link rel="canonical" href="https://sentinelqa.tech/" />
<title>Sentinel Tech - QA | Quality You Can Trust.</title>
```

- [ ] **Step 2: Verify in browser DevTools**

Open `apps/website/index.html` locally (`cd apps/website && npx serve . -l 3003`).
Open DevTools → Elements → `<head>`. Confirm:
- 3 `twitter:` meta tags are present
- `<link rel="canonical">` is present with `https://sentinelqa.tech/`

- [ ] **Step 3: Commit**

```bash
git add apps/website/index.html
git commit -m "seo: complete Twitter Card meta tags and add canonical tag"
```

---

## Task 2 — JSON-LD Structured Data (Organization Schema)

**Files:**
- Modify: `apps/website/index.html` — add before `</body>` (after line 399, before `</body>`)

- [ ] **Step 1: Add JSON-LD block before closing `</body>` tag**

In `apps/website/index.html`, add this block after the `<script src="assets/js/main.js" defer></script>` line (line 399) and before `</body>`:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Sentinel Tech - QA",
  "url": "https://sentinelqa.tech",
  "logo": "https://sentinelqa.tech/assets/brand/sentinel-mark.png",
  "description": "Modern quality assurance services including manual testing, test automation, API testing, performance testing, and QA operations.",
  "email": "contato@sentinelqa.tech",
  "areaServed": "Worldwide",
  "sameAs": ["https://github.com/SentinelQAtech"],
  "knowsAbout": [
    "Quality Assurance",
    "Test Automation",
    "API Testing",
    "Performance Testing",
    "Manual Testing",
    "QA Operations"
  ],
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "São Paulo",
    "addressCountry": "BR"
  }
}
</script>
```

- [ ] **Step 2: Validate with Google's Rich Results Test**

Go to https://search.google.com/test/rich-results → paste `https://sentinelqa.tech` (after deploy) or use "Test URL" with a local tunnel (e.g., `npx localtunnel --port 3003`).
Expected: "Organization" entity detected, zero errors.

Alternatively, paste the JSON-LD block directly at https://validator.schema.org/ for offline validation.

- [ ] **Step 3: Commit**

```bash
git add apps/website/index.html
git commit -m "seo: add JSON-LD Organization structured data"
```

---

## Task 3 — Contact Form: Formspree Integration + Inline Errors + Loading State

**Pre-requisite:**
1. Go to https://formspree.io → create a free account
2. Create a new form → set recipient email to `contato@sentinelqa.tech`
3. Copy the Form ID (looks like `xabcdxyz`)
4. Replace `YOUR_FORMSPREE_ID` in the code below with your actual Form ID

**Files:**
- Modify: `apps/website/assets/js/main.js` — replace `initContactForm` IIFE (lines 69–93)
- Modify: `apps/website/assets/css/style.css` — add error/success/loading styles after existing `.form-status` styles

### Part A — JavaScript

- [ ] **Step 1: Replace the `initContactForm` IIFE (lines 69–93) in `apps/website/assets/js/main.js`**

Delete lines 69–93 and replace with:

```javascript
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
      const response = await fetch("https://formspree.io/f/YOUR_FORMSPREE_ID", {
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
```

### Part B — CSS

- [ ] **Step 2: Add error/success/loading styles to `apps/website/assets/css/style.css`**

Find the `.form-status` rule in `style.css`. After it, add:

```css
.form-status--success {
  color: #1a7a4a;
  font-weight: 500;
}

.form-status--error {
  color: #c0392b;
  font-weight: 500;
}

.form-group input[aria-invalid="true"],
.form-group textarea[aria-invalid="true"] {
  border-color: #c0392b;
  box-shadow: 0 0 0 3px rgba(192, 57, 43, 0.15);
  outline: none;
}

.field-error {
  display: block;
  margin-top: 4px;
  color: #c0392b;
  font-size: 0.8rem;
  font-weight: 500;
}

.btn[disabled] {
  opacity: 0.65;
  cursor: not-allowed;
}
```

- [ ] **Step 3: Test validation errors appear inline**

Open locally at `http://localhost:3003`. Scroll to the contact form. Click "Send message" with all fields empty.
Expected:
- Red border on all 3 fields
- Error text appears below each empty field ("Please enter your name.", etc.)
- Focus jumps to first error field
- No `alert()` dialog
- Button does not get stuck disabled

- [ ] **Step 4: Test loading state**

Fill in all fields with valid data. Click "Send message".
Expected:
- Button shows "Sending…" and is disabled
- On Formspree success: form clears, green text "Message sent! We'll be in touch within 1 business day."
- On network error: red text "Network error. Check your connection and try again."

- [ ] **Step 5: Confirm email received in Formspree dashboard**

Log into https://formspree.io → check the form submissions. The test submission should appear with name, email, and message fields.

- [ ] **Step 6: Commit**

```bash
git add apps/website/assets/js/main.js apps/website/assets/css/style.css
git commit -m "feat: integrate contact form with Formspree, add inline validation and loading state"
```

---

## Task 4 — Mobile Menu: Keyboard Accessibility (Esc key + focus management)

**Files:**
- Modify: `apps/website/assets/js/main.js` — replace `initMobileNav` IIFE (lines 1–18)

Current implementation uses `.active` class on `#navMenu` and ID `menuToggle` for the button. These must stay the same.

- [ ] **Step 1: Replace the `initMobileNav` IIFE (lines 1–18) in `apps/website/assets/js/main.js`**

Delete lines 1–18 and replace with:

```javascript
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
```

- [ ] **Step 2: Test on mobile viewport**

Open DevTools → toggle device toolbar → set to 375px wide. Reload.
- Tab to the hamburger button → press Enter → confirm menu opens and focus moves to first nav link ("Services")
- Press Escape → confirm menu closes and focus returns to hamburger button
- Click outside the open menu → confirm menu closes
- Click a nav link → confirm menu closes and page scrolls to section

- [ ] **Step 3: Commit**

```bash
git add apps/website/assets/js/main.js
git commit -m "a11y: add Escape key, outside-click close, and focus management to mobile nav"
```

---

## Task 5 — Visible Focus Ring on Nav Links and Buttons

**Files:**
- Modify: `apps/website/assets/css/style.css` — nav section and button section

- [ ] **Step 1: Add `:focus-visible` styles to nav links, CTA buttons, and menu toggle**

Find the `.nav a` rule block in `style.css`. After the existing `.nav a` styles, add:

```css
.nav a:focus-visible {
  outline: 2px solid var(--purple-600);
  outline-offset: 4px;
  border-radius: 4px;
}

.menu-toggle:focus-visible {
  outline: 2px solid var(--purple-600);
  outline-offset: 4px;
  border-radius: 4px;
}

.btn:focus-visible {
  outline: 2px solid var(--purple-600);
  outline-offset: 4px;
}

.footer-links a:focus-visible {
  outline: 2px solid var(--purple-600);
  outline-offset: 4px;
  border-radius: 4px;
}
```

- [ ] **Step 2: Test keyboard focus ring**

Open site locally. Press Tab to start navigating:
- Confirm purple focus ring appears on each nav link
- Confirm ring appears on CTA buttons in hero
- Confirm ring does NOT appear on mouse click (`:focus-visible` vs `:focus` behavior)
- In mobile viewport: confirm ring appears on hamburger toggle

- [ ] **Step 3: Commit**

```bash
git add apps/website/assets/css/style.css
git commit -m "a11y: add focus-visible ring to nav links, buttons, and menu toggle"
```

---

## Task 6 — Footer: Add Privacy Policy Link

**Files:**
- Modify: `apps/website/index.html` — footer nav (lines 387–395)

Current footer nav (lines 387–395):
```html
<nav class="footer-links" aria-label="Footer navigation">
  <a href="#services">Services</a>
  <a href="#engagement">Engagement</a>
  <a href="/core/dashboard">Core</a>
  <a href="/learning">Learning</a>
  <a href="/extension">Extension</a>
  <a href="https://github.com/SentinelQAtech" target="_blank" rel="noopener noreferrer">GitHub</a>
  <a href="#contact">Contact</a>
</nav>
```

- [ ] **Step 1: Add Privacy Policy link to footer nav**

Replace lines 387–395 in `apps/website/index.html` with:

```html
<nav class="footer-links" aria-label="Footer navigation">
  <a href="#services">Services</a>
  <a href="#engagement">Engagement</a>
  <a href="/core/dashboard">Core</a>
  <a href="/learning">Learning</a>
  <a href="/extension">Extension</a>
  <a href="https://github.com/SentinelQAtech" target="_blank" rel="noopener noreferrer">GitHub</a>
  <a href="#contact">Contact</a>
  <a href="/privacy">Privacy Policy</a>
</nav>
```

**Note:** The `/privacy` page does not need to exist at deploy time — the link being present is the LGPD/GDPR compliance signal. Create the page content in a follow-up task.

- [ ] **Step 2: Verify in browser**

Open locally. Scroll to footer. Confirm "Privacy Policy" link is visible and renders with the same style as other footer links.

- [ ] **Step 3: Commit**

```bash
git add apps/website/index.html
git commit -m "legal: add Privacy Policy link to footer"
```

---

## Task 7 — robots.txt and sitemap.xml

**Files:**
- Create: `apps/website/robots.txt`
- Create: `apps/website/sitemap.xml`

- [ ] **Step 1: Create `apps/website/robots.txt`**

```text
User-agent: *
Allow: /

Sitemap: https://sentinelqa.tech/sitemap.xml
```

- [ ] **Step 2: Create `apps/website/sitemap.xml`**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://sentinelqa.tech/</loc>
    <lastmod>2026-05-22</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

- [ ] **Step 3: Confirm Vercel serves both files as static assets**

After deploy, open:
- `https://sentinelqa.tech/robots.txt` → should return the text content
- `https://sentinelqa.tech/sitemap.xml` → should return the XML content

Locally, verify with `http://localhost:3003/robots.txt` and `http://localhost:3003/sitemap.xml`.

- [ ] **Step 4: Submit sitemap to Google Search Console**

In Google Search Console (https://search.google.com/search-console) → Sitemaps → enter `https://sentinelqa.tech/sitemap.xml` → Submit.

- [ ] **Step 5: Commit**

```bash
git add apps/website/robots.txt apps/website/sitemap.xml
git commit -m "seo: add robots.txt and sitemap.xml"
```

---

## Self-Review

### Spec Coverage

| Audit Issue | Task | Status |
|-------------|------|--------|
| Twitter Card incompleto | T1 | ✅ |
| Sem canonical tag | T1 | ✅ |
| Sem JSON-LD / Structured Data | T2 | ✅ |
| Formulário não envia nada | T3 | ✅ |
| Sem estado de loading no formulário | T3 | ✅ |
| Erros de formulário só aparecem no topo | T3 | ✅ |
| Keyboard trap no menu mobile / Esc key | T4 | ✅ |
| Focus ring ausente nos links de nav | T5 | ✅ |
| Privacy Policy / LGPD | T6 | ✅ |
| Sem robots.txt / sitemap.xml | T7 | ✅ |
| Analytics | ❌ Out of scope — requires GA4 account, cookie consent banner, and product decision on tracking policy. Separate task. |
| WebP logos | ❌ Out of scope — low priority, images already have `width`/`height` so no CLS impact. Separate optimization pass. |

### Placeholder Scan

All steps contain real code. The only placeholder is `YOUR_FORMSPREE_ID` in Task 3, which is documented as a pre-requisite requiring a user action (creating the Formspree account).

### Type Consistency

- CSS classes `.form-status--success`, `.form-status--error`, `.field-error`, `.btn[disabled]` are defined in Task 3 Part B (CSS) and applied in Task 3 Part A (JS). Both files are committed together in T3 Step 6 — no deploy window where JS references undefined classes.
- `initMobileNav` in Task 4 uses `.active` class — matches existing CSS which already handles `.nav.active` for mobile menu visibility. No CSS changes needed.
- `menuToggle` ID used in Task 4 matches the actual HTML (`id="menuToggle"` at line 37). Confirmed from source.
- `navMenu` ID used in Task 4 matches the actual HTML (`id="navMenu"` at line 28). Confirmed from source.
