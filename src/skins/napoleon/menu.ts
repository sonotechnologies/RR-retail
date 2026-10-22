import type { MenuItemInput } from '../schema';
import { IMG } from './config';

// PLACEHOLDER MENU. Replace names, descriptions and prices from Napoleon's menu photos
// (or point skin.sheet at their Google Sheet). Price 0 renders as "₦ —".
const p = (concept: string, category: string, n: number, extra: Partial<MenuItemInput> = {}): MenuItemInput => ({
  concept,
  category,
  name: `[${category} ${n} — from menu photo]`,
  description: 'Placeholder. Confirm name, description and price from the Napoleon menu.',
  price: 0,
  ...extra,
});

const menu: MenuItemInput[] = [
  p('restaurant', 'Mains', 1, { image: IMG.ribeye, featured: true }),
  p('restaurant', 'Mains', 2, { image: IMG.plated, featured: true }),
  p('restaurant', 'Mains', 3),
  p('restaurant', 'Grills', 1),
  p('restaurant', 'Grills', 2, { tags: ['Spicy'] }),
  p('restaurant', 'Drinks', 1),
  p('restaurant', 'Drinks', 2),

  p('cafe-bakery', 'Coffee', 1, { image: IMG.drink, featured: true }),
  p('cafe-bakery', 'Coffee', 2),
  p('cafe-bakery', 'Pastries', 1, { image: IMG.croissant, tags: ['New'], featured: true }),
  p('cafe-bakery', 'Pastries', 2),
  p('cafe-bakery', 'Cakes', 1, { image: IMG.dessert }),
  p('cafe-bakery', 'Cakes', 2, { available: false }),

  p('ice-cream', 'Scoops', 1, { image: IMG.dessert, featured: true }),
  p('ice-cream', 'Scoops', 2),
  p('ice-cream', 'Scoops', 3),
  p('ice-cream', 'Cups & cones', 1),
  p('ice-cream', 'Cups & cones', 2),
];

export default menu;
