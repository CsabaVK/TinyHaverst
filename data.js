/* TinyHarvest - every client-editable fact lives here.
   Prices in cents, EUR, incl. VAT. Sources: sections/kits-grid.liquid, sections/add-ons.liquid, PROJECT.md.
   Add-on photos are Unsplash (free licence, no attribution required) hotlinked for now; replace with own product shots before launch. */
window.TH_DATA = {
  currency: 'EUR',
  locale: 'en-NL',
  email: 'info@tinyharvest.eu',
  cartKey: 'tinyharvest.cart.v1',

  kits: [
    { id: 'seed-jar', name: 'Seed Jar', size: 1, priceCents: 995, image: 'assets/kit-jar.png', tag: 'Start here',
      line: 'Try it for under ten euros. One jar of organic seeds, grown in a container you already own.',
      includes: ['Premium seed jar, 1 variety', 'Grow-at-home instructions', 'QR guide to getting started'] },
    { id: 'small-kit', name: 'Small Kit', size: 2, priceCents: 1995, image: 'assets/kit-small.png',
      line: 'Your first tray. One variety, coco coir, a compact tray and the guide. Nothing else to buy.',
      includes: ['Premium seed mix, 1 variety', 'Organic coco coir medium', 'Compact grow tray', 'Step-by-step growing guide'] },
    { id: 'medium-kit', name: 'Medium Kit', size: 3, priceCents: 3495, image: 'assets/kit-medium.png', popular: true,
      line: 'Two varieties, a lid for the dark days and a spray bottle for one-squeeze watering. The kit most people pick.',
      includes: ['Premium seed mix, 2 varieties', 'Organic coco coir medium', 'Medium grow tray + lid', 'Dedicated spray bottle', 'Step-by-step growing guide'] },
    { id: 'large-kit', name: 'Large Kit', size: 4, priceCents: 6495, image: 'assets/kit-large.png',
      line: 'The full setup: three varieties, double the coco coir, a blackout dome and a grow light, so even a dark corner works.',
      includes: ['Premium seed mix, 3 varieties', 'Organic coco coir medium, x2', 'Large grow tray + blackout dome', 'Dedicated spray bottle', 'Full-spectrum grow light', 'Step-by-step growing guide'] }
  ],

  addons: [
    { id: 'clip-fan', name: 'Mini Clip Fan', priceCents: 795, image: 'https://images.unsplash.com/photo-1622480916526-285a5e0e533b?w=480&h=480&fit=crop&q=75',
      line: 'Gentle airflow keeps mould away and makes stems stand straighter. Clips onto the tray edge.' },
    { id: 'led-bar', name: 'LED Light Bar', priceCents: 1295, image: 'https://images.unsplash.com/photo-1559657153-fdea6cd5ddf7?w=480&h=480&fit=crop&q=75',
      line: 'Full-spectrum light for kitchens that never see the sun. Turns a dark shelf into a growing spot.' },
    { id: 'fertilizer', name: 'Liquid Fertilizer', priceCents: 695, image: 'https://images.unsplash.com/photo-1705592675292-a526220576ac?w=480&h=480&fit=crop&q=75',
      line: 'Organic feed for denser, greener trays. Mix it into the mist water, nothing else changes.' },
    { id: 'seed-pack', name: 'Extra Seed Pack', priceCents: 495, image: 'assets/addon-seeds.png',
      line: 'A fresh variety for the next tray. Keep one in the drawer so the sill never sits empty.' }
  ],

  /* Growth stages: `at` is the scroll progress (0 to 1) where the stage label becomes active. */
  stages: [
    { at: 0,    day: 'Day 0',       name: 'Sow',     text: 'Spread the seeds on damp coco coir, mist, lid on. That is the whole job.' },
    { at: 0.3,  day: 'Day 2 to 3',  name: 'Sprout',  text: 'White roots first, then pale stems. Keep the lid on, keep it dark.' },
    { at: 0.62, day: 'Day 4 to 6',  name: 'Leaves',  text: 'Lid off, onto the sill. The leaves turn green within a day of seeing light.' },
    { at: 0.9,  day: 'Day 7 to 10', name: 'Harvest', text: 'Snip just above the soil, rinse, eat. Sow the next tray the same evening.' }
  ],

  claims: [
    { name: '100% natural', text: 'Organic, non-GMO seeds on coco coir. No chemicals, no pesticides, nothing to rinse off.' },
    { name: 'Plastic-free packaging', text: 'The box and the seed packs are designed to avoid unnecessary plastic.' },
    { name: 'No garden needed', text: 'A windowsill, a counter or a shelf with daylight is all the space a tray asks for.' }
  ],

  faq: [
    { q: 'Do I need a garden or a balcony?', a: 'No. The kits are made for indoor growing. A windowsill or a counter with daylight is enough, and the Large Kit brings its own grow light for darker spots.' },
    { q: 'How long until I can eat them?', a: '7 to 10 days from sowing, depending on the variety and how warm and bright your spot is.' },
    { q: 'I have never grown anything. Will this work?', a: 'That is who the kits are for. Fill, sow, mist, wait. The guide covers each day, and the Medium and Large kits include a spray bottle so watering is one squeeze.' },
    { q: 'What is the difference between the kits?', a: 'Seed Jar: seeds and the guide, use your own container. Small: one variety, tray and coco coir. Medium: two varieties plus a lid and a spray bottle. Large: three varieties, double coco coir, a blackout dome and a grow light.' },
    { q: 'Is the packaging plastic-free?', a: 'Yes. TinyHarvest packaging is plastic-free.' },
    { q: 'When can I order?', a: 'Checkout opens soon. Add kits to your cart now, it stays saved on this device, and subscribe below to hear the day it opens.' }
  ]
};
