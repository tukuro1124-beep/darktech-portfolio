# Dark Tech Bilingual Portfolio — Component Spec v4.13 (Vanilla HTML/CSS/JS — Remaining Gaps Covered)
> This is v4 **plus**: naming conventions, **full HTML blueprint**, **components.css skeleton**, **JS module contracts**, content mapping, caching/concurrency, skeleton/toast specs, and print/export notes.  
> Still: **NO React, NO Tailwind**. Static site, vanilla ES modules.

---

## 0) Quick changelog from v4 → v4.1
Added:
- **CSS naming convention** (BEM-ish) + allowed utility classes
- **Full index.html blueprint** (IDs/classes fixed)
- **components.css skeleton** (card/button/pill/navbar/drawer/tiles/placeholder/skeleton/toast/line-clamp)
- **JS contracts per module** (exports, function signatures, event flow)
- **Content mapping table** (JSON keys → DOM nodes)
- **Fetch concurrency + caching** (AbortController, keep last good content)
- **Mobile drawer a11y** (focus trap + aria patterns)
- **Print stylesheet** (optional “export to PDF”)
- **Hard acceptance checklist** (expanded)

---

## 1) Scope & non-goals
### Scope
- Single-page portfolio with “soft dark tech” look.
- Background is **PURE BLACK (#000)** with a reserved background layer (`#bg-layer` / `#bg-canvas`).
- Fully bilingual via EN/VI toggle; copy is loaded from JSON in `/public/CV/`.
- Responsive bento layout + subtle micro-animations.
- `prefers-reduced-motion` support.

### Non-goals
- No frameworks (React/Vue/etc.).
- No utility frameworks (Tailwind).
- No default animated gradients/blobs (you will plug your own background animation).

---

## 2) Data contract
### 2.1 Paths (hard requirements)
- `/public/CV/portfolio.en.json`
- `/public/CV/portfolio.vi.json`
- Optional: `/public/CV/cv.pdf`
- Optional: `/public/images/featured.png` (or path given in JSON)

### 2.2 JSON schema (typed contract)
```json
{
  "meta": {
    "name_en": "", "name_vi": "", "title": "",
    "location": "", "email": "", "phone": "",
    "links": { "github": "", "linkedin": "", "portfolio": "", "cv": "/CV/cv.pdf" }
  },
  "hero": {
    "badge": "", "tagline": "",
    "about_paragraphs": ["", ""],
    "current_line": ""
  },
  "impact": {
    "title": "", "subtitle": "",
    "metrics": [{ "value": "", "label": "", "note": "" }]
  },
  "featured": {
    "title": "",
    "project": {
      "name": "", "meta": "", "context": "", "role": "",
      "bullets": ["", "", ""],
      "architecture": ["", "", ""],
      "tech_chips": ["", ""],
      "links": { "case_study": "", "repo": "", "demo": "" },
      "image": "/images/featured.png"
    }
  },
  "more_work": {
    "title": "", "subtitle": "",
    "items": [{ "name": "", "meta": "", "desc": "" }]
  },
  "experience": {
    "title": "", "subtitle": "",
    "items": [{ "date": "", "role": "", "desc": "" }]
  },
  "skills": { "title": "", "items": [{ "key": "", "value": "" }] },
  "contact": {
    "title": "", "subtitle": "", "cta": "",
    "links": [{ "label": "Email", "href": "mailto:..." }]
  },
  "footer": { "note": "" }
}
```

### 2.3 Invariants
- `impact.metrics` can be 0..N → layout auto-flows.
- Missing `featured.project.image` → show placeholder (diagonal stripes).
- Missing `meta.links.cv` or missing file → hide/disable Download CV button.
- Missing optional links → hide buttons; never show broken anchors.
- Vietnamese copy can be longer → cards must grow (no absolute-positioned text blocks).

---

## 3) Design tokens (CSS variables only)
Create: `/src/styles/tokens.css`.

```css
:root{
  --bg:#000000;
  --card:#05070C;
  --cardInner:#070B16;
  --border:#1F2A40;
  --text:#E5E7EB;
  --muted:#94A3B8;
  --cyan:#22D3EE;
  --violet:#A78BFA;
  --mint:#A7F3D0;

  --r-card:28px;
  --r-card-sm:24px;
  --r-inner:20px;
  --r-pill:999px;

  --shadow-card:0 10px 26px rgba(0,0,0,0.35);
  --glow-cyan:0 0 24px rgba(34,211,238,0.12);

  --nav-h:60px;

  /* spacing scale */
  --s-4:4px; --s-8:8px; --s-12:12px; --s-16:16px; --s-20:20px; --s-24:24px;
  --s-28:28px; --s-32:32px; --s-40:40px; --s-48:48px; --s-56:56px; --s-64:64px;

  /* fluid container padding */
  --pad-x:clamp(16px, 4vw, 48px);

  /* typography clamps */
  --h1:clamp(34px, 3.6vw, 56px);
  --h2:clamp(20px, 2.2vw, 30px);
  --h3:clamp(14px, 1.2vw, 16px);
  --body:clamp(14px, 1.1vw, 16px);
}
@media (max-width: 639px){
  :root{ --nav-h:56px; }
}
```

**Token rules**
- NO hardcoded hex values inside component CSS except in `tokens.css`.
- All spacing uses the scale variables above (avoid random values).

---

## 4) Typography + font loading (VN/EN)
### 4.1 Recommended font
- Primary: **Be Vietnam Pro** (wght 400/500/600/700)
- Fallback: Inter → system-ui → Segoe UI → Roboto

### 4.2 Head import (static)
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### 4.3 Base CSS (`base.css`)
```css
html{ font-family:"Be Vietnam Pro", Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif; }
body{
  background:var(--bg); color:var(--text);
  line-height:1.6;
  -webkit-font-smoothing:antialiased;
  text-rendering:optimizeLegibility;
}
h1{ font-size:var(--h1); line-height:1.08; letter-spacing:-0.02em; margin:0; }
h2{ font-size:var(--h2); line-height:1.2; margin:0; }
h3{ font-size:var(--h3); line-height:1.25; margin:0; }
p{ font-size:var(--body); margin:0; color:var(--text); }
small, .text-sm{ font-size:12.5px; color:var(--muted); }
```
VN safety: avoid body line-height < 1.5 (diacritics clipping).

---

## 5) CSS naming convention (NEW)
### 5.1 Naming style
- Use **BEM-ish** block naming for components:
  - `.navbar`, `.navbar__left`, `.navbar__links`, `.navbar__drawer`
  - `.hero`, `.hero__badge`, `.hero__cta`
  - `.impact`, `.impact__grid`, `.metric-tile`
- Modifiers:
  - `.card--inner`, `.card--interactive`
  - `.btn--primary`, `.btn--secondary`
  - `.is-visible`, `.is-active`, `.is-loading`, `.is-open`

### 5.2 Allowed “micro utilities” (few only)
These keep HTML readable without Tailwind:
- `.u-muted` (color muted)
- `.u-mono` (mono font)
- `.u-sr-only` (screen reader only)
- `.u-line-clamp-1/2/3/5/6`
- `.u-hidden` (display none)
- `.u-flex`, `.u-grid` (sparingly)

Rule: **No utility soup**. Keep 80% styling in component classes.

---

## 6) Layout system (vanilla CSS)
Create `/src/styles/layout.css`.

### 6.1 Breakpoints
- Mobile: `<640px`
- Tablet: `640–1023px`
- Desktop: `>=1024px`
- Wide: `>=1440px`

### 6.2 Container + sections
```css
.container{ max-width:1240px; margin:0 auto; padding-inline:var(--pad-x); }
.main{ position:relative; z-index:10; padding-top:calc(var(--nav-h) + 28px); }
.section{ margin-top:clamp(18px, 3vw, 40px); scroll-margin-top:calc(var(--nav-h) + 16px); }
```
Note: `.main` top padding ensures content doesn’t hide behind sticky nav.

### 6.3 Desktop grids
```css
.topband{
  display:grid;
  grid-template-columns:minmax(0, 1.62fr) minmax(0, 1fr);
  gap:24px;
  align-items:stretch;
}
@media (min-width: 1024px){
  .topband > .card{ min-height:clamp(340px, 38vh, 380px); }
}
@media (max-width: 1023px){
  .topband > .card{ min-height:auto; }
}

.featured-grid{ display:grid; grid-template-columns:minmax(0, 1.5fr) minmax(0, 1fr); gap:24px; }

.bottom-bento{ display:grid; grid-template-columns:minmax(0, 1.83fr) minmax(0, 1.33fr) minmax(0, 1fr); gap:20px; }
```
### 6.4 Tablet & mobile rules
```css
@media (max-width: 1023px){
  .topband{ grid-template-columns:1fr; gap:22px; }
  .featured-grid{ grid-template-columns:1fr; gap:18px; }
  .bottom-bento{ grid-template-columns:1fr 1fr; gap:18px; }
  .bottom-bento .skills-contact{ grid-column:1 / -1; } /* optional */
}
@media (max-width: 639px){
  .topband, .featured-grid, .bottom-bento{ grid-template-columns:1fr; gap:16px; }
}
```

---

## 7) Global layering & z-index
- `.bg-layer`: fixed full-screen, z=0, pointer-events none.
- `.main`: z=10
- `.navbar`: z=20 (sticky)
- `.drawer`: z=30

---

## 8) Animations (vanilla JS + CSS)
### 8.1 RevealOnScroll
Constants:
- threshold: **0.18**
- rootMargin: `"0px 0px -10% 0px"`
- duration: **520ms** desktop / **460ms** mobile
- easing: `cubic-bezier(0.2, 0.8, 0.2, 1)`

CSS:
```css
.reveal{ opacity:0; transform:translateY(10px); }
.reveal.is-visible{ opacity:1; transform:none; transition:opacity .52s, transform .52s; transition-timing-function:cubic-bezier(.2,.8,.2,1); }
@media (prefers-reduced-motion: reduce){
  html{ scroll-behavior:auto; }
  .reveal{ opacity:1; transform:none; transition:none; }
}
```

### 8.2 Hover glow
```css
.card.hoverable{ transition:transform .22s, box-shadow .22s, border-color .22s; }
@media (hover:hover){
  .card.hoverable:hover{ transform:translateY(-2px); box-shadow:var(--glow-cyan); border-color:rgba(34,211,238,.45); }
}
```

### 8.3 CountUp
- Trigger once when ImpactCard visible.
- Duration **900–1200ms**.
- Parse numeric prefix + suffix. If parse fails → static.
- Reduced motion → off.

---

# 9) Full HTML blueprint (NEW — fixed IDs & class hooks)
Create `/src/index.html` (or `/public/index.html` if no build).

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="">
  <title>Portfolio</title>

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap" rel="stylesheet">

  <!-- Styles -->
  <link rel="stylesheet" href="/styles/tokens.css">
  <link rel="stylesheet" href="/styles/base.css">
  <link rel="stylesheet" href="/styles/layout.css">
  <link rel="stylesheet" href="/styles/components.css">
</head>
<body>
  <!-- Reserved background layer -->
  <div id="bg-layer" class="bg-layer" aria-hidden="true"></div>

  <!-- Skip link -->
  <a class="skip-link u-sr-only u-sr-only--focusable" href="#main">Skip to content</a>

  <!-- Navbar mount -->
  <header class="navbar" id="navbar"></header>

  <!-- Toast region (optional) -->
  <div class="toast-region" id="toast-region" aria-live="polite" aria-atomic="true"></div>

  <!-- Main app -->
  <main class="main" id="main" tabindex="-1">
    <div class="container" id="app"></div>
  </main>

  <script type="module" src="/main.js"></script>
</body>
</html>
```

**Fixed section IDs required by nav**
- `#top`, `#work`, `#impact`, `#experience`, `#contact`

---

# 10) components.css skeleton (NEW — build-ready)
Create `/src/styles/components.css`.

```css
/* --- Background layer --- */
.bg-layer{ position:fixed; inset:0; z-index:0; pointer-events:none; background:var(--bg); }

/* --- Skip link --- */
.u-sr-only{ position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }
.u-sr-only--focusable:focus{ position:fixed; left:16px; top:16px; width:auto; height:auto; margin:0; padding:10px 12px; background:var(--card); border:1px solid var(--border); border-radius:12px; z-index:40; }

/* --- Focus ring --- */
:focus-visible{ outline:2px solid rgba(34,211,238,0.9); outline-offset:2px; }

/* --- Card primitive --- */
.card{
  background:var(--card);
  border:1px solid var(--border);
  border-radius:var(--r-card);
  box-shadow:var(--shadow-card);
  padding:var(--s-24);
}
@media (max-width: 1023px){ .card{ border-radius:var(--r-card-sm); padding:var(--s-20); } }
@media (max-width: 639px){ .card{ padding:var(--s-16); } }
.card--inner{ background:var(--cardInner); border-color:rgba(31,42,64,0.95); border-radius:var(--r-inner); box-shadow:none; }
.card--interactive{ cursor:pointer; }
.card.hoverable{ transition:transform .22s, box-shadow .22s, border-color .22s; }

/* --- Buttons --- */
.btn{
  display:inline-flex; align-items:center; justify-content:center;
  height:44px; padding:0 18px; gap:8px;
  border-radius:14px; border:1px solid transparent;
  font-weight:600; font-size:13px; text-decoration:none;
  user-select:none; -webkit-tap-highlight-color:transparent;
}
@media (max-width: 639px){ .btn{ height:40px; padding:0 16px; } }
.btn--primary{ background:var(--cyan); color:#041018; border-color:var(--cyan); }
.btn--secondary{ background:var(--cardInner); color:var(--text); border-color:rgba(36,50,74,1); }
.btn--ghost{ background:transparent; color:var(--text); border-color:transparent; text-decoration:underline; text-underline-offset:4px; }
.btn[aria-disabled="true"], .btn:disabled{ opacity:.55; pointer-events:none; }

/* --- Pills/Chips --- */
.pill{
  display:inline-flex; align-items:center;
  height:26px; padding:0 12px;
  border-radius:var(--r-pill);
  border:1px solid rgba(36,50,74,1);
  background:var(--cardInner);
  font-size:11px; font-weight:600; color:var(--text);
  white-space:nowrap;
}
.pill--violet{ border-color:rgba(167,139,250,0.35); }
.pill--cyan{ border-color:rgba(34,211,238,0.35); }

/* --- Navbar --- */
.navbar{ position:sticky; top:16px; z-index:20; }
.navbar__card{
  margin:0 auto; max-width:1240px;
  padding:0 var(--pad-x);
}
.navbar__inner{
  height:var(--nav-h);
  display:flex; align-items:center; justify-content:space-between;
  background:rgba(5,7,12,0.85);
  border:1px solid var(--border);
  border-radius:18px;
  padding:0 16px;
  backdrop-filter: blur(12px);
}
@supports not (backdrop-filter: blur(12px)){
  .navbar__inner{ background:rgba(5,7,12,0.95); }
}
.navbar__left{ display:flex; align-items:center; gap:12px; min-width:0; }
.navbar__mark{
  width:32px; height:32px; border-radius:10px;
  display:grid; place-items:center;
  background:var(--cardInner); border:1px solid rgba(36,50,74,1);
  font-weight:700;
}
@media (max-width: 639px){ .navbar__mark{ width:28px; height:28px; } }
.navbar__name{ font-size:13px; color:var(--text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
@media (max-width: 639px){ .navbar__name{ font-size:12px; } }

.navbar__links{ display:flex; gap:20px; align-items:center; }
.navbar__link{
  position:relative; font-size:13px; font-weight:600; color:rgba(229,231,235,0.92);
  text-decoration:none; padding:10px 2px;
}
.navbar__link.is-active{ color:var(--text); }
.navbar__link.is-active::after{
  content:""; position:absolute; left:50%; transform:translateX(-50%);
  bottom:4px; width:22px; height:2px; border-radius:2px;
  background:rgba(34,211,238,0.7);
}

.navbar__right{ display:flex; align-items:center; gap:12px; }
.navbar__icon-btn{
  width:40px; height:40px; display:grid; place-items:center;
  background:var(--cardInner); border:1px solid rgba(36,50,74,1);
  border-radius:13px;
}
@media (max-width: 639px){ .navbar__icon-btn{ width:40px; height:40px; } }

/* Mobile nav: hide links show menu */
@media (max-width: 639px){
  .navbar__links{ display:none; }
}

/* Drawer */
.drawer{
  position:fixed; inset:0; z-index:30;
  background:rgba(0,0,0,0.55);
  display:none;
}
.drawer.is-open{ display:block; }
.drawer__panel{
  position:absolute; right:16px; top:88px;
  width:min(320px, calc(100vw - 32px));
  background:var(--card);
  border:1px solid var(--border);
  border-radius:20px;
  padding:16px;
  box-shadow:var(--shadow-card);
}
.drawer__item{ display:flex; align-items:center; height:44px; border-radius:14px; padding:0 12px; color:var(--text); text-decoration:none; }
.drawer__item:hover{ background:rgba(7,11,22,0.85); }

/* --- Hero --- */
.hero__badge{ display:inline-flex; height:28px; align-items:center; padding:0 12px; border-radius:var(--r-pill); background:var(--cardInner); border:1px solid rgba(36,50,74,1); color:var(--mint); font-size:11px; font-weight:600; }
.hero__subtitle{ margin-top:10px; color:rgba(165,180,252,0.95); font-weight:600; font-size:13px; }
.hero__about{ margin-top:14px; display:grid; gap:10px; }
.hero__current{ margin-top:14px; }
.hero__current .card{ padding:12px 14px; border-radius:16px; }
.hero__cta{ margin-top:14px; display:flex; flex-wrap:wrap; gap:10px; }

/* --- Impact --- */
.impact__subtitle{ margin-top:6px; color:var(--muted); font-size:12px; }
.impact__grid{ margin-top:14px; display:grid; grid-template-columns:1fr 1fr; gap:14px; }
@media (max-width: 639px){ .impact__grid{ gap:12px; } }
.metric-tile{ background:var(--cardInner); border:1px solid rgba(36,50,74,1); border-radius:18px; padding:14px; min-height:68px; }
@media (max-width: 639px){ .metric-tile{ min-height:64px; } }
.metric-tile__value{ font-size:20px; font-weight:700; line-height:1.1; }
.metric-tile__label{ margin-top:2px; font-size:11px; font-weight:600; color:rgba(167,139,250,0.9); }
.metric-tile__note{ margin-top:2px; font-size:11px; color:var(--muted); }

/* --- Featured --- */
.featured__meta{ margin-top:6px; font-size:12px; color:var(--muted); }
.featured__text{ display:grid; gap:12px; }
.featured__bullets{ display:grid; gap:10px; padding-left:14px; }
.featured__bullets li{ color:rgba(229,231,235,0.92); line-height:1.6; }
.featured__arch{ display:grid; gap:8px; padding-left:14px; }
.featured__arch li{ color:var(--muted); font-size:12px; }
.chips{ display:flex; flex-wrap:wrap; gap:8px; }
.featured__links{ display:flex; flex-wrap:wrap; gap:10px; margin-top:10px; }
.media{
  border:1px solid rgba(36,50,74,1);
  border-radius:24px;
  min-height:220px;
  background:var(--cardInner);
  overflow:hidden;
  position:relative;
}
@media (max-width: 639px){ .media{ min-height:180px; } }
.media--placeholder::before{
  content:""; position:absolute; inset:-40%;
  background:
    repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0 8px, rgba(255,255,255,0.0) 8px 22px);
  transform:rotate(0deg);
}
.media__caption{
  position:absolute; left:12px; right:12px; bottom:12px;
  background:rgba(5,7,12,0.92);
  border:1px solid rgba(31,42,64,0.85);
  border-radius:18px;
  padding:12px 14px;
  color:var(--muted);
  font-size:11.5px;
}

/* --- Toast --- */
.toast-region{ position:fixed; right:16px; bottom:16px; z-index:40; display:grid; gap:10px; }
.toast{
  background:rgba(5,7,12,0.92);
  border:1px solid rgba(31,42,64,0.9);
  border-radius:18px;
  padding:12px 14px;
  max-width:340px;
  box-shadow:var(--shadow-card);
}


/* --- Scaling safety (grid shrink + text wrap) --- */
.card, .featured-grid > *, .topband > *, .bottom-bento > *{ min-width:0; }
.hero, .impact, .featured, .more-work, .experience, .skills-contact{ min-width:0; }
p, li, .navbar__name, .metric-tile__note, .item__desc, .timeline__desc{
  overflow-wrap:anywhere;
  word-break:break-word;
}
/* prevent images from overflowing */
img{ max-width:100%; height:auto; }

/* --- Safe-area sticky navbar --- */
.navbar{ top:calc(12px + env(safe-area-inset-top)); }
@media (max-width: 639px){ .navbar{ top:calc(10px + env(safe-area-inset-top)); } }

/* --- Tiny phones (<=360px) --- */
@media (max-width: 360px){
  .navbar__inner{ padding:0 12px; }
  .navbar__right{ gap:10px; }
  .hero__cta .btn{ width:100%; }
  .drawer__panel{ right:10px; top:80px; width:min(320px, calc(100vw - 20px)); }
}

/* --- Line clamp utilities --- */
.u-line-clamp-1, .u-line-clamp-2, .u-line-clamp-3, .u-line-clamp-5, .u-line-clamp-6{
  display:-webkit-box;
  -webkit-box-orient:vertical;
  overflow:hidden;
}
.u-line-clamp-1{ -webkit-line-clamp:1; }
.u-line-clamp-2{ -webkit-line-clamp:2; }
.u-line-clamp-3{ -webkit-line-clamp:3; }
.u-line-clamp-5{ -webkit-line-clamp:5; }
.u-line-clamp-6{ -webkit-line-clamp:6; }

/* --- Skeletons --- */
.skel{ background:rgba(255,255,255,0.06); border-radius:12px; }
.skel--text{ height:12px; }
.skel--block-72{ height:72px; }
.skel--block-88{ height:88px; }
.skel--tile-68{ height:68px; border-radius:18px; }
.skel--tile-64{ height:64px; border-radius:18px; }
.skel--media-220{ height:220px; border-radius:24px; }
.skel--media-180{ height:180px; border-radius:24px; }

/* --- Print (optional) --- */
@media print{
  .navbar, .toast-region, .bg-layer{ display:none !important; }
  body{ background:#fff; color:#000; }
  .card{ box-shadow:none; border-color:#ddd; }
}
```

---

# 11) JS module contracts (NEW — vanilla ES modules)
> Each module exports specific functions. Prefer named exports. Use `textContent` for copy.

## 11.1 `store.js`
**Purpose**: single source of state with subscribe/render loop.

**State shape**
```js
{
  lang: "en"|"vi",
  status: "loading"|"ready"|"error",
  content: null|PortfolioContent,
  errorMsg: "",
  reducedMotion: boolean,
  activeSection: "top"|"work"|"impact"|"experience"|"contact",
  drawerOpen: boolean
}
```

**Exports**
- `getState(): State`
- `setState(patch: Partial<State>): void`
- `subscribe(fn: (state)=>void): ()=>void`
- `initStore(): void` (sets reducedMotion + initial lang)

## 11.2 `fetchContent.js`
**Purpose**: fetch JSON with caching + concurrency handling.

**Exports**
- `loadContent(lang): Promise<PortfolioContent>`
- `getContentUrl(lang): string` (returns `/CV/portfolio.{lang}.json`)
- `setAbortController(ac)` internal
- `getLastGoodContent(): PortfolioContent|null`
- `setLastGoodContent(content)`

**Rules**
- Use `AbortController` to cancel previous fetch when switching language.
- If fetch fails and lastGood exists: keep lastGood rendered + show toast.

## 11.3 `dom.js`
**Purpose**: DOM helpers to keep components clean.

**Exports**
- `el(tag, className?, attrs?, children?): HTMLElement`
- `txt(str): Text`
- `setText(node, str)` safe setter
- `clear(node)` remove children

## 11.4 `renderApp.js` (or in `main.js`)
**Exports**
- `renderApp(state): void`
**Rules**
- Build a `DocumentFragment` and replace `#app` children in one pass (reduce layout trashing).
- Navbar rendered separately into `#navbar` so it stays stable.

## 11.5 `motion.js`
**Exports**
- `initReveal(root=document): void` (adds observers)
- `markReveal(el): void` (adds `.reveal` class)
**Rules**
- If reduced motion: do nothing (content is visible).

## 11.6 `countUp.js`
**Exports**
- `initCountUp(containerEl): void`
- `parseValue(valueRaw): {num:number|null, suffix:string}`
- `animateValue(el, num, suffix, durationMs): void`

## 11.7 `navActive.js`
**Exports**
- `initActiveSectionObserver(sectionIds, onActiveChange): void`
- Deterministic active selection per spec:
  - highest intersection ratio; tie by closest top to nav bottom.

## 11.8 `toast.js`
**Exports**
- `showToast(message, {type="info", timeout=2600}): void`

## 11.9 `a11yFocusTrap.js` (drawer)
**Exports**
- `trapFocus(dialogEl): ()=>void` (returns cleanup)
- `getFocusable(dialogEl): HTMLElement[]`

---

# 12) Content mapping table (JSON → DOM)
> Ensures no guessing for Codex when wiring fields.

| UI node | JSON path | Notes |
|---|---|---|
| Navbar name | `meta.name_en` + `meta.name_vi` | render “EN • VI” format |
| Hero badge | `hero.badge` | mint tone |
| Hero title EN | `meta.name_en` | H1 |
| Hero title VI | `meta.name_vi` | smaller line |
| Hero subtitle | `meta.title` | and/or localized |
| Hero tagline | `hero.tagline` | 2 lines max |
| Hero about | `hero.about_paragraphs[]` | clamp total lines per table |
| Hero current line | `hero.current_line` | inset bar; may contain VI text |
| CTA CV link | `meta.links.cv` | check existence or disable |
| Impact title/subtitle | `impact.title` / `impact.subtitle` | |
| Metric tiles | `impact.metrics[]` | auto-flow grid |
| Featured section title | `featured.title` | |
| Featured project name | `featured.project.name` | |
| Featured meta | `featured.project.meta` | |
| Featured context/role | `featured.project.context` / `featured.project.role` | |
| Featured bullets | `featured.project.bullets[]` | max 5 shown |
| Featured architecture | `featured.project.architecture[]` | 3–5 |
| Featured chips | `featured.project.tech_chips[]` | cap 9 +N |
| Featured image | `featured.project.image` | missing → placeholder |
| Featured links | `featured.project.links.*` | show buttons only if non-empty |
| More work | `more_work.items[]` | 2–3 |
| Experience | `experience.items[]` | 2–3 |
| Skills rows | `skills.items[]` | 4–6 |
| Contact links | `contact.links[]` | ensure mailto exists |
| Footer note | `footer.note` | optional |

---

# 13) Navigation & anchors (vanilla)
## 13.1 IDs (hard)
- `#top`, `#work`, `#impact`, `#experience`, `#contact`

## 13.2 Smooth scrolling
- enable only when not reduced motion:
  - set `document.documentElement.style.scrollBehavior = "smooth"`; else `"auto"`

## 13.3 Drawer click timing
- close drawer → wait 90ms → scroll

---

# 14) Line clamp rules (must implement)
| Block | Mobile | Tablet | Desktop |
|---|---:|---:|---:|
| Hero tagline | 2 | 2 | 2 |
| Hero about total | 6 | 6 | 5 |
| Hero current line | 2 | 2 | 2 |
| Impact note | 2 | 2 | 2 |
| MoreWork desc | 2 | 2 | 2 |
| Experience role | 2 | 2 | 1–2 |
| Featured bullets | 2 per bullet | 2 | 2 |

Implementation hint: apply `.u-line-clamp-*` on specific paragraphs/spans only, not the entire card container.

---

# 15) Security & safety notes (NEW)
- Use `textContent` for all JSON-derived text.
- If you must insert links, set `a.href` to known values, and set `rel="noopener noreferrer"` for external links.
- Avoid setting `innerHTML` with content from JSON.
- Validate `href` scheme allowlist: `http:`, `https:`, `mailto:` only.

---

# 16) Acceptance criteria (expanded)
### Visual / layout
- Pass widths: **375, 390, 430, 768, 1024, 1440, 1920**
- No horizontal scroll at any width
- Cards never overlap; all heights are auto
- If `backdrop-filter` unsupported: navbar still readable

### Functionality
- EN/VI toggle updates all text; persists in localStorage
- Fetch concurrency: toggling quickly doesn’t flash wrong language
- Nav links scroll to correct section with sticky offset
- Active section highlight stable (no flicker)
- Missing assets handled gracefully (no broken images, no 404 button)

### Motion / a11y
- Reduced motion disables reveals + count-up + smooth scroll
- Keyboard nav works; focus ring visible everywhere
- Drawer has focus trap + Esc closes
- Tap targets ≥44px on mobile

### Performance
- Lazy-load below-fold images
- Minimal JS, no heavy libs
- CLS ≤ 0.05 via skeleton sizing

---

# 17) Recommended next refinements
1) Write a tiny `components.css` “theme tweak” section for tuning glow/opacity if your animated background is bright.
2) Add an optional “Copy density mode” toggle for testing longer/shorter text (dev-only).
3) Add a print-friendly export mode (hide background + nav) for quick PDF export.


