# TinyHarvest — Shopify Theme Project Brief

> **For AI continuity.** This document is the single source of truth for any AI agent picking up this project. Read this before touching any file.

---

## 1. What Is This?

A custom **Shopify OS 2.0 theme** for **TinyHarvest** — a microgreens home-growing kit brand. The store sells grow kits (Seed Jar, Small, Medium, Large) and add-on accessories. The brand is cute, natural, green-focused, and approachable.

- **GitHub:** https://github.com/CsabaVK/TinyHaverst *(note: typo in repo name — "Haverst" not "Harvest")*
- **Stack:** Shopify OS 2.0 / Liquid + vanilla CSS + vanilla JS
- **No framework.** No Tailwind, no React, no build tools. Everything is plain files.
- **CSS strategy:** All styles live in `assets/theme.css` (~5100 lines). New CSS is appended via Node.js scripts (`append1.js` through `append15.js`) to avoid bash heredoc issues with single quotes in CSS.

---

## 2. Brand Tokens

| Token | Value | Usage |
|---|---|---|
| Green | `#6DB83A` | Primary brand, buttons, accents |
| Green dark | `#3a7d1a` / `#559129` | Hover states, icon colours |
| Charcoal | `#2B2B2B` | Body text, headings |
| Cream light | `#F2F0E4` | Page backgrounds, card fills |
| Orange accent | `#e88d5d` | Hero line 2, CTA highlights, pills |
| White | `#ffffff` | Navbar, section backgrounds |

**Fonts:**
- `Lazy Dog` — custom TTF, loaded via `@font-face` in `layout/theme.liquid` (uses Liquid `asset_url`). Applied to all headings (`h1`–`h4`, `.kit-name`, `.addon-card__name`, etc.)
- `Nunito` — Google Font. Used for hero `h1` heading specifically (800 weight, rounded)
- `Playfair Display italic` — Google Font. Used for hero `<em>` accent line

---

## 3. File Structure

```
10-TinyHarvest/
├── layout/
│   └── theme.liquid          # Master layout. Has @font-face for Lazy Dog inline <style>
├── templates/
│   ├── index.json            # Homepage section config — OVERRIDES schema defaults
│   ├── product.json
│   ├── collection.json
│   ├── cart.json
│   ├── page.json
│   └── 404.json
├── sections/
│   ├── header.liquid         # Always-white navbar, 3-col grid, centered logo
│   ├── hero.liquid           # Full-bleed hero, 2-line heading, orange shimmer on line 2
│   ├── kits-grid.liquid      # 4-product kit cards with hover overlay
│   ├── add-ons.liquid        # Horizontal add-on strip with live Add to Cart
│   ├── value-props.liquid    # 3 icon cards (simple, no clip-path)
│   ├── how-it-works.liquid   # 3-step process
│   ├── about.liquid          # Brand story + stats
│   ├── testimonials.liquid   # 3 review cards
│   ├── newsletter.liquid     # Email signup, brand green background
│   ├── footer.liquid
│   └── ...other page sections
├── assets/
│   ├── theme.css             # ~5100 lines, all styles. Append-only via Node scripts.
│   ├── theme.js              # ~606 lines, scroll reveal + interactions
│   ├── lazy_dog.ttf          # Custom font (copied from assets/logos/)
│   ├── middle-logo.png       # Navbar logo (copied from assets/logos/)
│   ├── header.jpg            # Hero background image (copied from assets/logos/)
│   ├── kit-small.png         # Small kit product image
│   ├── kit-large.png         # Large kit product image (main.png from Products/Large Kit/)
│   ├── addon-seeds.png       # Extra seeds add-on image
│   ├── logo-icon.png
│   ├── logo-wide.png
│   ├── favicon.png
│   ├── Products/             # Source product images (NOT served by Shopify directly)
│   │   ├── Jar/              # EMPTY - no jar image yet
│   │   ├── Small Kit/        # Small-product.png
│   │   ├── Medium Kit/       # EMPTY - no medium kit image yet
│   │   ├── Large Kit/        # main.png (used), Temu Pictures/ (DO NOT USE)
│   │   └── Extra addons/     # Extra Bag of seed.png (copied to addon-seeds.png)
│   └── logos/                # Source files (NOT served by Shopify — must copy to root)
├── append1.js – append15.js  # Node.js CSS append scripts (historical, keep for reference)
└── PROJECT.md                # This file
```

