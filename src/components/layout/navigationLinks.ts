import {
  CATEGORIES,
  CATEGORY_LABELS,
  FASHION_SUBCATEGORIES,
  FASHION_SUBCATEGORY_LABELS,
} from '../../utils/constants'
import { marketplacePath, PATHS } from '../../utils/paths'

export interface NavItem {
  label: string
  to: string
}

export interface NavGroup {
  title: string
  items: readonly NavItem[]
}

/** Desktop reaches home via the logo; the mobile drawer lists it explicitly. */
export const HOME_LINK: NavItem = { label: 'Strona główna', to: PATHS.home }

/** Unfiltered marketplace – active only when no category filter is applied. */
const ALL_PRODUCTS_LINK: NavItem = {
  label: 'Wszystkie produkty',
  to: PATHS.marketplace,
}

/** Fashion is split into its subcategories; other categories link directly. */
const CATEGORY_LINKS: readonly NavItem[] = [
  ...FASHION_SUBCATEGORIES.map((subcategory) => ({
    label: FASHION_SUBCATEGORY_LABELS[subcategory],
    to: marketplacePath({ category: 'fashion', subcategory }),
  })),
  ...CATEGORIES.filter((category) => category !== 'fashion').map(
    (category) => ({
      label: CATEGORY_LABELS[category],
      to: marketplacePath({ category }),
    }),
  ),
]

/** "All products" followed by every category – the shop navigation everywhere. */
export const SHOP_LINKS: readonly NavItem[] = [
  ALL_PRODUCTS_LINK,
  ...CATEGORY_LINKS,
]

export const FAVORITES_LINK: NavItem = { label: 'Ulubione', to: PATHS.favorites }
export const LOGIN_LINK: NavItem = { label: 'Zaloguj się', to: PATHS.login }
export const SELL_LINK: NavItem = { label: 'Sprzedaj', to: PATHS.createListing }

export const FOOTER_GROUPS: readonly NavGroup[] = [
  { title: 'Kupuj', items: SHOP_LINKS },
  { title: 'Twoje konto', items: [LOGIN_LINK, FAVORITES_LINK, SELL_LINK] },
]
