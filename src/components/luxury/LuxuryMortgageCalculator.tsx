import { useState } from "react";
import { Calculator } from "lucide-react";

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
    <div className="pt-10 border-t border-neutral-100">
      <h2 className="text-4xl font-light text-luxury-black font-serif tracking-tight mb-8 flex items-center gap-3">
        <Calculator className="w-8 h-8 text-luxury-black/40" strokeWidth={1.3} />
        Mortgage Calculator
      </h2>

      <div className="space-y-7">
        {/* Price */}
        <div>
          <div className="flex justify-between text-base mb-2">
            <span className="text-luxury-black/60 font-light">Property Price</span>
            <span className="text-luxury-black font-medium">{fmt(price)}</span>
          </div>
          <input type="range" min={100000} max={20000000} step={50000} value={price} onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full h-1 bg-neutral-200 appearance-none cursor-pointer accent-luxury-black" />
        </div>

        {/* Down payment */}
        <div>
          <div className="flex justify-between text-base mb-2">
            <span className="text-luxury-black/60 font-light">Down Payment</span>
            <span className="text-luxury-black font-medium">{downPayment}% — {fmt(price * downPayment / 100)}</span>
          </div>
          <input type="range" min={10} max={90} step={5} value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))}
            className="w-full h-1 bg-neutral-200 appearance-none cursor-pointer accent-luxury-black" />
        </div>

        {/* Interest */}
        <div>
          <div className="flex justify-between text-base mb-2">
            <span className="text-luxury-black/60 font-light">Interest Rate</span>
            <span className="text-luxury-black font-medium">{interestRate.toFixed(1)}%</span>
          </div>
          <input type="range" min={1} max={8} step={0.1} value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full h-1 bg-neutral-200 appearance-none cursor-pointer accent-luxury-black" />
        </div>

        {/* Term */}
        <div>
          <div className="flex justify-between text-base mb-2">
            <span className="text-luxury-black/60 font-light">Loan Term</span>
            <span className="text-luxury-black font-medium">{years} years</span>
          </div>
          <input type="range" min={5} max={40} step={1} value={years} onChange={(e) => setYears(Number(e.target.value))}
            className="w-full h-1 bg-neutral-200 appearance-none cursor-pointer accent-luxury-black" />
        </div>

        {/* Results */}
        <div className="grid grid-cols-3 gap-4 pt-5 border-t border-neutral-100">
          <div className="text-center">
            <p className="text-3xl font-light text-luxury-black font-serif">{fmt(monthlyPayment)}</p>
            <p className="text-sm text-luxury-black/50 font-light mt-1.5">Monthly Payment</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-light text-luxury-black font-serif">{fmt(totalInterest)}</p>
            <p className="text-sm text-luxury-black/50 font-light mt-1.5">Total Interest</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-light text-luxury-black font-serif">{fmt(totalPaid)}</p>
            <p className="text-sm text-luxury-black/50 font-light mt-1.5">Total Cost</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MortgageCalculator;