---

# Responsive scaling guarantees (NEW — make components scale cleanly)
This section locks down the remaining “scaling” details so components behave well across common resolutions + zoom levels.

## Target viewport matrix (must pass)
**Small phones**
- 320×568, 360×800, 375×812, 390×844, 414×896, 430×932

**Tablets**
- 768×1024, 820×1180, 834×1112, 1024×1366

**Laptops / desktops**
- 1280×720, 1366×768, 1440×900, 1600×900, 1920×1080, 2560×1440

## Global scaling rules
1) **No overflow**: all grid children must allow shrinking (`min-width:0`) and text must wrap (`overflow-wrap:anywhere`).
2) **No fixed heights on small screens**: only apply TopBand min-height on desktop.
3) **Use `fr + minmax(0, …)` for grids** (prevents content overflow in CSS grid).
4) **Buttons wrap**: on very small widths (≤360px) primary CTA becomes full-width.
5) **Safe-area support**: sticky navbar top offset includes `env(safe-area-inset-top)`.
6) **Zoom-ready**: layout must work at 125–200% browser zoom (no clipped text / fixed pixel traps).

## Breakpoints (final)
- `<=360px`: “tiny” adjustments
- `<640px`: mobile stack
- `640–1023px`: tablet stack / 2-col bottom bento
- `>=1024px`: desktop bento
- `>=1440px`: “wide” spacing polish only (container still max 1240px)


