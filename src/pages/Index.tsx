import { useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import HeaderBar from "@/components/HeaderBar";
import TemplatesPage from "@/components/TemplatesPage";

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AppSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex flex-1 flex-col min-w-0">
        <HeaderBar />
        <TemplatesPage />
      </div>
    </div>
  );
};

export default Index;
