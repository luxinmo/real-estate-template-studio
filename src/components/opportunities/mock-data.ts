export type PipelineStage = "lead" | "opportunity" | "first_contact" | "send_info" | "visit" | "valuing" | "negotiation" | "won" | "lost";

export interface SearchCriteria {
  priceMin?: number;
  priceMax?: number;
  propertyType?: string[];
  bedrooms?: number;
  bathrooms?: number;
  dealType?: "rent" | "sale";
  locations?: string[];
  features?: string[];
  minArea?: number;
  maxArea?: number;
}

export interface Lead {
  id: string;
  ref: string;
  type: "rent" | "sale";
  contactName: string;
  email: string;
  phone: string;
  origin: string;
  agent: string;
  stage: PipelineStage;
  createdAt: string;
  editedAgo: string;
  tags: string[];
  isNew?: boolean;
  isHot?: boolean;
  property?: {
    id: string;
    title: string;
    location: string;
    price: string;
    bedrooms: number;
    type: string;
    ref: string;
    image: string;
    status: "available" | "reserved" | "sold";
  };
  notes: NoteEntry[];
  matchedProperties: MatchedProperty[];
  visits: Visit[];
  tasks: Task[];
  stageHistory: StageHistoryEntry[];
  preference?: string;
  searchCriteria?: SearchCriteria;
  timeline: TimelineEvent[];
  aiSuggestions: AISuggestion[];
}

export interface MatchedProperty {
  id: string;
  title: string;
  location: string;
  price: string;
  ref: string;
  image: string;
  status: "confirmed" | "pending" | "discarded" | "visited" | "sent";
}

export interface Visit {
  id: string;
  date: string;
  propertyRef: string;
  propertyTitle: string;
  status: "scheduled" | "completed" | "cancelled";
}

export interface Task {
  id: string;
  title: string;
  dueDate?: string;
  done: boolean;
}

export interface NoteEntry {
  id: string;
  text: string;
  author: string;
  date: string;
  isSystem?: boolean;
  systemType?: string;
}

export interface StageHistoryEntry {
  stage: PipelineStage;
  date: string;
  completed: boolean;
}

export type TimelineEventType = "note" | "stage_change" | "property_sent" | "property_viewed" | "visit_scheduled" | "visit_completed" | "page_view" | "email_opened" | "call" | "task_completed" | "ai_suggestion";

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  date: string;
  title: string;
  description?: string;
  author?: string;
  meta?: Record<string, string>;
}

export interface AISuggestion {
  id: string;
  type: "property" | "action" | "insight";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  actionLabel?: string;
  propertyRef?: string;
  dismissed?: boolean;
}

export const pipelineStages: { key: PipelineStage; label: string }[] = [
  { key: "lead", label: "Lead" },
  { key: "opportunity", label: "Oportunidad" },
  { key: "first_contact", label: "1er Contacto" },
  { key: "send_info", label: "Info Enviada" },
  { key: "visit", label: "Visita" },
  { key: "valuing", label: "Valoración" },
  { key: "negotiation", label: "Negociación" },
];

export const stageCounts: Record<string, number> = {
  lead: 37,
  opportunity: 0,
  first_contact: 116,
  send_info: 105,
  visit: 104,
  valuing: 37,
  negotiation: 13,
};

