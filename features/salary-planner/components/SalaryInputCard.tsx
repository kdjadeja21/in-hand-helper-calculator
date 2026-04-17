import type { TaxRegime } from "@/lib/tax-calculator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { extractDigits, formatInputINR } from "@/features/salary-planner/utils/currency";
import { richCardClass } from "@/features/salary-planner/components/plannerStyles";
import type { SalaryFormValues, SalaryPeriod } from "@/features/salary-planner/types";

interface SalaryInputCardProps {
  salaryPeriod: SalaryPeriod;
  taxRegime: TaxRegime;
  formValues: SalaryFormValues;
  validationErrors: string[];
  onSubmit: () => void;
  onTaxRegimeChange: (regime: TaxRegime) => void;
  onPeriodChange: (period: SalaryPeriod) => void;
  onFieldChange: (field: keyof SalaryFormValues, value: string) => void;
}

function MoneyInput({
  id,
  label,
  value,
  onChange,
}: {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id} className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        {label}
      </Label>
      <Input
        id={id}
        type="text"
        inputMode="numeric"
        value={formatInputINR(value)}
        onChange={(event) => onChange(extractDigits(event.target.value))}
        className="h-11 rounded-2xl border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900/60"
      />
    </div>
  );
}

export function SalaryInputCard({
  salaryPeriod,
  taxRegime,
  formValues,
  validationErrors,
  onSubmit,
  onTaxRegimeChange,
  onPeriodChange,
  onFieldChange,
}: SalaryInputCardProps) {
  return (
    <Card className={richCardClass}>
      <CardHeader className="space-y-3 border-b border-zinc-200/70 pb-5 dark:border-zinc-800">
        <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Salary Inputs
        </CardTitle>
        <CardDescription className="text-sm text-zinc-500 dark:text-zinc-400">
          Enter your details and calculate to compare current and projected structure.
        </CardDescription>
      </CardHeader>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <CardContent className="grid gap-4 py-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
            <p className="mb-3 text-xs font-semibold tracking-[0.12em] text-zinc-500 uppercase dark:text-zinc-400">
              Setup
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="salary-period-toggle" className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Amount Type
                </Label>
                <div className="flex h-11 items-center justify-between rounded-2xl border border-zinc-200 bg-white px-3 dark:border-zinc-700 dark:bg-zinc-800/60">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Monthly</span>
                  <Switch
                    id="salary-period-toggle"
                    checked={salaryPeriod === "yearly"}
                    onCheckedChange={(checked) => onPeriodChange(checked ? "yearly" : "monthly")}
                  />
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Yearly</span>
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="tax-regime-toggle" className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Tax Regime
                </Label>
                <div className="flex h-11 items-center justify-between rounded-2xl border border-zinc-200 bg-white px-3 dark:border-zinc-700 dark:bg-zinc-800/60">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">Old</span>
                  <Switch
                    id="tax-regime-toggle"
                    checked={taxRegime === "new"}
                    onCheckedChange={(checked) => onTaxRegimeChange(checked ? "new" : "old")}
                  />
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">New</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
            <p className="mb-3 text-xs font-semibold tracking-[0.12em] text-zinc-500 uppercase dark:text-zinc-400">
              Salary Structure
            </p>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <MoneyInput
                id="annual-ctc"
                label={`CTC (${salaryPeriod === "yearly" ? "Yearly" : "Monthly"} ₹)`}
                value={formValues.annualCTC}
                onChange={(value) => onFieldChange("annualCTC", value)}
              />
              <MoneyInput
                id="gross-salary"
                label={`Gross Salary (${salaryPeriod === "yearly" ? "Yearly" : "Monthly"} ₹)`}
                value={formValues.grossSalary}
                onChange={(value) => onFieldChange("grossSalary", value)}
              />
              <MoneyInput
                label="Basic Salary (Amount ₹)"
                value={formValues.basicValue}
                onChange={(value) => onFieldChange("basicValue", value)}
              />
              <MoneyInput
                label="HRA (Amount ₹)"
                value={formValues.hraValue}
                onChange={(value) => onFieldChange("hraValue", value)}
              />
              <div className="sm:col-span-2 xl:col-span-1">
                <MoneyInput
                  label={`Other Deductions (Optional, ${salaryPeriod === "yearly" ? "Yearly" : "Monthly"} ₹)`}
                  value={formValues.otherDeductions}
                  onChange={(value) => onFieldChange("otherDeductions", value)}
                />
              </div>
              <div className="sm:col-span-2 xl:col-span-1">
                <MoneyInput
                  label={`Tax Exempt Deduction (Optional, ${salaryPeriod === "yearly" ? "Yearly" : "Monthly"} ₹)`}
                  value={formValues.taxExemptDeduction}
                  onChange={(value) => onFieldChange("taxExemptDeduction", value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardContent className="pt-0 pb-5">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="submit"
              disabled={validationErrors.length > 0}
              className="h-11 rounded-2xl border-0 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 px-6 text-white shadow-lg shadow-blue-500/30 transition-all hover:from-indigo-600 hover:via-blue-600 hover:to-cyan-600 focus-visible:ring-blue-400 disabled:opacity-60"
            >
              Calculate
            </Button>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Results update only when you click Calculate.
            </p>
          </div>
        </CardContent>
      </form>
      {validationErrors.length > 0 ? (
        <CardContent>
          <div className="rounded-2xl border border-rose-300/60 bg-rose-100/80 p-3 text-sm text-rose-700 dark:border-rose-700/60 dark:bg-rose-900/30 dark:text-rose-300">
            {validationErrors.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        </CardContent>
      ) : null}
    </Card>
  );
}
