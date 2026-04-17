// Единые константы SEO. Поменять `SITE_URL` на прод-домен при деплое на REG.RU.

export const SITE_URL = 'https://alanpir.ru';

// Подставить при получении ID от клиента
export const YANDEX_METRIKA_ID: string | null = null; // например: '98765432'
export const GOOGLE_ANALYTICS_ID: string | null = null; // например: 'G-XXXXXXXXXX'
export const SITE_NAME = 'АланПир';
export const SITE_PHONE = '+7 (926) 386-33-70';
export const SITE_PHONE_RAW = '+79263863370';
export const SITE_EMAIL = 'rizvanovibragim@yandex.ru';
export const SITE_ADDRESS = {
  street: 'ул. Тихвинская, 20',
  city: 'Москва',
  region: 'Москва',
  postalCode: '127055',
  country: 'RU',
};
export const SITE_GEO = { lat: 55.7879, lon: 37.5876 };

export const DEFAULT_TITLE = 'АланПир — Осетинские пироги с доставкой по Москве';
export const DEFAULT_DESCRIPTION =
  'Традиционные осетинские пироги ручной лепки. Печём под заказ, доставляем горячими за 40–120 минут по Москве. Фыдджын, Цахараджын, Уалибах и другие.';

export const KEYWORDS = [
  'осетинские пироги',
  'доставка пирогов москва',
  'фыдджын',
  'цахараджын',
  'уалибах',
  'картофджын',
  'пироги с мясом',
  'пироги с сыром',
  'пироги в подарок',
  'осетинские пироги на заказ',
];

export function restaurantJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: SITE_NAME,
    url: SITE_URL,
    telephone: SITE_PHONE_RAW,
    email: SITE_EMAIL,
    image: `${SITE_URL}/og.jpg`,
    servesCuisine: ['Осетинская кухня', 'Кавказская кухня'],
    priceRange: '₽₽',
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_ADDRESS.street,
      addressLocality: SITE_ADDRESS.city,
      addressRegion: SITE_ADDRESS.region,
      postalCode: SITE_ADDRESS.postalCode,
      addressCountry: SITE_ADDRESS.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE_GEO.lat,
      longitude: SITE_GEO.lon,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:30',
        closes: '20:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday'],
        opens: '10:00',
        closes: '17:00',
      },
    ],
    hasDeliveryMethod: 'http://purl.org/goodrelations/v1#DeliveryModeOwnFleet',
    acceptsReservations: false,
    menu: `${SITE_URL}/catalog/`,
    sameAs: [],
  };
}

export function menuJsonLd(products: Array<{ id: string; title: string; composition?: string; weights: Array<{ weight: string; price: number }>; image?: string; categorySlug: string }>) {
  const byCat = products.reduce<Record<string, typeof products>>((acc, p) => {
    (acc[p.categorySlug] = acc[p.categorySlug] || []).push(p);
    return acc;
  }, {});

  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: `Меню ${SITE_NAME}`,
    hasMenuSection: Object.entries(byCat).map(([cat, items]) => ({
      '@type': 'MenuSection',
      name: cat,
      hasMenuItem: items.map((p) => ({
        '@type': 'MenuItem',
        name: p.title,
        description: p.composition || undefined,
        image: p.image ? `${SITE_URL}${p.image}` : undefined,
        offers: p.weights.map((w) => ({
          '@type': 'Offer',
          name: w.weight,
          price: w.price,
          priceCurrency: 'RUB',
          availability: 'https://schema.org/InStock',
        })),
      })),
    })),
  };
}
