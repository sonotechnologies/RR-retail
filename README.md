# Maison Lekki

A config-driven Next.js template for WhatsApp-first Lagos businesses, by Sono Technologies. Each skin picks a **mode**:

- **Food** (`mode: 'food'`, the default): multi-concept food spots (restaurant, café, bakery, ice cream, lounge under one roof).
- **Store** (`mode: 'store'`): clothing sellers who sell retail and by the bundle, with a pickup station.

One design system, three skins:

| Skin | `SKIN` | Mode | Use |
| --- | --- | --- | --- |
| Maison Lekki | `maison-lekki` (default) | food | Public portfolio demo: warm paper, terracotta, Fraunces |
| Napoleon | `napoleon` | food | Private pitch preview (Osapa London, Lekki Phase 2): black and gold, Cormorant Garamond, `noindex` |
| RR Retail | `rr-retail` | store | Private pitch preview (@rr.retail.stores, Aboru, Lagos): near-black and rose gold, Cormorant Garamond, `noindex` |

There is no backend and no payments. Every action (order, table, cake, event, bag, product question, custom bundle) ends in a pre-filled WhatsApp message.

## Run it

```bash
npm install
npm run dev              # maison-lekki on http://localhost:3000
npm run dev:napoleon     # napoleon skin
npm run dev:rr-retail    # rr-retail skin (store mode)
npm run build            # production build (fails on an invalid skin config)
npm test                 # WhatsApp messages, store pricing/filters, open-now unit tests
npm run lint && npm run typecheck
```

Requires Node 20+.

## How it is put together

```
src/
  app/                    # food: / · /[concept] · /reserve · /cakes · /events · /visit
                          # store: / · /shop · /shop/[category] · /p/[slug] · /wholesale · /pickup
                          # both: sitemap · robots · icon (routes of the other mode return 404)
  components/
    ui/                   # Button, OpenBadge, Tag, Photo, MapEmbed, Counter…
    layout/               # Header, MobileMenu, Footer, PromoBanner, FloatingWhatsApp, FormPage
    sections/             # Home sections (Hero, Concepts, Signatures, Space, Social, CakesEvents, VisitBlock)
    concept/              # ConceptHero, MenuSpy (sticky tabs + scroll-spy), MenuRow
    cart/                 # Zustand store (localStorage), CartDrawer, AddControl, Toast
    forms/                # Field/Chips/Stepper, WhatsAppSubmit, Reserve/Cake/Event forms
    motion/               # tier detection, Reveal, view transitions, fly-to-cart, desktop tier (GSAP/Lenis)
    store/                # store mode: header, tab bar, bag (Zustand) + sheet, product card/page, shop filters, home
  lib/
    skin.ts               # getSkin() / getFoodSkin() / getStoreSkin(): reads SKIN, validates with Zod, fails the build on errors
    sheet.ts              # Google Sheet CSV fetch (5 min ISR) and row parsing helpers
    menu.ts               # food: menu + promos from the sheet, fallback menu
    products.ts           # store: products from the sheet, fallback products
    store.ts              # store: pricing (retail / bundles), badges, filters and sort
    whatsapp.ts           # message builders + Nigerian phone validation
    hours.ts              # open-now logic (Africa/Lagos)
  skins/
    schema.ts             # Zod schema for skins and menu rows
    index.ts              # skin registry
    maison-lekki/{config.ts, menu.ts}
    napoleon/{config.ts, menu.ts}
    rr-retail/{config.ts, products.ts}
public/skins/<id>/        # a skin's own photos (relative image paths resolve here)
design/                   # Claude Design handoff bundles (prototypes, brief, chat); design/rr-retail for the store
```

**Theming.** Every colour, font and radius is a CSS variable set on `<html>` from the active skin (`app/layout.tsx`) and exposed to Tailwind v4 as `bg-bg`, `text-muted`, `bg-accent`, `rounded-card`, `font-display`… Layouts never hard-code skin values, which is why Napoleon drops in without layout changes. Nothing client-specific lives outside `src/skins/` (and `public/skins/`).

