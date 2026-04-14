import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatINR, type SalaryCalculatorResult } from "@/lib/tax-calculator";
import { richCardClass } from "@/features/salary-planner/components/plannerStyles";

interface TaxRegimeComparisonCardProps {
  oldResult: SalaryCalculatorResult;
  newResult: SalaryCalculatorResult;
  isOldRegimeBetter: boolean;
  isNewRegimeBetter: boolean;
}

function RegimeTile({
  title,
  result,
  isBetter,
}: {
  title: string;
  result: SalaryCalculatorResult;
  isBetter: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-4",
        isBetter
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
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Tax per Month</p>
          <p className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
            {formatINR(result.incomeTax)}
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

export function TaxRegimeComparisonCard({
  oldResult,
  newResult,
  isOldRegimeBetter,
  isNewRegimeBetter,
}: TaxRegimeComparisonCardProps) {
  return (
    <Card className={richCardClass}>
      <CardHeader className="space-y-1 border-b border-zinc-200/70 pb-4 dark:border-zinc-800">
        <CardTitle className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          Old vs New Tax Regime
        </CardTitle>
        <CardDescription className="text-sm text-zinc-500 dark:text-zinc-400">
          Compare monthly tax and in-hand salary for projected structure.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <RegimeTile title="Old Tax Regime" result={oldResult} isBetter={isOldRegimeBetter} />
          <RegimeTile title="New Tax Regime" result={newResult} isBetter={isNewRegimeBetter} />
        </div>
      </CardContent>
    </Card>
  );
}
