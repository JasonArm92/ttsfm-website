# TTS FM (UK) — Website

Marketing website for **TTS FM (UK)**, an integrated **security and facilities
management** provider operating across the North East and nationwide UK.

It's a hand-built **static site** — plain HTML, one shared stylesheet, and one
vanilla-JS file. There is **no build step, no framework, and no package
manager**: every page is a standalone `.html` file you can open directly in a
browser.

---

## Tech stack

- **HTML** — 23 standalone pages sharing a common nav, footer and components.
- **CSS** — a single design system in [`styles.css`](styles.css) (~2,400 lines):
  custom properties (colours, type scale, spacing), light/dark themes, and all
  component styles.
- **JavaScript** — one progressive-enhancement file, [`main.js`](main.js)
  (~240 lines). The site is fully readable with JS disabled; JS only adds
  motion and interactivity.
- **Third-party (CDN, no install):**
  - [Google Fonts](https://fonts.google.com/)
  - [Font Awesome 6.5](https://fontawesome.com/) (icons)
  - [Lenis](https://github.com/darkroomengineering/lenis) (smooth scroll)
  - [GSAP + ScrollTrigger](https://gsap.com/) (scroll animation)

---

## Project structure

```
.
├── index.html                     # Homepage
├── about.html
├── services.html                  # Services hub
│
│   # Service pages
├── security-services.html
├── facilities-management.html
├── property-services.html
├── cleaning-services.html
├── washroom-services.html
├── ground-maintenance-services.html
├── training-services.html
├── specialist-services.html
├── consumables.html
├── waste-management.html
│
│   # Company / content pages
├── case-studies.html
├── testimonials.html
├── careers.html
├── shining-star.html              # Employee recognition
├── news.html
├── contact.html
│
│   # Legal
├── privacy-policy.html
├── cookie-policy.html
├── terms-of-use.html
├── accessibility-policy.html
│
├── styles.css                     # Entire design system
├── main.js                        # Site-wide interactions
└── assets/
    ├── img/                       # Optimised images used by pages (.webp) + logo
    ├── acred-*.png                # Partner / accreditation logos (Partners band)
    └── *.png                      # Source hero/section images
```

---

## Design system & interactions

`styles.css` defines the look; `main.js` adds these behaviours (each is a small,
self-contained block):

- **Sticky nav** that turns solid/glass on scroll, with a mobile hamburger drawer.
- **Kinetic headline** — homepage hero headline builds in word by word.
- **Animated stat counters** — numbers count up when scrolled into view
  (`data-count` attribute).
- **Reveal on scroll** — elements with `.reveal` fade/slide in.
- **Magnetic buttons** — `.btn-magnetic` follow the cursor (desktop only).
- **Testimonial carousel** — manual, keyboard-accessible.
- **Photographic heroes** — see below.
- **Dark mode** — auto-injected toggle, persisted in `localStorage`.
- **Sticky mobile quote bar** — on every page except Contact.
- **Scroll-to-top** button and a subtle cursor-follow light on hero/CTA surfaces.

### Hero images (`data-hero-img`)

Photographic heroes are wired declaratively. `main.js` finds any hero section
with a `data-hero-img` attribute and injects the photo as a background layer
behind a dark gradient overlay (so white text stays legible):

```html
<section class="prop-hero" data-hero-img="assets/img/hero-security.webp"> … </section>
```

Two hero variants exist:

- **`.prop-hero`** — tall hero with headline + sub + buttons (homepage, service
  pages, Case Studies, Contact).
- **`.page-hero`** — compact banner with heading + breadcrumb (Testimonials,
  Careers, Shining Star, News).

### Partners & Accreditations band

The `.partners-band` shows partner/accreditation logos. These are **self-hosted**
in `assets/` as `acred-*.png` (each real logo composited onto a uniform white
"chip" so the set sits cleanly on the band background). Update the band by
swapping those files; no markup change is needed.

---

## Running locally

No tooling required — just open a page:

```bash
# Simplest: open index.html in your browser, or serve the folder
python3 -m http.server 8000
# then visit http://localhost:8000
```

A local server (rather than `file://`) is recommended so relative asset paths
behave exactly as in production.

---

## Editing & deploying

Changes are managed through **GitHub**. The site is static, so whatever is on
the default branch is what ships.

**To edit without a local clone** (e.g. via the GitHub web UI):

1. Open the file on GitHub and use the pencil/✏️ editor, or
   **Add file → Upload files** to drag in new/updated files.
2. Place files in the matching folder — page `.html` files at the repo **root**,
   images under **`assets/`** (optimised images under `assets/img/`).
3. **Commit** to publish.

> **Image tip:** pages reference images by exact path. If you add a new hero or
> section image, either reuse an existing filename or update the page's
> `src` / `data-hero-img` to match the file you uploaded. WebP is preferred for
> photos (far smaller than PNG); PNG works too if WebP isn't available.

---

## Conventions

- **British English** throughout copy.
- Shared **nav and footer** are duplicated in each HTML file — update them
  consistently across pages when links change.
- Prefer **existing CSS classes / components** over new bespoke styles, and keep
  `styles.css` as the single source of truth for the design system.
- Keep images **self-hosted** in `assets/` (avoid hot-linking to external URLs).
- News and Shining Star cards link out to live posts on `ttsfm.co.uk`.
