# TTS FM — Website Upgrade Plan 2026
### From "clean & professional" to "the best-designed company website in the North East"

> **Brief:** Make ttsfm.co.uk sleek, modern and premium — genuinely best-in-class, not just best-in-sector.
> **Constraint:** Stays a static site (HTML/CSS/JS) on GitHub Pages — no heavy framework, no mandatory build step.
> **Positioning North Star:** *Quiet confidence, engineered precision.* We want the polish of Linear / Stripe / Vercel applied to a UK security & facilities-management firm — authoritative and trustworthy, never a gimmicky agency showreel. Every effect must earn its place by building trust or guiding the eye.

---

## 0. What the research says (and how it maps to us)

This plan is grounded in 2026 design research — Awwwards / CSS Design Awards exemplars, trend reports (Envato, Figma, TheeDigital, Lovable, Fontfabric, Lounge Lizard), B2B-conversion studies (Axon Garside, Grafit, SaaS landing-page analyses), and motion/GSAP technique guides.

**The dominant 2026 movements:**

| Movement | What it means | Verdict for TTS FM |
|---|---|---|
| **Typography as the hero** | Oversized, expressive, *variable* type that moves; serif headlines making a comeback for "trust & authority" | **Adopt fully.** Serif-for-authority is tailor-made for a security firm. |
| **Kinetic / variable type** | Weight & width mapped to scroll; letters that build, breathe, expand on hover | **Adopt, restrained.** One signature kinetic headline per key page, not everywhere. |
| **Bento grids** | Apple-style modular cards of varying sizes; each cell = one self-contained story (a stat, a feature, a quote) | **Adopt.** Perfect for "our services" and "why us" — scannable but rewarding. |
| **Glassmorphism (as accent)** | Frosted translucent cards over gradient/imagery, soft blur + depth | **Adopt sparingly** — floating stat cards over the hero, nav-on-scroll. |
| **Spatial depth / layering** | Shadows, parallax layers, elements that float above the page | **Adopt subtly** for hero & section transitions. |
| **Scroll-driven motion (GSAP ScrollTrigger + smooth scroll)** | Pinning, scrubbing, staggered reveals, counters | **Adopt** as the backbone of the "premium" feel. |
| **Warm/earthy OR high-contrast + single accent palettes** | Either grounded earth tones, or crisp black/white + one bold accent | **Adopt the high-contrast path** — deep navy + one disciplined lime accent. |
| **Dark mode as an option** | Expected across industries | **Phase 3** — ship a proper dark theme. |

**What the research says to KILL (all present on our site today):**

- ❌ **Auto-rotating carousels / hero sliders** — "ignored, heavy, inaccessible." *We have two: the homepage hero slideshow AND the footer regional carousel.*
- ❌ **Generic stock / hotlinked imagery** — "erodes trust." *Every image is hotlinked from the old WordPress domain — a performance, reliability and credibility liability.*
- ❌ **Mega-menus with dozens of options** — "confuse visitors, slow decisions." *Our services dropdown has 10 flat items.*
- ❌ **Purposeless heavy animation** — must respect `prefers-reduced-motion`.
- ❌ **"Contact Us" as the primary CTA** — "the laziest CTA in B2B; tells visitors nothing about what happens next."

**Exemplars to study (and what to steal):**
- **Stripe** — flowing gradient that animates between sections; micro-animations where *every* interaction feels intentional; one-sentence value prop above the fold.
- **Linear** — dark, precise typography, scroll-triggered reveals that load instantly; "less is more, every pixel calibrated."
- **Vercel** — live metrics + animated technical visuals; leads with social proof.
- **Datadog** — split-screen hero balancing text and an interactive visual.
- **Apple** — the canonical bento grid.

---

## 1. Design-system overhaul (the foundation — `styles.css` tokens)

Everything else builds on a refreshed token layer. Current tokens are fine but flat; we add depth, fluidity and motion primitives.

### 1.1 Colour — keep the brand, add depth & discipline
Current: navy `#0A2540`, lime `#B4CA52`, blue `#046bd2`, light `#F0F5FA`.

