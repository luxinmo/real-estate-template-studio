import { useState } from "react";
import {
  Building2, Globe, MapPin, Calendar, Pencil, Users, Camera,
  BarChart3, Info, Plus, ExternalLink, BriefcaseBusiness, Languages,
  TrendingUp, FolderOpen, Award, Mail, Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/* ── Mock data ── */
const COMPANY = {
  name: "Luxinmo Real Estate",
  location: "Altea, Alicante, ES",
  founded: 2024,
  website: "luxinmo-realestate.byvaro.com",
  overview:
    "Luxinmo Real Estate se erige como un referente de excelencia, confianza y profesionalidad en el sector inmobiliario español, especializado en la venta y alquiler de propiedades de lujo en las zonas más exclusivas de la Costa Blanca y las Islas Baleares.",
  stats: { offices: 2, agents: 4, languages: 5, annualSales: 12, annualRevenue: 4, portfolioSize: 37 },
  email: "info@luxinmo.com",
  phone: "+34 966 000 000",
};

const TEAM = [
  { id: "1", name: "Carlos Martínez", role: "Director", avatar: null },
  { id: "2", name: "Ana López", role: "Agente Senior", avatar: null },
  { id: "3", name: "David García", role: "Marketing", avatar: null },
  { id: "4", name: "María Torres", role: "Agente", avatar: null },
];

const COLLABORATORS = [
  { id: "1", name: "Meridian Group" },
  { id: "2", name: "Costa Properties" },
  { id: "3", name: "YourPromoter" },
  { id: "4", name: "Golden Homes" },
  { id: "5", name: "Iberian Estates" },
  { id: "6", name: "SunCoast Realty" },
];

const TABS = [
  { id: "home", label: "Inicio", icon: Building2 },
  { id: "about", label: "Sobre nosotros", icon: Info },
  { id: "agents", label: "Agentes", icon: Users },
  { id: "stats", label: "Estadísticas", icon: BarChart3 },
];

/* ── Stat Card ── */
const StatCard = ({ label, value, sub }: { label: string; value: string | number; sub?: string }) => (
  <div className="text-center">
    <p className="text-2xl font-bold text-foreground">{value}</p>
    <p className="text-[12px] text-muted-foreground mt-0.5">{label}</p>
    {sub && <p className="text-[10px] text-muted-foreground/70">{sub}</p>}
  </div>
);

/* ── Avatar placeholder ── */
const AvatarCircle = ({ name, size = 40 }: { name: string; size?: number }) => {
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div
      className="rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  );
};

/* ── Main Component ── */
const CompanyPage = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [editing, setEditing] = useState(false);

  /* editable fields */
  const [name, setName] = useState(COMPANY.name);
  const [location, setLocation] = useState(COMPANY.location);
  const [website, setWebsite] = useState(COMPANY.website);
  const [overview, setOverview] = useState(COMPANY.overview);
  const [email, setEmail] = useState(COMPANY.email);
  const [phone, setPhone] = useState(COMPANY.phone);

  return (
    <div className="flex-1 overflow-auto">
      {/* ── Cover Banner ── */}
      <div className="relative h-48 sm:h-56 bg-gradient-to-br from-primary/20 via-muted to-primary/10">
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center opacity-30" />
        <button className="absolute top-3 right-3 flex items-center gap-1.5 bg-background/80 backdrop-blur-sm text-foreground text-[12px] font-medium px-3 py-1.5 rounded-lg border border-border hover:bg-background transition-colors">
          <Camera className="h-3.5 w-3.5" /> Cambiar portada
        </button>
      </div>

      {/* ── Profile Header ── */}
      <div className="relative px-4 sm:px-8 -mt-14">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          {/* Avatar */}
          <div className="relative">
            <div className="h-28 w-28 rounded-full border-4 border-background bg-primary/10 flex items-center justify-center shadow-lg">
              <Building2 className="h-12 w-12 text-primary" />
            </div>
            <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shadow-sm">
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Name & Info */}
          <div className="flex-1 pb-1">
            {editing ? (
              <Input value={name} onChange={(e) => setName(e.target.value)} className="text-xl font-bold h-auto py-1 mb-1 max-w-md" />
            ) : (
              <h1 className="text-xl font-bold text-foreground tracking-tight">{name}</h1>
            )}
            <div className="flex items-center gap-3 text-[13px] text-muted-foreground mt-0.5 flex-wrap">
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {location}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Fundada en {COMPANY.founded}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pb-1">
            <a
              href={`https://${website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[12px] font-medium text-primary border border-primary/30 rounded-lg px-3 py-1.5 hover:bg-primary/5 transition-colors"
            >
              <Globe className="h-3.5 w-3.5" /> {website}
            </a>
            <Button
              variant={editing ? "default" : "outline"}
              size="sm"
              className="gap-1.5"
              onClick={() => setEditing(!editing)}
            >
              <Pencil className="h-3.5 w-3.5" />
              {editing ? "Guardar" : "Editar perfil"}
            </Button>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="mt-6 border-b border-border">
          <div className="flex gap-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-[13px] font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? "text-primary border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className="px-4 sm:px-8 py-6">
        {activeTab === "home" && <HomeTab editing={editing} overview={overview} setOverview={setOverview} email={email} setEmail={setEmail} phone={phone} setPhone={setPhone} website={website} setWebsite={setWebsite} />}
        {activeTab === "about" && <AboutTab editing={editing} overview={overview} setOverview={setOverview} />}
        {activeTab === "agents" && <AgentsTab />}
        {activeTab === "stats" && <StatsTab />}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   TAB: Home
   ═══════════════════════════════════════════ */
interface HomeTabProps {
  editing: boolean;
  overview: string;
  setOverview: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  website: string;
  setWebsite: (v: string) => void;
}

const HomeTab = ({ editing, overview, setOverview, email, setEmail, phone, setPhone, website, setWebsite }: HomeTabProps) => (
  <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
    {/* Left */}
    <div className="space-y-6">
      {/* Overview */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-[15px] font-semibold text-foreground mb-3">Descripción general</h2>
        {editing ? (
          <Textarea value={overview} onChange={(e) => setOverview(e.target.value)} className="text-[13px] min-h-[120px]" />
        ) : (
          <p className="text-[13px] text-muted-foreground leading-relaxed">{overview}</p>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-3">Información de la empresa</p>
          <div className="grid grid-cols-3 gap-4">
            <StatCard label="Oficinas" value={COMPANY.stats.offices} />
            <StatCard label="Agentes" value={COMPANY.stats.agents} />
            <StatCard label="Idiomas" value={COMPANY.stats.languages} />
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-3">Rendimiento</p>
          <div className="grid grid-cols-3 gap-4">
            <StatCard label="Ventas anuales" value={COMPANY.stats.annualSales} />
            <StatCard label="Ingresos (M€)" value={COMPANY.stats.annualRevenue} />
            <StatCard label="Portfolio" value={COMPANY.stats.portfolioSize} />
          </div>
        </div>
      </div>

      {/* Collaborators */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-[15px] font-semibold text-foreground mb-3">Promotores colaboradores</h2>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {COLLABORATORS.slice(0, 5).map((c) => (
              <AvatarCircle key={c.id} name={c.name} size={36} />
            ))}
          </div>
          <div className="ml-2">
            <p className="text-[13px] font-medium text-foreground">{COLLABORATORS.length} Colaboraciones activas</p>
            <p className="text-[12px] text-muted-foreground">
              {COLLABORATORS[0].name} y {COLLABORATORS.length - 1} más
            </p>
          </div>
        </div>
      </div>

      {/* Contact info */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-[15px] font-semibold text-foreground mb-3">Información de contacto</h2>
        {editing ? (
          <div className="space-y-3">
            <div>
              <Label className="text-[12px] mb-1 block">Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} className="text-[13px] h-9" />
            </div>
            <div>
              <Label className="text-[12px] mb-1 block">Teléfono</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="text-[13px] h-9" />
            </div>
            <div>
              <Label className="text-[12px] mb-1 block">Sitio web</Label>
              <Input value={website} onChange={(e) => setWebsite(e.target.value)} className="text-[13px] h-9" />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[13px]">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{email}</span>
            </div>
            <div className="flex items-center gap-2 text-[13px]">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{phone}</span>
            </div>
            <div className="flex items-center gap-2 text-[13px]">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <a href={`https://${website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{website}</a>
            </div>
          </div>
        )}
      </div>
    </div>

    {/* Right Sidebar */}
    <div className="space-y-5">
      {/* Team */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[13px] font-semibold text-foreground">Equipo y permisos</h3>
          <Info className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className="text-[12px] text-muted-foreground mb-4">
          Invita a tu equipo o asigna un administrador para gestionar los detalles de la agencia.
        </p>
        <Button variant="outline" size="sm" className="w-full gap-1.5 text-[12px]">
          <Plus className="h-3.5 w-3.5" /> Añadir miembro del equipo
        </Button>
      </div>

      {/* Quick website */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-[13px] font-semibold text-foreground mb-1">Crea tu web en minutos</h3>
        <p className="text-[12px] text-muted-foreground mb-4">
          Aprovecha tu perfil para crear una web gratuita. Puedes actualizar y personalizar la información en cualquier momento.
        </p>
        <Button variant="outline" size="sm" className="w-full gap-1.5 text-[12px]">
          <Globe className="h-3.5 w-3.5" /> Crear sitio web
        </Button>
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   TAB: About
   ═══════════════════════════════════════════ */
const AboutTab = ({ editing, overview, setOverview }: { editing: boolean; overview: string; setOverview: (v: string) => void }) => (
  <div className="max-w-3xl space-y-6">
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-[15px] font-semibold text-foreground mb-3">Sobre nosotros</h2>
      {editing ? (
        <Textarea value={overview} onChange={(e) => setOverview(e.target.value)} className="text-[13px] min-h-[200px]" />
      ) : (
        <p className="text-[13px] text-muted-foreground leading-relaxed whitespace-pre-line">{overview}</p>
      )}
    </div>

    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-[15px] font-semibold text-foreground mb-4">Valores</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {["Excelencia", "Confianza", "Profesionalidad"].map((val) => (
          <div key={val} className="rounded-lg bg-muted/50 p-4 text-center">
            <Award className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-[13px] font-medium text-foreground">{val}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   TAB: Agents
   ═══════════════════════════════════════════ */
const AgentsTab = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-[15px] font-semibold text-foreground">Equipo ({TEAM.length})</h2>
      <Button size="sm" className="gap-1.5 text-[12px]">
        <Plus className="h-3.5 w-3.5" /> Añadir agente
      </Button>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {TEAM.map((member) => (
        <div key={member.id} className="rounded-xl border border-border bg-card p-5 flex items-center gap-4">
          <AvatarCircle name={member.name} size={48} />
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium text-foreground truncate">{member.name}</p>
            <p className="text-[12px] text-muted-foreground">{member.role}</p>
          </div>
          <Button variant="ghost" size="sm" className="shrink-0">
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   TAB: Stats
   ═══════════════════════════════════════════ */
const StatsTab = () => (
  <div className="space-y-6">
    <h2 className="text-[15px] font-semibold text-foreground">Estadísticas</h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {[
        { label: "Oficinas", value: COMPANY.stats.offices, icon: Building2 },
        { label: "Agentes", value: COMPANY.stats.agents, icon: Users },
        { label: "Idiomas", value: COMPANY.stats.languages, icon: Languages },
        { label: "Ventas anuales", value: COMPANY.stats.annualSales, icon: TrendingUp },
        { label: "Ingresos (M€)", value: COMPANY.stats.annualRevenue, icon: BriefcaseBusiness },
        { label: "Portfolio", value: COMPANY.stats.portfolioSize, icon: FolderOpen },
      ].map((s) => (
        <div key={s.label} className="rounded-xl border border-border bg-card p-5 text-center">
          <s.icon className="h-5 w-5 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{s.value}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{s.label}</p>
        </div>
      ))}
    </div>

    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-[13px] font-semibold text-foreground mb-3">Rendimiento mensual</h3>
      <div className="h-48 flex items-center justify-center text-muted-foreground text-[13px]">
        <BarChart3 className="h-8 w-8 mr-2 opacity-30" /> Gráfico de rendimiento (próximamente)
      </div>
    </div>
  </div>
);

export default CompanyPage;
