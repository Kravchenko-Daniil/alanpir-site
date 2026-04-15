// frontend-next/lib/menu.ts
// Автогенерация из frontend/data/nashpir_menu.json (62 позиции).
// Когда появятся фото: заполнить поле `image` (например, "/menu/fydjyn.jpg").
// Фото класть в frontend-next/public/menu/.

export type Category =
  | 'Осетинские'
  | 'Мясные'
  | 'Сырные'
  | 'Куриные'
  | 'Картофельные'
  | 'Рыбные'
  | 'Сладкие пироги'
  | 'Сеты'
  | 'Соусы'
  | 'Напитки';

export type CategorySlug =
  | 'all'
  | 'ossetian'
  | 'meat'
  | 'cheese'
  | 'chicken'
  | 'potato'
  | 'fish'
  | 'sweet'
  | 'set'
  | 'sauce'
  | 'drink';

export type WeightOption = {
  weight: string;
  price: number;
};

export type Badge = 'hit' | 'new';

export type Product = {
  id: string;
  category: Category;
  categorySlug: CategorySlug;
  title: string;
  composition: string;
  weights: WeightOption[];
  emoji: string;
  image?: string;
  badge?: Badge;
  isLean?: boolean;
};

export const CATEGORIES: { slug: CategorySlug; label: string }[] = [
  { slug: 'all', label: 'Все' },
  { slug: 'ossetian', label: 'Осетинские' },
  { slug: 'meat', label: 'Мясные' },
  { slug: 'cheese', label: 'Сырные' },
  { slug: 'chicken', label: 'Куриные' },
  { slug: 'potato', label: 'Картофельные' },
  { slug: 'fish', label: 'Рыбные' },
  { slug: 'sweet', label: 'Сладкие' },
  { slug: 'set', label: 'Сеты' },
  { slug: 'sauce', label: 'Соусы' },
  { slug: 'drink', label: 'Напитки' },
];

