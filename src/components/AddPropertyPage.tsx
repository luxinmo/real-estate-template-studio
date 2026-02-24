import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import GeneralDataSection from "./add-property/GeneralDataSection";
import LocationSection from "./add-property/LocationSection";
import CadastralSection from "./add-property/CadastralSection";
import AreasDivisionsSection from "./add-property/AreasDivisionsSection";
import DescriptionSection from "./add-property/DescriptionSection";
import FeaturesSection from "./add-property/FeaturesSection";
import PhotosSection, { type PhotoItem } from "./add-property/PhotosSection";
import EnergyCertificateSection from "./add-property/EnergyCertificateSection";
import OtherFeaturesSection from "./add-property/OtherFeaturesSection";

const sectionNav = [
  "General", "Location", "Cadastral", "Areas", "Description",
  "Features", "Photos", "Floor Plans", "Energy", "Other",
];

interface AddPropertyPageProps {
  onBack: () => void;
}

const generateRef = () => {
  const year = new Date().getFullYear();
  const num = String(Math.floor(Math.random() * 9999) + 1).padStart(4, "0");
  return `${year}-${num}`;
};

const AddPropertyPage = ({ onBack }: AddPropertyPageProps) => {
  // Section 1: General Data
  const [general, setGeneral] = useState({
    propertyType: "",
    subtype: "",
    reference: generateRef(),
    status: "Active",
    availability: "Available",
    style: [] as string[],
    duration: "",
    operations: [] as { type: string; price: string; reference: string; hidePrice: boolean }[],
  });

  // Section 2: Location
  const [location, setLocation] = useState({
    country: "Spain",
    province: "",
    town: "",
    zone: "",
    address: "",
    zipCode: "",
    number: "",
    staircase: "",
    floor: "",
    door: "",
    
    publishAddress: true,
    publishGeo: false,
    branch: "",
  });

  // Section 3: Cadastral
  const [cadastral, setCadastral] = useState({
    cadastralRef: "",
    registrationNumber: "",
    ownerId: "",
  });

  // Section 4: Areas
  const [areas, setAreas] = useState({
    builtArea: "",
    usefulArea: "",
    plot: "",
    bedrooms: 2,
    bathrooms: 1,
    numberOfFloors: "",
    floorNumber: "",
  });

  // Section 5: Description
  const [descriptions, setDescriptions] = useState<Record<string, { title: string; description: string }>>({});

  // Section 6: Features
  const [features, setFeatures] = useState<string[]>([]);

  // Section 7: Photos
  const [photos, setPhotos] = useState<PhotoItem[]>([]);

  // Section 8: Floor Plans
  const [floorPlans, setFloorPlans] = useState<PhotoItem[]>([]);

  // Section 9: Energy
  const [energy, setEnergy] = useState({
    energyGrade: "",
    energyConsumption: "",
    co2Grade: "",
    co2Emissions: "",
  });

  // Section 10: Other
  const [other, setOther] = useState({
    condoExpenses: "",
    condoPeriod: "Month",
    condoType: "",
    deposit: "",
    depositType: "Euro",
    orientation: "",
    insideExterior: "",
    buildingYear: "",
    youtubeUrl: "",
    vimeoUrl: "",
    url360: "",
    ibi: "",
    garbageTax: "",
    hasKey: false,
    keyRef: "",
    hasCartel: false,
    cartelRef: "",
  });

  const [activeSection, setActiveSection] = useState(0);

  const handleSave = () => {
    toast({
      title: "Property saved",
      description: `Reference ${general.reference} saved successfully.`,
    });
    onBack();
  };

  const scrollToSection = (idx: number) => {
    setActiveSection(idx);
    const el = document.getElementById(`section-${idx}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-foreground">New Property</h1>
              <p className="text-xs text-muted-foreground font-mono">{general.reference}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onBack}>Cancel</Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" /> Save Property
            </Button>
          </div>
        </div>

        {/* Section navigation */}
        <div className="px-4 sm:px-8 overflow-x-auto scrollbar-none">
          <div className="flex gap-0 min-w-max">
            {sectionNav.map((label, idx) => (
              <button
                key={label}
                type="button"
                onClick={() => scrollToSection(idx)}
                className={`px-4 py-2.5 text-[13px] font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeSection === idx
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Form sections */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6 space-y-6">
          <div id="section-0"><GeneralDataSection data={general} onChange={setGeneral} /></div>
          <div id="section-1"><LocationSection data={location} onChange={setLocation} /></div>
          <div id="section-2"><CadastralSection data={cadastral} onChange={setCadastral} /></div>
          <div id="section-3"><AreasDivisionsSection data={areas} onChange={setAreas} propertyType={general.propertyType} subtype={general.subtype} /></div>
          <div id="section-4"><DescriptionSection data={descriptions} onChange={setDescriptions} /></div>
          <div id="section-5"><FeaturesSection data={features} onChange={setFeatures} /></div>
          <div id="section-6"><PhotosSection data={photos} onChange={setPhotos} /></div>
          <div id="section-7"><PhotosSection data={floorPlans} onChange={setFloorPlans} title="Floor Plans" showLabels={false} maxPhotos={20} /></div>
          <div id="section-8"><EnergyCertificateSection data={energy} onChange={setEnergy} /></div>
          <div id="section-9"><OtherFeaturesSection data={other} onChange={setOther} /></div>

          {/* Bottom save */}
          <div className="flex justify-end gap-3 pt-4 pb-8">
            <Button variant="outline" onClick={onBack}>Cancel</Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" /> Save Property
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPropertyPage;
