import { useState, useMemo } from "react";
import { Calculator, Info } from "lucide-react";

const MortgageCalculator = () => {
  const propertyPrice = 285000;
  const [price, setPrice] = useState(propertyPrice);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [interestRate, setInterestRate] = useState(3.2);
  const [termYears, setTermYears] = useState(25);

  const result = useMemo(() => {
    const downPayment = (price * downPaymentPct) / 100;
    const loanAmount = price - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const nPayments = termYears * 12;

    if (monthlyRate === 0) {
      return {
        monthly: loanAmount / nPayments,
        totalPaid: loanAmount,
        totalInterest: 0,
        loanAmount,
        downPayment,
      };
    }

    const monthly =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, nPayments)) /
      (Math.pow(1 + monthlyRate, nPayments) - 1);
    const totalPaid = monthly * nPayments;
    const totalInterest = totalPaid - loanAmount;

    return { monthly, totalPaid, totalInterest, loanAmount, downPayment };
  }, [price, downPaymentPct, interestRate, termYears]);

  const fmt = (n: number) =>
    n.toLocaleString("es-ES", { maximumFractionDigits: 0 });

  const SliderField = ({
    label,
    value,
    onChange,
    min,
    max,
    step,
    suffix,
    displayValue,
  }: {
    label: string;
    value: number;
    onChange: (v: number) => void;
    min: number;
    max: number;
    step: number;
    suffix: string;
    displayValue?: string;
  }) => (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        <span className="text-sm font-semibold text-foreground">
          {displayValue ?? value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full bg-muted appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-md"
      />
      <div className="flex justify-between text-[10px] text-muted-foreground/60 mt-0.5">
        <span>
          {min}
          {suffix}
        </span>
        <span>
          {max}
          {suffix}
        </span>
      </div>
    </div>
  );

  return (
    <div className="rounded-xl border border-border bg-card shadow-card p-6">
      <div className="flex items-center gap-2 mb-5">
        <Calculator className="h-4.5 w-4.5 text-primary" strokeWidth={1.5} />
        <h3 className="text-base font-semibold text-foreground">
          Calculadora de hipoteca
        </h3>
      </div>

      <div className="space-y-4">
        <SliderField
          label="Precio del inmueble"
          value={price}
          onChange={setPrice}
          min={50000}
          max={2000000}
          step={5000}
          suffix=" €"
          displayValue={fmt(price)}
        />

        <SliderField
          label="Entrada"
          value={downPaymentPct}
          onChange={setDownPaymentPct}
          min={0}
          max={90}
          step={5}
          suffix="%"
          displayValue={`${downPaymentPct}% (${fmt(result.downPayment)} €)`}
        />

        <SliderField
          label="Tipo de interés (TIN)"
          value={interestRate}
          onChange={setInterestRate}
          min={0.5}
          max={8}
          step={0.1}
          suffix="%"
          displayValue={interestRate.toFixed(1)}
        />

        <SliderField
          label="Plazo"
          value={termYears}
          onChange={setTermYears}
          min={5}
          max={40}
          step={1}
          suffix=" años"
        />
      </div>

      {/* Result */}
      <div className="mt-5 rounded-lg bg-primary/5 border border-primary/10 p-4">
        <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">
          Cuota mensual estimada
        </p>
        <p className="text-3xl font-bold text-primary">{fmt(result.monthly)} €<span className="text-sm font-normal text-muted-foreground">/mes</span></p>

        <div className="mt-3 grid grid-cols-3 gap-3 pt-3 border-t border-primary/10">
          <div>
            <p className="text-[10px] text-muted-foreground">Préstamo</p>
            <p className="text-sm font-medium text-foreground">{fmt(result.loanAmount)} €</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Total intereses</p>
            <p className="text-sm font-medium text-foreground">{fmt(result.totalInterest)} €</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Total pagado</p>
            <p className="text-sm font-medium text-foreground">{fmt(result.totalPaid)} €</p>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-1.5 mt-3">
        <Info className="h-3 w-3 text-muted-foreground/50 mt-0.5 shrink-0" />
        <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
          Cálculo orientativo basado en el sistema de amortización francés. No incluye gastos de formalización, seguros ni comisiones. Consulta con tu entidad bancaria para una oferta personalizada.
        </p>
      </div>
    </div>
  );
};

export default MortgageCalculator;
