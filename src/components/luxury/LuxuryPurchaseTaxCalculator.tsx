import { useState } from "react";
import { Receipt } from "lucide-react";

type PurchaseType = "new" | "secondhand" | "plot";

const TAX_RATES: Record<PurchaseType, { vat: number; ajd: number; itp: number; label: string }> = {
  new: { vat: 10, ajd: 1.5, itp: 0, label: "New Build (VAT + AJD)" },
  secondhand: { vat: 0, ajd: 0, itp: 8, label: "Second Hand (ITP)" },
  plot: { vat: 21, ajd: 1.5, itp: 0, label: "Plot (VAT 21% + AJD)" },
};

const LuxuryPurchaseTaxCalculator = () => {
  const [price, setPrice] = useState(4650000);
  const [type, setType] = useState<PurchaseType>("secondhand");

  const rates = TAX_RATES[type];
  const vatAmount = price * rates.vat / 100;
  const ajdAmount = price * rates.ajd / 100;
  const itpAmount = price * rates.itp / 100;
  const notaryFees = Math.min(Math.max(price * 0.03 / 100, 600), 3500);
  const registryFees = Math.min(Math.max(price * 0.02 / 100, 400), 2500);
  const legalFees = price * 1 / 100;
  const totalTaxes = vatAmount + ajdAmount + itpAmount;
  const totalCosts = totalTaxes + notaryFees + registryFees + legalFees;
  const grandTotal = price + totalCosts;

  const fmt = (n: number) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
  const pct = (n: number) => `${(n / price * 100).toFixed(2)}%`;

  return (
    <div className="pt-10 border-t border-neutral-100">
      <h2 className="text-4xl font-light text-luxury-black font-serif tracking-tight mb-8 flex items-center gap-3">
        <Receipt className="w-8 h-8 text-luxury-black/40" strokeWidth={1.3} />
        Purchase Costs & Taxes
      </h2>

      {/* Purchase type selector */}
      <div className="flex gap-2 mb-8">
        {(Object.entries(TAX_RATES) as [PurchaseType, typeof TAX_RATES["new"]][]).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setType(key)}
            className={`px-5 py-2.5 text-base transition-all duration-300 border ${
              type === key
                ? "bg-luxury-black text-white border-luxury-black"
                : "border-neutral-300 text-luxury-black/60 hover:border-luxury-black/40"
            }`}
          >
            {key === "new" ? "New Build" : key === "secondhand" ? "Second Hand" : "Plot"}
          </button>
        ))}
      </div>

      {/* Price slider */}
      <div className="mb-8">
        <div className="flex justify-between text-base mb-2">
          <span className="text-luxury-black/60 font-light">Purchase Price</span>
          <span className="text-luxury-black font-medium">{fmt(price)}</span>
        </div>
        <input type="range" min={100000} max={20000000} step={50000} value={price} onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full h-1 bg-neutral-200 appearance-none cursor-pointer accent-luxury-black" />
      </div>

      {/* Breakdown table */}
      <div className="border border-neutral-200 divide-y divide-neutral-100">
        <div className="px-5 py-3.5 bg-neutral-50/50">
          <p className="text-sm tracking-[0.15em] uppercase text-luxury-black/50 font-medium">Tax Breakdown — {rates.label}</p>
        </div>

        {rates.vat > 0 && (
          <div className="px-5 py-3.5 flex justify-between text-base">
            <span className="text-luxury-black/70 font-light">VAT (IVA) — {rates.vat}%</span>
            <span className="text-luxury-black font-medium">{fmt(vatAmount)}</span>
          </div>
        )}
        {rates.ajd > 0 && (
          <div className="px-5 py-3.5 flex justify-between text-base">
            <span className="text-luxury-black/70 font-light">Stamp Duty (AJD) — {rates.ajd}%</span>
            <span className="text-luxury-black font-medium">{fmt(ajdAmount)}</span>
          </div>
        )}
        {rates.itp > 0 && (
          <div className="px-5 py-3.5 flex justify-between text-base">
            <span className="text-luxury-black/70 font-light">Transfer Tax (ITP) — {rates.itp}%</span>
            <span className="text-luxury-black font-medium">{fmt(itpAmount)}</span>
          </div>
        )}

        <div className="px-5 py-3.5 bg-neutral-50/50">
          <p className="text-sm tracking-[0.15em] uppercase text-luxury-black/50 font-medium">Additional Costs</p>
        </div>

        <div className="px-5 py-3.5 flex justify-between text-base">
          <span className="text-luxury-black/70 font-light">Notary Fees</span>
          <span className="text-luxury-black font-medium">{fmt(notaryFees)}</span>
        </div>
        <div className="px-5 py-3.5 flex justify-between text-base">
          <span className="text-luxury-black/70 font-light">Land Registry</span>
          <span className="text-luxury-black font-medium">{fmt(registryFees)}</span>
        </div>
        <div className="px-5 py-3.5 flex justify-between text-base">
          <span className="text-luxury-black/70 font-light">Legal Fees (~1%)</span>
          <span className="text-luxury-black font-medium">{fmt(legalFees)}</span>
        </div>

        {/* Totals */}
        <div className="px-5 py-4.5 flex justify-between text-base bg-neutral-50/80">
          <span className="text-luxury-black/80 font-medium">Total Additional Costs</span>
          <div className="text-right">
            <span className="text-luxury-black font-medium">{fmt(totalCosts)}</span>
            <span className="text-luxury-black/40 text-sm ml-2">({pct(totalCosts)})</span>
          </div>
        </div>
        <div className="px-5 py-5 flex justify-between bg-luxury-black text-white">
          <span className="font-medium text-lg">Total Investment</span>
          <span className="font-serif text-2xl">{fmt(grandTotal)}</span>
        </div>
      </div>
    </div>
  );
};

export default LuxuryPurchaseTaxCalculator;