```
/* Core brand (retain) */
--ink-900:  #06182B;   /* NEW deepest navy — premium dark sections, glass base */
--ink-800:  #0A2540;   /* existing navy — headings, dark bg */
--ink-700:  #143759;   /* mid navy — gradient stops, borders on dark */
--text:     #475569;   /* body (slightly deepened from #4A5568 for AA contrast) */

/* Accent — discipline to ONE signal colour */
--lime:       #B4CA52;  /* brand lime (retain for recognition) */
--lime-bright:#C7E04A;  /* NEW brighter "signal" tint for CTAs/highlights on dark */
--lime-dark:  #96AA3A;

--blue:     #046BD2;    /* secondary action / links */

/* Surfaces & glass */
--surface:        #FFFFFF;
--surface-muted:  #F0F5FA;
--surface-sunken: #E7EEF6;   /* NEW */
--glass-light: rgba(255,255,255,.08);   /* frosted card on dark */
--glass-border: rgba(255,255,255,.14);

/* Signature gradient mesh (Stripe-style, used on hero & CTA bands) */
--mesh: radial-gradient(at 20% 20%, #143759 0, transparent 50%),
        radial-gradient(at 80% 0%,  #046BD2 0, transparent 45%),
        radial-gradient(at 70% 80%, #0A2540 0, transparent 50%),
        #06182B;
```
**Principle:** lime is *the* accent — used only for emphasis, CTAs and active states. Blue is the workhorse secondary. No third accent. High-contrast + one bold accent is exactly the 2026 path that reads as "premium," not "busy."

### 1.2 Typography — variable fonts + an editorial serif for authority
Current: Poppins (display) + Inter (body), static weights.

**Recommended pairing (all free, all variable, self-hosted via `@font-face` woff2):**
- **Display / headings → `Hanken Grotesk` Variable** (or `Geist`) — confident, modern, technical. Replaces Poppins.
- **Body → `Inter` Variable** — keep (industry-standard, already in use).
- **Statement serif → `Fraunces` Variable** — for *one* big editorial headline per hero/About ("Protecting what matters across the North East"). This is the 2026 "serif = trust & authority" cue, and it differentiates us instantly from every competitor running Poppins/Open Sans.
- **Numerals / stats → `Geist Mono`** — monospaced figures for stat counters & accreditation numbers give a precise, security-tech credibility.

```
--font-display: 'Hanken Grotesk', system-ui, sans-serif;
--font-serif:   'Fraunces', Georgia, serif;       /* statement lines only */
--font-body:    'Inter', system-ui, sans-serif;
--font-mono:    'Geist Mono', ui-monospace, monospace;
```

**Fluid type scale** (replaces fixed clamps with a consistent ratio):
```
--step--1: clamp(0.83rem, 0.8rem + 0.15vw, 0.9rem);
--step-0:  clamp(1rem,   0.95rem + 0.25vw, 1.125rem);
--step-1:  clamp(1.25rem,1.1rem + 0.6vw,  1.5rem);
--step-2:  clamp(1.6rem, 1.3rem + 1.2vw,  2.25rem);
--step-3:  clamp(2.1rem, 1.6rem + 2.2vw,  3.25rem);
--step-4:  clamp(2.6rem, 1.8rem + 4vw,    4.75rem);  /* hero statement */
```
Tighten display tracking to `-0.02em`; set headings to variable weight `620–680` for a sharper, more bespoke feel than stock 700.

### 1.3 Spacing, radius, elevation, motion primitives
```
--radius-sm: 8px; --radius: 14px; --radius-lg: 22px;   /* up from 4/8/16 — softer, more premium */
--shadow-sm: 0 1px 3px rgba(10,37,64,.08);
--shadow-md: 0 8px 24px rgba(10,37,64,.10);
--shadow-lg: 0 24px 60px rgba(10,37,64,.16);
--shadow-glow: 0 0 0 1px var(--glass-border), 0 20px 50px rgba(4,107,210,.18);

--ease-out: cubic-bezier(.16,1,.3,1);     /* the "expensive" easing */
--ease-in-out: cubic-bezier(.65,.05,.36,1);
--dur-1: .2s; --dur-2: .45s; --dur-3: .7s;
```
Move section rhythm to a fluid `--section: clamp(64px, 8vw, 128px)`.

---

## 2. Signature interactions & motion (the "sexy" layer)

Backbone libraries, all CDN-loadable (no build step) and gated behind `prefers-reduced-motion`:
- **Lenis** (~3kb) — buttery smooth scroll. This single change makes the whole site *feel* premium.
- **GSAP + ScrollTrigger** — reveals, pinning, scrubbing, counters.
- Everything else is vanilla CSS/JS.

