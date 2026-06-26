import { fireEvent, render, screen } from "@testing-library/react";
import { SalaryInputCard } from "@/features/salary-planner/components/SalaryInputCard";

describe("SalaryInputCard", () => {
  it("submits and forwards sanitized input values", () => {
    const onSubmit = vi.fn();
    const onFieldChange = vi.fn();
    const onTaxRegimeChange = vi.fn();
    const onPeriodChange = vi.fn();

    render(
      <SalaryInputCard
        salaryPeriod="monthly"
        taxRegime="new"
        justInHandView={false}
        validationErrors={[]}
        formValues={{
          annualCTC: "100000",
          grossSalary: "100000",
          basicValue: "40000",
          hraValue: "20000",
          otherDeductions: "",
          taxExemptDeduction: "",
        }}
        onSubmit={onSubmit}
        onFieldChange={onFieldChange}
        onTaxRegimeChange={onTaxRegimeChange}
        onPeriodChange={onPeriodChange}
        onJustInHandViewChange={vi.fn()}
      />
    );

    fireEvent.change(screen.getByLabelText("Gross Salary"), {
      target: { value: "12,34x" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Calculate" }));

    expect(onFieldChange).toHaveBeenCalledWith("grossSalary", "1234");
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
