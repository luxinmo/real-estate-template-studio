import { useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import HeaderBar from "@/components/HeaderBar";
import { ContactsListPage, AddContactPage, ContactDetailPage } from "@/components/contacts";
import { CountriesPage, ProvincesPage, RegionsPage, MunicipalitiesPage, MunicipalityDetailPage, BoroughFormPage } from "@/components/locations";
import { FuentesPage, MapeoPage, HistorialPage, SchedulerPage, PendientesPage } from "@/components/importer";
import { CmsPagesListPage, CmsPageEditorPage, CmsBlogListPage, CmsBlogEditorPage } from "@/components/cms";
import PropertiesPage from "@/components/PropertiesPage";
import PropertyDetailPage from "@/components/PropertyDetailPage";
import AddPropertyPage from "@/components/AddPropertyPage";
import LuxuryLandingPage from "@/components/LuxuryLandingPage";
import UsersPage from "@/components/UsersPage";
import Home2LandingPage from "@/components/home-2/Home2LandingPage";
import ComponentsPage from "@/components/ComponentsPage";
import CardDesignerPage from "@/components/card-designer/CardDesignerPage";

type View =
  | "dashboard" | "properties" | "property-detail" | "add-property"
  | "contacts" | "add-contact" | "contact-detail"
  | "agencies" | "users" | "company" | "settings" | "components"
  | "loc-countries" | "loc-provinces" | "loc-regions" | "loc-municipalities" | "loc-municipality-detail" | "loc-borough-form"
  | "imp-fuentes" | "imp-mapeo" | "imp-historial" | "imp-scheduler" | "imp-pendientes"
  | "luxury-landing" | "home-2" | "card-designer"
  | "cms-pages" | "cms-page-editor" | "cms-blog" | "cms-blog-editor";

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex-1 overflow-auto">
    <div className="px-4 sm:px-8 pt-8 pb-6">
      <h1 className="text-2xl font-semibold text-foreground tracking-tight">{title}</h1>
      <p className="text-sm text-muted-foreground mt-1">Esta sección se configurará próximamente</p>
    </div>
  </div>
);

