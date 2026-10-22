import type { MenuItemInput, SkinInput } from './schema';
import maisonLekki from './maison-lekki/config';
import maisonLekkiMenu from './maison-lekki/menu';
import napoleon from './napoleon/config';
import napoleonMenu from './napoleon/menu';

/** Register new client skins here (copy skins/maison-lekki to skins/<client>). */
export const SKINS: Record<string, { config: SkinInput; menu: MenuItemInput[] }> = {
  'maison-lekki': { config: maisonLekki, menu: maisonLekkiMenu },
  napoleon: { config: napoleon, menu: napoleonMenu },
};
