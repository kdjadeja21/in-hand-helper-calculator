import type { TaxRegime, SalaryCalculatorResult } from "@/lib/tax-calculator";
import { CurrentNetInHandCard } from "@/features/salary-planner/components/CurrentNetInHandCard";
import { CurrentSalaryBreakdownCard } from "@/features/salary-planner/components/CurrentSalaryBreakdownCard";
import { TaxRegimeComparisonCard } from "@/features/salary-planner/components/TaxRegimeComparisonCard";

interface JustInHandSectionProps {
  currentNetDisplay: number;
  hasTaxExemptDeduction: boolean;
  result: SalaryCalculatorResult;
  taxRegime: TaxRegime;
  currentOldRegimeResult: SalaryCalculatorResult;
  currentNewRegimeResult: SalaryCalculatorResult;
  isCurrentOldRegimeBetter: boolean;
  isCurrentNewRegimeBetter: boolean;
}

export function JustInHandSection({
  currentNetDisplay,
  hasTaxExemptDeduction,
  result,
  taxRegime,
  currentOldRegimeResult,
  currentNewRegimeResult,
  isCurrentOldRegimeBetter,
  isCurrentNewRegimeBetter,
}: JustInHandSectionProps) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-5 xl:grid-cols-2">
        <CurrentNetInHandCard
          netDisplay={currentNetDisplay}
          hasTaxExemptDeduction={hasTaxExemptDeduction}
        />
        <TaxRegimeComparisonCard
          oldResult={currentOldRegimeResult}
          newResult={currentNewRegimeResult}
          isOldRegimeBetter={isCurrentOldRegimeBetter}
          isNewRegimeBetter={isCurrentNewRegimeBetter}
          description="Compare monthly tax and in-hand salary for your current structure."
        />
      </div>
      <CurrentSalaryBreakdownCard result={result} taxRegime={taxRegime} />
    </div>
  );
}
