"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Calculator, Wallet } from "lucide-react";
import {
  calculateSalaryBreakdown,
  formatINR,
  type TaxRegime,
} from "@/lib/tax-calculator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

function parseAmount(value: string): number {
  const parsed = Number(value.replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatInputINR(value: string): string {
  if (!value) return "";
  const numeric = Number(value.replace(/[^\d]/g, ""));
  if (!Number.isFinite(numeric) || numeric <= 0) return "";
  return new Intl.NumberFormat("en-IN").format(numeric);
}

function extractDigits(value: string): string {
  return value.replace(/[^\d]/g, "");
}

function useCountUp(value: number, duration = 550): number {
  const [displayValue, setDisplayValue] = useState(value);
  const previousValue = useRef(value);

  useEffect(() => {
    const start = previousValue.current;
    const end = value;

    if (start === end) return;

    const startTime = performance.now();
    let frameId = 0;

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const nextValue = start + (end - start) * eased;
      setDisplayValue(nextValue);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        previousValue.current = end;
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [duration, value]);

  return Math.round(displayValue);
}

type SalaryPeriod = "monthly" | "yearly";

export default function Home() {
  const projectionsSectionRef = useRef<HTMLElement | null>(null);
  const [salaryPeriod, setSalaryPeriod] = useState<SalaryPeriod>("monthly");
  const [annualCTC, setAnnualCTC] = useState("100000");
  const [grossSalary, setGrossSalary] = useState("100000");
  const [basicValue, setBasicValue] = useState("40000");
  const [hraValue, setHraValue] = useState("20000");
  const [otherDeductions, setOtherDeductions] = useState("");
  const [taxRegime, setTaxRegime] = useState<TaxRegime>("new");
  const [submittedInputs, setSubmittedInputs] = useState({
    normalizedAnnualCTC: 1200000,
    normalizedGrossMonthly: 100000,
    basicValue: 40000,
    hraValue: 20000,
    otherDeductionsMonthly: 0,
    taxRegime: "new" as TaxRegime,
  });

  const annualCTCNumber = parseAmount(annualCTC);
  const grossSalaryNumber = parseAmount(grossSalary);
  const basicValueNumber = parseAmount(basicValue);
  const hraValueNumber = parseAmount(hraValue);
  const otherDeductionsNumber = parseAmount(otherDeductions);

  const normalizedAnnualCTC =
    salaryPeriod === "yearly" ? annualCTCNumber : annualCTCNumber * 12;
  const normalizedGrossMonthly =
    salaryPeriod === "yearly" ? grossSalaryNumber / 12 : grossSalaryNumber;
  const otherDeductionsMonthly =
    salaryPeriod === "yearly" ? otherDeductionsNumber / 12 : otherDeductionsNumber;

  const handleCalculate = () => {
    if (validationErrors.length > 0) return;

    setSubmittedInputs({
      normalizedAnnualCTC: Math.max(0, normalizedAnnualCTC),
      normalizedGrossMonthly: Math.max(0, normalizedGrossMonthly),
      basicValue: Math.max(0, basicValueNumber),
      hraValue: Math.max(0, hraValueNumber),
      otherDeductionsMonthly: Math.max(0, otherDeductionsMonthly),
      taxRegime,
    });

    requestAnimationFrame(() => {
      projectionsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const handlePeriodToggle = (nextPeriod: SalaryPeriod) => {
    if (nextPeriod === salaryPeriod) return;
    const factor = nextPeriod === "yearly" ? 12 : 1 / 12;

    setSalaryPeriod(nextPeriod);
    setAnnualCTC(String(Math.round(Math.max(0, annualCTCNumber * factor))));
    setGrossSalary(String(Math.round(Math.max(0, grossSalaryNumber * factor))));
    setOtherDeductions(
      otherDeductions ? String(Math.round(Math.max(0, otherDeductionsNumber * factor))) : ""
    );
  };

  const validationErrors = useMemo(() => {
    const errors: string[] = [];

    if (normalizedAnnualCTC <= 0) {
      errors.push("CTC must be greater than 0.");
    }
    if (normalizedGrossMonthly <= 0) {
      errors.push("Gross salary must be greater than 0.");
    }
    if (basicValueNumber < 0) {
      errors.push("Basic salary cannot be negative.");
    }
    if (hraValueNumber < 0) {
      errors.push("HRA cannot be negative.");
    }
    if (otherDeductionsNumber < 0) {
      errors.push("Other deductions cannot be negative.");
    }

    if (basicValueNumber + hraValueNumber > normalizedGrossMonthly) {
      errors.push("Basic + HRA is greater than gross monthly salary.");
    }

    return errors;
  }, [
    normalizedAnnualCTC,
    normalizedGrossMonthly,
    basicValueNumber,
    hraValueNumber,
    otherDeductionsNumber,
  ]);

  const result = useMemo(
    () =>
      calculateSalaryBreakdown({
        annualCTC: submittedInputs.normalizedAnnualCTC,
        grossMonthlySalary: submittedInputs.normalizedGrossMonthly,
        basicAmount: submittedInputs.basicValue,
        hraAmount: submittedInputs.hraValue,
        otherDeductionsMonthly: submittedInputs.otherDeductionsMonthly,
        taxRegime: submittedInputs.taxRegime,
      }),
    [submittedInputs]
  );

  const projectedResult = useMemo(() => {
    const monthlyGross = result.grossMonthlySalary;
    const enforcedBasic = Math.max(result.basic, monthlyGross * 0.5);
    const projectedHra = Math.max(result.hra, enforcedBasic * 0.5);

    return calculateSalaryBreakdown({
      annualCTC: submittedInputs.normalizedAnnualCTC,
      grossMonthlySalary: monthlyGross,
      basicAmount: enforcedBasic,
      hraAmount: projectedHra,
      otherDeductionsMonthly: submittedInputs.otherDeductionsMonthly,
      taxRegime: submittedInputs.taxRegime,
    });
  }, [
    submittedInputs.normalizedAnnualCTC,
    submittedInputs.otherDeductionsMonthly,
    submittedInputs.taxRegime,
    result.basic,
    result.grossMonthlySalary,
    result.hra,
  ]);

  const netDifference = projectedResult.netInHand - result.netInHand;
  const netDisplay = useCountUp(projectedResult.netInHand);
  const currentNetDisplay = useCountUp(result.netInHand);
  const pfDisplay = useCountUp(projectedResult.pf);
  const taxDisplay = useCountUp(projectedResult.incomeTax);
  const richCardClass =
    "overflow-hidden rounded-3xl border border-zinc-200/70 bg-white/90 shadow-[0_22px_50px_-30px_rgba(15,23,42,0.45)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/85";
  const earningsRows = [
    {
      label: "Basic Salary",
      before: result.basic,
      after: projectedResult.basic,
    },
    {
      label: "HRA",
      before: result.hra,
      after: projectedResult.hra,
    },
    {
      label: "Special Allowance",
      before: result.specialAllowance,
      after: projectedResult.specialAllowance,
    },
  ];
  const deductionRows = [
    {
      label: "PF (Employee 12%)",
      before: result.pf,
      after: projectedResult.pf,
    },
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
  ];
  const atAGlanceRows = [
    { label: "Basic Salary", before: result.basic, after: projectedResult.basic },
    { label: "Employee PF", before: result.pf, after: projectedResult.pf },
    { label: "Income Tax (TDS)", before: result.incomeTax, after: projectedResult.incomeTax },
    { label: "Net In-Hand", before: result.netInHand, after: projectedResult.netInHand },
  ];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.14),transparent_38%),linear-gradient(to_bottom,_#f7f8fb,_#edf2ff)] px-4 py-6 dark:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.2),transparent_36%),linear-gradient(to_bottom,_#09090b,_#111827)] sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <header className="relative overflow-hidden rounded-3xl border border-zinc-200/70 bg-white/85 p-6 shadow-[0_24px_50px_-34px_rgba(30,41,59,0.65)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/75 sm:p-8">
          <div className="absolute -top-28 right-8 h-56 w-56 rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/25" />
          <div className="relative">
            <div className="flex items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold tracking-[0.12em] text-blue-700 uppercase dark:border-blue-700/50 dark:bg-blue-950/50 dark:text-blue-300">
                <Calculator className="size-3.5" aria-hidden />
                Salary Planner
              </div>
              <ThemeToggle />
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
              Salary Impact Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400 sm:text-base">
              Visualize how enforcing a 50% basic salary rule impacts your pay structure,
              deductions, and monthly in-hand salary.
            </p>
          </div>
        </header>

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
              handleCalculate();
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
                  onCheckedChange={(checked) =>
                    handlePeriodToggle(checked ? "yearly" : "monthly")
                  }
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
                      onCheckedChange={(checked) =>
                        setTaxRegime(checked ? "new" : "old")
                      }
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
                <div className="grid gap-1.5">
              <Label htmlFor="annual-ctc" className="text-sm font-medium text-zinc-500">
                CTC ({salaryPeriod === "yearly" ? "Yearly" : "Monthly"} ₹)
              </Label>
              <Input
                id="annual-ctc"
                type="text"
                inputMode="numeric"
                value={formatInputINR(annualCTC)}
                onChange={(event) => setAnnualCTC(extractDigits(event.target.value))}
                className="h-11 rounded-2xl border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900/60"
              />
            </div>

                <div className="grid gap-1.5">
              <Label htmlFor="gross-salary" className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Gross Salary ({salaryPeriod === "yearly" ? "Yearly" : "Monthly"} ₹)
              </Label>
              <Input
                id="gross-salary"
                type="text"
                inputMode="numeric"
                value={formatInputINR(grossSalary)}
                onChange={(event) => setGrossSalary(extractDigits(event.target.value))}
                className="h-11 rounded-2xl border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900/60"
              />
            </div>

                <div className="grid gap-1.5">
              <Label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Basic Salary (Amount ₹)
              </Label>
              <Input
                type="text"
                inputMode="numeric"
                value={formatInputINR(basicValue)}
                onChange={(event) => setBasicValue(extractDigits(event.target.value))}
                aria-label="Basic salary value"
                className="h-11 rounded-2xl border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900/60"
              />
            </div>

                <div className="grid gap-1.5">
              <Label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">HRA (Amount ₹)</Label>
              <Input
                type="text"
                inputMode="numeric"
                value={formatInputINR(hraValue)}
                onChange={(event) => setHraValue(extractDigits(event.target.value))}
                aria-label="HRA value"
                className="h-11 rounded-2xl border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900/60"
              />
            </div>

                <div className="grid gap-1.5 sm:col-span-2 xl:col-span-1">
              <Label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Other Deductions (Optional, {salaryPeriod === "yearly" ? "Yearly" : "Monthly"} ₹)
              </Label>
              <Input
                type="text"
                inputMode="numeric"
                value={formatInputINR(otherDeductions)}
                onChange={(event) => setOtherDeductions(extractDigits(event.target.value))}
                aria-label="Other deductions value"
                className="h-11 rounded-2xl border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900/60"
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

        <section ref={projectionsSectionRef} className="grid gap-5">
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
                {formatINR(netDisplay)}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Current net in-hand:{" "}
                <span className="font-semibold tabular-nums text-zinc-800 dark:text-zinc-100">
                  {formatINR(currentNetDisplay)}
                </span>
              </p>
              <div className="rounded-2xl border border-zinc-200/90 bg-zinc-100/80 p-4 dark:border-zinc-700 dark:bg-zinc-800/60">
                <p className="text-xs tracking-[0.14em] text-zinc-500 uppercase dark:text-zinc-400">
                  Impact
                </p>
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

        </section>

        <Card className="overflow-hidden rounded-3xl border border-emerald-200/80 bg-white/95 shadow-[0_24px_46px_-34px_rgba(16,185,129,0.58)] dark:border-emerald-900/80 dark:bg-zinc-900/90">
          <CardHeader className="space-y-1 border-b border-emerald-100/90 pb-4 dark:border-emerald-900/60">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                Salary Structure Comparison
              </CardTitle>
            </div>
            <CardDescription className="text-sm text-zinc-500 dark:text-zinc-400">
              Monthly breakdown before vs projected after applying the 50% basic salary rule.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 py-5">
            <div className="grid grid-cols-[1.5fr_1fr_1fr] items-center gap-x-3 gap-y-3 text-sm">
              <p className="text-xs font-semibold tracking-[0.12em] text-zinc-500 uppercase dark:text-zinc-400">
                Component
              </p>
              <p className="text-right text-xs font-semibold tracking-[0.12em] text-zinc-500 uppercase dark:text-zinc-400">
                Current
              </p>
              <p className="text-right text-xs font-semibold tracking-[0.12em] text-zinc-500 uppercase dark:text-zinc-400">
                Projected
              </p>

              <div className="col-span-3 mt-1">
                <p className="text-xs font-semibold tracking-[0.14em] text-emerald-700 uppercase dark:text-emerald-300">
                  Earnings
                </p>
              </div>
              {earningsRows.map((row) => {
                const difference = row.after - row.before;
                return (
                  <Fragment key={row.label}>
                    <p className="text-zinc-700 dark:text-zinc-300">{row.label}</p>
                    <p className="text-right tabular-nums text-zinc-700 dark:text-zinc-300">
                      {formatINR(row.before)}
                    </p>
                    <div className="text-right">
                      <p className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                        {formatINR(row.after)}
                      </p>
                      <p
                        className={cn(
                          "text-xs tabular-nums",
                          difference >= 0 ? "text-emerald-600" : "text-rose-600"
                        )}
                      >
                        {difference >= 0 ? "+" : ""}
                        {formatINR(difference)}
                      </p>
                    </div>
                  </Fragment>
                );
              })}

              <Separator className="col-span-3 my-1 bg-zinc-200/90 dark:bg-zinc-700/80" />

              <div className="col-span-3">
                <p className="text-xs font-semibold tracking-[0.14em] text-rose-700 uppercase dark:text-rose-300">
                  Deductions
                </p>
              </div>

              {deductionRows.map((row) => {
                const difference = row.after - row.before;
                return (
                  <Fragment key={row.label}>
                    <p className="text-zinc-700 dark:text-zinc-300">{row.label}</p>
                    <p className="text-right tabular-nums text-zinc-700 dark:text-zinc-300">
                      {formatINR(row.before)}
                    </p>
                    <div className="text-right">
                      <p className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                        {formatINR(row.after)}
                      </p>
                      <p
                        className={cn(
                          "text-xs tabular-nums",
                          difference >= 0 ? "text-emerald-600" : "text-rose-600"
                        )}
                      >
                        {difference >= 0 ? "+" : ""}
                        {formatINR(difference)}
                      </p>
                    </div>
                  </Fragment>
                );
              })}

              <Separator className="col-span-3 my-1 bg-zinc-200/90 dark:bg-zinc-700/80" />

              <p className="font-semibold text-zinc-900 dark:text-zinc-100">Gross Monthly</p>
              <p className="text-right font-semibold tabular-nums text-zinc-700 dark:text-zinc-300">
                {formatINR(result.grossMonthlySalary)}
              </p>
              <div className="text-right">
                <p className="font-semibold tabular-nums text-zinc-950 dark:text-zinc-50">
                  {formatINR(projectedResult.grossMonthlySalary)}
                </p>
                <p
                  className={cn(
                    "text-xs tabular-nums",
                    projectedResult.grossMonthlySalary - result.grossMonthlySalary >= 0
                      ? "text-emerald-600"
                      : "text-rose-600"
                  )}
                >
                  {projectedResult.grossMonthlySalary - result.grossMonthlySalary >= 0 ? "+" : ""}
                  {formatINR(projectedResult.grossMonthlySalary - result.grossMonthlySalary)}
                </p>
              </div>

              <p className="font-semibold text-zinc-900 dark:text-zinc-100">Total Deductions</p>
              <p className="text-right font-semibold tabular-nums text-zinc-700 dark:text-zinc-300">
                {formatINR(result.totalDeductions)}
              </p>
              <div className="text-right">
                <p className="font-semibold tabular-nums text-zinc-950 dark:text-zinc-50">
                  {formatINR(projectedResult.totalDeductions)}
                </p>
                <p
                  className={cn(
                    "text-xs tabular-nums",
                    projectedResult.totalDeductions - result.totalDeductions >= 0
                      ? "text-emerald-600"
                      : "text-rose-600"
                  )}
                >
                  {projectedResult.totalDeductions - result.totalDeductions >= 0 ? "+" : ""}
                  {formatINR(projectedResult.totalDeductions - result.totalDeductions)}
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-emerald-100/85 px-4 py-4 dark:bg-emerald-900/35">
              <div className="grid grid-cols-[1.5fr_1fr_1fr] items-center gap-3">
                <p className="text-xs font-semibold tracking-[0.12em] text-emerald-700 uppercase dark:text-emerald-300">
                  Net In-Hand
                </p>
                <p className="text-right text-base font-semibold tabular-nums text-emerald-700 dark:text-emerald-300">
                  {formatINR(result.netInHand)}
                </p>
                <div className="text-right">
                  <p className="text-2xl font-semibold tabular-nums text-emerald-700 dark:text-emerald-300">
                    {formatINR(projectedResult.netInHand)}
                  </p>
                  <p
                    className={cn(
                      "text-xs tabular-nums",
                      projectedResult.netInHand - result.netInHand >= 0 ? "text-emerald-700" : "text-rose-700"
                    )}
                  >
                    {projectedResult.netInHand - result.netInHand >= 0 ? "+" : ""}
                    {formatINR(projectedResult.netInHand - result.netInHand)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={richCardClass}>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Key Differences at a Glance
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {atAGlanceRows.map((row) => (
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
      </div>
    </main>
  );
}
