import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertySearchFilters, { FilterState, defaultFilters } from "@/components/properties/PropertySearchFilters";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const demoProperties = [
  {
    id: 1, image: property1, title: "Villa Mediterránea con Piscina", price: "1.100.000 €", previousPrice: "1.250.000 €", location: "Moravit-Cap Blanc, Moraira",
    beds: 3, baths: 2, sqft: "190", status: "Disponible", type: "Villa", operacion: "Venta",
    reference: "6254", rating: 5, builtArea: "288", plotArea: "1.051",
    description: "Introducing a beautiful detached house, nestled in the peaceful Moravit-Cap Blanc area of Moraira, combining modern and Mediterranean architectural styles.",
    tags: ["B.B+"], collaboration: true, webActive: true,
    createdAt: "23.12.2025", updatedAt: "27.02.2026",
  },
  {
    id: 2, image: property2, title: "Penthouse con Vistas al Skyline", price: "1.890.000 €", location: "Manhattan, NY",
    beds: 3, baths: 2, sqft: "2.100", status: "Bajo oferta", type: "Apartamento", operacion: "Venta",
    reference: "4821", rating: 4, builtArea: "2.100",
    description: "Espectacular penthouse con vistas panorámicas al skyline de Manhattan. Acabados de lujo, terraza privada y acceso directo al rooftop.",
    tags: ["A+"], isCollaborator: true, collaboratorName: "Luxinmo", webActive: false,
    createdAt: "10.01.2026", updatedAt: "25.02.2026",
  },
  {
    id: 3, image: property3, title: "Mansión Frente al Mar", price: "5.750.000 €", previousPrice: "6.200.000 €", location: "Malibu, CA",
    beds: 6, baths: 5, sqft: "5.800", status: "Disponible", type: "Mansión", operacion: "Alquiler",
    reference: "7103", rating: 5, builtArea: "5.800", plotArea: "3.200",
    description: "Mansión exclusiva en primera línea de playa con acceso privado al mar, piscina infinity, spa y jardines tropicales.",
    tags: ["A.A"], collaboration: true, webActive: true,
    createdAt: "05.11.2025", updatedAt: "20.02.2026",
  },
];

const PropertiesPage = ({ onViewProperty, onAddProperty }: { onViewProperty?: () => void; onAddProperty?: () => void }) => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <div className="px-8 pt-8 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Propiedades</h1>
          <p className="text-sm text-muted-foreground mt-1">Catálogo de propiedades inmobiliarias</p>
        </div>
        <Button className="gap-2 shrink-0" onClick={onAddProperty}>
          <Plus className="h-4 w-4" />
          Nueva propiedad
        </Button>
      </div>

      {/* Search Filters Bar */}
      <div className="px-8 pb-4">
        <PropertySearchFilters filters={filters} onChange={setFilters} />
      </div>

      {/* Property List */}
      <div className="px-8 pb-10">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[12px] text-muted-foreground">{demoProperties.length} propiedades encontradas</p>
        </div>
        <div className="space-y-4">
          {demoProperties.map((p) => (
            <PropertyCard key={p.id} property={p} onClick={onViewProperty} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertiesPage;
