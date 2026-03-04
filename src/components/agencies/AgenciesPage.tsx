import { useState } from "react";
import {
  Building, Search, SlidersHorizontal, ArrowUpDown, Plus,
  CheckCircle2, MoreVertical, AlertTriangle, UserPlus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/* ── Types ── */
interface Agency {
  id: string;
  name: string;
  location: string;
  verified: boolean;
  status: "collaboration" | "pending";
  registrations: number;
  sales: number;
  hasWarning: boolean;
  avatar: string | null;
}

/* ── Mock data ── */
const AGENCIES: Agency[] = [
  { id: "1", name: "Agencia Lucas", location: "Valencia / Spain", verified: true, status: "pending", registrations: 0, sales: 0, hasWarning: true, avatar: null },
  { id: "2", name: "JustRent - Spain Rentales", location: "Altea / es", verified: true, status: "collaboration", registrations: 1, sales: 0, hasWarning: true, avatar: null },
  { id: "3", name: "Luxinmo Real Estate", location: "Valencia / Spain", verified: true, status: "collaboration", registrations: 3, sales: 0, hasWarning: true, avatar: null },
  { id: "4", name: "Costa Properties", location: "Benidorm / Spain", verified: true, status: "collaboration", registrations: 5, sales: 2, hasWarning: false, avatar: null },
  { id: "5", name: "Golden Homes", location: "Málaga / Spain", verified: false, status: "pending", registrations: 0, sales: 0, hasWarning: true, avatar: null },
  { id: "6", name: "Iberian Estates", location: "Marbella / Spain", verified: true, status: "collaboration", registrations: 8, sales: 4, hasWarning: false, avatar: null },
];

const TABS = [
  { id: "all", label: "All" },
  { id: "collaborating", label: "Collaborating agencies" },
  { id: "pending", label: "Pending" },
  { id: "non-collaborating", label: "Non collaborating agencies" },
];

/* ── Avatar ── */
const AgencyAvatar = ({ name }: { name: string }) => {
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
      <Building className="h-5 w-5 text-muted-foreground" />
    </div>
  );
};

/* ── Agency Card ── */
const AgencyCard = ({ agency }: { agency: Agency }) => (
  <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-3 hover:shadow-sm transition-shadow">
    {/* Top row */}
    <div className="flex items-start gap-3">
      <AgencyAvatar name={agency.name} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-[13px] font-semibold text-foreground truncate">{agency.name}</p>
          {agency.verified && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
        </div>
        <p className="text-[12px] text-muted-foreground">{agency.location}</p>
        <div className="flex items-center gap-1.5 mt-1.5">
          <Badge
            variant="outline"
            className={`text-[10px] px-1.5 py-0 font-medium ${
              agency.status === "collaboration"
                ? "border-primary/30 text-primary bg-primary/5"
                : "border-amber-400/50 text-amber-600 bg-amber-50"
            }`}
          >
            {agency.status === "collaboration" ? "Collaborations" : "Pending"}
          </Badge>
          <button className="text-muted-foreground hover:text-foreground">
            <MoreVertical className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      {/* Checkbox placeholder */}
      <div className="h-4 w-4 rounded border border-border mt-0.5 shrink-0" />
    </div>

    {/* Bottom stats */}
    <div className="flex items-center gap-4 pt-2 border-t border-border text-[12px] text-muted-foreground">
      <span className="flex items-center gap-1">
        📋 text.registrations: {agency.registrations}
      </span>
      <span className="flex items-center gap-1">
        € Sales: {agency.sales}
      </span>
      {agency.hasWarning && <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />}
      <button className="ml-auto flex items-center gap-1 text-primary font-medium hover:underline text-[12px]">
        <UserPlus className="h-3.5 w-3.5" /> + Invite
      </button>
    </div>
  </div>
);

/* ── Main Page ── */
const AgenciesPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = AGENCIES.filter((a) => {
    if (activeTab === "collaborating") return a.status === "collaboration";
    if (activeTab === "pending") return a.status === "pending";
    if (activeTab === "non-collaborating") return false;
    return true;
  }).filter((a) => a.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex-1 overflow-auto">
      <div className="px-4 sm:px-8 pt-6 pb-8">
        {/* Title */}
        <h1 className="text-lg font-semibold text-foreground tracking-tight mb-5">Collaborations</h1>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-5">
          {/* Tabs */}
          <div className="flex items-center gap-0 bg-muted/50 rounded-lg p-0.5">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search agency"
                className="pl-8 h-8 w-48 text-[12px]"
              />
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowUpDown className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <SlidersHorizontal className="h-3.5 w-3.5" />
            </Button>
            <Button size="sm" className="h-8 w-8 p-0 rounded-full">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((agency) => (
            <AgencyCard key={agency.id} agency={agency} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground text-[13px]">
            No se encontraron agencias
          </div>
        )}
      </div>
    </div>
  );
};

export default AgenciesPage;
