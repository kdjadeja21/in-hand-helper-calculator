import type { TaxRegime } from "@/lib/tax-calculator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SegmentControl } from "@/components/ui/segment-control";
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
      <Label htmlFor={id} className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
        {label}
      </Label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400 font-medium pointer-events-none">₹</span>
        <Input
          id={id}
          type="text"
          inputMode="numeric"
          placeholder="0"
          value={formatInputINR(value)}
          onChange={(event) => onChange(extractDigits(event.target.value))}
          className="h-11 rounded-2xl border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900/60 pl-8"
        />
      </div>
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
      <CardHeader className="space-y-3 border-b border-zinc-200/70 pb-4 dark:border-zinc-800">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Salary Inputs
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5">
              Enter your details and calculate to compare current and projected structure.
            </CardDescription>
          </div>
          {/* Inline Controls */}
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-4 sm:items-center">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Type:</span>
              <SegmentControl
                value={salaryPeriod}
                onValueChange={(value) => onPeriodChange(value as SalaryPeriod)}
                options={[
                  { value: "monthly", label: "Monthly" },
                  { value: "yearly", label: "Yearly" },
                ]}
                className="w-auto"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Regime:</span>
              <SegmentControl
                value={taxRegime}
                onValueChange={(value) => onTaxRegimeChange(value as TaxRegime)}
                options={[
                  { value: "old", label: "Old" },
                  { value: "new", label: "New" },
                ]}
                className="w-auto"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >

        {/* Salary Inputs Section */}
        <CardContent className="py-6">
          <div className="space-y-6">
            {/* Primary Salary Fields */}
            <div>
              <p className="mb-4 text-xs font-semibold tracking-[0.12em] text-zinc-500 uppercase dark:text-zinc-400">
                Salary Inputs
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <MoneyInput
                  id="annual-ctc"
                  label="CTC"
                  value={formValues.annualCTC}
                  onChange={(value) => onFieldChange("annualCTC", value)}
                />
                <MoneyInput
                  id="gross-salary"
                  label="Gross Salary"
                  value={formValues.grossSalary}
                  onChange={(value) => onFieldChange("grossSalary", value)}
                />
              </div>
            </div>

            {/* Breakdown Fields */}
            <div className="border-t border-zinc-200/50 dark:border-zinc-800 pt-6">
              <p className="mb-4 text-xs font-semibold tracking-[0.12em] text-zinc-500 uppercase dark:text-zinc-400">
                Components
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <MoneyInput
                  label="Basic Salary"
                  value={formValues.basicValue}
                  onChange={(value) => onFieldChange("basicValue", value)}
                />
                <MoneyInput
                  label="HRA"
                  value={formValues.hraValue}
                  onChange={(value) => onFieldChange("hraValue", value)}
                />
              </div>
            </div>

            {/* Optional Fields */}
            <div className="border-t border-zinc-200/50 dark:border-zinc-800 pt-6">
              <p className="mb-4 text-xs font-semibold tracking-[0.12em] text-zinc-500 uppercase dark:text-zinc-400">
                Deductions
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <MoneyInput
                    label="Other Deductions"
                    value={formValues.otherDeductions}
                    onChange={(value) => onFieldChange("otherDeductions", value)}
                  />
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 px-1 mt-2">e.g., Employee Welfare Fund</p>
                </div>
                <div>
                  <MoneyInput
                    label="Tax Exempt Deduction"
                    value={formValues.taxExemptDeduction}
                    onChange={(value) => onFieldChange("taxExemptDeduction", value)}
                  />
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 px-1 mt-2">e.g., Food Coupons, Fuel, Driver Salary</p>
                </div>
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
