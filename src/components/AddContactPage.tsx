import { ArrowLeft, User, Mail, Phone, Building, Tag, StickyNote, X } from "lucide-react";

interface AddContactPageProps {
  onBack: () => void;
}

const AddContactPage = ({ onBack }: AddContactPageProps) => {
  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <div className="px-8 pt-8 pb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Volver al listado
        </button>
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">Añadir Cliente</h1>
        <p className="text-sm text-muted-foreground mt-1">Completa los datos del nuevo contacto</p>
      </div>

      <div className="px-8 pb-10">
        <div className="max-w-2xl rounded-xl border border-border bg-card shadow-card overflow-hidden">
          <div className="p-6 space-y-5">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Nombre completo *
                </label>
                <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5 focus-within:ring-1 focus-within:ring-ring transition-shadow">
                  <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" strokeWidth={1.5} />
                  <input
                    type="text"
                    placeholder="Ej: María López García"
                    className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground/50 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Email *
                </label>
                <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5 focus-within:ring-1 focus-within:ring-ring transition-shadow">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" strokeWidth={1.5} />
                  <input
                    type="email"
                    placeholder="email@ejemplo.com"
                    className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground/50 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Teléfono
                </label>
                <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5 focus-within:ring-1 focus-within:ring-ring transition-shadow">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" strokeWidth={1.5} />
                  <input
                    type="tel"
                    placeholder="+34 600 000 000"
                    className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground/50 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Empresa
                </label>
                <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5 focus-within:ring-1 focus-within:ring-ring transition-shadow">
                  <Building className="h-3.5 w-3.5 text-muted-foreground shrink-0" strokeWidth={1.5} />
                  <input
                    type="text"
                    placeholder="Nombre de la empresa"
                    className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground/50 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Estado *
                </label>
                <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5">
                  <Tag className="h-3.5 w-3.5 text-muted-foreground shrink-0" strokeWidth={1.5} />
                  <select className="flex-1 bg-transparent text-[13px] text-foreground outline-none appearance-none cursor-pointer">
                    <option value="">Seleccionar estado</option>
                    <option value="Lead">Lead</option>
                    <option value="Cliente">Cliente</option>
                    <option value="Inversor">Inversor</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Fuente
                </label>
                <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5">
                  <Tag className="h-3.5 w-3.5 text-muted-foreground shrink-0" strokeWidth={1.5} />
                  <select className="flex-1 bg-transparent text-[13px] text-foreground outline-none appearance-none cursor-pointer">
                    <option value="">Seleccionar fuente</option>
                    <option value="Web">Web</option>
                    <option value="Referido">Referido</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Open House">Open House</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                Notas
              </label>
              <div className="flex items-start gap-2 rounded-lg border border-border bg-background px-3 py-2.5 focus-within:ring-1 focus-within:ring-ring transition-shadow">
                <StickyNote className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" strokeWidth={1.5} />
                <textarea
                  rows={3}
                  placeholder="Notas adicionales sobre el contacto..."
                  className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground/50 outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 border-t border-border bg-background/30 flex items-center justify-end gap-3">
            <button
              onClick={onBack}
              className="rounded-lg border border-border px-5 py-2.5 text-[13px] font-medium text-foreground hover:bg-accent transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onBack}
              className="rounded-lg bg-primary px-6 py-2.5 text-[13px] font-medium text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Guardar Cliente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddContactPage;
