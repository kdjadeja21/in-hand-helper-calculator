import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatINR, type SalaryCalculatorResult } from "@/lib/tax-calculator";
import { richCardClass } from "@/features/salary-planner/components/plannerStyles";

interface TaxExemptDeductionComparisonCardProps {
  withoutDeductionResult: SalaryCalculatorResult;
  withDeductionResult: SalaryCalculatorResult;
  savingsMonthly: number;
}

function DeductionTile({
  title,
  result,
  highlight,
  isBetter,
}: {
  title: string;
  result: SalaryCalculatorResult;
  highlight: boolean;
  isBetter: boolean;
}) {
  const yearlyTax = result.incomeTax * 12;

  return (
    <div
      className={cn(
        "rounded-2xl border p-4",
        highlight
          ? "border-emerald-300 bg-emerald-50/80 dark:border-emerald-700 dark:bg-emerald-950/30"
          : "border-zinc-200/80 bg-zinc-100/70 dark:border-zinc-700 dark:bg-zinc-800/60"
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold tracking-[0.12em] text-zinc-600 uppercase dark:text-zinc-300">
          {title}
        </p>
        {isBetter ? (
          <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-semibold tracking-[0.08em] text-white uppercase">
            Better
          </span>
        ) : null}
      </div>
      <div className="space-y-2">
        <div className="space-y-1">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Tax per Year</p>
          <p className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
            {formatINR(yearlyTax)}{" "}
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              ({formatINR(result.incomeTax)}/month)
            </span>
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">In-hand Salary</p>
          <p className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
            {formatINR(result.netInHand)}
          </p>
        </div>
      </div>
    </div>
  );
}

export function TaxExemptDeductionComparisonCard({
  withoutDeductionResult,
  withDeductionResult,
  savingsMonthly,
}: TaxExemptDeductionComparisonCardProps) {
  const savingsYearly = savingsMonthly * 12;
  const hasSavings = savingsMonthly > 0;
  const isWithDeductionBetter = withDeductionResult.netInHand > withoutDeductionResult.netInHand;
  const isWithoutDeductionBetter = withoutDeductionResult.netInHand > withDeductionResult.netInHand;

  return (
    <Card className={richCardClass}>
      <CardHeader className="space-y-1 border-b border-zinc-200/70 pb-4 dark:border-zinc-800">
        <CardTitle className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          Tax Exempt Deduction Impact
        </CardTitle>
        <CardDescription className="text-sm text-zinc-500 dark:text-zinc-400">
          Compare tax and in-hand salary with and without tax exempt deductions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <DeductionTile
            title="Without Tax Exempt"
            result={withoutDeductionResult}
            highlight={false}
            isBetter={isWithoutDeductionBetter}
          />
          <DeductionTile
            title="With Tax Exempt"
            result={withDeductionResult}
            highlight={hasSavings}
            isBetter={isWithDeductionBetter}
          />
        </div>
        <div className="rounded-xl border border-zinc-200/80 bg-zinc-50 px-4 py-3 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-300">
          {hasSavings
            ? <>
                You save <span className="font-bold text-emerald-600 dark:text-emerald-300 decoration-emerald-300 dark:decoration-emerald-700 decoration-2">{formatINR(savingsYearly)}</span> yearly (<span className="text-emerald-600 dark:text-emerald-300  decoration-emerald-300 dark:decoration-emerald-700 decoration-2">{formatINR(savingsMonthly)}</span>/month) by using tax exempt deduction.
              </>
            : "No additional savings from tax exempt deduction based on current inputs."}
        </div>
      </CardContent>
    </Card>
  );
}
