import { ImportSource, ImportBatch, BatchRecord, FieldMapping, ValueMapping, PendingValue, SchedulerJob } from "./types";

export const mockSources: ImportSource[] = [
  { id: "1", name: "Kyero Feed Principal", feedUrl: "https://feeds.kyero.com/v4/properties.xml?token=abc123def456", format: "kyero", frequency: "6h", active: true, testMode: false, lastRun: new Date(Date.now() - 2 * 3600000).toISOString(), lastRunStatus: "ok", nextRun: new Date(Date.now() + 4 * 3600000).toISOString() },
  { id: "2", name: "Idealista Export", feedUrl: "https://api.idealista.com/feed/export.xml", format: "xml_generic", frequency: "12h", active: true, testMode: false, lastRun: new Date(Date.now() - 8 * 3600000).toISOString(), lastRunStatus: "error", nextRun: new Date(Date.now() + 4 * 3600000).toISOString() },
  { id: "3", name: "Portal Custom XML", feedUrl: "https://example.com/properties/feed.xml", format: "xml_custom", frequency: "24h", active: false, testMode: false, lastRun: new Date(Date.now() - 48 * 3600000).toISOString(), lastRunStatus: "ok" },
  { id: "4", name: "Resales Online", feedUrl: "https://resales-online.com/feed/v2.xml?key=xyz", format: "xml_generic", frequency: "1h", active: true, testMode: false, lastRun: new Date(Date.now() - 0.5 * 3600000).toISOString(), lastRunStatus: "ok", nextRun: new Date(Date.now() + 0.5 * 3600000).toISOString() },
];

export const mockBatches: ImportBatch[] = [
  { id: "b1", sourceId: "1", sourceName: "Kyero Feed Principal", startedAt: new Date(Date.now() - 2 * 3600000).toISOString(), duration: "2m 34s", status: "completed", newRecords: 12, updatedRecords: 45, unchangedRecords: 230, errors: 0 },
  { id: "b2", sourceId: "2", sourceName: "Idealista Export", startedAt: new Date(Date.now() - 8 * 3600000).toISOString(), duration: "5m 12s", status: "failed", newRecords: 3, updatedRecords: 18, unchangedRecords: 0, errors: 7 },
  { id: "b3", sourceId: "1", sourceName: "Kyero Feed Principal", startedAt: new Date(Date.now() - 26 * 3600000).toISOString(), duration: "2m 10s", status: "completed", newRecords: 5, updatedRecords: 52, unchangedRecords: 225, errors: 1 },
  { id: "b4", sourceId: "4", sourceName: "Resales Online", startedAt: new Date(Date.now() - 0.5 * 3600000).toISOString(), duration: "1m 02s", status: "completed", newRecords: 2, updatedRecords: 10, unchangedRecords: 180, errors: 0 },
  { id: "b5", sourceId: "1", sourceName: "Kyero Feed Principal", startedAt: new Date(Date.now() - 50 * 3600000).toISOString(), duration: "2m 05s", status: "completed", newRecords: 8, updatedRecords: 38, unchangedRecords: 240, errors: 0 },
];

export const mockBatchRecords: BatchRecord[] = [
  { id: "r1", externalRef: "KY-10234", action: "created", changes: "Nueva propiedad" },
  { id: "r2", externalRef: "KY-10235", action: "updated", changes: "Precio: 250000→265000, Fotos: +3" },
  { id: "r3", externalRef: "KY-10236", action: "unchanged" },
  { id: "r4", externalRef: "KY-10237", action: "error", error: "Campo 'precio' vacío — registro omitido" },
  { id: "r5", externalRef: "KY-10238", action: "updated", changes: "Descripción ES actualizada" },
  { id: "r6", externalRef: "KY-10239", action: "created", changes: "Nueva propiedad" },
  { id: "r7", externalRef: "KY-10240", action: "unchanged" },
];

