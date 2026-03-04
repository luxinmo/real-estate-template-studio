import { Building2, LayoutGrid, Home, Users, Building, UserCircle, Briefcase, Settings, X, Component, MapPin, FileDown, FolderClock, Timer, AlertTriangle, CreditCard, Globe, FileText, BookOpen, BarChart3 } from "lucide-react";

const topItems = [
  { icon: LayoutGrid, label: "Dashboard", view: "dashboard" },
  { icon: Home, label: "Propiedades", view: "properties" },
  { icon: Users, label: "Contactos", view: "contacts" },
  { icon: Building, label: "Agencias", view: "agencies" },
  { icon: BarChart3, label: "Analytics", view: "analytics" },
  { icon: MapPin, label: "Locations", view: "locations" },
  { icon: Component, label: "Componentes", view: "components" },
  { icon: CreditCard, label: "Card Designer", view: "card-designer" },
];

const webItems = [
  { icon: FileText, label: "Páginas", view: "cms-pages" },
  { icon: BookOpen, label: "Blog", view: "cms-blog" },
];

const importerItems = [
  { icon: FileDown, label: "Fuentes", view: "imp-fuentes" },
  { icon: FolderClock, label: "Historial", view: "imp-historial" },
  { icon: Timer, label: "Programador", view: "imp-scheduler" },
  { icon: AlertTriangle, label: "Pendientes", view: "imp-pendientes", badge: 19 },
];

const bottomItems = [
  { icon: UserCircle, label: "Usuarios", view: "users" },
  { icon: Briefcase, label: "Empresa", view: "company" },
  { icon: Settings, label: "Ajustes", view: "settings" },
];

interface AppSidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  open: boolean;
  onClose: () => void;
}

const AppSidebar = ({ currentView, onNavigate, open, onClose }: AppSidebarProps) => {
  const handleNav = (view: string) => {
    onNavigate(view);
    onClose();
  };

  const renderItem = (item: { icon: any; label: string; view: string }) => {
    const isActive = currentView === item.view;
    return (
      <button
        key={item.label}
        onClick={() => handleNav(item.view)}
        className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-all ${
          isActive
            ? "bg-sidebar-custom-active text-sidebar-custom-fg-active"
            : "text-sidebar-custom-fg hover:bg-sidebar-custom-hover"
        }`}
      >
        <item.icon className="h-4 w-4 shrink-0" strokeWidth={isActive ? 2 : 1.5} />
        <span>{item.label}</span>
      </button>
    );
  };

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-56 flex-col border-r border-sidebar-custom-border bg-sidebar-custom-bg
          transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0 lg:z-auto
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Brand */}
        <div className="flex h-14 items-center justify-between border-b border-sidebar-custom-border px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <Building2 className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="text-[13px] font-semibold tracking-tight text-sidebar-custom-fg-active">
              RealEstateOS
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-sidebar-custom-fg hover:bg-sidebar-custom-hover lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {topItems.map(renderItem)}
          <div className="!my-3 mx-3 border-t border-sidebar-custom-border" />
          <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-sidebar-custom-fg/50">Importador</p>
          {importerItems.map(item => {
            const isActive = currentView === item.view;
            return (
              <button
                key={item.label}
                onClick={() => handleNav(item.view)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-all ${
                  isActive
                    ? "bg-sidebar-custom-active text-sidebar-custom-fg-active"
                    : "text-sidebar-custom-fg hover:bg-sidebar-custom-hover"
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" strokeWidth={isActive ? 2 : 1.5} />
                <span className="flex-1 text-left">{item.label}</span>
                {"badge" in item && item.badge ? (
                  <span className="flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-amber-500 px-1.5 text-[10px] font-bold text-white">{item.badge}</span>
                ) : null}
              </button>
            );
          })}
          <div className="!my-3 mx-3 border-t border-sidebar-custom-border" />
          <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-sidebar-custom-fg/50">Web / CMS</p>
          {webItems.map(renderItem)}
          <div className="!my-3 mx-3 border-t border-sidebar-custom-border" />
          {bottomItems.map(renderItem)}
        </nav>

        <div className="border-t border-sidebar-custom-border px-5 py-3">
          <p className="text-[10px] font-medium text-sidebar-custom-fg/50 uppercase tracking-widest">Design Preview · v1.0</p>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
