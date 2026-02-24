import AppSidebar from "@/components/AppSidebar";
import HeaderBar from "@/components/HeaderBar";
import TemplatesPage from "@/components/TemplatesPage";

const Index = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AppSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <HeaderBar />
        <TemplatesPage />
      </div>
    </div>
  );
};

export default Index;