---

# Dev overlay for responsive QA (optional but recommended)
Add a small overlay in dev mode (`?dev=1`) to display current width + breakpoint.

## `src/lib/devOverlay.js`
```js
import { el } from "./dom.js";

export function initDevOverlay(){
  const isDev = new URLSearchParams(location.search).get("dev")==="1";
  if(!isDev) return;

  const box = el("div","dev-overlay",{id:"dev-overlay", "aria-hidden":"true"});
  document.body.append(box);

  function bp(w){
    if(w <= 360) return "tiny";
    if(w < 640) return "mobile";
    if(w < 1024) return "tablet";
    if(w < 1440) return "desktop";
    return "wide";
  }

  function tick(){
    const w = window.innerWidth;
    box.textContent = `${w}px • ${bp(w)}`;
  }
  window.addEventListener("resize", tick);
  tick();
}
```

## Add to `components.css`
```css
.dev-overlay{
  position:fixed;
  left:12px; bottom:12px;
  z-index:50;
  background:rgba(5,7,12,0.9);
  border:1px solid rgba(31,42,64,0.9);
  border-radius:14px;
  padding:8px 10px;
  font-size:12px;
  color:var(--muted);
  pointer-events:none;
}
@media (prefers-reduced-motion: reduce){ .dev-overlay{ display:none; } }
```

