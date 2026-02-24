import { Search, Plus, Phone, Mail, Eye, Shield, Globe } from "lucide-react";

interface UserCard {
  id: number;
  name: string;
  role: string;
  phone: string;
  email: string;
  userRole: string;
  status: string;
  visible: boolean;
  initials: string;
  languages: string[];
}

const languageFlags: Record<string, string> = {
  ES: "🇪🇸",
  EN: "🇬🇧",
  FR: "🇫🇷",
  DE: "🇩🇪",
  RU: "🇷🇺",
  PT: "🇵🇹",
};

const groups: { title: string; users: UserCard[] }[] = [
  {
    title: "Leadership & Management",
    users: [
      { id: 1, name: "Aura Beltrán", role: "New-Build Manager", phone: "+34 688 928 822", email: "aura@luxinmo.com", userRole: "Seller", status: "Active", visible: true, initials: "AB", languages: ["ES", "EN"] },
      { id: 2, name: "Carlos Mendoza", role: "Founder & CEO", phone: "+34 612 345 678", email: "carlos@realestate.com", userRole: "Owner", status: "Active", visible: true, initials: "CM", languages: ["ES", "EN", "FR"] },
    ],
  },
  {
    title: "Sales & Commercial",
    users: [
      { id: 3, name: "José Manuel Gil", role: "Rental Agent", phone: "+34 655 123 456", email: "jose@luxinmo.com", userRole: "Administrator", status: "Active", visible: false, initials: "JG", languages: ["ES", "FR"] },
      { id: 4, name: "Laura Sánchez", role: "Listing Agent", phone: "+34 678 901 234", email: "laura@luxinmo.com", userRole: "Administrator", status: "Active", visible: false, initials: "LS", languages: ["ES", "EN", "DE"] },
    ],
  },
  {
    title: "Support & Specialists",
    users: [
      { id: 5, name: "Miguel Torres", role: "Receptionist", phone: "+34 691 234 567", email: "miguel@luxinmo.com", userRole: "Administrator", status: "Active", visible: true, initials: "MT", languages: ["ES", "EN", "DE"] },
    ],
  },
];

const statusColor = "bg-emerald-50 text-emerald-600 border-emerald-200";

const UsersPage = () => {
  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <div className="px-8 pt-8 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">Usuarios</h1>
            <p className="text-sm text-muted-foreground mt-1">Gestión de miembros del equipo</p>
          </div>
        </div>
      </div>

      {/* Search + Add */}
      <div className="px-8 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 w-80 shadow-card">
          <Search className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
          <span className="text-[13px] text-muted-foreground">Search from list</span>
        </div>
        <button className="flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-[13px] font-medium text-primary-foreground hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4" /> Add new member
        </button>
      </div>

      {/* Groups */}
      <div className="px-8 pb-10 space-y-8">
        {groups.map((group) => (
          <div key={group.title}>
            <h2 className="text-base font-semibold text-foreground mb-4">{group.title}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {group.users.map((user) => (
                <div
                  key={user.id}
                  className="rounded-xl border border-border bg-card shadow-card p-5 hover:shadow-elevated transition-shadow"
                >
                  {/* Top row: avatar + info + visibility */}
                  <div className="flex gap-4">
                    {/* Avatar placeholder */}
                    <div className="h-20 w-20 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <span className="text-lg font-semibold text-muted-foreground">{user.initials}</span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-[15px] font-semibold text-foreground">{user.name}</h3>
                          <p className="text-[13px] text-muted-foreground">{user.role}</p>
                        </div>
                        <span
                          className={`flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${
                            user.visible
                              ? "bg-card text-foreground border-border"
                              : "bg-muted text-muted-foreground border-border"
                          }`}
                        >
                          <Eye className="h-3 w-3" strokeWidth={1.5} />
                          {user.visible ? "Visible on profile" : "Not visible on profile"}
                        </span>
                      </div>

                      {/* Language flags */}
                      <div className="flex items-center gap-1 mt-2">
                        {user.languages.map((lang) => (
                          <span key={lang} className="text-base" title={lang}>
                            {languageFlags[lang]}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom row: contact + role + status */}
                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between flex-wrap gap-y-2">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                        <Phone className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                        {user.phone}
                      </div>
                      <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                        <Mail className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                        {user.email}
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <span className="text-[11px] text-muted-foreground block">Role</span>
                        <span className="flex items-center gap-1 text-[13px] font-medium text-foreground mt-0.5">
                          <Shield className="h-3.5 w-3.5" strokeWidth={1.5} />
                          {user.userRole}
                        </span>
                      </div>
                      <div className="text-center">
                        <span className="text-[11px] text-muted-foreground block">Status</span>
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold mt-0.5 ${statusColor}`}>
                          {user.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersPage;
