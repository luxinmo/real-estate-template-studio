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
  { id: "p1", parentId: "c1", level: "province", name: "Barcelona", safeName: "barcelona", names: { en: "Barcelona", es: "Barcelona", fr: "Barcelone" }, slugs: { en: "barcelona", es: "barcelona", fr: "barcelone" }, active: true, order: 1, geojson: makeRect(41.2, 1.8, 41.6, 2.3), childrenCount: 3 },
  { id: "p2", parentId: "c1", level: "province", name: "Madrid", safeName: "madrid", names: { en: "Madrid", es: "Madrid" }, slugs: { en: "madrid", es: "madrid" }, active: true, order: 2, geojson: makeRect(40.2, -3.9, 40.6, -3.5), childrenCount: 2 },
  { id: "p3", parentId: "c1", level: "province", name: "Málaga", safeName: "malaga", names: { en: "Malaga", es: "Málaga", fr: "Malaga" }, slugs: { en: "malaga", es: "malaga", fr: "malaga" }, active: true, order: 3, geojson: makeRect(36.5, -4.8, 36.9, -4.2), childrenCount: 2 },

  // Barcelona towns
  { id: "t1", parentId: "p1", level: "town", name: "Sitges", safeName: "sitges", names: { en: "Sitges", es: "Sitges" }, slugs: { en: "sitges", es: "sitges" }, active: true, order: 1, geojson: makeRect(41.22, 1.78, 41.26, 1.84), childrenCount: 2 },
  { id: "t2", parentId: "p1", level: "town", name: "Castelldefels", safeName: "castelldefels", names: { en: "Castelldefels", es: "Castelldefels" }, slugs: { en: "castelldefels", es: "castelldefels" }, active: true, order: 2, geojson: makeRect(41.26, 1.94, 41.30, 2.0), childrenCount: 1 },
  { id: "t3", parentId: "p1", level: "town", name: "Gavà", safeName: "gava", names: { en: "Gavà", es: "Gavá" }, slugs: { en: "gava", es: "gava" }, active: true, order: 3, geojson: makeRect(41.28, 2.0, 41.32, 2.06), childrenCount: 0 },

  // Madrid towns
  { id: "t4", parentId: "p2", level: "town", name: "Madrid Centro", safeName: "madrid-centro", names: { en: "Madrid Downtown", es: "Madrid Centro" }, slugs: { en: "madrid-downtown", es: "madrid-centro" }, active: true, order: 1, geojson: makeRect(40.40, -3.72, 40.44, -3.68), childrenCount: 1 },
  { id: "t5", parentId: "p2", level: "town", name: "Pozuelo", safeName: "pozuelo", names: { en: "Pozuelo", es: "Pozuelo de Alarcón" }, slugs: { en: "pozuelo", es: "pozuelo-de-alarcon" }, active: true, order: 2, geojson: makeRect(40.42, -3.82, 40.46, -3.78), childrenCount: 0 },

  // Málaga towns
  { id: "t6", parentId: "p3", level: "town", name: "Marbella", safeName: "marbella", names: { en: "Marbella", es: "Marbella" }, slugs: { en: "marbella", es: "marbella" }, active: true, order: 1, geojson: makeRect(36.48, -4.98, 36.53, -4.88), childrenCount: 2 },
  { id: "t7", parentId: "p3", level: "town", name: "Estepona", safeName: "estepona", names: { en: "Estepona", es: "Estepona" }, slugs: { en: "estepona", es: "estepona" }, active: true, order: 2, geojson: makeRect(36.40, -5.15, 36.45, -5.05), childrenCount: 1 },

  // Sitges zones
  { id: "z1", parentId: "t1", level: "zone", name: "Sitges Centre", safeName: "sitges-centre", names: { en: "Sitges Centre", es: "Centro de Sitges" }, slugs: { en: "sitges-centre", es: "centro-de-sitges" }, active: true, order: 1, geojson: makeRect(41.23, 1.80, 41.245, 1.82), childrenCount: 0 },
  { id: "z2", parentId: "t1", level: "zone", name: "Garraf", safeName: "garraf", names: { en: "Garraf", es: "Garraf" }, slugs: { en: "garraf", es: "garraf" }, active: true, order: 2, geojson: makeRect(41.245, 1.82, 41.26, 1.84), childrenCount: 0 },

  // Castelldefels zones
  { id: "z3", parentId: "t2", level: "zone", name: "Playa", safeName: "playa", names: { en: "Beach", es: "Playa" }, slugs: { en: "beach", es: "playa" }, active: true, order: 1, geojson: makeRect(41.26, 1.96, 41.28, 1.98), childrenCount: 0 },

  // Madrid Centro zones
  { id: "z4", parentId: "t4", level: "zone", name: "Salamanca", safeName: "salamanca", names: { en: "Salamanca", es: "Salamanca" }, slugs: { en: "salamanca", es: "salamanca" }, active: true, order: 1, geojson: makeRect(40.42, -3.70, 40.44, -3.68), childrenCount: 0 },

  // Marbella zones
  { id: "z5", parentId: "t6", level: "zone", name: "Golden Mile", safeName: "golden-mile", names: { en: "Golden Mile", es: "Milla de Oro" }, slugs: { en: "golden-mile", es: "milla-de-oro" }, active: true, order: 1, geojson: makeRect(36.50, -4.95, 36.52, -4.90), childrenCount: 0 },
  { id: "z6", parentId: "t6", level: "zone", name: "Puerto Banús", safeName: "puerto-banus", names: { en: "Puerto Banús", es: "Puerto Banús" }, slugs: { en: "puerto-banus", es: "puerto-banus" }, active: true, order: 2, geojson: makeRect(36.48, -4.96, 36.50, -4.92), childrenCount: 0 },

  // Estepona zones
  { id: "z7", parentId: "t7", level: "zone", name: "Estepona Centro", safeName: "estepona-centro", names: { en: "Estepona Centre", es: "Estepona Centro" }, slugs: { en: "estepona-centre", es: "estepona-centro" }, active: true, order: 1, geojson: makeRect(36.42, -5.12, 36.44, -5.08), childrenCount: 0 },
];
