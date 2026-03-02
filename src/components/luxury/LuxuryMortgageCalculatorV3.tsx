import { useState } from "react";

const LuxuryMortgageCalculatorV3 = () => {
  const [price, setPrice] = useState(4650000);
  const [downPayment, setDownPayment] = useState(30);
  const [interestRate, setInterestRate] = useState(3.5);
  const [years, setYears] = useState(25);

  const loanAmount = price * (1 - downPayment / 100);
  const monthlyRate = interestRate / 100 / 12;
  const numPayments = years * 12;
  const monthlyPayment =
    monthlyRate > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1)
      : loanAmount / numPayments;
  const totalPaid = monthlyPayment * numPayments;
  const totalInterest = totalPaid - loanAmount;

  const fmt = (n: number) =>
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(n);

  const pct = (value: number, min: number, max: number) =>
    ((value - min) / (max - min)) * 100;

  const SliderField = ({
    label,
    value,
    min,
    max,
    step,
    display,
    onChange,
  }: {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    display: string;
    onChange: (v: number) => void;
  }) => {
    const fill = pct(value, min, max);

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[13px] tracking-[0.08em] uppercase text-luxury-black/70 font-medium">
            {label}
          </p>
          <p className="text-[15px] text-luxury-black font-semibold tabular-nums">
            {display}
          </p>
        </div>

        <div className="relative">
          <div className="h-1.5 rounded-full bg-luxury-black/10 overflow-hidden">
            <div
              className="h-full bg-luxury-gold/80 transition-all duration-150"
              style={{ width: `${fill}%` }}
            />
          </div>

          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-luxury-gold bg-white shadow-sm pointer-events-none"
            style={{ left: `calc(${fill}% - 8px)` }}
          />
        </div>
      </div>
    );
  };

  return (
    <section className="border-t border-luxury-black/10 pt-9">
      <p className="text-[13px] tracking-[0.22em] uppercase text-luxury-gold/90 font-medium mb-6">
        Mortgage Calculator
      </p>

      <div className="border border-luxury-black/10 bg-white/80">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
          <div className="p-6 md:p-7 lg:p-8 space-y-6 lg:border-r border-luxury-black/10">
            <SliderField
              label="Property Price"
              value={price}
              min={100000}
              max={20000000}
              step={50000}
              display={fmt(price)}
              onChange={setPrice}
            />

            <SliderField
              label="Down Payment"
              value={downPayment}
              min={10}
              max={90}
              step={5}
              display={`${downPayment}% — ${fmt((price * downPayment) / 100)}`}
              onChange={setDownPayment}
            />

            <SliderField
              label="Interest Rate"
              value={interestRate}
              min={1}
              max={8}
              step={0.1}
              display={`${interestRate.toFixed(1)}%`}
              onChange={setInterestRate}
            />

            <SliderField
              label="Loan Term"
              value={years}
              min={5}
              max={40}
              step={1}
              display={`${years} years`}
              onChange={setYears}
            />
          </div>

          <div className="p-6 md:p-7 lg:p-8 flex flex-col justify-between bg-luxury-black/[0.02]">
            <div>
              <p className="text-[12px] tracking-[0.14em] uppercase text-luxury-black/55 font-medium mb-2">
                Estimated Monthly Payment
              </p>
              <p className="text-[40px] md:text-[46px] font-medium text-luxury-black tracking-tight leading-none">
                {fmt(monthlyPayment)}
              </p>
              <p className="text-[13px] text-luxury-black/70 font-medium mt-2">/month</p>
            </div>

            <div className="mt-6 space-y-3">
              {[
                { label: "Loan Amount", value: fmt(loanAmount) },
                { label: "Total Interest", value: fmt(totalInterest) },
                { label: "Total Paid", value: fmt(totalPaid) },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between border-b border-luxury-black/10 pb-2">
                  <span className="text-[12px] tracking-[0.08em] uppercase text-luxury-black/55 font-medium">
                    {item.label}
                  </span>
                  <span className="text-[16px] text-luxury-black font-semibold tabular-nums">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="text-[12px] text-luxury-black/55 font-medium mt-4 leading-relaxed">
        Cálculo orientativo basado en amortización francesa. No incluye gastos de formalización, seguros ni comisiones.
      </p>
    </section>
  );
};

export default LuxuryMortgageCalculatorV3;
