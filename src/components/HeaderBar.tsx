import { Search, Bell } from "lucide-react";

const HeaderBar = () => {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-6">
      {/* Search */}
      <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-1.5 w-72">
        <Search className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Search templates...</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary transition-colors">
          <Bell className="h-4 w-4" />
        </button>
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
          <span className="text-xs font-medium text-primary-foreground">JD</span>
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;
