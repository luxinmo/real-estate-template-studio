import {
  Maximize, Building2, Bed, Bath, Home, RefreshCw, Compass, CalendarDays,
  MapPin, Mail, Phone, User,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const statusColors: Record<string, string> = {
  Disponible: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Reservado: "bg-amber-50 text-amber-700 border-amber-200",
  Vendido: "bg-red-50 text-red-700 border-red-200",
};

const details = [
  { icon: Maximize, label: "Área útil", value: "85 m²" },
  { icon: Building2, label: "Área construida", value: "95 m²" },
  { icon: Home, label: "Parcela", value: "800 m²" },
  { icon: Bed, label: "Dormitorios", value: "2" },
  { icon: Bath, label: "Baños", value: "1" },
  { icon: Home, label: "Tipo", value: "Apartamento" },
  { icon: Building2, label: "Subtipo", value: "Piso" },
  { icon: RefreshCw, label: "Estado", value: "Nueva construcción" },
  { icon: Compass, label: "Orientación", value: "Sur" },
  { icon: CalendarDays, label: "Año construcción", value: "2020" },
];

const energyScale = ["A", "B", "C", "D", "E", "F", "G"];
const energyColors: Record<string, string> = {
  A: "bg-emerald-500", B: "bg-emerald-400", C: "bg-lime-400",
  D: "bg-yellow-400", E: "bg-amber-400", F: "bg-orange-400", G: "bg-red-500",
};
const currentEnergy = "C";

const PropertySidebar = () => (
  <div className="space-y-4 sticky top-8">
    {/* Price & CTA */}
    <div className="rounded-xl border-2 border-primary bg-card shadow-card p-6">
      <div className="flex items-center gap-2 mb-2">
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusColors.Disponible}`}>
          Disponible
        </span>
        <span className="text-xs font-mono text-muted-foreground ml-auto">REF: 2025-0001</span>
      </div>
      <div className="mt-4 space-y-3">
        <div>
          <p className="text-2xl font-bold text-foreground">285.000 €</p>
          <p className="text-xs text-muted-foreground">Precio de venta</p>
        </div>
        <div className="border-t border-border pt-3">
          <p className="text-xl font-semibold text-foreground">1.200 € <span className="text-sm font-normal text-muted-foreground">/mes</span></p>
          <p className="text-xs text-muted-foreground">Precio de alquiler</p>
        </div>
      </div>
      <div className="mt-5 space-y-2">
        <Button className="w-full">Contactar</Button>
        <Button variant="outline" className="w-full">Solicitar visita</Button>
      </div>
    </div>

    {/* Details grid */}
    <div className="rounded-xl border border-border bg-card shadow-card p-6">
      <h3 className="text-base font-semibold text-foreground mb-4">Detalles</h3>
      <div className="grid grid-cols-2 gap-3">
        {details.map((d) => (
          <div key={d.label} className="flex items-start gap-2">
            <d.icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" strokeWidth={1.5} />
            <div>
              <p className="text-[11px] text-muted-foreground">{d.label}</p>
              <p className="text-sm font-medium text-foreground">{d.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Location */}
    <div className="rounded-xl border border-border bg-card shadow-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-3">Ubicación</h3>
      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between"><span className="text-muted-foreground">País</span><span className="text-foreground">España</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Provincia</span><span className="text-foreground">Alicante</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Municipio</span><span className="text-foreground">Altea</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Zona</span><span className="text-foreground">Altea La Vella</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">C.P.</span><span className="text-foreground">03590</span></div>
      </div>
    </div>

    {/* Energy certificate */}
    <div className="rounded-xl border border-border bg-card shadow-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-3">Certificado Energético</h3>
      <div className="flex gap-1 mb-3">
        {energyScale.map((letter) => (
          <div
            key={letter}
            className={`flex items-center justify-center h-7 flex-1 rounded text-xs font-bold text-card ${energyColors[letter]} ${
              letter === currentEnergy ? "ring-2 ring-foreground ring-offset-1 scale-110" : "opacity-50"
            }`}
          >
            {letter}
          </div>
        ))}
      </div>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between"><span className="text-muted-foreground">Consumo</span><span className="text-foreground">85 kWh/m²/año</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Emisiones CO₂</span><span className="text-foreground">18 kgCO₂/m²/año</span></div>
      </div>
    </div>

    {/* Agent */}
    <div className="rounded-xl border border-border bg-card shadow-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-3">Agente responsable</h3>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shrink-0">
          <span className="text-sm font-semibold text-primary-foreground">AY</span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">Arman Yeghiazaryan</p>
          <p className="text-xs text-muted-foreground truncate">Oficina Altea</p>
        </div>
      </div>
      <div className="mt-3 space-y-1.5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
          <span className="truncate">arman@omni47.com</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
          <span>+34 600 123 456</span>
        </div>
      </div>
    </div>

    {/* Additional info */}
    <div className="rounded-xl border border-border bg-card shadow-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-3">Información adicional</h3>
      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between"><span className="text-muted-foreground">Ref. catastral</span><span className="text-foreground font-mono text-xs">1234567AB1234N</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">IBI</span><span className="text-foreground">450 €/año</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Comunidad</span><span className="text-foreground">80 €/mes</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Fianza</span><span className="text-foreground">2.400 €</span></div>
      </div>
    </div>
  </div>
);

export default PropertySidebar;
