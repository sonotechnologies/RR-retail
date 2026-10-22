# Maison Lekki

A config-driven Next.js template for multi-concept food spots (restaurant, café, bakery, ice cream, lounge under one roof), by Sono Technologies.

One design system, two skins:

| Skin | `SKIN` | Use |
| --- | --- | --- |
| Maison Lekki | `maison-lekki` (default) | Public portfolio demo: warm paper, terracotta, Fraunces |
| Napoleon | `napoleon` | Private pitch preview (Osapa London, Lekki Phase 2): black and gold, Cormorant Garamond, `noindex` |

There is no backend and no payments. Every action (order, table, cake, event) ends in a pre-filled WhatsApp message.

## Run it

```bash
npm install
npm run dev              # maison-lekki on http://localhost:3000
npm run dev:napoleon     # napoleon skin
npm run build            # production build (fails on an invalid skin config)
npm test                 # WhatsApp message + open-now unit tests
npm run lint && npm run typecheck
```

Requires Node 20+.

## How it is put together

```
src/
  app/                    # routes: / · /[concept] · /reserve · /cakes · /events · /visit · sitemap · robots · icon
  components/
    ui/                   # Button, OpenBadge, Tag, Photo, MapEmbed, Counter…
    layout/               # Header, MobileMenu, Footer, PromoBanner, FloatingWhatsApp, FormPage
    sections/             # Home sections (Hero, Concepts, Signatures, Space, Social, CakesEvents, VisitBlock)
    concept/              # ConceptHero, MenuSpy (sticky tabs + scroll-spy), MenuRow
    cart/                 # Zustand store (localStorage), CartDrawer, AddControl, Toast
    forms/                # Field/Chips/Stepper, WhatsAppSubmit, Reserve/Cake/Event forms
    motion/               # tier detection, Reveal, view transitions, fly-to-cart, desktop tier (GSAP/Lenis)
  lib/
    skin.ts               # getSkin(): reads SKIN, validates with Zod, fails the build on errors
    menu.ts               # Google Sheet CSV fetch (5 min ISR) + fallback menu
    whatsapp.ts           # message builders + Nigerian phone validation
    hours.ts              # open-now logic (Africa/Lagos)
  skins/
    schema.ts             # Zod schema for skins and menu rows
    index.ts              # skin registry
    maison-lekki/{config.ts, menu.ts}
    napoleon/{config.ts, menu.ts}
public/skins/<id>/        # a skin's own photos (relative image paths resolve here)
design/                   # Claude Design handoff bundle (prototypes, brief, chat)
```

**Theming.** Every colour, font and radius is a CSS variable set on `<html>` from the active skin (`app/layout.tsx`) and exposed to Tailwind v4 as `bg-bg`, `text-muted`, `bg-accent`, `rounded-card`, `font-display`… Layouts never hard-code skin values, which is why Napoleon drops in without layout changes. Nothing client-specific lives outside `src/skins/` (and `public/skins/`).

**Feature flags.** `skin.features` hides nav links, sections and routes (`/reserve`, `/cakes` and `/events` return 404 when off).

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

## Credits

Default-skin photography: [Unsplash](https://unsplash.com/license). Fonts: Fraunces, Cormorant Garamond and Manrope (Google Fonts, self-hosted by `next/font`).
