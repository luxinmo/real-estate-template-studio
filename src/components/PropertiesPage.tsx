import { MapPin, Bed, Bath, Maximize, Eye, MoreHorizontal } from "lucide-react";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const demoProperties = [
  { id: 1, image: property1, title: "Villa Mediterránea con Piscina", price: "$2,450,000", location: "Palm Beach, FL", beds: 4, baths: 3, sqft: "3,200", status: "Disponible", type: "Villa" },
  { id: 2, image: property2, title: "Penthouse con Vistas al Skyline", price: "$1,890,000", location: "Manhattan, NY", beds: 3, baths: 2, sqft: "2,100", status: "Reservado", type: "Apartamento" },
  { id: 3, image: property3, title: "Mansión Frente al Mar", price: "$5,750,000", location: "Malibu, CA", beds: 6, baths: 5, sqft: "5,800", status: "Disponible", type: "Mansión" },
];

const statusColors: Record<string, string> = {
  Disponible: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Reservado: "bg-amber-50 text-amber-700 border-amber-200",
};

const PropertiesPage = () => {
  return (
    <div className="flex-1 overflow-auto">
      <div className="px-8 pt-8 pb-6">
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">Propiedades</h1>
        <p className="text-sm text-muted-foreground mt-1">Catálogo de propiedades inmobiliarias</p>
      </div>

      <div className="px-8 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {demoProperties.map((p) => (
            <div key={p.id} className="rounded-xl border border-border bg-card shadow-card overflow-hidden group hover:shadow-elevated transition-shadow">
              <div className="relative h-44 overflow-hidden">
                <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 rounded-md bg-card/90 backdrop-blur-sm px-2.5 py-1">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-foreground">{p.type}</span>
                </div>
                <div className="absolute bottom-3 left-3 rounded-md bg-primary/90 backdrop-blur-sm px-2.5 py-1">
                  <span className="text-[13px] font-semibold text-primary-foreground">{p.price}</span>
                </div>
              </div>
              <div className="p-4">
                <p className="text-[14px] font-medium text-foreground">{p.title}</p>
                <div className="flex items-center gap-1.5 text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3" strokeWidth={1.5} />
                  <span className="text-[12px]">{p.location}</span>
                </div>
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
                  <span className="flex items-center gap-1 text-[12px] text-muted-foreground"><Bed className="h-3.5 w-3.5" strokeWidth={1.5} /> {p.beds}</span>
                  <span className="flex items-center gap-1 text-[12px] text-muted-foreground"><Bath className="h-3.5 w-3.5" strokeWidth={1.5} /> {p.baths}</span>
                  <span className="flex items-center gap-1 text-[12px] text-muted-foreground"><Maximize className="h-3.5 w-3.5" strokeWidth={1.5} /> {p.sqft} sqft</span>
                  <span className={`ml-auto inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusColors[p.status]}`}>{p.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertiesPage;
