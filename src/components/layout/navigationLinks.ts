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
  /** Match the path exactly (needed for `/`, which prefixes every route). */
  end?: boolean
}

export interface NavGroup {
  title: string
  items: readonly NavItem[]
}

const MARKETPLACE_LINK: NavItem = {
  label: 'Marketplace',
  to: PATHS.marketplace,
}

export const PRIMARY_LINKS: readonly NavItem[] = [
  { label: 'Strona główna', to: PATHS.home, end: true },
  MARKETPLACE_LINK,
]

/** Fashion is split into its subcategories; other categories link directly. */
export const CATEGORY_LINKS: readonly NavItem[] = [
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

export const FAVORITES_LINK: NavItem = { label: 'Ulubione', to: PATHS.favorites }
export const LOGIN_LINK: NavItem = { label: 'Zaloguj się', to: PATHS.login }
export const SELL_LINK: NavItem = { label: 'Sprzedaj', to: PATHS.createListing }

export const FOOTER_GROUPS: readonly NavGroup[] = [
  { title: 'Kupuj', items: [MARKETPLACE_LINK, ...CATEGORY_LINKS] },
  { title: 'Twoje konto', items: [LOGIN_LINK, FAVORITES_LINK, SELL_LINK] },
]
