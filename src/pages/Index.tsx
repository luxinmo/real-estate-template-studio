import { useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import HeaderBar from "@/components/HeaderBar";
import { ContactsListPage, AddContactPage, ContactDetailPage } from "@/components/contacts";
import { CountriesPage, ProvincesPage, TownsPage, TownDetailPage, ZoneFormPage } from "@/components/locations";
import PropertiesPage from "@/components/PropertiesPage";
import PropertyDetailPage from "@/components/PropertyDetailPage";
import AddPropertyPage from "@/components/AddPropertyPage";
import UsersPage from "@/components/UsersPage";
import ComponentsPage from "@/components/ComponentsPage";

type View =
  | "dashboard" | "properties" | "property-detail" | "add-property"
  | "contacts" | "add-contact" | "contact-detail"
  | "agencies" | "users" | "company" | "settings" | "components"
  | "loc-countries" | "loc-provinces" | "loc-towns" | "loc-town-detail" | "loc-zone-form";

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex-1 overflow-auto">
    <div className="px-4 sm:px-8 pt-8 pb-6">
      <h1 className="text-2xl font-semibold text-foreground tracking-tight">{title}</h1>
      <p className="text-sm text-muted-foreground mt-1">Esta sección se configurará próximamente</p>
    </div>
    <div className="px-4 sm:px-8">
      <div className="rounded-xl border border-dashed border-border bg-card/50 h-64 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Contenido próximamente</p>
      </div>
    </div>
  </div>
);

const Index = () => {
  const [view, setView] = useState<View>("properties");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState<string>("1");

  // Location drill-down state
  const [locCountryId, setLocCountryId] = useState<string>("");
  const [locProvinceId, setLocProvinceId] = useState<string>("");
  const [locTownId, setLocTownId] = useState<string>("");
  const [locZoneId, setLocZoneId] = useState<string | null>(null);

  const sidebarView = (() => {
    if (["add-contact", "contact-detail"].includes(view)) return "contacts";
    if (["property-detail", "add-property"].includes(view)) return "properties";
    if (view.startsWith("loc-")) return "locations";
    return view;
  })();

  const handleViewContact = (id: string) => {
    setSelectedContactId(id);
    setView("contact-detail");
  };

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
        {view === "contacts" && <ContactsListPage onAddContact={() => setView("add-contact")} onViewContact={handleViewContact} />}
        {view === "add-contact" && <AddContactPage onBack={() => setView("contacts")} />}
        {view === "contact-detail" && <ContactDetailPage contactId={selectedContactId} onBack={() => setView("contacts")} onEdit={() => setView("add-contact")} />}
        {view === "agencies" && <PlaceholderPage title="Agencias" />}

        {/* Location drill-down */}
        {view === "loc-countries" && (
          <CountriesPage
            onSelectCountry={(id) => { setLocCountryId(id); setView("loc-provinces"); }}
            onAddCountry={() => {}}
            onEditCountry={() => {}}
          />
        )}
        {view === "loc-provinces" && (
          <ProvincesPage
            countryId={locCountryId}
            onBack={() => setView("loc-countries")}
            onSelectProvince={(id) => { setLocProvinceId(id); setView("loc-towns"); }}
            onEditProvince={() => {}}
          />
        )}
        {view === "loc-towns" && (
          <TownsPage
            countryId={locCountryId}
            provinceId={locProvinceId}
            onBackToCountries={() => setView("loc-countries")}
            onBackToProvinces={() => setView("loc-provinces")}
            onSelectTown={(id) => { setLocTownId(id); setView("loc-town-detail"); }}
            onEditTown={() => {}}
          />
        )}
        {view === "loc-town-detail" && (
          <TownDetailPage
            countryId={locCountryId}
            provinceId={locProvinceId}
            townId={locTownId}
            onBackToCountries={() => setView("loc-countries")}
            onBackToProvinces={() => setView("loc-provinces")}
            onBackToTowns={() => setView("loc-towns")}
            onEditZone={(zoneId) => { setLocZoneId(zoneId); setView("loc-zone-form"); }}
            onAddZone={() => { setLocZoneId(null); setView("loc-zone-form"); }}
          />
        )}
        {view === "loc-zone-form" && (
          <ZoneFormPage
            countryId={locCountryId}
            provinceId={locProvinceId}
            townId={locTownId}
            zoneId={locZoneId}
            onBackToCountries={() => setView("loc-countries")}
            onBackToProvinces={() => setView("loc-provinces")}
            onBackToTowns={() => setView("loc-towns")}
            onBackToTownDetail={() => setView("loc-town-detail")}
          />
        )}

        {view === "components" && <ComponentsPage />}
        {view === "users" && <UsersPage />}
        {view === "company" && <PlaceholderPage title="Empresa" />}
        {view === "settings" && <PlaceholderPage title="Ajustes" />}
      </div>
    </div>
  );
};

export default Index;
