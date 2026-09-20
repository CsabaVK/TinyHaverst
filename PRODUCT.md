# TinyHarvest - product brief for the static site

## What it is
TinyHarvest sells microgreens home-growing kits. Four kits (Seed Jar, Small, Medium, Large) and four add-ons (Mini Clip Fan, LED Light Bar, Liquid Fertilizer, Extra Seed Pack). Everything grows on a windowsill, counter or shelf in 7 to 10 days. Seeds are organic and non-GMO, growing medium is coco coir, packaging is plastic-free.

The site is a one-page static storefront on GitHub Pages (tinyharvest.eu). It has a local cart, no checkout yet. Its job: explain the product in one screen, show the four kits with prices, and make the growing process feel real before the visitor buys.

## Who buys
- Design-conscious city dwellers, 25 to 45, apartment without a garden, cook at home, buy at least some organic food.
- Gift buyers: "for my mum who has no garden", "for a colleague who cooks".
- Parents who want a small living thing on the kitchen table that the kids can watch.
- Secondary: people who tried a supermarket sprout kit, found it fiddly, want a nicer one.

They arrive from Instagram, Pinterest or a gift search. They decide in under a minute whether this is a real brand or a drop-ship shop. Product renders, honest prices and a clear process win that minute.

## What they need to get without scrolling far
1. What TinyHarvest is, in one sentence.
2. The four kits: price and one-line difference.
3. How a plant grows in the kit (the 3D scene shows it).

## Tone
Warm, plain, a little playful. Short sentences. Second person. No hype words (revolutionary, ultimate, game-changing). No "Welcome to". Claims stay at what the packaging says: 100% natural, plastic-free, no garden needed, 7 to 10 days. Copy uses a plain hyphen, never an em or en dash (brand rule from PROJECT.md).

Voice reference lines from the existing site, keep this register:
- "Small space. Real harvest."
- "Just the seeds, your way."
- "Cut and enjoy."

## Facts (never invent, source in brackets)
Kits [sections/kits-grid.liquid, index.html]:
- Seed Jar, EUR 9.95 - one variety of premium seed, grow in a container you already own. Includes seed jar, grow-at-home instructions, QR guide.
- Small Kit, EUR 19.95 - your first kit. 1 variety, organic coco coir, compact grow tray, step-by-step guide.
- Medium Kit, EUR 34.95 - most popular. 2 varieties, coco coir, medium tray + lid, spray bottle, guide.
- Large Kit, EUR 64.95 - the full setup. 3 varieties, coco coir x2, large tray + blackout dome, spray bottle, full-spectrum grow light, guide.

Add-ons [sections/add-ons.liquid, PROJECT.md]:
- Mini Clip Fan, EUR 7.95 - ventilation, prevents mould, strengthens stems.
- LED Light Bar, EUR 12.95 - full-spectrum light for low-light spaces.
- Liquid Fertilizer, EUR 6.95 - organic, denser harvest.
- Extra Seed Pack, EUR 4.95 - refill jar or tray with a fresh variety.

Prices incl. VAT, currency EUR, locale en-NL [index.html]. Email info@tinyharvest.eu [README]. Socials: Instagram, Pinterest, LinkedIn, Facebook (no URLs on file).

Process [templates/index.json]: Fill the tray - Sow the seeds - Watch and harvest (snip just above the soil).

Testimonials on file are unverified placeholder quotes with Unsplash avatars: do not use them. Trust block uses the packaging claims instead.

## Anti-references
- Drop-ship plant shops: white page, Inter, three cards with icons in circles, "Shop now" everywhere.
- Big-agri seed catalogues: dense grids, tiny photos, price tables.
- Wellness brands: sage gradients, glass blur, "nourish your journey" copy.
- Cute-overload: emoji, rounded everything, pastel rainbows. Lazy Dog already carries the charm; the rest of the page stays calm.

## Existing brand assets (keep)
- Heading font: Lazy Dog (assets/lazy_dog.ttf).
- Logos: assets/logo-wide.png, assets/logo-icon.png, assets/favicon.png.
- Product renders: assets/kit-jar.png, kit-small.png, kit-medium.png, kit-large.png, addon-seeds.png (transparent PNGs on light ground).
- Old palette: green #6DB83A, cream #F2F0E4, orange #e88d5d. New palette is derived from these, see DESIGN.md.
