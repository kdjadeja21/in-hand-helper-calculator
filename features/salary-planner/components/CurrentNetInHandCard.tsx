import { Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatINR } from "@/lib/tax-calculator";
import { richCardClass } from "@/features/salary-planner/components/plannerStyles";

interface CurrentNetInHandCardProps {
  netDisplay: number;
  hasTaxExemptDeduction?: boolean;
}

export function CurrentNetInHandCard({
  netDisplay,
  hasTaxExemptDeduction = false,
}: CurrentNetInHandCardProps) {
  return (
    <Card className={richCardClass}>
      <CardContent className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium tracking-[0.16em] text-zinc-500 uppercase dark:text-zinc-400">
            Net In-Hand
          </p>
          <div className="rounded-full border border-emerald-200 bg-emerald-100 p-2.5 text-emerald-700 dark:border-emerald-700/50 dark:bg-emerald-900/30 dark:text-emerald-300">
            <Wallet className="size-4" aria-hidden />
          </div>
        </div>
        <p className="font-mono text-[2.35rem] font-semibold tracking-tight tabular-nums text-zinc-950 dark:text-zinc-50">
          {formatINR(netDisplay)}
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Your current monthly take-home based on the salary structure you entered.
        </p>
        {hasTaxExemptDeduction ? (
          <p className="rounded-2xl border border-amber-200/80 bg-amber-50/80 px-3 py-2.5 text-xs leading-relaxed text-amber-900 dark:border-amber-800/60 dark:bg-amber-950/30 dark:text-amber-200">
            If food coupons are credited to a separate account, this net in-hand amount still
            includes the food coupon value. To match your payslip exactly, subtract your food
            coupon amount from the net in-hand shown above.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