**Feature flags.** `skin.features` hides nav links, sections and routes (`/reserve`, `/cakes` and `/events` return 404 when off).

**Modes.** `getSkin()` returns either skin type; food-only pages call `getFoodSkin()` and store-only pages call `getStoreSkin()`, which 404 on the other mode. `app/layout.tsx` renders the food shell (concept header, cart drawer) or the store shell (shop header, bottom tab bar, bag sheet). Tokens, fonts, the promo banner, motion helpers, the sheet loader and the WhatsApp utilities are shared. Store skins can also set `theme.colors.sale`, `soldOut` and `accentText` (a darker accent for text on light skins).

## Menu and promos from a Google Sheet

The client edits one Google Sheet on their phone, and the site picks up changes within 5 minutes.

1. Create a sheet with two tabs.
   - **Menu**: `concept, category, name, description, price, image, tags, available, featured, order`
     ```csv
     bakery,Pastries,Chin-chin croissant,Butter croissant with a sweet crunch,3500,/skins/maison-lekki/croissant.jpg,New,TRUE,TRUE,
     restaurant,Mains,Suya-spiced ribeye,300g ribeye with yaji butter,32000,,Spicy,TRUE,FALSE,
     ```
     - `concept` is a concept slug from the skin; `category` should match the concept's `categories` (tab order).
     - `price` is in naira, digits only (`₦` and commas are tolerated).
     - `tags` is comma separated (`New`, `Spicy`); `available = FALSE` shows "Sold out" and disables add-to-cart.
     - `featured = TRUE` puts the item in Signatures on the home page.
     - `order` is optional; rows otherwise keep their sheet order.
     - `image` is a full URL, a `/public` path, or a file name in `public/skins/<id>/`. Leave it blank for text-only rows.
   - **Promos**: `text, link, start, end, active`. The banner shows the first active row within its dates (`2026-10-25` or `25/10/2026`).
2. Publish each tab as CSV (File → Share → Publish to web → choose the tab → CSV).
3. Put both URLs in the skin:
   ```ts
   sheet: { menuCsvUrl: 'https://docs.google.com/…&output=csv', promosCsvUrl: '…' },
   ```

Bad rows are skipped with a console warning. If the fetch fails or `sheet` is unset, `skins/<id>/menu.ts` (and `skin.promo`) are used, so the demo never breaks.

## WhatsApp flows

`lib/whatsapp.ts` builds plain-text messages and opens `https://wa.me/<number>?text=…` in a new tab. Required fields are validated first (Nigerian phone: 11 digits starting 0, or +234). The button shows "Opening WhatsApp…", then offers **Copy message** in case WhatsApp didn't open. After an order is sent, the cart is kept and "Order sent? Clear cart" appears, so customers can retry.

## Store mode

Built from the RR Retail design (`design/rr-retail/`) and build brief. Mobile (390px) first; desktop at 1024px and up.

- **Home:** hero, trust strip, just restocked, shop by category, best sellers, how to order, wholesale banner, Telegram, TikTok + customer chat screenshots, pickup card.
- **`/shop` and `/shop/[category]`:** search (`?q=`, also from the header search icon), category chips, size / price / in-stock filters and sort (newest, price low–high), all client-side. A category with `bundles: true` lists every product sold in bundles and its quick add puts in a mixed bundle.
- **`/p/[slug]`:** swipeable gallery, Retail / Wholesale toggle (remembered), colour swatches, size chips (sold-out sizes struck through; "Mixed" in wholesale), quantity stepper (pieces or bundles), add to bag, "Ask on WhatsApp" with a message preview, related items, `Product` JSON-LD.
- **`/wholesale`:** how bundles work, bundle price table (every product with a wholesale price), "Request a custom mix" form.
- **`/pickup`:** address, step-by-step directions, building photo, map, Lagos delivery and waybill.
- **Bag:** bottom sheet on mobile, drawer on desktop; persisted per skin in localStorage. Lines show Retail / Wholesale, size, colour and quantity. Choose pickup, Lagos delivery or waybill; enter name, phone and address when needed; preview the message, then send. A bag with retail and wholesale lines sends one message with two labelled sections. The bag is kept after sending, with "Order sent? Clear bag".

