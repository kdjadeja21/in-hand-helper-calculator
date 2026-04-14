import { Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatINR } from "@/lib/tax-calculator";
import { richCardClass } from "@/features/salary-planner/components/plannerStyles";

interface NetInHandCardProps {
  projectedNetDisplay: number;
  currentNetDisplay: number;
  netDifference: number;
}

export function NetInHandCard({
  projectedNetDisplay,
  currentNetDisplay,
  netDifference,
}: NetInHandCardProps) {
  return (
    <Card className={richCardClass}>
      <CardContent className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium tracking-[0.16em] text-zinc-500 uppercase dark:text-zinc-400">
            Net In-Hand (Projected)
          </p>
          <div className="rounded-full border border-emerald-200 bg-emerald-100 p-2.5 text-emerald-700 dark:border-emerald-700/50 dark:bg-emerald-900/30 dark:text-emerald-300">
            <Wallet className="size-4" aria-hidden />
          </div>
        </div>
        <p className="font-mono text-[2.35rem] font-semibold tracking-tight tabular-nums text-zinc-950 dark:text-zinc-50">
          {formatINR(projectedNetDisplay)}
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Current net in-hand:{" "}
          <span className="font-semibold tabular-nums text-zinc-800 dark:text-zinc-100">
            {formatINR(currentNetDisplay)}
          </span>
        </p>
        <div className="rounded-2xl border border-zinc-200/90 bg-zinc-100/80 p-4 dark:border-zinc-700 dark:bg-zinc-800/60">
          <p className="text-xs tracking-[0.14em] text-zinc-500 uppercase dark:text-zinc-400">Impact</p>
          <p
            className={cn(
              "mt-1 text-xl font-semibold tabular-nums tracking-tight",
              netDifference >= 0 ? "text-emerald-600" : "text-rose-600"
            )}
          >
            {netDifference >= 0 ? "+" : ""}
            {formatINR(netDifference)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