export const MENU: Product[] = [
  {
    "id": "osetinskii-pirog-s-myasom-fyddzhyn",
    "category": "Осетинские",
    "categorySlug": "ossetian",
    "title": "Осетинский пирог с мясом “Фыдджын”",
    "composition": "говядина, лук, чеснок, острый перец, специи",
    "weights": [
      {
        "weight": "700 г",
        "price": 1020
      },
      {
        "weight": "1000 г",
        "price": 1340
      },
      {
        "weight": "1200 г",
        "price": 1450
      }
    ],
    "emoji": "🥧",
    "isLean": false
  },
  {
    "id": "osetinskiy-pirog-s-syrom-i-svekolnymi-listyami-tsaharadzhyn",
    "category": "Осетинские",
    "categorySlug": "ossetian",
    "title": "Осетинский пирог с сыром и свекольными листьями “Цахараджын”",
    "composition": "осетинский сыр, свекольные листья, специи",
    "weights": [
      {
        "weight": "600 г",
        "price": 820
      },
      {
        "weight": "1000 г",
        "price": 1240
      },
      {
        "weight": "1200 г",
        "price": 1350
      }
    ],
    "emoji": "🥧",
    "isLean": false
  },
  {
    "id": "osetinskiy-pirog-s-syrom-ualibah",
    "category": "Осетинские",
    "categorySlug": "ossetian",
    "title": "Осетинский пирог с сыром “Уалибах”",
    "composition": "осетинский сыр, специи",
    "weights": [
      {
        "weight": "600 г",
        "price": 820
      },
      {
        "weight": "1000 г",
        "price": 1240
      },
      {
        "weight": "1200 г",
        "price": 1350
      }
    ],
    "emoji": "🥧",
    "isLean": false,
    "badge": "hit"
  },
  {
    "id": "osetinskiy-pirog-s-zelenym-lukom-i-syrom-kadyndzdzhyn",
    "category": "Осетинские",
    "categorySlug": "ossetian",
    "title": "Осетинский пирог с зеленым луком и сыром “Кадындзджын”",
    "composition": "осетинский сыр, зеленый лук, специи",
    "weights": [
      {
        "weight": "600 г",
        "price": 820
      },
      {
        "weight": "1000 г",
        "price": 1240
      },
      {
        "weight": "1200 г",
        "price": 1350
      }
    ],
    "emoji": "🥧",
    "isLean": false
  },
  {
    "id": "osetinskiy-pirog-s-kartofelem-i-syrom-kartofdzhyn",
    "category": "Осетинские",
    "categorySlug": "ossetian",
    "title": "Осетинский пирог с картофелем и сыром “Картофджын”",
    "composition": "картофель, осетинский сыр, лук, укроп, острый перец, специи",
    "weights": [
      {
        "weight": "600 г",
        "price": 820
      },
      {
        "weight": "1000 г",
        "price": 1090
      },
      {
        "weight": "1200 г",
        "price": 1190
      }
    ],
    "emoji": "🥧",
    "isLean": false
  },
  {
    "id": "osetinskiy-pirog-s-kapustoi-kabuskadzhyn",
    "category": "Осетинские",
    "categorySlug": "ossetian",
    "title": "Осетинский пирог с капустой “Кабускаджын”",
    "composition": "капуста, грецкий орех, лук, острый перец, специи",
    "weights": [
      {
        "weight": "600 г",
        "price": 690
      },
      {
        "weight": "1000 г",
        "price": 890
      },
      {
        "weight": "1200 г",
        "price": 990
      }
    ],
    "emoji": "🥧",
    "isLean": false
  },
  {
    "id": "osetinskiy-pirog-s-tykvoi-nasdzhyn",
    "category": "Осетинские",
    "categorySlug": "ossetian",
    "title": "Осетинский пирог с тыквой “Насджын”",
    "composition": "Начинка: тыква, лук (репчатый и красный), специи",
    "weights": [
      {
        "weight": "600 г",
        "price": 740
      },
      {
        "weight": "1000 г",
        "price": 920
      },
      {
        "weight": "1200 г",
        "price": 1050
      }
    ],
    "emoji": "🥧",
    "isLean": false
  },
  {
    "id": "osetinskiy-sladkiy-pirog-s-vishnei-baldzhyn",
    "category": "Осетинские",
    "categorySlug": "ossetian",
    "title": "Осетинский сладкий пирог с вишней “Балджын”",
    "composition": "вишня, сахарная пудра",
    "weights": [
      {
        "weight": "700 г",
        "price": 990
      },
      {
        "weight": "1000 г",
        "price": 1250
      }
    ],
    "emoji": "🥧",
    "isLean": false
  },
  {
    "id": "osetinskiy-pirog-s-myasom-i-zelenyu",
    "category": "Мясные",
    "categorySlug": "meat",
    "title": "Осетинский пирог с мясом и зеленью",
    "composition": "говядина, зелень, лук, чеснок, острый перец, специи",
    "weights": [
      {
        "weight": "700 г",
        "price": 1040
      },
      {
        "weight": "1000 г",
        "price": 1340
      },
      {
        "weight": "1200 г",
        "price": 1430
      }
    ],
    "emoji": "🥩",
    "isLean": false
  },
  {
    "id": "osetinskiy-pirog-s-myasom-i-gribami",
    "category": "Мясные",
    "categorySlug": "meat",
    "title": "Осетинский пирог с мясом и грибами",
    "composition": "говядина, шампиньоны, лук, чеснок, острый перец, специи",
    "weights": [
      {
        "weight": "700 г",
        "price": 1020
      },
      {
        "weight": "1000 г",
        "price": 1380
      },
      {
        "weight": "1200 г",
        "price": 1480
      }
    ],
    "emoji": "🥩",
    "isLean": false
  },
  {
    "id": "osetinskiy-pirog-s-myasom-pomidorom-i-bolgarskim-pertsem",
    "category": "Мясные",
    "categorySlug": "meat",
    "title": "Осетинский пирог с мясом, помидором и болгарским перцем",
    "composition": "говядина, помидор, болгарский перец, лук, чеснок, острый перец, специи",
    "weights": [
      {
        "weight": "700 г",
        "price": 1020
      },
      {
        "weight": "1000 г",
        "price": 1380
      },
      {
        "weight": "1200 г",
        "price": 1480
      }
    ],
    "emoji": "🥩",
    "isLean": false
  },
  {
    "id": "osetinskii-pirog-s-myasom-fyddzhyn-2",
    "category": "Мясные",
    "categorySlug": "meat",
    "title": "Осетинский пирог с мясом “Фыдджын”",
    "composition": "говядина, лук, чеснок, острый перец, специи",
    "weights": [
      {
        "weight": "700 г",
        "price": 1020
      },
      {
        "weight": "1000 г",
        "price": 1340
      },
      {
        "weight": "1200 г",
        "price": 1450
      }
    ],
    "emoji": "🥩",
    "isLean": false
  },
  {
    "id": "osetinskiy-pirog-s-myasom-syrom-i-bolgarskim-pertsem",
    "category": "Мясные",
    "categorySlug": "meat",
    "title": "Осетинский пирог с мясом, сыром и болгарским перцем",
    "composition": "говядина, осетинский сыр, болгарский перец, лук, чеснок, острый перец, специи",
    "weights": [
      {
        "weight": "700 г",
        "price": 1020
      },
      {
        "weight": "1000 г",
        "price": 1380
      },
      {
        "weight": "1200 г",
        "price": 1480
      }
    ],
    "emoji": "🥩",
    "isLean": false
  },
  {
    "id": "osetinskiy-pirog-s-myasom-i-kartofelem",
    "category": "Мясные",
    "categorySlug": "meat",
    "title": "Осетинский пирог с мясом и картофелем",
    "composition": "говядина, картофель, лук,чеснок, острый перец, специи",
    "weights": [
      {
        "weight": "700 г",
        "price": 1020
      },
      {
        "weight": "1000 г",
        "price": 1380
      },
      {
        "weight": "1200 г",
        "price": 1480
      }
    ],
    "emoji": "🥩",
    "isLean": false
  },
  {
    "id": "osetinskiy-pirog-s-myasom-i-bolgarskim-pertsem",
    "category": "Мясные",
    "categorySlug": "meat",
    "title": "Осетинский пирог с мясом и болгарским перцем",
    "composition": "говядина, болгарский перец, лук,чеснок, острый перец, специи",
    "weights": [
      {
        "weight": "700 г",
        "price": 1020
      },
      {
        "weight": "1000 г",
        "price": 1380
      },
      {
        "weight": "1200 г",
        "price": 1490
      }
    ],
    "emoji": "🥩",
    "isLean": false
  },
  {
    "id": "osetinskiy-pirog-s-myasom-i-kapustoy",
    "category": "Мясные",
    "categorySlug": "meat",
    "title": "Осетинский пирог с мясом и капустой",
    "composition": "говядина, капуста",
    "weights": [
      {
        "weight": "700 г",
        "price": 1020
      },
      {
        "weight": "1000 г",
        "price": 1290
      },
      {
        "weight": "1200 г",
        "price": 1390
      }
    ],
    "emoji": "🥩",
    "isLean": false
  },
  {
    "id": "osetinskiy-pirog-s-syrom-i-svekolnymi-listyami-tsaharadzhyn-2",
    "category": "Сырные",
    "categorySlug": "cheese",
    "title": "Осетинский пирог с сыром и свекольными листьями “Цахараджын”",
    "composition": "осетинский сыр, свекольные листья, специи",
    "weights": [
      {
        "weight": "600 г",
        "price": 820
      },
      {
        "weight": "1000 г",
        "price": 1240
      },
      {
        "weight": "1200 г",
        "price": 1350
      }
    ],
    "emoji": "🧀",
    "isLean": true
  },
  {
    "id": "osetinskiy-pirog-s-syrom-ualibah-2",
    "category": "Сырные",
    "categorySlug": "cheese",
    "title": "Осетинский пирог с сыром “Уалибах”",
    "composition": "осетинский сыр, специи",
    "weights": [
      {
        "weight": "600 г",
        "price": 820
      },
      {
        "weight": "1000 г",
        "price": 1240
      },
      {
        "weight": "1200 г",
        "price": 1350
      }
    ],
    "emoji": "🧀",
    "isLean": true
  },
  {
    "id": "osetinskiy-pirog-s-syrom-i-zelenyu",
    "category": "Сырные",
    "categorySlug": "cheese",
    "title": "Осетинский пирог с сыром и зеленью",
    "composition": "осетинский сыр, укроп, специи",
    "weights": [
      {
        "weight": "600 г",
        "price": 820
      },
      {
        "weight": "1000 г",
        "price": 1240
      },
      {
        "weight": "1200 г",
        "price": 1350
      }
    ],
    "emoji": "🧀",
    "isLean": true
  },
  {
    "id": "osetinskiy-pirog-s-syrom-i-shpinatom",
    "category": "Сырные",
    "categorySlug": "cheese",
    "title": "Осетинский пирог с сыром и шпинатом",
    "composition": "осетинский сыр, шпинат, специи",
    "weights": [
      {
        "weight": "600 г",
        "price": 820
      },
      {
        "weight": "1000 г",
        "price": 1240
      },
      {
        "weight": "1200 г",
        "price": 1350
      }
    ],
    "emoji": "🧀",
    "isLean": true
  },
  {
    "id": "osetinskiy-pirog-s-syrom-i-gribami",
    "category": "Сырные",
    "categorySlug": "cheese",
    "title": "Осетинский пирог с сыром и грибами",
    "composition": "осетинский сыр, грибы, специи",
    "weights": [
      {
        "weight": "600 г",
        "price": 820
      },
      {
        "weight": "1000 г",
        "price": 1240
      },
      {
        "weight": "1200 г",
        "price": 1350
      }
    ],
    "emoji": "🧀",
    "isLean": true
  },
  {
    "id": "osetinskiy-pirog-s-zelenym-lukom-i-syrom-kadyndzdzhyn-2",
    "category": "Сырные",
    "categorySlug": "cheese",
    "title": "Осетинский пирог с зеленым луком и сыром “Кадындзджын”",
    "composition": "осетинский сыр, зеленый лук, специи",
    "weights": [
      {
        "weight": "600 г",
        "price": 820
      },
      {
        "weight": "1000 г",
        "price": 1240
      },
      {
        "weight": "1200 г",
        "price": 1350
      }
    ],
    "emoji": "🧀",
    "isLean": true
  },
  {
    "id": "osetinskiy-pirog-s-kuritsey-i-syrom",
    "category": "Куриные",
    "categorySlug": "chicken",
    "title": "Осетинский пирог с курицей и сыром",
    "composition": "курица, осетинский сыр, помидор, специи",
    "weights": [
      {
        "weight": "600 г",
        "price": 920
      },
      {
        "weight": "1000 г",
        "price": 1290
      },
      {
        "weight": "1200 г",
        "price": 1420
      }
    ],
    "emoji": "🍗",
    "isLean": false
  },
  {
    "id": "osetinskiy-pirog-s-kuritsey-gribami-i-syrom",
    "category": "Куриные",
    "categorySlug": "chicken",
    "title": "Осетинский пирог с курицей, грибами и сыром",
    "composition": "курица, шампиньоны, осетинский сыр, помидор, специи",
    "weights": [
      {
        "weight": "600 г",
        "price": 920
      },
      {
        "weight": "1000 г",
        "price": 1320
      },
      {
        "weight": "1200 г",
        "price": 1420
      }
    ],
    "emoji": "🍗",
    "isLean": false
  },
  {
    "id": "osetinskiy-pirog-s-kuritsey-gribami-syrom-i-bolgarskim-pertsem",
    "category": "Куриные",
    "categorySlug": "chicken",
    "title": "Осетинский пирог с курицей, грибами, сыром и болгарским перцем",
    "composition": "курица, шампиньоны, осетинский сыр, помидор, болгарский перец, специи",
    "weights": [
      {
        "weight": "600 г",
        "price": 920
      },
      {
        "weight": "1000 г",
        "price": 1320
      },
      {
        "weight": "1200 г",
        "price": 1420
      }
    ],
    "emoji": "🍗",
    "isLean": false
  },
  {
    "id": "osetinskiy-pirog-s-kartofelem-zelenyu-i-syrom",
    "category": "Картофельные",
    "categorySlug": "potato",
    "title": "Осетинский пирог с картофелем, зеленью и сыром",
    "composition": "картофель, осетинский сыр, лук, укроп, острый перец, специи",
    "weights": [
      {
        "weight": "600 г",
        "price": 780
      },
      {
        "weight": "1000 г",
        "price": 1090
      },
      {
        "weight": "1200 г",
        "price": 1190
      }
    ],
    "emoji": "🥔",
    "isLean": true
  },
  {
    "id": "osetinskiy-pirog-s-kartofelem-i-syrom-kartofdzhyn-2",
    "category": "Картофельные",
    "categorySlug": "potato",
    "title": "Осетинский пирог с картофелем и сыром “Картофджын”",
    "composition": "картофель, осетинский сыр, лук, укроп, острый перец, специи",
    "weights": [
      {
        "weight": "600 г",
        "price": 820
      },
      {
        "weight": "1000 г",
        "price": 1090
      },
      {
        "weight": "1200 г",
        "price": 1190
      }
    ],
    "emoji": "🥔",
    "isLean": true
  },
  {
    "id": "osetinskiy-pirog-s-kartofelem-gribami-i-syrom",
    "category": "Картофельные",
    "categorySlug": "potato",
    "title": "Осетинский пирог с картофелем, грибами и сыром",
    "composition": "картофель, шампиньоны, осетинский сыр, специи",
    "weights": [
      {
        "weight": "600 г",
        "price": 850
      },
      {
        "weight": "1000 г",
        "price": 1090
      },
      {
        "weight": "1200 г",
        "price": 1190
      }
    ],
    "emoji": "🥔",
    "isLean": true
  },
  {
    "id": "osetinskiy-pirog-s-kartofelem-i-gribami",
    "category": "Картофельные",
    "categorySlug": "potato",
    "title": "Осетинский пирог с картофелем и грибами",
    "composition": "картофель, шампиньоны, специи",
    "weights": [
      {
        "weight": "600 г",
        "price": 750
      },
      {
        "weight": "1000 г",
        "price": 890
      },
      {
        "weight": "1200 г",
        "price": 990
      }
    ],
    "emoji": "🥔",
    "isLean": true
  },
  {
    "id": "osetinskiy-pirog-s-kartofelem-i-zelenyu",
    "category": "Картофельные",
    "categorySlug": "potato",
    "title": "Осетинский пирог с картофелем и зеленью",
    "composition": "картофель, лук, укроп, острый перец, специи",
    "weights": [
      {
        "weight": "600 г",
        "price": 750
      },
      {
        "weight": "1000 г",
        "price": 890
      },
      {
        "weight": "1200 г",
        "price": 990
      }
    ],
    "emoji": "🥔",
    "isLean": true
  },
  {
    "id": "osetinskiy-pirog-s-semgoi-i-shpinatom",
    "category": "Рыбные",
    "categorySlug": "fish",
    "title": "Осетинский пирог с семгой и шпинатом",
    "composition": "семга, шпинат, лук, специи",
    "weights": [
      {
        "weight": "700 г",
        "price": 1740
      },
      {
        "weight": "1000 г",
        "price": 2090
      },
      {
        "weight": "1200 г",
        "price": 2320
      }
    ],
    "emoji": "🐟",
    "isLean": false
  },
  {
    "id": "osetinskiy-pirog-s-semgoi-i-syrom",
    "category": "Рыбные",
    "categorySlug": "fish",
    "title": "Осетинский пирог с семгой и сыром",
    "composition": "семга, осетинский сыр, укроп, лук, специи",
    "weights": [
      {
        "weight": "700 г",
        "price": 1740
      },
      {
        "weight": "1000 г",
        "price": 2090
      },
      {
        "weight": "1200 г",
        "price": 2320
      }
    ],
    "emoji": "🐟",
    "isLean": false
  },
  {
    "id": "osetinskiy-pirog-s-semgoi",
    "category": "Рыбные",
    "categorySlug": "fish",
    "title": "Осетинский пирог с семгой",
    "composition": "семга, укроп, лук, специи",
    "weights": [
      {
        "weight": "700 г",
        "price": 1740
      },
      {
        "weight": "1000 г",
        "price": 2090
      },
      {
        "weight": "1200 г",
        "price": 2320
      }
    ],
    "emoji": "🐟",
    "isLean": false
  },
  {
    "id": "sladkiy-pirog-s-chernikoy-i-smorodinoy",
    "category": "Сладкие пироги",
    "categorySlug": "sweet",
    "title": "Сладкий пирог с черникой и смородиной",
    "composition": "черника, смородина, сахарная пудра",
    "weights": [
      {
        "weight": "700 г",
        "price": 1020
      },
      {
        "weight": "1000 г",
        "price": 1290
      }
    ],
    "emoji": "🍰",
    "isLean": true
  },
  {
    "id": "sladkiy-pirog-s-golubikoy",
    "category": "Сладкие пироги",
    "categorySlug": "sweet",
    "title": "Сладкий пирог с голубикой",
    "composition": "голубика, сахарная пудра",
    "weights": [
      {
        "weight": "700 г",
        "price": 1020
      },
      {
        "weight": "1000 г",
        "price": 1190
      }
    ],
    "emoji": "🍰",
    "isLean": true
  },
  {
    "id": "osetinskiy-sladkiy-pirog-s-vishnei-baldzhyn-2",
    "category": "Сладкие пироги",
    "categorySlug": "sweet",
    "title": "Осетинский сладкий пирог с вишней “Балджын”",
    "composition": "вишня, сахарная пудра",
    "weights": [
      {
        "weight": "700 г",
        "price": 990
      },
      {
        "weight": "1000 г",
        "price": 1250
      }
    ],
    "emoji": "🍰",
    "isLean": true
  },
  {
    "id": "sladkiy-pirog-s-yablokom",
    "category": "Сладкие пироги",
    "categorySlug": "sweet",
    "title": "Сладкий пирог с яблоком",
    "composition": "яблоки, сахарная пудра",
    "weights": [
      {
        "weight": "700 г",
        "price": 820
      },
      {
        "weight": "1000 г",
        "price": 1050
      }
    ],
    "emoji": "🍰",
    "isLean": true
  },
  {
    "id": "sladkiy-pirog-s-malinoy",
    "category": "Сладкие пироги",
    "categorySlug": "sweet",
    "title": "Сладкий пирог с малиной",
    "composition": "малина, сахарная пудра",
    "weights": [
      {
        "weight": "700 г",
        "price": 1050
      },
      {
        "weight": "1000 г",
        "price": 1290
      }
    ],
    "emoji": "🍰",
    "isLean": true
  },
  {
    "id": "sladkiy-pirog-s-ezhevikoy-i-malinoy",
    "category": "Сладкие пироги",
    "categorySlug": "sweet",
    "title": "Сладкий пирог с ежевикой и малиной",
    "composition": "ежевика, малина, сахарная пудра",
    "weights": [
      {
        "weight": "700 г",
        "price": 1020
      },
      {
        "weight": "1000 г",
        "price": 1290
      }
    ],
    "emoji": "🍰",
    "isLean": true
  },
  {
    "id": "sladkiy-pirog-s-yablokom-i-ezhevikoy",
    "category": "Сладкие пироги",
    "categorySlug": "sweet",
    "title": "Сладкий пирог с яблоком и ежевикой",
    "composition": "яблоко, ежевика, сахарная пудра",
    "weights": [
      {
        "weight": "700 г",
        "price": 990
      },
      {
        "weight": "1000 г",
        "price": 1190
      }
    ],
    "emoji": "🍰",
    "isLean": true
  },
  {
    "id": "sladkiy-pirog-s-yablokom-i-malinoy",
    "category": "Сладкие пироги",
    "categorySlug": "sweet",
    "title": "Сладкий пирог с яблоком и малиной",
    "composition": "яблоко, малина, сахарная пудра",
    "weights": [
      {
        "weight": "700 г",
        "price": 990
      },
      {
        "weight": "1000 г",
        "price": 1190
      }
    ],
    "emoji": "🍰",
    "isLean": true
  },
  {
    "id": "sladkiy-pirog-s-yablokom-i-vishney",
    "category": "Сладкие пироги",
    "categorySlug": "sweet",
    "title": "Сладкий пирог с яблоком и вишней",
    "composition": "яблоко, вишня, сахарная пудра",
    "weights": [
      {
        "weight": "700 г",
        "price": 950
      },
      {
        "weight": "1000 г",
        "price": 1190
      }
    ],
    "emoji": "🍰",
    "isLean": true
  },
  {
    "id": "sladkiy-pirog-s-klubnikoy",
    "category": "Сладкие пироги",
    "categorySlug": "sweet",
    "title": "Сладкий пирог с клубникой",
    "composition": "клубника, сахарная пудра",
    "weights": [
      {
        "weight": "700 г",
        "price": 930
      },
      {
        "weight": "1000 г",
        "price": 1190
      }
    ],
    "emoji": "🍰",
    "isLean": true
  },
  {
    "id": "sladkiy-pirog-s-ezhevikoy",
    "category": "Сладкие пироги",
    "categorySlug": "sweet",
    "title": "Сладкий пирог с ежевикой",
    "composition": "ежевика, сахарная пудра",
    "weights": [
      {
        "weight": "700 г",
        "price": 990
      },
      {
        "weight": "1000 г",
        "price": 1290
      }
    ],
    "emoji": "🍰",
    "isLean": true
  },
  {
    "id": "sladkiy-pirog-s-chernoy-smorodinoy",
    "category": "Сладкие пироги",
    "categorySlug": "sweet",
    "title": "Сладкий пирог с черной смородиной",
    "composition": "черника, сахарная пудра",
    "weights": [
      {
        "weight": "700 г",
        "price": 990
      },
      {
        "weight": "1000 г",
        "price": 1290
      }
    ],
    "emoji": "🍰",
    "isLean": true
  },
  {
    "id": "set-nash-pir-10kg-na-kompaniyu-iz-20-22-cheloveka",
    "category": "Сеты",
    "categorySlug": "set",
    "title": "Сет “НАШ ПИР” 10кг ( на компанию из 20-22 человека)",
    "composition": "Сет из осетинских пирогов: Пирог с мясом “Фыдджын” 1кг Пирог с сыром \"Уалибах\" 1кг Пирог с мясом и картофелем 1кг Пирог с мясом, помидором и болгарским перцем 1кг Пирог с курицей и сыром 1кг Пирог с курицей грибами и сыром 1кг Пирог с семгой 1кг Пирог с сыром и зеленью 1кг Пирог картофелем и сыром 1кг Пирог с вишней 1кг",
    "weights": [],
    "emoji": "🎁",
    "isLean": false
  },
  {
    "id": "set-assorti-7kg-na-kompaniyu-iz-14-16chelovek",
    "category": "Сеты",
    "categorySlug": "set",
    "title": "Сет “Ассорти” 7кг.( на компанию из 14-16человек)",
    "composition": "Сет осетинских пирогов: Пирог с мясом \"Фыдджын\" 1кг Осетинский пирог картофелем и сыром \"Картофджын\"1кг Пирог с курицей и сыром 1кг Пирог с семгой 1кг Пирог с мясом и болгарским перцем 1кг Пирог с сыром и шпинатом 1кг Пирог с клубникой 1кг",
    "weights": [],
    "emoji": "🎁",
    "isLean": false
  },
  {
    "id": "set-vygodnyy-1-8kg-na-kompaniyu-iz-3-5chelovek",
    "category": "Сеты",
    "categorySlug": "set",
    "title": "Сет “Выгодный” 1.8кг ( на компанию из 3-5человек)",
    "composition": "Сет из небольших осетинских пирогов Пирог с мясом \"Фыдджын\" 600г Пирог с курицей и сыром 600г Пирог с картофелем и сыром \"Картофджын\" 600г",
    "weights": [],
    "emoji": "🎁",
    "isLean": false
  },
  {
    "id": "set-troyka-3kg-na-kompaniyu-iz-6-8chelovek",
    "category": "Сеты",
    "categorySlug": "set",
    "title": "Сет “Тройка” 3кг (на компанию из 6-8человек)",
    "composition": "Сет из осетинских пирогов: Пирог с мясом 1кг Пирог с сыром 1кг Пирог с сыром и свекольными листьями 1кг",
    "weights": [],
    "emoji": "🎁",
    "isLean": false
  },
  {
    "id": "set-ofisnyy-5kg-na-kompaniyu-iz-10-12chelovek",
    "category": "Сеты",
    "categorySlug": "set",
    "title": "Сет “Офисный” 5кг (на компанию из 10-12человек)",
    "composition": "Сет осетинских пирогов: Пирог с мясом 1кг Пирог с курицей и сыром 1кг Пирог с сыром 1кг Пирог с сыром и шпинатом 1кг Пирог с картофелем и сыром 1кг",
    "weights": [],
    "emoji": "🎁",
    "isLean": false
  },
  {
    "id": "osetinskiy-sous-nartov",
    "category": "Соусы",
    "categorySlug": "sauce",
    "title": "Осетинский соус Нартов",
    "composition": "",
    "weights": [],
    "emoji": "🥣",
    "isLean": true
  },
  {
    "id": "sous-smetana",
    "category": "Соусы",
    "categorySlug": "sauce",
    "title": "Соус Сметана",
    "composition": "",
    "weights": [],
    "emoji": "🥣",
    "isLean": true
  },
  {
    "id": "sous-ketchup",
    "category": "Соусы",
    "categorySlug": "sauce",
    "title": "Соус Кетчуп",
    "composition": "",
    "weights": [],
    "emoji": "🥣",
    "isLean": true
  },
  {
    "id": "sous-chesnochnyy",
    "category": "Соусы",
    "categorySlug": "sauce",
    "title": "Соус Чесночный",
    "composition": "",
    "weights": [],
    "emoji": "🥣",
    "isLean": true
  },
  {
    "id": "osetinskiy-sous-tsahton",
    "category": "Соусы",
    "categorySlug": "sauce",
    "title": "Осетинский соус Цахтон",
    "composition": "",
    "weights": [],
    "emoji": "🥣",
    "isLean": true
  },
  {
    "id": "sous-tkemali",
    "category": "Соусы",
    "categorySlug": "sauce",
    "title": "Соус Ткемали",
    "composition": "",
    "weights": [],
    "emoji": "🥣",
    "isLean": true
  },
  {
    "id": "sous-syrnyy",
    "category": "Соусы",
    "categorySlug": "sauce",
    "title": "Соус Сырный",
    "composition": "",
    "weights": [],
    "emoji": "🥣",
    "isLean": true
  },
  {
    "id": "fruktovo-yagodnyy-kompot-0-5l",
    "category": "Напитки",
    "categorySlug": "drink",
    "title": "Фруктово-ягодный компот(0.5л)",
    "composition": "Малина, вишня, яблоко",
    "weights": [],
    "emoji": "🥤",
    "isLean": true
  },
  {
    "id": "kompot-yagodnyy-1l",
    "category": "Напитки",
    "categorySlug": "drink",
    "title": "Компот Ягодный(1л)",
    "composition": "Клубника, малина,вишня, смородина, яблоко",
    "weights": [],
    "emoji": "🥤",
    "isLean": true
  },
  {
    "id": "rich-yabloko",
    "category": "Напитки",
    "categorySlug": "drink",
    "title": "Rich яблоко",
    "composition": "",
    "weights": [],
    "emoji": "🥤",
    "isLean": true
  },
  {
    "id": "rich-vishnya",
    "category": "Напитки",
    "categorySlug": "drink",
    "title": "Rich вишня",
    "composition": "",
    "weights": [],
    "emoji": "🥤",
    "isLean": true
  },
  {
    "id": "rich-apelsin",
    "category": "Напитки",
    "categorySlug": "drink",
    "title": "Rich апельсин",
    "composition": "",
    "weights": [],
    "emoji": "🥤",
    "isLean": true
  }
];

export function productById(id: string): Product | undefined {
  return MENU.find((p) => p.id === id);
}

export function productsByCategory(slug: CategorySlug): Product[] {
  if (slug === 'all') return MENU;
  return MENU.filter((p) => p.categorySlug === slug);
}

export function minPrice(p: Product): number {
  return Math.min(...p.weights.map((w) => w.price));
}
