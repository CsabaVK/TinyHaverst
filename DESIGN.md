# TinyHarvest - design system for the static site

Direction: **golden-hour greenhouse.** Deep bottle-glass green, a roof grid receding overhead, warm light shafts and drifting mist, one gold accent, brand green only on the primary button. Dark glass rooms alternate with daylight paper rooms (steps, add-ons, questions) so the page breathes. The brand sprout stands in the light as a 3D object; the tray grows under scroll. Rich motion, everything driven by scroll or the pointer, plus small 2D animations: drifting leaves, icons that draw themselves, a scrubbed ten-day timeline, a rotating seal, sprouts that grow in the footer.

Source of truth for the build: `index.html`, `site.css`, `site.js`, `data.js`. Tokens below are the `:root` block in `site.css`.

## Palette

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0B2320` | page ground (bottle glass) |
| `--bg-2` | `#0F2D29` | cards, marquee, cart, inputs |
| `--bg-3` | `#153A34` | icon tiles, disabled button |
| `--ink` | `#071714` | footer, growth field base, text on gold and green |
| `--paper` / `--paper-2` / `--paper-3` | `#F1E9D2` / `#F8F3E5` / `#E6DCC0` | daylight rooms (`.paper` sections): ground, cards, tiles |
| `--paper-ink` | `#10231E` | text on paper; inside `.paper` the cream, line and gold tokens are remapped (gold becomes `#A47A2C` for contrast) |
| `--line` / `--line-strong` | cream at 13% / 28% | roof grid, hairlines, card borders, ghost buttons |
| `--cream` | `#F3E3B8` | headings, primary text |
| `--cream-dim` / `--cream-faint` | cream at 66% / 42% | body copy, meta, nav links |
| `--gold` | `#E0B25C` | the one accent: prices, active stage, day counter, trust line, badges, count, nav underline, focus ring, selection, light shafts, cursor light |
| `--leaf` / `--leaf-bright` | `#6DB83A` / `#8ED457` | primary button fill and hover; the fly-to-cart dot |
| `--mist` | `#B9D7C4` | reserved for glass tints |

Gradients only as light: light shafts (skewed, blurred, screen-blended), the cursor light (radial), the sprout halo, growth glow, and photo-to-card fades. Film grain 5% over the page. Shadows neutral black with offset and blur.

## Type

**Bricolage Grotesque** (display, variable `opsz` 12 to 96, weights 500 to 700) + **Figtree** 400 to 700 (body). Google Fonts. Lazy Dog lives only in the logo image.

| Token | Size | Face | Where |
|---|---|---|---|
| `--t-display` | clamp(3.4rem, 7.6vw, 6.4rem), lh .94, 700, tracking -.035em, opsz 96 | Bricolage | hero h1 |
| `--t-h2` | clamp(2.2rem, 4.2vw, 3.5rem), lh 1.02, 600, opsz 96 | Bricolage | section titles (split into words for the reveal) |
| `--t-h3` | clamp(1.35rem, 1.8vw, 1.7rem), 600, opsz 48 | Bricolage | kit, add-on, stage, claim and FAQ titles |
| `--t-lead` | clamp(1.05rem, 1.3vw, 1.25rem), lh 1.6, cream-dim | Figtree 400 | hero sentence, section intros |
| body | 1rem / 1.65 | Figtree 400 | everything else |
| label | .72rem, tracking .1 to .12em, uppercase | Figtree 700 | "Most popular", stage day, step numbers |

Hero kicker is gold Figtree 700 (the one small line above h1). Trust line: Bricolage 700 at clamp(3rem, 6.5vw, 5.6rem) in gold. Day counter: Bricolage 700 gold.

## Spacing and grid

`--gutter: clamp(20px, 5vw, 72px)`, `--section: clamp(5rem, 11vw, 10rem)`, container 1360px, `--radius: 20px`. Breakpoint 900px; extra rules under 700px tall keep the pinned growth section on one screen.