**Performance budget:** LCP < 2.0s, CLS < 0.05, total JS < 90kb gzipped, 60fps scroll. If an effect can't hold the budget on a mid-range phone, it's desktop-only or cut.

### Signature moments (deliberately limited — restraint *is* the premium signal):
1. **Kinetic hero headline** — the serif statement line builds word-by-word on load and its variable weight subtly responds to scroll. One per page, hero only.
2. **Ambient gradient mesh** — the Stripe-style `--mesh` slowly drifts behind the hero (CSS `@property` + keyframes, GPU-cheap). Replaces the auto-slideshow entirely.
3. **Glass stat cards floating over the hero** — "27+ yrs," "5 UK regions," "24/7 response," "SIA approved" — frosted, with a soft parallax drift.
4. **Staggered bento reveals** — service/why-us cells rise + fade in sequence as they enter view (ScrollTrigger, `--ease-out`).
5. **Animated stat counters** — numbers count up once in view, in `Geist Mono`.
6. **Magnetic primary CTAs** — button nudges toward the cursor within a small radius; lime glow on hover. Desktop only.
7. **Scroll-reveal section dividers** — thin lime rule "draws" itself across as you reach a new section.
8. **Nav glass-on-scroll** — transparent over hero → frosted glass + condensed once scrolled.

> Reduced-motion users get all content instantly with simple fades only — no movement, no parallax, no counters animating. This also satisfies our own published Accessibility Policy.

---

## 3. Component upgrades

| Component | Today | Upgrade |
|---|---|---|
| **Top nav** | White sticky, 10-item flat services dropdown | Transparent→glass on scroll; restructure dropdown into a **2-column mega-panel grouped by category** (Security · FM · Property · People) with tiny icons + one-line descriptions. Fewer cognitive units, not fewer links. |
| **Homepage hero** | Auto-rotating slideshow + overlay | **Single, decisive hero**: kinetic serif statement, one-sentence value prop, gradient-mesh + one high-quality owned image, glass stat cards, tiered CTAs. Kills the carousel. |
| **Services** | 4-col equal `service-card` grid | **Bento grid** — varied cell sizes, the flagship service (Security) gets a large feature cell with imagery; hover = lime top-border + lift + subtle inner gradient. |
| **Why-us / benefits** | Plain check-lists | Mixed bento of stat cells (animated counters) + icon cells + one testimonial cell. |
| **Partners** | Grayscale→colour on hover (good) | Keep the interaction; add a slow, *manually-pausable* marquee (respects reduced-motion — static when set). |
| **Testimonials** | Manual carousel (acceptable) | Keep, but restyle as a glass card over `--ink-900`; add company logo + verifiable role; show 3-up on desktop instead of 1. |
| **CTA bands** | Flat navy | Gradient-mesh background + magnetic button + a single trust line ("Trusted by 200+ UK sites"). |
| **Footer regional carousel** | **Auto-advancing every 3.5s** | **Replace** with a static **interactive UK region selector** — a clean map or bento of the 5 regions; click/hover reveals coverage. No auto-motion. |
| **Footer** | Solid 4-col | Add a slim pre-footer CTA strip; keep structure; logos self-hosted. |

---

## 4. Page-by-page priorities

1. **Homepage** — the flagship. New hero, bento services, animated stats, social proof woven throughout (not just bottom), tiered CTAs. This is 60% of the "wow."
2. **Services hub (`services.html`)** — bento overview linking to the sub-pages we just built; clear category grouping.
3. **Service sub-pages** (the 9 we built) — apply the new tokens, swap the per-page `<style>` blocks for shared component classes, add bento "benefits," upgrade hero to gradient-mesh, magnetic CTAs. *Big consistency win since they share structure.*
4. **About** — the emotional/authority page: big Fraunces statement, leadership bento, animated company-history timeline, values. Strong fit for the serif-authority cue.
5. **Case Studies / Testimonials** — proof engine: filterable bento of case cards, metric-led ("cut incidents 38%"), logos.
6. **Contact** — split-screen (Datadog pattern): form left, map + direct lines + response-time promise right. Inline validation, friendly success state.
7. **Policy pages** (4 we built) — light touch: new type scale + reading width; they're already clean.

---

