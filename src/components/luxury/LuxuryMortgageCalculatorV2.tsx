import { useState } from "react";

const LuxuryMortgageCalculatorV2 = () => {
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

  const pct = (val: number, min: number, max: number) =>
    ((val - min) / (max - min)) * 100;

  const SliderRow = ({
    label,
    value,
    display,
    min,
    max,
    step,
    onChange,
  }: {
    label: string;
    value: number;
    display: string;
    min: number;
    max: number;
    step: number;
    onChange: (v: number) => void;
  }) => {
    const filled = pct(value, min, max);
    return (
      <div className="group">
        <div className="flex items-baseline justify-between mb-2.5">
          <span className="text-[13px] tracking-[0.08em] text-luxury-black/60 font-normal">
            {label}
          </span>
          <span className="text-[15px] text-luxury-black font-medium tabular-nums">
            {display}
          </span>
        </div>
        <div className="relative h-[2px] bg-luxury-black/10 rounded-full">
          <div
            className="absolute left-0 top-0 h-full bg-luxury-gold/70 rounded-full transition-all duration-150"
            style={{ width: `${filled}%` }}
          />
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          {/* Thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-luxury-gold bg-white shadow-sm transition-all duration-150 pointer-events-none"
            style={{ left: `calc(${filled}% - 7px)` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="border-t border-luxury-black/8 pt-10">
      <p className="text-[13px] tracking-[0.22em] uppercase text-luxury-gold/90 font-normal mb-8">
        Mortgage Estimate
      </p>

      {/* Monthly result — prominent */}
      <div className="mb-10 text-center">
        <p className="text-[42px] md:text-[50px] font-extralight text-luxury-black tracking-tight leading-none">
          {fmt(monthlyPayment)}
        </p>
        <p className="text-[13px] text-luxury-black/50 font-normal tracking-[0.1em] uppercase mt-2">
          per month
        </p>
      </div>

      {/* Sliders */}
      <div className="space-y-6 max-w-lg mx-auto">
        <SliderRow
          label="Property Price"
          value={price}
          display={fmt(price)}
          min={100000}
          max={20000000}
          step={50000}
          onChange={setPrice}
        />
        <SliderRow
          label="Down Payment"
          value={downPayment}
          display={`${downPayment}% — ${fmt((price * downPayment) / 100)}`}
          min={10}
          max={90}
          step={5}
          onChange={setDownPayment}
        />
        <SliderRow
          label="Interest Rate"
          value={interestRate}
          display={`${interestRate.toFixed(1)}%`}
          min={1}
          max={8}
          step={0.1}
          onChange={setInterestRate}
        />
        <SliderRow
          label="Term"
          value={years}
          display={`${years} years`}
          min={5}
          max={40}
          step={1}
          onChange={setYears}
        />
      </div>

      {/* Breakdown */}
      <div className="flex items-stretch justify-center gap-px mt-10 max-w-lg mx-auto">
        {[
          { label: "Loan", value: fmt(loanAmount) },
          { label: "Interest", value: fmt(totalInterest) },
          { label: "Total Paid", value: fmt(totalPaid) },
        ].map((item, i) => (
          <div
            key={i}
            className="flex-1 text-center py-4 first:border-r last:border-l border-luxury-black/8"
          >
            <p className="text-[18px] font-extralight text-luxury-black tracking-tight">
              {item.value}
            </p>
            <p className="text-[11px] text-luxury-black/45 tracking-[0.15em] uppercase mt-1 font-normal">
              {item.label}
            </p>
          </div>
        ))}
      </div>

      <p className="text-[12px] text-luxury-black/40 font-normal text-center mt-6 max-w-md mx-auto leading-relaxed">
        Indicative calculation based on the French amortization system. Does not
        include fees, insurance, or commissions.
      </p>
    </div>
  );
};

export default LuxuryMortgageCalculatorV2;
