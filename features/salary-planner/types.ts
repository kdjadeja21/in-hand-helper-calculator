import type { SalaryCalculatorResult, TaxRegime } from "@/lib/tax-calculator";

export type SalaryPeriod = "monthly" | "yearly";

export interface SalaryFormValues {
  annualCTC: string;
  grossSalary: string;
  basicValue: string;
  hraValue: string;
  otherDeductions: string;
  taxExemptDeduction: string;
}

export interface SubmittedInputs {
  normalizedAnnualCTC: number;
  normalizedGrossMonthly: number;
  basicValue: number;
  hraValue: number;
  otherDeductionsMonthly: number;
  taxExemptDeductionMonthly: number;
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
  projectedWithoutTaxExemptResult: SalaryCalculatorResult;
  projectedWithTaxExemptResult: SalaryCalculatorResult;
  hasTaxExemptDeduction: boolean;
  netDifference: number;
  inHandDifference: number;
  taxExemptSavingsMonthly: number;
  isNewRegimeBetter: boolean;
  isOldRegimeBetter: boolean;
  earningsRows: ComparisonRow[];
  deductionRows: ComparisonRow[];
  atAGlanceRows: ComparisonRow[];
}
