import type { SalaryCalculatorResult, TaxRegime } from "@/lib/tax-calculator";

export type SalaryPeriod = "monthly" | "yearly";

export interface SalaryFormValues {
  annualCTC: string;
  grossSalary: string;
  basicValue: string;
  hraValue: string;
  otherDeductions: string;
}

export interface SubmittedInputs {
  normalizedAnnualCTC: number;
  normalizedGrossMonthly: number;
  basicValue: number;
  hraValue: number;
  otherDeductionsMonthly: number;
  taxRegime: TaxRegime;
}

export interface ComparisonRow {
  label: string;
  before: number;
  after: number;
}

export interface SalaryPlannerComputedData {
  result: SalaryCalculatorResult;
  projectedResult: SalaryCalculatorResult;
  projectedOldRegimeResult: SalaryCalculatorResult;
  projectedNewRegimeResult: SalaryCalculatorResult;
  netDifference: number;
  inHandDifference: number;
  isNewRegimeBetter: boolean;
  isOldRegimeBetter: boolean;
  earningsRows: ComparisonRow[];
  deductionRows: ComparisonRow[];
  atAGlanceRows: ComparisonRow[];
}
