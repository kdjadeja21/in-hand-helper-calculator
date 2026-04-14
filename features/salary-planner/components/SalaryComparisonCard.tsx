import { Fragment } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { formatINR, type SalaryCalculatorResult } from "@/lib/tax-calculator";
import type { ComparisonRow } from "@/features/salary-planner/types";

interface SalaryComparisonCardProps {
  result: SalaryCalculatorResult;
  projectedResult: SalaryCalculatorResult;
  earningsRows: ComparisonRow[];
  deductionRows: ComparisonRow[];
}

export function SalaryComparisonCard({
  result,
  projectedResult,
  earningsRows,
  deductionRows,
}: SalaryComparisonCardProps) {
  return (
    <Card className="overflow-hidden rounded-3xl border border-emerald-200/80 bg-white/95 shadow-[0_24px_46px_-34px_rgba(16,185,129,0.58)] dark:border-emerald-900/80 dark:bg-zinc-900/90">
      <CardHeader className="space-y-1 border-b border-emerald-100/90 pb-4 dark:border-emerald-900/60">
        <CardTitle className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Salary Structure Comparison
        </CardTitle>
        <CardDescription className="text-sm text-zinc-500 dark:text-zinc-400">
          Monthly breakdown before vs projected after applying the 50% basic salary rule.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 py-5">
        <div className="grid grid-cols-[1.5fr_1fr_1fr] items-center gap-x-3 gap-y-3 text-sm">
          <p className="text-xs font-semibold tracking-[0.12em] text-zinc-500 uppercase dark:text-zinc-400">
            Component
          </p>
          <p className="text-right text-xs font-semibold tracking-[0.12em] text-zinc-500 uppercase dark:text-zinc-400">
            Current
          </p>
          <p className="text-right text-xs font-semibold tracking-[0.12em] text-zinc-500 uppercase dark:text-zinc-400">
            Projected
          </p>

          <div className="col-span-3 mt-1">
            <p className="text-xs font-semibold tracking-[0.14em] text-emerald-700 uppercase dark:text-emerald-300">
              Earnings
            </p>
          </div>
          {earningsRows.map((row) => {
            const difference = row.after - row.before;
            return (
              <Fragment key={row.label}>
                <p className="text-zinc-700 dark:text-zinc-300">{row.label}</p>
                <p className="text-right tabular-nums text-zinc-700 dark:text-zinc-300">
                  {formatINR(row.before)}
                </p>
                <div className="text-right">
                  <p className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                    {formatINR(row.after)}
                  </p>
                  <p
                    className={cn(
                      "text-xs tabular-nums",
                      difference >= 0 ? "text-emerald-600" : "text-rose-600"
                    )}
                  >
                    {difference >= 0 ? "+" : ""}
                    {formatINR(difference)}
                  </p>
                </div>
              </Fragment>
            );
          })}

          <Separator className="col-span-3 my-1 bg-zinc-200/90 dark:bg-zinc-700/80" />

          <div className="col-span-3">
            <p className="text-xs font-semibold tracking-[0.14em] text-rose-700 uppercase dark:text-rose-300">
              Deductions
            </p>
          </div>

          {deductionRows.map((row) => {
            const difference = row.after - row.before;
            return (
              <Fragment key={row.label}>
                <p className="text-zinc-700 dark:text-zinc-300">{row.label}</p>
                <p className="text-right tabular-nums text-zinc-700 dark:text-zinc-300">
                  {formatINR(row.before)}
                </p>
                <div className="text-right">
                  <p className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                    {formatINR(row.after)}
                  </p>
                  <p
                    className={cn(
                      "text-xs tabular-nums",
                      difference >= 0 ? "text-emerald-600" : "text-rose-600"
                    )}
                  >
                    {difference >= 0 ? "+" : ""}
                    {formatINR(difference)}
                  </p>
                </div>
              </Fragment>
            );
          })}

          <Separator className="col-span-3 my-1 bg-zinc-200/90 dark:bg-zinc-700/80" />

          <p className="font-semibold text-zinc-900 dark:text-zinc-100">Gross Monthly</p>
          <p className="text-right font-semibold tabular-nums text-zinc-700 dark:text-zinc-300">
            {formatINR(result.grossMonthlySalary)}
          </p>
          <div className="text-right">
            <p className="font-semibold tabular-nums text-zinc-950 dark:text-zinc-50">
              {formatINR(projectedResult.grossMonthlySalary)}
            </p>
            <p
              className={cn(
                "text-xs tabular-nums",
                projectedResult.grossMonthlySalary - result.grossMonthlySalary >= 0
                  ? "text-emerald-600"
                  : "text-rose-600"
              )}
            >
              {projectedResult.grossMonthlySalary - result.grossMonthlySalary >= 0 ? "+" : ""}
              {formatINR(projectedResult.grossMonthlySalary - result.grossMonthlySalary)}
            </p>
          </div>

          <p className="font-semibold text-zinc-900 dark:text-zinc-100">Total Deductions</p>
          <p className="text-right font-semibold tabular-nums text-zinc-700 dark:text-zinc-300">
            {formatINR(result.totalDeductions)}
          </p>
          <div className="text-right">
            <p className="font-semibold tabular-nums text-zinc-950 dark:text-zinc-50">
              {formatINR(projectedResult.totalDeductions)}
            </p>
            <p
              className={cn(
                "text-xs tabular-nums",
                projectedResult.totalDeductions - result.totalDeductions >= 0
                  ? "text-emerald-600"
                  : "text-rose-600"
              )}
            >
              {projectedResult.totalDeductions - result.totalDeductions >= 0 ? "+" : ""}
              {formatINR(projectedResult.totalDeductions - result.totalDeductions)}
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-emerald-100/85 px-4 py-4 dark:bg-emerald-900/35">
          <div className="grid grid-cols-[1.5fr_1fr_1fr] items-center gap-3">
            <p className="text-xs font-semibold tracking-[0.12em] text-emerald-700 uppercase dark:text-emerald-300">
              Net In-Hand
            </p>
            <p className="text-right text-base font-semibold tabular-nums text-emerald-700 dark:text-emerald-300">
              {formatINR(result.netInHand)}
            </p>
            <div className="text-right">
              <p className="text-2xl font-semibold tabular-nums text-emerald-700 dark:text-emerald-300">
                {formatINR(projectedResult.netInHand)}
              </p>
              <p
                className={cn(
                  "text-xs tabular-nums",
                  projectedResult.netInHand - result.netInHand >= 0 ? "text-emerald-700" : "text-rose-700"
                )}
              >
                {projectedResult.netInHand - result.netInHand >= 0 ? "+" : ""}
                {formatINR(projectedResult.netInHand - result.netInHand)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
