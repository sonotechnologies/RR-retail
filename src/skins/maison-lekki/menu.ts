import type { MenuItemInput } from '../schema';
import { IMG } from './config';

// Fallback menu, used when the Google Sheet is unset or unreachable.
const menu: MenuItemInput[] = [
  // 01 The Restaurant
  { concept: 'restaurant', category: 'Small plates', name: 'Peppered snail skewers', description: 'Grilled snails, ata dindin glaze, scent leaf oil.', price: 12500, tags: ['Spicy'] },
  { concept: 'restaurant', category: 'Small plates', name: 'Plantain & burrata', description: 'Charred ripe plantain, burrata, chilli honey, toasted egusi.', price: 11000, image: IMG.plated },
  { concept: 'restaurant', category: 'Small plates', name: 'Gizdodo croquettes', description: 'Crisp croquettes of gizzard and dodo, pepper mayo.', price: 8500 },
  { concept: 'restaurant', category: 'Mains', name: 'Jollof risotto', description: 'Smoky party-jollof base, carnaroli rice, grilled prawns, crispy shallots.', price: 14500, image: IMG.plated, featured: true },
  { concept: 'restaurant', category: 'Mains', name: 'Banga linguine', description: 'Palm-nut sauce, clams, smoked catfish, fresh herbs.', price: 16000, tags: ['New'] },
  { concept: 'restaurant', category: 'Mains', name: 'Ofada lamb shoulder', description: 'Slow-roasted for eight hours, ayamase jus, ofada rice cake.', price: 28000 },
  { concept: 'restaurant', category: 'Grills', name: 'Suya-spiced ribeye', description: '300g ribeye with yaji butter, roast onions and a sharp tomato salad.', price: 38000, image: IMG.ribeye, tags: ['Spicy'], featured: true },
  { concept: 'restaurant', category: 'Grills', name: 'Whole grilled croaker', description: 'Charcoal-grilled with pepper sauce, yam chips and lime.', price: 26000 },
  { concept: 'restaurant', category: 'Grills', name: 'Asun chicken thighs', description: 'Smoked, then grilled. Peppers, onions, cooling yoghurt.', price: 15500, tags: ['Spicy'] },
  { concept: 'restaurant', category: 'Drinks', name: 'Palm wine sour', description: 'Fresh palm wine, gin, lemon, egg white.', price: 7500 },
  { concept: 'restaurant', category: 'Drinks', name: 'Tiger nut old fashioned', description: 'Bourbon washed in tiger nut milk, bitters, orange.', price: 9000 },

  // 02 The Café
  { concept: 'cafe', category: 'Coffee', name: 'Flat white', description: 'Double shot, silky milk. Oat or tiger nut on request.', price: 4000, image: IMG.drink },
  { concept: 'cafe', category: 'Coffee', name: 'Kunu latte', description: 'Espresso over spiced millet kunu, lightly sweet.', price: 5000, tags: ['New'] },
  { concept: 'cafe', category: 'Coffee', name: 'Cortado', description: 'Equal parts espresso and warm milk.', price: 4000 },
  { concept: 'cafe', category: 'Brunch', name: 'Akara benedict', description: 'Bean fritters, poached eggs, pepper hollandaise.', price: 9500 },
  { concept: 'cafe', category: 'Brunch', name: 'Shakshuka with agege toast', description: 'Eggs baked in tomato and pepper, thick toast.', price: 9000, image: IMG.bowl },
  { concept: 'cafe', category: 'Brunch', name: 'Granola & fruit bowl', description: 'House granola, Greek yoghurt, pineapple, pawpaw, honey.', price: 7000 },
  { concept: 'cafe', category: 'Brunch', name: 'Club sandwich', description: 'Chicken, bacon, egg, tomato, fries on the side.', price: 11000 },
  { concept: 'cafe', category: 'Cold drinks', name: 'Iced zobo spritz', description: 'Hibiscus, ginger, lime and soda over plenty of ice.', price: 4500, image: IMG.drink, featured: true },
  { concept: 'cafe', category: 'Cold drinks', name: 'Cold brew', description: 'Steeped 18 hours, served over ice.', price: 5000 },
  { concept: 'cafe', category: 'Cold drinks', name: 'Chapman', description: 'Grenadine, citrus, cucumber, a lot of ice.', price: 4500 },

  // 03 The Bakery
  { concept: 'bakery', category: 'Breads', name: 'Agege sourdough', description: 'Our slow take on the Lagos classic. Soft crumb, crackly crust, 24-hour ferment.', price: 5500, image: IMG.bread, tags: ['New'] },
  { concept: 'bakery', category: 'Breads', name: 'Honey plantain loaf', description: 'Ripe plantain, wildflower honey and a little nutmeg. Toast it.', price: 7000, image: IMG.bread, featured: true },
  { concept: 'bakery', category: 'Breads', name: 'Coconut bread', description: 'Toasted coconut, brown butter glaze.', price: 4500 },
  { concept: 'bakery', category: 'Pastries', name: 'Chin-chin croissant', description: 'Laminated butter croissant rolled in crushed chin-chin and cinnamon sugar.', price: 4000, image: IMG.croissant, tags: ['New'], featured: true },
  { concept: 'bakery', category: 'Pastries', name: 'Suya beef roll', description: 'Flaky pastry, minced beef, yaji spice and onion.', price: 4500, tags: ['Spicy'] },
  { concept: 'bakery', category: 'Pastries', name: 'Pain au chocolat', description: 'Two batons of dark chocolate.', price: 4000 },
  { concept: 'bakery', category: 'Pastries', name: 'Zobo Danish', description: 'Hibiscus custard and ginger crumble.', price: 4800, available: false },
  { concept: 'bakery', category: 'Cakes', name: 'Burnt Basque cheesecake', description: 'By the slice. Caramelised top, barely set middle.', price: 6500, image: IMG.dessert },
  { concept: 'bakery', category: 'Cakes', name: 'Carrot & tiger nut cake', description: 'Cream cheese frosting, toasted tiger nuts.', price: 6000 },
  { concept: 'bakery', category: 'Drinks', name: 'Cold brew', description: 'Steeped 18 hours, served over ice.', price: 5000, image: IMG.drink },
  { concept: 'bakery', category: 'Drinks', name: 'Chapman lemonade', description: 'Grenadine, citrus, cucumber, a lot of ice.', price: 4500 },

  // 04 The Gelateria
  { concept: 'gelateria', category: 'Scoops', name: 'Puff-puff gelato', description: 'Brown-butter gelato with chunks of fresh puff-puff and nutmeg sugar.', price: 6500, image: IMG.dessert, featured: true },
  { concept: 'gelateria', category: 'Scoops', name: 'Zobo sorbet', description: 'Hibiscus, ginger and clove. Dairy-free.', price: 5000, tags: ['New'] },
  { concept: 'gelateria', category: 'Scoops', name: 'Tiger nut & dates', description: 'Kunu aya base, Medjool dates swirled through.', price: 5500 },
  { concept: 'gelateria', category: 'Scoops', name: 'Dark chocolate', description: 'Ghanaian cocoa, 70%, a pinch of salt.', price: 5000 },
  { concept: 'gelateria', category: 'Sundaes', name: 'Chin-chin sundae', description: 'Vanilla, salted caramel, chin-chin crunch, whipped cream.', price: 8500, image: IMG.gelato },
  { concept: 'gelateria', category: 'Sundaes', name: 'Mango & pepper', description: 'Mango sorbet, chilli-lime syrup, toasted coconut.', price: 8000, tags: ['Spicy'] },
  { concept: 'gelateria', category: 'Shakes', name: 'Malt shake', description: 'Vanilla gelato, malted milk, a Milo dusting.', price: 7000 },
  { concept: 'gelateria', category: 'Shakes', name: 'Affogato', description: 'A scoop of fior di latte drowned in espresso.', price: 5500 },
];

export default menu;
