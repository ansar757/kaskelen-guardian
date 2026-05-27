export const CITY_CENTER: [number, number] = [43.1975, 76.6189];

// River centerline (rough Kaskelenka river path through the city)
export const RIVER_PATH: [number, number][] = [
  [43.2150, 76.6020],
  [43.2080, 76.6090],
  [43.2010, 76.6130],
  [43.1965, 76.6160],
  [43.1925, 76.6195],
  [43.1880, 76.6230],
  [43.1830, 76.6285],
  [43.1780, 76.6340],
];

// Narrow band along the riverbed — visible at WARNING level (1.5–3.5 m)
export const FLOOD_ZONE_WARNING: [number, number][] = [
  [43.2158, 76.6005],
  [43.2088, 76.6075],
  [43.2018, 76.6115],
  [43.1972, 76.6147],
  [43.1932, 76.6182],
  [43.1887, 76.6218],
  [43.1837, 76.6273],
  [43.1787, 76.6328],
  [43.1773, 76.6352],
  [43.1823, 76.6297],
  [43.1873, 76.6242],
  [43.1918, 76.6208],
  [43.1958, 76.6173],
  [43.2002, 76.6145],
  [43.2072, 76.6105],
  [43.2142, 76.6035],
];

// Wider polygon covering adjacent streets — visible at DANGER level (3.5–5 m)
export const FLOOD_ZONE_DANGER: [number, number][] = [
  [43.2175, 76.5985],
  [43.2095, 76.6060],
  [43.2025, 76.6100],
  [43.1978, 76.6130],
  [43.1938, 76.6165],
  [43.1893, 76.6200],
  [43.1843, 76.6255],
  [43.1793, 76.6310],
  [43.1758, 76.6370],
  [43.1813, 76.6315],
  [43.1863, 76.6260],
  [43.1908, 76.6225],
  [43.1948, 76.6190],
  [43.1992, 76.6160],
  [43.2062, 76.6120],
  [43.2132, 76.6050],
];

// Flood-affected entities with tiered thresholds matching map zones
export type FloodImpact = {
  residential: number;
  schools: number;
  medical: number;
  residents: number;
  tier: "normal" | "warning" | "danger";
};

export function floodImpact(level: number): FloodImpact {
  if (level < 1.5) {
    return { residential: 0, schools: 0, medical: 0, residents: 0, tier: "normal" };
  }
  if (level < 3.5) {
    const t = (level - 1.5) / 2;
    return {
      residential: Math.round(5 + 15 * t),
      schools: 0,
      medical: 0,
      residents: Math.round(120 + 400 * t),
      tier: "warning",
    };
  }
  const t = Math.min(1, (level - 3.5) / 1.5);
  return {
    residential: Math.round(20 + 25 * t),
    schools: t < 0.5 ? 1 : 2,
    medical: 1,
    residents: Math.round(520 + 680 * t),
    tier: "danger",
  };
}

export const SAFE_POINTS: { name: string; coords: [number, number] }[] = [
  { name: "Стадион Школы №3", coords: [43.2020, 76.6300] },
  { name: "ЦОН Каскелен", coords: [43.1990, 76.6400] },
  { name: "Спортивный комплекс", coords: [43.2060, 76.6200] },
];

// Evacuation routes from flooded riverside to safe higher ground
export const EVAC_ROUTES: [number, number][][] = [
  [[43.1930, 76.6170], [43.1955, 76.6220], [43.1985, 76.6260], [43.2020, 76.6300]],
  [[43.1880, 76.6230], [43.1920, 76.6290], [43.1960, 76.6350], [43.1990, 76.6400]],
];

// Pressure zones for water module
export const PRESSURE_ZONES_NORMAL: [number, number, number][] = [
  [43.1850, 76.6100, 0.9],
  [43.1870, 76.6140, 0.8],
  [43.1900, 76.6080, 0.75],
  [43.1950, 76.6120, 0.5],
  [43.1980, 76.6190, 0.3],
  [43.2010, 76.6230, 0.2],
  [43.2050, 76.6280, 0.15],
  [43.1920, 76.6250, 0.35],
  [43.2000, 76.6320, 0.25],
  [43.1880, 76.6200, 0.6],
];

export const PRESSURE_ZONES_SUMMER: [number, number, number][] = PRESSURE_ZONES_NORMAL.map(
  ([la, ln, v]) => [la, ln, Math.min(1, v + 0.25)]
);

// Organizations / buildings shown on map with rich detail panel
export type Review = { author: string; rating: number; text: string };
export type Organization = {
  id: string;
  name: string;
  type: string;
  coords: [number, number];
  hours: string;
  instagram?: string;
  website?: string;
  salary: string;
  reviews: Review[];
};

