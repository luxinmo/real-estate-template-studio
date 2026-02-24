import { Search, Plus, Mail, Phone, Building, User, Tag, StickyNote } from "lucide-react";
import ComponentBlock from "@/components/ComponentBlock";

const contacts = [
  { name: "Sarah Johnson", email: "sarah@example.com", phone: "+1 (555) 123-4567", status: "Client", source: "Website" },
  { name: "Michael Chen", email: "michael@example.com", phone: "+1 (555) 987-6543", status: "Lead", source: "Referral" },
  { name: "Emily Davis", email: "emily@example.com", phone: "+1 (555) 456-7890", status: "Investor", source: "LinkedIn" },
  { name: "Robert Wilson", email: "robert@example.com", phone: "+1 (555) 321-0987", status: "Lead", source: "Open House" },
];

const statusColors: Record<string, string> = {
  Client: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Lead: "bg-amber-50 text-amber-700 border-amber-200",
  Investor: "bg-blue-50 text-blue-700 border-blue-200",
};

const TemplateContacts = () => {
  return (
    <div className="space-y-8">
      {/* Contact Filters Bar */}
      <ComponentBlock label="Component: Contact Filters Bar">
        <div className="px-5 py-4 flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 flex-1 min-w-[200px]">
            <Search className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
            <span className="text-[13px] text-muted-foreground">Search contacts...</span>
          </div>
          <div className="flex items-center gap-2">
            {["All", "Lead", "Client", "Investor"].map((tag) => (
              <span
                key={tag}
                className={`rounded-full border px-3 py-1 text-[11px] font-medium cursor-default ${
                  tag === "All"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:bg-accent"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
          <button className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[13px] font-medium text-primary-foreground ml-auto">
            <Plus className="h-3.5 w-3.5" /> Add Contact
          </button>
        </div>
      </ComponentBlock>

      {/* Contacts Table */}
      <ComponentBlock label="Component: Contacts Table">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Name</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Email</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Phone</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Source</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-[10px] font-semibold text-muted-foreground">
                          {c.name.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                      <span className="text-[13px] font-medium text-foreground">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-muted-foreground">{c.email}</td>
                  <td className="px-5 py-3.5 text-[13px] text-muted-foreground">{c.phone}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${statusColors[c.status]}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-muted-foreground">{c.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ComponentBlock>

      {/* Create Contact Form */}
      <ComponentBlock label="Component: Create Contact Form">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { label: "Full Name", placeholder: "Enter full name", icon: User },
              { label: "Email", placeholder: "email@example.com", icon: Mail },
              { label: "Phone", placeholder: "+1 (555) 000-0000", icon: Phone },
              { label: "Company", placeholder: "Company name", icon: Building },
              { label: "Source", placeholder: "e.g. Website, Referral", icon: Tag },
              { label: "Status", placeholder: "Lead / Client / Investor", icon: Tag },
            ].map((field) => (
              <div key={field.label}>
                <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">{field.label}</label>
                <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5">
                  <field.icon className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
                  <span className="text-[13px] text-muted-foreground/60">{field.placeholder}</span>
                </div>
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Notes</label>
              <div className="flex items-start gap-2 rounded-lg border border-border bg-background px-3 py-2.5 min-h-[80px]">
                <StickyNote className="h-3.5 w-3.5 text-muted-foreground mt-0.5" strokeWidth={1.5} />
                <span className="text-[13px] text-muted-foreground/60">Additional notes...</span>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-5">
            <button className="rounded-lg bg-primary px-6 py-2.5 text-[13px] font-medium text-primary-foreground">
              Create Contact
            </button>
          </div>
        </div>
      </ComponentBlock>

      {/* Contact Profile Card */}
      <ComponentBlock label="Component: Contact Profile Card">
        <div className="p-6">
          <div className="max-w-sm rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <span className="text-sm font-semibold text-muted-foreground">SJ</span>
              </div>
              <div>
                <h4 className="text-[14px] font-semibold text-foreground">Sarah Johnson</h4>
                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium mt-0.5 ${statusColors.Client}`}>
                  Client
                </span>
              </div>
            </div>
            <div className="space-y-2.5 text-[13px]">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-3.5 w-3.5" strokeWidth={1.5} /> sarah@example.com
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-3.5 w-3.5" strokeWidth={1.5} /> +1 (555) 123-4567
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building className="h-3.5 w-3.5" strokeWidth={1.5} /> Johnson Real Estate Group
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-[11px] text-muted-foreground">
                <span className="font-medium">Source:</span> Website · <span className="font-medium">Added:</span> Jan 15, 2025
              </p>
            </div>
          </div>
        </div>
      </ComponentBlock>
    </div>
  );
};

export default TemplateContacts;