## Wire it in `main.js`
```js
import { initDevOverlay } from "./lib/devOverlay.js";
// inside bootstrap():
initDevOverlay();
```
---

# 53) What was still not fully covered (now addressed)
Even with v4.12, there were a few “production polish” areas that can bite later:
- Security headers / CSP on static hosts
- Runtime validation of JSON shape (avoid silent undefined bugs)
- Aspect-ratio + image sizing rules to avoid CLS when you add screenshots later
- Optional telemetry (privacy-friendly) to know if portfolio is actually viewed
- Lint/format/test harness so iteration stays clean
This section adds concrete specs + templates for each.

---

# 54) Security headers (static hosting) — NEW (recommended)
> You don’t *need* this to run locally, but it’s best practice when deploying.

## 54.1 Recommended headers
- `Content-Security-Policy` (CSP) — start strict, loosen only if needed
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY` (or CSP frame-ancestors)
- `Permissions-Policy` (disable camera/mic/geo by default)

## 54.2 CSP baseline (safe for this project)
If you only load Google Fonts (optional) and no inline scripts:
```
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com data:;
  img-src 'self' data: https:;
  connect-src 'self';
  frame-ancestors 'none';
  base-uri 'self';
```
Notes:
- If you later host the font files locally, you can remove Google domains.
- If you plug background animation from a CDN, add that domain to `script-src`.

## 54.3 Netlify / Vercel examples (optional)
- Netlify: `public/_headers`
- Vercel: `vercel.json` headers section

---

# 55) Runtime JSON validation (NEW — avoid silent breakage)
> Since content comes from Word→JSON, a small validation layer prevents “undefined everywhere”.

## 55.1 `src/lib/validateContent.js` (minimal guard)
```js
export function validateContent(c){
  const errors = [];
  if(!c || typeof c !== "object") errors.push("content is not an object");

  const meta = c?.meta;
  if(!meta) errors.push("meta missing");
  if(meta && typeof meta !== "object") errors.push("meta not object");

  const hero = c?.hero;
  if(hero && !Array.isArray(hero.about_paragraphs)) errors.push("hero.about_paragraphs should be array");

  const impact = c?.impact;
  if(impact && impact.metrics && !Array.isArray(impact.metrics)) errors.push("impact.metrics should be array");

  const featured = c?.featured?.project;
  if(featured && featured.constraints && !Array.isArray(featured.constraints)) errors.push("featured.project.constraints should be array");

  return { ok: errors.length === 0, errors };
}
```
## 55.2 Integration rule
- After `loadContent(lang)` returns, call `validateContent(content)`.
- If invalid:
  - keep last-good content
  - show toast in dev mode (`?dev=1`) with first error
  - still render safely (no crash)

---

# 56) Image sizing & CLS rules (NEW — “future proof” screenshots)
> Many portfolios break when you add images later. Lock these rules now.

## 56.1 Featured media box
- Always render the `.media` container with a **fixed min-height**:
  - desktop: 220px
  - mobile: 180px
- Prefer `aspect-ratio` to stabilize CLS:
```css
.media{ aspect-ratio: 16 / 10; }
@media (max-width: 639px){ .media{ aspect-ratio: 16 / 11; } }
```
- Images must be `object-fit: cover` and `display:block`

## 56.2 Optional: blurred placeholder
If you later add a low-res placeholder:
- add `data-blur` URL in JSON
- render as background while main image loads

---

# 57) Accessibility refinements (NEW — last-mile)
## 57.1 Announce language changes (screen reader friendly)
Add a hidden live region:
```html
<div class="u-sr-only" id="sr-live" aria-live="polite" aria-atomic="true"></div>
```
On language switch success:
```js
document.getElementById("sr-live").textContent = nextLang==="vi" ? "Đã chuyển sang tiếng Việt" : "Switched to English";
```

## 57.2 Keyboard “Skip to content” focus behavior
- Ensure `#main` has `tabindex="-1"` (already in blueprint)
- On skip link click, focus should land in `#main`