export const mockFieldMappings: FieldMapping[] = [
  { xmlField: "id", xmlType: "text", sampleValue: "KY-10234", targetField: "reference" },
  { xmlField: "price", xmlType: "number", sampleValue: "265000", targetField: "price" },
  { xmlField: "type", xmlType: "text", sampleValue: "apartment", targetField: "property_type" },
  { xmlField: "town", xmlType: "text", sampleValue: "Marbella", targetField: "municipality" },
  { xmlField: "province", xmlType: "text", sampleValue: "Málaga", targetField: "province" },
  { xmlField: "beds", xmlType: "number", sampleValue: "3", targetField: "bedrooms" },
  { xmlField: "baths", xmlType: "number", sampleValue: "2", targetField: "bathrooms" },
  { xmlField: "surface_area.built", xmlType: "number", sampleValue: "120", targetField: "built_area" },
  { xmlField: "surface_area.plot", xmlType: "number", sampleValue: "500", targetField: "plot_area" },
  { xmlField: "desc.en", xmlType: "text", sampleValue: "Beautiful apartment...", targetField: "" },
  { xmlField: "desc.es", xmlType: "text", sampleValue: "Precioso apartamento...", targetField: "" },
  { xmlField: "images.image.url", xmlType: "text", sampleValue: "https://img.kyero.com/...", targetField: "images" },
  { xmlField: "url.en", xmlType: "text", sampleValue: "https://...", targetField: "" },
  { xmlField: "latitude", xmlType: "number", sampleValue: "36.5100", targetField: "latitude" },
  { xmlField: "longitude", xmlType: "number", sampleValue: "-4.8826", targetField: "longitude" },
];

export const mockValueMappings: ValueMapping[] = [
  { id: "v1", xmlValue: "apartment", omniValue: "Apartamento", fieldType: "Tipo" },
  { id: "v2", xmlValue: "villa", omniValue: "Villa", fieldType: "Tipo" },
  { id: "v3", xmlValue: "townhouse", omniValue: "Adosado", fieldType: "Tipo" },
  { id: "v4", xmlValue: "for_sale", omniValue: "Venta", fieldType: "Operación" },
  { id: "v5", xmlValue: "to_let", omniValue: "Alquiler", fieldType: "Operación" },
  { id: "v6", xmlValue: "good", omniValue: "Buen estado", fieldType: "Estado" },
  { id: "v7", xmlValue: "new_build", omniValue: "Obra nueva", fieldType: "Estado" },
];

