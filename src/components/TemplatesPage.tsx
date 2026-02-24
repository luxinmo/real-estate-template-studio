import { useState } from "react";
import { ArrowLeft, Building2, Users } from "lucide-react";
import TemplateRealEstate from "@/components/TemplateRealEstate";
import TemplateContacts from "@/components/TemplateContacts";

type View = "grid" | "real-estate" | "contacts";

const templates = [
  {
    id: "real-estate" as const,
    title: "Template 1 – Real Estate",
    description: "Property cards, catalogs, filter bars, and listing components",
    icon: Building2,
    blocks: 6,
    primary: true,
  },
  {
    id: "contacts" as const,
    title: "Template 2.1 – Contacts",
    description: "Contact list, filters, create form, and profile card",
    icon: Users,
    blocks: 4,
    primary: false,
  },
];

const TemplatesPage = () => {
  const [view, setView] = useState<View>("grid");

  return (
    <div className="flex-1 overflow-auto">
      <div className="px-8 pt-8 pb-6">
        {view !== "grid" && (
          <button
            onClick={() => setView("grid")}
            className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Templates
          </button>
        )}
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">Templates</h1>
        <p className="text-sm text-muted-foreground mt-1">Reusable UI components for Real Estate CRM</p>
      </div>

      <div className="px-8 pb-10">
        {view === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => setView(t.id)}
                className="rounded-xl border border-border bg-card p-6 text-left shadow-card hover:shadow-elevated hover:border-foreground/10 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                    <t.icon className="h-5 w-5 text-foreground" strokeWidth={1.5} />
                  </div>
                  {t.primary && (
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                      Primary
                    </span>
                  )}
                </div>
                <h3 className="text-[15px] font-semibold text-foreground group-hover:text-foreground">{t.title}</h3>
                <p className="text-[13px] text-muted-foreground mt-1">{t.description}</p>
                <p className="text-[11px] text-muted-foreground/60 mt-3">{t.blocks} design blocks</p>
              </button>
            ))}
          </div>
        )}

        {view === "real-estate" && <TemplateRealEstate />}
        {view === "contacts" && <TemplateContacts />}
      </div>
    </div>
  );
};

export default TemplatesPage;
