export const CITY_CENTER: [number, number] = [43.1975, 76.6189];

export type Substation = {
  id: string;
  name: string;
  type: "TP" | "PS";
  coords: [number, number];
  capacity: string;
  households: number;
  status: "ok" | "warn" | "off";
};

export const SUBSTATIONS: Substation[] = [
  { id: "PS-1", name: "ПС «Каскелен Главная»", type: "PS", coords: [43.1970, 76.6180], capacity: "110/10 кВ, 50 МВА", households: 12000, status: "ok" },
  { id: "PS-2", name: "ПС «Каскелен-2»", type: "PS", coords: [43.2010, 76.6260], capacity: "110/10 кВ, 40 МВА", households: 9500, status: "ok" },
  { id: "TP-1", name: "ТП-1 «Центральная»", type: "TP", coords: [43.1980, 76.6200], capacity: "630 кВА", households: 480, status: "ok" },
  { id: "TP-2", name: "ТП-2 «Северная»", type: "TP", coords: [43.2050, 76.6150], capacity: "400 кВА", households: 320, status: "ok" },
  { id: "TP-3", name: "ТП-3 «Южная»", type: "TP", coords: [43.1900, 76.6250], capacity: "630 кВА", households: 510, status: "ok" },
  { id: "TP-4", name: "ТП-4 «Нагорная»", type: "TP", coords: [43.1850, 76.6100], capacity: "250 кВА", households: 210, status: "ok" },
  { id: "TP-5", name: "ТП-5 «Речная»", type: "TP", coords: [43.1960, 76.6140], capacity: "400 кВА", households: 290, status: "ok" },
  { id: "TP-6", name: "ТП-6 «Западная»", type: "TP", coords: [43.1990, 76.6080], capacity: "400 кВА", households: 360, status: "ok" },
  { id: "TP-7", name: "ТП-7 «Восточная»", type: "TP", coords: [43.2000, 76.6320], capacity: "630 кВА", households: 420, status: "ok" },
  { id: "TP-8", name: "ТП-8 «Школьная»", type: "TP", coords: [43.2030, 76.6210], capacity: "250 кВА", households: 180, status: "ok" },
];

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

// Flood-affected entities scale with water level (0-5m)
export type FloodImpact = {
  residential: number;
  schools: number;
  medical: number;
  residents: number;
  floodWidthMeters: number; // overlay buffer width
};

export function floodImpact(level: number): FloodImpact {
  const t = Math.max(0, Math.min(5, level)) / 5;
  return {
    residential: Math.round(47 * t * (0.4 + 0.6 * t)),
    schools: level < 1.5 ? 0 : level < 3 ? 1 : level < 4 ? 2 : 3,
    medical: level < 2 ? 0 : level < 3.5 ? 1 : 2,
    residents: Math.round(4200 * t * (0.5 + 0.5 * t)),
    floodWidthMeters: 80 + 380 * t,
  };
}

export const SAFE_POINTS: { name: string; coords: [number, number] }[] = [
  { name: "Стадион Школы №3", coords: [43.2020, 76.6300] },
  { name: "ЦОН Каскелен", coords: [43.1990, 76.6400] },
  { name: "Спортивный комплекс", coords: [43.2060, 76.6200] },
];

// Evacuation routes (mock polylines from flood zones to safe points, avoiding the river)
export const EVAC_ROUTES: [number, number][][] = [
  [[43.1930, 76.6170], [43.1955, 76.6220], [43.1985, 76.6260], [43.2020, 76.6300]],
  [[43.1900, 76.6210], [43.1940, 76.6280], [43.1970, 76.6340], [43.1990, 76.6400]],
  [[43.2000, 76.6120], [43.2030, 76.6160], [43.2050, 76.6190], [43.2060, 76.6200]],
  [[43.1860, 76.6260], [43.1910, 76.6310], [43.1960, 76.6360], [43.1990, 76.6400]],
];

// Water pressure zones for heatmap (lat, lng, intensity 0-1 where higher = worse)
export const PRESSURE_ZONES_NORMAL: [number, number, number][] = [
  [43.1850, 76.6100, 0.9], // Hillside - critical
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
