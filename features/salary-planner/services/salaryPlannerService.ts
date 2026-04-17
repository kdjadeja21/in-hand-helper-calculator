import { calculateSalaryBreakdown, type TaxRegime } from "@/lib/tax-calculator";

export interface SalaryBreakdownRequest {
  annualCTC: number;
  grossMonthlySalary: number;
  basicAmount: number;
  hraAmount: number;
  otherDeductionsMonthly: number;
  taxExemptDeductionMonthly?: number;
  taxRegime: TaxRegime;
}

export type SalaryBreakdownService = (request: SalaryBreakdownRequest) => ReturnType<
  typeof calculateSalaryBreakdown
>;

export const defaultSalaryBreakdownService: SalaryBreakdownService = (request) =>
  calculateSalaryBreakdown(request);
