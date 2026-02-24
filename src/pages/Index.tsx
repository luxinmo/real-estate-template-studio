import { useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import HeaderBar from "@/components/HeaderBar";
import ContactsListPage from "@/components/ContactsListPage";
import AddContactPage from "@/components/AddContactPage";
import PropertiesPage from "@/components/PropertiesPage";

type View = "contacts" | "add-contact" | "properties";

const Index = () => {
  const [view, setView] = useState<View>("contacts");

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AppSidebar currentView={view} onNavigate={(v) => setView(v as View)} />
      <div className="flex flex-1 flex-col min-w-0">
        <HeaderBar />
        {view === "contacts" && (
          <ContactsListPage onAddContact={() => setView("add-contact")} />
        )}
        {view === "add-contact" && (
          <AddContactPage onBack={() => setView("contacts")} />
        )}
        {view === "properties" && <PropertiesPage />}
      </div>
    </div>
  );
};

export default Index;