## 5. Trust & conversion layer (B2B-specific, research-backed)

- **CTA rewrite — tiered, action-oriented** (replace every "Contact Us"):
  - Low commitment: **"See our services"**
  - Medium: **"Book a 15-min consultation"**
  - High: **"Get your free site security assessment"**
- **Hero must answer What / Who / Why in 5 seconds** — rewrite headline to a benefit, not a slogan.
- **Social proof throughout** — client logos under hero, a stat band early, a testimonial inside the services section, accreditations in the footer. Not one block at the bottom.
- **Surface accreditations as badges** — SIA Approved Contractor, ISO 9001/14001/45001, Living Wage, Safe Contractor, Constructionline, ACS Pacesetters. These are gold for a security/FM buyer; show them prominently.
- **Quantify everything** — years operating, sites covered, response time, staff trained, regions. Animated counters make them land.
- **Add a sticky mobile "Get a quote" bar** for one-tap conversion.

---

## 6. Performance & accessibility guardrails (non-negotiable)

- **Self-host all imagery** in `/assets/img/` — currently *every* image hotlinks `ttsfm.co.uk`. Convert to **WebP/AVIF**, add explicit `width`/`height` (kills CLS), `loading="lazy"` below the fold, responsive `srcset`. This is the single biggest performance + reliability fix.
- **Self-host fonts** (woff2, `font-display: swap`, preload the two critical faces) — removes the Google Fonts request chain.
- **`prefers-reduced-motion`** honoured globally; every animation has a static fallback.
- **WCAG 2.2 AA** — verify lime-on-white and text contrast (tune `--text` darker), visible focus rings, full keyboard nav for the mega-menu and region selector, `aria-live` on the contact success state. We *publish* an accessibility policy — the site must clear the bar it sets.
- **Core Web Vitals** as the acceptance test for each phase.

---

## 7. Technical approach (stays GitHub-Pages-simple)

- **No framework required.** Vanilla HTML/CSS/JS + Lenis + GSAP via CDN (or self-hosted in `/assets/js/vendor/`).
- **Optional, recommended:** a tiny build step later (Vite or even a shell script) to (a) extract the repeated nav/footer into partials so we stop hand-editing 13 files, and (b) minify CSS/JS + generate AVIF. Not required for Phase 1.
- **Refactor debt to clear:** the service sub-pages each carry a duplicated `<style>` block — migrate those rules into `styles.css` as shared components so the design system is single-source.
- Keep the existing `--no-gpg-sign` commit + `-u origin main` push workflow.

---

## 8. Phased roadmap

**Phase 1 — Foundation & Homepage (the headline upgrade)**
Token overhaul in `styles.css`; self-host fonts + hero imagery; Lenis + GSAP wired with reduced-motion guard; rebuild homepage hero (kill slideshow), bento services, animated stats, woven social proof, tiered CTAs, glass-on-scroll nav. → *80% of the visible "wow" lands here.*

**Phase 2 — Roll the system across all pages**
Migrate the 9 service sub-pages + services hub to shared components & new hero; rebuild About (serif statement + timeline); upgrade Contact (split-screen + validation); replace footer regional carousel with the region selector; self-host remaining images.

**Phase 3 — Depth & delight**
Dark mode; case-studies proof engine; kinetic-type signature moment; mega-menu icons + descriptions; sticky mobile quote bar; marquee partners; final CWV + AA audit; optional build step + partials refactor.

---

## 9. Why this wins "best in the North East"

Regional competitors (security & FM) overwhelmingly run dated WordPress themes with stock photography, auto-sliders and "Contact Us" buttons — *exactly* the patterns 2026 research says to kill. By shipping **owned imagery, a disciplined high-contrast palette, an editorial-serif authority cue, genuine scroll-craft (Lenis + GSAP), bento storytelling, animated proof, and accessibility that actually passes**, TTS FM won't just look better than the local field — it'll stand next to Linear/Stripe-tier work while staying unmistakably a serious, trustworthy security & facilities partner. Premium through *restraint and precision*, not noise.

---

*Plan authored June 2026. Grounded in 2026 design research (Awwwards/CSSDA exemplars; Envato, Figma, TheeDigital, Lovable, Fontfabric, Lounge Lizard trend reports; Axon Garside/Grafit B2B-conversion studies; GSAP/Lenis motion guides). Next step on approval: begin Phase 1.*