const Index = () => {
  const [view, setView] = useState<View>("properties");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState<string>("1");
  const [cmsEditId, setCmsEditId] = useState<string | null>(null);

  // Location drill-down
  const [locCountryId, setLocCountryId] = useState("");
  const [locProvinceId, setLocProvinceId] = useState("");
  const [locRegionId, setLocRegionId] = useState("");
  const [locMunicipalityId, setLocMunicipalityId] = useState("");
  const [locBoroughId, setLocBoroughId] = useState<string | null>(null);

  // Importer
  const [impSourceId, setImpSourceId] = useState("");

  const sidebarView = (() => {
    if (["add-contact", "contact-detail"].includes(view)) return "contacts";
    if (["property-detail", "add-property"].includes(view)) return "properties";
    if (view.startsWith("loc-")) return "locations";
    if (view === "imp-mapeo") return "imp-fuentes";
    if (view.startsWith("imp-")) return view;
    if (view === "cms-page-editor") return "cms-pages";
    if (view === "cms-blog-editor") return "cms-blog";
    return view;
  })();

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AppSidebar
        currentView={sidebarView}
        onNavigate={(v) => {
          if (v === "locations") { setView("loc-countries"); return; }
          setView(v as View);
        }}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex flex-1 flex-col min-w-0">
        <HeaderBar onMenuToggle={() => setSidebarOpen(true)} />

        {view === "dashboard" && <PlaceholderPage title="Dashboard" />}
        {view === "properties" && <PropertiesPage onViewProperty={() => setView("property-detail")} onAddProperty={() => setView("add-property")} />}
        {view === "property-detail" && <PropertyDetailPage onBack={() => setView("properties")} />}
        {view === "add-property" && <AddPropertyPage onBack={() => setView("properties")} />}
        {view === "contacts" && <ContactsListPage onAddContact={() => setView("add-contact")} onViewContact={(id) => { setSelectedContactId(id); setView("contact-detail"); }} />}
        {view === "add-contact" && <AddContactPage onBack={() => setView("contacts")} />}
        {view === "contact-detail" && <ContactDetailPage contactId={selectedContactId} onBack={() => setView("contacts")} onEdit={() => setView("add-contact")} />}
        {view === "agencies" && <PlaceholderPage title="Agencias" />}

        {view === "loc-countries" && (
          <CountriesPage onSelectCountry={(id) => { setLocCountryId(id); setView("loc-provinces"); }} />
        )}
        {view === "loc-provinces" && (
          <ProvincesPage
            countryId={locCountryId}
            onBack={() => setView("loc-countries")}
            onSelectProvince={(id) => { setLocProvinceId(id); setView("loc-regions"); }}
          />
        )}
        {view === "loc-regions" && (
          <RegionsPage
            countryId={locCountryId}
            provinceId={locProvinceId}
            onBackToCountries={() => setView("loc-countries")}
            onBackToProvinces={() => setView("loc-provinces")}
            onSelectRegion={(id) => { setLocRegionId(id); setView("loc-municipalities"); }}
          />
        )}
        {view === "loc-municipalities" && (
          <MunicipalitiesPage
            countryId={locCountryId}
            provinceId={locProvinceId}
            regionId={locRegionId}
            onBackToCountries={() => setView("loc-countries")}
            onBackToProvinces={() => setView("loc-provinces")}
            onBackToRegions={() => setView("loc-regions")}
            onSelectMunicipality={(id) => { setLocMunicipalityId(id); setView("loc-municipality-detail"); }}
          />
        )}
        {view === "loc-municipality-detail" && (
          <MunicipalityDetailPage
            countryId={locCountryId}
            provinceId={locProvinceId}
            regionId={locRegionId}
            municipalityId={locMunicipalityId}
            onBackToCountries={() => setView("loc-countries")}
            onBackToProvinces={() => setView("loc-provinces")}
            onBackToRegions={() => setView("loc-regions")}
            onBackToMunicipalities={() => setView("loc-municipalities")}
            onEditBorough={(boroughId) => { setLocBoroughId(boroughId); setView("loc-borough-form"); }}
          />
        )}
        {view === "loc-borough-form" && (
          <BoroughFormPage
            countryId={locCountryId}
            provinceId={locProvinceId}
            regionId={locRegionId}
            municipalityId={locMunicipalityId}
            boroughId={locBoroughId}
            onBackToCountries={() => setView("loc-countries")}
            onBackToProvinces={() => setView("loc-provinces")}
            onBackToRegions={() => setView("loc-regions")}
            onBackToMunicipalities={() => setView("loc-municipalities")}
            onBackToMunicipalityDetail={() => setView("loc-municipality-detail")}
          />
        )}

        {/* Importer */}
        {view === "imp-fuentes" && (
          <FuentesPage
            onOpenMapeo={(id) => { setImpSourceId(id); setView("imp-mapeo"); }}
            onOpenHistorial={() => setView("imp-historial")}
          />
        )}
        {view === "imp-mapeo" && (
          <MapeoPage sourceId={impSourceId} onBack={() => setView("imp-fuentes")} />
        )}
        {view === "imp-historial" && <HistorialPage />}
        {view === "imp-scheduler" && <SchedulerPage />}
        {view === "imp-pendientes" && <PendientesPage />}

        {view === "components" && <ComponentsPage />}
        {view === "card-designer" && <CardDesignerPage />}
        {view === "luxury-landing" && <LuxuryLandingPage />}
        {view === "home-2" && <Home2LandingPage />}

        {/* CMS */}
        {view === "cms-pages" && <CmsPagesListPage onEdit={(id) => { setCmsEditId(id); setView("cms-page-editor"); }} onNew={() => { setCmsEditId(null); setView("cms-page-editor"); }} />}
        {view === "cms-page-editor" && <CmsPageEditorPage pageId={cmsEditId} onBack={() => setView("cms-pages")} />}
        {view === "cms-blog" && <CmsBlogListPage onEdit={(id) => { setCmsEditId(id); setView("cms-blog-editor"); }} onNew={() => { setCmsEditId(null); setView("cms-blog-editor"); }} />}
        {view === "cms-blog-editor" && <CmsBlogEditorPage postId={cmsEditId} onBack={() => setView("cms-blog")} />}

        {view === "users" && <UsersPage />}
        {view === "company" && <PlaceholderPage title="Empresa" />}
        {view === "settings" && <PlaceholderPage title="Ajustes" />}
      </div>
    </div>
  );
};

export default Index;
