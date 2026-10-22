# RR Retail — Design Brief

Oct 22, 2026 · @Sono Technologies

## Overview

RR Retail Stores (@rr.retail.stores) sells affordable fashion in Lagos, retail and wholesale, through WhatsApp only (0904 786 8240), a Telegram channel and a pickup station. This site is a new **store mode** on the Maison Lekki template, with RR as its first skin, so it can be re-skinned for other WhatsApp-first clothing sellers.

- **Customer goals:** browse what's in stock with prices, pick size and colour, order retail or by the bundle, find the pickup station.
- **Business goals:** stop answering "how much?" and "is it available?" in DMs; get clean, complete orders on WhatsApp; grow the Telegram channel; look trustworthy to new wholesale buyers.
- **Pitch goal:** RR should see their own stock, prices and logo and think "this would save me hours a day".
- **Primary device:** cheap Android on mobile data, arriving from TikTok. Desktop is secondary.

## Design direction and tokens

Affordable, but classy: a premium-feeling shop window with prices you can afford. Their logo (black with rose-gold serif "RR") sets the tone; product photos and big, clear prices do the selling.

- **Price-first:** prices are large and bold everywhere; wholesale price always visible next to retail.
- **Fast and scannable:** two-column product grid on mobile, tight spacing, no long text.
- **Trust signals:** pickup address, opening hours, WhatsApp number and real customer screenshots visible early.
- **Avoid:** luxury-brand coldness, tiny prices, desktop-style mega menus.

| Token | RR skin |
| --- | --- |
| bg | #0F0E0D near-black |
| surface | #1B1917 |
| text | #F5EFE9 |
| text-muted | #A89F96 |
| accent | #D29A7E rose gold |
| accent-ink | #0F0E0D |
| sale / sold-out | #E2574C / #5C5650 |
| line | #2D2926 |
| Display font | Cormorant Garamond 600 (headings, logo-echo) |
| Body / prices | Manrope 500–800 (prices in 800) |
| Radius | 10px cards, full-round buttons and chips |

Optional light variant for other clients: bg #FAF6F2, text #1C1917, same accent. The type scale and spacing follow the Maison Lekki design brief.

## Page layouts

Shared: sticky header (logo, search icon, bag icon with count), bottom tab bar on mobile (Home, Shop, Wholesale, Pickup, Bag), floating WhatsApp button, footer with WhatsApp, Telegram, TikTok, address and hours.

**Home**

1. Hero: model or rack photo, "Rack it. Restock it. Rock it.", buttons Shop now + Buy wholesale.
2. Just restocked: horizontal row of newest items with "New" badge.
3. Shop by category: big tiles (Ladies, Men, Jeans & Joggers, Basics, Bundles).
4. Best sellers grid (6–8 items).
5. How to order: 3 steps (Add to bag → Send on WhatsApp → Pick up or get it delivered).
6. Wholesale banner: "Buying for your shop? Get bundle prices" → Wholesale page.
7. Join our Telegram: daily new stock drops, big button.
8. Seen on TikTok: 6 video tiles; customer chat screenshots as social proof.
9. Pickup station card: address, map, 12pm–4pm.

**Category page** — title, item count, filter chips (size, price range, in stock), sort (newest, price low–high); 2-column grid of product cards.

**Product page** — swipeable photos; name; retail price large, wholesale price + minimum bundle beneath; colour swatches; size chips (sold-out sizes struck through); Retail / Wholesale toggle that switches the quantity stepper (pieces vs bundles); Add to bag + "Ask on WhatsApp" (sends product name and link); related items.

**Wholesale page** — how bundles work, minimum quantities, bundle price list table, "Request a custom mix" form (items + quantities) sent to WhatsApp.

**Pickup & delivery page** — step-by-step directions with photo of the building, map, hours, Lagos delivery and waybill outside Lagos (fees confirmed on WhatsApp).

**Bag** — bottom sheet on mobile: items with size, colour, qty, retail/wholesale label; subtotal; Pickup / Lagos delivery / Waybill choice; name, phone, address (if delivery), note; "Send order on WhatsApp".

## Components and motion

| Component | Notes | States |
| --- | --- | --- |
| Product card | 4:5 photo, name (1 line), retail price bold, "Wholesale from ₦X" small, badges (New, Restocked, Few left) | default, sold out (greyed), added |
| Price block | Retail ₦ large; wholesale ₦ per piece × min bundle | retail mode, wholesale mode |
| Mode toggle | Segmented Retail / Wholesale; remembers last choice | retail, wholesale |
| Size / colour chips | Round chips; colour swatches | selected, unavailable |
| Qty stepper | Pieces in retail, bundles in wholesale, shows total pieces | min, max |
| Bottom tab bar | 5 icons + labels, bag count badge | active tab |
| Bag sheet | Drag handle, grouped lines, delivery choice | empty, filled, sending |
| Telegram CTA | Telegram-blue icon, member count optional | default |
| Badge | New / Restocked / Few left / Sold out | — |
| Category tile | Photo + label overlay | pressed |

**Motion** (lighter than Maison Lekki; buyers are on cheap phones):

- Mobile: fade-up reveals, image fade-in from blur, bag sheet spring, add-to-bag count bounce + toast, swipe gallery with snap.
- Desktop: product images zoom on hover, second photo on hover, hero image slow parallax, add-to-bag thumbnail flies to the bag.
- Respect reduced motion; nothing over 400ms on mobile.

## Copy and imagery

Tone: friendly, direct, a little playful, the way they talk on TikTok. Short lines, light pidgin allowed in badges and toasts.

- Hero: "Rack it. Restock it. Rock it." / "Affordable fashion in Lagos. Retail and wholesale."
- Wholesale banner: "Buying for your shop? Bundle prices start here."
- Add-to-bag toast: "Added! Your bag dey wait 🛍️"
- Empty bag: "Nothing here yet. Start with what just restocked."
- Telegram: "New stock drops daily on our Telegram. Don't miss am."
- Products for the demo: Ladies basic tops (long sleeve) ₦4,000, round necks, joggers, baggy jeans, polos, vintage tops; wholesale bundles of 20–30 pieces. Wholesale prices are placeholders until RR confirms.

**Imagery:** their own TikTok/WhatsApp product photos and stills for the RR skin (private demo); clean flat-lays or hanger shots on a plain background where possible. Use their logo from the profile; no model photos that aren't theirs. Pickup page uses their red-building direction photo.

## Deliverables

Mobile (390px) first, then desktop (1440px).

- [ ] RR token sheet + light variant
- [ ] Components with states (card, price block, mode toggle, chips, stepper, bag sheet, tab bar)
- [ ] Home — mobile + desktop
- [ ] Category page — mobile + desktop
- [ ] Product page — retail and wholesale modes, mobile
- [ ] Wholesale page, Pickup & delivery page — mobile
- [ ] Bag sheet — empty, retail order, wholesale order
- [ ] WhatsApp message previews (retail order, wholesale order, product question, custom bundle)
