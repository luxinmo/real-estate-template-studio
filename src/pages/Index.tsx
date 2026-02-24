import { useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import HeaderBar from "@/components/HeaderBar";
import ContactsListPage from "@/components/ContactsListPage";
import AddContactPage from "@/components/AddContactPage";

type View = "contacts" | "add-contact";

const Index = () => {
  const [view, setView] = useState<View>("contacts");

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AppSidebar currentView="contacts" onNavigate={() => setView("contacts")} />
      <div className="flex flex-1 flex-col min-w-0">
        <HeaderBar />
        {view === "contacts" && (
          <ContactsListPage onAddContact={() => setView("add-contact")} />
        )}
        {view === "add-contact" && (
          <AddContactPage onBack={() => setView("contacts")} />
        )}
      </div>
    </div>
  );
};

export default Index;