- Hero: 92vh, roof grid over the top 46% (perspective rotateX 58deg), two light shafts, mist canvas. Text 6 columns (kicker, h1, lead, two buttons), 3D sprout 6 columns in a gold halo with a ground shadow. Price strip on a hairline under it. Then a marquee of the six product facts.
- Kits: one row of four panes (4:5 photos), `perspective: 1400px`, a faint 01 to 04 numeral top right, meta line with one leaf icon per seed variety. Each card has an inner hairline frame (glass pane), a pointer-following shine, and tilts up to 6deg toward the pointer. Fourteen 2D leaves drift down behind the row. Phones: horizontal scroll-snap row, 78vw cards, Medium first.
- Growth: pinned 100vh, low roof grid, stages 5 columns (clickable, keyboard-operable), tray 7 columns with its own shaft and a day counter. Phones: tray on top at 38vh.
- Steps (paper): three columns on a hairline that draws gold when the list enters; icons draw themselves on with stroke-dashoffset, then breathe; numbered 01 to 03. Under them the ten-day timeline: eleven ticks (Sow, Day 1 to 10) with the stage names at their days, a gold fill and a sprout icon scrubbed by scroll.
- Add-ons (paper): 2x2 horizontal row cards, 104px art tile, ghost Add.
- Trust: gold line left 5, claims right 7 sliding in from the right; low roof grid behind.
- FAQ (paper): native `details`, 62ch, gold chevron.
- Footer: ink. Top: brand block with round social icons, newsletter, Shop / Learn / Contact columns with gold underline hovers. Middle: rotating gold seal (text on a circle), twelve sprouts growing in with a stagger, Back to top pill. Bottom: the outlined wordmark at 17vw rising letter by letter, then the legal line.

## Components

- **Button** `.btn`: 52px pill, leaf fill, ink text, neutral shadow; hover leaf-bright. `.btn--ghost` cream on a cream-28% ring; `.btn--small` 42px. `.btn--magnet` follows the pointer by up to a quarter of its size (fine pointers only). After add: tick + "Added" for 1.6s.
- **Nav**: sticky, 96% bg, hairline after scroll, gold reading-progress bar along the bottom edge, gold underline on the active section link; 44px round cart button that bumps when an item lands; round menu button on phones.
- **Kit card** `.kit`: bg-2, hairline border + inner frame, photo with fade, name / gold price / one line / Add to cart / "What is in the box" details. Photo parallaxes 12% inside its frame on scroll; hover scales the frame 1.04.
- **Stage** `.stage`: day label, word, body line that unfolds via grid rows; inactive 38%, hover 70%, active word in gold. Click or Enter scrolls the pin to that stage.
- **Cart drawer** `.cart`: right, 440px max, bg-2, 72px line art, 40px round quantity buttons, gold subtotal, Checkout prints "Checkout opens soon". Lines stagger in on open. Overlay near-black 62%. 450ms slide. Escape closes; Lenis stops while open.
- **Fly dot** `.fly`: leaf-bright dot that flies from the pressed button to the cart, then the drawer opens.
- **Toast**: cream pill bottom-centre, under the drawer.
- **Newsletter**: Bricolage label, bg-2 pill input with gold focus ring, leaf button; submit prints the "not connected" note.

## 3D (`site.js`, three.js 0.180 via import map, WebGLRenderer, ACES tone mapping)

Shared greenhouse rig: warm key DirectionalLight (0xffe9c4, 2.8, 1024 shadow map), gold rim from behind right, dim green/ink HemisphereLight, ShadowMaterial ground plane.

- **Brand sprout** (`createSprout`): procedural from the img2threejs spec (`scratchpad/sprout/object-sculpt-spec.json`): oblate seed (0.46 x 0.29 x 0.4) with a split-lip torus, S-curved tapered stem swept through seven stations with parallel-transport frames, two cupped teardrop leaves as 10x24 parametric grids with vertex colour from `#6fa63a` at the base to `#a8d465` at the apex, MeshPhysical with sheen. Idle sway, slow yaw, leaf flutter; yaw and pitch follow the pointer on fine-pointer devices. Fallback: `logo-icon.png`.
- **Tray** (`trayScene`): hollow terracotta tray, coco coir slab with 220 instanced crumbs, 29 seedlings on a jittered 7x4 grid (seed, tapering stem, two cotyledons, three true leaves using the same leaf grid), gold cut ring past .88. One progress scalar 0 to 1. Fallback: four PNG frames in `assets/growth/`.

Both: DPR capped at 2, rendering only while on screen, lazy init on first intersection, `three` loaded with `import()`.

## Motion

Lenis (lerp .1, anchors) on the GSAP ticker. Hero intro timeline: roof and shafts fade in, kicker, title words rise, lead, buttons, sprout scales in, price strip staggers. Scroll: sprout and shafts parallax in the hero; marquee loops (28s); section titles split into words and rise; kits rise in sequence and their photos parallax; growth pins for 250vh with scrub .6 and snaps to the four stages, driving plants, stage, day counter and field tint; the steps line draws on enter; add-ons, leads and FAQ fade up; claims slide in from the right. Pointer: cursor light, magnetic buttons, card tilt and shine, sprout follows. Reduced motion: no Lenis, no reveals, no shafts, mist or cursor light, static frames; pin and scrub still follow scroll.

## Delivery

Classic scripts only (`data.js`, `site.js`), so the page also runs opened straight from disk. Cache-bust with `?v=N` on `site.css`, `data.js`, `site.js`.