export const ORGANIZATIONS: Organization[] = [
  {
    id: "org-1",
    name: "Торговый дом «Каскелен»",
    type: "Торговый центр",
    coords: [43.1988, 76.6215],
    hours: "Пн–Вс: 09:00 – 22:00",
    instagram: "https://instagram.com/td_kaskelen",
    website: "https://td-kaskelen.kz",
    salary: "180 000 ₸ – 250 000 ₸",
    reviews: [
      { author: "Айдана К.", rating: 5, text: "Большой выбор, удобная парковка. Часто захожу за продуктами." },
      { author: "Ержан М.", rating: 4, text: "Хороший центр, но по выходным много людей." },
    ],
  },
  {
    id: "org-2",
    name: "Школа №1 им. Абая",
    type: "Среднее образование",
    coords: [43.2008, 76.6178],
    hours: "Пн–Сб: 08:00 – 18:00",
    website: "https://school1-kaskelen.edu.kz",
    salary: "210 000 ₸ – 320 000 ₸",
    reviews: [
      { author: "Гульнара С.", rating: 5, text: "Сильный педагогический состав, ребёнок ходит с удовольствием." },
      { author: "Бауыржан Т.", rating: 4, text: "Хорошая школа, но требуется ремонт спортзала." },
    ],
  },
  {
    id: "org-3",
    name: "ЖК «Алатау Парк»",
    type: "Жилой комплекс",
    coords: [43.1955, 76.6240],
    hours: "Круглосуточно (КПП)",
    instagram: "https://instagram.com/alatau_park_kaskelen",
    salary: "—",
    reviews: [
      { author: "Динара А.", rating: 5, text: "Тихий двор, новая инфраструктура, хорошая управляющая компания." },
      { author: "Нурлан Б.", rating: 3, text: "Не хватает парковочных мест по вечерам." },
    ],
  },
  {
    id: "org-4",
    name: "Городская поликлиника №2",
    type: "Медицинское учреждение",
    coords: [43.1942, 76.6195],
    hours: "Пн–Пт: 08:00 – 20:00, Сб: 09:00 – 14:00",
    website: "https://poliklinika2.kz",
    salary: "230 000 ₸ – 380 000 ₸",
    reviews: [
      { author: "Сауле Ж.", rating: 4, text: "Запись через eGov, врачи внимательные." },
      { author: "Марат К.", rating: 3, text: "Очереди в регистратуре по утрам." },
    ],
  },
  {
    id: "org-5",
    name: "Кафе «Дастархан»",
    type: "Ресторан / Кафе",
    coords: [43.1995, 76.6258],
    hours: "Пн–Вс: 10:00 – 23:00",
    instagram: "https://instagram.com/dastarhan_kz",
    salary: "160 000 ₸ – 220 000 ₸",
    reviews: [
      { author: "Асель Н.", rating: 5, text: "Лучшие манты в городе, домашняя атмосфера." },
      { author: "Жанар И.", rating: 4, text: "Вкусно, но иногда долго ждать заказ." },
    ],
  },
  {
    id: "org-6",
    name: "Бизнес-центр «Каскелен Плаза»",
    type: "Офисный центр",
    coords: [43.2025, 76.6225],
    hours: "Пн–Пт: 09:00 – 19:00",
    website: "https://kaskelen-plaza.kz",
    salary: "250 000 ₸ – 450 000 ₸",
    reviews: [
      { author: "Тимур А.", rating: 4, text: "Современное здание, удобно для встреч с клиентами." },
      { author: "Алия Б.", rating: 5, text: "Хорошие офисы, быстрый интернет, охрана 24/7." },
    ],
  },
  {
    id: "org-7",
    name: "Детский сад «Балапан»",
    type: "Дошкольное учреждение",
    coords: [43.1970, 76.6135],
    hours: "Пн–Пт: 07:30 – 18:30",
    salary: "170 000 ₸ – 230 000 ₸",
    reviews: [
      { author: "Айгерим Т.", rating: 5, text: "Очень хорошие воспитатели, ребёнок просится сам." },
      { author: "Канат С.", rating: 4, text: "Свежее питание, чисто. Не хватает мест в группах." },
    ],
  },
  {
    id: "org-8",
    name: "Супермаркет «Magnum»",
    type: "Розничная торговля",
    coords: [43.1960, 76.6275],
    hours: "Пн–Вс: 08:00 – 23:00",
    website: "https://magnum.kz",
    salary: "165 000 ₸ – 240 000 ₸",
    reviews: [
      { author: "Куаныш Р.", rating: 4, text: "Стабильно хороший выбор и адекватные цены." },
      { author: "Мадина О.", rating: 5, text: "Свежие овощи и большой выбор молочной продукции." },
    ],
  },
];