> **Critical Shopify rule:** Only files in `assets/` root are served via CDN. Files in subdirectories like `assets/logos/` or `assets/Products/` are NOT accessible via `asset_url`. Always copy needed files to `assets/` root.

---

## 4. Homepage Section Order (`templates/index.json`)

```
hero → kits-grid → add-ons → value-props → how-it-works → about → testimonials → newsletter
```

---

## 5. Section-by-Section Notes

### `sections/header.liquid`
- Always white. Never transparent. No scroll behaviour changes.
- 3-column CSS grid: `[left nav] [centered logo] [right nav]`
- Left: Shop, How It Works
- Center: `middle-logo.png` (height 64px)
- Right: About Us, FAQ, Cart icon
- CSS class: `.site-header` — position fixed, z-index high, white background always

### `sections/hero.liquid`
- Background: `header.jpg` from assets (set via inline style or Shopify image picker)
- Overlay: dark gradient (60–70% opacity) for text contrast
- Heading: 2 lines
  - Line 1: "Turn Any Corner" — plain white, Nunito 800
  - Line 2: "Into a Living Garden." — orange shimmer animation (`#e88d5d`)
- Button colours: primary = `#e88d5d` orange, secondary = outlined
- Has scroll-cue arrow and floating botanical SVG decor

> **Important:** The heading text is stored in `templates/index.json` under `hero.settings.heading`, NOT in the schema default. If the text ever reverts, check `index.json` first.

### `sections/kits-grid.liquid`
- 4 products: **Seed Jar**, **Small Kit**, **Medium Kit** (featured/popular), **Large Kit**
- Each card: image top (4:3) → hover reveals "What's Included" dark overlay → card body with name/price/desc/CTA
- Grid class: `.kits-grid--4`
  - Desktop (>1024px): 4 columns
  - Tablet (600–1024px): 2×2 grid
  - Mobile (<600px): 1 column
- Featured card (Medium): `.kit-card--featured` — slightly elevated, "Most Popular" badge
- Images:
  - Seed Jar: Unsplash placeholder (no product photo yet)
  - Small Kit: `kit-small.png`
  - Medium Kit: Unsplash placeholder (no product photo yet)
  - Large Kit: `kit-large.png`
- Schema allows `image_picker` for each card to override placeholders

### `sections/add-ons.liquid`
- Sits immediately below kits grid
- Horizontal pill-shaped strip with 4 compact add-on cards
- Products: Mini Clip Fan, LED Light Bar, Liquid Fertilizer, Extra Seed Pack
- Each card: small icon box + name + short desc + price + **Add button**
- **Add to Cart logic (JavaScript, inline in section):**
  - Uses Shopify Cart API: `POST /cart/add.js`
  - Button states: idle → loading (pulse) → added (green fill, "Added!") → resets after 2.2s
  - If no `variant_id` set in schema: shows "Soon" pulse — safe placeholder
  - Error state: red fill, "Error", resets after 2s
  - After adding: fetches `/cart.js` and updates any `.cart-count` / `[data-cart-count]` elements
- **To activate:** In Shopify admin → Theme Editor → Add-ons Strip → paste Shopify Variant ID for each product
- Responsive: 2×2 at 900px, stacked at 560px

### `sections/value-props.liquid`
- 3 simple icon cards: "Ready in Days", "No Garden Needed", "100% Natural"
- Plain layout: icon circle (green gradient bg) + title (Lazy Dog) + text
- **No clip-path. No SVG plant decorations.** This was reverted from a complex design back to simple.
- Grid: `align-items: stretch` to ensure all 3 cards are equal height

### `sections/newsletter.liquid`
- Background: `#6DB83A` brand green gradient
- All em/en dashes removed — use plain hyphen `-`

---

## 6. CSS Architecture (`assets/theme.css`)

The file is ~5100 lines. It is **append-only** — new rules always go at the bottom and override earlier ones via cascade. Key sections by comment number:

