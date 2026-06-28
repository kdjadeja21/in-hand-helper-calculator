import { Fragment } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatINR, type SalaryCalculatorResult, type TaxRegime } from "@/lib/tax-calculator";

interface CurrentSalaryBreakdownCardProps {
  result: SalaryCalculatorResult;
  taxRegime: TaxRegime;
}

interface BreakdownRow {
  label: string;
  amount: number;
}

function BreakdownSection({
  title,
  titleClassName,
  rows,
}: {
  title: string;
  titleClassName: string;
  rows: BreakdownRow[];
}) {
  return (
    <>
      <div className="col-span-2 mt-1">
        <p className={`text-xs font-semibold tracking-[0.14em] uppercase ${titleClassName}`}>
          {title}
        </p>
      </div>
      {rows.map((row) => (
        <Fragment key={row.label}>
          <p className="text-zinc-700 dark:text-zinc-300">{row.label}</p>
          <p className="text-right tabular-nums text-zinc-700 dark:text-zinc-300">
            {formatINR(row.amount)}
          </p>
        </Fragment>
      ))}
    </>
  );
}

export function CurrentSalaryBreakdownCard({ result, taxRegime }: CurrentSalaryBreakdownCardProps) {
  const earningsRows: BreakdownRow[] = [
    { label: "Basic Salary", amount: result.basic },
    { label: "HRA", amount: result.hra },
    { label: "Special Allowance", amount: result.specialAllowance },
  ];

  const deductionRows: BreakdownRow[] = [
    { label: "PF (Employee 12%)", amount: result.pf },
    { label: "Professional Tax", amount: result.professionalTax },
    {
      label: `Income Tax (${taxRegime === "new" ? "New" : "Old"})`,
      amount: result.incomeTax,
    },
    { label: "Other Deductions", amount: result.otherDeductions },
  ];

  return (
    <Card className="overflow-hidden rounded-3xl border border-emerald-200/80 bg-white/95 shadow-[0_24px_46px_-34px_rgba(16,185,129,0.58)] dark:border-emerald-900/80 dark:bg-zinc-900/90">
      <CardHeader className="space-y-1 border-b border-emerald-100/90 pb-4 dark:border-emerald-900/60">
        <CardTitle className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Salary Breakdown
        </CardTitle>
        <CardDescription className="text-sm text-zinc-500 dark:text-zinc-400">
          Complete monthly breakdown of your current salary structure.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 py-5">
        <div className="grid grid-cols-[1.5fr_1fr] items-center gap-x-3 gap-y-3 text-sm">
          <p className="text-xs font-semibold tracking-[0.12em] text-zinc-500 uppercase dark:text-zinc-400">
            Component
          </p>
          <p className="text-right text-xs font-semibold tracking-[0.12em] text-zinc-500 uppercase dark:text-zinc-400">
            Amount
          </p>

          <BreakdownSection
            title="Earnings"
            titleClassName="text-emerald-700 dark:text-emerald-300"
            rows={earningsRows}
          />

          <Separator className="col-span-2 my-1 bg-zinc-200/90 dark:bg-zinc-700/80" />

          <BreakdownSection
            title="Deductions"
            titleClassName="text-rose-700 dark:text-rose-300"
            rows={deductionRows}
          />

          <Separator className="col-span-2 my-1 bg-zinc-200/90 dark:bg-zinc-700/80" />

          <p className="font-semibold text-zinc-900 dark:text-zinc-100">Gross Monthly</p>
          <p className="text-right font-semibold tabular-nums text-zinc-700 dark:text-zinc-300">
            {formatINR(result.grossMonthlySalary)}
          </p>

          <p className="font-semibold text-zinc-900 dark:text-zinc-100">Total Deductions</p>
          <p className="text-right font-semibold tabular-nums text-zinc-700 dark:text-zinc-300">
            {formatINR(result.totalDeductions)}
          </p>
        </div>

        {result.foodCoupons > 0 ? (
          <div className="rounded-2xl border border-emerald-100 bg-white dark:border-emerald-900/50 dark:bg-zinc-900/50 overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-emerald-50 dark:border-emerald-900/30">
              <div className="grid grid-cols-[1.5fr_1fr] items-center gap-3">
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Total Net In-Hand
                </p>
                <p className="text-right font-semibold tabular-nums text-zinc-700 dark:text-zinc-300">
                  {formatINR(result.netInHand)}
                </p>
              </div>
            </div>
            <div className="px-4 py-3">
              <div className="grid grid-cols-[1.5fr_1fr] items-center gap-3">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Food Coupons <span className="text-[10px] ml-1 opacity-70">(Separate Card)</span>
                </p>
                <p className="text-right tabular-nums text-zinc-500 dark:text-zinc-400">
                  - {formatINR(result.foodCoupons)}
                </p>
              </div>
            </div>
            <div className="bg-emerald-100/85 px-4 py-4 dark:bg-emerald-900/35">
              <div className="grid grid-cols-[1.5fr_1fr] items-center gap-3">
                <div>
                  <p className="text-xs font-semibold tracking-[0.12em] text-emerald-700 uppercase dark:text-emerald-300">
                    Net Pay
                  </p>
                  <p className="text-[10px] font-medium text-emerald-600/80 dark:text-emerald-400/80 mt-0.5 uppercase tracking-wider">Bank Credit</p>
                </div>
                <p className="text-right text-2xl font-semibold tabular-nums text-emerald-700 dark:text-emerald-300">
                  {formatINR(result.netPay)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-emerald-100/85 px-4 py-4 dark:bg-emerald-900/35">
            <div className="grid grid-cols-[1.5fr_1fr] items-center gap-3">
              <p className="text-xs font-semibold tracking-[0.12em] text-emerald-700 uppercase dark:text-emerald-300">
                Net In-Hand
              </p>
              <p className="text-right text-2xl font-semibold tabular-nums text-emerald-700 dark:text-emerald-300">
                {formatINR(result.netInHand)}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
