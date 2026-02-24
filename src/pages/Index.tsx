import { useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import HeaderBar from "@/components/HeaderBar";
import { ContactsListPage, AddContactPage, ContactDetailPage } from "@/components/contacts";
import { LocationsPage, LocationDetailPage } from "@/components/locations";
import { LocationNode, LocationLevel, PARENT_LEVEL } from "@/components/locations/types";
import { mockLocations } from "@/components/locations/mock-data";
import PropertiesPage from "@/components/PropertiesPage";
import PropertyDetailPage from "@/components/PropertyDetailPage";
import AddPropertyPage from "@/components/AddPropertyPage";
import UsersPage from "@/components/UsersPage";
import ComponentsPage from "@/components/ComponentsPage";

type View = "dashboard" | "properties" | "property-detail" | "add-property" | "contacts" | "add-contact" | "contact-detail" | "agencies" | "users" | "company" | "settings" | "components" | "locations" | "location-detail";

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
  const [editingLocation, setEditingLocation] = useState<LocationNode | null>(null);
  const [locationFormParentId, setLocationFormParentId] = useState<string | null>(null);
  const [locationFormLevel, setLocationFormLevel] = useState<LocationLevel>("country");

  const sidebarView = ["add-contact", "contact-detail"].includes(view) ? "contacts" : (["property-detail", "add-property", "location-detail"].includes(view) ? (view === "location-detail" ? "locations" : "properties") : view);

  const handleViewContact = (id: string) => {
    setSelectedContactId(id);
    setView("contact-detail");
  };

  const parentNode = locationFormParentId ? mockLocations.find((l) => l.id === locationFormParentId) : null;

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AppSidebar currentView={sidebarView} onNavigate={(v) => setView(v as View)}
        open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
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
        {view === "locations" && (
          <LocationsPage
            onAdd={(parentId, level) => {
              setEditingLocation(null);
              setLocationFormParentId(parentId);
              setLocationFormLevel(level as LocationLevel);
              setView("location-detail");
            }}
            onEdit={(loc) => {
              setEditingLocation(loc);
              setLocationFormLevel(loc.level);
              setLocationFormParentId(loc.parentId);
              setView("location-detail");
            }}
          />
        )}
        {view === "location-detail" && (
          <LocationDetailPage
            location={editingLocation}
            parentName={parentNode?.name}
            parentLevel={parentNode ? parentNode.level : null}
            level={locationFormLevel}
            onBack={() => setView("locations")}
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
