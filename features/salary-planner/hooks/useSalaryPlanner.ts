"use client";

import { useMemo, useRef, useState } from "react";
import type { TaxRegime } from "@/lib/tax-calculator";
import {
  defaultSalaryBreakdownService,
  type SalaryBreakdownService,
} from "@/features/salary-planner/services/salaryPlannerService";
import { parseAmount } from "@/features/salary-planner/utils/currency";
import type {
  SalaryFormValues,
  SalaryPeriod,
  SalaryPlannerComputedData,
  SubmittedInputs,
} from "@/features/salary-planner/types";

const initialFormValues: SalaryFormValues = {
  annualCTC: "100000",
  grossSalary: "100000",
  basicValue: "40000",
  hraValue: "20000",
  otherDeductions: "",
  taxExemptDeduction: "",
};

const initialSubmittedInputs: SubmittedInputs = {
  normalizedAnnualCTC: 1200000,
  normalizedGrossMonthly: 100000,
  basicValue: 40000,
  hraValue: 20000,
  otherDeductionsMonthly: 0,
  taxExemptDeductionMonthly: 0,
  taxRegime: "new",
};

interface UseSalaryPlannerOptions {
  salaryBreakdownService?: SalaryBreakdownService;
}

export function useSalaryPlanner(options?: UseSalaryPlannerOptions) {
  const salaryBreakdownService = options?.salaryBreakdownService ?? defaultSalaryBreakdownService;
  const projectionsSectionRef = useRef<HTMLElement | null>(null);
  const [salaryPeriod, setSalaryPeriod] = useState<SalaryPeriod>("monthly");
  const [taxRegime, setTaxRegime] = useState<TaxRegime>("new");
  const [formValues, setFormValues] = useState<SalaryFormValues>(initialFormValues);
  const [submittedInputs, setSubmittedInputs] = useState<SubmittedInputs>(initialSubmittedInputs);

  const annualCTCNumber = parseAmount(formValues.annualCTC);
  const grossSalaryNumber = parseAmount(formValues.grossSalary);
  const basicValueNumber = parseAmount(formValues.basicValue);
  const hraValueNumber = parseAmount(formValues.hraValue);
  const otherDeductionsNumber = parseAmount(formValues.otherDeductions);
  const taxExemptDeductionNumber = parseAmount(formValues.taxExemptDeduction);

  const normalizedAnnualCTC =
    salaryPeriod === "yearly" ? annualCTCNumber : annualCTCNumber * 12;
  const normalizedGrossMonthly =
    salaryPeriod === "yearly" ? grossSalaryNumber / 12 : grossSalaryNumber;
  const basicMonthly = salaryPeriod === "yearly" ? basicValueNumber / 12 : basicValueNumber;
  const hraMonthly = salaryPeriod === "yearly" ? hraValueNumber / 12 : hraValueNumber;
  const otherDeductionsMonthly =
    salaryPeriod === "yearly" ? otherDeductionsNumber / 12 : otherDeductionsNumber;

  const validationErrors = useMemo(() => {
    const errors: string[] = [];

    if (normalizedAnnualCTC <= 0) errors.push("CTC must be greater than 0.");
    if (normalizedGrossMonthly <= 0) errors.push("Gross salary must be greater than 0.");
    if (basicValueNumber < 0) errors.push("Basic salary cannot be negative.");
    if (hraValueNumber < 0) errors.push("HRA cannot be negative.");
    if (otherDeductionsNumber < 0) errors.push("Other deductions cannot be negative.");
    if (taxExemptDeductionNumber < 0) errors.push("Tax exempt deduction cannot be negative.");
    if (basicMonthly + hraMonthly > normalizedGrossMonthly) {
      errors.push("Basic + HRA is greater than gross monthly salary.");
    }

    return errors;
  }, [
    basicMonthly,
    basicValueNumber,
    hraMonthly,
    hraValueNumber,
    normalizedAnnualCTC,
    normalizedGrossMonthly,
    otherDeductionsNumber,
    taxExemptDeductionNumber,
  ]);

  const result = useMemo(
    () =>
      salaryBreakdownService({
        annualCTC: submittedInputs.normalizedAnnualCTC,
        grossMonthlySalary: submittedInputs.normalizedGrossMonthly,
        basicAmount: submittedInputs.basicValue,
        hraAmount: submittedInputs.hraValue,
        otherDeductionsMonthly: submittedInputs.otherDeductionsMonthly,
        taxExemptDeductionMonthly: submittedInputs.taxExemptDeductionMonthly,
        taxRegime: submittedInputs.taxRegime,
      }),
    [salaryBreakdownService, submittedInputs]
  );

  const projectedResult = useMemo(() => {
    const monthlyGross = result.grossMonthlySalary;
    const enforcedBasic = Math.max(result.basic, monthlyGross * 0.5);
    const projectedHra = Math.max(result.hra, enforcedBasic * 0.5);

    return salaryBreakdownService({
      annualCTC: submittedInputs.normalizedAnnualCTC,
      grossMonthlySalary: monthlyGross,
      basicAmount: enforcedBasic,
      hraAmount: projectedHra,
      otherDeductionsMonthly: submittedInputs.otherDeductionsMonthly,
      taxExemptDeductionMonthly: submittedInputs.taxExemptDeductionMonthly,
      taxRegime: submittedInputs.taxRegime,
    });
  }, [result, salaryBreakdownService, submittedInputs]);

  const projectedOldRegimeResult = useMemo(
    () =>
      salaryBreakdownService({
        annualCTC: submittedInputs.normalizedAnnualCTC,
        grossMonthlySalary: projectedResult.grossMonthlySalary,
        basicAmount: projectedResult.basic,
        hraAmount: projectedResult.hra,
        otherDeductionsMonthly: submittedInputs.otherDeductionsMonthly,
        taxExemptDeductionMonthly: submittedInputs.taxExemptDeductionMonthly,
        taxRegime: "old",
      }),
    [projectedResult, salaryBreakdownService, submittedInputs]
  );

  const projectedNewRegimeResult = useMemo(
    () =>
      salaryBreakdownService({
        annualCTC: submittedInputs.normalizedAnnualCTC,
        grossMonthlySalary: projectedResult.grossMonthlySalary,
        basicAmount: projectedResult.basic,
        hraAmount: projectedResult.hra,
        otherDeductionsMonthly: submittedInputs.otherDeductionsMonthly,
        taxExemptDeductionMonthly: submittedInputs.taxExemptDeductionMonthly,
        taxRegime: "new",
      }),
    [projectedResult, salaryBreakdownService, submittedInputs]
  );

  const projectedWithoutTaxExemptResult = useMemo(
    () =>
      salaryBreakdownService({
        annualCTC: submittedInputs.normalizedAnnualCTC,
        grossMonthlySalary: projectedResult.grossMonthlySalary,
        basicAmount: projectedResult.basic,
        hraAmount: projectedResult.hra,
        otherDeductionsMonthly: submittedInputs.otherDeductionsMonthly,
        taxExemptDeductionMonthly: 0,
        taxRegime: submittedInputs.taxRegime,
      }),
    [projectedResult, salaryBreakdownService, submittedInputs]
  );

  const projectedWithTaxExemptResult = useMemo(
    () =>
      salaryBreakdownService({
        annualCTC: submittedInputs.normalizedAnnualCTC,
        grossMonthlySalary: projectedResult.grossMonthlySalary,
        basicAmount: projectedResult.basic,
        hraAmount: projectedResult.hra,
        otherDeductionsMonthly: submittedInputs.otherDeductionsMonthly,
        taxExemptDeductionMonthly: submittedInputs.taxExemptDeductionMonthly,
        taxRegime: submittedInputs.taxRegime,
      }),
    [projectedResult, salaryBreakdownService, submittedInputs]
  );

  const computedData: SalaryPlannerComputedData = useMemo(() => {
    const netDifference = projectedResult.netInHand - result.netInHand;
    const inHandDifference = projectedNewRegimeResult.netInHand - projectedOldRegimeResult.netInHand;
    const taxExemptSavingsMonthly =
      projectedWithTaxExemptResult.netInHand - projectedWithoutTaxExemptResult.netInHand;

    return {
      result,
      projectedResult,
      projectedOldRegimeResult,
      projectedNewRegimeResult,
      projectedWithoutTaxExemptResult,
      projectedWithTaxExemptResult,
      hasTaxExemptDeduction: submittedInputs.taxExemptDeductionMonthly > 0,
      netDifference,
      inHandDifference,
      taxExemptSavingsMonthly,
      isNewRegimeBetter: inHandDifference > 0,
      isOldRegimeBetter: inHandDifference < 0,
      earningsRows: [
        { label: "Basic Salary", before: result.basic, after: projectedResult.basic },
        { label: "HRA", before: result.hra, after: projectedResult.hra },
        {
          label: "Special Allowance",
          before: result.specialAllowance,
          after: projectedResult.specialAllowance,
        },
      ],
      deductionRows: [
        { label: "PF (Employee 12%)", before: result.pf, after: projectedResult.pf },
        {
          label: "Professional Tax",
          before: result.professionalTax,
          after: projectedResult.professionalTax,
        },
        {
          label: `Income Tax (${taxRegime === "new" ? "New" : "Old"})`,
          before: result.incomeTax,
          after: projectedResult.incomeTax,
        },
        {
          label: "Other Deductions",
          before: result.otherDeductions,
          after: projectedResult.otherDeductions,
        },
      ],
      atAGlanceRows: [
        { label: "Basic Salary", before: result.basic, after: projectedResult.basic },
        { label: "Employee PF", before: result.pf, after: projectedResult.pf },
        { label: "Income Tax (TDS)", before: result.incomeTax, after: projectedResult.incomeTax },
        { label: "Net In-Hand", before: result.netInHand, after: projectedResult.netInHand },
      ],
    };
  }, [
    projectedNewRegimeResult,
    projectedOldRegimeResult,
    projectedResult,
    projectedWithTaxExemptResult,
    projectedWithoutTaxExemptResult,
    result,
    taxRegime,
  ]);

  const setField = (field: keyof SalaryFormValues, value: string) => {
    setFormValues((current) => ({ ...current, [field]: value }));
  };

  const togglePeriod = (nextPeriod: SalaryPeriod) => {
    if (nextPeriod === salaryPeriod) return;
    const factor = nextPeriod === "yearly" ? 12 : 1 / 12;

    setSalaryPeriod(nextPeriod);
    setFormValues((current) => ({
      annualCTC: String(Math.round(Math.max(0, parseAmount(current.annualCTC) * factor))),
      grossSalary: String(Math.round(Math.max(0, parseAmount(current.grossSalary) * factor))),
      basicValue: String(Math.round(Math.max(0, parseAmount(current.basicValue) * factor))),
      hraValue: String(Math.round(Math.max(0, parseAmount(current.hraValue) * factor))),
      otherDeductions: current.otherDeductions
        ? String(Math.round(Math.max(0, parseAmount(current.otherDeductions) * factor)))
        : "",
      taxExemptDeduction: current.taxExemptDeduction
        ? String(Math.round(Math.max(0, parseAmount(current.taxExemptDeduction) * factor)))
        : "",
    }));
  };

  const calculate = () => {
    if (validationErrors.length > 0) return;

    setSubmittedInputs({
      normalizedAnnualCTC: Math.max(0, normalizedAnnualCTC),
      normalizedGrossMonthly: Math.max(0, normalizedGrossMonthly),
      basicValue: Math.max(0, basicMonthly),
      hraValue: Math.max(0, hraMonthly),
      otherDeductionsMonthly: Math.max(0, otherDeductionsMonthly),
      taxExemptDeductionMonthly:
        salaryPeriod === "yearly"
          ? Math.max(0, taxExemptDeductionNumber / 12)
          : Math.max(0, taxExemptDeductionNumber),
      taxRegime,
    });

    requestAnimationFrame(() => {
      projectionsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return {
    projectionsSectionRef,
    salaryPeriod,
    taxRegime,
    formValues,
    validationErrors,
    computedData,
    setField,
    setTaxRegime,
    togglePeriod,
    calculate,
  };
}