## 57.3 Focus ring contrast on cyan backgrounds
- For `.btn--primary`, ensure focus ring remains visible:
  - add `outline-color: rgba(0,0,0,0.85)` on primary buttons if needed (optional)

---

# 58) Lint / formatting (optional but helps iteration)
> Vanilla projects get messy fast without formatting.

## 58.1 Prettier (optional)
Add:
```json
"devDependencies": { "prettier": "^3.0.0" },
"scripts": { "format": "prettier . --write" }
```

## 58.2 ESLint (optional)
Only if you want it. Otherwise keep code small + readable.

---

# 59) E2E test harness (optional but powerful)
> If you iterate a lot, Playwright catches regressions on breakpoints and lang toggle.

## 59.1 `playwright.config.js` (optional)
- Test: load page, toggle lang, check section IDs exist, ensure no horizontal scroll.
- Run screenshots at 390/820/1440 widths.

---

# 60) i18n nuance (NEW)
## 60.1 Numbers
- For count-up formatting:
  - `format:"compact"` uses **en-US** consistently (locked) to avoid “20 N” in VI.
  - For VI display strings, use `display:"20k/ngày"` while animation uses `value_num`.
## 60.2 Dates
- Treat experience dates as plain strings from JSON (no parsing).

---

# 61) Content versioning (optional)
> Helps when you refine JSON exports over time.

## 61.1 Add optional top-level `version`
```json
{ "version": 1, ... }
```
- If `version` changes and validation fails, show dev toast suggesting to re-export JSON.