| Section | Content |
|---|---|
| 1–30 | CSS custom properties (design tokens), resets, typography, layout primitives |
| 31–46 | Animations, hero, section headers, kit cards, value props, testimonials, about, newsletter, buttons |
| 47–52 | Nunito font rule, hero heading, logo sizing, kit card image hover overlay |
| 53–55 | White site rules, always-white header 3-col grid, hero overlay darkness |
| 56–57 | Lazy Dog applied to headings, orange `#e88d5d` accent |
| 58–60 | Hero overlay darker, 2-line heading, Nunito for hero `h1` |
| 62–63 | Overline above heading (block display), mobile centering |
| 64 | Newsletter green = `#6DB83A` |
| 65–68 | Value props redesign attempts (superseded) |
| 69 | **Value props RESET** — wipes all previous value-prop rules back to simple |
| 70 | Value props equal height fix (`align-items: stretch`) |
| 71 | Kits grid 4-column layout (`.kits-grid--4`) |
| 72 | Add-ons strip full CSS |

**How to add new CSS:**
1. Write a new `appendN.js` file (increment the number)
2. Use Node.js `fs.appendFileSync` with a template literal
3. Run `node appendN.js`
4. The new rules cascade over older ones automatically

**Never use bash heredoc for CSS** — single quotes inside CSS break it on Windows.

---

## 7. JavaScript (`assets/theme.js`)

Key behaviours:
- **Scroll reveal:** Watches `.reveal` and `.reveal-on-scroll` elements, adds `.is-visible` class when in viewport (IntersectionObserver)
- **Stagger delays:** `.d1`–`.d4` classes on kit cards add CSS transition delays for cascade animation
- Add-ons Add to Cart logic is **inline in `sections/add-ons.liquid`**, not in `theme.js`

---

## 8. Known Limitations / TODOs

| Item | Status |
|---|---|
| Seed Jar product photo | Missing — `assets/Products/Jar/` is empty. Use Shopify image picker when available. |
| Medium Kit product photo | Missing — `assets/Products/Medium Kit/` is empty. Use Shopify image picker when available. |
| Add-on Variant IDs | Not set — all 4 add-on buttons show "Soon". Paste Variant IDs in Theme Editor to activate. |
| Fan / Light / Fertilizer images | Using SVG placeholders. Upload real photos and use image picker. |
| Cart count bubble | Header cart icon needs a `data-cart-count` or `.cart-count` span added if live count display is wanted. |
| Mobile nav | `.site-header__nav` is hidden on mobile (CSS `display: none`). No hamburger menu built yet. |

---

## 9. Critical Rules for Future Work

1. **`templates/index.json` stores live section settings** and overrides schema defaults. Always check this file if text/settings aren't showing expected values.
2. **`asset_url` Liquid filter only works in `.liquid` files**, not in `.css` files. Any `@font-face` or dynamic asset paths must go in `layout/theme.liquid` inside a `<style>` tag.
3. **Do not use `assets/logos/` or `assets/Products/` paths in Liquid** — Shopify won't serve them. Copy files to `assets/` root first.
4. **CSS append pattern** — never rewrite `theme.css` entirely. Add new rules at the bottom. Earlier rules can be overridden by specificity or later cascade.
5. **No em dashes (`—`) or en dashes (`–`) anywhere** — use plain hyphen `-`. Brand preference.
6. **Lazy Dog font** — only works because `@font-face` is in `theme.liquid`. If that block is removed, all headings fall back to sans-serif.

---

## 10. Git History Summary

```
ddca2a0  Add add-ons strip, expand kits to 4 products, fix value prop equal height
a268c96  Revert Growing Made Simple to original simple card design
8d08d3a  Value props: clip-path shapes actual top of each card element
4c1092b  Value props: top-edge shapes + plants growing up + mobile fix
9946fba  5 fixes: overline above heading, mobile center, newsletter green, no dashes, value props redesign
30a3f60  Hero heading: Nunito 800 (simple, rounded)
304b143  Hero heading: revert to Playfair Display, keep Lazy Dog elsewhere
8aa8d1e  Hero: two-line heading, orange effect on line 2, darker overlay
e37ac87  Fix hero heading text + stronger image overlay
c19581d  Hero: new headline, Lazy Dog font, orange #e88d5d accent
8ce5172  Use header.jpg as hero background
e5c73a9  Lazy Dog font + middle-logo.png in navbar
4c014fe  White site, centered logo, split nav, sprouts hero
2d4759a  Font, logo, kit image cards with hover reveal
8d1053b  Visual redesign: animations, Unsplash photos, frosted glass, kit cards, scroll reveal
c6137e6  feat: full visual redesign — kits grid, trust bar, dark testimonials, SVG icons, about stats
```

> To recover any file from any commit: `git show <hash>:path/to/file > recovered_file`

---

*Last updated: 2026-04-06 | Commit: ddca2a0*
