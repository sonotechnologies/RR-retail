# Maison Lekki — Design Brief

Oct 21, 2026 · @Sono Technologies

## Overview

Maison Lekki is a reusable website template for multi-concept food spots: restaurant, café, bakery, ice cream or lounge under one roof. One design system ships two skins: the fictional **Maison Lekki** default (portfolio, Instagram, cold pitches) and a private **Napoleon** skin (Osapa London, Lekki Phase 2) for the first pitch.

- **Customer goals:** see the space, browse each concept's menu, reserve a table, order via WhatsApp, request a cake or event.
- **Business goals:** look premium, turn TikTok/IG attention into WhatsApp orders and bookings, update prices without a developer.
- **Pitch goal:** the owner should feel "this is already my website" within 10 seconds on their phone.
- **Primary device:** mobile (Android, mid-range, mobile data). Desktop is the showpiece for pitches.

## Design direction

Clean editorial with a warm touch: a food magazine you can order from. Big photography carries the page; type and whitespace do the rest.

- **Warm, not stark:** off-white paper backgrounds, never pure #FFF; one accent colour per skin.
- **Editorial rhythm:** alternate full-bleed images with narrow text columns; asymmetric grids; generous margins.
- **Concepts feel distinct but related:** each concept gets its own accent tint and hero photo inside the shared system.
- **Skin-proof:** every colour, font and radius comes from tokens, so the Napoleon skin (black + gold, serif) drops in without layout changes.
- **Premium cues:** small caps labels, thin rules, numbered sections (01 Restaurant, 02 Café…), restrained icons.
- **Avoid:** template-looking hero sliders, stock gradients, emoji, cramped card grids, food clip-art.

## Design tokens

All values are tokens; skins override them, layouts never hard-code them.

| Token | Maison Lekki (default) | Napoleon skin |
| --- | --- | --- |
| bg | #F7F2EA warm paper | #0E0D0B near-black |
| surface | #FFFBF5 | #1A1814 |
| text | #1E1B17 | #F3EDE2 |
| text-muted | #6B6258 | #A69C8C |
| accent | #B5532F terracotta | #C9A24B gold |
| accent-ink (text on accent) | #FFFBF5 | #0E0D0B |
| line | #E4DBCD | #2E2A23 |
| Display font | Fraunces (serif, opsz) | Cormorant Garamond 600 |
| Body font | Manrope | Manrope |
| Radius | 2px cards, full-round buttons | 0px cards, full-round buttons |

**Concept tints (default skin):** Restaurant #B5532F terracotta · Café #6F4E37 coffee · Bakery #D9A066 crust · Ice cream #E8A6A1 rose. Napoleon uses gold for all concepts and varies photography instead.

**Type scale (mobile → desktop):** display 44 → 96px, h1 34 → 64, h2 26 → 40, h3 20 → 24, body 16 → 17, label 12px small caps with 0.12em tracking. Display line-height 1.0; body 1.6.

**Spacing:** 4px base; section padding 72px mobile, 140px desktop; content max width 1280px; text columns max 60ch; side gutter 20px mobile.

**Imagery:** warm, natural light, close food crops, wide interior shots, real staff. Napoleon skin uses their own interior and food photos from TikTok/IG (private demo only).

## Page layouts

Every page shares a sticky header (logo, concept links, Reserve button, cart icon with count) and a footer (hours, address, socials, WhatsApp, "Site by Sono Technologies").

**Home**

1. Promo banner (optional, dismissible): one line, accent background.
2. Hero: full-bleed interior photo or muted video loop, display headline ("Four kitchens. One address."), sub-line, Reserve + View menus buttons.
3. Concepts: numbered editorial cards (01–04), each a tall photo, name, one-line tagline, today's hours, link. Horizontal scroll-snap on mobile.
4. Signatures: 4–6 dishes across concepts, big photo, name, price, add to cart.
5. The space: asymmetric photo collage with a short story paragraph.
6. Seen on TikTok: 6–8 curated vertical video embeds in a scroll row.
7. Cakes & events: two side-by-side panels linking to each form.
8. Visit us: map, address, hours table, call + WhatsApp buttons.

**Concept page** (one template, generated per concept)

1. Hero in the concept's tint and photo, name, tagline, hours, Reserve this section.
2. Sticky category tabs (e.g. Mains, Grills, Drinks) that scroll-spy the menu.
3. Menu list: editorial rows (name, description, price, optional photo thumbnail, tags like Spicy/New/Sold out), add button with quantity stepper.
4. Gallery strip, then links to the other concepts.

**Reserve** — two-column on desktop (photo left, form right): date, time slot chips, guests stepper, section select, name, phone, note. Submit opens WhatsApp with a formatted message.

**Cakes & bulk orders** — form: date needed, type (cake/tray/pastry box), size, flavour, message on cake, reference image upload note ("send on WhatsApp"), budget range.

**Events & private hire** — space photos, capacity per area, occasion types, enquiry form.

**Visit** — large map, directions note, hours per concept, contact buttons.

**Cart drawer** — slides from right (bottom sheet on mobile): items grouped by concept, quantity steppers, delivery or pickup toggle, address field, name, phone, note, total, "Send order on WhatsApp" button.

