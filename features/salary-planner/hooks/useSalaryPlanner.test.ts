import { act, renderHook } from "@testing-library/react";
import { useSalaryPlanner } from "@/features/salary-planner/hooks/useSalaryPlanner";

describe("useSalaryPlanner", () => {
  it("keeps results stable until calculate is invoked", () => {
    const { result } = renderHook(() => useSalaryPlanner());

    expect(result.current.computedData.result.grossMonthlySalary).toBe(100000);

    act(() => {
      result.current.setField("grossSalary", "200000");
    });

    expect(result.current.computedData.result.grossMonthlySalary).toBe(100000);

    act(() => {
      result.current.calculate();
    });

    expect(result.current.computedData.result.grossMonthlySalary).toBe(200000);
  });
});