### Products from a Google Sheet

The client edits one **Products** tab, one row per product; changes show within 5 minutes. Publish the tab as CSV and set `sheet: { productsCsvUrl: '…&output=csv' }` in the skin (an optional `promosCsvUrl` works as in food mode).

```csv
slug,name,category,retail_price,wholesale_price,wholesale_min,sizes,colours,images,tags,in_stock,sold_out_sizes,featured,restocked_at
ladies-basic-top-ls,Ladies Basic Top (Long Sleeve),ladies,4000,3000,20,S|M|L|XL,White|Black|Grey,top1.jpg|top2.jpg,New,TRUE,XL,TRUE,2026-10-20
baggy-jeans,Baggy Jeans,jeans-joggers,9500,7500,25,28|30|32|34|36,Blue|Black,jeans.jpg,,TRUE,,FALSE,2026-10-15
```

- `|` separates sizes, colours, images and sold-out sizes. `category` is a category slug from the skin.
- Blank `wholesale_price` = retail only; the wholesale toggle is hidden for that item. Blank `wholesale_min` uses `store.wholesale.defaultMin`.
- Retail: qty = pieces, total = qty × retail price. Wholesale: qty = bundles, pieces = bundles × `wholesale_min`, total = pieces × wholesale price.
- `in_stock = FALSE` (or every size sold out) greys the card and blocks add to bag, but keeps "Ask on WhatsApp".
- "Just restocked" = `restocked_at` within the last 7 days, newest first. Badges come from `tags` (`Few left`, `New`, `Restocked`); a recent restock without a tag shows "Restocked".
- Colours get a swatch from common names (black, cream, navy, light wash…); write `Faded red #9C4A42` for anything else.
- `featured = TRUE` puts the item in Best sellers. An optional `description` column shows on the product page.

Bad rows are skipped with a console warning. If the fetch fails or `sheet` is unset, `skins/<id>/products.ts` is used.

### Store WhatsApp messages

Built in `lib/whatsapp.ts` (`buildStoreOrderMessage`, `buildProductQuestion`, `buildCustomMixMessage`) and covered by `lib/store.test.ts`. Every order line carries its product link so the shop can tap through.

```
New WHOLESALE order — RR Retail

1 bundle (20 pcs) × Ladies Basic Top — Mixed sizes/colours — ₦60,000
https://…/p/ladies-basic-top-ls
2 bundles (50 pcs) × Baggy Jeans — Mixed sizes/colours — ₦375,000
https://…/p/baggy-jeans

Total: 70 pieces · ₦435,000
Option: Waybill to Abuja (fee to be confirmed)
Name: Chidi · Phone: 0803 000 0000
Note: —
```

### New store client

- [ ] Copy `src/skins/rr-retail` to `src/skins/<client>` and register it in `src/skins/index.ts`
- [ ] Brand, monogram or logo, colours (`mode: 'light'` with the light tokens for a light skin), WhatsApp number, socials
- [ ] Categories with photos; wholesale on/off and default bundle size; pickup address, hours, directions, photo and map
- [ ] Telegram link, TikTok links (`/video/<id>` URLs embed on tap), customer chat screenshots in `public/skins/<client>/`
- [ ] Fallback products from their posts, or connect their sheet
- [ ] New Vercel project with `SKIN=<client>`, and `seo.noindex: true`

## Motion

- **Tiers:** desktop = `(min-width: 1024px) and (pointer: fine)`. GSAP, ScrollTrigger and Lenis are dynamically imported on desktop only, so mobile never downloads them. Motion (Framer Motion) features are lazy-loaded.
- **Desktop:** intro curtain (once per session), hero parallax, pinned horizontal concepts row, custom "View" cursor, clip-path image reveals, fly-to-cart thumbnail, capacity counters, cart drawer from the right with backdrop blur.
- **Mobile:** logo fade, hero image settle (1.08 → 1), headline lines rise, 16px fade-ups, active concept card scales up, cart bottom sheet (spring, drag to close), count bounce and toast.
- **Concept transition:** the card image morphs into the concept hero via the View Transitions API, with a fade fallback.
- **`prefers-reduced-motion`:** no intro, parallax, pinning, cursor or flights; simple fades only.
- **Performance:** only transform and opacity are animated. First-load JS is about 103–145 kB gzipped per route.

