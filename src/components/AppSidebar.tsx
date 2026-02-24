import { LayoutGrid, Building2, FileText, Settings, Search, ChevronLeft, Menu } from "lucide-react";
import { useState } from "react";

const menuItems = [
  { icon: LayoutGrid, label: "Overview", active: false },
  { icon: Building2, label: "Properties", active: false },
  { icon: FileText, label: "Templates", active: true },
  { icon: Settings, label: "Settings", active: false },
];

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const AppSidebar = ({ collapsed, onToggle }: AppSidebarProps) => {
  return (
    <aside
      className={`sidebar-base flex flex-col border-r border-sidebar-border transition-all duration-300 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Logo */}
      <div className="flex h-14 items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <span className="text-sm font-semibold tracking-wide text-sidebar-fg-active">
            RealEstateOS
          </span>
        )}
        <button
          onClick={onToggle}
          className="flex h-7 w-7 items-center justify-center rounded-md text-sidebar-fg hover:text-sidebar-fg-active hover:sidebar-item-hover transition-colors"
        >
          {collapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-1">
        {menuItems.map((item) => (
          <div
            key={item.label}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-default ${
              item.active
                ? "sidebar-item-active"
                : "text-sidebar-fg opacity-60"
            }`}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      {!collapsed && (
        <div className="border-t border-sidebar-border px-4 py-3">
          <p className="text-[11px] text-sidebar-fg/40">v1.0 · Design Preview</p>
        </div>
      )}
    </aside>
  );
};

export default AppSidebar;
