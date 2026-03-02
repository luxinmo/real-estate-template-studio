import { useState } from "react";

const MortgageCalculator = () => {
  const [price, setPrice] = useState(4650000);
  const [downPayment, setDownPayment] = useState(30);
  const [interestRate, setInterestRate] = useState(3.5);
  const [years, setYears] = useState(25);

  const loanAmount = price * (1 - downPayment / 100);
  const monthlyRate = interestRate / 100 / 12;
  const numPayments = years * 12;
  const monthlyPayment = monthlyRate > 0
    ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
    : loanAmount / numPayments;
  const totalPaid = monthlyPayment * numPayments;
  const totalInterest = totalPaid - loanAmount;

  const fmt = (n: number) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="pt-6 border-t border-neutral-100">
      <p className="text-[12px] tracking-[0.25em] uppercase text-luxury-black/60 font-light mb-5">Mortgage Calculator</p>

      <div className="space-y-5">
        {/* Price */}
        <div>
          <div className="flex justify-between text-[14px] mb-1.5">
            <span className="text-luxury-black/70 font-light">Property Price</span>
            <span className="text-luxury-black font-normal">{fmt(price)}</span>
          </div>
          <input type="range" min={100000} max={20000000} step={50000} value={price} onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full h-px bg-neutral-200 appearance-none cursor-pointer accent-luxury-black" />
        </div>

        {/* Down payment */}
        <div>
          <div className="flex justify-between text-[14px] mb-1.5">
            <span className="text-luxury-black/70 font-light">Down Payment</span>
            <span className="text-luxury-black font-normal">{downPayment}% — {fmt(price * downPayment / 100)}</span>
          </div>
          <input type="range" min={10} max={90} step={5} value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))}
            className="w-full h-px bg-neutral-200 appearance-none cursor-pointer accent-luxury-black" />
        </div>

        {/* Interest */}
        <div>
          <div className="flex justify-between text-[14px] mb-1.5">
            <span className="text-luxury-black/70 font-light">Interest Rate</span>
            <span className="text-luxury-black font-normal">{interestRate.toFixed(1)}%</span>
          </div>
          <input type="range" min={1} max={8} step={0.1} value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full h-px bg-neutral-200 appearance-none cursor-pointer accent-luxury-black" />
        </div>

        {/* Term */}
        <div>
          <div className="flex justify-between text-[14px] mb-1.5">
            <span className="text-luxury-black/70 font-light">Loan Term</span>
            <span className="text-luxury-black font-normal">{years} years</span>
          </div>
          <input type="range" min={5} max={40} step={1} value={years} onChange={(e) => setYears(Number(e.target.value))}
            className="w-full h-px bg-neutral-200 appearance-none cursor-pointer accent-luxury-black" />
        </div>

        {/* Results */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-neutral-100">
          <div className="text-center">
            <p className="text-[20px] font-extralight text-luxury-black tracking-tight">{fmt(monthlyPayment)}</p>
            <p className="text-[12px] text-luxury-black/55 font-light mt-1 tracking-wide uppercase">Monthly</p>
          </div>
          <div className="text-center">
            <p className="text-[20px] font-extralight text-luxury-black tracking-tight">{fmt(totalInterest)}</p>
            <p className="text-[12px] text-luxury-black/55 font-light mt-1 tracking-wide uppercase">Interest</p>
          </div>
          <div className="text-center">
            <p className="text-[20px] font-extralight text-luxury-black tracking-tight">{fmt(totalPaid)}</p>
            <p className="text-[12px] text-luxury-black/55 font-light mt-1 tracking-wide uppercase">Total</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MortgageCalculator;
