import AppSidebar from "@/components/AppSidebar";
import HeaderBar from "@/components/HeaderBar";

const Index = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AppSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <HeaderBar />
        <div className="flex-1" />
      </div>
    </div>
  );
};

export default Index;
