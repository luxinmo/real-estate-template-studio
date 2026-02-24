import { useState } from "react";
import { Search, Plus, Mail, Phone, Building, MoreHorizontal, Eye } from "lucide-react";

const demoContacts = [
  { id: 1, name: "Carlos Martínez", email: "carlos@realestate.com", phone: "+34 612 345 678", company: "Inmobiliaria Martínez", status: "Cliente", source: "Web" },
  { id: 2, name: "Ana García López", email: "ana.garcia@gmail.com", phone: "+34 655 123 456", company: "García Inversiones", status: "Lead", source: "Referido" },
  { id: 3, name: "Roberto Fernández", email: "r.fernandez@outlook.com", phone: "+34 678 901 234", company: "Fernández & Asociados", status: "Inversor", source: "LinkedIn" },
  { id: 4, name: "Laura Sánchez Ruiz", email: "laura.sanchez@mail.com", phone: "+34 634 567 890", company: "LS Properties", status: "Cliente", source: "Open House" },
  { id: 5, name: "Miguel Ángel Torres", email: "m.torres@empresa.es", phone: "+34 691 234 567", company: "Torres Capital", status: "Lead", source: "Web" },
];

const statusColors: Record<string, string> = {
  Cliente: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Lead: "bg-amber-50 text-amber-700 border-amber-200",
  Inversor: "bg-blue-50 text-blue-700 border-blue-200",
};

interface ContactsListPageProps {
  onAddContact: () => void;
}

const ContactsListPage = ({ onAddContact }: ContactsListPageProps) => {
  const [filter, setFilter] = useState("Todos");
  const tags = ["Todos", "Lead", "Cliente", "Inversor"];

  const filtered = filter === "Todos"
    ? demoContacts
    : demoContacts.filter((c) => c.status === filter);

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <div className="px-8 pt-8 pb-6">
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">Listado de Contactos</h1>
        <p className="text-sm text-muted-foreground mt-1">Gestiona tus contactos de clientes e inversores</p>
      </div>

      <div className="px-8 pb-10 space-y-5">
        {/* Filters + Add button */}
        <div className="rounded-xl border border-border bg-card shadow-card">
          <div className="px-5 py-4 flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 flex-1 min-w-[200px]">
              <Search className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
              <span className="text-[13px] text-muted-foreground">Buscar contactos...</span>
            </div>
            <div className="flex items-center gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setFilter(tag)}
                  className={`rounded-full border px-3 py-1 text-[11px] font-medium transition-colors ${
                    filter === tag
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:bg-accent"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            <button
              onClick={onAddContact}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[13px] font-medium text-primary-foreground hover:opacity-90 transition-opacity ml-auto"
            >
              <Plus className="h-3.5 w-3.5" /> Añadir Cliente
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-background/50">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Nombre</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Email</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Teléfono</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Empresa</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Estado</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Fuente</th>
                  <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-semibold text-muted-foreground">
                            {c.name.split(" ").slice(0, 2).map((n) => n[0]).join("")}
                          </span>
                        </div>
                        <span className="text-[13px] font-medium text-foreground">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
                        <Mail className="h-3 w-3 shrink-0" strokeWidth={1.5} />
                        {c.email}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
                        <Phone className="h-3 w-3 shrink-0" strokeWidth={1.5} />
                        {c.phone}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
                        <Building className="h-3 w-3 shrink-0" strokeWidth={1.5} />
                        {c.company}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${statusColors[c.status]}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-muted-foreground">{c.source}</td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors">
                          <Eye className="h-3.5 w-3.5" strokeWidth={1.5} />
                        </button>
                        <button className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors">
                          <MoreHorizontal className="h-3.5 w-3.5" strokeWidth={1.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Footer */}
          <div className="px-5 py-3 border-t border-border bg-background/30 flex items-center justify-between">
            <span className="text-[12px] text-muted-foreground">{filtered.length} contactos</span>
            <span className="text-[12px] text-muted-foreground">Página 1 de 1</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactsListPage;
