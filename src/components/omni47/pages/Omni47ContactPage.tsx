import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Check } from "lucide-react";
import type { Omni47ContactPageProps, ContactFormData } from "../types";

const Omni47ContactPage = ({
  heroTitle,
  heroSubtitle,
  formTitle,
  subjectOptions,
  offices,
  onSubmit,
}: Omni47ContactPageProps) => {
  const [form, setForm] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    offices: offices.length > 0 ? [offices[0].id] : [],
  });

  const toggleOffice = (id: string) => {
    setForm((prev) => ({
      ...prev,
      offices: prev.offices.includes(id)
        ? prev.offices.length > 1
          ? prev.offices.filter((o) => o !== id)
          : prev.offices
        : [...prev.offices, id],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(form);
  };

  return (
    <div className="min-h-screen bg-omni47-cream pt-16 lg:pt-20">
      {/* Hero */}
      <div className="bg-omni47-navy py-20 lg:py-28 text-center">
        <h1 className="font-cormorant text-[36px] lg:text-[56px] font-extralight text-white">
          {heroTitle}
        </h1>
        <p className="mt-3 text-[14px] font-light text-white/60 max-w-xl mx-auto">
          {heroSubtitle}
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-5 lg:px-8 py-14 lg:py-20">
        {/* Form */}
        <h2 className="font-cormorant text-[28px] font-light text-omni47-navy mb-8 text-center">
          {formTitle}
        </h2>

        {/* Office selection */}
        {offices.length > 1 && (
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {offices.map((o) => {
              const sel = form.offices.includes(o.id);
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => toggleOffice(o.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-[12px] tracking-[0.1em] uppercase font-light transition-all ${
                    sel
                      ? "bg-omni47-navy text-white"
                      : "border border-omni47-cream-dark text-omni47-text-muted hover:border-omni47-gold"
                  }`}
                >
                  {sel && <Check className="w-3 h-3" />}
                  {o.name}
                </button>
              );
            })}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-omni47-cream-dark text-[13px] font-light text-omni47-text placeholder:text-omni47-text-muted/50 focus:outline-none focus:border-omni47-gold transition-colors"
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-omni47-cream-dark text-[13px] font-light text-omni47-text placeholder:text-omni47-text-muted/50 focus:outline-none focus:border-omni47-gold transition-colors"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <input
              type="tel"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-omni47-cream-dark text-[13px] font-light text-omni47-text placeholder:text-omni47-text-muted/50 focus:outline-none focus:border-omni47-gold transition-colors"
            />
            <select
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-omni47-cream-dark text-[13px] font-light text-omni47-text focus:outline-none focus:border-omni47-gold transition-colors"
            >
              <option value="">Subject</option>
              {subjectOptions.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <textarea
            placeholder="Your message..."
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full px-4 py-3 bg-white border border-omni47-cream-dark text-[13px] font-light text-omni47-text placeholder:text-omni47-text-muted/50 focus:outline-none focus:border-omni47-gold transition-colors resize-none"
          />
          <button
            type="submit"
            className="w-full py-3.5 bg-omni47-navy text-white text-[12px] tracking-[0.15em] uppercase font-light hover:bg-omni47-navy-light transition-colors"
          >
            Send Message
          </button>
        </form>
      </div>

      {/* Office cards */}
      <div className="bg-white py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <h2 className="font-cormorant text-[28px] font-light text-omni47-navy mb-10 text-center">
            Our Offices
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {offices.map((o) => (
              <div key={o.id} className="bg-omni47-cream p-6 space-y-4">
                {o.image && (
                  <img src={o.image} alt={o.name} className="w-full aspect-[16/10] object-cover mb-4" />
                )}
                <h3 className="font-cormorant text-[20px] font-light text-omni47-navy">{o.name}</h3>
                <div className="space-y-2.5 text-[13px] font-light text-omni47-text-muted">
                  <p className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-omni47-gold mt-0.5 shrink-0" /> {o.address}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-omni47-gold shrink-0" /> {o.phone}
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-omni47-gold shrink-0" /> {o.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-omni47-gold shrink-0" /> {o.hours}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Omni47ContactPage;
