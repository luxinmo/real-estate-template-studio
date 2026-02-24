import { Building2, LayoutGrid, Home, Users, Building, UserCircle, Briefcase, Settings } from "lucide-react";

const topItems = [
  { icon: LayoutGrid, label: "Dashboard" },
  { icon: Home, label: "Propiedades" },
  { icon: Users, label: "Contactos" },
  { icon: Building, label: "Agencias" },
];

const bottomItems = [
  { icon: UserCircle, label: "Usuarios" },
  { icon: Briefcase, label: "Empresa" },
  { icon: Settings, label: "Ajustes" },
];

const AppSidebar = () => {
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

      {/* Top nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {topItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-sidebar-custom-fg cursor-default"
          >
            <item.icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
            <span>{item.label}</span>
          </div>
        ))}

        {/* Separator */}
        <div className="!my-3 mx-3 border-t border-sidebar-custom-border" />

        {bottomItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-sidebar-custom-fg cursor-default"
          >
            <item.icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-custom-border px-5 py-3">
        <p className="text-[10px] font-medium text-sidebar-custom-fg/50 uppercase tracking-widest">Design Preview · v1.0</p>
      </div>
    </aside>
  );
};

export default AppSidebar;
