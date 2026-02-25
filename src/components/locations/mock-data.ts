import { LocationNode } from "./types";

// Simple rectangular polygons for preview
const makeRect = (lat1: number, lng1: number, lat2: number, lng2: number) =>
  JSON.stringify({
    type: "Polygon",
    coordinates: [[[lng1, lat1], [lng2, lat1], [lng2, lat2], [lng1, lat2], [lng1, lat1]]],
  });

export const mockLocations: LocationNode[] = [
  // Countries
  { id: "c1", parentId: null, level: "country", name: "España", safeName: "espana", names: { en: "Spain", es: "España", fr: "Espagne", de: "Spanien" }, slugs: { en: "spain", es: "espana", fr: "espagne", de: "spanien" }, active: true, order: 1, geojson: null, childrenCount: 3 },

  // Provinces
  { id: "p1", parentId: "c1", level: "province", name: "Barcelona", safeName: "barcelona", names: { en: "Barcelona", es: "Barcelona", fr: "Barcelone" }, slugs: { en: "barcelona", es: "barcelona", fr: "barcelone" }, active: true, order: 1, geojson: makeRect(41.2, 1.8, 41.6, 2.3), childrenCount: 2 },
  { id: "p2", parentId: "c1", level: "province", name: "Madrid", safeName: "madrid", names: { en: "Madrid", es: "Madrid" }, slugs: { en: "madrid", es: "madrid" }, active: true, order: 2, geojson: makeRect(40.2, -3.9, 40.6, -3.5), childrenCount: 1 },
  { id: "p3", parentId: "c1", level: "province", name: "Málaga", safeName: "malaga", names: { en: "Malaga", es: "Málaga", fr: "Malaga" }, slugs: { en: "malaga", es: "malaga", fr: "malaga" }, active: true, order: 3, geojson: makeRect(36.5, -4.8, 36.9, -4.2), childrenCount: 1 },

  // Regions (NEW level between Province and Municipality)
  { id: "r1", parentId: "p1", level: "region", name: "Garraf", safeName: "garraf", names: { en: "Garraf", es: "Garraf" }, slugs: { en: "garraf", es: "garraf" }, active: true, order: 1, geojson: makeRect(41.2, 1.78, 41.32, 1.9), childrenCount: 2 },
  { id: "r2", parentId: "p1", level: "region", name: "Baix Llobregat", safeName: "baix-llobregat", names: { en: "Baix Llobregat", es: "Bajo Llobregat" }, slugs: { en: "baix-llobregat", es: "bajo-llobregat" }, active: true, order: 2, geojson: makeRect(41.28, 1.92, 41.38, 2.1), childrenCount: 1 },
  { id: "r3", parentId: "p2", level: "region", name: "Área Metropolitana", safeName: "area-metropolitana", names: { en: "Metropolitan Area", es: "Área Metropolitana" }, slugs: { en: "metropolitan-area", es: "area-metropolitana" }, active: true, order: 1, geojson: makeRect(40.3, -3.85, 40.55, -3.55), childrenCount: 2 },
  { id: "r4", parentId: "p3", level: "region", name: "Costa del Sol Occidental", safeName: "costa-del-sol-occidental", names: { en: "Western Costa del Sol", es: "Costa del Sol Occidental" }, slugs: { en: "western-costa-del-sol", es: "costa-del-sol-occidental" }, active: true, order: 1, geojson: makeRect(36.4, -5.15, 36.55, -4.85), childrenCount: 2 },

  // Municipalities (was "town")
  { id: "m1", parentId: "r1", level: "municipality", name: "Sitges", safeName: "sitges", names: { en: "Sitges", es: "Sitges" }, slugs: { en: "sitges", es: "sitges" }, active: true, order: 1, geojson: makeRect(41.22, 1.78, 41.26, 1.84), childrenCount: 2 },
  { id: "m2", parentId: "r1", level: "municipality", name: "Vilanova i la Geltrú", safeName: "vilanova", names: { en: "Vilanova i la Geltrú", es: "Villanueva y Geltrú" }, slugs: { en: "vilanova", es: "villanueva-y-geltru" }, active: true, order: 2, geojson: makeRect(41.22, 1.7, 41.26, 1.76), childrenCount: 0 },
  { id: "m3", parentId: "r2", level: "municipality", name: "Castelldefels", safeName: "castelldefels", names: { en: "Castelldefels", es: "Castelldefels" }, slugs: { en: "castelldefels", es: "castelldefels" }, active: true, order: 1, geojson: makeRect(41.26, 1.94, 41.30, 2.0), childrenCount: 1 },
  { id: "m4", parentId: "r3", level: "municipality", name: "Madrid Centro", safeName: "madrid-centro", names: { en: "Madrid Downtown", es: "Madrid Centro" }, slugs: { en: "madrid-downtown", es: "madrid-centro" }, active: true, order: 1, geojson: makeRect(40.40, -3.72, 40.44, -3.68), childrenCount: 1 },
  { id: "m5", parentId: "r3", level: "municipality", name: "Pozuelo de Alarcón", safeName: "pozuelo", names: { en: "Pozuelo", es: "Pozuelo de Alarcón" }, slugs: { en: "pozuelo", es: "pozuelo-de-alarcon" }, active: true, order: 2, geojson: makeRect(40.42, -3.82, 40.46, -3.78), childrenCount: 0 },
  { id: "m6", parentId: "r4", level: "municipality", name: "Marbella", safeName: "marbella", names: { en: "Marbella", es: "Marbella" }, slugs: { en: "marbella", es: "marbella" }, active: true, order: 1, geojson: makeRect(36.48, -4.98, 36.53, -4.88), childrenCount: 2 },
  { id: "m7", parentId: "r4", level: "municipality", name: "Estepona", safeName: "estepona", names: { en: "Estepona", es: "Estepona" }, slugs: { en: "estepona", es: "estepona" }, active: true, order: 2, geojson: makeRect(36.40, -5.15, 36.45, -5.05), childrenCount: 1 },

  // Boroughs (was "zone")
  { id: "b1", parentId: "m1", level: "borough", name: "Sitges Centre", safeName: "sitges-centre", names: { en: "Sitges Centre", es: "Centro de Sitges" }, slugs: { en: "sitges-centre", es: "centro-de-sitges" }, active: true, order: 1, geojson: makeRect(41.23, 1.80, 41.245, 1.82), childrenCount: 0 },
  { id: "b2", parentId: "m1", level: "borough", name: "Garraf Beach", safeName: "garraf-beach", names: { en: "Garraf Beach", es: "Playa Garraf" }, slugs: { en: "garraf-beach", es: "playa-garraf" }, active: true, order: 2, geojson: makeRect(41.245, 1.82, 41.26, 1.84), childrenCount: 0 },
  { id: "b3", parentId: "m3", level: "borough", name: "Playa", safeName: "playa", names: { en: "Beach", es: "Playa" }, slugs: { en: "beach", es: "playa" }, active: true, order: 1, geojson: makeRect(41.26, 1.96, 41.28, 1.98), childrenCount: 0 },
  { id: "b4", parentId: "m4", level: "borough", name: "Salamanca", safeName: "salamanca", names: { en: "Salamanca", es: "Salamanca" }, slugs: { en: "salamanca", es: "salamanca" }, active: true, order: 1, geojson: makeRect(40.42, -3.70, 40.44, -3.68), childrenCount: 0 },
  { id: "b5", parentId: "m6", level: "borough", name: "Golden Mile", safeName: "golden-mile", names: { en: "Golden Mile", es: "Milla de Oro" }, slugs: { en: "golden-mile", es: "milla-de-oro" }, active: true, order: 1, geojson: makeRect(36.50, -4.95, 36.52, -4.90), childrenCount: 0 },
  { id: "b6", parentId: "m6", level: "borough", name: "Puerto Banús", safeName: "puerto-banus", names: { en: "Puerto Banús", es: "Puerto Banús" }, slugs: { en: "puerto-banus", es: "puerto-banus" }, active: true, order: 2, geojson: makeRect(36.48, -4.96, 36.50, -4.92), childrenCount: 0 },
  { id: "b7", parentId: "m7", level: "borough", name: "Estepona Centro", safeName: "estepona-centro", names: { en: "Estepona Centre", es: "Estepona Centro" }, slugs: { en: "estepona-centre", es: "estepona-centro" }, active: true, order: 1, geojson: makeRect(36.42, -5.12, 36.44, -5.08), childrenCount: 0 },
];
