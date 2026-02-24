import { Building2, Users, Home, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

interface AppSidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const AppSidebar = ({ currentView, onNavigate }: AppSidebarProps) => {
  const [templateOpen, setTemplateOpen] = useState(true);

  return (
    <aside className="flex w-56 flex-col border-r border-sidebar-custom-border bg-sidebar-custom-bg shrink-0">
      {/* Brand */}
      <div className="flex h-14 items-center gap-2.5 border-b border-sidebar-custom-border px-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
          <Building2 className="h-3.5 w-3.5 text-primary-foreground" />
        </div>
        <span className="text-[13px] font-semibold tracking-tight text-sidebar-custom-fg-active">
          RealEstateOS
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <button
          onClick={() => setTemplateOpen(!templateOpen)}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-sidebar-custom-fg-active hover:bg-sidebar-custom-hover transition-colors"
        >
          <Building2 className="h-4 w-4 shrink-0" strokeWidth={1.5} />
          <span className="flex-1 text-left">Template 1</span>
          {templateOpen ? (
            <ChevronDown className="h-3.5 w-3.5 text-sidebar-custom-fg" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 text-sidebar-custom-fg" />
          )}
        </button>

        {templateOpen && (
          <div className="ml-4 pl-3 border-l border-sidebar-custom-border space-y-0.5">
            <button
              onClick={() => onNavigate("contacts")}
              className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-all ${
                currentView === "contacts" || currentView === "add-contact"
                  ? "bg-sidebar-custom-active text-sidebar-custom-fg-active"
                  : "text-sidebar-custom-fg hover:bg-sidebar-custom-hover"
              }`}
            >
              <Users className="h-4 w-4 shrink-0" strokeWidth={1.5} />
              <span>Listado de contactos</span>
            </button>
            <button
              onClick={() => onNavigate("properties")}
              className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-all ${
                currentView === "properties"
                  ? "bg-sidebar-custom-active text-sidebar-custom-fg-active"
                  : "text-sidebar-custom-fg hover:bg-sidebar-custom-hover"
              }`}
            >
              <Home className="h-4 w-4 shrink-0" strokeWidth={1.5} />
              <span>Propiedades</span>
            </button>
          </div>
        )}
      </nav>

      <div className="border-t border-sidebar-custom-border px-5 py-3">
        <p className="text-[10px] font-medium text-sidebar-custom-fg/50 uppercase tracking-widest">Design Preview · v1.0</p>
      </div>
    </aside>
  );
};

export default AppSidebar;
