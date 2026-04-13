export type TaxRegime = "old" | "new";

export interface SalaryCalculatorInput {
  annualCTC: number;
  grossMonthlySalary: number;
  basicAmount: number;
  hraAmount: number;
  otherDeductionsMonthly: number;
  taxRegime: TaxRegime;
}

export interface SalaryCalculatorResult {
  grossMonthlySalary: number;
  basic: number;
  hra: number;
  specialAllowance: number;
  pf: number;
  professionalTax: number;
  incomeTax: number;
  otherDeductions: number;
  totalDeductions: number;
  netInHand: number;
}

const PROFESSIONAL_TAX_MONTHLY = 200;
const OLD_STANDARD_DEDUCTION = 50000;
const NEW_STANDARD_DEDUCTION = 75000;

function roundAmount(value: number): number {
  return Math.round(value);
}

function calculateOldRegimeTax(taxableIncome: number): number {
  if (taxableIncome <= 250000) return 0;

  let tax = 0;
  tax += Math.min(Math.max(taxableIncome - 250000, 0), 250000) * 0.05;
  tax += Math.min(Math.max(taxableIncome - 500000, 0), 500000) * 0.2;
  tax += Math.max(taxableIncome - 1000000, 0) * 0.3;

  if (taxableIncome <= 500000) tax = 0;

  tax *= 1.04;
  return roundAmount(tax);
}

function calculateNewRegimeTax(taxableIncome: number): number {
  if (taxableIncome <= 400000) return 0;

  let tax = 0;
  tax += Math.min(Math.max(taxableIncome - 400000, 0), 400000) * 0.05;
  tax += Math.min(Math.max(taxableIncome - 800000, 0), 400000) * 0.1;
  tax += Math.min(Math.max(taxableIncome - 1200000, 0), 400000) * 0.15;
  tax += Math.min(Math.max(taxableIncome - 1600000, 0), 400000) * 0.2;
  tax += Math.min(Math.max(taxableIncome - 2000000, 0), 400000) * 0.25;
  tax += Math.max(taxableIncome - 2400000, 0) * 0.3;

  if (taxableIncome <= 1200000) {
    tax = 0;
  } else if (taxableIncome <= 1275000) {
    tax = Math.min(tax, taxableIncome - 1200000);
  }

  tax *= 1.04;
  return roundAmount(tax);
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateSalaryBreakdown(
  input: SalaryCalculatorInput
): SalaryCalculatorResult {
  const grossMonthlySalary = Math.max(0, input.grossMonthlySalary);
  const basic = Math.max(0, input.basicAmount);
  const hra = Math.max(0, input.hraAmount);
  const otherDeductions = Math.max(0, input.otherDeductionsMonthly);

  const specialAllowance = Math.max(0, grossMonthlySalary - (basic + hra));
  const pf = basic * 0.12;
  const professionalTax = PROFESSIONAL_TAX_MONTHLY;

  const annualGross = grossMonthlySalary * 12;
  const annualPF = pf * 12;
  const taxableIncome =
    input.taxRegime === "old"
      ? Math.max(0, annualGross - OLD_STANDARD_DEDUCTION - Math.min(annualPF, 150000))
      : Math.max(0, annualGross - NEW_STANDARD_DEDUCTION);
  const annualIncomeTax =
    input.taxRegime === "old"
      ? calculateOldRegimeTax(taxableIncome)
      : calculateNewRegimeTax(taxableIncome);
  const incomeTax = annualIncomeTax / 12;
  const totalDeductions = pf + professionalTax + incomeTax + otherDeductions;
  const netInHand = grossMonthlySalary - totalDeductions;

  return {
    grossMonthlySalary: roundAmount(grossMonthlySalary),
    basic: roundAmount(basic),
    hra: roundAmount(hra),
    specialAllowance: roundAmount(specialAllowance),
    pf: roundAmount(pf),
    professionalTax: roundAmount(professionalTax),
    incomeTax: roundAmount(incomeTax),
    otherDeductions: roundAmount(otherDeductions),
    totalDeductions: roundAmount(totalDeductions),
    netInHand: roundAmount(netInHand),
  };
}