## SEO

Per-page metadata comes from the skin, and concept pages are titled "<Concept> in Lekki — <Brand>". The JSON-LD on concept pages is `Restaurant` + `Menu`; the Visit page has `LocalBusiness` with hours and geo. `sitemap.xml` and `robots.txt` are generated from the skin, and the favicon is drawn per skin. Napoleon is `noindex` (`seo.noindex`), and its robots.txt disallows everything until they sign.

## Deploy (Vercel)

One repo, one Vercel project per skin, each with a different `SKIN` env var:

| Project | Env | URL |
| --- | --- | --- |
| maison-lekki | `SKIN=maison-lekki` | public portfolio URL |
| napoleon-preview | `SKIN=napoleon` | private preview URL, shared only with the client |
| rr-retail-preview | `SKIN=rr-retail` | private preview URL, shared only with the client |

`SITE_URL` (optional) overrides `skin.seo.siteUrl` for canonical URLs, the sitemap and OG images. On Vercel the production domain is used automatically.

## New client checklist (target: under 2 hours per pitch skin)

- [ ] Copy `src/skins/maison-lekki` to `src/skins/<client>` and register it in `src/skins/index.ts`
- [ ] Set name, colours, fonts, mode (light/dark) and radius
- [ ] List concepts, hours and categories; drop 6–10 of their photos in `public/skins/<client>/`
- [ ] WhatsApp number, address, map links, socials, 6–8 video links (`/video/<id>` URLs embed on tap)
- [ ] Toggle features; fill the fallback menu from their menu photos (or connect their sheet)
- [ ] New Vercel project with `SKIN=<client>`, and `seo.noindex: true`
- [ ] Test all four WhatsApp messages on a phone before sending the link

## Before the Napoleon pitch

Everything in `[brackets]` in `src/skins/napoleon/` is a placeholder:
- **Photos:** Unsplash stand-ins. Swap in their own interior, food photos and TikTok stills.
- **Menu:** labelled placeholder items with no prices (they show as `₦ —`).
- **To confirm with the owner:** hours, event capacities, the directions note, the story paragraph, the promo line and cake lead time.
- **TikToks:** the tiles link to @napoleon_ng. Replace them with `/video/<id>` URLs so each tile embeds on tap.

## Before the RR Retail pitch

Everything in `[brackets]` in `src/skins/rr-retail/` is a placeholder:
- **Photos:** Unsplash stand-ins for products, categories, hero and TikTok posters. Swap in RR's own TikTok/WhatsApp product photos and stills (`public/skins/rr-retail/`); the brief asks for no model photos that aren't theirs.
- **Logo:** the tile shows a serif "RR" monogram. Add their profile logo as `brand.logo`.
- **Products:** 16 fallback items built from the brief's list. Only the ladies long-sleeve top (₦4,000) and the baggy jeans are from the brief; other prices, and every wholesale price, are samples (shown as "Sample wholesale prices" until `sampleNote` is removed).
- **To confirm with RR:** exact pickup address and shop number, the red-building photo, the Telegram channel link (currently `https://t.me/`), and customer chat screenshots (the strip is hidden until there are some).
- **Checklist:** every product has a real photo and price; all four WhatsApp messages tested on a phone and land on 0904 786 8240; Telegram and TikTok links open the right pages; pickup directions match their pinned video; hours say 12pm–4pm.

## Credits

Default-skin and pitch-skin stand-in photography: [Unsplash](https://unsplash.com/license). Fonts: Fraunces, Cormorant Garamond and Manrope (Google Fonts, self-hosted by `next/font`).
