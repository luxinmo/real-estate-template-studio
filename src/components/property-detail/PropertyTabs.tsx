interface PropertyTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "main", label: "Main data" },
  { id: "multimedia", label: "Multimedia" },
  { id: "description", label: "Description" },
  { id: "features", label: "Features" },
  { id: "details", label: "Details" },
];

const PropertyTabs = ({ activeTab, onTabChange }: PropertyTabsProps) => (
  <div className="border-b border-border">
    <div className="flex gap-0">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-3 text-[14px] font-medium transition-colors border-b-2 ${
            activeTab === tab.id
              ? "text-primary border-primary"
              : "text-muted-foreground border-transparent hover:text-foreground"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  </div>
);

export default PropertyTabs;
