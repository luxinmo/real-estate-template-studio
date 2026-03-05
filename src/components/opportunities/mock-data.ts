export type PipelineStage = "lead" | "opportunity" | "first_contact" | "send_info" | "visit" | "valuing" | "negotiation" | "won" | "lost";

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
      id: "p1",
      title: "Villa, 3 Bedrooms",
      location: "Poble Nou de Benitatxell (el)",
      price: "2 200 €",
      bedrooms: 3,
      type: "Villa",
      ref: "7976A",
      image: "/placeholder.svg",
      status: "available",
    },
    notes: [
      { id: "n1", text: "Cliente interesado en zona costera, presupuesto flexible.", author: "Angelina Bukovetska", date: "05.03.2026 18:30" },
    ],
    matchedProperties: [
      { id: "mp1", title: "Villa, 3 Bedrooms", location: "Poble Nou de Benitatxell", price: "2 200 €", ref: "7976A", image: "/placeholder.svg", status: "confirmed" },
      { id: "mp2", title: "Villa, 4 Bedrooms", location: "Moraira", price: "2 800 €", ref: "8012B", image: "/placeholder.svg", status: "pending" },
    ],
    visits: [],
    tasks: [
      { id: "t1", title: "Llamar para confirmar horario de visita", done: false },
    ],
    stageHistory: [
      { stage: "lead", date: "05.03.2026 18:26", completed: true },
    ],
    preference: "Price: from 1500€ to 3000€ · Property Type: Villa · Business deal: To rent · Status: Available · in Benitatxell, Moraira",
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
      id: "p2",
      title: "Villa, 4 Bedrooms",
      location: "Poble Nou de Benitatxell (el)",
      price: "2 800 €",
      bedrooms: 4,
      type: "Villa",
      ref: "6819A",
      image: "/placeholder.svg",
      status: "available",
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
      id: "p3",
      title: "Apartment, 3 Bedrooms",
      location: "Cap Negret, Altea",
      price: "1 600 €",
      bedrooms: 3,
      type: "Apartment",
      ref: "7854A",
      image: "/placeholder.svg",
      status: "available",
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
      id: "p4",
      title: "Villa, 3 Bedrooms",
      location: "Sierra Cortina, Finestrat",
      price: "3 200 €",
      bedrooms: 3,
      type: "Villa",
      ref: "7091A",
      image: "/placeholder.svg",
      status: "available",
    },
    notes: [],
    matchedProperties: [],
    visits: [],
    tasks: [],
    stageHistory: [
      { stage: "lead", date: "05.03.2026 18:29", completed: true },
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
      id: "p5",
      title: "Villa, 5 Bedrooms",
      location: "El Montgó, Dénia",
      price: "589 000 €",
      bedrooms: 5,
      type: "Villa",
      ref: "7441",
      image: "/placeholder.svg",
      status: "available",
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
      id: "p6",
      title: "Apartment, 2 Bedrooms",
      location: "Rincón de Loix, Benidorm",
      price: "329 000 €",
      bedrooms: 2,
      type: "Apartment",
      ref: "2892",
      image: "/placeholder.svg",
      status: "available",
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
      id: "p7",
      title: "Villa, 3 Bedrooms",
      location: "Canuta Marvilla, Calpe/Calp",
      price: "2 500 €",
      bedrooms: 3,
      type: "Villa",
      ref: "4632A",
      image: "/placeholder.svg",
      status: "available",
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
      id: "p8",
      title: "Penthouse, 2 Bedrooms",
      location: "Playa del Albir, Alfaz del Pi",
      price: "1 800 €",
      bedrooms: 2,
      type: "Penthouse",
      ref: "9123C",
      image: "/placeholder.svg",
      status: "available",
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
