import type { FoodSkinInput, MenuItemInput, ProductInput, StoreSkinInput } from './schema';
import maisonLekki from './maison-lekki/config';
import maisonLekkiMenu from './maison-lekki/menu';
import napoleon from './napoleon/config';
import napoleonMenu from './napoleon/menu';
import rrRetail from './rr-retail/config';
import rrRetailProducts from './rr-retail/products';

export type SkinEntry = { config: FoodSkinInput; menu: MenuItemInput[] } | { config: StoreSkinInput; products: ProductInput[] };

/** Register new client skins here: copy skins/maison-lekki (food) or skins/rr-retail (store) to skins/<client>. */
export const SKINS: Record<string, SkinEntry> = {
  'maison-lekki': { config: maisonLekki, menu: maisonLekkiMenu },
  napoleon: { config: napoleon, menu: napoleonMenu },
  'rr-retail': { config: rrRetail, products: rrRetailProducts },
};