export const mockPendingValues: PendingValue[] = [
  { id: "p1", sourceId: "1", sourceName: "Kyero Feed Principal", entityType: "tipo", xmlValue: "apartamento_duplex", detectedAt: new Date(Date.now() - 2 * 3600000).toISOString(), occurrences: 47, status: "pending" },
  { id: "p2", sourceId: "1", sourceName: "Kyero Feed Principal", entityType: "tipo", xmlValue: "country_house", detectedAt: new Date(Date.now() - 5 * 3600000).toISOString(), occurrences: 12, status: "pending" },
  { id: "p3", sourceId: "2", sourceName: "Idealista Export", entityType: "caracteristica", xmlValue: "aire_acondicionado_centralizado", detectedAt: new Date(Date.now() - 1 * 3600000).toISOString(), occurrences: 89, status: "pending" },
  { id: "p4", sourceId: "1", sourceName: "Kyero Feed Principal", entityType: "caracteristica", xmlValue: "swimming_pool_heated", detectedAt: new Date(Date.now() - 12 * 3600000).toISOString(), occurrences: 23, status: "pending" },
  { id: "p5", sourceId: "2", sourceName: "Idealista Export", entityType: "tipo", xmlValue: "local_comercial", detectedAt: new Date(Date.now() - 3 * 3600000).toISOString(), occurrences: 8, status: "pending" },
  { id: "p6", sourceId: "4", sourceName: "Resales Online", entityType: "caracteristica", xmlValue: "underfloor_heating", detectedAt: new Date(Date.now() - 24 * 3600000).toISOString(), occurrences: 34, status: "pending" },
  { id: "p7", sourceId: "1", sourceName: "Kyero Feed Principal", entityType: "tipo", xmlValue: "penthouse", detectedAt: new Date(Date.now() - 6 * 3600000).toISOString(), occurrences: 15, status: "pending" },
  { id: "p8", sourceId: "2", sourceName: "Idealista Export", entityType: "caracteristica", xmlValue: "terraza_cubierta", detectedAt: new Date(Date.now() - 4 * 3600000).toISOString(), occurrences: 56, status: "pending" },
  { id: "p9", sourceId: "1", sourceName: "Kyero Feed Principal", entityType: "tipo", xmlValue: "finca_rustica", detectedAt: new Date(Date.now() - 36 * 3600000).toISOString(), occurrences: 5, status: "ignored" },
  { id: "p10", sourceId: "4", sourceName: "Resales Online", entityType: "caracteristica", xmlValue: "jacuzzi_exterior", detectedAt: new Date(Date.now() - 48 * 3600000).toISOString(), occurrences: 11, status: "ignored" },
  { id: "p11", sourceId: "2", sourceName: "Idealista Export", entityType: "caracteristica", xmlValue: "domótica_integrada", detectedAt: new Date(Date.now() - 7 * 3600000).toISOString(), occurrences: 19, status: "pending" },
  { id: "p12", sourceId: "1", sourceName: "Kyero Feed Principal", entityType: "tipo", xmlValue: "studio_apartment", detectedAt: new Date(Date.now() - 10 * 3600000).toISOString(), occurrences: 31, status: "pending" },
  { id: "p13", sourceId: "4", sourceName: "Resales Online", entityType: "caracteristica", xmlValue: "electric_shutters", detectedAt: new Date(Date.now() - 15 * 3600000).toISOString(), occurrences: 42, status: "pending" },
  { id: "p14", sourceId: "2", sourceName: "Idealista Export", entityType: "caracteristica", xmlValue: "garaje_doble", detectedAt: new Date(Date.now() - 20 * 3600000).toISOString(), occurrences: 27, status: "pending" },
  { id: "p15", sourceId: "1", sourceName: "Kyero Feed Principal", entityType: "tipo", xmlValue: "building_plot", detectedAt: new Date(Date.now() - 30 * 3600000).toISOString(), occurrences: 9, status: "ignored" },
  { id: "p16", sourceId: "4", sourceName: "Resales Online", entityType: "caracteristica", xmlValue: "wine_cellar", detectedAt: new Date(Date.now() - 40 * 3600000).toISOString(), occurrences: 3, status: "ignored" },
  { id: "p17", sourceId: "2", sourceName: "Idealista Export", entityType: "caracteristica", xmlValue: "suelo_radiante", detectedAt: new Date(Date.now() - 2 * 3600000).toISOString(), occurrences: 18, status: "pending" },
  { id: "p18", sourceId: "1", sourceName: "Kyero Feed Principal", entityType: "tipo", xmlValue: "semi_detached", detectedAt: new Date(Date.now() - 9 * 3600000).toISOString(), occurrences: 22, status: "pending" },
  { id: "p19", sourceId: "4", sourceName: "Resales Online", entityType: "caracteristica", xmlValue: "garden_private", detectedAt: new Date(Date.now() - 14 * 3600000).toISOString(), occurrences: 65, status: "pending" },
  { id: "p20", sourceId: "2", sourceName: "Idealista Export", entityType: "caracteristica", xmlValue: "ascensor_privado", detectedAt: new Date(Date.now() - 6 * 3600000).toISOString(), occurrences: 7, status: "ignored" },
];

export const mockSchedulerJobs: SchedulerJob[] = [
  { id: "j1", sourceId: "1", sourceName: "Kyero Feed Principal", frequency: "Cada 6 horas", active: true, lastRun: new Date(Date.now() - 2 * 3600000).toISOString(), lastRunOk: true, nextRun: new Date(Date.now() + 4 * 3600000).toISOString(), running: false },
  { id: "j2", sourceId: "2", sourceName: "Idealista Export", frequency: "Cada 12 horas", active: true, lastRun: new Date(Date.now() - 8 * 3600000).toISOString(), lastRunOk: false, nextRun: new Date(Date.now() + 4 * 3600000).toISOString(), running: false },
  { id: "j3", sourceId: "3", sourceName: "Portal Custom XML", frequency: "Cada 24 horas", active: false, lastRun: new Date(Date.now() - 48 * 3600000).toISOString(), lastRunOk: true, running: false },
  { id: "j4", sourceId: "4", sourceName: "Resales Online", frequency: "Cada hora", active: true, lastRun: new Date(Date.now() - 0.5 * 3600000).toISOString(), lastRunOk: true, nextRun: new Date(Date.now() + 0.5 * 3600000).toISOString(), running: true, progress: 67 },
];

export const OMNI_FIELDS = {
  "Propiedad": ["Referencia", "Precio", "Tipo", "Subtipo", "Estado"],
  "Ubicación": ["País", "Provincia", "Municipio", "Barrio", "Dirección", "C.P.", "Latitud", "Longitud"],
  "Superficie": ["Área útil", "Área construida", "Parcela"],
  "Detalles": ["Habitaciones", "Baños", "Año construcción"],
  "Media": ["Imágenes", "YouTube", "Vimeo", "Tour virtual"],
};
