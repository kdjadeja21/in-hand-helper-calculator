"use client";

import { useCountUp } from "@/features/salary-planner/hooks/useCountUp";
import { JustInHandSection } from "@/features/salary-planner/components/JustInHandSection";
import { KeyDifferencesCard } from "@/features/salary-planner/components/KeyDifferencesCard";
import { NetInHandCard } from "@/features/salary-planner/components/NetInHandCard";
import { PageHeader } from "@/features/salary-planner/components/PageHeader";
import { PrivacyFooter } from "@/features/salary-planner/components/PrivacyFooter";
import { SalaryComparisonCard } from "@/features/salary-planner/components/SalaryComparisonCard";
import { SalaryInputCard } from "@/features/salary-planner/components/SalaryInputCard";
import { TaxExemptDeductionComparisonCard } from "@/features/salary-planner/components/TaxExemptDeductionComparisonCard";
import { TaxRegimeComparisonCard } from "@/features/salary-planner/components/TaxRegimeComparisonCard";
import { useSalaryPlanner } from "@/features/salary-planner/hooks/useSalaryPlanner";

export default function Home() {
  const {
    projectionsSectionRef,
    salaryPeriod,
    taxRegime,
    justInHandView,
    formValues,
    validationErrors,
    computedData,
    setField,
    setTaxRegime,
    setJustInHandView,
    togglePeriod,
    calculate,
  } = useSalaryPlanner();

  const projectedNetDisplay = useCountUp(computedData.projectedResult.netInHand);
  const currentNetDisplay = useCountUp(computedData.result.netInHand);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.14),transparent_38%),linear-gradient(to_bottom,_#f7f8fb,_#edf2ff)] px-4 py-6 dark:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.2),transparent_36%),linear-gradient(to_bottom,_#09090b,_#111827)] sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <PageHeader />
        <SalaryInputCard
          salaryPeriod={salaryPeriod}
          taxRegime={taxRegime}
          justInHandView={justInHandView}
          formValues={formValues}
          validationErrors={validationErrors}
          onSubmit={calculate}
          onFieldChange={setField}
          onTaxRegimeChange={setTaxRegime}
          onPeriodChange={togglePeriod}
          onJustInHandViewChange={setJustInHandView}
        />
        <section ref={projectionsSectionRef} className="grid gap-5">
          {justInHandView ? (
            <JustInHandSection
              currentNetDisplay={currentNetDisplay}
              hasTaxExemptDeduction={computedData.hasTaxExemptDeduction}
              result={computedData.result}
              taxRegime={taxRegime}
              currentOldRegimeResult={computedData.currentOldRegimeResult}
              currentNewRegimeResult={computedData.currentNewRegimeResult}
              isCurrentOldRegimeBetter={computedData.isCurrentOldRegimeBetter}
              isCurrentNewRegimeBetter={computedData.isCurrentNewRegimeBetter}
            />
          ) : (
            <>
              <div className="grid gap-5 xl:grid-cols-2">
                <NetInHandCard
                  projectedNetDisplay={projectedNetDisplay}
                  currentNetDisplay={currentNetDisplay}
                  netDifference={computedData.netDifference}
                />
                <TaxRegimeComparisonCard
                  oldResult={computedData.projectedOldRegimeResult}
                  newResult={computedData.projectedNewRegimeResult}
                  isOldRegimeBetter={computedData.isOldRegimeBetter}
                  isNewRegimeBetter={computedData.isNewRegimeBetter}
                />
              </div>
              {computedData.hasTaxExemptDeduction ? (
                <TaxExemptDeductionComparisonCard
                  withoutDeductionResult={computedData.projectedWithoutTaxExemptResult}
                  withDeductionResult={computedData.projectedWithTaxExemptResult}
                  savingsMonthly={computedData.taxExemptSavingsMonthly}
                />
              ) : null}
              <SalaryComparisonCard
                result={computedData.result}
                projectedResult={computedData.projectedResult}
                earningsRows={computedData.earningsRows}
                deductionRows={computedData.deductionRows}
              />
              <KeyDifferencesCard rows={computedData.atAGlanceRows} />
            </>
          )}
        </section>
        <PrivacyFooter />
      </div>
    </main>
  );
}