## Components

| Component | Notes | States |
| --- | --- | --- |
| Header | Transparent over hero, solid after scroll; mobile menu is full-screen overlay with big serif links | default, scrolled, menu open |
| Button | Primary (accent fill), secondary (outline), WhatsApp (green #25D366 icon + label) | hover, pressed, loading, disabled |
| Concept card | Tall image 3:4, number label, name, tagline, hours | hover zoom, open/closed badge |
| Menu row | Name, description (2 lines max), price in ₦, tags, add/stepper | default, in cart, sold out |
| Dish card | Square photo, name, price, add | hover, added |
| Category tabs | Sticky, horizontal scroll, active underline | active, inactive |
| Cart drawer / sheet | Grouped items, totals, toggle, form | empty, filled, sending |
| Form fields | Underline style inputs, chip selectors for time and size, steppers | focus, error, filled |
| Toast | "Added to cart" with undo | show, hide |
| Promo banner | One line, close icon | shown, dismissed |
| Video embed tile | 9:16 poster, play icon, tap to load | idle, playing |
| Open-now badge | Green dot "Open until 10pm" / grey "Opens 8am" | open, closing soon, closed |
| Floating WhatsApp button | Bottom-right on mobile, hides when cart sheet opens | default, hidden |

Prices always show ₦ with thousands separators (₦8,500). Empty cart state shows a photo and "Start with something sweet" link to the bakery.

## Motion

Cinematic on desktop, still impressive on mobile, never janky. Mobile uses only transform and opacity, so it stays smooth on mid-range Android.

| Moment | Desktop | Mobile |
| --- | --- | --- |
| Page load | Intro: logo mark draws in, curtain wipes up to reveal hero (max 1.2s, once per session) | Logo fade + hero image scale 1.08 → 1 |
| Hero | Parallax image, headline splits into lines that rise in, subtle video loop | Headline lines rise in; static image |
| Concept cards | Pinned horizontal scroll section; cards slide past as you scroll down | Scroll-snap carousel with active card scaling up |
| Section reveals | Image clip-path reveal (inset wipes), text fades up 24px, staggered | Fade up 16px, staggered |
| Concept page transition | Clicked card image expands to become the next page's hero (shared element) | Same shared-element morph via View Transitions API where supported, fade fallback |
| Menu tabs | Active underline slides; list cross-fades | Same |
| Add to cart | Dish thumbnail flies to cart icon; icon count bounces | Count bounce + toast |
| Cart drawer | Slides in with backdrop blur | Bottom sheet springs up, drag to close |
| Cursor | Custom dot that grows to "View" over images | None |
| Numbers | Hours and capacity counters tick up | Static |

**Easing:** cubic-bezier(0.22, 1, 0.36, 1) for reveals; durations 400–900ms desktop, 250–500ms mobile.

**Respect prefers-reduced-motion:** turn off parallax, pinning, intro and flying thumbnails; keep simple fades.

## Content and copy

Tone: warm, confident, a little playful; short sentences; Lagos-aware without slang overload.

**Maison Lekki sample copy**

- Hero: "Four kitchens. One address." / "Dinner, coffee, fresh bakes and gelato in the heart of Lekki."
- Concepts: 01 The Restaurant ("Long lunches, longer dinners") · 02 The Café ("Your second office, with better coffee") · 03 The Bakery ("Out of the oven at 7am") · 04 The Gelateria ("Cold comfort, made daily").
- Reserve CTA: "Save me a seat"; Cart CTA: "Send order on WhatsApp".
- Menu: 8–12 items per concept with Nigerian and continental mix (e.g. Suya-spiced ribeye, Jollof risotto, Iced zobo spritz, Chin-chin croissant, Puff-puff gelato), prices ₦4,000–₦38,000.

**Napoleon skin**

- Hero: "The new 3-in-1 spot in Lagos" (echoes their pinned TikTok).
- Concepts: Restaurant, Café & Bakery, Ice Cream (3 concepts, proving the template flexes).
- Contact: +234 707 265 5465, Osapa London, Lekki Phase 2, TikTok @napoleon\_ng.
- Menu items and prices: take from their menu photos where visible; otherwise placeholders labelled clearly.

**Photography sources:** default skin uses Unsplash/Pexels warm food and interior shots (credit in code). Napoleon skin uses their own photos and video stills, private demo link only.

## Deliverables

Design mobile (390px) first, then desktop (1440px), in both skins.

- [ ] Token sheet for both skins (colours, type, spacing, radius)
- [ ] Component sheet with all states from the table above
- [ ] Home — mobile + desktop, Maison Lekki
- [ ] Concept page — mobile + desktop, Maison Lekki (Bakery as the example)
- [ ] Cart drawer/sheet — empty and filled
- [ ] Reserve, Cakes & bulk, Events, Visit — mobile
- [ ] Home + one concept page in the Napoleon skin — mobile + desktop
- [ ] Motion notes or prototype for hero, concept transition and add-to-cart
- [ ] WhatsApp message previews (order, reservation, cake request) as they'll appear in chat
