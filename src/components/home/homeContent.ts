/**
 * Static HOME copy and imagery from the Figma Make design.
 *
 * NOTE: the community figures (48 tys., 2,4 mln) and the hero photo are
 * placeholder marketing content from the design – confirm them before launch.
 */

export const HERO = {
  eyebrow: "Moda w dobrym obiegu",
  titleLead: "Daj rzeczom",
  titleAccent: "drugie życie",
  description:
    "Znajdź wyjątkowe ubrania z drugiej ręki lub zrób miejsce w swojej szafie. Dobre rzeczy zasługują na więcej niż jeden sezon.",
  primaryCta: "Odkrywaj perełki",
  secondaryCta: "Zacznij sprzedawać",
  image: {
    src: "https://images.unsplash.com/photo-1788500304966-2c60274a5de7?auto=format&fit=crop&w=1200&q=80",
    alt: "Starannie wybrane ubrania wiszące w jasnym studio",
  },
  badge: { lead: "Lepszy wybór", accent: "dla planety" },
  proof: {
    avatars: [
      { initial: "A", className: "bg-[#c69374]" },
      { initial: "K", className: "bg-[#6c826d]" },
      { initial: "M", className: "bg-[#9a765f]" },
    ],
    figure: "48 tys.",
    text: "osób daje rzeczom drugie życie",
  },
} as const;

export const CATEGORIES_SECTION = {
  eyebrow: "Znajdź swój styl",
  title: "Przeglądaj kategorie",
  action: "Zobacz wszystkie",
} as const;

export const FEATURED_SECTION = {
  eyebrow: "Wybrane dla Ciebie",
  title: "Świeżo dodane",
  action: "Zobacz więcej",
  emptyTitle: "Jeszcze nic tu nie ma",
  emptyDescription:
    "Nowe perełki pojawią się wkrótce. Zajrzyj do nas niedługo.",
} as const;

export const MISSION = {
  eyebrow: "Moda w drugim obiegu",
  titleLines: ["Moda może krążyć.", "I dobrze jej to robi."],
  description:
    "Kupując z drugiej ręki, wybierasz swój styl bez dokładania planecie ciężaru. Każda transakcja to realna oszczędność zasobów.",
  highlight: "Dobre rzeczy zasługują na drugą szansę.",
  highlightDescription:
    "Sprzedawaj to, czego już nie nosisz, i odkrywaj rzeczy, które mogą stać się Twoimi ulubionymi.",
} as const;
