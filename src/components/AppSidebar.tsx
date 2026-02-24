import { LayoutGrid, Building2, FileText, Users, Settings } from "lucide-react";

const menuItems = [
  { icon: LayoutGrid, label: "Overview", active: false },
  { icon: Building2, label: "Properties", active: false },
  { icon: FileText, label: "Templates", active: true },
  { icon: Users, label: "Contacts", active: false },
  { icon: Settings, label: "Settings", active: false },
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

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {menuItems.map((item) => (
          <div
            key={item.label}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-all cursor-default ${
              item.active
                ? "bg-sidebar-custom-active text-sidebar-custom-fg-active border-l-2 border-sidebar-custom-active-border -ml-px"
                : "text-sidebar-custom-fg hover:bg-sidebar-custom-hover"
            }`}
          >
            <item.icon className={`h-4 w-4 shrink-0 ${item.active ? "text-sidebar-custom-fg-active" : ""}`} strokeWidth={item.active ? 2 : 1.5} />
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-custom-border px-5 py-3">
        <p className="text-[10px] font-medium text-sidebar-custom-fg/50 uppercase tracking-widest">Design Preview · v1.0</p>
      </div>
    </aside>
  );
};

export default AppSidebar;