export const mockLeads: Lead[] = [
  {
    id: "1",
    ref: "L_38814",
    type: "rent",
    contactName: "Charlotte Pierce",
    email: "charpierce40@gmail.com",
    phone: "+447985247086",
    origin: "Web",
    agent: "Angelina Bukovetska",
    stage: "lead",
    createdAt: "05.03.2026 18:26",
    editedAgo: "14 min",
    tags: [],
    isNew: true,
    property: {
      id: "p1", title: "Villa, 3 Bedrooms", location: "Poble Nou de Benitatxell (el)",
      price: "2 200 €", bedrooms: 3, type: "Villa", ref: "7976A", image: "/placeholder.svg", status: "available",
    },
    notes: [
      { id: "n1", text: "Cliente interesado en zona costera, presupuesto flexible.", author: "Angelina Bukovetska", date: "05.03.2026 18:30" },
    ],
    matchedProperties: [
      { id: "mp1", title: "Villa, 3 Bedrooms", location: "Poble Nou de Benitatxell", price: "2 200 €", ref: "7976A", image: "/placeholder.svg", status: "confirmed" },
      { id: "mp2", title: "Villa, 4 Bedrooms", location: "Moraira", price: "2 800 €", ref: "8012B", image: "/placeholder.svg", status: "pending" },
    ],
    visits: [],
    tasks: [{ id: "t1", title: "Llamar para confirmar horario de visita", done: false }],
    stageHistory: [{ stage: "lead", date: "05.03.2026 18:26", completed: true }],
    preference: "Price: from 1500€ to 3000€ · Property Type: Villa · Business deal: To rent · Status: Available · in Benitatxell, Moraira",
    searchCriteria: { priceMin: 1500, priceMax: 3000, propertyType: ["Villa"], dealType: "rent", locations: ["Benitatxell", "Moraira"], bedrooms: 3 },
    timeline: [
      { id: "tl1", type: "stage_change", date: "05.03.2026 18:26", title: "Nuevo lead creado", description: "Origen: Web" },
      { id: "tl2", type: "page_view", date: "05.03.2026 18:28", title: "Visitó la página de Villa 7976A", description: "Tiempo en página: 3m 42s", meta: { url: "/property/7976A", duration: "3:42" } },
      { id: "tl3", type: "note", date: "05.03.2026 18:30", title: "Nota añadida", description: "Cliente interesado en zona costera, presupuesto flexible.", author: "Angelina Bukovetska" },
    ],
    aiSuggestions: [
      { id: "ai1", type: "property", title: "Villa en Moraira con piscina", description: "97% match con criterios. 3 hab, 2.400€/mes, zona costera como busca.", priority: "high", actionLabel: "Enviar", propertyRef: "8012B" },
      { id: "ai2", type: "action", title: "Programar llamada inicial", description: "Lead sin contacto en 14 min. Contactar para cualificar interés.", priority: "high", actionLabel: "Agendar" },
    ],
  },
  {
    id: "2",
    ref: "L_38784",
    type: "rent",
    contactName: "Müller Michael",
    email: "micha276@aol.com",
    phone: "+4917855996666",
    origin: "Thinkspain",
    agent: "Angelina Bukovetska",
    stage: "first_contact",
    createdAt: "04.03.2026 21:48",
    editedAgo: "18 min",
    tags: ["BUYER"],
    property: {
      id: "p2", title: "Villa, 4 Bedrooms", location: "Poble Nou de Benitatxell (el)",
      price: "2 800 €", bedrooms: 4, type: "Villa", ref: "6819A", image: "/placeholder.svg", status: "available",
    },
    notes: [
      { id: "n2", text: "Habla alemán e inglés. Prefiere comunicación por email.", author: "Angelina Bukovetska", date: "04.03.2026 22:00" },
    ],
    matchedProperties: [
      { id: "mp3", title: "Villa, 4 Bedrooms", location: "Benitatxell", price: "2 800 €", ref: "6819A", image: "/placeholder.svg", status: "sent" },
    ],
    visits: [],
    tasks: [],
    stageHistory: [
      { stage: "lead", date: "04.03.2026 21:48", completed: true },
      { stage: "first_contact", date: "05.03.2026 10:00", completed: true },
    ],
    timeline: [
      { id: "tl4", type: "stage_change", date: "04.03.2026 21:48", title: "Nuevo lead creado", description: "Origen: Thinkspain" },
      { id: "tl5", type: "page_view", date: "04.03.2026 22:15", title: "Visitó listado de villas en Benitatxell", meta: { url: "/search?type=villa&loc=benitatxell", duration: "5:12" } },
      { id: "tl6", type: "page_view", date: "04.03.2026 22:22", title: "Visitó Villa 6819A", meta: { url: "/property/6819A", duration: "4:30" } },
      { id: "tl7", type: "stage_change", date: "05.03.2026 10:00", title: "Pasó a 1er Contacto", author: "Angelina Bukovetska" },
      { id: "tl8", type: "property_sent", date: "05.03.2026 10:15", title: "Propiedad enviada: Villa 6819A", description: "Enviada por email al cliente" },
      { id: "tl9", type: "email_opened", date: "05.03.2026 10:42", title: "Email abierto", description: "El cliente abrió el email con la propiedad 6819A" },
    ],
    aiSuggestions: [
      { id: "ai3", type: "property", title: "Villa 3 hab en Cumbre del Sol", description: "92% match. Precio inferior, misma zona. Podría interesar como alternativa.", priority: "medium", actionLabel: "Enviar", propertyRef: "8101C" },
      { id: "ai4", type: "insight", title: "Cliente activo en web", description: "Ha visitado 4 propiedades en las últimas 24h. Alto nivel de interés.", priority: "high" },
    ],
  },
  {
    id: "3",
    ref: "L_38810",
    type: "rent",
    contactName: "Enkel",
    email: "enkel2010@hotmail.it",
    phone: "+34602434217",
    origin: "Idealista",
    agent: "Angelina Bukovetska",
    stage: "send_info",
    createdAt: "05.03.2026 17:03",
    editedAgo: "21 min",
    tags: [],
    property: {
      id: "p3", title: "Apartment, 3 Bedrooms", location: "Cap Negret, Altea",
      price: "1 600 €", bedrooms: 3, type: "Apartment", ref: "7854A", image: "/placeholder.svg", status: "available",
    },
    notes: [],
    matchedProperties: [],
    visits: [],
    tasks: [],
    stageHistory: [
      { stage: "lead", date: "05.03.2026 17:03", completed: true },
      { stage: "first_contact", date: "05.03.2026 17:30", completed: true },
      { stage: "send_info", date: "05.03.2026 18:00", completed: true },
    ],
    timeline: [
      { id: "tl10", type: "stage_change", date: "05.03.2026 17:03", title: "Nuevo lead creado", description: "Origen: Idealista" },
      { id: "tl11", type: "stage_change", date: "05.03.2026 17:30", title: "Pasó a 1er Contacto" },
      { id: "tl12", type: "stage_change", date: "05.03.2026 18:00", title: "Pasó a Info Enviada" },
    ],
    aiSuggestions: [
      { id: "ai5", type: "action", title: "Enviar propiedades sugeridas", description: "El cliente no tiene propiedades vinculadas. Enviar selección basada en criterios.", priority: "high", actionLabel: "Ver sugerencias" },
    ],
  },
  {
    id: "4",
    ref: "L_38815",
    type: "rent",
    contactName: "Mustafa",
    email: "morucol@icloud.com",
    phone: "+34624715160",
    origin: "Idealista",
    agent: "Chris Wilkinson",
    stage: "lead",
    createdAt: "05.03.2026 18:29",
    editedAgo: "29 min",
    tags: [],
    property: {
      id: "p4", title: "Villa, 3 Bedrooms", location: "Sierra Cortina, Finestrat",
      price: "3 200 €", bedrooms: 3, type: "Villa", ref: "7091A", image: "/placeholder.svg", status: "available",
    },
    notes: [],
    matchedProperties: [],
    visits: [],
    tasks: [],
    stageHistory: [{ stage: "lead", date: "05.03.2026 18:29", completed: true }],
    timeline: [
      { id: "tl13", type: "stage_change", date: "05.03.2026 18:29", title: "Nuevo lead creado", description: "Origen: Idealista" },
      { id: "tl14", type: "page_view", date: "05.03.2026 18:31", title: "Visitó Villa 7091A", meta: { url: "/property/7091A", duration: "1:15" } },
    ],
    aiSuggestions: [
      { id: "ai6", type: "action", title: "Contactar rápido", description: "Lead de Idealista sin respuesta. Los leads de portal tienen un 40% más conversión si se contactan en <1h.", priority: "high", actionLabel: "Llamar" },
    ],
  },
  {
    id: "5",
    ref: "L_37495",
    type: "sale",
    contactName: "Soazig Seradin",
    email: "SoazigToComplete@gmail.com",
    phone: "+33642692271",
    origin: "Idealista",
    agent: "Vicente Folgado",
    stage: "valuing",
    createdAt: "06.02.2026 08:27",
    editedAgo: "1 hours",
    tags: [],
    isHot: true,
    property: {
      id: "p5", title: "Villa, 5 Bedrooms", location: "El Montgó, Dénia",
      price: "589 000 €", bedrooms: 5, type: "Villa", ref: "7441", image: "/placeholder.svg", status: "available",
    },
    notes: [
      { id: "n3", text: "Segunda visita realizada. Me han dicho que están entre la nuestra y la siguiente.", author: "Vicente Folgado", date: "05.03.2026 17:59" },
      { id: "n4", text: "Visita realizada. La 7403 no la hemos visitado porque el agente con el que estuvieron ayer les llevó.", author: "Vicente Folgado", date: "03.03.2026 12:21", isSystem: true, systemType: "Opportunity has been changed from Visit to Valuing" },
      { id: "n5", text: "Visitamos el martes dia 3. Posible 10h y 11h.", author: "Vicente Folgado", date: "25.02.2026 09:57", isSystem: true, systemType: "Opportunity has been changed from Opportunity to Visit" },
    ],
    matchedProperties: [
      { id: "mp4", title: "Villa, 5 Bedrooms", location: "Dénia, Alicante, Spain", price: "589 000 €", ref: "7441", image: "/placeholder.svg", status: "confirmed" },
      { id: "mp5", title: "Villa, 4 Bedrooms", location: "Dénia, Alicante, Spain", price: "640 000 €", ref: "7403", image: "/placeholder.svg", status: "pending" },
    ],
    visits: [
      { id: "v1", date: "03.03.2026 10:00", propertyRef: "7441", propertyTitle: "Villa, 5 Bedrooms - Dénia", status: "completed" },
      { id: "v2", date: "05.03.2026 11:00", propertyRef: "7441", propertyTitle: "Villa, 5 Bedrooms - Dénia (2ª visita)", status: "completed" },
    ],
    tasks: [
      { id: "t2", title: "Enviar comparativa de precios zona", done: true },
      { id: "t3", title: "Preparar oferta formal", done: false },
    ],
    stageHistory: [
      { stage: "lead", date: "06.02.2026 08:27", completed: true },
      { stage: "opportunity", date: "06.02.2026 09:00", completed: true },
      { stage: "first_contact", date: "10.02.2026 10:00", completed: true },
      { stage: "send_info", date: "15.02.2026 14:00", completed: true },
      { stage: "visit", date: "25.02.2026 09:57", completed: true },
      { stage: "valuing", date: "03.03.2026 12:21", completed: true },
    ],
    preference: "Price: from 480000€ to 700000€ · Property Type: Detached house · Business deal: For sale · Status: Available · in Alicante, Dénia",
    searchCriteria: { priceMin: 480000, priceMax: 700000, propertyType: ["Detached house", "Villa"], dealType: "sale", locations: ["Dénia", "Jávea"], bedrooms: 4, minArea: 200 },
    timeline: [
      { id: "tl15", type: "stage_change", date: "06.02.2026 08:27", title: "Nuevo lead creado", description: "Origen: Idealista" },
      { id: "tl16", type: "page_view", date: "06.02.2026 08:35", title: "Visitó búsqueda: Villas en Dénia", meta: { url: "/search?type=villa&loc=denia&sale", duration: "8:20" } },
      { id: "tl17", type: "page_view", date: "06.02.2026 09:12", title: "Visitó Villa 7441", description: "Primera vista de la propiedad principal", meta: { url: "/property/7441", duration: "6:45" } },
      { id: "tl18", type: "stage_change", date: "06.02.2026 09:00", title: "Pasó a Oportunidad", author: "Vicente Folgado" },
      { id: "tl19", type: "call", date: "10.02.2026 10:00", title: "Llamada realizada", description: "Llamada de 12 min. Cliente francesa, busca casa para retiro. Presupuesto confirmado.", author: "Vicente Folgado" },
      { id: "tl20", type: "stage_change", date: "10.02.2026 10:00", title: "Pasó a 1er Contacto" },
      { id: "tl21", type: "property_sent", date: "15.02.2026 14:00", title: "3 propiedades enviadas", description: "Villa 7441, Villa 7403, Villa 7520 — enviadas por email" },
      { id: "tl22", type: "email_opened", date: "15.02.2026 15:30", title: "Email abierto", description: "Cliente abrió email con propiedades" },
      { id: "tl23", type: "page_view", date: "15.02.2026 16:00", title: "Visitó Villa 7441 de nuevo", meta: { url: "/property/7441", duration: "12:30" } },
      { id: "tl24", type: "page_view", date: "15.02.2026 16:15", title: "Visitó Villa 7403", meta: { url: "/property/7403", duration: "4:10" } },
      { id: "tl25", type: "stage_change", date: "15.02.2026 14:00", title: "Pasó a Info Enviada" },
      { id: "tl26", type: "visit_scheduled", date: "25.02.2026 09:57", title: "Visita programada", description: "Villa 7441 — Martes 3 de marzo, 10:00h", author: "Vicente Folgado" },
      { id: "tl27", type: "stage_change", date: "25.02.2026 09:57", title: "Pasó a Visita" },
      { id: "tl28", type: "visit_completed", date: "03.03.2026 10:00", title: "Visita completada", description: "Villa 7441 — Cliente satisfecho, pedirá segunda visita" },
      { id: "tl29", type: "task_completed", date: "03.03.2026 11:00", title: "Tarea completada", description: "Enviar comparativa de precios zona" },
      { id: "tl30", type: "stage_change", date: "03.03.2026 12:21", title: "Pasó a Valoración" },
      { id: "tl31", type: "note", date: "03.03.2026 12:21", title: "Nota del agente", description: "Visita realizada. La 7403 no la hemos visitado porque el agente con el que estuvieron ayer les llevó.", author: "Vicente Folgado" },
      { id: "tl32", type: "page_view", date: "04.03.2026 20:00", title: "Visitó Villa 7441 (3ª vez)", meta: { url: "/property/7441", duration: "8:00" } },
      { id: "tl33", type: "page_view", date: "04.03.2026 20:10", title: "Visitó calculadora hipotecaria", meta: { url: "/property/7441#mortgage", duration: "3:50" } },
      { id: "tl34", type: "visit_completed", date: "05.03.2026 11:00", title: "2ª Visita completada", description: "Villa 7441 — Están entre esta y otra propiedad de la competencia" },
      { id: "tl35", type: "note", date: "05.03.2026 17:59", title: "Nota del agente", description: "Segunda visita realizada. Me han dicho que están entre la nuestra y la siguiente.", author: "Vicente Folgado" },
    ],
    aiSuggestions: [
      { id: "ai7", type: "action", title: "Preparar oferta competitiva", description: "El cliente ha visitado la calculadora hipotecaria 2 veces y compara con competencia. Momento clave para presentar oferta.", priority: "high", actionLabel: "Crear oferta" },
      { id: "ai8", type: "property", title: "Villa alternativa en Jávea", description: "Villa 4 hab, 520.000€, zona similar. 89% match. Por si la negociación actual no avanza.", priority: "medium", actionLabel: "Enviar", propertyRef: "7520" },
      { id: "ai9", type: "insight", title: "Señal de compra fuerte", description: "3 visitas a la propiedad, uso de calculadora hipotecaria, 2 visitas presenciales. Probabilidad de cierre: 72%.", priority: "high" },
    ],
  },
  {
    id: "6",
    ref: "L_38550",
    type: "sale",
    contactName: "Javier Villa",
    email: "javier@hotmail.com",
    phone: "+34635395634",
    origin: "Idealista",
    agent: "Chris Wilkinson",
    stage: "visit",
    createdAt: "04.03.2026 16:00",
    editedAgo: "2 hours",
    tags: ["BUYER", "Seguimiento B.B."],
    isHot: true,
    property: {
      id: "p6", title: "Apartment, 2 Bedrooms", location: "Rincón de Loix, Benidorm",
      price: "329 000 €", bedrooms: 2, type: "Apartment", ref: "2892", image: "/placeholder.svg", status: "available",
    },
    notes: [
      { id: "n6", text: "Ha de estar todo legalizado porque quieren licencia turística. Conocen la situación.", author: "Chris Wilkinson", date: "04.03.2026 16:30" },
    ],
    matchedProperties: [
      { id: "mp6", title: "Apartment, 2 Bedrooms", location: "Benidorm", price: "329 000 €", ref: "2892", image: "/placeholder.svg", status: "visited" },
    ],
    visits: [
      { id: "v3", date: "05.03.2026 10:00", propertyRef: "2892", propertyTitle: "Apartment - Benidorm", status: "scheduled" },
    ],
    tasks: [],
    stageHistory: [
      { stage: "lead", date: "04.03.2026 16:00", completed: true },
      { stage: "opportunity", date: "04.03.2026 16:15", completed: true },
      { stage: "first_contact", date: "04.03.2026 17:00", completed: true },
      { stage: "send_info", date: "04.03.2026 18:00", completed: true },
      { stage: "visit", date: "05.03.2026 10:00", completed: true },
    ],
    timeline: [
      { id: "tl36", type: "stage_change", date: "04.03.2026 16:00", title: "Nuevo lead creado" },
      { id: "tl37", type: "call", date: "04.03.2026 17:00", title: "Llamada realizada", description: "8 min. Interesado en licencia turística.", author: "Chris Wilkinson" },
      { id: "tl38", type: "property_sent", date: "04.03.2026 18:00", title: "Propiedad enviada: Apt 2892" },
      { id: "tl39", type: "visit_scheduled", date: "05.03.2026 10:00", title: "Visita programada", description: "Apartment 2892 — 05.03 a las 10:00h" },
    ],
    aiSuggestions: [
      { id: "ai10", type: "insight", title: "Verificar legalización", description: "El cliente necesita licencia turística. Confirmar estado legal de la propiedad antes de la visita.", priority: "high" },
    ],
  },
  {
    id: "7",
    ref: "L_38200",
    type: "sale",
    contactName: "Nancy Griffiths",
    email: "nancygriff@gmail.com",
    phone: "+16024215965",
    origin: "Thinkspain",
    agent: "Angelina Bukovetska",
    stage: "opportunity",
    createdAt: "01.03.2026 14:00",
    editedAgo: "3 hours",
    tags: [],
    property: {
      id: "p7", title: "Villa, 3 Bedrooms", location: "Canuta Marvilla, Calpe/Calp",
      price: "2 500 €", bedrooms: 3, type: "Villa", ref: "4632A", image: "/placeholder.svg", status: "available",
    },
    notes: [],
    matchedProperties: [
      { id: "mp7", title: "Villa, 3 Bedrooms", location: "Calpe", price: "2 500 €", ref: "4632A", image: "/placeholder.svg", status: "confirmed" },
      { id: "mp8", title: "Villa, 3 Bedrooms", location: "Calpe", price: "2 500 €", ref: "4632A", image: "/placeholder.svg", status: "pending" },
    ],
    visits: [],
    tasks: [],
    stageHistory: [
      { stage: "lead", date: "01.03.2026 14:00", completed: true },
      { stage: "opportunity", date: "02.03.2026 10:00", completed: true },
    ],
    preference: "Price: from 200000€ to 350000€ · Property Type: Villa · Business deal: For sale · Status: Available · in Calpe",
    searchCriteria: { priceMin: 200000, priceMax: 350000, propertyType: ["Villa"], dealType: "sale", locations: ["Calpe"] },
    timeline: [
      { id: "tl40", type: "stage_change", date: "01.03.2026 14:00", title: "Nuevo lead creado" },
      { id: "tl41", type: "page_view", date: "01.03.2026 14:10", title: "Visitó búsqueda: Villas en Calpe", meta: { duration: "6:00" } },
      { id: "tl42", type: "stage_change", date: "02.03.2026 10:00", title: "Pasó a Oportunidad" },
    ],
    aiSuggestions: [
      { id: "ai11", type: "action", title: "Enviar selección de propiedades", description: "2 propiedades vinculadas pero ninguna enviada al cliente. Recomendable enviar para avanzar pipeline.", priority: "high", actionLabel: "Enviar selección" },
    ],
  },
  {
    id: "8",
    ref: "L_38100",
    type: "rent",
    contactName: "Elena Rodríguez",
    email: "elena.r@outlook.es",
    phone: "+34612345678",
    origin: "Web",
    agent: "Vicente Folgado",
    stage: "negotiation",
    createdAt: "28.02.2026 09:00",
    editedAgo: "5 hours",
    tags: ["VIP"],
    property: {
      id: "p8", title: "Penthouse, 2 Bedrooms", location: "Playa del Albir, Alfaz del Pi",
      price: "1 800 €", bedrooms: 2, type: "Penthouse", ref: "9123C", image: "/placeholder.svg", status: "available",
    },
    notes: [
      { id: "n7", text: "Negociación de precio. Cliente dispuesta a firmar si bajamos a 1.650€.", author: "Vicente Folgado", date: "05.03.2026 12:00" },
    ],
    matchedProperties: [
      { id: "mp9", title: "Penthouse, 2 Bedrooms", location: "Alfaz del Pi", price: "1 800 €", ref: "9123C", image: "/placeholder.svg", status: "confirmed" },
    ],
    visits: [
      { id: "v4", date: "02.03.2026 16:00", propertyRef: "9123C", propertyTitle: "Penthouse - Alfaz del Pi", status: "completed" },
    ],
    tasks: [
      { id: "t4", title: "Consultar con propietario rebaja", done: false },
      { id: "t5", title: "Preparar contrato borrador", done: false },
    ],
    stageHistory: [
      { stage: "lead", date: "28.02.2026 09:00", completed: true },
      { stage: "opportunity", date: "28.02.2026 10:00", completed: true },
      { stage: "first_contact", date: "28.02.2026 14:00", completed: true },
      { stage: "send_info", date: "01.03.2026 10:00", completed: true },
      { stage: "visit", date: "02.03.2026 16:00", completed: true },
      { stage: "valuing", date: "03.03.2026 10:00", completed: true },
      { stage: "negotiation", date: "04.03.2026 09:00", completed: true },
    ],
    timeline: [
      { id: "tl43", type: "stage_change", date: "28.02.2026 09:00", title: "Nuevo lead creado", description: "Origen: Web" },
      { id: "tl44", type: "page_view", date: "28.02.2026 09:10", title: "Visitó Penthouse 9123C", meta: { duration: "7:20" } },
      { id: "tl45", type: "call", date: "28.02.2026 14:00", title: "Llamada realizada", description: "15 min. VIP, busca alquiler premium.", author: "Vicente Folgado" },
      { id: "tl46", type: "property_sent", date: "01.03.2026 10:00", title: "Propiedad enviada: Penthouse 9123C" },
      { id: "tl47", type: "email_opened", date: "01.03.2026 10:30", title: "Email abierto" },
      { id: "tl48", type: "page_view", date: "01.03.2026 11:00", title: "Visitó Penthouse 9123C (2ª vez)", meta: { duration: "15:00" } },
      { id: "tl49", type: "visit_completed", date: "02.03.2026 16:00", title: "Visita completada", description: "Penthouse 9123C — Encantada con la propiedad" },
      { id: "tl50", type: "page_view", date: "03.03.2026 08:00", title: "Visitó Penthouse 9123C (3ª vez)", meta: { duration: "5:00" } },
      { id: "tl51", type: "stage_change", date: "04.03.2026 09:00", title: "Pasó a Negociación" },
      { id: "tl52", type: "note", date: "05.03.2026 12:00", title: "Nota del agente", description: "Negociación de precio. Cliente dispuesta a firmar si bajamos a 1.650€.", author: "Vicente Folgado" },
    ],
    aiSuggestions: [
      { id: "ai12", type: "action", title: "Cerrar negociación", description: "Cliente con 3 visitas web + visita presencial. Contraoferta de 1.650€. Hablar con propietario urgente.", priority: "high", actionLabel: "Contactar propietario" },
      { id: "ai13", type: "insight", title: "Alta probabilidad de cierre", description: "Comportamiento web indica decisión tomada. 85% probabilidad de cierre si se ajusta precio.", priority: "high" },
    ],
  },
];

export const agents = [
  "Angelina Bukovetska",
  "Vicente Folgado",
  "Chris Wilkinson",
  "Super Admin 2",
  "Julia Zaitseva",
  "Nicole Kushnir",
  "Arman Yeghiazaryan",
  "Natalia Olenikova",
  "Alexander Söderling",
];
