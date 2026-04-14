import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatINR } from "@/lib/tax-calculator";
import { richCardClass } from "@/features/salary-planner/components/plannerStyles";
import type { ComparisonRow } from "@/features/salary-planner/types";

interface KeyDifferencesCardProps {
  rows: ComparisonRow[];
}

export function KeyDifferencesCard({ rows }: KeyDifferencesCardProps) {
  return (
    <Card className={richCardClass}>
      <CardHeader>
        <CardTitle className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          Key Differences at a Glance
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {rows.map((row) => (
          <div
            key={row.label}
            className="rounded-2xl border border-zinc-200/80 bg-zinc-100/70 p-3 dark:border-zinc-700 dark:bg-zinc-800/60"
          >
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{row.label}</p>
            <div className="mt-2 flex items-center justify-between text-base">
              <span className="tabular-nums">{formatINR(row.before)}</span>
              <ArrowRight className="size-3 text-zinc-400" />
              <span className="font-semibold tabular-nums">{formatINR(row.after)}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
